import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const MAX_LOG_BYTES = 1024 * 1024;
const failed = new Set(['failure', 'timed_out', 'startup_failure', 'action_required']);
const terminal = new Set([...failed, 'success', 'cancelled', 'skipped', 'neutral']);
const text = (value, max = 300) => typeof value === 'string' ? [...value.replace(/[\u0000-\u001f]/g, ' ').trim()].slice(0, max).join('') : '';
const commitText = value => typeof value === 'string' ? [...value.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b-\u001f]/g, '').trim()].slice(0, 1000).join('') : '';
const instant = value => typeof value === 'string' && Number.isFinite(Date.parse(value)) ? Date.parse(value) : undefined;
const numericId = value => /^[1-9][0-9]*$/.test(String(value));

export function runEvidence(run, jobs, result) {
  // Measure execution only. The first job's started_at excludes time spent
  // waiting for a runner, while the last completed job bounds parallel work.
  const completed = jobs.filter(j =>
    terminal.has(j.conclusion) &&
    instant(j.started_at) !== undefined &&
    instant(j.completed_at) !== undefined
  );
  const starts = completed.map(j => instant(j.started_at));
  const start = starts.length ? Math.min(...starts) : undefined;
  const ends = completed.map(j => instant(j.completed_at));
  const end = ends.length ? Math.max(...ends) : undefined;
  const durationSeconds = start !== undefined && end !== undefined && end >= start
    ? Math.floor((end - start) / 1000) : undefined;
  const created = instant(run?.created_at);
  const queueSeconds = created !== undefined && start !== undefined && start >= created
    ? Math.floor((start - created) / 1000) : undefined;
  const failures = completed.filter(j => failed.has(j.conclusion));
  const cancelled = completed.filter(j => j.conclusion === 'cancelled');
  const affected = (failures.length ? failures : result === 'cancelled' ? cancelled : []).slice(0, 5);
  const stage = affected.map(job => {
    const steps = (job.steps ?? []).filter(s => failed.has(s.conclusion) || s.conclusion === 'cancelled');
    return `${text(job.name)}${steps.length ? ` → ${steps.slice(0, 3).map(s => text(s.name)).join('、')}` : ''}`;
  }).join('；');
  return { queueSeconds, durationSeconds, stage: stage || undefined, affected };
}

