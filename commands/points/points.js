const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');
const {getUserPoints} = require('../../utils/userInfo');
const { createPointsChart } = require('../../utils/chart');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports={
    data: new SlashCommandBuilder()
    .setName('checkpoint')
    .setDescription('Check your honor')
    .addStringOption(option => option.setName('teamraidid').setDescription('The team raid ID').setRequired(true))
    .addStringOption(option => option.setName('rank').setDescription('The user ID').setRequired(true)),
async execute(interaction) {
    const teamRaidId = interaction.options.getString('teamraidid');
    const userId = interaction.options.getString('userid');
    const userPoints = await getUserPoints(teamRaidId, userId);
    
}
}