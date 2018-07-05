var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./botrossauth.json');
var rita = require('rita');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// INIT MARKOV CHAIN
var markov = new rita.RiMarkov(4,true,true);
markov.loadFrom('bob.txt');
markov.minSentenceLength = 6;

// Initialize Discord Bot
var bot = new Discord.Client();
bot.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
});

bot.on('error',(error) => { logger.error(error.message); });

bot.on('message', (message) => {
    if(message.author.username != 'yugibot'){
        // say something ?
        if(message.isMemberMentioned(bot.user) || Math.random() < 0.1) {
            var nbLine = Math.floor(Math.random()*3) + 1;
            markov.generateSentences(nbLine).forEach(s => {
                message.channel.send(s);
            });
        }
    }
});

bot.login(auth.token);
