// Fragment.com API интеграция для получения реальных цен на Telegram Stars

class FragmentAPI {
    constructor() {
        this.baseURL = 'https://fragment.com';
        this.corsProxy = 'https://api.allorigins.win/raw?url=';
        this.lastPrice = null;
        this.priceHistory = [];
        this.retryCount = 3;
        this.retryDelay = 2000;
    }

    // Основной метод получения цены
    async getStarsPrice() {
        for (let attempt = 1; attempt <= this.retryCount; attempt++) {
            try {
                console.log(`🔍 Попытка ${attempt} получения цены с Fragment...`);
                
                // Пробуем разные методы получения цены
                let price = await this.tryDirectAPI();
                
                if (!price) {
                    price = await this.tryWebScraping();
                }
                
                if (!price) {
                    price = await this.tryBackupEndpoint();
                }
                
                if (price && price > 0) {
                    this.lastPrice = price;
                    this.addToPriceHistory(price);
                    console.log(`✅ Получена цена: ${price}₽`);
                    return price;
                }
                
            } catch (error) {
                console.warn(`❌ Попытка ${attempt} неудачна:`, error.message);
                
                if (attempt < this.retryCount) {
                    await this.delay(this.retryDelay * attempt);
                }
            }
        }
        
        // Если все попытки неудачны, возвращаем последнюю известную цену
        if (this.lastPrice) {
            console.warn('⚠️ Используется последняя известная цена');
            return this.lastPrice;
        }
        
        throw new Error('Не удалось получить цену с Fragment после всех попыток');
    }

    // Метод 1: Прямой API запрос (если Fragment предоставляет API)
    async tryDirectAPI() {
        try {
            // TODO: Если Fragment предоставит официальный API
            const response = await fetch(`${this.baseURL}/api/stars/price`);
            
            if (response.ok) {
                const data = await response.json();
                return data.price || data.rate || data.value;
            }
        } catch (error) {
            console.log('Direct API недоступен:', error.message);
        }
        return null;
    }

    // Метод 2: Парсинг веб-страницы
    async tryWebScraping() {
        try {
            // Получаем страницу через CORS proxy
            const url = `${this.baseURL}/stars`;
            const proxyUrl = `${this.corsProxy}${encodeURIComponent(url)}`;
            
            const response = await fetch(proxyUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (response.ok) {
                const html = await response.text();
                return this.parsePriceFromHTML(html);
            }
        } catch (error) {
            console.log('Web scraping неудачен:', error.message);
        }
        return null;
    }

    // Метод 3: Резервный endpoint (наш бэкенд или другой источник)
    async tryBackupEndpoint() {
        try {
            const response = await fetch('/api/fragment-price-backup');
            
            if (response.ok) {
                const data = await response.json();
                return data.price;
            }
        } catch (error) {
            console.log('Backup endpoint недоступен:', error.message);
        }
        return null;
    }

    // Парсинг цены из HTML
    parsePriceFromHTML(html) {
        try {
            // Ищем цену в различных возможных форматах
            const patterns = [
                /price["\s]*:[\s]*["\s]*([0-9]+\.?[0-9]*)/i,
                /rate["\s]*:[\s]*["\s]*([0-9]+\.?[0-9]*)/i,
                /([0-9]+\.?[0-9]*)\s*₽\s*per\s*star/i,
                /([0-9]+\.?[0-9]*)\s*руб\s*за\s*звезду/i,
                /"stars_price"[:\s]*"?([0-9]+\.?[0-9]*)"?/i
            ];
            
            for (const pattern of patterns) {
                const match = html.match(pattern);
                if (match && match[1]) {
                    const price = parseFloat(match[1]);
                    if (price > 0 && price < 100) { // разумные границы цены
                        return price;
                    }
                }
            }
            
            // Если не нашли, ищем в скриптах
            const scriptMatches = html.match(/<script[^>]*>(.*?)<\/script>/gs);
            if (scriptMatches) {
                for (const script of scriptMatches) {
                    for (const pattern of patterns) {
                        const match = script.match(pattern);
                        if (match && match[1]) {
                            const price = parseFloat(match[1]);
                            if (price > 0 && price < 100) {
                                return price;
                            }
                        }
                    }
                }
            }
            
        } catch (error) {
            console.error('Ошибка парсинга HTML:', error);
        }
        
        return null;
    }

    // Добавление цены в историю
    addToPriceHistory(price) {
        this.priceHistory.push({
            price: price,
            timestamp: Date.now()
        });
        
        // Оставляем только последние 100 записей
        if (this.priceHistory.length > 100) {
            this.priceHistory = this.priceHistory.slice(-100);
        }
    }

    // Получение тренда цены
    getPriceTrend(periodMinutes = 30) {
        if (this.priceHistory.length < 2) return 'stable';
        
        const cutoffTime = Date.now() - (periodMinutes * 60 * 1000);
        const recentPrices = this.priceHistory.filter(p => p.timestamp > cutoffTime);
        
        if (recentPrices.length < 2) return 'stable';
        
        const firstPrice = recentPrices[0].price;
        const lastPrice = recentPrices[recentPrices.length - 1].price;
        const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100;
        
        if (changePercent > 1) return 'up';
        if (changePercent < -1) return 'down';
        return 'stable';
    }

    // Получение статистики цены
    getPriceStats(periodHours = 24) {
        const cutoffTime = Date.now() - (periodHours * 60 * 60 * 1000);
        const periodPrices = this.priceHistory
            .filter(p => p.timestamp > cutoffTime)
            .map(p => p.price);
        
        if (periodPrices.length === 0) return null;
        
        const min = Math.min(...periodPrices);
        const max = Math.max(...periodPrices);
        const avg = periodPrices.reduce((a, b) => a + b, 0) / periodPrices.length;
        const current = periodPrices[periodPrices.length - 1];
        
        return {
            min: min,
            max: max,
            avg: avg,
            current: current,
            volatility: ((max - min) / avg) * 100
        };
    }

    // Утилита для задержки
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Мокап для разработки (имитирует реальные колебания Fragment)
    getMockPrice() {
        const basePrice = 7.2; // примерная текущая цена
        const time = Date.now() / 1000;
        
        // Добавляем различные компоненты изменения цены:
        const dailyCycle = Math.sin(time / 86400) * 0.2; // дневной цикл
        const randomNoise = (Math.random() - 0.5) * 0.1; // случайные колебания
        const weeklyTrend = Math.sin(time / 604800) * 0.3; // недельный тренд
        
        return Math.max(0.1, basePrice + dailyCycle + randomNoise + weeklyTrend);
    }

    // Настройка для dev/prod режимов
    async getPriceWithFallback() {
        const isDevelopment = window.location.hostname === 'localhost' || 
                             window.location.hostname === '127.0.0.1';
        
        if (isDevelopment) {
            // В режиме разработки используем мок с небольшой задержкой
            await this.delay(200 + Math.random() * 500);
            return this.getMockPrice();
        } else {
            // В продакшене пытаемся получить реальную цену
            return await this.getStarsPrice();
        }
    }
}

// Создаём глобальный экземпляр
window.fragmentAPI = new FragmentAPI();

// Экспорт для модульных систем
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FragmentAPI;
}