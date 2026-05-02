(function(){
    const _0x5511 = "\x68\x74\x74\x70\x73\x3a\x2f\x2f\x73\x63\x72\x69\x70\x74\x2e\x67\x6f\x6f\x67\x6c\x65\x2e\x63\x6f\x6d\x2f\x6d\x61\x63\x72\x6f\x73\x2f\x73\x2f\x41\x4b\x66\x79\x63\x62\x79\x35\x6a\x79\x33\x79\x78\x56\x6a\x2d\x67\x55\x76\x47\x46\x38\x74\x50\x58\x33\x70\x75\x57\x76\x4f\x54\x31\x4f\x47\x57\x43\x6e\x57\x46\x6d\x6b\x34\x4f\x4a\x7a\x79\x58\x4b\x42\x75\x45\x76\x57\x58\x39\x70\x59\x74\x47\x34\x76\x4d\x48\x4b\x4f\x43\x71\x30\x31\x6b\x52\x51\x2f\x65\x78\x65\x63";
    const _0x229c = "\x73\x75\x70\x65\x72\x5f\x73\x65\x63\x72\x65\x74\x5f\x63\x6f\x64\x65\x5f\x37\x37\x37";

    window.callback = function(s) {
        if (s.startsWith("[")) {
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
        const m = document.getElementById('passContainer');
        const l = document.getElementById('workerName');
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
        if (s.includes("TOO_FAR")) msg = " Вы слишком далеко!";
        alert(msg);
        if (s.includes("SUCCESS")) _0x88c2();
    }

    window.sendToSheet = function(ac, e) {
        const n = localStorage.getItem('staff_name');
        const b = e.target;
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
        const old = document.getElementById('api-req');
        if (old) old.remove();
        const s = document.createElement('script');
        s.id = 'api-req';
        s.src = src + "&t=" + Date.now();
        document.body.appendChild(s);
    }
})();
