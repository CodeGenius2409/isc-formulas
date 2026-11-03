// Your own formulas, from the editor to the book and back. Each test gets its own empty browser storage.
import fs from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { setTheme, waitForServiceWorker, watchProblems } from './helpers';

async function typeLatex(page: Page, latex: string) {
  await page.getByRole('button', { name: 'LaTeX', exact: true }).click();
  await page.locator('textarea.field').fill(latex);
}

interface Details {
  latex?: string;
  name?: string;
  note?: string;
  section?: string;
  newSection?: string;
  from?: string;
}

/** Fills in the editor and saves, ending on the page that shows the new formula. */
async function addFormula(page: Page, { latex = 'k=\\frac{a}{b}', name = 'My ratio', note, section, newSection, from = '/#/mine/new?subject=physics&level=XI&unit=2' }: Details = {}) {
  await page.goto(from);
  await expect(page.getByRole('heading', { name: 'Add a formula' })).toBeVisible();
  await typeLatex(page, latex);
  await page.getByLabel('Name', { exact: true }).fill(name);
  if (note) await page.getByLabel(/^Note/).fill(note);
  await page.getByRole('button', { name: 'Next: where it goes' }).click();
  if (section) await page.locator('#custom-section').selectOption(section);
  if (newSection) {
    await page.locator('#custom-section').selectOption('__new__');
    await page.locator('#custom-new-section').fill(newSection);
  }
  await page.getByRole('button', { name: 'Save formula' }).click();
  await expect(page.locator('.row[data-custom]').filter({ hasText: name }).first()).toBeVisible();
}

const myRow = (page: Page, name: string) => page.locator('.row[data-custom]').filter({ hasText: name }).first();

test('create, then reload: it is still there, in place, and looks like yours', async ({ page }) => {
  const problems = watchProblems(page);
  await addFormula(page, { note: 'Handy for lenses' });
  const row = myRow(page, 'My ratio');
  await expect(row).toContainText('Your formula');
  await expect(row).toContainText('Handy for lenses');
  await expect(row.locator('.row-pen')).toBeVisible();
  await expect(row).toHaveAttribute('data-flash', 'true');
  expect(page.url()).toContain('book/physics/XI/1');
  await page.reload();
  await expect(myRow(page, 'My ratio')).toBeVisible();
  await page.goto('/#/mine');
  await expect(page.getByRole('heading', { name: 'Your formulas', exact: true })).toBeVisible();
  await expect(myRow(page, 'My ratio')).toBeVisible();
  expect(problems).toEqual([]);
});

test('it goes in the chapter and section chosen, including a new section', async ({ page }) => {
  await addFormula(page, { name: 'In the second section', from: '/#/mine/new?subject=chemistry&level=XII&unit=3' });
  expect(page.url()).toContain('book/chemistry/XII/2');
  const section = page.locator('.section-head h2').first();
  await expect(section).toBeVisible();
  await addFormula(page, { name: 'In my own section', newSection: 'My exam notes', from: '/#/mine/new?subject=chemistry&level=XII&unit=3' });
  const head = page.locator('.section-head').filter({ hasText: 'My exam notes' });
  await expect(head).toBeVisible();
  await expect(head.locator('.row-pen')).toBeVisible();
  // It joins the contents too, and the choice is offered next time.
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.toc-sub').filter({ hasText: 'My exam notes' })).toBeVisible();
  await page.goto('/#/mine/new?subject=chemistry&level=XII&unit=3');
  await typeLatex(page, 'x');
  await page.getByLabel('Name', { exact: true }).fill('x');
  await page.getByRole('button', { name: 'Next: where it goes' }).click();
  await expect(page.locator('#custom-section option', { hasText: 'My exam notes' })).toHaveCount(1);
});

