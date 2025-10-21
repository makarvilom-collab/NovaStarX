// Простой Express.js сервер для PixelStars (для продакшена)
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const axios = require('axios'); // для HTTP запросов
const cheerio = require('cheerio'); // для парсинга HTML

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Кэш для цен Fragment
let fragmentPriceCache = {
    price: null,
    lastUpdate: 0,
    priceHistory: []
};

// Получение цены с Fragment.com
async function fetchFragmentPrice() {
    try {
        console.log('🔍 Получаем цену с Fragment...');
        
        // Метод 1: Пытаемся получить через прямой запрос
        let price = null;
        
        try {
            const response = await axios.get('https://fragment.com/stars', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1'
                },
                timeout: 10000
            });
            
            if (response.status === 200) {
                price = parseFragmentHTML(response.data);
            }
        } catch (error) {
            console.warn('Прямой запрос к Fragment неудачен:', error.message);
        }
        
        // Метод 2: Если прямой запрос не сработал, пробуем другие источники
        if (!price) {
            price = await getFragmentPriceAlternative();
        }
        
        if (price && price > 0) {
            // Обновляем кэш
            fragmentPriceCache.price = price;
            fragmentPriceCache.lastUpdate = Date.now();
            fragmentPriceCache.priceHistory.push({
                price: price,
                timestamp: Date.now()
            });
            
            // Оставляем только последние 100 записей
            if (fragmentPriceCache.priceHistory.length > 100) {
                fragmentPriceCache.priceHistory = fragmentPriceCache.priceHistory.slice(-100);
            }
            
            console.log(`✅ Получена цена Fragment: ${price}₽`);
            return price;
        }
        
        throw new Error('Не удалось получить цену');
        
    } catch (error) {
        console.error('❌ Ошибка получения цены Fragment:', error.message);
        
        // Возвращаем кэшированную цену если она не старше часа
        if (fragmentPriceCache.price && (Date.now() - fragmentPriceCache.lastUpdate) < 3600000) {
            console.warn('⚠️ Используется кэшированная цена');
            return fragmentPriceCache.price;
        }
        
        throw error;
    }
}

// Парсинг HTML страницы Fragment для извлечения цены
function parseFragmentHTML(html) {
    try {
        const $ = cheerio.load(html);
        
        // Различные селекторы для поиска цены
        const selectors = [
            '.price-value',
            '[data-price]',
            '.star-price',
            '.rate-value'
        ];
        
        for (const selector of selectors) {
            const element = $(selector);
            if (element.length > 0) {
                const text = element.text() || element.attr('data-price');
                const price = parseFloat(text.replace(/[^\d.]/g, ''));
                if (price > 0 && price < 100) {
                    return price;
                }
            }
        }
        
        // Поиск в тексте страницы
        const patterns = [
            /price["\s]*:[\s]*["\s]*([0-9]+\.?[0-9]*)/i,
            /rate["\s]*:[\s]*["\s]*([0-9]+\.?[0-9]*)/i,
            /([0-9]+\.?[0-9]*)\s*₽\s*per\s*star/i,
            /([0-9]+\.?[0-9]*)\s*руб\s*за\s*звезду/i
        ];
        
        for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                const price = parseFloat(match[1]);
                if (price > 0 && price < 100) {
                    return price;
                }
            }
        }
        
    } catch (error) {
        console.error('Ошибка парсинга HTML:', error);
    }
    
    return null;
}

// Альтернативные источники цены Fragment
async function getFragmentPriceAlternative() {
    // Можно добавить другие источники или API
    // Например, криптобиржи, телеграм каналы с ценами и т.д.
    
    // Пока возвращаем null, но можно добавить:
    // - Парсинг телеграм каналов
    // - API других площадок
    // - Собственная база данных цен
    
    return null;
}

