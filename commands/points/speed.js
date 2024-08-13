const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { getUserPoints, getUserPointsRank90k} = require('../../utils/userInfo');
const moment = require('moment-timezone');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('speedavg')
        .setDescription('Search for users by user ID')
        .addStringOption(option => option.setName('teamraid').setDescription('The user ID to search for').setRequired(true))
        .addStringOption(option => option.setName('userid').setDescription('The user ID to search for').setRequired(true))
        .addStringOption(option => option.setName('rank').setDescription('The user ID to search for').setRequired(true)),
    async execute(interaction) {
        const teamraid = interaction.options.getString('teamraid');
        const userid = interaction.options.getString('userid');
        const rank = interaction.options.getString('rank');

        console.log(`Searching for users with userid: ${userid}`);

        try {
            await interaction.deferReply();
            const userData = await getUserPoints(teamraid, userid);
            console.log("user data:",userData);
            const cutoff = await getUserPointsRank90k(teamraid, rank);
            console.log("cutoff data:",cutoff);

                if (userData && userData.length > 0 && cutoff && cutoff.length > 0) {
                    
                  
                    const mySpeed = speed(userData);
                    console.log(mySpeed);
                    const cutoffSpeed90k = speed(cutoff);
                    console.log(cutoffSpeed90k);
                    
                const embed = new EmbedBuilder()
                    .setTitle('User Information Speed Last 1 HOUR')
                    .setColor('#0099ff')
                    .setDescription(`Details for user ID: ${userid}`).setFooter({ text: "Disclaimer data for prelim,interlude, and final day 1 mostly innacurate" })
                    .addFields(
                        { name: 'Your Speed/hour', value: mySpeed.toLocaleString(), inline: true },
                        { name: `Cutoff Speed/hour rank: ${rank}`, value: cutoffSpeed90k.toLocaleString(), inline: true }
                    );

                await interaction.editReply({ embeds: [embed] });

            } else {
                await interaction.editReply(`No users found with user ID: ${userid}`);
            }
        }catch (error) {
            console.error('Error executing search:', error);
            await interaction.editReply({ content: 'An error occurred while searching for users.', ephemeral: true });
        }
    }



};
function speed(data) {
    const lastFiveData = data.slice(data.length - 4, data.length);
            const getPoint = lastFiveData.map((data) => parseInt(data["point"]));
            const diff = getDiff(getPoint);
            return diff.reduce((a, b) => {
            return a + b;
            });
}
function getDiff(data){
    return data.map((point, index) => {
        if (index === 0) {
            return 0;
        }
        return point - data[index - 1];
    });
}
