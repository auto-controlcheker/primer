<script>
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby5jy3yxVj-gUvGF8tPX3puWvOT1OGWCnWFmk4OJzyXKBuEvWX9pYtG4vMHKOCoQ01kRQ/exec";
const SECRET = "super_secret_code_777";

// 🔐 функция подписи (HMAC SHA-256)
async function generateSignature(message, secret) {
    const enc = new TextEncoder();

    const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const sig = await crypto.subtle.sign(
        "HMAC",
        key,
        enc.encode(message)
    );

    return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

// 🚀 ТВОЯ функция отправки (обновленная)
async function sendToSheet(action, event) {
    const name = localStorage.getItem('staff_name');
    const btn = event.target;

    btn.dataset.originalText = btn.innerText;
    btn.innerText = "⏳...";
    btn.disabled = true;

    navigator.geolocation.getCurrentPosition(async position => {

        let deviceId = localStorage.getItem('device_fingerprint') 
            || 'dev-' + Math.random().toString(36).substr(2, 9);

        localStorage.setItem('device_fingerprint', deviceId);

        const timestamp = Date.now().toString();

        const payload = name + action + timestamp + deviceId;

        const signature = await generateSignature(payload, SECRET);

        const query = `?name=${encodeURIComponent(name)}
        &action=${encodeURIComponent(action)}
        &lat=${position.coords.latitude}
        &lon=${position.coords.longitude}
        &deviceId=${deviceId}
        &ts=${timestamp}
        &sig=${encodeURIComponent(signature)}`;

        addScript(WEB_APP_URL + query);

    }, () => {
        btn.disabled = false;
        btn.innerText = btn.dataset.originalText;
        alert("📍 Включите GPS");
    });
}
</script>
