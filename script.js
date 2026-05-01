(function(){

const _0x = (s)=>atob(s);

// base64 скрытие
const _0xW = _0x("https://script.google.com/macros/s/AKfycby5jy3yxVj-gUvGF8tPX3puWvOT1OGWCnWFmk4OJzyXKBuEvWX9pYtG4vMHKOCoQ01kRQ/exec");
const _0xK = _0x("c3VwZXJfc2VjcmV0X2NvZGVfNzc3");

// анти-простое открытие devtools (не панацея)
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.key === "F12") e.preventDefault();
});

window.callback = function(_0xs){
    if (Array.isArray(_0xs)) {
        _0xr(_0xs);
        return;
    }
    _0xh(_0xs);
};

window.onload = function(){
    _0xl();
    const _0xn = localStorage.getItem('staff_name');
    if (_0xn) {
        _0xo(_0xn);
    }
};

function _0xl(){
    _0xa(_0xW + "?getStaff=true&callback=callback");
}

function _0xr(_0xn){
    const _0xg = document.getElementById('staffGrid');
    if (!_0xg) return;

    _0xg.style.opacity = '0';
    setTimeout(()=>{
        _0xg.innerHTML = "";
        _0xn.forEach(_0xm=>{
            const _0xb = document.createElement('button');
            _0xb.className = 'name-btn';
            _0xb.innerText = _0xm;
            _0xb.onclick = ()=>_0xo(_0xm);
            _0xg.appendChild(_0xb);
        });
        _0xg.style.opacity = '1';
    },300);
}

function _0xo(_0xn){
    const _0xm = document.getElementById('passContainer');
    const _0xl = document.getElementById('workerName');
    if (_0xm && _0xl) {
        localStorage.setItem('staff_name', _0xn);
        _0xl.innerText = _0xn;
        _0xm.style.display = 'flex';
    }
}

function _0xh(_0xs){
    const _0xb = document.querySelectorAll('.action-btn');
    _0xb.forEach(_0xq=>{
        _0xq.disabled = false;
        _0xq.innerText = _0xq.dataset.originalText || _0xq.innerText;
    });

    const _0xa = {
        "SUCCESS_OPEN": "✅ Смена открыта! Удачного рабочего дня.",
        "SUCCESS_CLOSE": "🚩 Смена закрыта! Отдыхайте.",
        "ALREADY_OPENED": "⚠️ Смена УЖЕ открыта!",
        "ALREADY_CLOSED_TODAY": "🚫 Смена уже была закрыта сегодня.",
        "MUST_OPEN_FIRST": "❌ Сперва нужно открыть смену!",
        "AUTH_ERROR": "🔒 Ошибка доступа."
    };

    let _0xm = _0xa[_0xs] || "📡 Статус: " + _0xs;
    if (_0xs.includes("TOO_FAR")) _0xm = "📍 Вы слишком далеко!";

    alert(_0xm);
    if (_0xs.includes("SUCCESS")) {
        _0xc();
    }
}

window.sendToSheet = function(_0xa,_0xb){
    const _0xn = localStorage.getItem('staff_name');
    const _0xd = _0xb.target;

    _0xd.dataset.originalText = _0xd.innerText;
    _0xd.innerText = "⏳...";
    _0xd.disabled = true;

    navigator.geolocation.getCurrentPosition(function(_0xp){
        let _0xf = localStorage.getItem('device_fingerprint') ||
        'dev-' + Math.random().toString(36).substr(2, 9);

        localStorage.setItem('device_fingerprint', _0xf);

        const _0xq = `?name=${encodeURIComponent(_0xn)}&action=${encodeURIComponent(_0xa)}&lat=${_0xp.coords.latitude}&lon=${_0xp.coords.longitude}&deviceId=${_0xf}&key=${_0xK}&callback=callback`;

        _0xa2(_0xW + _0xq);
    }, function(){
        _0xd.disabled = false;
        _0xd.innerText = _0xd.dataset.originalText;
        alert("📍 Включите GPS");
    });
};

function _0xc(){
    document.getElementById('passContainer').style.display = 'none';
    localStorage.removeItem('staff_name');
}

function _0xa(_0xs){
    const _0xo = document.getElementById('api-request');
    if (_0xo) _0xo.remove();

    const _0xk = document.createElement('script');
    _0xk.id = 'api-request';
    _0xk.src = _0xs + "&t=" + Date.now();

    document.body.appendChild(_0xk);
}

function _0xa2(u){ _0xa(u); }

})();
