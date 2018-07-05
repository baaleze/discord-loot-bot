var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./yugibotauth.json');
var rita = require('rita');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// INIT MARKOV CHAIN
var dialogueMarkov = new rita.RiMarkov(3,true,true);
dialogueMarkov.loadFrom('dialogue.txt');
dialogueMarkov.minSentenceLength = 3;

var descriptionMarkov = new rita.RiMarkov(3,true,true);
descriptionMarkov.loadFrom('description.txt');
descriptionMarkov.minSentenceLength = 3;

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
        if(message.isMemberMentioned(bot.user)) {
            var text = '';
            var nbLine = Math.floor(Math.random()*5) + 1;
            var line = '';
            for (var i=0;i<nbLine;i++) {
                var desc = false;
                if (Math.random() > 0.3) {
                    line = dialogueMarkov.generateSentences(1)[0];
                } else {
                    desc = true;
                    line = descriptionMarkov.generateSentences(1)[0];
                }
                line = line.replace('..','.').replace('?.','?').replace('!.','!').replace(' .','.');
                if (!desc){
                    text = line + '\n';
                }else {
                    text = '***' + line + '***' + '\n';
                }
                message.channel.send(text);
            }            
        }
    }
});

bot.login(auth.token);
