const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby8YA-AdJj3cEq2so05pur4ZsiFziEE_owOo3HYfztju4nAyKjtz5AQKEVqoMjaMxfIRw/exec"; 
const SECRET_KEY = "super_secret_code_777"; 

window.onload = function() {
    console.log("Страница загружена, запрашиваю имена...");
    loadStaffNames();
};

function loadStaffNames() {
    const grid = document.querySelector('.staff-grid');
    if (!grid) {
        console.error("Критическая ошибка: .staff-grid не найден в HTML!");
        return;
    }

    grid.innerHTML = "<p style='color:white; text-align:center;'>Загрузка сотрудников...</p>";

    // Глобальная функция для ответа
    window.callback = function(response) {
        console.log("Данные от Google получены:", response);
        const names = JSON.parse(response);
        grid.innerHTML = ""; 

        names.forEach(name => {
            const btn = document.createElement('button');
            btn.className = 'name-btn';
            btn.innerText = name;
            btn.onclick = function() { selectMe(name); };
            grid.appendChild(btn);
        });

        const savedName = localStorage.getItem('staff_name');
        if (savedName) showModal(savedName);
    };

    const script = document.createElement('script');
    script.src = WEB_APP_URL + "?getStaff=true";
    script.onerror = function() {
        console.error("Ошибка загрузки скрипта от Google. Проверьте ссылку или права доступа.");
        grid.innerHTML = "<p style='color:red;'>Ошибка сети</p>";
    };
    document.body.appendChild(script);
}

function sendToSheet(action, e) {
    const name = localStorage.getItem('staff_name');
    const btn = e.target;
    const originalText = btn.innerText;
    let deviceId = localStorage.getItem('device_fingerprint') || 'dev-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('device_fingerprint', deviceId);

    btn.innerText = "ПРОВЕРКА...";
    btn.disabled = true;

    navigator.geolocation.getCurrentPosition(function(position) {
        window.callback = function(status) {
            btn.innerText = originalText;
            btn.disabled = false;
            alert("Результат: " + status);
        };

        const query = "?name=" + encodeURIComponent(name) + "&action=" + encodeURIComponent(action) + "&lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&deviceId=" + deviceId + "&key=" + SECRET_KEY;
        const script = document.createElement('script');
        script.src = WEB_APP_URL + query;
        document.body.appendChild(script);
    }, function() {
        btn.innerText = originalText;
        btn.disabled = false;
        alert("Включите GPS");
    });
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
