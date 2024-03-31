require("dotenv").config();
const { Client, IntentsBitField, ActivityType } = require("discord.js");
const mongoose = require("mongoose");
const eventHandler = require("./handlers/eventHandler");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
    ],
});

(async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB.");

        eventHandler(client);
        client.guildSettings = new Map();
        client.on("ready", (c) => {
            client.user.setActivity({
                name: "zen zen zense",
                type: ActivityType.Listening,
            });
        });
        client.on("presenceUpdate", (oldPresence, newPresence) => {
            const member = newPresence.member;
            const guildId = member.guild.id;
            const guildSettings = client.guildSettings.get(guildId);

            if (guildSettings?.loggingEnabled && guildSettings?.logChannel) {
                const channel = client.channels.cache.get(
                    guildSettings.logChannel
                );

                if (channel) {
                    channel.send(
                        `${member.displayName} is now ${newPresence.status}`
                    );
                }
            }
        });

        client.login(process.env.TOKEN);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();
