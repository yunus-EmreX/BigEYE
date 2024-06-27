(function() {
    'use strict';

    // Mevcut WebSocket'in send fonksiyonunu sakla
    const originalWebSocket = window.WebSocket;
    const originalSend = originalWebSocket.prototype.send;

    // Yeni WebSocket ile sarmalayıcı
    function CustomWebSocket(url, protocols) {
        const ws = new originalWebSocket(url, protocols);

        ws.addEventListener('message', function(event) {
            try {
                const data = JSON.parse(event.data);
                // Elo puanının olduğu koşulu kontrol et
                if (data.bO.bD.data.value) {
                    console.log("Elo Puanı: ", data.bO.bD.data.value);
                    
                }
            } catch (e) {
                // JSON parse 
            }
        });

        return ws;
    }

    // WebSocket prototipini yeni sarmalayıcıyla değiştir
    window.WebSocket = CustomWebSocket;

    // Send fonksiyonunu da sakla ve yeni fonksiyonla değiştir
    CustomWebSocket.prototype.send = function(data) {
        originalSend.apply(this, arguments);
    };

})();
