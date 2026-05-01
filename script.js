(function(){
    // Декодируем ссылку так, чтобы она всегда была абсолютной
    const _0x1a2b = "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J5NWp5M3l4VmotZ1V2R0Y4dFBYM3B1V3ZPVDFPR1dDbldGbWs0T0p6eVhLQnVFdldYOU9ZdEc0dk1IS09DcVEwMWtSUS9leGVj";
    const _0x5511 = atob(_0x1a2b); 
    const _0x229c = atob("c3VwZXJfc2VjcmV0X2NvZGVfNzc3");

    window.callback = function(s) {
        if (s.startsWith("[")) { _render(JSON.parse(s)); return; }
        _handle(s);
    };

    window.onload = function() {
        _send(_0x5511 + "?getStaff=true");
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
        bs.forEach(b => { 
            b.disabled = false; 
            b.innerText = b.dataset.o || b.innerText; 
        });
        const a = {
            "SUCCESS_OPEN": "✅ Смена открыта!",
            "SUCCESS_CLOSE": "🚩 Смена закрыта!",
            "ALREADY_OPENED": "⚠️ Уже открыта!",
            "ALREADY_CLOSED_TODAY": "🚫 Уже закрыта сегодня.",
            "MUST_OPEN_FIRST": "❌ Сперва откройте!",
            "AUTH_ERROR": "🔒 Ошибка доступа."
        };
        alert(a[s] || "📡 Статус: " + s);
        if (s.includes("SUCCESS")) _close();
    }

    window.sendToSheet = function(ac, e) {
        const n = localStorage.getItem('staff_name'), b = e.target;
        b.dataset.o = b.innerText; b.innerText = "⏳..."; b.disabled = true;
        navigator.geolocation.getCurrentPosition(p => {
            let d = localStorage.getItem('df') || 'dev-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('df', d);
            const q = `?name=${encodeURIComponent(n)}&action=${encodeURIComponent(ac)}&lat=${p.coords.latitude}&lon=${p.coords.longitude}&deviceId=${d}&key=${_0x229c}`;
            _send(_0x5511 + q);
        }, () => {
            b.disabled = false; b.innerText = b.dataset.o;
            alert("📍 Включите GPS");
        });
    };

    function _close() { 
        document.getElementById('passContainer').style.display = 'none'; 
        localStorage.removeItem('staff_name'); 
    }
    
    function _send(src) {
        const o = document.getElementById('api-req'); 
        if (o) o.remove();
        const s = document.createElement('script'); 
        s.id = 'api-req'; 
        s.src = src + "&t=" + Date.now();
        document.body.appendChild(s);
    }
})();
