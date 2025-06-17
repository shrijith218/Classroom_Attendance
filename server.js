const express = require('express');
const fs = require('fs');
const XLSX = require('xlsx');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Replace with your GitHub raw products.json URL
const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/shrijith218/Classroom_Attendance/refs/heads/index.html/product.json';

let scanLog = [];
let products = [];

// Load product list from GitHub
async function loadProducts() {
  try {
    const res = await fetch('https://barcode-backend.onrender.com/scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ barcode: code })
});

    products = res.data;
    console.log(`✅ Loaded ${products.length} products`);
  } catch (err) {
    console.error("❌ Failed to load product DB:", err.message);
  }
}
loadProducts();

app.use(express.static('public'));
app.use(express.json());

app.post('/scan', (req, res) => {
  const { barcode } = req.body;
  const now = new Date();

  const found = products.find(p => p.barcode === barcode);
  const entry = {
    Barcode: barcode,
    Product: found ? found.name : 'Not Found',
    Date: now.toLocaleDateString(),
    Time: now.toLocaleTimeString()
  };

  scanLog.push(entry);

  const ws = XLSX.utils.json_to_sheet(scanLog);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Scans');
  XLSX.writeFile(wb, 'scanned.xlsx');

  console.log("🔍 Scanned:", entry);
  res.json({ success: true, data: entry });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
