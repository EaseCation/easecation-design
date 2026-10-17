/* global document, getComputedStyle, window */
import assert from 'node:assert/strict';

// Reused by the library fixture and the website against the same generated example.
export async function checkRecordWorkflow(page) {
  const workflow = page.getByRole('region', { name: '完整记录工作流', exact: true });
  await workflow.getByRole('button', { name: '查看示例记录 1', exact: true }).waitFor();
  const errors = [];
  const recordError = (error) => errors.push(error.message);
  page.on('pageerror', recordError);
  try {
    const group = workflow.locator('.ec-sidebar-group-content');
    const trigger = workflow.getByRole('button', { name: '资源工作台', exact: true });
    await trigger.click();
    assert.equal(await group.getAttribute('inert'), '');
    await page.waitForFunction(
      () => document.querySelector('.ec-sidebar-group-content').getBoundingClientRect().height < 1,
    );
    await trigger.press('Enter');
    await page.waitForFunction(
      () => document.querySelector('.ec-sidebar-group-content').getBoundingClientRect().height > 30,
    );
    assert.notEqual(
      await group.evaluate((node) => getComputedStyle(node).transitionDuration),
      '0s',
    );
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await trigger.click();
    await page.waitForFunction(
      () => document.querySelector('.ec-sidebar-group-content').getBoundingClientRect().height < 1,
    );
    assert.ok(
      (await group.evaluate((node) => getComputedStyle(node).transitionDuration))
        .split(',')
        .every((part) => parseFloat(part) <= 0.001),
    );
    await trigger.click();
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    const stat = workflow.getByTestId('workflow-stat');
    const geometry = await stat.evaluate((node) => {
      const label = node.querySelector('.ec-stat-card__label').getBoundingClientRect();
      const value = node.querySelector('.ec-stat-card__value').getBoundingClientRect();
      return {
        label: label.x,
        value: value.x,
        right: value.right,
        outerRight: node.getBoundingClientRect().right,
      };
    });
    assert.ok(
      Math.abs(geometry.label - geometry.value) < 1,
      'Stat value aligns with label without a blank aside column',
    );
    assert.ok(
      geometry.outerRight - geometry.right < 36,
      'Stat value uses the available card width',
    );

    const input = workflow.getByRole('textbox', { name: '记录名称' });
    await workflow.getByRole('button', { name: '慢速刷新', exact: true }).click();
    await input.fill('示例记录 18');
    await input.press('Enter');
    await workflow.getByRole('button', { name: '查看示例记录 18', exact: true }).waitFor();
    assert.equal(
      await workflow.getByRole('button', { name: '查看示例记录 1', exact: true }).count(),
      0,
      'Superseded request cannot replace newer filtered results',
    );
    await workflow.getByRole('button', { name: '慢速刷新', exact: true }).click();
    await workflow.getByRole('button', { name: '取消加载', exact: true }).click();
    await workflow.getByText('已取消加载', { exact: true }).waitFor();
    assert.equal(
      await workflow.getByRole('button', { name: '查看示例记录 18', exact: true }).count(),
      1,
      'Cancelled refresh preserves the previous result',
    );
    await workflow.getByRole('button', { name: '模拟加载失败', exact: true }).click();
    await workflow.getByText('记录加载失败', { exact: true }).waitFor();
    await workflow.getByRole('button', { name: /重试/ }).click();
    await workflow.getByText('记录加载失败', { exact: true }).waitFor({ state: 'detached' });
    await input.fill('不存在的记录');
    await input.press('Enter');
    await page.waitForFunction(
      () => !document.querySelector('.ec-data-table')?.getAttribute('aria-busy'),
    );
    await workflow
      .getByRole('button', { name: '查看示例记录 18', exact: true })
      .waitFor({ state: 'detached' });
    await workflow.getByRole('button', { name: '重置筛选', exact: true }).click();
    const details = workflow.getByRole('button', { name: '查看示例记录 1', exact: true });
    await details.click();
    await page.getByRole('dialog', { name: '示例记录 1', exact: true }).waitFor();
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    await page.waitForFunction(
      () => document.activeElement?.getAttribute('aria-label') === '查看示例记录 1',
    );
    assert.equal(
      await details.evaluate((node) => node === document.activeElement),
      true,
      'Drawer restores focus',
    );

    const archive = workflow.getByRole('button', { name: '归档示例记录 1', exact: true });
    await archive.click();
    await page.getByRole('button', { name: '取消归档', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    await page.waitForFunction(
      () => document.activeElement?.getAttribute('aria-label') === '归档示例记录 1',
    );
    assert.equal(
      await archive.evaluate((node) => node === document.activeElement),
      true,
      'Cancel restores focus',
    );
    await archive.click();
    const confirm = page.getByRole('button', { name: '确认归档', exact: true });
    await confirm.click();
    assert.equal(
      await page.getByRole('button', { name: '取消归档', exact: true }).isDisabled(),
      true,
      'Pending confirmation locks dismissal',
    );
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').count(), 1);
    await page.getByText('归档失败，请再次确认重试。', { exact: true }).waitFor();
    await confirm.click();
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    await workflow.getByText('示例记录 1已归档', { exact: true }).waitFor();
    assert.equal(await archive.isDisabled(), true);
    await workflow.getByRole('button', { name: '已归档', exact: true }).click();
    assert.equal(await workflow.getByRole('button', { name: /^查看示例记录/ }).count(), 1);
    await workflow.getByRole('button', { name: '记录', exact: true }).click();

    // Native wheel gestures check both axes through a populated table.
    const scroller = workflow.locator('.ec-data-table-scroll');
    await workflow
      .getByRole('button', { name: '查看示例记录 5', exact: true })
      .scrollIntoViewIfNeeded();
    await scroller.getByText('示例记录 5', { exact: true }).hover();
    const horizontal = await scroller.evaluate((node) => node.scrollWidth > node.clientWidth);
    if (horizontal) {
      await page.mouse.wheel(180, 0);
      await page.waitForFunction(
        () => document.querySelector('.ec-data-table-scroll').scrollLeft > 0,
      );
    }
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 160);
    await page.waitForFunction((previous) => window.scrollY > previous, before);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1),
      false,
      'No page overflow',
    );
    assert.deepEqual(errors, []);
  } finally {
    page.off('pageerror', recordError);
  }
}
