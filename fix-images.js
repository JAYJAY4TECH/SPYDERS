const fs = require('fs');
const p = 'views/index.html';
let h = fs.readFileSync(p, 'utf8');
const map = [['photo-1523398002811','spyders-1'],['photo-1516762689617','spyders-2'],['photo-1556821840','spyders-3'],['photo-1503341504253','spyders-4'],['photo-1591047139829','spyders-5'],['photo-1521369909029','spyders-6'],['photo-1542272604','spyders-1']];
for (const pair of map) {
  const re = new RegExp('https://images[.]unsplash[.]com/' + pair[0] + '[^\"]+', 'g');
  h = h.replace(re, '/images/' + pair[1] + '.jpg');
}
fs.writeFileSync(p, h, 'utf8');
const c = (h.match(/[\/]images[\/]spyders-/g) || []).length;
console.log('OK - total spyders refs:', c);
