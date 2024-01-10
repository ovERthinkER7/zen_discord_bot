const {
    ApplicationCommandOptionType,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
} = require("discord.js");

const chocies = [
    { name: "Rock", emoji: "🪨", beats: "Scissors" },
    { name: "Paper", emoji: "📜", beats: "Rock" },
    { name: "Scissors", emoji: "✂", beats: "Paper" },
];

module.exports = {
    /**
     *
     * @param {object} param0
     * @param {ChatInputCommandInteraction} param0.interaction
     * @returns
     */
    callback: async ({ interaction }) => {
        try {
            const targetUser = interaction.options.getUser("user");
            if (interaction.user.id === targetUser.id) {
                interaction.reply({
                    content:
                        "You cannot play rock play scissors with yourself.",
                    ephemeral: true,
                });
                return;
            }
            if (targetUser.bot) {
                interaction.reply({
                    content: "You cannot play rock play scissors with bot.",
                    ephemeral: true,
                });
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle("Rock Paper Scissor")
                .setDescription(`it's currently ${targetUser}'s turn`)
                .setColor("Blue")
                .setTimestamp(new Date());

            const button = chocies.map((choice) => {
                return new ButtonBuilder()
                    .setCustomId(choice.name)
                    .setLabel(choice.name)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(choice.emoji);
            });

            const row = new ActionRowBuilder().addComponents(button);

            const reply = await interaction.reply({
                content: `${targetUser} you have been challenged to game of rock paper scissors, by ${interaction.user}. To start playing, click one of the button below`,
                embeds: [embed],
                components: [row],
            });
        } catch (error) {
            console.log("error with /rps");
            console.log(error);
        }
    },
    name: "rps",
    description: "Play rock paper scissor with another user",
    dm_premission: false,
    options: [
        {
            name: "user",
            description: "The user you want to play with",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],
};
