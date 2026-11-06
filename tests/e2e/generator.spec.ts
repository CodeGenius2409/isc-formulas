// The generator, as a person uses it: unit practice, mock papers, the teacher's screen, printing and Word files.
import { readFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { setTheme, waitForServiceWorker, watchProblems } from './helpers';

/** Which question this is. Its id, as the words can change while a formula is still being typeset. */
const promptOf = async (item: Locator): Promise<string> => (await item.getAttribute('data-key')) ?? '';

/** The names of the files in a .docx, which is a zip. */
function zipNames(buffer: Buffer): string[] {
  const names: string[] = [];
  let end = buffer.length - 22;
  while (end >= 0 && buffer.readUInt32LE(end) !== 0x06054b50) end--;
  let at = buffer.readUInt32LE(end + 16);
  const total = buffer.readUInt16LE(end + 10);
  for (let i = 0; i < total; i++) {
    const nameLength = buffer.readUInt16LE(at + 28);
    names.push(buffer.toString('utf8', at + 46, at + 46 + nameLength));
    at += 46 + nameLength + buffer.readUInt16LE(at + 30) + buffer.readUInt16LE(at + 32);
  }
  return names;
}

/** Reads one file out of a .docx, which is a zip. */
function readZipEntry(buffer: Buffer, name: string): string {
  let end = buffer.length - 22;
  while (end >= 0 && buffer.readUInt32LE(end) !== 0x06054b50) end--;
  expect(end).toBeGreaterThanOrEqual(0);
  const count = buffer.readUInt16LE(end + 10);
  let at = buffer.readUInt32LE(end + 16);
  for (let i = 0; i < count; i++) {
    const method = buffer.readUInt16LE(at + 10);
    const size = buffer.readUInt32LE(at + 20);
    const nameLength = buffer.readUInt16LE(at + 28);
    const extra = buffer.readUInt16LE(at + 30);
    const comment = buffer.readUInt16LE(at + 32);
    const offset = buffer.readUInt32LE(at + 42);
    const fileName = buffer.toString('utf8', at + 46, at + 46 + nameLength);
    if (fileName === name) {
      const start = offset + 30 + buffer.readUInt16LE(offset + 26) + buffer.readUInt16LE(offset + 28);
      const raw = buffer.subarray(start, start + size);
      return (method === 8 ? inflateRawSync(raw) : raw).toString('utf8');
    }
    at += 46 + nameLength + extra + comment;
  }
  throw new Error(`No ${name} in the file`);
}

const setShare = (page: Page, value: number) => page.getByTestId('share-slider').locator('input[type="range"]').evaluate((el, v) => {
  const input = el as HTMLInputElement;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
  setter.call(input, String(v));
  input.dispatchEvent(new Event('input', { bubbles: true }));
}, value);

async function openGenerator(page: Page, subject = 'physics') {
  await page.goto('/#/generate');
  await expect(page.getByRole('heading', { name: 'Generate questions', exact: true })).toBeVisible();
  await page.locator('#gen-subject').selectOption(subject);
}

test.describe.configure({ timeout: 120_000 });

test('the slider snaps, moves by 5 with the keys, and says what it means', async ({ page }) => {
  const problems = watchProblems(page);
  await openGenerator(page);
  const slider = page.getByTestId('share-slider').locator('input[type="range"]');
  const message = page.getByTestId('share-message');
  await setShare(page, 0);
  await expect(message).toHaveText('Every question will come from the bank.');
  await setShare(page, 100);
  await expect(message).toHaveText(/^All 10 questions/);
  await setShare(page, 48);
  await expect(slider).toHaveValue('50');
  await setShare(page, 37);
  await expect(slider).toHaveValue('35');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveValue('40');
  await page.keyboard.press('ArrowLeft');
  await expect(slider).toHaveValue('35');
  await page.keyboard.press('PageUp');
  await expect(slider).toHaveValue('50');
  await page.keyboard.press('PageDown');
  await expect(slider).toHaveValue('25');
  await page.keyboard.press('End');
  await expect(slider).toHaveValue('100');
  await page.keyboard.press('Home');
  await expect(slider).toHaveValue('0');
  await setShare(page, 50);
  await expect(message).toHaveText('About 5 of 10 questions (10 of 20 marks) will be generated.');
  // The value comes back, and separately for each use.
  await page.reload();
  await expect(page.getByTestId('share-slider').locator('input[type="range"]')).toHaveValue('50');
  expect(await page.evaluate(() => localStorage.getItem('isc-gen-share-teacher'))).toBe('50');
  expect(problems).toEqual([]);
});

test('a question set: generated ones carry their mark, bank ones don’t, and every control works', async ({ page }) => {
  const problems = watchProblems(page);
  await openGenerator(page);
  await page.getByLabel('Class XII', { exact: true }).check();
  await setShare(page, 50);
  await page.locator('#gen-amount').fill('8');
  await page.getByRole('button', { name: 'Generate the questions' }).click();
  const items = page.getByTestId('review-item');
  await expect(items).toHaveCount(8);
  await expect(page.getByTestId('review-notice')).toContainText('not an official ISC question');
  const generated = items.filter({ has: page.getByTestId('generated-mark') });
  await expect(generated).toHaveCount(4);
  for (const item of await generated.all()) await expect(item).toHaveAttribute('data-generated', 'true');
  for (const item of await items.filter({ hasNot: page.getByTestId('generated-mark') }).all()) await expect(item).not.toHaveAttribute('data-generated', 'true');

  // Lock one, regenerate the rest.
  const first = items.first();
  const firstText = await first.innerText();
  await first.getByRole('button', { name: 'Lock', exact: true }).click();
  await expect(first).toHaveAttribute('data-locked', 'true');
  const before = await items.nth(1).innerText();
  await page.getByRole('button', { name: 'Regenerate all unlocked' }).click();
  await expect(items.nth(1)).not.toHaveText(before);
  expect((await first.innerText()).split('\n').slice(0, 3)).toEqual(firstText.split('\n').slice(0, 3));

  // Move, with the buttons a keyboard can reach.
  const secondText = await promptOf(items.nth(1));
  await page.getByRole('button', { name: 'Move question 2 up' }).focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => promptOf(items.first())).toBe(secondText);

  // Edit the wording.
  await items.nth(2).getByRole('button', { name: 'Edit wording' }).click();
  await page.getByLabel('Wording of this question').fill('My own wording of this question');
  await items.nth(2).getByRole('button', { name: 'Done' }).click();
  await expect(items.nth(2)).toContainText('My own wording of this question');

  // Delete one.
  await page.getByRole('button', { name: 'Delete question 8' }).click();
  await expect(items).toHaveCount(7);
  expect(problems).toEqual([]);
});

