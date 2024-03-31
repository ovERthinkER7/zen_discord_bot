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
        const targetUser = interaction.options.get("user").value;
        const msg = interaction.options.get("message").value;

        const user = await interaction.guild.members.fetch(targetUser);

        await interaction.deferReply({ ephemeral: true });
        const channel = interaction.channel;
        const channelid = interaction.channelId;
        var flag = 1;
        const editwebhook = await interaction.guild.fetchWebhooks();
        // console.log(editwebhook);
        await Promise.all(
            editwebhook.map(async (webhooks) => {
                if (
                    webhooks.name == user.displayName &&
                    webhooks.channelId == channelid
                ) {
                    flag = 0;
                    try {
                        await webhooks.send({
                            content: msg,
                        });
                        await interaction.editReply({
                            content: "command completed",
                            ephemeral: true,
                        });
                    } catch (err) {
                        return console.log(err);
                    }
                    return;
                }
            })
        );
        // console.log(user.displayName);
        if (flag == 1) {
            const webhook = await channel
                .createWebhook({
                    name: user.displayName,
                    avatar: user.user.displayAvatarURL(),
                    channel: channelid,
                })
                .catch((err) => {
                    return interaction.editReply({
                        content: `something went wrong`,
                    });
                });

            try {
                await webhook.send({
                    content: msg,
                });
                await interaction.editReply({
                    content: "command completed",
                    ephemeral: true,
                });
            } catch (err) {
                return console.log(err);
            }
        }
    },

    name: "prank",
    description: "Prank someone",
    options: [
        {
            name: "user",
            description: "the user you want to disguise yourself.",
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: "message",
            description: "What you want to say.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    testOnly: true,
};
