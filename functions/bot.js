const { Telegraf } = require('telegraf');

// Initialize the bot with your Telegram Bot Token
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Store pending join requests
const pendingRequests = new Map();

// Handle new chat members
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
      await ctx.telegram.approveChatJoinRequest(chatId, userId);
      await ctx.reply('Correct! You have been approved to join the group.');
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