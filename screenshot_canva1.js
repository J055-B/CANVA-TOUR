const chromium = require('@sparticuz/chromium').default;
const puppeteer = require('puppeteer-core');
(async () => {
  const execPath = await chromium.executablePath();
  const browser = await puppeteer.launch({
    args: [...chromium.args, '--disable-gpu', '--disable-dev-shm-usage'],
    executablePath: execPath,
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1000 });

  await page.goto('http://localhost:4174/', { waitUntil: 'load', timeout: 45000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/tmp/canva_intro.png' });

  await browser.close();
  console.log('done intro');
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
