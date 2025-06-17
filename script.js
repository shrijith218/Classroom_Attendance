function startScanner() {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#scanner'),
        constraints: { facingMode: "environment" }
      },
      decoder: {
        readers: ["ean_reader", "code_128_reader", "upc_reader"]
      }
    }, err => {
      if (err) return console.error("Scanner error:", err);
      Quagga.start();
    });
  
    Quagga.onDetected(async data => {
      const code = data.codeResult.code;
      Quagga.stop();
  
      const res = await fetch('/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode: code })
      });
      const result = await res.json();
  
      document.getElementById('result').innerText =
        `Scanned: ${result.data.Barcode}\nProduct: ${result.data.Product}\nTime: ${result.data.Time}`;
  
      setTimeout(() => Quagga.start(), 2000);
    });
  }
  
  window.onload = startScanner;
  