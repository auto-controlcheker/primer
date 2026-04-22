const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby8YA-AdJj3cEq2so05pur4ZsiFziEE_owOo3HYfztju4nAyKjtz5AQKEVqoMjaMxfIRw/exec"; // Проверь, что /exec на конце

// При загрузке проверяем, выбран ли сотрудник
window.onload = function() {
    const savedName = localStorage.getItem('staff_name');
    if (savedName) showInterface(savedName);
};

function selectMe(name) {
    localStorage.setItem('staff_name', name);
    showInterface(name);
}

function showInterface(name) {
    document.getElementById('workerName').innerText = name;
    document.getElementById('passContainer').style.display = 'flex';
}

function resetWorker() {
    localStorage.removeItem('staff_name');
    document.getElementById('passContainer').style.display = 'none';
}

function sendToSheet(action) {
    const name = localStorage.getItem('staff_name');
    const btn = event.target;
    const originalText = btn.innerText;
    
    // Генерация ID устройства как в твоем коде
    let deviceId = localStorage.getItem('device_fingerprint');
    if (!deviceId) {
        deviceId = 'dev-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('device_fingerprint', deviceId);
    }

    btn.innerText = "ПРОВЕРКА...";
    btn.disabled = true;

    navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Формируем строку запроса
        const query = "?name=" + encodeURIComponent(name) + 
                      "&action=" + encodeURIComponent(action) + 
                      "&lat=" + lat + 
                      "&lon=" + lon +
                      "&deviceId=" + deviceId;

        // Отправляем POST запрос. 
        // mode: 'no-cors' критически важен для GitHub Pages
        fetch(WEB_APP_URL + query, { 
            method: 'POST',
            mode: 'no-cors' 
        })
        .then(() => {
            // Так как в no-cors мы не видим текст ответа, 
            // просто сообщаем об успехе (как в твоем блоке catch на Тильде)
            alert("✅ Отправлено (проверьте таблицу)");
            btn.innerText = originalText;
            btn.disabled = false;
            // Скрываем окно после успеха
            setTimeout(resetWorker, 1000);
        })
        .catch(err => {
            alert("❌ Ошибка сети: " + err);
            btn.innerText = originalText;
            btn.disabled = false;
        });
        
    }, function(err) {
        alert("📍 Включите GPS в браузере!");
        btn.innerText = originalText;
        btn.disabled = false;
    }, { enableHighAccuracy: true });
}
