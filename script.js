// Ana sayfa için JavaScript

// Butonlara tıklama animasyonu
document.querySelectorAll('.anim-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Ripple efekti oluştur
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.7);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            top: ${y}px;
            left: ${x}px;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Animasyon sayfalarına yönlendirme fonksiyonları
function goToNeon() {
    // Kısa bir animasyon efekti
    document.body.style.opacity = '0.7';
    document.body.style.transition = 'opacity 0.5s';
    
    setTimeout(() => {
        window.location.href = 'neon-kalp/index.html';
    }, 500);
}

function goToFlower() {
    // Kısa bir animasyon efekti
    document.body.style.opacity = '0.7';
    document.body.style.transition = 'opacity 0.5s';
    
    setTimeout(() => {
        window.location.href = 'cicekler/index.html';
    }, 500);
}

function goToHeart() {
    // Kısa bir animasyon efekti
    document.body.style.opacity = '0.7';
    document.body.style.transition = 'opacity 0.5s';
    
    setTimeout(() => {
        window.location.href = 'kalp-animasyonu/index.html';
    }, 500);
}

function goToTeacherSite() {
    // Öğretmenin sitesine dön (URL'yi değiştirin)
    alert('Hocamın sitesine yönlendiriliyorsunuz...');
    // window.location.href = 'https://hocanin-sitesi.com';
}

// Sayfa yüklendiğinde animasyon
document.addEventListener('DOMContentLoaded', function() {
    // Sayfa elementlerine sıralı animasyon ekle
    const elements = document.querySelectorAll('.title-box, .buttons-container, .back-btn-container');
    
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.animation = 'fadeIn 0.8s ease-out forwards';
            el.style.opacity = '0';
        }, index * 300);
    });
});

// Ripple animasyonu için CSS ekle
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);