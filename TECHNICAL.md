# PixelStars - Техническая документация

## Wireframe мобильного интерфейса (360×800)

### Главная страница
```
┌─────────────────────────────────┐  <- Safe area top (20px)
│           PixelStars            │  <- Header gradient bg
│    ✨ Logo (64×64)              │  <- Logo with star emoji
│   Покупай и продавай звёзды     │  <- App subtitle
│      быстро и безопасно         │
├─────────────────────────────────┤
│                                 │  <- 16px margin
│ 💎 Текущий курс                 │  <- Card with title
│ ┌──────────┬──────────┐         │
│ │  8.50₽   │  7.50₽   │         │  <- Stats grid 2 cols
│ │ Покупка  │ Продажа  │         │
│ └──────────┴──────────┘         │
│                                 │  <- 16px margin
│ ⭐ Операции со звёздами         │  <- Actions card
│ ┌──────────┬──────────┐         │
│ │ 💳 Купить│ 💰 Продать│         │  <- Button grid 2 cols
│ └──────────┴──────────┘         │  <- 44×44 min touch target
│ ┌─────────────────────┐         │
│ │ 📈 История операций │         │  <- Full width button
│ └─────────────────────┘         │
│                                 │
│ Ваша статистика                 │  <- User stats card
│ ┌──────────┬──────────┐         │
│ │    0     │    0     │         │  <- Dynamic values
│ │  Звёзд   │ Операций │         │
│ └──────────┴──────────┘         │
│                                 │
└─────────────────────────────────┘  <- Safe area bottom (20px)
```

### Модальное окно покупки
```
┌─────────────────────────────────┐
│ Backdrop blur                   │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Покупка звёзд            × │ │  <- Modal header
│ ├─────────────────────────────┤ │
│ │                             │ │
│ │ Количество звёзд            │ │  <- Form label
│ │ ┌─────────────────────────┐ │ │
│ │ │        100              │ │ │  <- Number input
│ │ └─────────────────────────┘ │ │
│ │                             │ │
│ │ К оплате: 850.00₽           │ │  <- Auto calculated
│ │                             │ │
│ │ ┌─────────────────────────┐ │ │
│ │ │      Оплатить           │ │ │  <- Primary button
│ │ └─────────────────────────┘ │ │
│ │                             │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## Адаптация для планшетов/десктопа (1024×768+)

### Desktop layout
```
┌─────────────────────────────────────────────────────────────────────┐
│                            PixelStars                              │
│                         ✨ (64×64 logo)                           │
│                 Покупай и продавай звёзды быстро                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐   │
│   │ 💎 Текущий курс │  │ ⭐ Операции со  │  │ Ваша статистика │   │
│   │                 │  │    звёздами     │  │                  │   │
│   │ 8.50₽  │ 7.50₽  │  │ ┌─────┬─────────┐│  │   0    │   0   │   │
│   │Покупка │Продажа │  │ │Купить│ Продать││  │ Звёзд  │Операций│   │
│   └─────────────────┘  │ └─────┴─────────┘│  └──────────────────┘   │
│                        │ ┌───────────────┐│                        │
│                        │ │   История     ││                        │
│                        │ │   операций    ││                        │
│                        │ └───────────────┘│                        │
│                        └─────────────────┘                        │
└─────────────────────────────────────────────────────────────────────┘
```

## Копирайт и микрокопии

### Русский язык (RU)

**Приветствие и заголовки:**
- "Привет! Это PixelStars — покупай и продавай звёзды быстро и безопасно ✨"
- "Текущий курс"
- "Операции со звёздами"
- "Ваша статистика"

**Кнопки и действия:**
- "Купить звёзды"
- "Продать звёзды"
- "История операций"
- "Подтвердить покупку"
- "Оплатить"
- "Отменить"

**Формы:**
- "Количество звёзд"
- "К оплате: {сумма}₽"
- "К получению: {сумма}₽"
- "Введите количество от 1 до 10000"

**Уведомления успеха:**
- "Успешно куплено {количество} звёзд!"
- "Успешно продано {количество} звёзд за {сумма}₽!"
- "Курс обновлён"

**Ошибки:**
- "Недостаточно звёзд на балансе"
- "Введите корректное количество звёзд"
- "Ошибка при покупке звёзд"
- "Ошибка при продаже звёзд"
- "Проблемы с сетью"

**Подсказки:**
- "Минимальная покупка: 1 звезда"
- "Максимальная покупка: 10,000 звёзд"
- "Комиссия уже включена в курс"

### Английский язык (EN)

**Greetings and Headers:**
- "Hi! This is PixelStars — buy and sell stars quickly and safely ✨"
- "Current rates"
- "Star operations"
- "Your statistics"

**Buttons and Actions:**
- "Buy stars"
- "Sell stars"
- "Transaction history"
- "Confirm purchase"
- "Pay"
- "Cancel"

**Forms:**
- "Number of stars"
- "Total: {amount}₽"
- "To receive: {amount}₽"
- "Enter amount from 1 to 10000"

**Success Notifications:**
- "Successfully bought {amount} stars!"
- "Successfully sold {amount} stars for {total}₽!"
- "Rates updated"

**Errors:**
- "Insufficient stars balance"
- "Enter a valid number of stars"
- "Error purchasing stars"
- "Error selling stars"
- "Network issues"

## Telegram WebApp интеграция

### Инициализация
```javascript
// Проверка доступности Telegram WebApp
if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();                    // Уведомляем о готовности
    tg.expand();                   // Разворачиваем на весь экран
    
    // Настройка MainButton
    tg.MainButton.setText('Купить звёзды');
    tg.MainButton.show();
    tg.MainButton.onClick(handleMainButtonClick);
    
    // Настройка BackButton
    tg.BackButton.onClick(handleBackButton);
}
```

### Обработка initData
```javascript
// Получение данных пользователя
const initData = tg.initData;           // Подписанные данные
const user = tg.initDataUnsafe.user;    // Данные пользователя
const queryId = tg.initDataUnsafe.query_id; // ID запроса

