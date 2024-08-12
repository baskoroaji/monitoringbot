const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getUserInfoByUsername } = require('../../utils/userInfo');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('searchname')
        .setDescription('Search for users by username')
        .addStringOption(option => option.setName('name').setDescription('The user ID to search for').setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name');

        console.log(`Searching for users with name: ${name}`);

        try {
            await interaction.deferReply();
            const userData = await getUserInfoByUsername(name);
            console.log('User data:', userData);

            if (userData && userData.length > 0) {
                // Split data into pages
                const itemsPerPage = 5; // Number of users per page
                const pages = [];
                for (let i = 0; i < userData.length; i += itemsPerPage) {
                    pages.push(userData.slice(i, i + itemsPerPage));
                }

                // Function to create an embed for a page
                const createEmbed = (pageIndex) => {
                    const embed = new EmbedBuilder()
                        .setTitle('Search Results')
                        .setColor('#0099ff')
                        .setDescription(`Users matching user ID: ${name} DISCLAIMER: the data are incosistent only update when GW occurs`)
                        .setTimestamp()
                        .setFooter({ text: `Page ${pageIndex + 1} of ${pages.length}`, iconURL: 'https://example.com/icon.png' });

                    pages[pageIndex].forEach(user => {
                        embed.addFields(
                            {name: 'userid', value: user.userid.toString(), inline: true},
                            { name: 'Username', value: user.name, inline: true },
                            { name: 'Level', value: user.level.toString(), inline: true }
                        );
                    });

                    return embed;
                };

                // Initialize the current page index
                let currentPage = 0;

                // Create the action row with buttons
                const actionRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('previous')
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === 0),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === pages.length - 1)
                    );

                // Initial reply with the first page
                await interaction.editReply({ embeds: [createEmbed(currentPage)], components: [actionRow] });

                // Create a collector to handle button interactions
                const filter = i => i.customId === 'previous' || i.customId === 'next';
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

                collector.on('collect', async i => {
                    if (i.customId === 'next' && currentPage < pages.length - 1) {
                        currentPage++;
                    } else if (i.customId === 'previous' && currentPage > 0) {
                        currentPage--;
                    }

                    await i.update({ embeds: [createEmbed(currentPage)], components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('previous')
                                    .setLabel('Previous')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(currentPage === 0),
                                new ButtonBuilder()
                                    .setCustomId('next')
                                    .setLabel('Next')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(currentPage === pages.length - 1)
                            )
                    ]});
                });

                collector.on('end', collected => {
                    interaction.editReply({ components: [] }); // Remove buttons after timeout
                });

            } else {
                await interaction.editReply(`No users found with Name: ${name}`);
            }
        } catch (error) {
            console.error('Error executing search:', error);
            await interaction.editReply({ content: 'An error occurred while searching for users.', ephemeral: true });
        }
    }
};
