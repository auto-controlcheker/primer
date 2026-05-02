(function(){
    const _0xData = [104,116,116,112,115,58,47,47,115,99,114,105,112,116,46,103,111,111,103,108,101,46,99,111,109,47,109,97,99,114,111,115,47,115,47,65,75,102,121,99,98,121,53,106,121,51,121,120,86,106,45,103,85,118,71,70,56,116,80,88,51,112,117,87,118,79,84,49,79,71,87,67,110,87,70,109,107,52,79,74,122,121,88,75,66,117,69,118,87,88,57,112,89,116,71,52,118,77,72,75,79,67,111,81,48,49,107,82,81,47,101,120,101,99];
    
    const _0xGetURL = () => _0xData.map(c => String.fromCharCode(c)).join('');
    
    const _0x5511 = _0xGetURL();
    const _0x229c = "super_secret_code_777"; 

    window.callback = function(s) {
        if (typeof s === 'string' && s.startsWith("[")) {
            _0x3a2b(JSON.parse(s));
            return;
        }
        _0x11f2(s);
    };

    window.onload = function() {
        _0x44d1(_0x5511 + "?getStaff=true");
        const n = localStorage.getItem('staff_name');
        if (n) _0x99c1(n);
    };

    function _0x3a2b(ns) {
        const g = document.getElementById('staffGrid');
        if (!g) return;
        g.style.opacity = '0';
        setTimeout(() => {
            g.innerHTML = "";
            ns.forEach(n => {
                const b = document.createElement('button');
                b.className = 'name-btn';
                b.innerText = n;
                b.onclick = () => _0x99c1(n);
                g.appendChild(b);
            });
            g.style.opacity = '1';
        }, 300);
    }

    function _0x99c1(n) {
        const m = document.getElementById('passContainer'), l = document.getElementById('workerName');
        if (m && l) {
            localStorage.setItem('staff_name', n);
            l.innerText = n;
            m.style.display = 'flex';
        }
    }

    function _0x11f2(s) {
        const bs = document.querySelectorAll('.action-btn');
        bs.forEach(b => { 
            b.disabled = false; 
            b.innerText = b.dataset.o || b.innerText; 
        });
        const a = {
            "SUCCESS_OPEN": " Смена открыта! Удачного рабочего дня.",
            "SUCCESS_CLOSE": " Смена закрыта! Отдыхайте.",
            "ALREADY_OPENED": " Смена УЖЕ открыта!",
            "ALREADY_CLOSED_TODAY": " Смена уже была закрыта сегодня.",
            "MUST_OPEN_FIRST": " Сперва нужно открыть смену!",
            "AUTH_ERROR": " Ошибка доступа."
        };
        let msg = a[s] || " Статус: " + s;
        if (typeof s === 'string' && s.includes("TOO_FAR")) msg = " Вы слишком далеко!";
        alert(msg);
        if (typeof s === 'string' && s.includes("SUCCESS")) _0x88c2();
    }

    window.sendToSheet = function(ac, e) {
        const n = localStorage.getItem('staff_name'), b = e.target;
        b.dataset.o = b.innerText;
        b.innerText = "...";
        b.disabled = true;
        navigator.geolocation.getCurrentPosition(p => {
            let d = localStorage.getItem('df') || 'dev-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('df', d);
            const q = `?name=${encodeURIComponent(n)}&action=${encodeURIComponent(ac)}&lat=${p.coords.latitude}&lon=${p.coords.longitude}&deviceId=${d}&key=${_0x229c}`;
            _0x44d1(_0x5511 + q);
        }, () => {
            b.disabled = false;
            b.innerText = b.dataset.o;
            alert(" Включите GPS");
        });
    };

    function _0x88c2() {
        document.getElementById('passContainer').style.display = 'none';
        localStorage.removeItem('staff_name'); 
    }

    function _0x44d1(src) {
        const o = document.getElementById('api-req');
        if (o) o.remove();
        const s = document.createElement('script');
        s.id = 'api-req';
        s.src = src + "&t=" + Date.now();
        document.body.appendChild(s);
    }
})();