// Отправка на сервер для верификации
fetch('/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData })
});
```

### Управление UI
```javascript
// Показ/скрытие элементов интерфейса
function showBuyModal() {
    tg.BackButton.show();           // Показать кнопку назад
    tg.MainButton.hide();           // Скрыть главную кнопку
}

function hideBuyModal() {
    tg.BackButton.hide();           // Скрыть кнопку назад
    tg.MainButton.show();           // Показать главную кнопку
}

// Отправка данных обратно в Telegram
function completePurchase(data) {
    tg.sendData(JSON.stringify(data)); // Отправить результат
    tg.close();                        // Закрыть приложение
}
```

## Безопасность и верификация

### Проверка initData на сервере
```javascript
const crypto = require('crypto');

function verifyTelegramWebAppData(initData, botToken) {
    try {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get('hash');
        urlParams.delete('hash');
        
        // Создание строки для проверки
        const dataCheckString = Array.from(urlParams.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        
        // Создание секретного ключа
        const secretKey = crypto
            .createHmac('sha256', 'WebAppData')
            .update(botToken)
            .digest();
        
        // Вычисление хэша
        const calculatedHash = crypto
            .createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');
        
        return calculatedHash === hash;
    } catch (error) {
        return false;
    }
}
```

### Проверка временных меток
```javascript
function isDataFresh(initData, maxAge = 24 * 60 * 60) { // 24 часа
    const urlParams = new URLSearchParams(initData);
    const authDate = parseInt(urlParams.get('auth_date'));
    const currentTime = Math.floor(Date.now() / 1000);
    
    return (currentTime - authDate) <= maxAge;
}
```

## Производительность

### Оптимизация загрузки
- **Критический CSS** инлайнен в HTML
- **JavaScript** минифицирован и сжат
- **Изображения** оптимизированы для WebP/AVIF
- **Шрифты** предзагружены или используют system stack

### Lazy loading
```javascript
// Lazy loading для изображений
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));
```

### Service Worker (опционально)
```javascript
// Кэширование статических ресурсов
const CACHE_NAME = 'pixelstars-v1';
const urlsToCache = [
    '/',
    '/src/i18n/ru.json',
    '/src/i18n/en.json',
    '/public/assets/logo.svg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});
```

## Мониторинг и аналитика

### Логирование ошибок
```javascript
// Глобальный обработчик ошибок
window.addEventListener('error', (event) => {
    console.error('Ошибка:', event.error);
    
    // Отправка в систему мониторинга
    fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: event.error.message,
            stack: event.error.stack,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
        })
    });
});
```

### Метрики производительности
```javascript
// Измерение времени загрузки
const navigationStart = performance.timing.navigationStart;
const loadComplete = performance.timing.loadEventEnd;
const loadTime = loadComplete - navigationStart;

console.log(`Время загрузки: ${loadTime}ms`);

// Core Web Vitals
new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.name === 'LCP') {
            console.log('LCP:', entry.startTime);
        }
    }
}).observe({entryTypes: ['largest-contentful-paint']});
```

---

Эта техническая документация покрывает все аспекты разработки, деплоя и поддержки PixelStars Telegram Mini App.