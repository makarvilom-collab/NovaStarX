// PixelStars i18n система локализации
class I18n {
    constructor() {
        this.currentLang = 'ru';
        this.translations = {};
        this.fallbackLang = 'ru';
    }

    async init() {
        // Определяем язык из Telegram WebApp или браузера
        this.detectLanguage();
        
        // Загружаем переводы
        await this.loadTranslations();
        
        console.log(`Локализация инициализирована: ${this.currentLang}`);
    }

    detectLanguage() {
        // Приоритет языков:
        // 1. Telegram WebApp language_code
        // 2. Сохранённый в localStorage
        // 3. Язык браузера
        // 4. Fallback (русский)
        
        if (window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code) {
            const tgLang = window.Telegram.WebApp.initDataUnsafe.user.language_code;
            if (this.isLanguageSupported(tgLang)) {
                this.currentLang = tgLang;
                return;
            }
        }
        
        const savedLang = localStorage.getItem('pixelstars_lang');
        if (savedLang && this.isLanguageSupported(savedLang)) {
            this.currentLang = savedLang;
            return;
        }
        
        const browserLang = navigator.language.split('-')[0];
        if (this.isLanguageSupported(browserLang)) {
            this.currentLang = browserLang;
            return;
        }
        
        this.currentLang = this.fallbackLang;
    }

    isLanguageSupported(lang) {
        return ['ru', 'en'].includes(lang);
    }

    async loadTranslations() {
        try {
            // Загружаем файл с переводами
            const response = await fetch(`./src/i18n/${this.currentLang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.translations = await response.json();
        } catch (error) {
            console.error(`Ошибка загрузки переводов для ${this.currentLang}:`, error);
            
            // Фоллбэк на русский язык
            if (this.currentLang !== this.fallbackLang) {
                try {
                    const fallbackResponse = await fetch(`./src/i18n/${this.fallbackLang}.json`);
                    this.translations = await fallbackResponse.json();
                    this.currentLang = this.fallbackLang;
                } catch (fallbackError) {
                    console.error('Ошибка загрузки fallback переводов:', fallbackError);
                    this.translations = this.getDefaultTranslations();
                }
            } else {
                this.translations = this.getDefaultTranslations();
            }
        }
    }

    getDefaultTranslations() {
        // Базовые переводы если файлы недоступны
        return {
            app: { title: 'PixelStars' },
            actions: { buy: 'Купить', sell: 'Продать' },
            errors: { unknown_error: 'Ошибка' }
        };
    }

    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`Перевод не найден: ${key}`);
                return key;
            }
        }
        
        if (typeof value !== 'string') {
            console.warn(`Перевод не является строкой: ${key}`);
            return key;
        }
        
        // Заменяем параметры в строке
        return this.interpolate(value, params);
    }

    interpolate(str, params) {
        return str.replace(/\{(\w+)\}/g, (match, key) => {
            return params.hasOwnProperty(key) ? params[key] : match;
        });
    }

    async setLanguage(lang) {
        if (!this.isLanguageSupported(lang)) {
            console.warn(`Язык не поддерживается: ${lang}`);
            return;
        }
        
        this.currentLang = lang;
        localStorage.setItem('pixelstars_lang', lang);
        
        await this.loadTranslations();
        this.updatePageContent();
        
        // Событие для уведомления об изменении языка
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    updatePageContent() {
        // Обновляем все элементы с data-i18n атрибутами
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'number')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // Обновляем title страницы
        document.title = this.t('app.title');
    }

    // Вспомогательные методы для форматирования
    formatCurrency(amount, currency = 'rub') {
        const symbol = this.t(`currency.${currency}`);
        if (currency === 'rub') {
            return `${amount.toFixed(2)}${symbol}`;
        }
        return `${amount}${symbol}`;
    }

    formatNumber(num) {
        return new Intl.NumberFormat(this.currentLang === 'ru' ? 'ru-RU' : 'en-US').format(num);
    }

    formatDate(date) {
        const locale = this.currentLang === 'ru' ? 'ru-RU' : 'en-US';
        return new Intl.DateTimeFormat(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
}

// Глобальный экземпляр i18n
window.i18n = new I18n();

// Функция для быстрого доступа к переводам
window.t = (key, params) => window.i18n.t(key, params);

// Экспорт для модульных систем
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}