test('Add a formula from a section starts with that section chosen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/book/physics/XI/1');
  const head = page.locator('.section-head').first();
  const sectionName = (await head.locator('h2').textContent())!.replace(/\d+$/, '').trim();
  await head.getByRole('link', { name: /Add a formula/ }).click();
  await typeLatex(page, 'y=x');
  await page.getByLabel('Name', { exact: true }).fill('From the section');
  await page.getByRole('button', { name: 'Next: where it goes' }).click();
  await expect(page.locator('#custom-subject')).toHaveValue('physics');
  await expect(page.locator('#custom-class')).toHaveValue('XI');
  await expect(page.locator('#custom-unit')).toHaveValue('2');
  await expect(page.locator('#custom-section')).toHaveValue(sectionName);
});

test('edit, delete with its own confirmation, then undo', async ({ page }) => {
  const problems = watchProblems(page);
  await addFormula(page);
  await page.getByRole('link', { name: 'Edit My ratio' }).click();
  await expect(page.getByRole('heading', { name: 'Edit your formula' })).toBeVisible();
  await page.getByLabel('Name', { exact: true }).fill('My better ratio');
  await page.getByRole('button', { name: 'Next: where it goes' }).click();
  await page.getByRole('button', { name: 'Save changes' }).click();
  const row = myRow(page, 'My better ratio');
  await expect(row).toBeVisible();

  // Saved and practised references go with it, and come back with Undo.
  await row.getByRole('button', { name: 'Save My better ratio' }).click();
  await page.goto('/#/saved');
  await expect(myRow(page, 'My better ratio')).toBeVisible();

  let dialogs = 0;
  page.on('dialog', () => {
    dialogs++;
  });
  await myRow(page, 'My better ratio').getByRole('button', { name: 'Delete My better ratio' }).click();
  const confirm = page.getByRole('group', { name: 'Delete My better ratio?' });
  await confirm.getByRole('button', { name: 'Keep' }).click();
  await expect(myRow(page, 'My better ratio')).toBeVisible();
  await myRow(page, 'My better ratio').getByRole('button', { name: 'Delete My better ratio' }).click();
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.locator('.row[data-custom]')).toHaveCount(0);
  expect(dialogs).toBe(0);
  const favs = () => page.evaluate(() => JSON.parse(localStorage.getItem('isc-favs') ?? '[]') as string[]);
  expect((await favs()).length).toBe(0);

  await page.locator('.toast').getByRole('button', { name: 'Undo' }).click();
  await expect(myRow(page, 'My better ratio')).toBeVisible();
  expect((await favs()).length).toBe(1);

  // Deleted without undo stays deleted.
  await myRow(page, 'My better ratio').getByRole('button', { name: 'Delete My better ratio' }).click();
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.locator('.row[data-custom]')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Saved formulas', exact: true })).toBeVisible();
  await expect(page.locator('.row[data-custom]')).toHaveCount(0);
  expect(problems).toEqual([]);
});

test('built-in formulas have no edit or delete, and can\'t be edited by address', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/book/physics/XI/1');
  await expect(page.locator('.row').first()).toBeVisible();
  await expect(page.locator('.row').first().getByRole('link', { name: 'Open', exact: false }).first()).toBeAttached();
  await expect(page.getByRole('link', { name: /^Edit / })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /^Delete / })).toHaveCount(0);
  await expect(page.locator('.row[data-custom]')).toHaveCount(0);
  await page.goto('/#/mine/edit/p-xi-2-4');
  await expect(page.getByRole('heading', { name: "That formula isn't here" })).toBeVisible();
});

test('export, clear the browser, import: everything comes back, and a second import adds nothing', async ({ page }, info) => {
  await addFormula(page, { name: 'Keep me' });
  await addFormula(page, { name: 'In my section', newSection: 'Extras' });
  await page.goto('/#/practice');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save my formulas' }).click();
  const download = await downloadPromise;
  const file = info.outputPath('formulas.json');
  await download.saveAs(file);

  await page.evaluate(() => new Promise<void>((done) => {
    const close = indexedDB.deleteDatabase('isc-custom');
    close.onsuccess = close.onerror = close.onblocked = () => done();
  }));
  await page.evaluate(() => localStorage.clear());
  await page.goto('/#/mine');
  await page.reload();
  await expect(page.locator('.row[data-custom]')).toHaveCount(0);

  await page.getByTestId('custom-import').setInputFiles(file);
  await expect(page.getByText(/Formulas imported: 2 added/)).toBeVisible();
  await expect(page.locator('.row[data-custom]')).toHaveCount(2);
  await page.reload();
  await expect(myRow(page, 'Keep me')).toBeVisible();
  await page.getByTestId('custom-import').setInputFiles(file);
  await expect(page.getByText(/0 added, 0 updated, 2 already here/)).toBeVisible();
  await expect(page.locator('.row[data-custom]')).toHaveCount(2);

  // A file from somewhere else does nothing.
  const bad = info.outputPath('bad.json');
  fs.writeFileSync(bad, '{"hello":1}');
  await page.getByTestId('custom-import').setInputFiles(bad);
  await expect(page.getByText('That file is not a formulas file from this app.')).toBeVisible();
});

