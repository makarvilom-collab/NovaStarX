// PixelStars API Mock сервер для разработки и тестирования
class PixelStarsAPI {
    constructor() {
        this.baseURL = '/api';
        this.isProduction = false; // Для продакшена установить в true
        
        // Моковые данные
        this.mockData = {
            rates: {
                buy: 8.50,
                sell: 7.50,
                lastUpdate: Date.now()
            },
            users: new Map(),
            transactions: new Map()
        };
        
        console.log('PixelStars API Mock инициализирован');
    }

    // Проверка initData от Telegram
    verifyInitData(initData) {
        if (this.isProduction) {
            // TODO: Реальная проверка подписи initData
            // 1. Парсим initData
            // 2. Проверяем подпись с использованием BOT_TOKEN
            // 3. Проверяем timestamp (не старше 24 часов)
            // 4. Возвращаем пользователя
            console.warn('ПРОДАКШЕН: Добавьте реальную проверку initData!');
            return null;
        }
        
        // Моковая проверка для разработки
        try {
            if (initData === 'test_data') {
                return {
                    id: 123456789,
                    first_name: 'Test',
                    username: 'testuser',
                    is_bot: false
                };
            }
            
            // Попытка парсинга реальных данных
            const params = new URLSearchParams(initData);
            const user = params.get('user');
            if (user) {
                return JSON.parse(decodeURIComponent(user));
            }
            
            return null;
        } catch (error) {
            console.error('Ошибка парсинга initData:', error);
            return null;
        }
    }

    // Получение текущих курсов
    async getRates() {
        try {
            if (this.isProduction) {
                // TODO: Реальный запрос к API курсов или базе данных
                const response = await fetch(`${this.baseURL}/rates`);
                return await response.json();
            }
            
            // Моковые данные с небольшими колебаниями
            const rates = {
                buy: this.mockData.rates.buy + (Math.random() - 0.5) * 0.3,
                sell: this.mockData.rates.sell + (Math.random() - 0.5) * 0.3,
                lastUpdate: Date.now()
            };
            
            this.mockData.rates = rates;
            
            // Симуляция задержки сети
            await this.delay(200 + Math.random() * 300);
            
            return {
                success: true,
                data: rates
            };
            
        } catch (error) {
            console.error('Ошибка получения курсов:', error);
            return {
                success: false,
                error: 'Ошибка получения курсов'
            };
        }
    }

    // Получение данных пользователя
    async getUserData(initData) {
        try {
            const user = this.verifyInitData(initData);
            if (!user) {
                return {
                    success: false,
                    error: 'Недействительные данные пользователя'
                };
            }
            
            if (this.isProduction) {
                // TODO: Реальный запрос к базе данных
                const response = await fetch(`${this.baseURL}/user`, {
                    headers: {
                        'Authorization': `Bearer ${initData}`
                    }
                });
                return await response.json();
            }
            
            // Моковые данные пользователя
            if (!this.mockData.users.has(user.id)) {
                this.mockData.users.set(user.id, {
                    id: user.id,
                    username: user.username,
                    first_name: user.first_name,
                    balance: Math.floor(Math.random() * 1000),
                    totalTransactions: Math.floor(Math.random() * 50),
                    totalBought: Math.floor(Math.random() * 5000),
                    totalSold: Math.floor(Math.random() * 3000),
                    createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
                });
            }
            
            await this.delay(150);
            
            return {
                success: true,
                data: this.mockData.users.get(user.id)
            };
            
        } catch (error) {
            console.error('Ошибка получения данных пользователя:', error);
            return {
                success: false,
                error: 'Ошибка получения данных пользователя'
            };
        }
    }

