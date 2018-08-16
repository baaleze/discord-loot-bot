var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./fakeauth.json');
var fr = require('./french.json');
var en = require('./english.json');
var fr2 = require('./french2.json');
var en2 = require('./english2.json');
var kr = require('./korean.json');
var nr = require('./norsk.json');
var jp = require('./japanese.json');
var prenoms = require('./prenoms.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
logger.error('usign token '+auth.token);
var bot = new Discord.Client();
bot.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
});

bot.on('error',(error) => { logger.error(error.message); });

bot.on('message', message => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
		var cmd = args[0];
		var lang = args[1];
		var nb = Number(args[2]);
		if ( nb || !Number.isInteger(nb) || nb < 1){
			nb = 1;
		}
        switch(cmd) {
            // !loot
			case 'fake':
				var words = [];
				var wordArray = fr;
				switch(lang) {
					case 'FR':
					case 'french':
					case 'français':
						wordArray = fr;
						break;
					case 'FR2':
						wordArray = fr2;
						break;
					case 'EN2':
						wordArray = en2;
						break;
					case 'JP':
					case 'japanese':
					case 'japonais':
						wordArray = jp;
						break;
					case 'NR':
					case 'norwegian':
					case 'norvégien':
						wordArray = nr;
						break;
					case 'EN':
					case 'english':
					case 'anglais':
						wordArray = en;
						break;
					case 'KR':
					case 'korean':
					case 'coréen':
						wordArray = kr;
						break;
					case 'prenoms':
						wordArray = prenoms;
						break;
				}
				for(var i = 0; i < nb; i++) {
					words.push(wordArray[Math.floor(Math.random() * wordArray.length)]);
				}
				message.channel.send(words.join(' '));
				break;
			
			case 'help':
				message.channel.send('Usage: !fake [lang default:FR] [nbWords default:1]');
				message.channel.send('Available languages: prenoms FR JP EN NR KR FR2 EN2 (EN2 and FR2 are less strict)');
				break;
         }
     }
});

bot.login(auth.token);





