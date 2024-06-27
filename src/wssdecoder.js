const webSockets = [];
const originalWebSocket = window.WebSocket;

window.WebSocket = new Proxy(window.WebSocket, {
  construct(target, args) {
    const wsInstance = new target(...args);
    webSockets.push(wsInstance);

    // Mesaj alındığında decode etmek için
    wsInstance.addEventListener('message', (event) => {
      let data = event.data;
      if (typeof data === 'string') {
        try {
          // Decode etmeyi deniyoruz
          const decodedData = decodeURIComponent(escape(data));
          console.log(`Decoded message from ${wsInstance.url}: `, decodedData);
        } catch (e) {
          console.error(`Failed to decode message: `, e);
        }
      } else {
        console.log(`Non-string message from ${wsInstance.url}: `, data);
      }
    });

    return wsInstance;
  }
});

// Bağlantıların ws:// veya wss:// olduğunu kontrol etmek için
setInterval(() => {
  webSockets.forEach((ws) => {
    console.log(ws.url.startsWith('wss://') ? 'WebSocket Secure (wss://)' : 'WebSocket (ws://)');
  });
}, 5000); // Her 5 saniyede bir kontrol eder
