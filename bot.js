const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Bot state management
const configPath = path.join(__dirname, 'bot-config.json');
let botConfig = {
    enabledChannels: new Set(),
    adminUsers: new Set()
};

// Load configuration from file
function loadConfig() {
    try {
        if (fs.existsSync(configPath)) {
            const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            botConfig.enabledChannels = new Set(data.enabledChannels || []);
            botConfig.adminUsers = new Set(data.adminUsers || []);
        }
        
        // Add admin user from environment
        if (process.env.ADMIN_USER_ID) {
            botConfig.adminUsers.add(parseInt(process.env.ADMIN_USER_ID));
        }
        
        console.log('✅ Configuration loaded successfully');
    } catch (error) {
        console.error('❌ Error loading configuration:', error.message);
    }
}

// Save configuration to file
function saveConfig() {
    try {
        const data = {
            enabledChannels: Array.from(botConfig.enabledChannels),
            adminUsers: Array.from(botConfig.adminUsers)
        };
        fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
        console.log('💾 Configuration saved successfully');
    } catch (error) {
        console.error('❌ Error saving configuration:', error.message);
    }
}

// Check if user is admin
function isAdmin(userId) {
    return botConfig.adminUsers.has(userId);
}

// Check if bot is enabled for a channel
function isBotEnabled(chatId) {
    return botConfig.enabledChannels.has(chatId.toString());
}

