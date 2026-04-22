const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyHt_NjabqD1W_o6BSAYPUAkAwceVihuvTG0YemfhHsBwAHIC-ZKchOfSD__TVWA4zVUg/exec";

function sendData(action) {
    const name = document.getElementById('nameSelect').value;
    const status = document.getElementById('status');
    status.innerText = "⏳ Отправка...";
    status.style.color = "orange";

    navigator.geolocation.getCurrentPosition(pos => {
        const payload = {
            name: name,
            action: action,
            lat: pos.coords.latitude,
            long: pos.coords.longitude
        };

        fetch(WEB_APP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(() => {
            status.innerText = "✅ " + action + ": " + name;
            status.style.color = "green";
        })
        .catch(e => {
            status.innerText = "❌ Ошибка сети";
            status.style.color = "red";
        });

    }, err => {
        status.innerText = "❌ Включи ГЕОЛОКАЦИЮ!";
        status.style.color = "red";
    }, { enableHighAccuracy: true });
}
