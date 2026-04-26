const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby8YA-AdJj3cEq2so05pur4ZsiFziEE_owOo3HYfztju4nAyKjtz5AQKEVqoMjaMxfIRw/exec"; 
const SECRET_KEY = "super_secret_code_777"; 

// 1. ЗАГРУЗКА ИМЕН ИЗ ТАБЛИЦЫ ПРИ ЗАПУСКЕ
window.onload = function() {
    loadStaffNames();
};

function loadStaffNames() {
    const grid = document.querySelector('.staff-grid');
    if (!grid) return;

    grid.innerHTML = "<p style='color:white; grid-column: 1/-1; text-align:center;'>Загрузка сотрудников...</p>";

    // Создаем временную функцию для JSONP ответа
    window.callback = function(response) {
        try {
            const names = JSON.parse(response);
            grid.innerHTML = ""; // Очищаем текст загрузки

            names.forEach(name => {
                const btn = document.createElement('button');
                btn.className = 'name-btn';
                btn.innerText = name;
                btn.onclick = () => selectMe(name);
                grid.appendChild(btn);
            });

            // После загрузки кнопок проверяем, выбран ли кто-то
            const savedName = localStorage.getItem('staff_name');
            if (savedName) showModal(savedName);

        } catch (e) {
            grid.innerHTML = "<p style='color:red; grid-column: 1/-1;'>Ошибка данных</p>";
        }
        cleanupJSONP('jsonp_load');
    };

    const script = document.createElement('script');
    script.id = 'jsonp_load';
    script.src = `${WEB_APP_URL}?getStaff=true`;
    script.onerror = () => {
        grid.innerHTML = "<p style='color:red; grid-column: 1/-1;'>Ошибка сети</p>";
    };
    document.body.appendChild(script);
}

// 2. ОТПРАВКА ДАННЫХ (ПРИШЕЛ/УШЕЛ)
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
        
        window.callback = function(status) {
            btn.innerText = originalText;
            btn.disabled = false;

            if (status.includes("SUCCESS_OPEN")) {
                alert("✅ Смена открыта! Удачного рабочего дня.");
            } else if (status.includes("SUCCESS_CLOSE")) {
                alert("🚩 Смена закрыта! Отдыхайте.");
            } else if (status.includes("ALREADY_OPENED")) {
                alert("⚠️ Смена УЖЕ открыта!");
            } else if (status.includes("ALREADY_CLOSED_TODAY")) {
                alert("🚫 Смена сегодня уже была закрыта.");
            } else if (status.includes("MUST_OPEN_FIRST")) {
                alert("❌ Сперва нужно открыть смену!");
            } else if (status.includes("TOO_FAR")) {
                let dist = status.split("|")[1] || "много";
                alert("📍 Вы слишком далеко (" + dist + "м)!");
            } else if (status.includes("AUTH_ERROR")) {
                alert("🔒 Ошибка ключа.");
            } else {
                alert("📡 Статус: " + status);
            }

            cleanupJSONP('jsonp_script');
        };

        const query = `?name=${encodeURIComponent(name)}&action=${encodeURIComponent(action)}&lat=${lat}&lon=${lon}&deviceId=${deviceId}&key=${SECRET_KEY}`;

        const script = document.createElement('script');
        script.id = 'jsonp_script';
        script.src = WEB_APP_URL + query;
        script.onerror = function() {
            btn.innerText = originalText;
            btn.disabled = false;
            alert("❌ Ошибка связи!");
        };
        document.body.appendChild(script);

    }, function(err) {
        btn.innerText = originalText;
        btn.disabled = false;
        alert("📍 Включите геопозицию (GPS)!");
    }, { enableHighAccuracy: true, timeout: 10000 });
}

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function cleanupJSONP(id) {
    const oldScript = document.getElementById(id);
    if (oldScript) oldScript.remove();
    delete window.callback;
}

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