// Проверка initData от Telegram
function verifyTelegramWebAppData(initData) {
    try {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get('hash');
        urlParams.delete('hash');
        
        const dataCheckString = Array.from(urlParams.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        
        const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
        const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
        
        return calculatedHash === hash;
    } catch (error) {
        console.error('Ошибка проверки initData:', error);
        return false;
    }
}

// Получение пользователя из initData
function getUserFromInitData(initData) {
    try {
        const urlParams = new URLSearchParams(initData);
        const userStr = urlParams.get('user');
        if (userStr) {
            return JSON.parse(decodeURIComponent(userStr));
        }
        return null;
    } catch (error) {
        console.error('Ошибка парсинга пользователя:', error);
        return null;
    }
}

// Middleware для проверки аутентификации
const authenticateUser = (req, res, next) => {
    const initData = req.headers.authorization?.replace('Bearer ', '');
    
    if (!initData) {
        return res.status(401).json({ 
            success: false, 
            error: 'Отсутствуют данные аутентификации' 
        });
    }
    
    if (!verifyTelegramWebAppData(initData)) {
        return res.status(401).json({ 
            success: false, 
            error: 'Недействительные данные аутентификации' 
        });
    }
    
    const user = getUserFromInitData(initData);
    if (!user) {
        return res.status(401).json({ 
            success: false, 
            error: 'Не удалось получить данные пользователя' 
        });
    }
    
    req.user = user;
    next();
};

// Роуты API

// Получение цены Fragment
app.get('/api/fragment-price', async (req, res) => {
    try {
        let price = fragmentPriceCache.price;
        
        // Если цена в кэше старше 5 минут, обновляем
        if (!price || (Date.now() - fragmentPriceCache.lastUpdate) > 300000) {
            price = await fetchFragmentPrice();
        }
        
        if (price) {
            // Рассчитываем наши цены с наценкой
            const markup = 0.25; // 25% наценка
            const sellMarkdown = 0.15; // 15% скидка при продаже
            
            res.json({
                success: true,
                data: {
                    fragmentPrice: price,
                    buyPrice: price * (1 + markup),
                    sellPrice: price * (1 - sellMarkdown),
                    lastUpdate: fragmentPriceCache.lastUpdate,
                    trend: calculatePriceTrend(fragmentPriceCache.priceHistory)
                }
            });
        } else {
            throw new Error('Цена недоступна');
        }
        
    } catch (error) {
        console.error('Ошибка API цены Fragment:', error);
        res.status(500).json({
            success: false,
            error: 'Не удалось получить цену Fragment'
        });
    }
});

// Резервный endpoint для получения цены
app.get('/api/fragment-price-backup', async (req, res) => {
    try {
        // Возвращаем последнюю кэшированную цену даже если она старая
        if (fragmentPriceCache.price) {
            res.json({
                success: true,
                price: fragmentPriceCache.price,
                lastUpdate: fragmentPriceCache.lastUpdate,
                isBackup: true
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Нет доступных данных о цене'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка сервера'
        });
    }
});

// Вспомогательная функция для расчёта тренда
function calculatePriceTrend(priceHistory) {
    if (!priceHistory || priceHistory.length < 3) return 'stable';
    
    const recent = priceHistory.slice(-3);
    const firstPrice = recent[0].price;
    const lastPrice = recent[recent.length - 1].price;
    
    const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100;
    
    if (changePercent > 2) return 'up';
    if (changePercent < -2) return 'down';
    return 'stable';
}

// Получение курсов (обновлённый)
app.get('/api/rates', async (req, res) => {
    try {
        let fragmentPrice = fragmentPriceCache.price;
        
        // Обновляем цену если нужно
        if (!fragmentPrice || (Date.now() - fragmentPriceCache.lastUpdate) > 300000) {
            try {
                fragmentPrice = await fetchFragmentPrice();
            } catch (error) {
                // Если не удалось обновить, используем кэш
                fragmentPrice = fragmentPriceCache.price;
            }
        }
        
        if (fragmentPrice) {
            const markup = 0.25; // 25% наценка
            const sellMarkdown = 0.15; // 15% скидка при продаже
            
            const rates = {
                buy: fragmentPrice * (1 + markup),
                sell: fragmentPrice * (1 - sellMarkdown),
                fragment: fragmentPrice,
                lastUpdate: Date.now(),
                trend: calculatePriceTrend(fragmentPriceCache.priceHistory)
            };
            
            res.json({
                success: true,
                data: rates
            });
        } else {
            // Fallback на статичные курсы
            const rates = {
                buy: 8.50,
                sell: 7.50,
                fragment: 7.0,
                lastUpdate: Date.now(),
                trend: 'stable'
            };
            
            res.json({
                success: true,
                data: rates,
                warning: 'Используются резервные курсы'
            });
        }
    } catch (error) {
        console.error('Ошибка получения курсов:', error);
        res.status(500).json({
            success: false,
            error: 'Ошибка сервера'
        });
    }
});

// Получение данных пользователя
app.get('/api/user', authenticateUser, async (req, res) => {
    try {
        // TODO: Получить данные пользователя из базы данных
        const userData = {
            id: req.user.id,
            username: req.user.username,
            first_name: req.user.first_name,
            balance: 500, // Заглушка
            totalTransactions: 15,
            totalBought: 2500,
            totalSold: 1000,
            createdAt: Date.now()
        };
        
        res.json({
            success: true,
            data: userData
        });
    } catch (error) {
        console.error('Ошибка получения данных пользователя:', error);
        res.status(500).json({
            success: false,
            error: 'Ошибка сервера'
        });
    }
});

// Покупка звёзд
app.post('/api/buy', authenticateUser, async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!amount || amount < 1 || amount > 10000) {
            return res.status(400).json({
                success: false,
                error: 'Неверное количество звёзд'
            });
        }
        
        // TODO: Реальная логика покупки
        // 1. Получить курс
        // 2. Создать invoice в платёжной системе
        // 3. Сохранить транзакцию в БД
        // 4. Вернуть URL для оплаты
        
        const transaction = {
            id: Date.now(),
            userId: req.user.id,
            type: 'buy',
            amount: amount,
            rate: 8.50,
            total: amount * 8.50,
            status: 'pending',
            createdAt: Date.now()
        };
        
        res.json({
            success: true,
            data: {
                transaction,
                paymentUrl: `https://payment.example.com/pay/${transaction.id}`
            }
        });
        
    } catch (error) {
        console.error('Ошибка покупки:', error);
        res.status(500).json({
            success: false,
            error: 'Ошибка сервера'
        });
    }
});

