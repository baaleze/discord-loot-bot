var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./notabotauth.json');
var fs = require('fs');
var rita = require('rita');

var chance = 0.2; // pourcentage de chance

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// INIT MARKOV CHAIN
var markov = new rita.RiMarkov(4);
markov.loadFrom('markov_lexicon.txt');

// Initialize Discord Bot
var bot = new Discord.Client();
bot.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
});

bot.on('error',(error) => { logger.error(error.message); });

bot.on('message', (message) => {
    // learn it
    markov.loadText(message.content);

    // store it for next time
    fs.appendFileSync('markov_lexicon.txt', message.content);

    // say something ?
    if(Math.random() < chance || message.isMemberMentioned(bot.user)) {
        message.channel.send(markov.generateSentence());
    }
});

bot.login(auth.token);
