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
var markov = new rita.RiMarkov(4,true,true);
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
    // clean message
    var clean = message.cleanContent;
    clean = clean.replace(new RegExp(/@/,'g'), '');
    clean = clean.replace(new RegExp(/[`]{1,3}.+?[`]{1,3}/,'g'), '');
    clean = clean.trim();
    var last = clean.slice(-1);
    if(!(last == '?' || last == '!' || last == '.')){
        clean = clean + '. '; 
    }else{
        clean = clean + ' '; 
    }

    // learn it
    markov.loadText(clean);

    // store it for next time
    fs.appendFileSync('markov_lexicon.txt', clean);

    // say something ?
    if(Math.random()*100 < chance || message.isMemberMentioned(bot.user)) {
        var nb = Math.floor(Math.random() * 2) + 1;
        
        markov.generateSentences(nb).forEach(element => {
            message.channel.send(element);
        });
        
    }
});

bot.login(auth.token);
