const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby8YA-AdJj3cEq2so05pur4ZsiFziEE_owOo3HYfztju4nAyKjtz5AQKEVqoMjaMxfIRw/exec";
const SECRET_KEY = "super_secret_code_777"; // Ключ должен быть таким же, как в Google Script

// При загрузке проверяем, не выбран ли уже сотрудник ранее
window.onload = function() {
    const savedName = localStorage.getItem('staff_name');
    if (savedName) {
        showModal(savedName);
    }
};

function selectMe(name) {
    localStorage.setItem('staff_name', name);
    showModal(name);
}

function showModal(name) {
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
        
        // Формируем URL для GET запроса с добавлением ключа &key=...
        const query = `?name=${encodeURIComponent(name)}&action=${encodeURIComponent(action)}&lat=${lat}&lon=${lon}&deviceId=${deviceId}&key=${SECRET_KEY}`;

        fetch(WEB_APP_URL + query)
        .then(res => res.text())
        .then(status => {
            if (status.includes("Ошибка")) {
                alert("❌ " + status);
            } else if (status.includes("Далеко")) {
                alert("📍 " + status + "\nНужно быть на торговой точке!");
            } else if (status === "OK") {
                alert("✅ Успешно: " + action);
            } else {
                alert("Ответ сервера: " + status);
            }
            btn.innerText = originalText;
            btn.disabled = false;
        })
        .catch(err => {
            console.error(err);
            alert("📡 Ошибка связи. Проверьте интернет или ссылку на скрипт.");
            btn.innerText = originalText;
            btn.disabled = false;
        });
        
    }, function(err) {
        alert("📍 Ошибка GPS! Включите геопозицию в настройках телефона и браузера.");
        btn.innerText = originalText;
        btn.disabled = false;
    }, { enableHighAccuracy: true, timeout: 10000 });
}
