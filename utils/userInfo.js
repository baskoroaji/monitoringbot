const axios = require('axios');
const { Client, GatewayIntentBits, MessageAttachment, MessageEmbed } = require('discord.js');
const { gbfUrl } = require('./api');

//get info user
    
    async function searchUser(query) {
        if (!query.userid && !query.name) {
            console.log("Please provide either userId or username.");
            return null;
        }
        try {
            const response = await axios.get(`${gbfUrl}user?userid=${query.userid}&username=${query.name}`, { params: query });
            return response.data.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async function getUserInfoByUsername(name) {
        this.name = name;
        if (!name) {
            console.log("Please provide the username.");
            return null;
        }
        try {
            const response = await axios.get(`${gbfUrl}user?userid=&username=${name}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching data from API:', error);
            return null;
        }
    }
    async function getUserInfoByUserId(userid) {
        this.userid = userid;
        if (!userid) {
            console.log("Please provide the userid.");
            return null;
        }
        try {
            const response = await axios.get(`${gbfUrl}user?userid=${userid}&username=`);
            return response.data.data;
            console.log(response);
        } catch (error) {
            console.error('Error fetching data from API:', error);
            return null;
        }
    }
    async function getUserPoints(teamRaidId, userId){
        if (!teamRaidId && !userId) {
            console.log("please provide the data");
        }
        try{
            const response = await axios.get(`${gbfUrl}point?teamraidid=teamraid0${teamRaidId}&type=user&id=${userId}`);
            return response.data.data;
            console.log(response.data.data);
        }
        catch(error){
            console.log(error);
            return null;
        }
    }
        async function getUserPointsRank90k(teamRaidId, rank){
            this.rank = rank;
            if (!teamRaidId) {
                console.log("please provide the data");
            }
            try{
                const response = await axios.get(`${gbfUrl}line?teamraidid=teamraid0${teamRaidId}&type=user&rank=${rank}`);
                return response.data.data;
                console.log(response.data.data);
            }
            catch(error){
                console.log(error);
                return null;
            }
//match the search result to get the points

}
async function getUserInfo(teamRaidId, userId, username) {
    const query = {};
    if (userId) query.userid = userId;
    if (username) query.username = username;

    const searchResults = await searchUser(query);
    if (!searchResults || searchResults.length === 0) {
        console.log("No users found.");
        return null;
    }

    for (const user of searchResults) {
        console.log(`Found user: ${user.username} (ID: ${user.id}) (Rank: ${user.rank})`);

        const userPoints = await getUserPoints(teamRaidId, user.id);
        if (userPoints) {
            console.log(`User points for ${user.username}:`, userPoints);
        } else {
            console.log(`Failed to fetch points for user: ${user.username}`);
        }
    }
}
module.exports = {
    getUserPoints,
    getUserInfo,
    searchUser,
    getUserInfoByUsername,
    getUserInfoByUserId,
    getUserPointsRank90k
}