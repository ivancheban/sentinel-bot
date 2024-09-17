const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const pendingRequests = new Map();

// Handle /start command
bot.command('start', (ctx) => {
  ctx.reply('Welcome! This bot verifies new members. Use /test to simulate the join process.');
});

// Handle /test command
bot.command('test', (ctx) => {
  const userId = ctx.from.id;
  pendingRequests.set(userId, ctx.chat.id);
  ctx.reply('Simulating join request. Please complete the phrase:\n\n"Душу, тіло ми положим за ..."');
});

// Handle chat member updates (for actual group joins)
bot.on('chat_member', async (ctx) => {
  const { old_chat_member, new_chat_member } = ctx.chatMember;
  
  if (old_chat_member.status === 'left' && new_chat_member.status === 'restricted') {
    const userId = new_chat_member.user.id;
    const chatId = ctx.chat.id;
    
    pendingRequests.set(userId, chatId);
    
    await ctx.telegram.sendMessage(userId, 'To join the group, please complete the phrase:\n\n"Душу, тіло ми положим за ..."');
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
        await ctx.reply('Correct! In a real scenario, you would be approved to join the group.');
      } else {
        // This is a real join request
        await ctx.telegram.approveChatJoinRequest(chatId, userId);
        await ctx.reply('Correct! You have been approved to join the group.');
      }
      pendingRequests.delete(userId);
    } else {
      await ctx.reply('Incorrect. Please try again.');
    }
  }
});

// Export the handler function for Netlify
exports.handler = async (event) => {
  try {
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: 'OK' };
  } catch (e) {
    console.error('Error in Telegram bot:', e);
    return { statusCode: 400, body: 'Error' };
  }
};