function startScanner() {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#scanner'),
      constraints: {
        facingMode: "environment" // use back camera on mobile
      }
    },
    decoder: {
      readers: ["ean_reader", "code_128_reader", "upc_reader"]
    }
  }, err => {
    if (err) {
      console.error("Scanner initialization error:", err);
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(async data => {
    const code = data.codeResult.code;
    Quagga.stop();

    // Simulate a scan result (since you're on GitHub Pages)
    document.getElementById('result').innerText =
      `Scanned: ${code}`;

    // Uncomment if you connect to a real backend:
    
    const res = await fetch('/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barcode: code })
    });

    const result = await res.json();

    document.getElementById('result').innerText =
      `Scanned: ${result.data.Barcode}\nProduct: ${result.data.Product}\nTime: ${result.data.Time}`;
    

    setTimeout(() => Quagga.start(), 2000); // Resume scanning
  });
}

window.onload = startScanner;
