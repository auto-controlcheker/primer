const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby5jy3yxVj-gUvGF8tPX3puWvOT1OGWCnWFmk4OJzyXKBuEvWX9pYtG4vMHKOCoQ01kRQ/exec"; 
const SECRET_KEY = "super_secret_code_777"; 

// Глобальный обработчик ответов
window.callback = function(status) {
    console.log("Ответ от сервера:", status);
    
    // Если пришел список имен (массив)
    if (status.startsWith("[")) {
        renderStaff(JSON.parse(status));
        return;
    }

    // Если пришел статус действия
    handleActionStatus(status);
};

function loadStaffNames() {
    const grid = document.querySelector('.staff-grid');
    if (grid) grid.innerHTML = "<p style='color:white;'>Загрузка...</p>";
    addScript(WEB_APP_URL + "?getStaff=true");
}

function renderStaff(names) {
    const grid = document.querySelector('.staff-grid');
    if (!grid) return;
    grid.innerHTML = "";
    names.forEach(name => {
        const btn = document.createElement('button');
        btn.className = 'name-btn';
        btn.innerText = name;
        btn.onclick = () => {
            localStorage.setItem('staff_name', name);
            document.getElementById('workerName').innerText = name;
            document.getElementById('passContainer').style.display = 'flex';
        };
        grid.appendChild(btn);
    });
}

function handleActionStatus(status) {
    // Возвращаем кнопки в активное состояние
    const btns = document.querySelectorAll('.action-btn');
    btns.forEach(b => { b.disabled = false; b.innerText = b.dataset.originalText; });

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
    
    // Закрываем модалку после успеха
    if (status.includes("SUCCESS")) {
        document.getElementById('passContainer').style.display = 'none';
    }
}

function sendToSheet(action, event) {
    const name = localStorage.getItem('staff_name');
    const btn = event.target;
    btn.dataset.originalText = btn.innerText;
    btn.innerText = "ПРОВЕРКА...";
    btn.disabled = true;

    navigator.geolocation.getCurrentPosition(function(position) {
        let deviceId = localStorage.getItem('device_fingerprint') || 'dev-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('device_fingerprint', deviceId);

        const query = `?name=${encodeURIComponent(name)}&action=${encodeURIComponent(action)}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&deviceId=${deviceId}&key=${SECRET_KEY}`;
        addScript(WEB_APP_URL + query);
    }, function() {
        btn.disabled = false;
        btn.innerText = btn.dataset.originalText;
        alert("📍 Пожалуйста, включите GPS для отметки.");
    });
}

function addScript(src) {
    const oldScript = document.getElementById('google-connector');
    if (oldScript) oldScript.remove(); // Удаляем старый запрос

    const script = document.createElement('script');
    script.id = 'google-connector';
    script.src = src + "&t=" + new Date().getTime();
    document.body.appendChild(script);
}

window.onload = loadStaffNames;
