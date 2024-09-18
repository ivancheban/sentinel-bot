# UX Sentinel Bot

UX Sentinel Bot is a Telegram bot designed to verify new members joining a group by asking them to complete a specific phrase. This bot is deployed on Netlify as a serverless function.

## Features

- Automatically intercepts join requests for the Telegram group
- Asks new members to complete the phrase "Душу, тіло ми положим за ..."
- Approves members who correctly answer with "нашу свободу"
- Provides feedback for correct and incorrect answers
- Handles both real join requests and test scenarios

## Prerequisites

- Node.js (version 14.x recommended)
- A Telegram Bot Token (obtained from BotFather)
- A Netlify account for deployment

## Setup

1. Clone this repository:

    ```
    git clone https://github.com/your-username/ux-sentinel-bot.git cd ux-sentinel-bot
    ```
1. Install dependencies:

    ```
    npm install
    ```

1. Create a `.env` file in the root directory and add your Telegram Bot Token:

    ```
    TELEGRAM_BOT_TOKEN=your_bot_token_here
    ```

1. Deploy to Netlify:

    - Connect your GitHub repository to Netlify
    - Set the build command to `npm run build`
    - Set the publish directory to `public`
    - Add the `TELEGRAM_BOT_TOKEN` as an environment variable in Netlify

1. After deployment, set up the Telegram webhook:
Replace `<YOUR_BOT_TOKEN>` and `<YOUR_NETLIFY_DOMAIN>` in this URL and open it in a browser:

    ```
    https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://<YOUR_NETLIFY_DOMAIN>/.netlify/functions/bot
    ```

## Usage

1. Add the bot to your Telegram group as an administrator with the following permissions:

    - Delete messages
    - Ban users
    - Invite users via link
    - Manage voice chats
    - Change group info
    - Pin messages
    - Add new admins

1. Set your group to "Private" and enable "Approve New Members" in the group settings.

1. When new members try to join using an invite link, the bot will intercept the request and ask them to complete the phrase.

1. Members who correctly complete the phrase will be automatically approved to join the group.

## Testing

You can test the bot's functionality using the `/test` command in a direct message to the bot. This simulates a join request without actually joining a group.

## Troubleshooting

If you encounter any issues:
- Check the Netlify function logs for error messages
- Verify that the webhook is set correctly
- Ensure the bot has the necessary permissions in the Telegram group

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
