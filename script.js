function sendToSheet(action) {
    const name = localStorage.getItem('staff_name');
    const btn = event.target;
    const originalText = btn.innerText;
    
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
        
        // ВАЖНО: используем trim() и убеждаемся, что передаем чистый текст
        const cleanAction = action.trim();
        
        const query = "?name=" + encodeURIComponent(name) + 
                      "&action=" + encodeURIComponent(cleanAction) + 
                      "&lat=" + lat + 
                      "&lon=" + lon +
                      "&deviceId=" + deviceId;

        fetch(WEB_APP_URL + query, { 
            method: 'POST',
            mode: 'no-cors' 
        })
        .then(() => {
            alert("✅ Записано: " + cleanAction);
            btn.innerText = originalText;
            btn.disabled = false;
            // Убираем авто-закрытие, чтобы ты успел увидеть алерт
        })
        .catch(err => {
            alert("✅ Отправлено (проверьте таблицу)");
            btn.innerText = originalText;
            btn.disabled = false;
        });
        
    }, function(err) {
        alert("📍 Включите GPS!");
        btn.innerText = originalText;
        btn.disabled = false;
    }, { enableHighAccuracy: true });
}
