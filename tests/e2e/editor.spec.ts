// The Java editor: indentation, brackets, highlighting, and leaving it again.
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { setTheme, waitForServiceWorker, watchProblems } from './helpers';

async function openEditor(page: Page, start = ''): Promise<void> {
  await page.goto('/#/tools/java');
  await page.getByRole('button', { name: 'Edit code' }).click();
  const content = page.locator('.cm-content');
  await content.waitFor();
  await content.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Delete');
  if (start) await page.keyboard.insertText(start);
}

const text = (page: Page) => page.locator('.cm-line').evaluateAll((lines) => lines.map((l) => (l as HTMLElement).innerText.replace(/\n$/, '')).join('\n'));

async function typeLines(page: Page, lines: string[]): Promise<void> {
  for (let i = 0; i < lines.length; i++) {
    await page.keyboard.type(lines[i]);
    if (i < lines.length - 1) await page.keyboard.press('Enter');
  }
}

test.describe('indentation', () => {
  test('a nested for and if indent as they are typed', async ({ page }) => {
    const problems = watchProblems(page);
    await openEditor(page);
    await typeLines(page, ['class A {', 'void f() {', 'for (int i = 0; i < 3; i++) {', 'if (i > 1) {', 'x++;']);
    expect(await text(page)).toBe(
      ['class A {', '    void f() {', '        for (int i = 0; i < 3; i++) {', '            if (i > 1) {', '                x++;', '            }', '        }', '    }', '}'].join('\n'),
    );
    expect(problems).toEqual([]);
  });

  test('Enter keeps the indent of a plain line', async ({ page }) => {
    await openEditor(page);
    await typeLines(page, ['class A {', 'int a;', 'int b;']);
    expect((await text(page)).split('\n').slice(1, 3)).toEqual(['    int a;', '    int b;']);
  });

  test('a closing brace typed on its own line moves back out', async ({ page }) => {
    await openEditor(page, 'class A {\n    void f() {\n        x++;');
    await page.keyboard.press('Enter');
    await page.keyboard.type('}');
    expect((await text(page)).split('\n')[3]).toBe('    }');
  });

  test('case and default sit one level in, and their bodies two', async ({ page }) => {
    await openEditor(page);
    await typeLines(page, ['switch (n) {', 'case 1:', 'x = 1;', 'break;', 'case 2:', 'x = 2;', 'break;', 'default:', 'x = 3;']);
    const lines = (await text(page)).split('\n');
    expect(lines.slice(0, 9)).toEqual(['switch (n) {', '    case 1:', '        x = 1;', '        break;', '    case 2:', '        x = 2;', '        break;', '    default:', '        x = 3;']);
  });

  test('Tab is four spaces, Shift+Tab takes them away, and both work on a selected block', async ({ page }) => {
    await openEditor(page);
    await page.keyboard.press('Tab');
    await page.keyboard.type('a');
    expect(await text(page)).toBe('    a');
    await page.keyboard.press('Shift+Tab');
    expect(await text(page)).toBe('a');

    await page.keyboard.press('Control+A');
    await page.keyboard.insertText('one\ntwo\nthree');
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Tab');
    expect(await text(page)).toBe('    one\n    two\n    three');
    await page.keyboard.press('Shift+Tab');
    expect(await text(page)).toBe('one\ntwo\nthree');
  });
});

test.describe('brackets', () => {
  test('brackets and quotes close themselves, and typing the closer steps over it', async ({ page }) => {
    await openEditor(page);
    await page.keyboard.type('f(');
    expect(await text(page)).toBe('f()');
    await page.keyboard.type(')');
    expect(await text(page)).toBe('f()');
    await page.keyboard.type(' a[');
    expect(await text(page)).toBe('f() a[]');
    await page.keyboard.press('End');
    await page.keyboard.type(' "');
    expect(await text(page)).toBe('f() a[] ""');
  });

  test('the matching bracket is marked', async ({ page }) => {
    await openEditor(page, 'class A { }');
    await page.keyboard.press('End');
    await expect(page.locator('.cm-matchingBracket')).toHaveCount(2);
  });
});

