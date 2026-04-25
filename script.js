const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby8YA-AdJj3cEq2so05pur4ZsiFziEE_owOo3HYfztju4nAyKjtz5AQKEVqoMjaMxfIRw/exec";
const SECRET_KEY = "super_secret_code_777"; 

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
    const modal = document.getElementById('passContainer');
    const nameLabel = document.getElementById('workerName');
    if (modal && nameLabel) {
        nameLabel.innerText = name;
        modal.style.display = 'flex';
    } else {
        console.error("Ошибка: Элементы модального окна не найдены в HTML");
    }
}

function resetWorker() {
    localStorage.removeItem('staff_name');
    document.getElementById('passContainer').style.display = 'none';
}

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
        const query = `?name=${encodeURIComponent(name)}&action=${encodeURIComponent(action)}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&deviceId=${deviceId}&key=${SECRET_KEY}`;

        fetch(WEB_APP_URL + query)
        .then(res => res.text())
        .then(status => {
            btn.innerText = originalText;
            btn.disabled = false;
            
            // Логика алертов
            if (status === "SUCCESS_OPEN") alert("✅ Смена открыта!");
            else if (status === "SUCCESS_CLOSE") alert("🚩 Смена закрыта!");
            else if (status === "ALREADY_OPENED") alert("⚠️ Смена УЖЕ открыта!");
            else if (status === "ALREADY_CLOSED_TODAY") alert("🚫 Смена УЖЕ была закрыта сегодня.");
            else if (status === "MUST_OPEN_FIRST") alert("❌ Сперва нужно открыть смену!");
            else if (status.includes("TOO_FAR")) alert("📍 Вы слишком далеко!");
            else alert("📡 Статус: " + status);
        })
        .catch(err => {
            btn.innerText = originalText;
            btn.disabled = false;
            alert("❌ Ошибка соединения!");
        });
        
    }, function(err) {
        btn.innerText = originalText;
        btn.disabled = false;
        alert("📍 Включите GPS!");
    }, { enableHighAccuracy: true, timeout: 10000 });
}