// Keep a short, bounded excerpt of the failed step so the card explains what
// actually broke. GitHub already masks repository secrets in job logs.
export function failureExcerpt(log) {
  const clean = String(log ?? '').replace(/\x1b\[[0-9;]*m/g, '').replace(/\r/g, '');
  const lines = clean.split('\n').map(line => line.trim()).filter(Boolean);
  const signals = lines.filter(line =>
    /(?:^|\b)(?:error|Error|ERROR|fatal|Fatal|Exception|##\[error\])/.test(line) ||
    /^(?:FAIL|FAILED|Failure)\b/.test(line) ||
    /\bcategory=[a-z-]+/.test(line)
  );
  const chosen = signals.slice(-3).join('\n');
  return [...chosen].slice(0, 600).join('') || undefined;
}

async function readBounded(response, limit) {
  if (!response.body) return '';
  const reader = response.body.getReader();
  const chunks = []; let bytes = 0;
  try {
    while (bytes < limit) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = value.subarray(0, limit - bytes);
      chunks.push(Buffer.from(chunk)); bytes += chunk.length;
    }
  } finally { await reader.cancel(); }
  return Buffer.concat(chunks).toString('utf8');
}

export function githubClient(token, request = fetch) {
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  async function json(path) {
    const response = await request(`https://api.github.com/${path}`, { headers, signal: AbortSignal.timeout(12000), redirect: 'error' });
    if (!response.ok) throw new Error(`GitHub metadata HTTP ${response.status}`);
    return JSON.parse(await readBounded(response, 4 * 1024 * 1024));
  }
  async function log(repository, job) {
    if (!numericId(job.id)) return '';
    const response = await request(`https://api.github.com/repos/${repository}/actions/jobs/${job.id}/logs`,
      { headers, signal: AbortSignal.timeout(12000), redirect: 'manual' });
    if (response.status === 200) return readBounded(response, MAX_LOG_BYTES);
    if (response.status !== 302) return '';
    const location = new URL(response.headers.get('location'));
    if (location.protocol !== 'https:' || location.username || location.password ||
        !(location.hostname.endsWith('.blob.core.windows.net') || location.hostname.endsWith('.actions.githubusercontent.com'))) return '';
    // Signed storage URL receives no GitHub token. A range request avoids
    // downloading an entire build log; even ignored ranges are capped in memory.
    const content = await request(location, { headers: { Range: `bytes=-${MAX_LOG_BYTES}` }, signal: AbortSignal.timeout(12000), redirect: 'error' });
    return content.ok ? readBounded(content, MAX_LOG_BYTES) : '';
  }
  return { json, log };
}

export async function collectPayload(config, event, api) {
  const { repository, kind, title, result, sourceSha = '', runId, runAttempt, environment = '', targetUrl = '' } = config;
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) throw new Error('Invalid repository');
  if (!['deploy', 'ci', 'code', 'merge'].includes(kind)) throw new Error('Invalid notification kind');
  if (!['success', 'failure', 'cancelled'].includes(result)) throw new Error('Unsupported notification result');
  if (!text(title)) throw new Error('Notification title is required');
  const sha = kind === 'merge' ? event.pull_request?.merge_commit_sha : sourceSha;
  if (!/^[0-9a-f]{40}$/.test(sha ?? '') && !(kind !== 'merge' && result !== 'success' && !sha)) throw new Error('Invalid source SHA');
  const options = { title: text(title), status: result, category: kind === 'deploy' ? 'deploy' : kind === 'ci' ? 'ci' : 'code',
    repository, environment: text(environment) || undefined, targetUrl: targetUrl || undefined,
    commit: sha || undefined, commitUrl: sha ? `https://github.com/${repository}/commit/${sha}` : undefined };
  if (kind === 'merge') {
    const pr = event.pull_request;
    if (!numericId(pr?.number) || !pr?.merged || pr.head?.repo?.full_name !== repository || pr.base?.repo?.full_name !== repository) throw new Error('Untrusted or unmerged PR');
    Object.assign(options, { branch: text(pr.base.ref), commitMessage: text(pr.title, 1000),
      targetUrl: `https://github.com/${repository}/pull/${pr.number}`, summary: `PR #${pr.number} · ${text(pr.user?.login)}`,
      extraFields: [{ label: '合并请求', value: `[#${pr.number}](https://github.com/${repository}/pull/${pr.number})` }] });
  } else {
    if (!numericId(runId) || !numericId(runAttempt)) throw new Error('Invalid run identity');
    options.runUrl = `https://github.com/${repository}/actions/runs/${runId}/attempts/${runAttempt}`;
    let run; let jobs = [];
    try {
      run = await api.json(`repos/${repository}/actions/runs/${runId}/attempts/${runAttempt}`);
      if (String(run.id) !== String(runId) || Number(run.run_attempt) !== Number(runAttempt) || run.repository?.full_name !== repository) throw new Error('Run identity mismatch');
      for (let page = 1; page <= 10; page++) {
        const data = await api.json(`repos/${repository}/actions/runs/${runId}/attempts/${runAttempt}/jobs?per_page=100&page=${page}`);
        if (!Array.isArray(data.jobs)) throw new Error('Invalid jobs response');
        jobs.push(...data.jobs.filter(j => String(j.run_id) === String(runId) && Number(j.run_attempt) === Number(runAttempt)));
        if (data.jobs.length < 100) break;
        if (page === 10) throw new Error('Job pagination limit exceeded');
      }
      const evidence = runEvidence(run, jobs, result);
      Object.assign(options, {
        branch: text(run.head_branch),
        queueSeconds: evidence.queueSeconds,
        durationSeconds: evidence.durationSeconds,
        extraFields: [
          ...(evidence.queueSeconds !== undefined
            ? [{ label: '排队耗时', value: `${evidence.queueSeconds} 秒` }]
            : []),
          ...(evidence.durationSeconds !== undefined
            ? [{ label: '运行耗时', value: `${evidence.durationSeconds} 秒` }]
            : []),
        ],
        stage: evidence.stage,
      });
      if (result !== 'success') {
        const hints = [];
        for (const job of evidence.affected.slice(0, 3)) {
          if (job.conclusion === 'timed_out') hints.push('任务执行超时，请查看运行记录。');
          else if (job.conclusion === 'startup_failure') hints.push('任务启动失败，请查看运行记录。');
          else if (job.conclusion === 'action_required') hints.push('任务需要人工处理，请查看运行记录。');
          else if (job.conclusion === 'failure') {
            try { const hint = failureExcerpt(await api.log(repository, job)); if (hint) hints.push(hint); } catch { /* Details are optional; never dump an exception containing a signed URL. */ }
          }
        }
        options.failureReason = [...new Set(hints)].join('\n') || (result === 'cancelled'
          ? '运行已取消，请查看运行记录。'
          : '步骤执行失败，请查看运行记录。');
      }
    } catch {
      // Notification must survive a failed checkout, unavailable job metadata or
      // restricted Actions permissions, without inventing duration or cause.
      options.failureReason = result === 'success' ? undefined : '无法读取运行详情，请查看运行记录。';
      options.summary = '运行详情暂不可用';
    }
    if (sha) {
      try {
        const commit = await api.json(`repos/${repository}/commits/${sha}`);
        if (commit.sha !== sha) throw new Error('Commit identity mismatch');
        Object.assign(options, { commitMessage: commitText(commit.commit?.message),
          commitAuthor: text(commit.commit?.author?.name), commitTime: commit.commit?.author?.date });
      } catch { /* Commit lookup cannot suppress a failure notification. */ }
    }
  }
  return { project: 'webDev', generator: kind === 'deploy' ? 'sendGithubActionDeployNotification' : 'sendGithubActionCodeNotification', options: [options] };
}

