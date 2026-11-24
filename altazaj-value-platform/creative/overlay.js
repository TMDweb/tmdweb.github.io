const { chromium } = require('playwright');
(async () => {
  const [,, fontDir, out] = process.argv;
  const dark = { 2: 1, 6: 1, 9: 1, 11: 1 }; let h = '';
  for (let p = 2; p <= 11; p++) {
    const n = 24 + p, d = dark[p];
    h += `<div class="pg">` + (p === 10 ? '' : `<div class="patch" style="background:${d ? '#0C0E1D' : '#fff'}"></div><div class="num" style="color:${d ? '#f0f2f9' : '#2f3e75'}">${n}</div>`) + `</div>`;
  }
  const html = `<html><head><style>
  @font-face{font-family:P;font-weight:500;src:url(data:font/ttf;base64,FONTFILE)}
  @page{size:1280px 720px;margin:0} body{margin:0}
  .pg{width:1280px;height:720px;position:relative;page-break-after:always;overflow:hidden}
  .patch{position:absolute;left:54px;top:42px;width:44px;height:30px}
  .num{position:absolute;left:64px;top:48px;font:500 13px P}
  </style></head><body>${h}</body></html>`;
  const fs = require('fs'); const f = fs.readdirSync(fontDir).find(x => /ttf|woff2?$/.test(x));
  const b = await chromium.launch(); const pg = await b.newPage();
  await pg.setContent(html.replace('FONTFILE', fs.readFileSync(fontDir + '/' + f).toString('base64'))); await pg.evaluate(() => document.fonts.ready);
  await pg.pdf({ path: out, width: '1280px', height: '720px', printBackground: true, preferCSSPageSize: true });
  await b.close(); console.log('font', f);
})();
