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
        const query = `?name=${encodeURIComponent(name)}&action=${encodeURIComponent(action)}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&deviceId=${deviceId}&key=${SECRET_KEY}`;

        fetch(WEB_APP_URL + query)
        .then(res => res.text())
        .then(status => {
            btn.innerText = originalText;
            btn.disabled = false;

            if (status === "SUCCESS_OPEN") {
                alert("✅ Смена открыта! Удачного рабочего дня.");
            } else if (status === "SUCCESS_CLOSE") {
                alert("🚩 Смена закрыта! Отдыхайте.");
            } else if (status === "ALREADY_OPENED") {
                alert("⚠️ Смена УЖЕ открыта! Не нужно нажимать дважды.");
            } else if (status === "ALREADY_CLOSED_TODAY") {
                alert("🚫 Смена УЖЕ была закрыта сегодня. Повторное открытие невозможно.");
            } else if (status === "MUST_OPEN_FIRST") {
                alert("❌ Ошибка: Сперва нужно открыть смену!");
            } else if (status.includes("TOO_FAR")) {
                let dist = status.split("|")[1];
                alert("📍 Вы слишком далеко (" + dist + "м). Нужно быть на торговой точке!");
            } else if (status === "AUTH_ERROR") {
                alert("🔒 Ошибка доступа: неверный ключ.");
            } else {
                alert("📡 Ответ системы: " + status);
            }
        })
        .catch(err => {
            btn.innerText = originalText;
            btn.disabled = false;
            alert("❌ Ошибка соединения! Проверьте интернет. Данные НЕ ушли.");
        });
        
    }, function(err) {
        btn.innerText = originalText;
        btn.disabled = false;
        alert("📍 Включите геопозицию (GPS) в настройках телефона и браузера!");
    }, { enableHighAccuracy: true, timeout: 10000 });
}
}
