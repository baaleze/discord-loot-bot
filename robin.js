var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./robinauth.json');
var rita = require('rita');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// RITA INIT
var robin = '{ "<start>":"Nom d\'un <m> Batman! \:bat: | Nom d\'une <f> Batman! \:bat: ", \
"<m>":"<mpre> <mword> <msuf> | <mpre> <mword> | <mword> <msuf> | <mword>", \
"<f>":"<fpre> <fword> <fsuf> | <fpre> <fword> | <fword> <fsuf> | <fword>", \
"<mword>":"puit | salami | saucisson | calamar | mollet | Batman | ordinateur | meuble IKEA | cornichon | schtroumpf ",\
"<fword>":"péridurale | péridotite | catin | rivière | maison | prémolaire | vipère ",\
"<mpre>":"gigantesque | stupide | petit | charmant | super | méga | grand ",\
"<msuf>":"mural | artésien | en crue | en faible quantité | en rupture de stock | limitrophe | excessivement merveilleux | hanté | moisi | à la confiture | aspic ",\
"<fpre>":"gigantesque | stupide | petite | charmante | super | méga | grande ",\
"<fsuf>":"murale | artésienne | en crue | en faible quantité | en rupture de stock | limitrophe | excessivement merveilleuse | hantée | moisie | à la confiture | aspic "\
}';

var robinGrammar = rita.RiGrammar();
robinGrammar.load(robin);

// Initialize Discord Bot
logger.error('using token '+auth.token);
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('disconnect', function(errMsg,code) { logger.error(errMsg + ' code ' + code); });

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if((message.includes("robin") || message.includes("Robin")) && !(message.includes("robinet") || message.includes("Robinet"))){
		var s = robinGrammar.expand();
		bot.sendMessage({
				to: channelID,
				message:s
			});
	 }
});







