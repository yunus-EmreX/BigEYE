(function() {
    'use strict';

    // Websocket bağlantılarını depolamak için bir dizi oluşturun
    let sockets = [];

    // WebSocket nesnesinin üzerine bir özellik ekleyerek, mesajları işlemek için bir işlev tanımlayın
    const wrapWebSocket = () => {
        const OldWebSocket = window.WebSocket;

        function NewWebSocket(url, protocols) {
            const ws = new OldWebSocket(url, protocols);
            sockets.push(ws);

            // Orijinal WebSocket'in mesaj işleyicilerini yeniden tanımlayın
            const oldSend = ws.send;
            ws.send = function(data) {
                console.log('Sent:', data);
                oldSend.apply(this, arguments);
            };

            ws.addEventListener('message', function(event) {
                console.log('Received:', event.data);
                // Ekrana mesajı yazdırın
                displayMessage(event.data);
            });

            return ws;
        }

        window.WebSocket = NewWebSocket;
    };

    // HTML içine bir div ekleyerek mesajları gösterme işlevi
    const displayMessage = (message) => {
        const container = document.createElement('div');
        container.textContent = message;
        container.style.padding = '5px';
        container.style.margin = '5px';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        document.body.appendChild(container);
    };

    // WebSocketleri sarmalayın
    wrapWebSocket();
})();
