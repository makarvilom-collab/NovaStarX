# 🌟 NovaStarsX - Telegram Stars Bot

**Telegram бот для покупки звёзд с веб-интерфейсом**

![NovaStarsX](https://img.shields.io/badge/Status-Ready-brightgreen) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![Tech](https://img.shields.io/badge/Tech-Bot%2BHTML-orange)

## ✨ Особенности

🤖 **Telegram Bot**
- Команды: /start, /buy, /help
- Web App интеграция  
- Быстрые кнопки для покупки

🎯 **Веб-магазин**
- 🇺🇸 USD, 💎 TON, 🇺🇦 UAH, 🇷🇺 RUB
- 💎 TON Wallet, 💳 Банковские карты
- Адаптивный дизайн

## 🚀 Быстрый старт

### Локальный запуск

```bash
# Клонируем репозиторий
git clone https://github.com/makarvilom-collab/NovaStarsX.git
cd NovaStarsX

# Запускаем локальный сервер
python3 -m http.server 8000

# Открываем в браузере
open http://localhost:8000
```

### С Node.js backend

```bash
# Устанавливаем зависимости
npm install

# Запускаем сервер
npm start

# Открываем в браузере
open http://localhost:3000
```

## 📱 Адаптивность

- **Мобильные** (360px+): Оптимизированная сетка 2x2
- **Планшеты** (768px+): Улучшенные отступы и шрифты  
- **Десктопы** (1024px+): Полная ширина и эффекты

## 🛠️ Технологии

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js (опционально)
- **Интеграции**: Fragment.com API для курсов
- **Стили**: CSS Grid, Flexbox, CSS Variables
- **Анимации**: CSS Transitions, Keyframes

## 🎯 Функционал

### Калькулятор
1. Пользователь вводит количество звёзд
2. Автоматически рассчитываются цены во всех валютах
3. Выбор валюты подсвечивается
4. Выбор способа оплаты активируется
5. Кнопка "Оплатить" становится готовой

### Оплата
- Интеграция с TON Wallet через Telegram
- Поддержка банковских карт
- Безопасные платежи

### Статистика
- Отслеживание купленных звёзд
- История операций
- Персональная статистика

## 🔧 Конфигурация

Настройки в `src/api/fragment.js`:
- Наценка на цены Fragment.com
- Интервал обновления курсов
- Резервные источники данных

## 📊 API Integration

Поддержка получения актуальных курсов:
- Fragment.com через CORS proxy
- Собственный backend сервер
- Fallback на статичные курсы

## 🎨 Дизайн-система

### Цветовая палитра
- **Primary**: #4a90e2 (синий)
- **Success**: #27ae60 (зелёный) 
- **Danger**: #e74c3c (красный)
- **Warning**: #f39c12 (оранжевый)

### Валютные цвета
- **USD**: Зелёный градиент
- **TON**: Синий градиент
- **UAH**: Оранжевый градиент  
- **RUB**: Красный градиент

## 🚀 Деплой

### GitHub Pages
```bash
# Пушим в main ветку
git push origin main

# Активируем GitHub Pages в настройках репозитория
```

### Vercel/Netlify
Просто подключите репозиторий - автоматический деплой!

## 📄 Лицензия

MIT License - используйте как хотите! 

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature ветку  
3. Коммитьте изменения
4. Создайте Pull Request

## 📞 Контакты

Создано с ❤️ для сообщества Telegram

---

**⭐ Поставьте звёздочку если проект понравился!**