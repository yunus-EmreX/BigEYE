const webSockets = [];
const originalWebSocket = window.WebSocket;

window.WebSocket = new Proxy(window.WebSocket, {
  construct(target, args) {
    const wsInstance = new target(...args);
    webSockets.push(wsInstance);

    // Mesaj alındığında veriyi loglamak için
    wsInstance.addEventListener('message', (event) => {
      let data = event.data;
      if (data instanceof ArrayBuffer) {
        console.log(`Raw ArrayBuffer from ${wsInstance.url}:`, data);

        // Uint8Array olarak loglama
        const uint8Array = new Uint8Array(data);
        console.log(`Uint8Array from ${wsInstance.url}:`, uint8Array);

        // Uint16Array olarak loglama
        if (data.byteLength % 2 === 0) {  // Uint16Array için byte uzunluğu çift olmalı
          const uint16Array = new Uint16Array(data);
          console.log(`Uint16Array from ${wsInstance.url}:`, uint16Array);
        } else {
          console.warn(`Data length is not even, cannot convert to Uint16Array for ${wsInstance.url}`);
        }

        // Uint32Array olarak loglama
        if (data.byteLength % 4 === 0) {  // Uint32Array için byte uzunluğu dörde bölünebilir olmalı
          const uint32Array = new Uint32Array(data);
          console.log(`Uint32Array from ${wsInstance.url}:`, uint32Array);
        } else {
          console.warn(`Data length is not a multiple of 4, cannot convert to Uint32Array for ${wsInstance.url}`);
        }

      } else if (typeof data === 'string') {
        console.log(`String message from ${wsInstance.url}:`, data);
      } else {
        console.log(`Unknown message type from ${wsInstance.url}:`, data);
      }
    });

    return wsInstance;
  }
});
