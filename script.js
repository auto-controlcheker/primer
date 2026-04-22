const WEB_APP_URL = "ТВОЯ_ССЫЛКА_ИЗ_GOOGLE_DEPLOY"; // Убедись, что она с /exec на конце
let currentEmployee = "";

function openModal(name) {
    currentEmployee = name;
    document.getElementById('selectedName').innerText = name;
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('status').innerText = "";
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function processAction(action) {
    const status = document.getElementById('status');
    status.innerText = "⏳ Запись...";
    
    navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        
        // Формируем параметры для Google Script (именно так их ждет твой код)
        const params = new URLSearchParams({
            name: currentEmployee,
            action: action,
            lat: lat,
            lon: lon,
            deviceId: "web-client"
        });

        // Отправляем GET запрос (твой doGet подхватит это)
        fetch(`${WEB_APP_URL}?${params.toString()}`, {
            method: "GET",
            mode: "no-cors"
        })
        .then(() => {
            status.innerText = "✅ Записано!";
            status.style.color = "green";
            setTimeout(closeModal, 1500);
        })
        .catch(err => {
            status.innerText = "❌ Ошибка сети";
            status.style.color = "red";
        });

    }, err => {
        status.innerText = "❌ ВКЛЮЧИТЕ GPS!";
        status.style.color = "red";
    }, { enableHighAccuracy: true });
}
