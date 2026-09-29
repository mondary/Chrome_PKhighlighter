// Records the real extension UI on the demo fixture: before → panel → enable → highlights → style change.
// Frames are captured step-by-step (deterministic), then assembled by ffmpeg (see README.md).
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

export async function film({ taskSpace, spaceId = 26, base = 'http://127.0.0.1:4176', frames = 'media-kit/frames' }) {
  const task = await taskSpace(spaceId);
  const page = task.page('p2');
  const dir = root + frames;
  await mkdir(dir, { recursive: true });
  await page.cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  const shot = async name => {
    const { data } = await page.cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(`${dir}/${name}.png`, Buffer.from(data, 'base64'));
  };
  const hold = async (name, count) => { for (let i = 0; i < count; i += 1) await shot(`${name}-${String(i).padStart(2, '0')}`); };
  await page.goto(`${base}/store/media-kit/demo.html?before`);
  await page.waitForSelector('#pkh-toggle');
  await page.waitForFunction(() => document.fonts.status === 'loaded');
  await hold('01-before', 8);
  await page.mouse.move(1244, 764);
  await page.click('#pkh-toggle', { label: 'open PK Highlighter panel' });
  await page.waitForSelector('#pkh-overlay.pkh-open');
  await hold('02-panel', 10);
  await page.click('#pkh-add-domain', { label: 'enable this site' });
  await page.waitForSelector('.pkh-token');
  await page.waitForTimeout(300);
  await hold('03-highlight', 14);
  await page.click('.pkh-style-item[data-style="candy"]', { label: 'pick Candy style' });
  await page.click('#pkh-save', { label: 'save Candy style' });
  await page.waitForTimeout(400);
  await hold('04-style', 12);
  assert.equal((await page.evaluate(() => document.querySelectorAll('.pkh-token').length)) > 5, true);
  console.log(JSON.stringify({ status: 'PASS', frames: 44, dir }));
}
