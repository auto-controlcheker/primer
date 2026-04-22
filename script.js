const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby8YA-AdJj3cEq2so05pur4ZsiFziEE_owOo3HYfztju4nAyKjtz5AQKEVqoMjaMxfIRw/exec"; // Проверь, что /exec на конце
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
        
        // Создаем невидимую форму, как это делает Тильда
        const url = `${WEB_APP_URL}?name=${encodeURIComponent(currentEmployee)}&action=${encodeURIComponent(action)}&lat=${lat}&lon=${lon}&deviceId=web-client`;

        // Создаем скрытый элемент <img> для отправки GET-запроса в обход всех защит CORS
        const img = new Image();
        img.src = url;
        
        // Google Script всегда вернет ошибку загрузки картинки (потому что он вернет текст), 
        // но запрос ДОЙДЕТ до таблицы. Это самый старый и надежный хак.
        img.onload = img.onerror = function() {
            status.innerText = "✅ Записано!";
            status.style.color = "green";
            setTimeout(closeModal, 1500);
        };

    }, err => {
        status.innerText = "❌ ВКЛЮЧИТЕ GPS!";
        status.style.color = "red";
    }, { enableHighAccuracy: true });
}
