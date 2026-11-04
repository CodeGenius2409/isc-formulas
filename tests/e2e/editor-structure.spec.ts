// The structure section of the formula editor used to go missing now and then, until a reload. Every way of
// arriving at the editor is walked here, again and again, so it can't quietly come back.
import { expect, test, type Page } from '@playwright/test';
import { waitForServiceWorker, watchProblems } from './helpers';

const CHEM_UNIT = '/#/book/chemistry/XII/7';
const PHYSICS_UNIT = '/#/book/physics/XI/1';
const ROUNDS = 5;

const section = (page: Page) => page.getByRole('heading', { name: 'Structure', exact: true });
const editorOpen = (page: Page) => expect(page.getByRole('heading', { name: 'Add a formula' })).toBeVisible();

async function addFromSection(page: Page) {
  await page.locator('.section-head').first().getByRole('link', { name: /Add a formula/ }).click();
  await editorOpen(page);
}

async function addFromNavigation(page: Page) {
  await page.evaluate(() => {
    location.hash = '#/mine';
  });
  await page.locator('main').getByRole('link', { name: 'Add a formula' }).click();
  await editorOpen(page);
}

async function fill(page: Page, name: string) {
  await page.getByRole('button', { name: 'LaTeX', exact: true }).click();
  await page.locator('textarea.field').fill('x=1');
  await page.getByLabel('Name', { exact: true }).fill(name);
}

test.describe.configure({ timeout: 180_000 });

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
});

test('from a Chemistry subtopic, every time', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto(CHEM_UNIT);
  for (let i = 0; i < ROUNDS; i++) {
    await addFromSection(page);
    await expect(section(page)).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.locator('.section-head').first()).toBeVisible();
  }
  expect(problems).toEqual([]);
});

test('from the main navigation, after reading Chemistry', async ({ page }) => {
  await page.goto(CHEM_UNIT);
  await expect(page.locator('.section-head').first()).toBeVisible();
  for (let i = 0; i < ROUNDS; i++) {
    await addFromNavigation(page);
    await expect(section(page)).toBeVisible();
  }
});

test('from the main navigation, after only opening the Chemistry contents', async ({ page }) => {
  await page.goto(PHYSICS_UNIT);
  await expect(page.locator('.section-head').first()).toBeVisible();
  await page.goto('/#/book/chemistry/XII');
  await expect(page.locator('main h1').first()).toBeVisible();
  await addFromNavigation(page);
  await expect(section(page)).toBeVisible();
});

test('switching subjects back and forth', async ({ page }) => {
  for (let i = 0; i < ROUNDS; i++) {
    await page.goto(PHYSICS_UNIT);
    await addFromSection(page);
    await page.goto(CHEM_UNIT);
    await addFromSection(page);
    await expect(section(page)).toBeVisible();
  }
});

test('the address changes while the editor is already open', async ({ page }) => {
  await page.goto('/#/mine/new?subject=physics&level=XI&unit=2');
  await editorOpen(page);
  await page.evaluate(() => {
    location.hash = '#/mine/new?subject=chemistry&level=XII&unit=8';
  });
  await expect(section(page)).toBeVisible();
});

test('another tab was reading Chemistry', async ({ page, context }) => {
  await page.goto(PHYSICS_UNIT);
  await expect(page.locator('.section-head').first()).toBeVisible();
  const other = await context.newPage();
  await other.goto(CHEM_UNIT);
  await expect(other.locator('.section-head').first()).toBeVisible();
  await other.close();
  await addFromNavigation(page);
  await expect(section(page)).toBeVisible();
});

test('choosing Chemistry on the second step, then going back', async ({ page }) => {
  await page.goto(PHYSICS_UNIT);
  await addFromNavigation(page);
  await fill(page, 'Moved');
  await page.getByRole('button', { name: 'Next: where it goes' }).click();
  await page.locator('#custom-subject').selectOption('chemistry');
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(section(page)).toBeVisible();
});

test('a structure can be added from any subject, without visiting the second step', async ({ page }) => {
  await page.goto(PHYSICS_UNIT);
  await addFromNavigation(page);
  await fill(page, 'Physics with a molecule');
  await page.getByRole('button', { name: 'Add a structure' }).click();
  await expect(section(page)).toBeVisible();
  await page.locator('#custom-mode').selectOption('smiles');
  await page.getByLabel('SMILES', { exact: true }).fill('CCO');
  await expect(page.getByTestId('smiles-formula')).toHaveText('C2H6O');
  await page.getByRole('button', { name: 'Next: where it goes' }).click();
  await page.getByRole('button', { name: 'Save formula' }).click();
  await expect(page.locator('.row[data-custom]').filter({ hasText: 'Physics with a molecule' }).locator('.custom-molecule svg')).toBeVisible();
});

