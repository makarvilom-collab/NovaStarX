const express = require('express');
const { Telegraf } = require('telegraf');

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '8426741513:AAHu3bFpf7cxs810eFoEJQpZ_Aa-8t2bJ_A');

// Middleware
app.use(express.json());

// Bot commands
bot.start((ctx) => {
    ctx.reply('🌟 Добро пожаловать в NovaStarsX!\n\n' +
              '💰 Покупай звёзды Telegram быстро и безопасно\n' +
              '🔗 Открыть магазин:', {
        reply_markup: {
            inline_keyboard: [[
                { text: '🛒 Открыть NovaStarsX', web_app: { url: 'https://nova-star-q027s0fjh-makars-projects-f5592fc0.vercel.app' } }
            ]]
        }
    });
});

bot.command('buy', (ctx) => {
    ctx.reply('💫 Выберите количество звёзд:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⭐ 100 звёзд', web_app: { url: 'https://nova-star-q027s0fjh-makars-projects-f5592fc0.vercel.app?stars=100' } }],
                [{ text: '⭐ 500 звёзд', web_app: { url: 'https://nova-star-q027s0fjh-makars-projects-f5592fc0.vercel.app?stars=500' } }],
                [{ text: '⭐ 1000 звёзд', web_app: { url: 'https://nova-star-q027s0fjh-makars-projects-f5592fc0.vercel.app?stars=1000' } }],
                [{ text: '🛒 Открыть магазин', web_app: { url: 'https://nova-star-q027s0fjh-makars-projects-f5592fc0.vercel.app' } }]
            ]
        }
    });
});

bot.help((ctx) => {
    ctx.reply('🤖 NovaStarsX Bot Commands:\n\n' +
              '/start - Начать работу\n' +
              '/buy - Купить звёзды\n' +
              '/help - Справка\n\n' +
              '💎 Быстро, безопасно, выгодно!');
});

// Webhook endpoint
app.post('/api/webhook', (req, res) => {
    bot.handleUpdate(req.body);
    res.status(200).send('OK');
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', bot: 'NovaStarsX', timestamp: new Date().toISOString() });
});

// Export for Vercel
module.exports = app;

// Start server locally
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🤖 NovaStarsX Bot server running on port ${PORT}`);
        
        // Set webhook in development
        if (process.env.TELEGRAM_WEBHOOK_URL) {
            bot.telegram.setWebhook(process.env.TELEGRAM_WEBHOOK_URL);
        }
    });
}