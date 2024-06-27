(function() {
    'use strict';

    const OriginalWebSocket = window.WebSocket;
    let sockets = [];
    let useProxy = false;

    window.WebSocket = function(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);
        sockets.push(ws);

        ws.addEventListener('close', function() {
            sockets = sockets.filter(s => s !== ws);
        });

        if (useProxy) {
            const originalSend = ws.send;
            ws.send = function(data) {
                fetch('http://localhost:8080/proxy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ direction: 'client-to-server', data: data })
                })
                .then(response => response.json())
                .then(modifiedData => {
                    originalSend.call(ws, modifiedData.data);
                });
            };

            ws.addEventListener('message', function(event) {
                fetch('http://localhost:8080/proxy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ direction: 'server-to-client', data: event.data })
                })
                .then(response => response.json())
                .then(modifiedData => {
                    const modifiedEvent = new MessageEvent('message', {
                        data: modifiedData.data
                    });
                    ws.dispatchEvent(modifiedEvent);
                });
            });
        }

        return ws;
    };

    window.WebSocket.prototype = OriginalWebSocket.prototype;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '9999';

    const buttonA = document.createElement('button');
    buttonA.textContent = 'A - Dondur';
    buttonA.onclick = function() {
        sockets.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.addEventListener('message', freezeEvent, true);
                ws.addEventListener('send', freezeEvent, true);
            }
        });
    };

    const buttonB = document.createElement('button');
    buttonB.textContent = 'B - Kapat';
    buttonB.onclick = function() {
        sockets.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        });
    };

    const buttonC = document.createElement('button');
    buttonC.textContent = 'C - Yalnızca Gidişi Kes';
    buttonC.onclick = function() {
        sockets.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                const originalSend = ws.send;
                ws.send = function() {
                    console.log('Blocked message to server:', arguments);
                };
            }
        });
    };

    const buttonHell = document.createElement('button');
    buttonHell.textContent = 'Hell';
    buttonHell.onclick = function() {
        useProxy = !useProxy;
        if (useProxy) {
            alert('WebSocket traffic is now routed through the proxy.');
        } else {
            alert('WebSocket traffic is now normal.');
        }
    };

    container.appendChild(buttonA);
    container.appendChild(buttonB);
    container.appendChild(buttonC);
    container.appendChild(buttonHell);
    document.body.appendChild(container);

    function freezeEvent(event) {
        event.stopImmediatePropagation();
        console.log('Frozen event:', event);
    }
})();
