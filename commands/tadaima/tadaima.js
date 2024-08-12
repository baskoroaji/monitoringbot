const { SlashCommandBuilder } = require('discord.js');

module.exports={
    data: new SlashCommandBuilder()
    .setName('tadaima')
    .setDescription('Greet ur wife'),
    async execute(interaction) {
		await interaction.reply('Okaerinasai, Danna-sama! (>w<)');
    }

}