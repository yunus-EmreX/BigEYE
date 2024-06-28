// Orijinal WebSocket sınıfını sakla
const OriginalWebSocket = window.WebSocket;

// Yeni WebSocket sınıfı oluştur
window.WebSocket = function(url, protocols) {
    const ws = new OriginalWebSocket(url, protocols);

    // Mesaj geldiğinde tetiklenecek event listener ekle
    ws.addEventListener('message', function(event) {
        const data = event.data;

        if (typeof data === 'string') {
            // Text
            console.log("Text:", data);

            // JSON
            try {
                const jsonData = JSON.parse(data);
                console.log("JSON:", jsonData);
            } catch (e) {
                // JSON değilse bir şey yapma
            }
        } else if (data instanceof Blob) {
            // Blob
            console.log("Blob:", data);

            const reader = new FileReader();
            reader.onload = function() {
                const arrayBuffer = reader.result;
                handleArrayBuffer(arrayBuffer);
            };
            reader.readAsArrayBuffer(data);
        } else if (data instanceof ArrayBuffer) {
            // ArrayBuffer
            console.log("ArrayBuffer:", data);
            handleArrayBuffer(data);
        }
    });

    // Error handling
    ws.addEventListener('error', function(error) {
        console.error('WebSocket Error:', error);
    });

    return ws;
};

// ArrayBuffer verilerini işleyen fonksiyon
function handleArrayBuffer(arrayBuffer) {
    // Uint8Array
    const uint8 = new Uint8Array(arrayBuffer);
    console.log("Uint8Array:", uint8);

    // Uint16Array
    const uint16 = new Uint16Array(arrayBuffer);
    console.log("Uint16Array:", uint16);

    // Uint32Array
    const uint32 = new Uint32Array(arrayBuffer);
    console.log("Uint32Array:", uint32);

    // DataView
    const dataView = new DataView(arrayBuffer);
    console.log("DataView:");
    for (let i = 0; i < arrayBuffer.byteLength; i++) {
        console.log(`byte ${i}: ${dataView.getUint8(i)}`);
    }
}

// Mevcut WebSocket bağlantılarını sarmalamak için
const originalWebSocketSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(data) {
    if (data instanceof ArrayBuffer) {
        console.log("Sending ArrayBuffer:", data);
        handleArrayBuffer(data);
    } else {
        console.log("WebSocket Sent:", data);
    }
    return originalWebSocketSend.call(this, data);
};

// Orijinal WebSocket bağlayıcısını yeniden tanımlama
WebSocket.prototype.addEventListener = function(type, listener) {
    if (type === 'message') {
        const originalListener = listener;
        listener = function(event) {
            const data = event.data;

            if (typeof data === 'string') {
                // Text
                console.log("Text:", data);

                // JSON
                try {
                    const jsonData = JSON.parse(data);
                    console.log("JSON:", jsonData);
                } catch (e) {
                    // JSON değilse bir şey yapma
                }
            } else if (data instanceof Blob) {
                // Blob
                console.log("Blob:", data);

                const reader = new FileReader();
                reader.onload = function() {
                    const arrayBuffer = reader.result;
                    handleArrayBuffer(arrayBuffer);
                };
                reader.readAsArrayBuffer(data);
            } else if (data instanceof ArrayBuffer) {
                // ArrayBuffer
                console.log("ArrayBuffer:", data);
                handleArrayBuffer(data);
            }
            originalListener(event);
        };
    }
    OriginalWebSocket.prototype.addEventListener.call(this, type, listener);
};
