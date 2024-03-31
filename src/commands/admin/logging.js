const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
    WebhookClient,
} = require("discord.js");

module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const action = interaction.options.get("action").value;
        const channel = interaction.options.get("channel")?.value || 0;

        const guildSettings = client.guildSettings.get(interaction.guild.id);

        if (action === "set_channel") {
            if (!channel)
                return interaction.reply({
                    content: "You must mention a channel.",
                    ephemeral: true,
                });

            client.guildSettings.set(interaction.guild.id, {
                logChannel: channel,
            });
            return interaction.reply({
                content: `Log channel set to ${channel}.`,
                ephemeral: true,
            });
        }

        if (action === "enable") {
            if (!guildSettings?.logChannel)
                return interaction.reply({
                    content: "Log channel is not set.",
                    ephemeral: true,
                });

            client.guildSettings.set(interaction.guild.id, {
                loggingEnabled: true,
            });
            return interaction.reply({
                content: "Logging enabled.",
                ephemeral: true,
            });
        }

        if (action === "disable") {
            client.guildSettings.set(interaction.guild.id, {
                loggingEnabled: false,
            });
            return interaction.reply({
                content: "Logging disabled.",
                ephemeral: true,
            });
        }
    },

    name: "logging",
    description: "Set the log channel and toggle logging on/off",
    options: [
        {
            name: "action",
            description: "What action would you like to perform?",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Set Channel",
                    value: "set_channel",
                },
                {
                    name: "Enable",
                    value: "enable",
                },
                {
                    name: "Disable",
                    value: "disable",
                },
            ],
        },
        {
            name: "channel",
            description: "Mention the log channel to set.",
            type: ApplicationCommandOptionType.Channel,
            required: false,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    // testOnly: true,
};
