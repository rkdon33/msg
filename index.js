const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Example: Command to DM user by ID or username
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!dm')) {
        const args = message.content.split(' ').slice(1);
        const identifier = args[0];
        const textToSend = args.slice(1).join(' ');

        if (!identifier || !textToSend) {
            return message.reply("Usage: `!dm <userID or username#discriminator> <message>`");
        }

        try {
            let user;

            // Try to get by ID
            if (/^\d{17,19}$/.test(identifier)) {
                user = await client.users.fetch(identifier);
            } else if (identifier.includes('#')) {
                // Try to get by username#discriminator
                user = client.users.cache.find(u => `${u.username}#${u.discriminator}` === identifier);
            }

            if (user) {
                await user.send(textToSend);
                message.reply(`✅ DM sent to ${user.tag}`);
            } else {
                message.reply("❌ User not found.");
            }
        } catch (error) {
            console.error(error);
            message.reply("⚠️ Could not send DM.");
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
