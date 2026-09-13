import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
for (const width of [1440, 1024, 768, 390, 320]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('http://localhost:4173/');
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    false,
    'overflow at ' + width,
  );
  await page.screenshot({ path: 'artifacts/home-' + width + '.png', fullPage: true });
}
await page.goto('http://localhost:4173/research/');
assert.equal(await page.locator('h1').count(), 1);
assert.equal(await page.getByRole('heading', { name: '背景', exact: true }).count(), 1);
assert.equal(await page.getByRole('heading', { name: '発表・論文', exact: true }).count(), 1);
await page.goto('http://localhost:4173/projects/p-01/');
assert.equal(await page.locator('h1').count(), 1);
await page.reload();
assert.equal(await page.locator('h1').count(), 1);
await page.goto('http://localhost:4173/projects/p-03/');
assert.equal(await page.getByRole('heading', { name: '成果', exact: true }).count(), 1);
assert.equal(await page.locator('.detail a[target="_blank"]').count(), 1);
assert.equal(
  await page.locator('.detail a[href="https://github.com/takahiro44/torano-maki"]').count(),
  1,
);
await page.goto('http://localhost:4173/projects/p-04/');
assert.equal(
  await page.locator('.detail a[href="https://intro-quiz-u3vn.onrender.com/"]').count(),
  1,
);
assert.equal(await page.locator('.detail a[target="_blank"]').count(), 2);
await page.goto('http://localhost:4173/');
await page.keyboard.press('Tab');
assert.equal(await page.locator(':focus').innerText(), '本文へスキップ');
await page.keyboard.press('Enter');
await page.locator('.research-lead a.button').click();
assert.equal(new URL(page.url()).pathname, '/research/');
await page.goBack();
await page.locator('.chips a').first().click();
assert.equal(new URL(page.url()).hash, '#P-02');
await page.getByRole('navigation').getByRole('link', { name: 'Research', exact: true }).click();
await page.waitForTimeout(800);
assert.equal(
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Research', exact: true })
    .getAttribute('aria-current'),
  'location',
);
const staticPage = await browser.newPage({ javaScriptEnabled: false });
await staticPage.goto('http://localhost:4173/');
assert.equal(await staticPage.locator('h1').count(), 1);
await staticPage.close();
assert.deepEqual(errors, []);
console.log(
  'Passed: five viewports, direct details, repository and demo links, keyboard, anchors, active navigation, no-JS rendering, browser errors.',
);
await browser.close();
