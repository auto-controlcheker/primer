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
        
        const url = `${WEB_APP_URL}?name=${encodeURIComponent(name)}&action=${encodeURIComponent(action)}&lat=${lat}&lon=${lon}&deviceId=${deviceId}`;

        // Убрали no-cors, используем дефолтный GET
        fetch(url)
        .then(res => res.text())
        .then(status => {
            if (status.includes("Ошибка")) {
                alert("❌ " + status);
            } else if (status.includes("Далеко")) {
                alert("📍 " + status + ". Подойдите ближе!");
            } else {
                alert("✅ Записано: " + action);
                // Можно закрыть модалку тут
                resetWorker(); 
            }
            btn.innerText = originalText;
            btn.disabled = false;
        })
        .catch(err => {
            alert("📡 Ошибка сети. Проверьте интернет.");
            btn.innerText = originalText;
            btn.disabled = false;
        });
        
    }, function(err) {
        alert("📍 Нужно разрешить доступ к GPS!");
        btn.innerText = originalText;
        btn.disabled = false;
    }, { enableHighAccuracy: true, timeout: 10000 });
}