test('dragging reorders questions', async ({ page }) => {
  // A browser fires dragover only from the second move on, and a drop only after a dragover, so the moves are spelled out.
  await page.setViewportSize({ width: 1280, height: 2400 });
  await openGenerator(page);
  await page.locator('#gen-amount').fill('4');
  await page.getByRole('button', { name: 'Generate the questions' }).click();
  const items = page.getByTestId('review-item');
  await expect(items).toHaveCount(4);
  const lastText = await promptOf(items.nth(3));
  const grip = (await items.nth(3).locator('.gen-grip').boundingBox())!;
  const target = (await items.nth(0).boundingBox())!;
  await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2);
  await page.mouse.down();
  await page.mouse.move(target.x + 40, target.y + 30, { steps: 6 });
  await page.mouse.move(target.x + 44, target.y + 34, { steps: 2 });
  await page.mouse.up();
  await expect.poll(() => promptOf(items.first())).toBe(lastText);
});

test('a full paper follows the official structure, and Sets A, B and C differ', async ({ page }) => {
  await openGenerator(page, 'chemistry');
  await page.getByRole('button', { name: 'Full paper' }).click();
  await expect(page.getByTestId('official-structure')).toContainText('Section D');
  await setShare(page, 100);
  await page.getByRole('button', { name: 'Generate the paper' }).click();
  await expect(page.getByTestId('review-summary')).toContainText('34 questions, 70 marks');
  const firstQuestion = await page.getByTestId('review-item').first().innerText();
  await page.getByRole('button', { name: 'Make Sets A, B and C' }).click();
  await expect(page.getByRole('button', { name: 'Set C', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Set B', exact: true }).click();
  await expect(page.getByTestId('review-summary')).toContainText('34 questions, 70 marks');
  await expect(page.getByTestId('review-item').first()).not.toHaveText(firstQuestion);
});

test('a custom structure can be built', async ({ page }) => {
  await openGenerator(page);
  await page.getByRole('button', { name: 'Full paper' }).click();
  await page.getByRole('button', { name: 'Build my own' }).click();
  const custom = page.getByTestId('custom-structure');
  await custom.getByLabel('Questions').nth(0).fill('3');
  await custom.getByLabel('Marks each').nth(0).fill('2');
  await custom.getByLabel('Questions').nth(1).fill('3');
  await custom.getByLabel('Marks each').nth(1).fill('5');
  await custom.getByLabel('Attempt any (blank for all)').nth(1).fill('2');
  await page.getByRole('button', { name: 'Generate the paper' }).click();
  await expect(page.getByTestId('review-summary')).toContainText('6 questions, 16 marks');
  await expect(page.getByText('Answer any 2.').first()).toBeVisible();
});

test('it prints: marks, legend and footer, in black and white, and an answer key', async ({ page }) => {
  const problems = watchProblems(page);
  await openGenerator(page);
  await page.getByLabel('Class XII', { exact: true }).check();
  await setShare(page, 50);
  await page.locator('#gen-amount').fill('6');
  await page.getByRole('button', { name: 'Generate the questions' }).click();
  await expect(page.getByTestId('review-item')).toHaveCount(6);
  await page.locator('#head-school').fill('Riverside School');
  await page.locator('#opt-lines').fill('2');
  await page.locator('#opt-font').fill('14');
  await page.evaluate(() => {
    window.print = () => undefined;
  });
  await page.getByRole('button', { name: 'Print the paper' }).click();
  await page.emulateMedia({ media: 'print' });
  const sheet = page.getByTestId('print-sheet');
  await expect(sheet).toBeVisible();
  await expect(page.getByTestId('generator-review')).toBeHidden();
  await expect(sheet).toContainText('Riverside School');
  await expect(sheet).toHaveAttribute('style', /14pt/);
  await expect(sheet.getByTestId('print-question')).toHaveCount(6);
  await expect(sheet.getByTestId('generated-mark')).toHaveCount(3);
  await expect(sheet.locator('.gen-legend')).toContainText('not official ISC questions');
  await expect(sheet.locator('.gen-print-footer')).toContainText('may contain mistakes');
  await expect(sheet.locator('.gen-answer-line')).toHaveCount(12);
  const marked = sheet.locator('[data-generated]').first();
  await expect(marked).toHaveCSS('border-left-style', 'dotted');
  await expect(marked).toHaveCSS('border-left-color', 'rgb(0, 0, 0)');
  const pdf = await page.pdf({ format: 'A4' });
  expect(pdf.length).toBeGreaterThan(5000);
  await page.emulateMedia({ media: 'screen' });
  await page.getByRole('button', { name: 'Print the answer key' }).click();
  await page.emulateMedia({ media: 'print' });
  await expect(sheet).toHaveAttribute('data-kind', 'key');
  await expect(sheet).toContainText('answer key and marking scheme');
  await expect(sheet.locator('.gen-legend')).toContainText('Check the answers before use');
  expect(problems).toEqual([]);
});

test('a bank-only paper has no mark, legend or footer', async ({ page }) => {
  await openGenerator(page);
  await page.getByLabel('Class XII', { exact: true }).check();
  await setShare(page, 0);
  await page.locator('#gen-amount').fill('5');
  await page.getByRole('button', { name: 'Generate the questions' }).click();
  await expect(page.getByTestId('review-item')).toHaveCount(5);
  await expect(page.getByTestId('generated-mark')).toHaveCount(0);
  await expect(page.getByTestId('review-notice')).toHaveCount(0);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.gen-print-footer')).toHaveCount(0);
});

test('Word files open, and match the paper on screen', async ({ page }, info) => {
  await openGenerator(page);
  await page.getByLabel('Class XII', { exact: true }).check();
  await setShare(page, 50);
  await page.locator('#gen-amount').fill('6');
  await page.getByRole('button', { name: 'Generate the questions' }).click();
  await expect(page.getByTestId('review-item')).toHaveCount(6);
  await page.locator('#head-school').fill('Riverside School');
  await page.locator('#head-exam').fill('Term test');
  const save = async (name: string) => {
    const waiting = page.waitForEvent('download');
    await page.getByRole('button', { name }).click();
    const download = await waiting;
    const path = info.outputPath(download.suggestedFilename());
    await download.saveAs(path);
    return { name: download.suggestedFilename(), data: readFileSync(path) };
  };
  const paper = await save('Word: the paper');
  expect(paper.name).toBe('Term-test.docx');
  expect(paper.data.subarray(0, 2).toString()).toBe('PK');
  const xml = readZipEntry(paper.data, 'word/document.xml');
  expect(xml).toContain('Riverside School');
  expect(xml).toContain('Term test');
  expect((xml.match(/\(Generated\)/g) ?? []).length).toBe(3);
  const footer = readZipEntry(paper.data, 'word/footer1.xml');
  expect(footer).toContain('may contain mistakes');
  // Every question on screen is in the file: its first few words, away from any maths.
  for (const item of await page.getByTestId('review-item').all()) {
    const words = (await item.locator('.bank-prompt .rich-text').first().innerText()).replace(/\s+/g, ' ').slice(0, 14);
    if (/^[A-Za-z ,]+$/.test(words)) expect(xml).toContain(words);
  }
  const key = await save('Word: the answer key');
  expect(key.name).toBe('Term-test-answer-key.docx');
  expect(readZipEntry(key.data, 'word/document.xml')).toContain('answer key and marking scheme');
});

test('a paper saves, reopens, exports and imports', async ({ page }, info) => {
  await openGenerator(page);
  await page.locator('#gen-amount').fill('3');
  await page.getByRole('button', { name: 'Generate the questions' }).click();
  await expect(page.getByTestId('review-item')).toHaveCount(3);
  const text = await promptOf(page.getByTestId('review-item').first());
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByText('Saved on this device.')).toBeVisible();
  const waiting = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export as a file' }).click();
  const path = info.outputPath('paper.json');
  await (await waiting).saveAs(path);
  await page.getByRole('button', { name: '← Change the choices' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Open', exact: true }).first().click();
  await expect(page.getByTestId('review-item')).toHaveCount(3);
  await expect.poll(() => promptOf(page.getByTestId('review-item').first())).toBe(text);
  await page.getByRole('button', { name: '← Change the choices' }).click();
  await page.getByTestId('paper-file').setInputFiles(path);
  await expect.poll(() => promptOf(page.getByTestId('review-item').first())).toBe(text);
});

test('a Word file draws a compound that a question asks about', async ({ page }, info) => {
  await openGenerator(page, 'chemistry');
  await page.locator('#gen-amount').fill('30');
  await page.getByLabel('Multiple choice', { exact: true }).check();
  await setShare(page, 100);
  await page.getByRole('button', { name: 'Generate the questions' }).click();
  await expect(page.getByTestId('review-item').first()).toBeVisible();
  const drawn = page.getByTestId('review-item').filter({ has: page.locator('svg.molecule') });
  const count = await drawn.count();
  const waiting = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Word: the paper' }).click();
  const path = info.outputPath('with-compounds.docx');
  await (await waiting).saveAs(path);
  const images = zipNames(readFileSync(path)).filter((n) => n.startsWith('word/media/'));
  // Other questions may have figures too, so the file holds at least one picture for each compound on the screen.
  expect(images.length).toBeGreaterThanOrEqual(count);
  expect(count).toBeGreaterThan(0);
});

test('presets remember the choices, and "don’t reuse" keeps out saved questions', async ({ page }) => {
  await openGenerator(page);
  await page.getByLabel('Multiple choice', { exact: true }).check();
  await page.locator('#preset-name').fill('Quick MCQs');
  await page.getByRole('button', { name: 'Save preset' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Use Quick MCQs' }).click();
  await expect(page.getByLabel('Multiple choice', { exact: true })).toBeChecked();
});

test('mock paper: off uses only the bank, on shows the slider, and generated questions are marked', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/#/paper');
  await page.locator('#paper-subject').selectOption('physics');
  await page.locator('#paper-class').selectOption('XII');
  const toggle = page.getByLabel('Use generated questions');
  await expect(toggle).not.toBeChecked();
  await expect(page.getByTestId('share-slider')).toHaveCount(0);
  await toggle.check();
  await setShare(page, 50);
  await expect(page.getByTestId('share-message')).toContainText('will be generated');
  await page.getByRole('button', { name: 'Start the paper' }).click();
  await expect(page.getByRole('heading', { name: /Physics XII, 70 marks/ })).toBeVisible();
  await expect(page.getByTestId('paper-legend')).toContainText('not official ISC questions');
  const marked = await page.locator('.paper-question').filter({ has: page.getByTestId('generated-mark') }).count();
  const total = await page.locator('.paper-question').count();
  expect(total).toBe(33);
  expect(Math.abs(marked - 16.5)).toBeLessThanOrEqual(2);
  for (const q of await page.locator('.paper-question').filter({ hasNot: page.getByTestId('generated-mark') }).all()) await expect(q).not.toHaveAttribute('data-generated', 'true');
  // In print, the legend and marks stay.
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByTestId('paper-legend')).toBeVisible();
  await expect(page.locator('.paper-question[data-generated]').first()).toHaveCSS('border-left-style', 'dotted');
  await page.emulateMedia({ media: 'screen' });
  await page.getByRole('button', { name: 'Abandon this paper' }).click();
  await toggle.uncheck();
  await page.getByRole('button', { name: 'Start the paper' }).click();
  await expect(page.locator('.paper-question')).toHaveCount(33);
  await expect(page.getByTestId('generated-mark')).toHaveCount(0);
  await expect(page.getByTestId('paper-legend')).toHaveCount(0);
  expect(problems).toEqual([]);
});

test('the same seed reopens the same paper from a link', async ({ page }) => {
  const read = () => page.locator('.paper-question').evaluateAll((list) => list.map((q) => q.querySelector('.bank-prompt')?.textContent ?? ''));
  await page.goto('/#/paper?subject=chemistry&level=XII&seed=12345&share=50');
  await page.getByRole('button', { name: 'Open the linked paper' }).click();
  await expect(page.locator('.paper-question')).toHaveCount(34);
  const first = await read();
  await page.getByRole('button', { name: 'Abandon this paper' }).click();
  await page.getByRole('button', { name: 'Open the linked paper' }).click();
  await expect(page.locator('.paper-question')).toHaveCount(34);
  expect(await read()).toEqual(first);
});

test('unit practice mixes in generated questions, which go on to mistakes and review', async ({ page }) => {
  const problems = watchProblems(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/book/physics/XII/5?work=practice');
  const work = page.locator('.work');
  await work.getByText('Practice settings').click();
  await setShare(page, 100);
  await expect(work.getByTestId('share-message')).toHaveText('About 8 of 8 exam-style questions will be generated.');
  await work.getByRole('button', { name: 'Practise this unit' }).click();
  await expect(work.getByTestId('generated-mark')).toBeVisible();
  await expect(work.getByText('What does Generated mean?')).toBeVisible();
  await expect(work.locator('.bank-body[data-generated]')).toHaveCSS('border-left-style', 'dotted');
  // Report a problem.
  await work.getByRole('button', { name: 'Report a problem' }).click();
  await work.getByLabel('What’s wrong with this question?').fill('The numbers look odd');
  await work.getByRole('button', { name: 'Save report' }).click();
  await expect(work.getByText('Saved on this device.')).toBeVisible();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('isc-question-reports') ?? '[]') as { comment: string; seed: number; blueprint: string }[]);
  expect(stored[0].comment).toBe('The numbers look odd');
  expect(stored[0].seed).toEqual(expect.any(Number));
  expect(stored[0].blueprint).toContain('p12-');
  // A wrong answer lands in the mistakes list, with its mark.
  const options = work.locator('.choice');
  const answered = await options.first().isVisible().catch(() => false);
  if (answered) {
    const count = await options.count();
    for (let i = 0; i < count; i++) {
      await options.nth(i).click();
      break;
    }
  } else {
    await work.getByRole('button', { name: /Show the marking scheme|Check answer/ }).click();
    const save = work.getByRole('button', { name: /Save my mark/ });
    if (await save.isVisible().catch(() => false)) await save.click();
  }
  await page.evaluate(() => {
    location.hash = '#/practice';
  });
  await expect(page.getByRole('heading', { name: 'Progress', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export reports' })).toBeVisible();
  const mistakes = await page.evaluate(() => JSON.parse(localStorage.getItem('isc-mistakes') ?? '[]') as { formulaId: string }[]);
  if (mistakes.length) await expect(page.getByTestId('generated-mark').first()).toBeVisible();
  const srs = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('isc-srs') ?? '{}') as Record<string, unknown>));
  expect(srs.some((id) => id.startsWith('g-p12-'))).toBe(true);
  // Review rebuilds it from its id.
  await page.reload();
  await page.evaluate(() => {
    location.hash = '#/book/physics/XII/5?work=practice';
  });
  expect(problems).toEqual([]);
});

test('a generated question opens from a link', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/practice?q=g-p12-5a-em-ratio-42');
  await expect(page.locator('.work').getByTestId('generated-mark')).toBeVisible();
  await expect(page.locator('.work')).toContainText('electric field amplitude');
});

test('figures draw from the question’s numbers, enlarge, and work with the simulator after answering', async ({ page }) => {
  const problems = watchProblems(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  // A projectile question: figure, then a simulator with its results hidden until answered.
  await page.goto('/#/practice?q=g-p11-2b-projectile-7');
  const work = page.locator('.work');
  const figure = work.locator('.diagram-button');
  await expect(figure).toBeVisible();
  const asked = await work.locator('.rich-text').first().innerText();
  const speed = /at (\d+) m\/s/.exec(asked)![1];
  await expect(figure.locator('svg')).toHaveAttribute('aria-label', new RegExp(`launched at ${speed} m/s`));
  await figure.click();
  await expect(page.locator('dialog.diagram-zoom')).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await work.getByRole('button', { name: 'Try this set-up in the simulator' }).click();
  await expect(work.getByTestId('readouts-hidden').first()).toBeVisible();
  await expect(work.locator('.readouts')).toHaveCount(0);
  await work.getByLabel('Your answer').first().fill('1');
  await work.getByRole('button', { name: 'Check answer' }).click();
  await expect(work.locator('.readouts').first()).toBeVisible();
  await expect(work.getByTestId('readouts-hidden')).toHaveCount(0);
  await expect(work.getByRole('button', { name: 'Show in simulator' })).toBeVisible();
  // The full-size link carries the same values.
  await expect(work.getByRole('link', { name: 'Open full size' })).toHaveAttribute('href', new RegExp(`tools/projectile\\?speed=${speed}`));
  expect(problems).toEqual([]);
});

test('a lens simulator stays closed until the question is answered, as it would show the image', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/practice?q=g-p12-6a-lens-image-3');
  const work = page.locator('.work');
  await expect(work.locator('.diagram-button')).toBeVisible();
  await expect(work.getByTestId('sim-panel')).toHaveCount(0);
  await work.getByLabel('Your answer').first().fill('10');
  await work.getByRole('button', { name: 'Check answer' }).click();
  await expect(work.getByRole('button', { name: 'Show in simulator' })).toBeVisible();
});

test('the generator works with no connection', async ({ page, context }) => {
  await page.goto('/');
  await waitForServiceWorker(page);
  await context.setOffline(true);
  await page.reload();
  const problems = watchProblems(page);
  await openGenerator(page, 'computerscience');
  await setShare(page, 100);
  await page.locator('#gen-amount').fill('5');
  await page.getByRole('button', { name: 'Generate the questions' }).click();
  await expect(page.getByTestId('review-item')).toHaveCount(5);
  const waiting = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Word: the paper' }).click();
  await waiting;
  await context.setOffline(false);
  expect(problems.filter((p) => !p.includes('ERR_INTERNET_DISCONNECTED'))).toEqual([]);
});

for (const { width, height, touch } of [{ width: 375, height: 780, touch: true }, { width: 768, height: 1024, touch: true }, { width: 1024, height: 768, touch: true }, { width: 1440, height: 900, touch: false }]) {
  for (const theme of ['paper', 'board'] as const) {
    test(`${width}px ${theme}: the generator and figures fit, with no errors`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width, height }, hasTouch: touch, reducedMotion: 'reduce' });
      await setTheme(context, theme);
      const page = await context.newPage();
      const problems = watchProblems(page);
      const fits = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth && document.querySelector('main')!.scrollWidth <= document.querySelector('main')!.clientWidth);
      await openGenerator(page);
      expect(await fits()).toBe(true);
      await page.screenshot({ path: `test-screens/generator-${width}-${theme}.png`, fullPage: false });
      if (touch) {
        const small = await page.evaluate(() => {
          const main = document.querySelector('main')!;
          return [...main.querySelectorAll('button, select, input:not([type="checkbox"]):not([type="file"]), summary, a.btn')]
            .map((el) => ({ label: el.textContent?.trim().slice(0, 40) || el.id, height: el.getBoundingClientRect().height }))
            .filter((x) => x.height > 0 && x.height < 43.5);
        });
        expect(small).toEqual([]);
      }
      await page.getByLabel('Class XII', { exact: true }).check();
      await setShare(page, 100);
      await page.locator('#gen-amount').fill('8');
      await page.getByRole('button', { name: 'Generate the questions' }).click();
      await expect(page.getByTestId('review-item')).toHaveCount(8);
      expect(await fits()).toBe(true);
      await page.screenshot({ path: `test-screens/generator-review-${width}-${theme}.png`, fullPage: false });
      expect(problems).toEqual([]);
      await context.close();
    });
  }
}

for (const theme of ['paper', 'board'] as const) {
  test(`${theme}: the generator passes axe`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await setTheme(context, theme);
    const page = await context.newPage();
    const scan = async () => {
      const { violations } = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes[0].target.join(' ')}`)).toEqual([]);
    };
    await openGenerator(page);
    await scan();
    await page.getByLabel('Class XII', { exact: true }).check();
    await setShare(page, 50);
    await page.locator('#gen-amount').fill('6');
    await page.getByRole('button', { name: 'Generate the questions' }).click();
    await expect(page.getByTestId('review-item')).toHaveCount(6);
    await scan();
    await context.close();
  });
}