test('saving one and starting another straight away', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto(CHEM_UNIT);
  for (let i = 0; i < ROUNDS; i++) {
    await addFromSection(page);
    await expect(section(page)).toBeVisible();
    await fill(page, `Number ${i}`);
    await page.locator('#custom-mode').selectOption('smiles');
    await page.getByLabel('SMILES', { exact: true }).fill('CCO');
    await expect(page.getByTestId('smiles-formula')).toHaveText('C2H6O');
    await page.getByRole('button', { name: 'Next: where it goes' }).click();
    await page.getByRole('button', { name: 'Save formula' }).click();
    await expect(page.locator('.row[data-custom]').filter({ hasText: `Number ${i}` }).first()).toBeVisible();
  }
  // Nothing from the last formula is left behind in the next.
  await addFromSection(page);
  await expect(page.locator('#custom-mode')).toHaveValue('none');
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('');
  expect(problems).toEqual([]);
});

test('after cancelling, from both places', async ({ page }) => {
  await page.goto(CHEM_UNIT);
  await expect(page.locator('.section-head').first()).toBeVisible();
  for (let i = 0; i < ROUNDS; i++) {
    await addFromNavigation(page);
    await expect(section(page)).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'Your formulas', exact: true })).toBeVisible();
  }
});

test('on a slow connection the section is there before the drawing engine arrives', async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.route('**/assets/smiles-drawer*', async (route) => {
    await new Promise((done) => setTimeout(done, 3000));
    await route.continue();
  });
  await page.goto('/#/mine/new?subject=chemistry&level=XII&unit=8');
  await expect(section(page)).toBeVisible();
  await page.locator('#custom-mode').selectOption('smiles');
  await page.getByLabel('SMILES', { exact: true }).fill('CCO');
  await expect(page.getByTestId('smiles-formula')).toHaveText('C2H6O', { timeout: 15_000 });
  await context.close();
});

test('offline, once saved to this device', async ({ page, context }) => {
  await page.goto('/');
  await waitForServiceWorker(page);
  await context.setOffline(true);
  for (let i = 0; i < 3; i++) {
    await page.goto('/#/mine/new?subject=chemistry&level=XII&unit=8');
    await page.reload();
    await expect(section(page)).toBeVisible();
    await page.locator('#custom-mode').selectOption('smiles');
    await page.getByLabel('SMILES', { exact: true }).fill('c1ccccc1');
    await expect(page.getByTestId('smiles-formula')).toHaveText('C6H6');
  }
  await context.setOffline(false);
});

test('the drawing engine fails once, then the next try works without a reload', async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  let refuse = true;
  await page.route('**/assets/smiles-drawer*', (route) => (refuse ? route.abort() : route.continue()));
  await page.goto('/#/mine/new?subject=chemistry&level=XII&unit=8');
  await page.getByLabel('Name', { exact: true }).fill('Keep what I typed');
  await page.locator('#custom-mode').selectOption('smiles');
  await page.getByLabel('SMILES', { exact: true }).fill('CCO');
  const message = page.getByText("Couldn't load the structure editor. Try again.");
  await expect(message).toBeVisible({ timeout: 20_000 });
  refuse = false;
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByTestId('smiles-formula')).toHaveText('C2H6O', { timeout: 15_000 });
  await expect(message).toHaveCount(0);
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Keep what I typed');
  await context.close();
});

test('the lone-pair drawings fail to load: the section stays, and Retry brings them back', async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  let refuse = true;
  await page.route(/assets\/(Lewis|figures)-/, (route) => (refuse ? route.abort() : route.continue()));
  await page.goto('/#/mine/new?subject=chemistry&level=XII&unit=8');
  await page.getByLabel('Name', { exact: true }).fill('Keep this too');
  await page.locator('#custom-mode').selectOption('lewis');
  const message = page.getByText("Couldn't load the structure editor. Try again.");
  await expect(message).toBeVisible({ timeout: 20_000 });
  await expect(section(page)).toBeVisible();
  refuse = false;
  await page.getByRole('button', { name: 'Retry' }).click();
  await page.locator('#custom-lewis').selectOption('water');
  await expect(page.locator('svg.lewis').first()).toBeVisible();
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Keep this too');
  await context.close();
});
