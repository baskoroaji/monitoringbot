const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
			console.log(`[Interaction] - /${interaction.commandName} was triggered by ${interaction.user.username}`);
		} catch (error) {
			console.log("===== Error =====");
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
			console.log("===== Error =====");
		}
	},
};