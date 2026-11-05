// The SMILES guide and helpers in the formula editor.
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { setTheme, watchProblems } from './helpers';

const EDITOR = '/#/mine/new?subject=chemistry&level=XII&unit=8';

async function openSmiles(page: Page) {
  await page.goto(EDITOR);
  await page.locator('#custom-mode').selectOption('smiles');
}

/** Leaves the editor, and waits until it has really gone. */
async function leaveEditor(page: Page) {
  await page.goto('/#/mine');
  await expect(page.getByRole('heading', { name: 'Your formulas', exact: true })).toBeVisible();
}

test('the guide opens by itself the first time, and only from its link afterwards', async ({ page }) => {
  const problems = watchProblems(page);
  await openSmiles(page);
  const guide = page.getByTestId('smiles-guide');
  await expect(guide).toBeVisible();
  await guide.getByRole('button', { name: 'Close the guide' }).click();
  await expect(guide).toHaveCount(0);
  await leaveEditor(page);
  await openSmiles(page);
  await expect(page.getByLabel('SMILES', { exact: true })).toBeVisible();
  await expect(guide).toHaveCount(0);
  await page.getByRole('button', { name: 'How SMILES works' }).click();
  await expect(guide).toBeVisible();
  expect(problems).toEqual([]);
});

test('every step draws its example, which can be edited, and shows its formula', async ({ page }) => {
  const problems = watchProblems(page);
  await openSmiles(page);
  const guide = page.getByTestId('smiles-guide');
  const expected = ['C2H6O', 'C2H4O', 'C4H10', 'C6H12', 'C6H6', 'C6H5NO3', 'CH3NO2', 'C10H8', 'C2H6O, C2H4O'];
  for (let i = 0; i < expected.length; i++) {
    await expect(guide.getByRole('heading', { level: 3 })).toContainText(`${i + 1} of 9`);
    await expect(guide.getByTestId('guide-formula')).toHaveText(expected[i]);
    await expect(guide.getByTestId('guide-preview').locator('svg').first()).toBeVisible();
    if (i < expected.length - 1) await guide.getByRole('button', { name: 'Next step' }).click();
  }
  await guide.getByRole('button', { name: 'Previous step' }).click();
  await guide.getByRole('button', { name: 'Next step' }).click();
  await guide.getByTestId('guide-example').fill('CCO>>CC(=O)O');
  await expect(guide.getByTestId('guide-formula')).toHaveText('C2H6O, C2H4O2');
  await guide.getByRole('button', { name: 'Finish' }).click();
  await expect(guide).toHaveCount(0);
  expect(problems).toEqual([]);
});

test('the guide remembers its step, and its examples can be sent to the box above', async ({ page }) => {
  await openSmiles(page);
  const guide = page.getByTestId('smiles-guide');
  await guide.getByRole('button', { name: 'Next step' }).click();
  await guide.getByRole('button', { name: 'Ethyne' }).click();
  await expect(guide.getByTestId('guide-formula')).toHaveText('C2H2');
  await guide.getByRole('button', { name: 'Use this example above' }).click();
  await expect(page.getByLabel('SMILES', { exact: true })).toHaveValue('C#C');
  await expect(page.getByTestId('smiles-formula')).toHaveText('C2H2');
  await leaveEditor(page);
  await openSmiles(page);
  await page.getByRole('button', { name: 'How SMILES works' }).click();
  await expect(guide.getByRole('heading', { level: 3 })).toContainText('2 of 9');
});

test('try it accepts any correct form, and gives hints after a wrong try', async ({ page }) => {
  await openSmiles(page);
  const guide = page.getByTestId('smiles-guide');
  for (let i = 0; i < 4; i++) await guide.getByRole('button', { name: 'Next step' }).click();
  const answer = guide.getByLabel(/^Try it/);
  const result = guide.getByTestId('guide-result');
  await answer.fill('CCC');
  await guide.getByRole('button', { name: 'Check' }).click();
  await expect(result).toContainText('That gives C3H8');
  await expect(result).toContainText('benzene ring with one methyl');
  await expect(result).toHaveAttribute('data-tone', 'bad');
  await answer.fill('C(C');
  await page.keyboard.press('Enter');
  await expect(result).toContainText('never closed');
  await answer.fill('CC1=CC=CC=C1');
  await guide.getByRole('button', { name: 'Check' }).click();
  await expect(result).toContainText('Right');
  await expect(result).toHaveAttribute('data-tone', 'good');
});