test('the live preview looks like the list, and LaTeX errors show in words', async ({ page }) => {
  await page.goto('/#/mine/new?subject=physics&level=XI&unit=2');
  await typeLatex(page, 'E=mc^{2}');
  await page.getByLabel('Name', { exact: true }).fill('Mass energy');
  const preview = page.getByTestId('custom-preview');
  await expect(preview.locator('.katex').first()).toBeVisible();
  await expect(preview).toContainText('Mass energy');
  await expect(preview).toContainText('Your formula');
  await expect(preview.locator('.row[data-custom]')).toBeVisible();
  await page.locator('textarea.field').fill('\\frac{1');
  await expect(page.getByTestId('latex-error')).toBeVisible();
  await page.getByRole('button', { name: 'Next: where it goes' }).click();
  await expect(page.getByText('The formula has an error to fix.')).toBeVisible();
  await page.locator('textarea.field').fill('\\frac{1}{2}');
  await expect(page.getByTestId('latex-error')).toHaveCount(0);
});

test('the name is required', async ({ page }) => {
  await page.goto('/#/mine/new');
  await typeLatex(page, 'x');
  await page.getByRole('button', { name: 'Next: where it goes' }).click();
  await expect(page.getByText(/Give it a name/)).toBeVisible();
});

test('the visual editor and the LaTeX box stay in step, with no errors', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/#/mine/new?subject=physics&level=XI&unit=2');
  const field = page.locator('math-field');
  await expect(field).toBeVisible();
  await field.click();
  await expect.poll(() => field.evaluate((el) => document.activeElement === el)).toBe(true);
  await page.waitForTimeout(300);
  await page.keyboard.type('x+1', { delay: 60 });
  await expect(page.getByTestId('custom-preview').locator('.katex').first()).toContainText('x+1');
  await page.getByRole('button', { name: 'LaTeX', exact: true }).click();
  await expect(page.locator('textarea.field')).toHaveValue('x+1');
  await page.locator('textarea.field').fill('y=\\frac{1}{x}');
  await page.getByRole('button', { name: 'Visual', exact: true }).click();
  await expect(field).toBeVisible();
  await expect.poll(() => field.evaluate((el) => (el as unknown as { value: string }).value)).toContain('\\frac{1}{x}');
  await expect(page.getByTestId('custom-preview').locator('.katex').first()).toBeVisible();
  expect(problems).toEqual([]);
});

test('Chemistry: SMILES draws live, gives its formula, and refuses nonsense', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/#/mine/new?subject=chemistry&level=XII&unit=7');
  await typeLatex(page, '\\text{ethanol}');
  await page.getByLabel('Name', { exact: true }).fill('My alcohol');
  await page.locator('#custom-mode').selectOption('smiles');
  const input = page.getByLabel('SMILES', { exact: true });
  await input.fill('CCO');
  await expect(page.getByTestId('smiles-formula')).toHaveText('C2H6O');
  await expect(page.getByTestId('smiles-preview').locator('svg').first()).toBeVisible();
  await input.fill('C(C');
  await expect(page.getByRole('alert').filter({ hasText: "can't be read" })).toBeVisible();
  await input.fill('CCO');
  await expect(page.getByTestId('smiles-formula')).toHaveText('C2H6O');
  await page.getByRole('button', { name: 'Next: where it goes' }).click();
  await page.getByRole('button', { name: 'Save formula' }).click();
  await expect(myRow(page, 'My alcohol').locator('.custom-molecule svg')).toBeVisible();
  await expect(myRow(page, 'My alcohol').locator('.custom-molecule')).toHaveAttribute('aria-label', /C2H6O/);
  expect(problems).toEqual([]);
});

