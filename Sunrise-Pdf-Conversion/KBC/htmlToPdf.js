const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); 
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });

  // Replace with your URL
  await page.goto('https://storage.mfn.se/proxy/2020-bulkers-ltd-annual-report-2021?url=https%3A%2F%2Fmb.cision.com%2FPublic%2F18580%2F3521934%2F9ec9df75d17600d4.xhtml', {
    waitUntil: 'networkidle0', // Wait until the network is idle
    timeout: 0  // Disable timeout
  });

 await page.evaluate(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      * { visibility: visible !important; }
      body { opacity: 1 !important; }
    `;
    document.head.appendChild(style);
  });

  const pdfPath = path.join(__dirname, 'output.pdf');

  // Debug with a screenshot first
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  
  // Then generate the PDF
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true, // Ensure backgrounds are included
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="font-size: 10px; width: 100%; text-align: center;">
        Page <span class="pageNumber"></span> of <span class="totalPages"></span>
      </div>`,
    margin: { top: '20px', bottom: '40px' },
    scale: 1,  // Adjust scale to fit content
  });

  await browser.close();

  console.log(`PDF successfully generated and saved at: ${pdfPath}`);
})();
