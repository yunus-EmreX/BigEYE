(function() {
    'use strict';

    // Dizileri loglamak ve manipüle etmek için yardımcı fonksiyonlar
    function logArrayContent(array, arrayName) {
        console.log(`\n${arrayName} içeriği:`);
        array.forEach((item, index) => {
            console.log(`${arrayName}[${index}]:`, item);
        });
    }

    // Fonksiyon çağrıldığında loglama ve analiz yapma
    function wrapFunction(targetObject, functionName) {
        const originalFunction = targetObject[functionName];
        targetObject[functionName] = function(...args) {
            console.log(`Fonksiyon çağrıldı: ${functionName}`);
            console.log(`Argümanlar:`, args);
            const result = originalFunction.apply(this, args);
            console.log(`Sonuç:`, result);
            return result;
        };
    }

    // Tüm dizileri ve fonksiyonları analiz etmek için ana fonksiyon
    function analyzeAndManipulate(targetObject) {
        if (targetObject) {
            // Tüm dizileri ve fonksiyonları loglayın ve sarın
            for (let key in targetObject) {
                if (Array.isArray(targetObject[key])) {
                    logArrayContent(targetObject[key], key);
                } else if (typeof targetObject[key] === 'function') {
                    wrapFunction(targetObject, key);
                }
            }

            // Örnek manipülasyonlar ve analizler
            console.log("\nManipülasyon öncesi diziler:");
            for (let key in targetObject) {
                if (Array.isArray(targetObject[key])) {
                    console.log(`${key}:`, targetObject[key]);
                }
            }

            // Dizilere sahte veriler eklemek
            if (targetObject.su) targetObject.su.push(['fakeData']);
            if (targetObject.st) targetObject.st.push('fakeData');

            console.log("\nManipülasyon sonrası diziler:");
            for (let key in targetObject) {
                if (Array.isArray(targetObject[key])) {
                    logArrayContent(targetObject[key], key);
                }
            }

            // Potansiyel güvenlik açıklarını analiz edin
            if (targetObject.su && targetObject.su.includes('unauthorizedAccess')) {
                console.warn('Potansiyel yetkisiz erişim tespit edildi!');
            }
        } else {
            console.warn('Hedef nesne bulunamadı.');
        }
    }

    // Özel fonksiyonları loglamak ve manipüle etmek
    function analyzeSpecificFunctions(targetObject) {
        if (targetObject) {
            // Hedef fonksiyonları sarın ve loglayın
            const functionNames = ['aJR', 'dA', 'pK', 'aKH', 'aKI', 'aKC', 'aKJ']; // Belirlenen fonksiyonlar
            functionNames.forEach(functionName => {
                if (typeof targetObject[functionName] === 'function') {
                    wrapFunction(targetObject, functionName);
                }
            });
        } else {
            console.warn('Hedef nesne bulunamadı.');
        }
    }

    // Belirli aralıklarla dizileri ve fonksiyonları loglamak için
    function logContinuously(targetObject, interval = 5000) {
        setInterval(() => {
            console.log("\nSürekli loglama:");
            for (let key in targetObject) {
                if (Array.isArray(targetObject[key])) {
                    logArrayContent(targetObject[key], key);
                }
            }
        }, interval);
    }

    // WebSocket mesajlarını dinlemek ve manipüle etmek
    function interceptWebSocket() {
        const OriginalWebSocket = window.WebSocket;
        window.WebSocket = function(url, protocols) {
            const ws = new OriginalWebSocket(url, protocols);

            ws.addEventListener('open', function(event) {
                console.log('WebSocket bağlantısı açıldı:', url);
            });

            ws.addEventListener('message', function(event) {
                console.log('WebSocket mesajı alındı:', event.data);
                // Gelen mesajları burada manipüle edebilirsiniz
                const parsedData = JSON.parse(event.data);
                console.log('Gelen veri:', parsedData);

                // Örneğin, gelen veriyi manipüle edelim
                if (parsedData.type === 'update') {
                    parsedData.speed *= 2; // Hız hilesi: gelen veri hızını iki katına çıkar
                    console.log('Manipüle edilmiş veri:', parsedData);
                }

                // Orijinal mesajı olduğu gibi bırakın veya manipüle edilmiş veri ile devam edin
                const manipulatedEvent = new MessageEvent('message', {
                    data: JSON.stringify(parsedData)
                });
                ws.dispatchEvent(manipulatedEvent);
            });

            const originalSend = ws.send;
            ws.send = function(data) {
                console.log('WebSocket mesajı gönderiliyor:', data);
                // Gönderilen mesajları burada manipüle edebilirsiniz
                let parsedData;
                try {
                    parsedData = JSON.parse(data);
                    if (parsedData.action === 'move') {
                        parsedData.speed *= 2; // Hız hilesi: gönderilen veri hızını iki katına çıkar
                        console.log('Manipüle edilmiş gönderilen veri:', parsedData);
                    }
                } catch (e) {
                    console.warn('Gönderilen veri JSON formatında değil:', data);
                }
                const manipulatedData = JSON.stringify(parsedData || data); // Manipüle edilmiş veri
                return originalSend.call(this, manipulatedData);
            };

            return ws;
        };
    }

    // Web sayfası yüklendiğinde belirli bir zaman sonra hedef fonksiyonları ve nesneleri analiz edin
    window.addEventListener('load', function() {
        setTimeout(function() {
            // Hedef nesneyi bulun ve analiz fonksiyonlarını çalıştırın
            var targetObject = window.myApp; // Gerçek hedefi burada belirleyin
            if (!targetObject) {
                console.warn('Hedef nesne bulunamadı. Lütfen doğru nesne adını belirleyin.');
            } else {
                analyzeAndManipulate(targetObject);
                analyzeSpecificFunctions(targetObject);
                logContinuously(targetObject, 5000); // Her 5 saniyede bir loglama
            }

            interceptWebSocket(); // WebSocket mesajlarını dinleyin ve manipüle edin
        }, 20000); // 20 saniye bekleyin, sayfanın tamamen yüklenmesi için
    });
})();