test('Chemistry: a reaction, and a checked structure with lone pairs', async ({ page }) => {
  await page.goto('/#/mine/new?subject=chemistry&level=XI&unit=4');
  await typeLatex(page, 'A\\to B');
  await page.getByLabel('Name', { exact: true }).fill('My reaction');
  await page.locator('#custom-mode').selectOption('reaction');
  const input = page.getByLabel(/Reaction SMILES/);
  await input.fill('CCO');
  await expect(page.getByText('A reaction is written reactants>>products.')).toBeVisible();
  await input.fill('CCO.O>>CC=O');
  await expect(page.getByTestId('smiles-formula')).toHaveText('C2H6O, H2O, C2H4O');
  await expect(page.getByTestId('smiles-preview').locator('.scheme-arrow')).toBeVisible();
  await page.locator('#custom-mode').selectOption('lewis');
  await page.locator('#custom-lewis').selectOption('water');
  await expect(page.locator('svg.lewis').first()).toHaveAttribute('aria-label', /two lone pairs on oxygen/);
  await page.getByRole('button', { name: 'Next: where it goes' }).click();
  await page.getByRole('button', { name: 'Save formula' }).click();
  await expect(myRow(page, 'My reaction').locator('svg.lewis')).toBeVisible();
});

test('SMILES formulas agree with the formulas RDKit verified for the whole book', async ({ page }) => {
  test.setTimeout(240_000);
  const compounds = JSON.parse(fs.readFileSync(path.resolve('src/data/generated/structures.json'), 'utf8')) as Record<string, { s: string; m: string }>;
  await page.goto('/#/mine/new?subject=chemistry&level=XII&unit=7');
  await page.locator('#custom-mode').selectOption('smiles');
  const input = page.getByLabel('SMILES', { exact: true });
  const wrong: string[] = [];
  const sum = (formula: string) => JSON.stringify([...formula.matchAll(/([A-Z][a-z]?)(\d*)/g)].map((m) => `${m[1]}${m[2] || 1}`).sort());
  for (const [key, { s, m }] of Object.entries(compounds)) {
    if (s.includes('.')) continue;
    await input.fill(s);
    const shown = page.getByTestId('smiles-formula');
    await expect(shown).toBeVisible();
    // The previous molecule's text may still be there for a moment, so give the right answer time to appear.
    await expect.poll(async () => sum((await shown.textContent()) ?? ''), { timeout: 2000 }).toBe(sum(m)).catch(() => wrong.push(`${key}: ${s} gave ${m}`));
  }
  expect(wrong).toEqual([]);
});

test('search finds yours, by symbol too, and the filter shows only yours', async ({ page }) => {
  await page.goto('/#/mine/new?subject=physics&level=XI&unit=2');
  await typeLatex(page, 'q=wh');
  await page.getByLabel('Name', { exact: true }).fill('Zebra relation');
  await page.getByRole('button', { name: 'Add a variable' }).click();
  await page.getByLabel('Symbol 1', { exact: true }).fill('wibble');
  await page.getByLabel('Meaning of symbol 1').fill('Springiness');
  await page.getByRole('button', { name: 'Next: where it goes' }).click();
  await page.getByRole('button', { name: 'Save formula' }).click();
  await expect(myRow(page, 'Zebra relation')).toBeVisible();
  await page.goto('/#/find?q=springiness');
  await expect(myRow(page, 'Zebra relation')).toBeVisible();
  await page.goto('/#/find?q=velocity');
  await expect(page.locator('.row').first()).toBeVisible();
  await page.getByRole('button', { name: 'Only your formulas' }).click();
  await expect(page.getByText('0 formulas')).toBeVisible();
  await page.goto('/#/');
  await expect(page.locator('h1.today-date')).toBeVisible();
  await page.keyboard.press('/');
  const input = page.getByRole('combobox', { name: 'Find a formula' });
  await expect(input).toBeVisible();
  await page.getByRole('button', { name: 'Your formulas', exact: true }).click();
  await input.fill('velocity');
  await expect(page.getByText('Zebra relation')).toHaveCount(0);
  await input.fill('zebra');
  await expect(page.getByRole('option').filter({ hasText: 'Zebra relation' })).toBeVisible();
});