    // Покупка звёзд
    async buyStars(initData, amount) {
        try {
            const user = this.verifyInitData(initData);
            if (!user) {
                return {
                    success: false,
                    error: 'Недействительные данные пользователя'
                };
            }
            
            if (!amount || amount < 1 || amount > 10000) {
                return {
                    success: false,
                    error: 'Неверное количество звёзд'
                };
            }
            
            const rates = await this.getRates();
            if (!rates.success) {
                return rates;
            }
            
            const total = amount * rates.data.buy;
            
            if (this.isProduction) {
                // TODO: Реальная обработка платежа
                // 1. Создать invoice в платёжной системе
                // 2. Вернуть URL для оплаты
                // 3. Дождаться webhook о успешной оплате
                // 4. Зачислить звёзды на баланс
                
                const response = await fetch(`${this.baseURL}/buy`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${initData}`
                    },
                    body: JSON.stringify({ amount, total })
                });
                return await response.json();
            }
            
            // Моковая обработка
            await this.delay(1000 + Math.random() * 2000); // Симуляция обработки платежа
            
            // 90% успеха, 10% ошибка для тестирования
            if (Math.random() < 0.9) {
                // Успешная покупка
                const userData = this.mockData.users.get(user.id);
                if (userData) {
                    userData.balance += amount;
                    userData.totalTransactions += 1;
                    userData.totalBought += amount;
                }
                
                // Создаём транзакцию
                const transaction = {
                    id: Date.now() + Math.random(),
                    userId: user.id,
                    type: 'buy',
                    amount: amount,
                    rate: rates.data.buy,
                    total: total,
                    status: 'completed',
                    createdAt: Date.now()
                };
                
                this.mockData.transactions.set(transaction.id, transaction);
                
                return {
                    success: true,
                    data: {
                        transaction,
                        newBalance: userData.balance
                    }
                };
            } else {
                // Ошибка платежа
                return {
                    success: false,
                    error: 'Ошибка обработки платежа'
                };
            }
            
        } catch (error) {
            console.error('Ошибка покупки звёзд:', error);
            return {
                success: false,
                error: 'Ошибка покупки звёзд'
            };
        }
    }

    // Продажа звёзд
    async sellStars(initData, amount) {
        try {
            const user = this.verifyInitData(initData);
            if (!user) {
                return {
                    success: false,
                    error: 'Недействительные данные пользователя'
                };
            }
            
            if (!amount || amount < 1) {
                return {
                    success: false,
                    error: 'Неверное количество звёзд'
                };
            }
            
            const userData = this.mockData.users.get(user.id);
            if (!userData || userData.balance < amount) {
                return {
                    success: false,
                    error: 'Недостаточно звёзд на балансе'
                };
            }
            
            const rates = await this.getRates();
            if (!rates.success) {
                return rates;
            }
            
            const total = amount * rates.data.sell;
            
            if (this.isProduction) {
                // TODO: Реальная обработка продажи
                // 1. Проверить баланс пользователя
                // 2. Заблокировать звёзды
                // 3. Инициировать выплату
                // 4. После подтверждения списать звёзды
                
                const response = await fetch(`${this.baseURL}/sell`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${initData}`
                    },
                    body: JSON.stringify({ amount, total })
                });
                return await response.json();
            }
            
            // Моковая обработка
            await this.delay(800 + Math.random() * 1500);
            
            // 95% успеха для продажи
            if (Math.random() < 0.95) {
                // Успешная продажа
                userData.balance -= amount;
                userData.totalTransactions += 1;
                userData.totalSold += amount;
                
                // Создаём транзакцию
                const transaction = {
                    id: Date.now() + Math.random(),
                    userId: user.id,
                    type: 'sell',
                    amount: amount,
                    rate: rates.data.sell,
                    total: total,
                    status: 'completed',
                    createdAt: Date.now()
                };
                
                this.mockData.transactions.set(transaction.id, transaction);
                
                return {
                    success: true,
                    data: {
                        transaction,
                        newBalance: userData.balance
                    }
                };
            } else {
                return {
                    success: false,
                    error: 'Ошибка обработки продажи'
                };
            }
            
        } catch (error) {
            console.error('Ошибка продажи звёзд:', error);
            return {
                success: false,
                error: 'Ошибка продажи звёзд'
            };
        }
    }

    // История транзакций
    async getTransactionHistory(initData, limit = 50, offset = 0) {
        try {
            const user = this.verifyInitData(initData);
            if (!user) {
                return {
                    success: false,
                    error: 'Недействительные данные пользователя'
                };
            }
            
            if (this.isProduction) {
                const response = await fetch(`${this.baseURL}/transactions?limit=${limit}&offset=${offset}`, {
                    headers: {
                        'Authorization': `Bearer ${initData}`
                    }
                });
                return await response.json();
            }
            
            // Моковые данные
            const userTransactions = Array.from(this.mockData.transactions.values())
                .filter(t => t.userId === user.id)
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(offset, offset + limit);
            
            await this.delay(200);
            
            return {
                success: true,
                data: {
                    transactions: userTransactions,
                    total: userTransactions.length,
                    hasMore: false
                }
            };
            
        } catch (error) {
            console.error('Ошибка получения истории:', error);
            return {
                success: false,
                error: 'Ошибка получения истории транзакций'
            };
        }
    }

    // Вспомогательный метод для симуляции задержки
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Webhook для обработки платежей (для продакшена)
    async handlePaymentWebhook(data) {
        if (!this.isProduction) {
            console.log('Mock webhook:', data);
            return { success: true };
        }
        
        // TODO: Реальная обработка webhook
        // 1. Проверить подпись
        // 2. Проверить статус платежа
        // 3. Обновить баланс пользователя
        // 4. Отправить уведомление
        
        return { success: true };
    }
}

// Инициализация API
window.pixelStarsAPI = new PixelStarsAPI();

// Для модульных систем
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PixelStarsAPI;
}