test('mistakes are explained in words, and the place is marked in the text', async ({ page }) => {
  await openSmiles(page);
  const input = page.getByLabel('SMILES', { exact: true });
  const problem = page.getByTestId('smiles-problem');
  const cases: [string, RegExp, string][] = [
    ['C1CCC', /Ring 1 is opened at position 2 but never closed/, '1'],
    ['CCCCCCCCCCC)C', /Unmatched bracket at position 12/, ')'],
    ['C(C', /bracket at position 2 is never closed/, '('],
    ['CC=', /The = at position 3 has no atom after it/, '='],
    ['CNa', /Na at position 2 has to go in square brackets/, 'Na'],
  ];
  for (const [text, message, marked] of cases) {
    await input.fill(text);
    await expect(problem).toHaveText(message);
    await expect(page.getByTestId('smiles-echo').locator('[data-bad]')).toHaveText(marked.split(''));
  }
  await input.fill('CCO');
  await expect(problem).toHaveCount(0);
  await expect(page.getByTestId('smiles-formula')).toHaveText('C2H6O');
});

test('the cursor on an atom marks it in the drawing, and pointing at the drawing marks the text', async ({ page }) => {
  const problems = watchProblems(page);
  await openSmiles(page);
  await page.getByTestId('smiles-guide').getByRole('button', { name: 'Close the guide' }).click();
  const input = page.getByLabel('SMILES', { exact: true });
  await input.fill('CC(O)Br');
  await expect(page.getByTestId('smiles-formula')).toHaveText('C2H5BrO');
  const preview = page.getByTestId('smiles-preview');
  await input.focus();
  await page.keyboard.press('Home');
  await expect(preview.locator('circle[data-active]')).toHaveAttribute('data-atom', '0');
  await expect(page.getByTestId('smiles-atom')).toHaveText('Atom 1: carbon, with 3 hydrogens');
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight');
  await expect(preview.locator('circle[data-active]')).toHaveAttribute('data-atom', '2');
  await expect(page.getByTestId('smiles-atom')).toHaveText('Atom 3: oxygen, with 1 hydrogen');
  await expect(page.getByTestId('smiles-echo').locator('[data-active]')).toHaveText('O');

  // Each mark is where the atom really is: the bromine's mark sits on its label in the drawing.
  await preview.locator('circle[data-atom="3"]').hover({ force: true });
  await expect(page.getByTestId('smiles-echo').locator('[data-active]')).toHaveText(['B', 'r']);
  await expect(page.getByTestId('smiles-atom')).toContainText('bromine');

  // Tap: the cursor goes there.
  await preview.locator('circle[data-atom="1"]').click({ force: true });
  expect(await input.evaluate((el) => (el as HTMLInputElement).selectionStart)).toBe(1);
  await page.mouse.move(0, 0);
  await expect(page.getByTestId('smiles-echo').locator('[data-active]')).toHaveText('C');
  expect(problems).toEqual([]);
});

test('the marks line up with the drawing for rings, charges and reactions', async ({ page }) => {
  await openSmiles(page);
  const input = page.getByLabel('SMILES', { exact: true });
  for (const [text, count] of [['c1ccccc1O', 7], ['C[N+](=O)[O-]', 4], ['C/C=C/C', 4], ['N[C@@H](C)C(=O)O', 6]] as const) {
    await input.fill(text);
    await expect(page.getByTestId('smiles-preview').locator('.atom-map circle')).toHaveCount(count);
  }
  await page.locator('#custom-mode').selectOption('reaction');
  await page.getByLabel(/Reaction SMILES/).fill('CCO>>CC=O');
  await expect(page.getByTestId('smiles-preview').locator('.atom-map circle')).toHaveCount(6);
});

test('the builder writes the SMILES for you', async ({ page }) => {
  await openSmiles(page);
  await page.getByTestId('smiles-guide').getByRole('button', { name: 'Close the guide' }).click();
  await page.getByRole('button', { name: 'Build with buttons' }).click();
  const builder = page.getByTestId('smiles-builder');
  const formula = page.getByTestId('smiles-formula');
  await builder.getByRole('button', { name: 'Benzene' }).click();
  await expect(formula).toHaveText('C6H6');
  await builder.getByRole('button', { name: '–OH' }).click();
  await builder.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(formula).toHaveText('C6H6O');
  await builder.getByRole('button', { name: '–NO₂' }).click();
  await builder.getByRole('button', { name: /^para to/ }).click();
  await expect(formula).toHaveText('C6H5NO3');
  await builder.getByRole('button', { name: 'Remove the group at position 4' }).click();
  await expect(formula).toHaveText('C6H6O');
  await builder.getByRole('button', { name: 'Pyridine' }).click();
  await expect(formula).toHaveText('C5H5N');
  await builder.getByRole('button', { name: 'Chain of' }).click();
  await expect(formula).toHaveText('C4H10');
  await builder.getByLabel('Carbons in the chain').fill('6');
  await expect(formula).toHaveText('C6H14');
});

