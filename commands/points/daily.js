const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { getUserPoints } = require('../../utils/userInfo');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dailyhonor')
        .setDescription('Search for users by user ID')
        .addStringOption(option => option.setName('teamraid').setDescription('The user ID to search for').setRequired(true))
        .addStringOption(option => option.setName('userid').setDescription('The user ID to search for').setRequired(true)),
    async execute(interaction) {
        const teamraid = interaction.options.getString('teamraid');
        const userid = interaction.options.getString('userid');
        

        console.log(`Searching for users with userid: ${userid}`);

        try {
            await interaction.deferReply();

            const userData = await getUserPoints(teamraid, userid);

            if (userData && userData.length > 0) {
                // Group data by day and calculate total points per day
                const groupedData = userData.reduce((acc, item) => {
                    const date = new Date(item.updatetime * 1000);
                    const jstOffset = 8 * 60 * 60 * 1000; // 9 hours in milliseconds
                    const jstDate = new Date(date.getTime() + jstOffset);
                    const dateString = `${jstDate.getUTCFullYear()}-${String(jstDate.getUTCMonth() + 1).padStart(2, '0')}-${String(jstDate.getUTCDate()).padStart(2, '0')}`;

                    if (!acc[dateString]) {
                        acc[dateString] = [];
                    }
                    acc[dateString].push(item);
                    return acc;
                }, {});

                // Calculate total points per day
                const dailyTotals = Object.entries(groupedData).map(([date, points]) => {
                const lastHonor = points[points.length - 1];
                console.log(lastHonor);
                return {date, lastHonor};
                    
        });
                
             const summary = dailyTotals.map(( {date, lastHonor} ) => (
            `${date}\n Point: ${lastHonor.point.toLocaleString()}`
        )).join('\n\n');
            console.log('Summary:', summary);

                const embed = new EmbedBuilder()
                    .setTitle('User Information')
                    .setColor('#0099ff')
                    .setDescription(`Details for user ID: ${userid}`).setFooter({ text: "Disclaimer data for prelim,interlude, and final day 1 mostly innacurate" })
                    .addFields({ name: 'Summary', value: summary});

                await interaction.editReply({ embeds: [embed] });

            } else {
                await interaction.editReply(`No users found with user ID: ${userid}`);
            }
        } catch (error) {
            console.error('Error executing search:', error);
            await interaction.editReply({ content: 'An error occurred while searching for users.', ephemeral: true });
        }
    }
};
function getPointDiffs(data) {
    return data.map((point, index) => {
        if (index === 0) {
            return 0;
        }
        return point - data[index - 1];
    });
}