const { chromium } = require('playwright');

const seeds = [42, 43, 44, 45, 46, 47, 48, 49, 50, 51];

(async () => {
  const browser = await chromium.launch();
  let grandTotal = 0;

  for (const seed of seeds) {
    const page = await browser.newPage();
    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
    
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Wait for table to render (JS-generated)
    await page.waitForSelector('table', { timeout: 10000 });

    const numbers = await page.$$eval('table td, table th', cells =>
      cells
        .map(c => parseFloat(c.innerText.trim()))
        .filter(n => !isNaN(n))
    );

    const seedTotal = numbers.reduce((a, b) => a + b, 0);
    console.log(`Seed ${seed}: ${seedTotal}`);
    grandTotal += seedTotal;
    await page.close();
  }

  await browser.close();
  console.log(`TOTAL: ${grandTotal}`);
})();
