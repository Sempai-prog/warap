const { chromium } = require('playwright');
const path = require('path');

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });

  const url = 'http://localhost:3000/chore-manager';
  const outputPath = path.join(process.cwd(), 'chore_manager_final.png');

  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // extra wait for animations
    
    console.log(`Taking screenshot to ${outputPath}...`);
    await page.screenshot({ path: outputPath, fullPage: true });
    
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    const content = await page.evaluate(() => document.body.innerText.substring(0, 200));
    console.log(`Content preview: ${content}...`);
    
    console.log('Verification complete.');
  } catch (err) {
    console.error('Error during verification:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
