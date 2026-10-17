import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  Alert,
  Button,
  ConfirmDialog,
  Drawer,
  FilterBar,
  InlineQueryError,
  Input,
  SectionCard,
  SidebarNavItem,
  StatCard,
  StatusBadge,
  Table,
} from '../../src';

type RecordItem = { id: number; name: string; category: string; status: string };
const fixture: RecordItem[] = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1,
  name: `示例记录 ${index + 1}`,
  category: index % 2 ? '设计资源' : '产品资源',
  status: '待处理',
}));

// This is a fixture service, not a networking/cache abstraction. Consumers own request policy.
function delay(milliseconds: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException('Cancelled', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort);
      resolve();
    }, milliseconds);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
  });
}

/** Complete composition example. All data is synthetic; no external requests are made. */
export function RecordWorkflow() {
  const groupId = useId();
  const [expanded, setExpanded] = useState(true);
  const [view, setView] = useState('记录');
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<RecordItem[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error' | 'cancelled'>('loading');
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const [archive, setArchive] = useState<RecordItem | null>(null);
  const [notice, setNotice] = useState('');
  const request = useRef<AbortController | null>(null);
  const revision = useRef(0);
  const attempts = useRef(0);
  const archived = useRef(new Set<number>());
  const load = useCallback(async (search: string, fail = false, slow = false) => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    const current = ++revision.current;
    setQuery(search);
    setState('loading');
    try {
      await delay(slow ? 2400 : 500, controller.signal);
      if (fail) throw new Error('Synthetic service failure');
      if (current !== revision.current) return;
      setRows(
        fixture
          .filter((row) => row.name.includes(search))
          .map((row) => ({
            ...row,
            status: archived.current.has(row.id) ? '已归档' : row.status,
          })),
      );
      setState('ready');
    } catch {
      if (current === revision.current) setState(controller.signal.aborted ? 'cancelled' : 'error');
    }
  }, []);
  useEffect(() => {
    let active = true;
    // The synthetic initial service starts asynchronously; cleanup also cancels a queued start.
    queueMicrotask(() => {
      if (active) void load('');
    });
    return () => {
      active = false;
      request.current?.abort();
    };
  }, [load]);
  const startArchive = (row: RecordItem) => {
    attempts.current = 0;
    setArchive(row);
  };
  const visibleRows = view === '已归档' ? rows.filter((row) => row.status === '已归档') : rows;
  return (
    <section
      aria-label="完整记录工作流"
      style={{ display: 'grid', gap: 'var(--ec-space-4)', minWidth: 0 }}
    >
      <nav aria-label="示例导航" style={{ maxWidth: 252 }}>
        <SidebarNavItem
          label="资源工作台"
          expanded={expanded}
          aria-controls={groupId}
          onClick={() => setExpanded(!expanded)}
        />
        <div
          id={groupId}
          className="ec-sidebar-group-content"
          data-expanded={expanded}
          inert={!expanded}
          aria-hidden={!expanded}
        >
          <div className="ec-sidebar-group-content__inner">
            {['记录', '已归档'].map((label) => (
              <SidebarNavItem
                key={label}
                label={label}
                level="secondary"
                active={view === label}
                onClick={() => setView(label)}
              />
            ))}
          </div>
        </div>
      </nav>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
          gap: 'var(--ec-space-3)',
        }}
      >
        <StatCard label="当前结果" value={visibleRows.length} data-testid="workflow-stat" />
        <StatCard label="已归档" value={rows.filter((row) => row.status === '已归档').length} />
      </div>
      <SectionCard
        title="资源记录"
        description="虚构数据。确认归档的第一次请求会失败，可原地重试。"
      >
        <FilterBar
          onSearch={() => void load(draft)}
          actions={
            <>
              <Button onClick={() => void load(draft)}>查询</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setDraft('');
                  void load('');
                }}
              >
                重置筛选
              </Button>
            </>
          }
        >
          <Input
            aria-label="记录名称"
            placeholder="筛选记录名称"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        </FilterBar>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--ec-space-2)',
            marginBlock: 'var(--ec-space-3)',
          }}
        >
          <Button variant="outline" onClick={() => void load(query, true)}>
            模拟加载失败
          </Button>
          <Button variant="outline" onClick={() => void load(query, false, true)}>
            慢速刷新
          </Button>
          {state === 'loading' ? (
            <Button
              variant="outline"
              onClick={() => {
                request.current?.abort();
                setState('cancelled');
              }}
            >
              取消加载
            </Button>
          ) : null}
        </div>
        {state === 'error' ? (
          <InlineQueryError
            title="记录加载失败"
            description="虚构服务暂时不可用，重试不会重复提交归档。"
            onRetry={() => void load(query)}
          />
        ) : null}
        {state === 'cancelled' ? (
          <Alert tone="neutral" title="已取消加载">
            保留之前的结果。可以重新查询。
          </Alert>
        ) : null}
        {notice ? (
          <div role="status">
            <Alert tone="success" title={notice} />
          </div>
        ) : null}
        <Table<RecordItem>
          caption="示例资源记录"
          rowKey="id"
          minWidth={900}
          loading={state === 'loading'}
          data={visibleRows}
          columns={[
            { title: '记录名称', dataIndex: 'name' },
            { title: '类别', dataIndex: 'category' },
            {
              title: '状态',
              key: 'status',
              render: (_, row) => (
                <StatusBadge tone={row.status === '已归档' ? 'success' : 'info'}>
                  {row.status}
                </StatusBadge>
              ),
            },
            {
              title: '操作',
              key: 'actions',
              pinned: 'right',
              width: 170,
              render: (_, row) => (
                <div style={{ display: 'flex', gap: 'var(--ec-space-2)' }}>
                  <Button
                    size="sm"
                    variant="outline"
                    aria-label={`查看${row.name}`}
                    onClick={() => setSelected(row)}
                  >
                    详情
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    aria-label={`归档${row.name}`}
                    disabled={row.status === '已归档'}
                    onClick={() => startArchive(row)}
                  >
                    归档
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </SectionCard>
      <Drawer
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={selected?.name}
        description="示例记录详情"
        size="min(92vw, 440px)"
        closeLabel="关闭详情"
      >
        <p>{selected?.category}</p>
        <p>详情、筛选和确认均复用已有组件；业务权限和数据请求由应用负责。</p>
      </Drawer>
      <ConfirmDialog
        open={Boolean(archive)}
        onOpenChange={(open) => {
          if (!open) setArchive(null);
        }}
        title={`归档${archive?.name ?? ''}？`}
        description="归档后仍可在已归档导航中查看。"
        confirmLabel="确认归档"
        cancelLabel="取消归档"
        errorMessage="归档失败，请再次确认重试。"
        onConfirm={async () => {
          const row = archive;
          if (!row) return;
          // A real mutation belongs to the app; do not automatically replay it after a timeout.
          await new Promise((resolve) => setTimeout(resolve, 650));
          if (++attempts.current === 1) throw new Error('Synthetic mutation failure');
          archived.current.add(row.id);
          setRows((previous) =>
            previous.map((item) => (item.id === row.id ? { ...item, status: '已归档' } : item)),
          );
          setNotice(`${row.name}已归档`);
        }}
      />
    </section>
  );
}
