// ==UserScript==
// @name         Function Logger and Accelerator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Logs and accelerates game functions
// @author       ShellBee
// @match        *://*/*
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    
    function sendLogToServer(log) {
        const url = 'http://localhost:3000';
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send(JSON.stringify(log));
    }

      
    function wrapFunction(obj, funcName) {
        const originalFunction = obj[funcName];
        obj[funcName] = function(...args) {
            const log = {
                functionName: funcName,
                arguments: args
            };
            const result = originalFunction.apply(this, args);
            log.returnValue = result;
            sendLogToServer(log);
            return result;
        };
    }

    for (let key in window) {
        if (typeof window[key] === 'function') {
            wrapFunction(window, key);
        }
    }

    
    if (window.game) {
        for (let key in window.game) {
            if (typeof window.game[key] === 'function') {
                wrapFunction(window.game, key);
            }
        }
    }

    function accelerateFunction(func, multiplier) {
        return function(...args) {
            for (let i = 0; i < multiplier; i++) {
                func.apply(this, args);
             }
         };
     }
  });

})();
