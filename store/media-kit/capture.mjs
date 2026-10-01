// Run via ego-browser nodejs; see README.md. Uses the existing task space.
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../', import.meta.url));

export async function capture({ taskSpace, spaceId = 26, base = 'http://127.0.0.1:4176' }) {
  const task = await taskSpace(spaceId);
  const page = task.page('p2');
  await mkdir(root + 'assets/styles', { recursive: true });
  await page.cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 2, mobile: false });
  const go = async (query = '') => {
    await page.goto(`${base}/store/media-kit/demo.html${query}`);
    await page.waitForSelector('#pkh-toggle');
    await page.waitForFunction(() => document.fonts.status === 'loaded');
  };
  const crop = async (selector, path, padding = 0) => {
    const clip = await page.evaluate(({ selector, padding }) => {
      const r = document.querySelector(selector).getBoundingClientRect();
      return { x: Math.max(0, r.x - padding), y: Math.max(0, r.y - padding), width: r.width + padding * 2, height: r.height + padding * 2, scale: 1 };
    }, { selector, padding });
    const { data } = await page.cdp('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true });
    await writeFile(root + path, Buffer.from(data, 'base64'));
  };
  const full = async path => {
    const { data } = await page.cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(root + path, Buffer.from(data, 'base64'));
  };
  await go('?before');
  assert.equal(await page.evaluate(() => document.querySelectorAll('.pkh-token').length), 0);
  await full('listing/screenshots/06-reading-before.png');
  await page.click('#pkh-toggle');
  await full('listing/screenshots/08-before-settings.png');
  await go();
  await page.waitForSelector('.pkh-token');
  assert.ok(await page.evaluate(() => document.querySelectorAll('[data-pkh-exclude="1"]').length > 0));
  await full('listing/screenshots/05-reading-after.png');
  await page.click('#pkh-toggle');
  await page.waitForSelector('#pkh-overlay.pkh-open');
  await full('listing/screenshots/07-settings.png');
  await crop('#pkh-overlay', 'assets/settings.png', 16);
  const link = await page.evaluate(() => {
    const a = document.querySelector('.pkh-support');
    return { href: a.href, target: a.target, rel: a.rel, visible: a.getBoundingClientRect().height > 0 };
  });
  assert.equal(link.href, 'https://ko-fi.com/pouark');
  assert.equal(link.target, '_blank');
  assert.ok(link.visible && link.rel.includes('noopener'));
  // A link mousedown must not enter the shared panel-drag path.
  assert.equal(await page.evaluate(() => {
    const overlay = document.querySelector('#pkh-overlay');
    const a = document.querySelector('.pkh-support');
    const before = overlay.getBoundingClientRect();
    a.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 100, clientY: 100 }));
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 140, clientY: 140 }));
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    const after = overlay.getBoundingClientRect();
    return before.x === after.x && before.y === after.y;
  }), true);
  // Verify the actual Save / Clear controls rather than just fixture seeding.
  await page.fill('#pkh-highlight', 'attention');
  await page.click('#pkh-save');
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('pkh:keyword-highlighter:' + location.hostname)).highlight.length === 1);
  await page.click('#pkh-clear');
  await page.waitForFunction(() => document.querySelectorAll('.pkh-token').length === 0);
  const modes = ['sticker', 'candy', 'offset', 'bold', 'origami', 'pastel', 'neon'];
  for (const mode of modes) {
    await go(`?sample&style=${mode}`);
    await page.waitForSelector('#style-sample .pkh-token');
    await crop('#style-sample .pkh-token', `assets/styles/${mode}.png`, 18);
  }
  await go();
  console.log('PASS: authentic content-script captures, seven styles, exclude, Save, Clear, Ko-fi and link/drag regression.');
}
