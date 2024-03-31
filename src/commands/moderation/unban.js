const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get("target-user").value;
        const reason =
            interaction.options.get("reason")?.value || "No reason provided";

        await interaction.deferReply();
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers))
            return await interaction.editReply({
                content: `You must have permission to ban member to use this command`,
                emphemeral: true,
            });

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(
                `:white_check_mark: <@${targetUserId}> has been unbanned | ${reason}`
            );

        try {
            // Unban the targetUser
            await interaction.guild.members.unban(targetUserId, reason);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(`Error when unbanning user: ${error}`);
            await interaction.editReply(
                "There was an error while unbanning the user."
            );
        }
    },

    name: "unban",
    description: "Unbans a member from this server.",
    options: [
        {
            name: "target-user",
            description: "The user to unban.",
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: "reason",
            description: "Reason for unbanning.",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
};
