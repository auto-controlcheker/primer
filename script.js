const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby8YA-AdJj3cEq2so05pur4ZsiFziEE_owOo3HYfztju4nAyKjtz5AQKEVqoMjaMxfIRw/exec";
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
        const payload = {
            name: currentEmployee,
            action: action,
            lat: pos.coords.latitude,
            long: pos.coords.longitude
        };

        fetch(WEB_APP_URL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(payload)
        })
        .then(() => {
            status.innerText = "✅ Записано!";
            status.style.color = "green";
            setTimeout(closeModal, 1500); // Закрыть окно через 1.5 сек
        })
        .catch(() => {
            status.innerText = "❌ Ошибка";
            status.style.color = "red";
        });
    }, err => {
        status.innerText = "❌ ВКЛЮЧИТЕ GPS!";
        status.style.color = "red";
    }, { enableHighAccuracy: true });
}
