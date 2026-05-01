const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby5jy3yxVj-gUvGF8tPX3puWvOT1OGWCnWFmk4OJzyXKBuEvWX9pYtG4vMHKOCoQ01kRQ/exec"; 
const SECRET_KEY = "super_secret_code_777"; 

window.callback = function(status) {
    if (status.startsWith("[")) {
        renderStaff(JSON.parse(status));
        return;
    }
    handleActionStatus(status);
};

// Исправленный блок загрузки: проверяет сохраненное имя
window.onload = function() {
    loadStaffNames(); 
    
    const savedName = localStorage.getItem('staff_name');
    if (savedName) {
        openModal(savedName);
    }
};

function loadStaffNames() {
    addScript(WEB_APP_URL + "?getStaff=true");
}

function renderStaff(names) {
    const grid = document.getElementById('staffGrid');
    if (!grid) return;
    
    grid.style.opacity = '0';
    setTimeout(() => {
        grid.innerHTML = "";
        names.forEach(name => {
            const btn = document.createElement('button');
            btn.className = 'name-btn';
            btn.innerText = name;
            btn.onclick = () => openModal(name); // Используем функцию открытия
            grid.appendChild(btn);
        });
        grid.style.opacity = '1';
    }, 300);
}

// Новая функция открытия модалки с сохранением в память
function openModal(name) {
    const modal = document.getElementById('passContainer');
    const nameLabel = document.getElementById('workerName');
    if (modal && nameLabel) {
        localStorage.setItem('staff_name', name); // Запоминаем выбор
        nameLabel.innerText = name;
        modal.style.display = 'flex';
    }
}

function handleActionStatus(status) {
    const btns = document.querySelectorAll('.action-btn');
    btns.forEach(b => { b.disabled = false; b.innerText = b.dataset.originalText || b.innerText; });

    const alerts = {
        "SUCCESS_OPEN": "✅ Смена открыта! Удачного рабочего дня.",
        "SUCCESS_CLOSE": "🚩 Смена закрыта! Отдыхайте.",
        "ALREADY_OPENED": "⚠️ Смена УЖЕ открыта!",
        "ALREADY_CLOSED_TODAY": "🚫 Смена уже была закрыта сегодня.",
        "MUST_OPEN_FIRST": "❌ Сперва нужно открыть смену!",
        "AUTH_ERROR": "🔒 Ошибка доступа."
    };

    let msg = alerts[status] || "📡 Статус: " + status;
    if (status.includes("TOO_FAR")) msg = "📍 Вы слишком далеко!";
    
    alert(msg);
    if (status.includes("SUCCESS")) {
        closeModal();
    }
}

function sendToSheet(action, event) {
    const name = localStorage.getItem('staff_name');
    const btn = event.target;
    btn.dataset.originalText = btn.innerText;
    btn.innerText = "⏳...";
    btn.disabled = true;

    navigator.geolocation.getCurrentPosition(position => {
        let deviceId = localStorage.getItem('device_fingerprint') || 'dev-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('device_fingerprint', deviceId);
        // ИСПРАВЛЕНО:
const query = `?name=${encodeURIComponent(name)}&action=${encodeURIComponent(action)}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&deviceId=${deviceId}&key=${SECRET_KEY}`;
        addScript(WEB_APP_URL + query);
    }, () => {
        btn.disabled = false;
        btn.innerText = btn.dataset.originalText;
        alert("📍 Включите GPS");
    });
}

// Очищаем память при закрытии или после успешной отправки
function closeModal() {
    document.getElementById('passContainer').style.display = 'none';
    localStorage.removeItem('staff_name'); 
}

function addScript(src) {
    const old = document.getElementById('api-request');
    if (old) old.remove();
    const s = document.createElement('script');
    s.id = 'api-request';
    s.src = src + "&t=" + Date.now();
    document.body.appendChild(s);
}