export async function main(env = process.env, request = fetch) {
  if (!env.MSG_API_KEY) { console.log('MSG_API_KEY is not configured; notification skipped'); return; }
  const delivery = env.NOTIFY_DELIVERY_ENVIRONMENT || 'production';
  if (!['production', 'playground'].includes(delivery)) throw new Error('Invalid delivery environment');
  if (Boolean(env.NOTIFY_RUN_ID) !== Boolean(env.NOTIFY_RUN_ATTEMPT)) throw new Error('Source run and attempt must be supplied together');
  const payload = await collectPayload({ repository: env.GITHUB_REPOSITORY, kind: env.NOTIFY_KIND,
    title: env.NOTIFY_TITLE, result: env.NOTIFY_RESULT, sourceSha: env.NOTIFY_SOURCE_SHA,
    runId: env.NOTIFY_RUN_ID || env.GITHUB_RUN_ID, runAttempt: env.NOTIFY_RUN_ATTEMPT || env.GITHUB_RUN_ATTEMPT,
    environment: env.NOTIFY_ENVIRONMENT, targetUrl: env.NOTIFY_TARGET_URL },
  JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8')), githubClient(env.GH_TOKEN, request));
  const endpoint = `https://msg-api.easecation.net/${delivery === 'playground' ? 'playground/' : ''}sendmsg`;
  // No retry: an ambiguous response must not duplicate a delivered message.
  const response = await request(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Api-Key': env.MSG_API_KEY },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(20000), redirect: 'error' });
  if (!response.ok) throw new Error(`Notification delivery HTTP ${response.status}`);
  const receipt = JSON.parse(await readBounded(response, 64 * 1024));
  if (receipt.code !== 0 || receipt.data?.skipped === true) throw new Error('MsgAPI did not confirm delivery');
  console.log('MsgAPI returned a successful delivery receipt (code=0)');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => { console.error('Notification failed; inspect the workflow and MsgAPI delivery records. No automatic resend was attempted.'); process.exitCode = 1; });
}