// Generate improved caption using Gemini AI
async function generateImprovedCaption(originalCaption) {
    try {
        const prompt = `
You are a professional content editor. Please improve the following text to make it:
- Clear and easy to understand
- Logically structured
- Engaging but professional
- Include relevant emojis (2-4 maximum, don't flood with emojis)
- Maintain the original meaning and key information
- Keep it concise but informative

Original text: "${originalCaption}"

Please provide only the improved version without any explanations or additional text.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const improvedCaption = response.text().trim();
        
        console.log('✨ Caption improved successfully');
        return improvedCaption;
    } catch (error) {
        console.error('❌ Error generating improved caption:', error.message);
        return originalCaption; // Return original if AI fails
    }
}

// Handle channel posts
bot.on('channel_post', async (msg) => {
    try {
        const chatId = msg.chat.id;
        const messageId = msg.message_id;
        
        // Check if bot is enabled for this channel
        if (!isBotEnabled(chatId)) {
            console.log(`🔇 Bot disabled for channel: ${msg.chat.title || chatId}`);
            return;
        }
        
        // Only process messages with captions
        if (!msg.caption) {
            console.log('ℹ️ No caption found, skipping message');
            return;
        }
        
        console.log(`📝 Processing post in channel: ${msg.chat.title || chatId}`);
        console.log(`Original caption: ${msg.caption}`);
        
        // Generate improved caption
        const improvedCaption = await generateImprovedCaption(msg.caption);
        
        // Edit the message caption
        if (improvedCaption !== msg.caption) {
            await bot.editMessageCaption(improvedCaption, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML'
            });
            console.log('✅ Caption updated successfully');
            console.log(`Improved caption: ${improvedCaption}`);
        } else {
            console.log('ℹ️ Caption unchanged');
        }
        
    } catch (error) {
        console.error('❌ Error processing channel post:', error.message);
    }
});

// Handle edited channel posts
bot.on('edited_channel_post', async (msg) => {
    try {
        const chatId = msg.chat.id;
        const messageId = msg.message_id;
        
        // Check if bot is enabled for this channel
        if (!isBotEnabled(chatId)) {
            return;
        }
        
        // Only process messages with captions
        if (!msg.caption) {
            return;
        }
        
        console.log(`📝 Processing edited post in channel: ${msg.chat.title || chatId}`);
        
        // Generate improved caption
        const improvedCaption = await generateImprovedCaption(msg.caption);
        
        // Edit the message caption
        if (improvedCaption !== msg.caption) {
            await bot.editMessageCaption(improvedCaption, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML'
            });
            console.log('✅ Edited caption updated successfully');
        }
        
    } catch (error) {
        console.error('❌ Error processing edited channel post:', error.message);
    }
});

// Command: /enable - Enable bot for current channel
bot.onText(/\/enable/, async (msg) => {
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        
        // Check if user is admin
        if (!isAdmin(userId)) {
            await bot.sendMessage(chatId, '❌ You are not authorized to use this command.');
            return;
        }
        
        // Check if it's a channel
        if (msg.chat.type !== 'channel') {
            await bot.sendMessage(chatId, '❌ This command can only be used in channels.');
            return;
        }
        
        // Enable bot for this channel
        botConfig.enabledChannels.add(chatId.toString());
        saveConfig();
        
        await bot.sendMessage(chatId, '✅ Bot enabled! I will now automatically improve post captions using AI.');
        console.log(`✅ Bot enabled for channel: ${msg.chat.title || chatId}`);
        
    } catch (error) {
        console.error('❌ Error enabling bot:', error.message);
        await bot.sendMessage(msg.chat.id, '❌ Error enabling bot. Please try again.');
    }
});

// Command: /disable - Disable bot for current channel
bot.onText(/\/disable/, async (msg) => {
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        
        // Check if user is admin
        if (!isAdmin(userId)) {
            await bot.sendMessage(chatId, '❌ You are not authorized to use this command.');
            return;
        }
        
        // Check if it's a channel
        if (msg.chat.type !== 'channel') {
            await bot.sendMessage(chatId, '❌ This command can only be used in channels.');
            return;
        }
        
        // Disable bot for this channel
        botConfig.enabledChannels.delete(chatId.toString());
        saveConfig();
        
        await bot.sendMessage(chatId, '🔇 Bot disabled! I will no longer edit post captions.');
        console.log(`🔇 Bot disabled for channel: ${msg.chat.title || chatId}`);
        
    } catch (error) {
        console.error('❌ Error disabling bot:', error.message);
        await bot.sendMessage(msg.chat.id, '❌ Error disabling bot. Please try again.');
    }
});

// Command: /status - Check bot status for current channel
bot.onText(/\/status/, async (msg) => {
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        
        // Check if user is admin
        if (!isAdmin(userId)) {
            await bot.sendMessage(chatId, '❌ You are not authorized to use this command.');
            return;
        }
        
        const isEnabled = isBotEnabled(chatId);
        const status = isEnabled ? '✅ Enabled' : '🔇 Disabled';
        const channelName = msg.chat.title || 'Unknown Channel';
        
        await bot.sendMessage(chatId, `📊 **Bot Status**\n\n🏷️ Channel: ${channelName}\n📡 Status: ${status}\n\nUse /enable or /disable to change status.`, {
            parse_mode: 'Markdown'
        });
        
    } catch (error) {
        console.error('❌ Error checking status:', error.message);
        await bot.sendMessage(msg.chat.id, '❌ Error checking status. Please try again.');
    }
});

// Command: /help - Show help message
bot.onText(/\/help/, async (msg) => {
    const helpMessage = `
🤖 **Telegram Gemini Bot Help**

This bot automatically improves channel post captions using AI.

**Commands:**
• /enable - Enable bot for this channel
• /disable - Disable bot for this channel  
• /status - Check current bot status
• /help - Show this help message

**Features:**
✨ Automatically improves post captions
📝 Makes text clear and logical
😊 Adds appropriate emojis (not too many!)
🔧 Easy enable/disable control

**Note:** Only authorized admins can control the bot.
    `;
    
    await bot.sendMessage(msg.chat.id, helpMessage, { parse_mode: 'Markdown' });
});

// Handle bot startup
bot.on('polling_error', (error) => {
    console.error('❌ Polling error:', error.message);
});

// Initialize bot
async function initializeBot() {
    try {
        loadConfig();
        
        const botInfo = await bot.getMe();
        console.log('🚀 Bot started successfully!');
        console.log(`📱 Bot Username: @${botInfo.username}`);
        console.log(`🆔 Bot ID: ${botInfo.id}`);
        console.log(`👥 Admin Users: ${Array.from(botConfig.adminUsers).join(', ')}`);
        console.log(`📢 Enabled Channels: ${botConfig.enabledChannels.size}`);
        console.log('');
        console.log('🎯 Bot is ready to improve your channel posts!');
        console.log('💡 Use /help in any channel to see available commands.');
        
    } catch (error) {
        console.error('❌ Error initializing bot:', error.message);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down bot...');
    saveConfig();
    bot.stopPolling();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down bot...');
    saveConfig();
    bot.stopPolling();
    process.exit(0);
});

// Start the bot
initializeBot();