// Продажа звёзд
app.post('/api/sell', authenticateUser, async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!amount || amount < 1) {
            return res.status(400).json({
                success: false,
                error: 'Неверное количество звёзд'
            });
        }
        
        // TODO: Проверить баланс пользователя
        // TODO: Создать заявку на выплату
        
        const transaction = {
            id: Date.now(),
            userId: req.user.id,
            type: 'sell',
            amount: amount,
            rate: 7.50,
            total: amount * 7.50,
            status: 'pending',
            createdAt: Date.now()
        };
        
        res.json({
            success: true,
            data: { transaction }
        });
        
    } catch (error) {
        console.error('Ошибка продажи:', error);
        res.status(500).json({
            success: false,
            error: 'Ошибка сервера'
        });
    }
});

// История транзакций
app.get('/api/transactions', authenticateUser, async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        
        // TODO: Получить транзакции из базы данных
        const transactions = [];
        
        res.json({
            success: true,
            data: {
                transactions,
                total: 0,
                hasMore: false
            }
        });
        
    } catch (error) {
        console.error('Ошибка получения истории:', error);
        res.status(500).json({
            success: false,
            error: 'Ошибка сервера'
        });
    }
});

// Webhook для обработки платежей
app.post('/api/webhook/payment', async (req, res) => {
    try {
        // TODO: Проверить подпись webhook
        // TODO: Обработать статус платежа
        // TODO: Обновить баланс пользователя
        
        console.log('Payment webhook:', req.body);
        
        res.json({ success: true });
        
    } catch (error) {
        console.error('Ошибка webhook:', error);
        res.status(500).json({
            success: false,
            error: 'Ошибка сервера'
        });
    }
});

// Обслуживание статических файлов
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Запуск сервера
app.listen(PORT, async () => {
    console.log(`PixelStars сервер запущен на порту ${PORT}`);
    console.log(`Убедитесь, что установлена переменная BOT_TOKEN`);
    
    // Инициализируем цену Fragment при запуске
    try {
        await fetchFragmentPrice();
        console.log('✅ Начальная цена Fragment загружена');
    } catch (error) {
        console.warn('⚠️ Не удалось загрузить начальную цену Fragment');
    }
    
    // Настраиваем периодическое обновление цен (каждые 5 минут)
    setInterval(async () => {
        try {
            await fetchFragmentPrice();
            console.log('🔄 Цена Fragment обновлена');
        } catch (error) {
            console.warn('⚠️ Не удалось обновить цену Fragment:', error.message);
        }
    }, 5 * 60 * 1000); // 5 минут
});

module.exports = app;