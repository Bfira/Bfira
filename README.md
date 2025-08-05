# 🤖 Telegram Gemini Bot

A powerful Telegram bot that automatically improves channel post captions using Google's Gemini AI. The bot makes your content more engaging, clear, and professional while adding appropriate emojis.

## ✨ Features

- 🔄 **Automatic Caption Enhancement**: Automatically improves post captions using AI
- 📝 **Smart Text Processing**: Makes content clear, logical, and engaging
- 😊 **Emoji Integration**: Adds relevant emojis without flooding (2-4 max per post)
- 🎛️ **Easy Control**: Simple `/enable` and `/disable` commands per channel
- 🔐 **Admin Authorization**: Only authorized users can control the bot
- 💾 **Persistent Settings**: Bot remembers enabled/disabled channels across restarts
- 🛡️ **Error Handling**: Robust error handling and graceful fallbacks
- 📊 **Status Monitoring**: Check bot status with `/status` command

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Telegram Bot Token from [@BotFather](https://t.me/BotFather)
- Google Gemini API Key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone or download this project**
   ```bash
   git clone <repository-url>
   cd telegram-gemini-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your credentials:
   ```env
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   GEMINI_API_KEY=your_gemini_api_key_here
   BOT_USERNAME=your_bot_username_here
   ADMIN_USER_ID=your_telegram_user_id_here
   ```

4. **Start the bot**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

## 🔧 Setup Guide

### 1. Create Telegram Bot

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` command
3. Choose a name and username for your bot
4. Copy the bot token and add it to your `.env` file
5. Send `/setprivacy` to BotFather and select your bot
6. Choose "Disable" to allow the bot to read all messages

### 2. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and add it to your `.env` file

### 3. Find Your User ID

1. Message [@userinfobot](https://t.me/userinfobot) on Telegram
2. Copy your user ID and add it to the `.env` file as `ADMIN_USER_ID`

### 4. Add Bot to Your Channel

1. Go to your Telegram channel
2. Click on channel name → "Manage Channel" → "Administrators"
3. Click "Add Admin" and search for your bot username
4. Give the bot permission to "Edit messages of others"
5. Add the bot as an administrator

## 📱 Usage

### Commands

All commands work only for authorized admin users:

- `/enable` - Enable bot for the current channel
- `/disable` - Disable bot for the current channel
- `/status` - Check current bot status for the channel
- `/help` - Show help message with all commands

### How It Works

1. **Enable the bot** in your channel using `/enable`
2. **Post content** with captions in your channel
3. **Watch the magic** as the bot automatically improves your captions
4. **Disable anytime** using `/disable` when you don't want automatic editing

### Example Transformation

**Before:**
```
new product launch today check it out amazing features
```

**After:**
```
🚀 New Product Launch Today! 

Check out our latest innovation with amazing features that will transform your experience. Don't miss out on this exciting opportunity! ✨

#ProductLaunch #Innovation 🔥
```

## 🔐 Security Features

- **Admin-only commands**: Only authorized users can control the bot
- **Channel-specific settings**: Enable/disable per channel independently  
- **Secure token handling**: Environment variables for sensitive data
- **Graceful error handling**: Bot continues working even if AI service fails

## 📁 Project Structure

```
telegram-gemini-bot/
├── bot.js              # Main bot application
├── package.json        # Node.js dependencies
├── .env.example        # Environment variables template
├── .env               # Your environment variables (create this)
├── bot-config.json    # Bot configuration (auto-generated)
└── README.md          # This file
```

## 🔄 Configuration

The bot automatically creates a `bot-config.json` file to store:
- Enabled channels list
- Admin users list
- Persistent settings across restarts

## 🛠️ Troubleshooting

### Common Issues

1. **Bot not responding to commands**
   - Check if your user ID is correctly set in `ADMIN_USER_ID`
   - Ensure the bot is added as an admin to the channel

2. **Captions not being edited**
   - Verify the bot is enabled with `/status`
   - Check bot has "Edit messages of others" permission
   - Ensure posts have captions (text-only posts won't be processed)

3. **API errors**
   - Verify your Gemini API key is correct and active
   - Check your Telegram bot token is valid
   - Ensure you have internet connection

### Logs

The bot provides detailed console logs:
- ✅ Success messages
- ❌ Error messages  
- ℹ️ Information messages
- 🔇 Status messages

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Using PM2 (Recommended for production)
```bash
npm install -g pm2
pm2 start bot.js --name "telegram-gemini-bot"
pm2 save
pm2 startup
```

## 📝 License

MIT License - feel free to modify and distribute!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all environment variables are correctly set
4. Verify bot permissions in your channel

---

**Made with ❤️ for better Telegram channel management**
