var Discord = require('discord.js');
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
var robin = '{ "<start>":"Nom d\'un <m> %U%! | Nom d\'une <f> %U%! ", \
"<m>":"<mpre> <mword> <msuf> | <mpre> <mword> | <mword> <msuf> | <mword>", \
"<f>":"<fpre> <fword> <fsuf> | <fpre> <fword> | <fword> <fsuf> | <fword>", \
"<mword>":"puit | salami | saucisson | calamar | mollet | Batman | ordinateur | meuble IKEA | cornichon | schtroumpf | feldspath plagioclase | surimi ",\
"<fword>":"péridurale | péridotite | catin | rivière | maison | prémolaire | vipère | flaque de transpiration | moisissure | ",\
"<mpre>":"gigantesque | stupide | petit | charmant | super | méga | grand | délicieux ",\
"<msuf>":"mural | artésien | en crue | en faible quantité | en rupture de stock | limitrophe | excessivement merveilleux | hanté | moisi | à la confiture | aspic | en carton | au chocolat | cutané | pas super génial ",\
"<fpre>":"gigantesque | stupide | petite | charmante | super | méga | grande | délicieuse ",\
"<fsuf>":"murale | artésienne | en crue | en faible quantité | en rupture de stock | limitrophe | excessivement merveilleuse | hantée | moisie | à la confiture | aspic | en carton | au chocolat | cutanée | pas super géniale "\
}';

var robinGrammar = rita.RiGrammar();
robinGrammar.load(robin);

// Initialize Discord Bot
var bot = new Discord.Client();
bot.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
});

bot.on('error',(error) => { logger.error(error.message); });

bot.on('message', (message) => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if(message.isMemberMentioned(bot.user)){
        var s = robinGrammar.expand();
        s = s.replace(new RegExp(/%U%/,'g'), message.author.username);
		message.channel.send(s)
	 }
});

bot.login(auth.token);





