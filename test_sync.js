const label = "K1-K2: Tata Letak Desimal Raksasa / The Large Decimal Layout (Bird's Eye View)";

fetch('http://localhost:5173/api/sync-ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    label: label,
    data: { steps: ['Test Step'] }
  })
}).then(async r => {
  console.log(r.status, await r.text());
}).catch(console.error);
