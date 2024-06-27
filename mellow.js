(function() {
    // Store original functions
    const originalFunctions = {};

    // Function to log calls and their arguments
    function logFunctionCall(funcName, args) {
        console.log(`Function called: ${funcName}`, args);
        logRelatedWebSocketData();
    }

   
  
  // Function to override and log function calls
    function overrideFunction(obj, funcName) {
        originalFunctions[funcName] = obj[funcName];
        obj[funcName] = function(...args) {
            logFunctionCall(funcName, args);
            return originalFunctions[funcName].apply(this, args);
        };
    }

    // List of global functions to override
    const globalFunctions = ['fetch', 'setTimeout', 'setInterval'];

    // Override global functions
    globalFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            overrideFunction(window, funcName);
        }
    });

    // Override all functions of a specific object (like console)
    function overrideAllFunctions(obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'function') {
                overrideFunction(obj, key);
            }
        }
    }

    // Example: Override all console methods
    overrideAllFunctions(console);
})();

// WebSocket Logger
(function() {
    const originalWebSocket = window.WebSocket;
    const wsDataLog = [];

    // Function to log WebSocket messages
    function logWebSocketData(type, data) {
        const timestamp = new Date().toISOString();
        const logEntry = { type, data, timestamp };
        wsDataLog.push(logEntry);
        console.log(`WebSocket ${type}:`, data);
    }

    // Function to log related WebSocket data
    window.logRelatedWebSocketData = function() {
        const currentTimestamp = new Date().toISOString();
        const relatedWsData = wsDataLog.filter(entry => entry.timestamp >= currentTimestamp);
        if (relatedWsData.length > 0) {
            console.log('Related WebSocket data:', relatedWsData);
        }
    }

    // Override WebSocket constructor
    function CustomWebSocket(url, protocols) {
        const ws = new originalWebSocket(url, protocols);

        ws.addEventListener('open', function(event) {
            logWebSocketData('open', event);
        });

        ws.addEventListener('message', function(event) {
            logWebSocketData('message', event.data);
        });

        ws.addEventListener('close', function(event) {
            logWebSocketData('close', event);
        });

        ws.addEventListener('error', function(event) {
            logWebSocketData('error', event);
        });

        const originalSend = ws.send;
        ws.send = function(data) {
            logWebSocketData('send', data);
            originalSend.call(this, data);
        };

        return ws;
    }

    // Override global WebSocket object
    window.WebSocket = CustomWebSocket;
})();

console.log('Logging setup complete.');
