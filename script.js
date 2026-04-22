const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyHt_NjabqD1W_o6BSAYPUAkAwceVihuvTG0YemfhHsBwAHIC-ZKchOfSD__TVWA4zVUg/exec";

function sendData(action) {
    const name = document.getElementById('nameSelect').value;
    const status = document.getElementById('status');
    status.innerText = "⏳ Отправка...";

    // Проверяем геолокацию
    navigator.geolocation.getCurrentPosition(pos => {
        const payload = {
            name: name,
            action: action,
            lat: pos.coords.latitude,
            long: pos.coords.longitude
        };

        // Отправляем через fetch
        fetch(WEB_APP_URL, {
            method: "POST",
            mode: "no-cors", // Это важно для Google Script
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(() => {
            status.innerText = "✅ Готово: " + name + " -> " + action;
            status.style.color = "green";
        })
        .catch(e => {
            status.innerText = "❌ Ошибка сети!";
            console.error(e);
        });

    }, err => {
        status.innerText = "❌ Ошибка: Включи геолокацию в браузере!";
        status.style.color = "red";
    }, { enableHighAccuracy: true });
}
