const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby8YA-AdJj3cEq2so05pur4ZsiFziEE_owOo3HYfztju4nAyKjtz5AQKEVqoMjaMxfIRw/exec"; // Проверь URL после развертывания
const SECRET_KEY = "super_secret_code_777"; 

function sendToSheet(action, e) {
    const name = localStorage.getItem('staff_name');
    const btn = e.target;
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
        
        // 1. Создаем функцию-обработчик ответа
        window.callback = function(status) {
            btn.innerText = originalText;
            btn.disabled = false;

            // 2. Логика всех твоих уведомлений
            if (status.includes("SUCCESS_OPEN")) {
                alert("✅ Смена открыта! Удачного рабочего дня.");
            } else if (status.includes("SUCCESS_CLOSE")) {
                alert("🚩 Смена закрыта! Отдыхайте.");
            } else if (status.includes("ALREADY_OPENED")) {
                alert("⚠️ Смена УЖЕ открыта! Не нужно нажимать дважды.");
            } else if (status.includes("ALREADY_CLOSED_TODAY")) {
                alert("🚫 Смена УЖЕ была закрыта сегодня. Повторное открытие невозможно.");
            } else if (status.includes("MUST_OPEN_FIRST")) {
                alert("❌ Ошибка: Сперва нужно открыть смену!");
            } else if (status.includes("TOO_FAR")) {
                let dist = status.split("|")[1] || "много";
                alert("📍 Вы слишком далеко (" + dist + "м). Нужно быть на торговой точке!");
            } else if (status.includes("AUTH_ERROR")) {
                alert("🔒 Ошибка доступа: неверный ключ.");
            } else {
                alert("📡 Статус: " + status);
            }

            // Удаляем временный скрипт после работы
            const oldScript = document.getElementById('jsonp_script');
            if (oldScript) oldScript.remove();
            delete window.callback;
        };

        // 3. Формируем запрос
        const query = `?name=${encodeURIComponent(name)}&action=${encodeURIComponent(action)}&lat=${lat}&lon=${lon}&deviceId=${deviceId}&key=${SECRET_KEY}`;

        // 4. Отправляем через тег <script>
        const script = document.createElement('script');
        script.id = 'jsonp_script';
        script.src = WEB_APP_URL + query;
        
        // Обработка ошибки загрузки (например, нет интернета)
        script.onerror = function() {
            btn.innerText = originalText;
            btn.disabled = false;
            alert("❌ Ошибка связи! Проверьте интернет.");
        };

        document.body.appendChild(script);

    }, function(err) {
        btn.innerText = originalText;
        btn.disabled = false;
        alert("📍 Включите геопозицию (GPS)!");
    }, { enableHighAccuracy: true, timeout: 10000 });
}

// Функции выбора сотрудника (без изменений)
function selectMe(name) {
    localStorage.setItem('staff_name', name);
    showModal(name);
}

function showModal(name) {
    const modal = document.getElementById('passContainer');
    const nameLabel = document.getElementById('workerName');
    if (modal && nameLabel) {
        nameLabel.innerText = name;
        modal.style.display = 'flex';
    }
}

function resetWorker() {
    localStorage.removeItem('staff_name');
    document.getElementById('passContainer').style.display = 'none';
}

window.onload = function() {
    const savedName = localStorage.getItem('staff_name');
    if (savedName) showModal(savedName);
};
