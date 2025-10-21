const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '8426741513:AAHu3bFpf7cxs810eFoEJQpZ_Aa-8t2bJ_A');

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

// Vercel serverless function
module.exports = async (req, res) => {
    try {
        if (req.method === 'POST') {
            await bot.handleUpdate(req.body);
            res.status(200).json({ ok: true });
        } else {
            res.status(200).json({ 
                status: 'OK', 
                bot: 'NovaStarsX', 
                timestamp: new Date().toISOString(),
                method: req.method 
            });
        }
    } catch (error) {
        console.error('Bot error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};