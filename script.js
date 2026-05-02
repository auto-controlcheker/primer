(function(){
    // Собираем ссылку из кусков, чтобы не было ошибок кодировки
    const p1 = "https://script.google.com/macros/s/";
    const id = "AKfycby5jy3yxVj-gUvGF8tPX3puWvOT1OGWCnWFmk4OJzyXKBuEvWX9pYtG4vMHKOCoQ01kRQ";
    const p2 = "/exec";
    
    const _URL = p1 + id + p2;
    const _KEY = "super_secret_code_777"; 

    window.callback = function(s) {
        if (typeof s === 'object' || s.startsWith("[")) {
            _render(Array.isArray(s) ? s : JSON.parse(s));
            return;
        }
        _handle(s);
    };

    window.onload = function() {
        _send(_URL + "?getStaff=true");
        const n = localStorage.getItem('staff_name');
        if (n) _open(n);
    };

    function _render(ns) {
        const g = document.getElementById('staffGrid');
        if (!g) return;
        g.style.opacity = '0';
        setTimeout(() => {
            g.innerHTML = "";
            ns.forEach(n => {
                const b = document.createElement('button');
                b.className = 'name-btn'; b.innerText = n;
                b.onclick = () => _open(n);
                g.appendChild(b);
            });
            g.style.opacity = '1';
        }, 300);
    }

    function _open(n) {
        const m = document.getElementById('passContainer'), l = document.getElementById('workerName');
        if (m && l) { localStorage.setItem('staff_name', n); l.innerText = n; m.style.display = 'flex'; }
    }

    function _handle(s) {
        const bs = document.querySelectorAll('.action-btn');
        bs.forEach(b => { b.disabled = false; b.innerText = b.dataset.o || b.innerText; });
        const a = { "SUCCESS_OPEN": "✅ Открыто!", "SUCCESS_CLOSE": "🚩 Закрыто!", "AUTH_ERROR": "🔒 Ошибка ключа" };
        alert(a[s] || "📡 Статус: " + s);
        if (s.includes("SUCCESS")) _close();
    }

    window.sendToSheet = function(ac, e) {
        const n = localStorage.getItem('staff_name'), b = e.target;
        b.dataset.o = b.innerText; b.innerText = "⏳..."; b.disabled = true;
        navigator.geolocation.getCurrentPosition(p => {
            let d = localStorage.getItem('df') || 'dev-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('df', d);
            const q = `?name=${encodeURIComponent(n)}&action=${encodeURIComponent(ac)}&lat=${p.coords.latitude}&lon=${p.coords.longitude}&deviceId=${d}&key=${_KEY}`;
            _send(_URL + q);
        }, () => { b.disabled = false; b.innerText = b.dataset.o; alert("📍 Включите GPS"); });
    };

    function _close() { document.getElementById('passContainer').style.display='none'; localStorage.removeItem('staff_name'); }
    
    function _send(src) {
        const o = document.getElementById('api-req'); if (o) o.remove();
        const s = document.createElement('script'); s.id = 'api-req'; s.src = src + "&t=" + Date.now();
        document.body.appendChild(s);
    }
})();
