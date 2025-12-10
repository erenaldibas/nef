// MOBİL UYUMLULUK DÜZELTMESİ - BAŞLANGIÇ
(function() {
    // Mobil cihaz kontrolü
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Viewport ayarı
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    document.head.appendChild(meta);
    
    // Canvas'ı responsive yap
    function setupResponsiveCanvas() {
        const canvas = document.getElementById('heart');
        if (!canvas) return;
        
        // Canvas context'ini al
        const ctx = canvas.getContext('2d');
        
        // Boyutları ayarla
        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            
            // Gerçek piksel boyutu
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            
            // CSS boyutu
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            
            // Scale context'i
            ctx.scale(dpr, dpr);
            
            // Mobilde performans için
            if (isMobile) {
                canvas.style.imageRendering = 'optimizeQuality';
                canvas.style.webkitTransform = 'translateZ(0)';
                canvas.style.transform = 'translateZ(0)';
            }
        }
        
        // İlk boyutlandırma
        resizeCanvas();
        
        // Yeniden boyutlandırma
        let resizeTimeout;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 100);
        }
        
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        
        return { canvas, ctx };
    }
    
    // DOM yüklendiğinde çalıştır
    document.addEventListener('DOMContentLoaded', function() {
        setupResponsiveCanvas();
    });
})();

// ORJİNAL KOD - MOBİL UYUMLU HALE GETİRİLDİ
window.requestAnimationFrame =
    window.__requestAnimationFrame ||
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        (function () {
            return function (callback, element) {
                var lastTime = element.__lastTime;
                if (lastTime === undefined) {
                    lastTime = 0;
                }
                var currTime = Date.now();
                var timeToCall = Math.max(1, 33 - (currTime - lastTime));
                window.setTimeout(callback, timeToCall);
                element.__lastTime = currTime + timeToCall;
            };
        })();

// Mobil kontrolü
window.isDevice = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(((navigator.userAgent || navigator.vendor || window.opera)).toLowerCase()));

// Mobil için ayarlar
var loaded = false;
var init = function () {
    if (loaded) return;
    loaded = true;
    
    var mobile = window.isDevice;
    var koef = mobile ? 0.7 : 1; // Mobilde biraz küçült
    
    var canvas = document.getElementById('heart');
    var ctx = canvas.getContext('2d');
    
    // Canvas boyutlarını güncelle
    function updateCanvasSize() {
        var width = canvas.width = koef * window.innerWidth;
        var height = canvas.height = koef * window.innerHeight;
        return { width, height };
    }
    
    var { width, height } = updateCanvasSize();
    
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);

    var heartPosition = function (rad) {
        return [Math.pow(Math.sin(rad), 3), -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))];
    };
    
    var scaleAndTranslate = function (pos, sx, sy, dx, dy) {
        return [dx + pos[0] * sx, dy + pos[1] * sy];
    };

    // Yeniden boyutlandırma
    var resizeHandler = function () {
        var sizes = updateCanvasSize();
        width = sizes.width;
        height = sizes.height;
        
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, 0, width, height);
    };

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('orientationchange', function() {
        setTimeout(resizeHandler, 100);
    });

    var traceCount = mobile ? 15 : 50; // Mobilde daha az iz
    var pointsOrigin = [];
    var i;
    var dr = mobile ? 0.4 : 0.1; // Mobilde daha az detay
    for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
    for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
    for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
    var heartPointsCount = pointsOrigin.length;

    var targetPoints = [];
    var pulse = function (kx, ky) {
        for (i = 0; i < pointsOrigin.length; i++) {
            targetPoints[i] = [];
            targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
            targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
        }
    };

    var e = [];
    for (i = 0; i < heartPointsCount; i++) {
        var x = Math.random() * width;
        var y = Math.random() * height;
        e[i] = {
            vx: 0,
            vy: 0,
            R: mobile ? 1.5 : 2, // Mobilde daha küçük
            speed: Math.random() + (mobile ? 3 : 5), // Mobilde daha yavaş
            q: ~~(Math.random() * heartPointsCount),
            D: 2 * (i % 2) - 1,
            force: 0.2 * Math.random() + 0.7,
            f: "hsla(0," + ~~(40 * Math.random() + 100) + "%," + ~~(60 * Math.random() + 20) + "%,.3)",
            trace: []
        };
        for (var k = 0; k < traceCount; k++) e[i].trace[k] = {x: x, y: y};
    }

    var config = {
        traceK: 0.4,
        timeDelta: mobile ? 0.02 : 0.01 // Mobilde daha yavaş zaman
    };

    var time = 0;
    var loop = function () {
        var n = -Math.cos(time);
        pulse((1 + n) * .5, (1 + n) * .5);
        time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? .2 : 1) * config.timeDelta;
        ctx.fillStyle = "rgba(0,0,0,.1)";
        ctx.fillRect(0, 0, width, height);
        for (i = e.length; i--;) {
            var u = e[i];
            var q = targetPoints[u.q];
            var dx = u.trace[0].x - q[0];
            var dy = u.trace[0].y - q[1];
            var length = Math.sqrt(dx * dx + dy * dy);
            if (10 > length) {
                if (0.95 < Math.random()) {
                    u.q = ~~(Math.random() * heartPointsCount);
                }
                else {
                    if (0.99 < Math.random()) {
                        u.D *= -1;
                    }
                    u.q += u.D;
                    u.q %= heartPointsCount;
                    if (0 > u.q) {
                        u.q += heartPointsCount;
                    }
                }
            }
            u.vx += -dx / length * u.speed;
            u.vy += -dy / length * u.speed;
            u.trace[0].x += u.vx;
            u.trace[0].y += u.vy;
            u.vx *= u.force;
            u.vy *= u.force;
            for (k = 0; k < u.trace.length - 1;) {
                var T = u.trace[k];
                var N = u.trace[++k];
                N.x -= config.traceK * (N.x - T.x);
                N.y -= config.traceK * (N.y - T.y);
            }
            ctx.fillStyle = u.f;
            for (k = 0; k < u.trace.length; k++) {
                ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
            }
        }

        window.animationFrameId = window.requestAnimationFrame(loop, canvas);
    };
    loop();
};

var s = document.readyState;
if (s === 'complete' || s === 'loaded' || s === 'interactive') init();
else document.addEventListener('DOMContentLoaded', init, false);