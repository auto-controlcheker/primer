const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby5jy3yxVj-gUvGF8tPX3puWvOT1OGWCnWFmk4OJzyXKBuEvWX9pYtG4vMHKOCoQ01kRQ/exec"; 
const SECRET_KEY = "super_secret_code_777"; 

window.onload = function() {
    loadStaffNames();
};

function loadStaffNames() {
    const grid = document.querySelector('.staff-grid');
    if (!grid) return;

    grid.innerHTML = "<p style='color:white;'>Загрузка...</p>";

    // Создаем временную функцию колбэка
    window.callback = function(response) {
        try {
            const names = JSON.parse(response);
            grid.innerHTML = ""; 

            if (names.length === 0) {
                grid.innerHTML = "<p style='color:white;'>Сотрудники не найдены</p>";
                return;
            }

            names.forEach(name => {
                const btn = document.createElement('button');
                btn.className = 'name-btn';
                btn.innerText = name;
                btn.onclick = () => {
                    localStorage.setItem('staff_name', name);
                    showModal(name);
                };
                grid.appendChild(btn);
            });

            // Проверка, если уже залогинен
            const savedName = localStorage.getItem('staff_name');
            if (savedName) showModal(savedName);
            
        } catch (e) {
            console.error("Ошибка парсинга:", e);
            grid.innerHTML = "<p style='color:red;'>Ошибка данных</p>";
        }
    };

    addScript(WEB_APP_URL + "?getStaff=true");
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
            alert("Статус: " + status);
        };

        const query = `?name=${encodeURIComponent(name)}&action=${encodeURIComponent(action)}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&deviceId=${deviceId}&key=${SECRET_KEY}`;
        addScript(WEB_APP_URL + query);
    }, function() {
        btn.innerText = originalText;
        btn.disabled = false;
        alert("Включите GPS");
    });
}

// Вспомогательная функция для добавления скрипта
function addScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => script.remove(); // Удаляем за собой
    document.body.appendChild(script);
}

function showModal(name) {
    const modal = document.getElementById('passContainer');
    const nameLabel = document.getElementById('workerName');
    if (modal && nameLabel) {
        nameLabel.innerText = name;
        modal.style.display = 'flex';
    }
}
