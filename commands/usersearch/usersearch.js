const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { getUserInfoByUserId } = require('../../utils/userInfo');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search for users by username')
        .addStringOption(option => option.setName('userid').setDescription('The username to search for').setRequired(true)),
        // .addStringOption(option => option.setName('userid').setDescription('The userid to search for').setRequired(true))
    async execute(interaction) {
        const userid = interaction.options.getString('userid');
        // const userid = interaction.options.getString('userid');

        console.log(`Searching for users with userid: ${userid}`);
        const userData = await getUserInfoByUserId(userid);
        console.log("user data:",userData);
        if (userData && userData.length > 0) {
            const embed = new EmbedBuilder()
                    .setTitle('Search Results')
                    .setColor('#0099ff')
                    .setDescription(`Users matching user ID: ${userid}`)
                    .setTimestamp()
                    .setFooter({ text: 'this data is not accurate because this is for GW Honor Lookup' });

                // Add fields for each user
                userData.forEach(user => {
                    embed.addFields({ name: 'Username', value: user.name, inline: true },
                                    { name: 'Level', value: user.level.toString(), inline: true });
                });
                await interaction.reply({embeds : [embed]});
        } else {
            await interaction.reply(`No users found with username: ${userid}`);
        }
    }
};
