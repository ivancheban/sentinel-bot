const { Telegraf } = require('telegraf');

console.log('Bot file loaded');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

console.log('Bot initialized');

const pendingRequests = new Map();

// Handle /start command
bot.command('start', (ctx) => {
  console.log('Start command received');
  ctx.reply('🇺🇦 Ласкаво просимо! Цей бот перевіряє нових учасників. Використовуйте /test для симуляції процесу приєднання. 🤖');
});

// Handle /test command
bot.command('test', (ctx) => {
  console.log('Test command received');
  const userId = ctx.from.id;
  pendingRequests.set(userId, ctx.chat.id);
  ctx.reply('🔍 Симуляція запиту на приєднання. Будь ласка, продовжіть фразу:\n\n"Душу, тіло ми положим за ..."');
});

// Handle chat join requests
bot.on('chat_join_request', async (ctx) => {
  console.log('Chat join request received');
  const userId = ctx.chatJoinRequest.from.id;
  const chatId = ctx.chatJoinRequest.chat.id;
  
  pendingRequests.set(userId, chatId);
  
  await ctx.telegram.sendMessage(userId, '🚪 Щоб приєднатися до групи, будь ласка, продовжіть фразу:\n\n"Душу, тіло ми положим за ..."');
});

// Handle user messages
bot.on('message', async (ctx) => {
  console.log('Message received');
  const userId = ctx.from.id;
  const chatId = pendingRequests.get(userId);
  
  if (chatId) {
    if (ctx.message.text.toLowerCase() === 'нашу свободу') {
      if (chatId === ctx.chat.id) {
        // This is a test scenario
        await ctx.reply('✅ Правильно! У реальному сценарії вас би схвалили для приєднання до групи. 🎉');
      } else {
        // This is a real join request
        try {
          await ctx.telegram.approveChatJoinRequest(chatId, userId);
          await ctx.reply('✅ Правильно! Вас схвалено для приєднання до групи. 🎊');
        } catch (error) {
          console.error('Error approving join request:', error);
          await ctx.reply('❌ Виникла помилка при спробі схвалити ваш запит. Будь ласка, спробуйте ще раз пізніше.');
        }
      }
      pendingRequests.delete(userId);
    } else {
      await ctx.reply('❌ Неправильно. Будь ласка, спробуйте ще раз. 🔄');
    }
  }
});

console.log('Bot commands set up');

// Export the handler function for Netlify
exports.handler = async (event) => {
  console.log('Handler function called');
  try {
    await bot.handleUpdate(JSON.parse(event.body));
    console.log('Update handled successfully');
    return { statusCode: 200, body: 'OK' };
  } catch (e) {
    console.error('Error in Telegram bot:', e);
    return { statusCode: 400, body: 'Error: ' + e.message };
  }
};

console.log('Handler function exported');