test('it can\'t be solved until it has variables, and then it can', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await addFormula(page, { latex: 'F=ma', name: 'Force again' });
  await expect(myRow(page, 'Force again').getByRole('button', { name: 'Solve with Force again' })).toHaveCount(0);
  const id = (await myRow(page, 'Force again').getAttribute('data-formula-row'))!;
  await page.goto(`/#/f/${id}?work=solve&wf=${id}`);
  await expect(page.getByText(/can't be solved numerically yet/)).toBeVisible();
  await page.goto(`/#/mine/edit/${id}`);
  for (const [i, [symbol, meaning, unit]] of [['F', 'Force', 'N'], ['m', 'Mass', 'kg'], ['a', 'Acceleration', 'm/s^2']].entries()) {
    await page.getByRole('button', { name: 'Add a variable' }).click();
    await page.getByLabel(`Symbol ${i + 1}`, { exact: true }).fill(symbol);
    await page.getByLabel(`Meaning of symbol ${i + 1}`).fill(meaning);
    await page.getByLabel(`Unit of symbol ${i + 1}`).fill(unit);
  }
  await page.getByLabel(/Equation for solving/).fill('F = m*a');
  await page.getByRole('button', { name: 'Next: where it goes' }).click();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await myRow(page, 'Force again').getByRole('button', { name: 'Solve with Force again' }).click();
  const work = page.locator('.work');
  await expect(work.getByText('Force again').first()).toBeVisible();
  await work.getByLabel(/Mass/).first().fill('2');
  await work.getByLabel(/Acceleration/).first().fill('3');
  await work.locator('button[type="submit"]').first().click();
  await expect(work.locator('.steps').first()).toContainText('6');
});

test('practice leaves yours out by default, and includes it as a recall card when asked', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await addFormula(page, { name: 'Recall me' });
  const id = (await myRow(page, 'Recall me').getAttribute('data-formula-row'))!;
  await myRow(page, 'Recall me').getByRole('button', { name: 'Practise Recall me' }).click();
  const work = page.locator('.work');
  await expect(work.getByRole('heading', { name: 'Can you recall this?' })).toBeVisible();
  await expect(work).toContainText('Recall me');
  await work.getByRole('button', { name: 'End session' }).click();
  // Generated practice in the unit doesn't bring it up.
  await page.goto('/#/mine');
  const box = page.getByLabel('Include my formulas in practice, as recall cards');
  await expect(box).not.toBeChecked();
  await box.check();
  await page.reload();
  await expect(page.getByLabel('Include my formulas in practice, as recall cards')).toBeChecked();
  expect(id.startsWith('u-')).toBe(true);
});

test('a reminder to back up comes after a few, and goes once saved', async ({ page }) => {
  for (const name of ['One', 'Two', 'Three']) await addFormula(page, { name });
  await page.goto('/#/mine');
  await expect(page.getByTestId('custom-reminder')).toContainText('3 of your formulas have no backup yet');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save my formulas' }).click();
  await downloadPromise;
  await expect(page.getByTestId('custom-reminder')).toHaveCount(0);
});

test('with storage blocked it says so, and nothing breaks', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', { value: { open: () => { throw new Error('blocked'); } } });
  });
  const page = await context.newPage();
  const problems = watchProblems(page);
  await page.goto('/#/mine');
  await expect(page.getByRole('alert').filter({ hasText: "isn't allowing storage" })).toBeVisible();
  await page.goto('/#/book/physics/XI/1');
  await expect(page.locator('.row').first()).toBeVisible();
  expect(problems).toEqual([]);
  await context.close();
});

