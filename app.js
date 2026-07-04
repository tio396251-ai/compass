const arrow = document.getElementById('compassArrow');
const degreeText = document.getElementById('degree');

// إعدادات معرف اللعبة والإعلانات النظيفة والصامتة
const gameId = '800078953';
const isTestMode = false; // اجعلها true إذا كنت تريد تجربة إعلانات اختبارية أولاً

function initCompassAndAds() {
    // 1. تهيئة مستشعرات البوصلة
    if ('AbsoluteOrientationSensor' in window || 'DeviceOrientationEvent' in window) {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientationabsolute', handler, true);
                    }
                });
        } else {
            window.addEventListener('deviceorientationabsolute', handler, true);
            window.addEventListener('deviceorientation', handler, true);
        }
    } else {
        alert('عذراً، هذا الجهاز لا يدعم مستشعر البوصلة.');
    }

    // 2. تهيئة وتفعيل الإعلانات الصامتة والعائلية
    if (typeof UnityAds !== 'undefined') {
        UnityAds.initialize(gameId, isTestMode, {
            onInitializationComplete: () => {
                console.log('تم تهيئة شبكة الإعلانات بنجاح.');
                // تحميل إعلان بنر صامت وعائلي في المساحة المخصصة
                UnityAds.load('banner', {
                    onLoadSuccess: () => {
                        UnityAds.show('banner', {
                            container: document.getElementById('unity-ad-placement'),
                            muted: true, // إعلان صامت تماماً بدون صوت
                            contentRating: 'G' // تصنيف عائلي ونظيف بالكامل (General Audience)
                        });
                    }
                });
            },
            onInitializationFailed: (error, message) => {
                document.getElementById('unity-ad-placement').innerText = "جاهز";
            }
        });
    }
}

function handler(e) {
    let alpha = e.webkitCompassHeading || e.alpha;
    if (alpha !== null && alpha !== undefined) {
        let heading = Math.round(alpha);
        degreeText.innerText = heading + '°';
        arrow.style.transform = `rotate(${-heading}deg)`;
    }
}

// تفعيل كل شيء بمجرد أول لمسة للمستخدم على الشاشة
window.addEventListener('click', initCompassAndAds, { once: true });
