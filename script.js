const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby5jy3yxVj-gUvGF8tPX3puWvOT1OGWCnWFmk4OJzyXKBuEvWX9pYtG4vMHKOCoQ01kRQ/exec"; 
const SECRET_KEY = "super_secret_code_777"; 

// 1. Глобальный колбэк для загрузки имен
window.callback = function(response) {
    const grid = document.querySelector('.staff-grid');
    if (!grid) return;
    
    try {
        const names = JSON.parse(response);
        grid.innerHTML = ""; 

        names.forEach(name => {
            const btn = document.createElement('button');
            btn.className = 'name-btn';
            btn.innerText = name;
            // Используем стандартный слушатель событий
            btn.addEventListener('click', function() {
                console.log("Нажата кнопка:", name);
                selectMe(name);
            });
            grid.appendChild(btn);
        });

        const savedName = localStorage.getItem('staff_name');
        if (savedName) showModal(savedName);
    } catch (e) {
        console.error("Ошибка при получении списка:", e);
        grid.innerHTML = "Ошибка данных";
    }
};

window.onload = function() {
    loadStaffNames();
};

function loadStaffNames() {
    const grid = document.querySelector('.staff-grid');
    if (grid) grid.innerHTML = "Загрузка...";
    
    const script = document.createElement('script');
    script.src = WEB_APP_URL + "?getStaff=true&v=" + Math.random();
    document.body.appendChild(script);
}

function selectMe(name) {
    localStorage.setItem('staff_name', name);
    showModal(name);
}

function showModal(name) {
    const modal = document.getElementById('passContainer');
    const nameLabel = document.getElementById('workerName');
    
    console.log("Попытка открыть модалку для:", name);
    
    if (modal && nameLabel) {
        nameLabel.innerText = name;
        modal.style.display = 'flex'; // Убедитесь, что в CSS нет !important, который мешает
    } else {
        console.error("Элементы модального окна не найдены! Проверьте ID в HTML.");
        alert("Ошибка: не найдено окно подтверждения (ID: passContainer)");
    }
}

// Функция для кнопок внутри модалки (Пришел/Ушел)
function sendToSheet(action, event) {
    const name = localStorage.getItem('staff_name');
    if (!name) return;

    const btn = event.target;
    const originalText = btn.innerText;
    let deviceId = localStorage.getItem('device_fingerprint') || 'dev-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('device_fingerprint', deviceId);

    btn.innerText = "СВЯЗЬ...";
    btn.disabled = true;

    navigator.geolocation.getCurrentPosition(function(position) {
        // Меняем колбэк для обработки результата записи
        window.callback = function(status) {
            btn.innerText = originalText;
            btn.disabled = false;
            alert("Результат: " + status);
            // Возвращаем колбэк обратно для загрузки (на случай обновления)
            loadStaffNames(); 
        };

        const query = `?name=${encodeURIComponent(name)}&action=${encodeURIComponent(action)}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&deviceId=${deviceId}&key=${SECRET_KEY}`;
        const script = document.createElement('script');
        script.src = WEB_APP_URL + query;
        document.body.appendChild(script);
    }, function(err) {
        btn.innerText = originalText;
        btn.disabled = false;
        alert("Ошибка GPS: пожалуйста, разрешите доступ к геопозиции");
    });
}