for (const theme of ['paper', 'board'] as const) {
  test(`${theme}: colours come from the tokens, read clearly, and pass axe`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await setTheme(context, theme);
    const page = await context.newPage();
    await openEditor(page, 'class A {\n    // note\n    int x = 3;\n    String s = "hi";\n}');
    for (const [cls, content] of [['keyword', 'class'], ['type', 'int'], ['number', '3'], ['string', '"hi"'], ['comment', '// note']]) {
      await expect(page.locator(`.cm-line .tok-${cls}`).first()).toHaveText(content);
    }
    const lineNumbers = await page.locator('.cm-lineNumbers .cm-gutterElement').count();
    expect(lineNumbers).toBeGreaterThanOrEqual(5);
    const { violations } = await new AxeBuilder({ page }).include('.tracer').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes[0].target.join(' ')}`)).toEqual([]);
    await context.close();
  });
}

test('the trace keeps its current line, controls and highlighting after an edit', async ({ page }) => {
  const problems = watchProblems(page);
  await openEditor(page);
  await page.keyboard.insertText('class T {\n    public static void main(String[] args) {\n        int x = 2;\n        for (int i = 0; i < 2; i++) {\n            x = x * 3;\n        }\n        System.out.println(x);\n    }\n}');
  await page.getByRole('button', { name: 'Trace', exact: true }).click();
  await expect(page.locator('.code-line[data-current="true"] .tok-type')).toHaveText('int');
  await page.getByRole('button', { name: 'Step', exact: true }).click();
  await expect(page.locator('.code-line[data-current="true"]')).toContainText('for');
  await page.getByRole('button', { name: 'Run to the end' }).click();
  await expect(page.locator('.console-pane')).toContainText('18');
  await expect(page.locator('.trace-table').first()).toBeVisible();
  expect(problems).toEqual([]);
});

test('Ctrl+Enter traces, and a program survives going back to edit it', async ({ page }) => {
  await openEditor(page, 'class T { public static void main(String[] a) { System.out.println(1); } }');
  await page.keyboard.press('Control+Enter');
  await expect(page.getByRole('button', { name: 'Edit code' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit code' }).click();
  await page.locator('.cm-content').waitFor();
  expect(await text(page)).toContain('println(1)');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Edit code' })).toBeVisible();
});

test('Esc then Tab leaves the editor, so the keyboard is never trapped', async ({ page }) => {
  await openEditor(page, 'x');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement?.classList.contains('cm-content'))).toBe(true);
  await page.keyboard.press('Escape');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement?.classList.contains('cm-content'))).toBe(false);
});

test('on a phone, the keys above the keyboard type without closing it', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 780 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await openEditor(page);
  await page.getByRole('button', { name: 'Indent', exact: true }).tap();
  await page.getByRole('button', { name: 'Type (' }).tap();
  expect(await text(page)).toBe('    ()');
  expect(await page.evaluate(() => document.activeElement?.classList.contains('cm-content'))).toBe(true);
  const box = await page.getByRole('button', { name: 'Indent', exact: true }).boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test('the editor loads only when asked for, and works with no connection', async ({ page, context }) => {
  const requests: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  await page.goto('/#/tools/java');
  await expect(page.getByRole('button', { name: 'Edit code' })).toBeVisible();
  expect(requests.some((u) => /CodeEditor/.test(u))).toBe(false);
  await waitForServiceWorker(page);
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: 'Edit code' }).click();
  await page.locator('.cm-content').click();
  await page.keyboard.type('class A {');
  await page.keyboard.press('Enter');
  await expect(page.locator('.cm-line').nth(1)).toBeVisible();
  await context.setOffline(false);
});
