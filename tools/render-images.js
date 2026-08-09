/* Regenerates the raster images the site needs but cannot express as SVG:
 *   assets/img/og-image.png        1200x630 social sharing card
 *   assets/img/apple-touch-icon.png  180x180 iOS home-screen icon
 *   assets/img/icon-192.png / icon-512.png   PWA / Android icons
 *   assets/img/favicon-32.png      classic favicon fallback
 *
 * Usage:  npm install playwright && node tools/render-images.js
 * Sources: tools/og-image.html and assets/img/favicon.svg
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const img = (f) => path.join(root, 'assets', 'img', f);
const url = (f) => 'file://' + path.join(root, f);

(async () => {
  const browser = await chromium.launch(
    process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
  );

  const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await og.goto(url('tools/og-image.html'), { waitUntil: 'networkidle' });
  await og.screenshot({ path: img('og-image.png') });
  console.log('wrote og-image.png (1200x630)');

  /* A page created with setContent cannot load file:// subresources, so the
     icon is rendered through a scratch HTML file that sits beside the SVG. */
  const scratch = path.join(__dirname, '.icon.html');
  for (const [size, name] of [[180, 'apple-touch-icon.png'], [192, 'icon-192.png'],
                              [512, 'icon-512.png'], [32, 'favicon-32.png']]) {
    fs.writeFileSync(scratch,
      `<body style="margin:0"><img src="../assets/img/favicon.svg"` +
      ` style="width:${size}px;height:${size}px;display:block"></body>`);
    const p = await browser.newPage({ viewport: { width: size, height: size } });
    await p.goto(url('tools/.icon.html'), { waitUntil: 'networkidle' });
    await p.screenshot({ path: img(name), omitBackground: true });
    await p.close();
    console.log(`wrote ${name} (${size}x${size})`);
  }
  fs.unlinkSync(scratch);

  await browser.close();
})();