test('pick by name finds a compound and inserts it', async ({ page }) => {
  await openSmiles(page);
  await page.getByTestId('smiles-guide').getByRole('button', { name: 'Close the guide' }).click();
  await page.getByRole('button', { name: 'Pick by name' }).click();
  const pick = page.getByTestId('smiles-pick');
  await pick.getByLabel('Find a compound by name').fill('tolu');
  await pick.getByRole('button', { name: /^Toluene/ }).click();
  await expect(page.getByLabel('SMILES', { exact: true })).toHaveValue('Cc1ccccc1');
  await expect(page.getByTestId('smiles-formula')).toHaveText('C7H8');
  await pick.getByLabel('Find a compound by name').fill('zzzz');
  await expect(pick).toContainText('Nothing by that name');

  // In a reaction, picks build up the two sides.
  await page.locator('#custom-mode').selectOption('reaction');
  const box = page.getByLabel(/Reaction SMILES/);
  await box.fill('');
  await pick.getByLabel('Find a compound by name').fill('ethene');
  await pick.getByRole('button', { name: /^Ethene/ }).click();
  await expect(box).toHaveValue('C=C');
  await pick.getByLabel('Find a compound by name').fill('ethane');
  await pick.getByRole('button', { name: /^Ethane/ }).first().click();
  await expect(box).toHaveValue('C=C>>CC');
});

test('the cheat sheet stays open while you type', async ({ page }) => {
  await openSmiles(page);
  await page.getByRole('button', { name: 'Cheat sheet' }).click();
  const cheat = page.getByTestId('smiles-cheat');
  await expect(cheat).toContainText('Ring number above 9');
  await page.getByLabel('SMILES', { exact: true }).fill('C1CCCCC1');
  await expect(page.getByTestId('smiles-formula')).toHaveText('C6H12');
  await expect(cheat).toBeVisible();
});

for (const { width, height, touch } of [{ width: 375, height: 780, touch: true }, { width: 768, height: 1024, touch: true }, { width: 1024, height: 768, touch: true }, { width: 1440, height: 900, touch: false }]) {
  for (const theme of ['paper', 'board'] as const) {
    test(`${width}px ${theme}: the guide and helpers fit, with no errors`, async ({ browser }, info) => {
      const context = await browser.newContext({ viewport: { width, height }, hasTouch: touch, reducedMotion: 'reduce' });
      await setTheme(context, theme);
      const page = await context.newPage();
      const problems = watchProblems(page);
      await openSmiles(page);
      await page.getByLabel('SMILES', { exact: true }).fill('Oc1ccc(cc1)[N+](=O)[O-]');
      await page.getByRole('button', { name: 'Cheat sheet' }).click();
      await page.getByRole('button', { name: 'Build with buttons' }).click();
      await page.getByRole('button', { name: 'Pick by name' }).click();
      await page.getByTestId('smiles-pick').getByLabel('Find a compound by name').fill('nitro');
      await expect(page.getByTestId('guide-formula')).toBeVisible();
      await expect(page.getByTestId('smiles-formula')).toHaveText('C6H5NO3');
      const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth && document.querySelector('main')!.scrollWidth <= document.querySelector('main')!.clientWidth);
      expect(fits).toBe(true);
      await page.screenshot({ path: `test-screens/smiles-${width}-${theme}.png`, fullPage: false });
      await page.locator('.custom-panel').first().scrollIntoViewIfNeeded();
      await info.attach('editor', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
      if (touch) {
        const small = await page.evaluate(() =>
          [...document.querySelectorAll('section[aria-labelledby="structure-h"] button, section[aria-labelledby="structure-h"] input, section[aria-labelledby="structure-h"] select')]
            .map((el) => ({ label: el.getAttribute('aria-label') ?? el.textContent?.trim() ?? el.id, height: el.getBoundingClientRect().height }))
            .filter((x) => x.height > 0 && x.height < 43.5),
        );
        expect(small).toEqual([]);
      }
      expect(problems).toEqual([]);
      await context.close();
    });
  }
}

for (const theme of ['paper', 'board'] as const) {
  test(`${theme}: the guide and helpers pass axe`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await setTheme(context, theme);
    const page = await context.newPage();
    await openSmiles(page);
    await page.getByLabel('SMILES', { exact: true }).fill('CC(O)Br(');
    await expect(page.getByTestId('smiles-problem')).toBeVisible();
    await page.getByLabel('SMILES', { exact: true }).fill('CCO');
    await expect(page.getByTestId('smiles-formula')).toHaveText('C2H6O');
    await page.getByRole('button', { name: 'Cheat sheet' }).click();
    await page.getByRole('button', { name: 'Build with buttons' }).click();
    await page.getByRole('button', { name: 'Pick by name' }).click();
    await expect(page.getByTestId('guide-formula')).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).include('section[aria-labelledby="structure-h"]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes[0].target.join(' ')}`)).toEqual([]);
    await context.close();
  });
}
