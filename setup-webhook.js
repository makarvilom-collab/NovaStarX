const axios = require('axios');

const BOT_TOKEN = '8426741513:AAHu3bFpf7cxs810eFoEJQpZ_Aa-8t2bJ_A';
const WEBHOOK_URL = 'https://nova-star-q027s0fjh-makars-projects-f5592fc0.vercel.app/api/webhook';

async function setupWebhook() {
    try {
        console.log('🔧 Настраиваю webhook для NovaStarsX бота...');
        
        // Удаляем старый webhook
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);
        console.log('✅ Старый webhook удален');
        
        // Устанавливаем новый webhook
        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
            url: WEBHOOK_URL,
            allowed_updates: ['message', 'callback_query', 'inline_query']
        });
        
        if (response.data.ok) {
            console.log('🎉 Webhook успешно установлен!');
            console.log(`📡 URL: ${WEBHOOK_URL}`);
        } else {
            console.error('❌ Ошибка установки webhook:', response.data);
        }
        
        // Проверяем информацию о webhook
        const info = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
        console.log('\n📊 Информация о webhook:');
        console.log(JSON.stringify(info.data.result, null, 2));
        
        // Проверяем информацию о боте
        const botInfo = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
        console.log('\n🤖 Информация о боте:');
        console.log(`Имя: ${botInfo.data.result.first_name}`);
        console.log(`Username: @${botInfo.data.result.username}`);
        console.log(`ID: ${botInfo.data.result.id}`);
        
    } catch (error) {
        console.error('❌ Ошибка:', error.response?.data || error.message);
    }
}

setupWebhook();