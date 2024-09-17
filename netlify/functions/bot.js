const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const pendingRequests = new Map();

// Handle /start command
bot.command('start', (ctx) => {
  ctx.reply('🇺🇦 Ласкаво просимо! Цей бот перевіряє нових учасників. Використовуйте /test для симуляції процесу приєднання. 🤖');
});

// Handle /test command
bot.command('test', (ctx) => {
  const userId = ctx.from.id;
  pendingRequests.set(userId, ctx.chat.id);
  ctx.reply('🔍 Симуляція запиту на приєднання. Будь ласка, продовжіть фразу:\n\n"Душу, тіло ми положим за ..."');
});

// Handle chat member updates (for actual group joins)
bot.on('chat_member', async (ctx) => {
  const { old_chat_member, new_chat_member } = ctx.chatMember;
  
  if (old_chat_member.status === 'left' && new_chat_member.status === 'restricted') {
    const userId = new_chat_member.user.id;
    const chatId = ctx.chat.id;
    
    pendingRequests.set(userId, chatId);
    
    await ctx.telegram.sendMessage(userId, '🚪 Щоб приєднатися до групи, будь ласка, продовжіть фразу:\n\n"Душу, тіло ми положим за ..."');
  }
});

// Handle user messages
bot.on('message', async (ctx) => {
  const userId = ctx.from.id;
  const chatId = pendingRequests.get(userId);
  
  if (chatId) {
    if (ctx.message.text.toLowerCase() === 'нашу свободу') {
      if (chatId === ctx.chat.id) {
        // This is a test scenario
        await ctx.reply('✅ Правильно! У реальному сценарії вас би схвалили для приєднання до групи. 🎉');
      } else {
        // This is a real join request
        await ctx.telegram.approveChatJoinRequest(chatId, userId);
        await ctx.reply('✅ Правильно! Вас схвалено для приєднання до групи. 🎊');
      }
      pendingRequests.delete(userId);
    } else {
      await ctx.reply('❌ Неправильно. Будь ласка, спробуйте ще раз. 🔄');
    }
  }
});

// Export the handler function for Netlify
exports.handler = async (event) => {
  console.log('Received event:', event);
  try {
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: 'OK' };
  } catch (e) {
    console.error('Error in Telegram bot:', e);
    return { statusCode: 400, body: 'Error: ' + e.message };
  }
};