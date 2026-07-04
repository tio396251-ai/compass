const arrow = document.getElementById('compassArrow');
const degreeText = document.getElementById('degree');

function initCompass() {
    // التحقق مما إذا كان الهاتف يدعم مستشعرات الحركة والاتجاه
    if ('AbsoluteOrientationSensor' in window || 'DeviceOrientationEvent' in window) {
        
        // هواتف الآيفون تتطلب إذن تشغيل المستشعرات أولاً
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientationabsolute', handler, true);
                    }
                });
        } else {
            // هواتف أندرويد تعمل مباشرة دون طلب إذن
            window.addEventListener('deviceorientationabsolute', handler, true);
            window.addEventListener('deviceorientation', handler, true);
        }
    } else {
        alert('عذراً، هذا الجهاز لا يدعم مستشعر البوصلة.');
    }
}

function handler(e) {
    // الحصول على زاوية الشمال المغناطيسي من المتصفح
    let alpha = e.webkitCompassHeading || e.alpha;
    
    if (alpha !== null && alpha !== undefined) {
        let heading = Math.round(alpha);
        degreeText.innerText = heading + '°'; // تحديث رقم الزاوية في الشاشة
        
        // تدوير عقرب البوصلة البرتقالي بناءً على زاوية الهاتف
        arrow.style.transform = `rotate(${-heading}deg)`;
    }
}

// تشغيل البوصلة بمجرد أن يلمس المستخدم الشاشة
window.addEventListener('click', initCompass, { once: true });