test('it prints, with its mark, and without its buttons', async ({ page }) => {
  await addFormula(page, { name: 'For print' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  const row = myRow(page, 'For print');
  await expect(row).toBeVisible();
  await expect(row).toContainText('Your formula');
  await expect(row.locator('.row-acts')).toBeHidden();
});

test('your formulas work with no connection', async ({ page, context }) => {
  await page.goto('/');
  await waitForServiceWorker(page);
  await context.setOffline(true);
  await page.reload();
  await page.goto('/#/mine/new?subject=chemistry&level=XII&unit=7');
  // The visual editor, and SMILES, are both precached.
  await expect(page.locator('math-field')).toBeVisible();
  await typeLatex(page, 'a=b');
  await page.getByLabel('Name', { exact: true }).fill('Offline one');
  await page.locator('#custom-mode').selectOption('smiles');
  await page.getByLabel('SMILES', { exact: true }).fill('c1ccccc1');
  await expect(page.getByTestId('smiles-formula')).toHaveText('C6H6');
  await page.getByRole('button', { name: 'Next: where it goes' }).click();
  await page.getByRole('button', { name: 'Save formula' }).click();
  await expect(myRow(page, 'Offline one')).toBeVisible();
  await page.reload();
  await expect(myRow(page, 'Offline one')).toBeVisible();
  await context.setOffline(false);
});

for (const { width, height, touch } of [{ width: 375, height: 780, touch: true }, { width: 768, height: 1024, touch: true }, { width: 1024, height: 768, touch: true }, { width: 1440, height: 900, touch: false }]) {
  for (const theme of ['paper', 'board'] as const) {
    test(`${width}px ${theme}: the editor and your rows fit, with no errors`, async ({ browser }, info) => {
      test.setTimeout(120_000);
      const context = await browser.newContext({ viewport: { width, height }, hasTouch: touch, reducedMotion: 'reduce' });
      await setTheme(context, theme);
      const page = await context.newPage();
      const problems = watchProblems(page);
      const fits = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth && document.querySelector('main')!.scrollWidth <= document.querySelector('main')!.clientWidth);
      await page.goto('/#/mine/new?subject=chemistry&level=XI&unit=4');
      await expect(page.getByRole('heading', { name: 'Add a formula' })).toBeVisible();
      await typeLatex(page, 'E=mc^{2}');
      await page.getByLabel('Name', { exact: true }).fill('Mass energy again');
      expect(await fits()).toBe(true);
      await page.screenshot({ path: info.outputPath(`editor-${width}-${theme}.png`) });
      await page.getByRole('button', { name: 'Next: where it goes' }).click();
      await page.getByRole('button', { name: 'Save formula' }).click();
      const row = myRow(page, 'Mass energy again');
      await expect(row).toBeVisible();
      expect(await fits()).toBe(true);
      await page.screenshot({ path: info.outputPath(`row-${width}-${theme}.png`) });
      await page.goto('/#/mine');
      await expect(myRow(page, 'Mass energy again')).toBeVisible();
      expect(await fits()).toBe(true);
      expect(problems).toEqual([]);
      await context.close();
    });
  }
}

for (const theme of ['paper', 'board'] as const) {
  test(`${theme}: the editor and your list pass axe, and controls are big enough on touch`, async ({ browser }) => {
    test.setTimeout(120_000);
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await setTheme(context, theme);
    const page = await context.newPage();
    const scan = async () => {
      const { violations } = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).exclude('.toast').analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes[0].target.join(' ')}`)).toEqual([]);
    };
    await page.goto('/#/mine/new?subject=physics&level=XI&unit=2');
    await expect(page.locator('math-field')).toBeVisible();
    await scan();
    await typeLatex(page, 'x=1');
    await page.getByLabel('Name', { exact: true }).fill('Axe one');
    await page.getByRole('button', { name: 'Add a variable' }).click();
    await scan();
    await page.getByRole('button', { name: 'Next: where it goes' }).click();
    await scan();
    await page.getByRole('button', { name: 'Save formula' }).click();
    await expect(myRow(page, 'Axe one')).toBeVisible();
    await scan();
    await page.goto('/#/mine');
    await expect(myRow(page, 'Axe one')).toBeVisible();
    await scan();
    await context.close();
  });
}
