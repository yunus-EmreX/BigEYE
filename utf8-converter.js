const webSockets = [];
const originalWebSocket = window.WebSocket;

window.WebSocket = new Proxy(window.WebSocket, {
  construct(target, args) {
    const wsInstance = new target(...args);
    webSockets.push(wsInstance);

    // Mesaj alındığında UTF-8 olarak decode etmek için
    wsInstance.addEventListener('message', (event) => {
      let data = event.data;
      if (data instanceof ArrayBuffer) {
        console.log(`Raw ArrayBuffer from ${wsInstance.url}:`, data);

        try {
          // ArrayBuffer'ı UTF-8 string'e çevirme
          const decoder = new TextDecoder('utf-8');
          const decodedData = decoder.decode(data);
          console.log(`Decoded UTF-8 message from ${wsInstance.url}:`, decodedData);
        } catch (e) {
          console.error(`Failed to decode ArrayBuffer: `, e);
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
