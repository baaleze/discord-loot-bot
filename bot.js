var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var rita = require('rita');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// RITA INIT
var y = '{"<start>":" <pre> <item> <ofmod> | <pre> <item>[2] | <item> <ofmod>[2] ", \
"<mod>": "<adj>@ <mod> | <adj>@", \
"<pre>": "<quality> | <quality> <pre> | <adj> | <adj> <pre>", \
"<adj>": "@<adjterm>[3] | @@<intensifier> <adjterm>",\
"<quality>": "@<qterm>[3] | @@<intensifier> <qterm>",\
"<ofmod>": "of @<verb> | of @<concept> | of @<intensifier> @<concept> | of the @<noun> | of the <mod> @<noun> | ,<title> of <thing>",\
"<thing>": "@<noun> | @<concept>",\
"<title>": "<adjterm>@ <titleterm>@ |<titleterm>@ ",\
"<item>": "sword | shield | breastplate | armor | dart | arrow | bow | spear | ring | socks | helmet | Mr <name>@",\
"<name>": "<lastname> | <firstname> <lastname> | <nickname>[2] | <firstname> <nickname> <lastname>[2] ",\
"<lastname>": "Johnson | Guillon-Verne | Rastapopoulos | Marimont | Couanon | Pazat ",\
"<firstname>": "Dwayne | Jeroboeme | Jean-Tchang | Gilbert | Martin | Bertrand | Jean-Louis ",\
"<nickname>": "The Rock | Capitaine Pitaine | El Gringo",\
"<verb>": "lunging | killing | pissing itself | shitting | winning | losing | fighting | murdering",\
"<adjterm>": " blue | red | gold | bright | smelly | radiant | beautiful | white | black | big | small ",\
"<qterm>": "deadly | precise | shitty | fragile | brittle | cheap | expensive | nice ",\
"<intensifier>": "fucking | damn | really | not really | kind of | hugely | somewhat",\
"<titleterm>": "leader | killer | chief | god | assassin | liberator | guardian ",\
"<concept>": " war | beauty | hell | death | heaven | life | shit | stupidity | whatever ",\
"<noun>": "hawk | shit | bull | snake | whatever | sun | moon | thing"}';

var pubg = '{ "<start>":"<loot>%<loot>%<loot>%<loot>%<loot> | <loot>%<loot>%<loot>%<loot> | <loot>%<loot>%<loot> ", \
"<loot>":"15x 7.62 ammo | 10x .200 ammo | x15 scope | x8 scope[2] | Quickdraw mag for pistol | M24 | AWM | Groza | Kar98 | Adrenaline | Painkiller | Lv.3 Helmet | Lv2 Helmet | Ghillie suit | M249 | 100x 5.56 ammo | Pan " \
}';

var robin = '{ "<start>":"Nom d\'un <m> Batman! | Nom d\'une <f> Batman! \:bat:", \
"<m>":"<mpre> <mword> <msuf> | <mpre> <mword> | <mword> <msuf> | <mword>", \
"<f>":"<fpre> <fword> <fsuf> | <fpre> <fword> | <fword> <fsuf> | <fword>", \
"<mword>":"puit | salami | saucisson | calamar | mollet | Batman | ordinateur | meuble IKEA",\
"<fword>":"péridurale | péridotite | catin | rivière | maison |  ",\
"<mpre>":"gigantesque | stupide | petit | charmant | super | méga ",\
"<msuf>":"mural | artésien | en crue | en faible quantité | en rupture de stock | limitrophe | excessivement merveilleux | hanté | moisi ",\
"<fpre>":"gigantesque | stupide | petite | charmante | super | méga ",\
"<fsuf>":"murale | artésienne | en crue | en faible quantité | en rupture de stock | limitrophe | excessivement merveilleuse | hantée | moisie "\
}';

var grammar = rita.RiGrammar();
grammar.load(y);

var pubgGrammar = rita.RiGrammar();
pubgGrammar.load(pubg);

var robinGrammar = rita.RiGrammar();
robinGrammar.load(robin);

// Initialize Discord Bot
logger.error('usign token '+auth.token);
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
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !loot
            case 'loot':
				var s = grammar.expand();
				var count = (s.match(/@/g) || []).length;
				s = s.replace(new RegExp(/@/, 'g'), '');
				var cl = count < 2 ? "\:small_blue_diamond:" : count < 4 ? "\:large_blue_diamond:" : count < 5 ? "\:large_orange_diamond:" : count < 7 ? "\:small_red_triangle:" : "\:diamonds:";
					bot.sendMessage({
						to: channelID,
						message:'You looted a '+cl+'[ '+s.trim()+' ]'+cl 
					});
			case 'pubg':
			case 'carepackage':
			case 'drop':
				if(channelID == 346316727296196629){
					var s = pubgGrammar.expand();
					var lines = s.split('%');
					bot.sendMessage({
							to: channelID,
							message:'The crate contained :' 
						});
					for(var l in lines){
						bot.sendMessage({
							to: channelID,
							message:l
						});
					}
				}
				break;
			case 'help':
				bot.sendMessage({
						to: channelID,
						message:'Commands available : !loot !pubg !carepackage !drop robin(anywhere in the message)' 
					});
            // Just add any case commands if you want to..
         }
     }else if(message.includes("robin") || message.includes("Robin")){
		var s = robinGrammar.expand();
		bot.sendMessage({
				to: channelID,
				message:s
			});
	 }
});







