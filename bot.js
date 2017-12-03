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
"<pre>": "<opinion> <size> <quality> <shape> <age> <color> <origin> <material>", \
"<opinion>": "@<opinionterm>[2] | @@<intensifier> <opinionterm> | X[4]",\
"<size>": "@<sizeterm>[2] | @@<intensifier> <sizeterm> | X[4]",\
"<quality>": "@<qualityterm>[2] | @@<intensifier> <qualityterm> | X[4]",\
"<shape>": "@<shapeterm>[2] | @@<intensifier> <shapeterm> | X[4]",\
"<age>": "@<ageterm>[2] | @@<intensifier> <ageterm> | X[4]",\
"<color>": "@<colorterm>[2] | @@<intensifier> <colorterm> | X[4]",\
"<origin>": "@<originterm> | X[4]",\
"<material>": "@<matterm> | X[4]",\
"<ofmod>": "of @<verb> | of @<concept> | of the @<noun> | of the <pre> @<noun> | \\\"<title> of <thing>\\\"",\
"<thing>": "@<noun> | @<concept>",\
"<title>": "<adjterm>@ <titleterm>@ | <titleterm>@ ",\
"<item>": "sword | shield | breastplate | armor | dart | arrow | bow | spear | ring | pair of socks | helmet | brick | tool | screwdriver | cup | crown | amulet | tiara | hat | pair of glasses | sandwich | Mr <name>@",\
"<name>": "<lastname> | <firstname> <lastname> | <nickname>[2] | <firstname> \\\"<nickname>\\\" <lastname>[2] ",\
"<lastname>": "Johnson | Guillon-Verne | Rastapopoulos | Marimont | Couanon | Pazat ",\
"<firstname>": "Dwayne | Jeroboeme | Jean-Tchang | Gilbert | Martin | Bertrand | Jean-Louis ",\
"<nickname>": "The Rock | Capitaine Pitaine | El Gringo",\
"<verb>": "lunging | killing | pissing itself | shitting | winning | losing | fighting | murdering",\
"<colorterm>": " blue | red | white | black | yellow | orange | dark | purple | cyan | magenta | brown ",\
"<opinionterm>": " shitty | exquisite | beautiful | nice | good | bad | the worst | alright ",\
"<sizeterm>": " big | small | huge | tiny | long | short ",\
"<shapeterm>": " round | square | triangular | sperical | flat | narrow ",\
"<ageterm>": " old | new | archaic | ancient | recent | up-to-date ",\
"<matterm>": " gold | plastic | wood | leather | copper | slime | stone ",\
"<originterm>": " Chinese | French | Korean | English | American | alien | Indian ",\
"<qualityterm>": "deadly | precise | fragile | brittle | cheap | expensive ",\
"<intensifier>": "fucking | damn | really | not really | kind of | hugely | somewhat ",\
"<titleterm>": "leader | killer | chief | god | assassin | liberator | guardian | totem | light | beacon | jewel | wind ",\
"<concept>": " war | beauty | hell | death | heaven | life | shit | stupidity | whatever ",\
"<noun>": "hawk | shit | bull | snake | whatever | sun | moon | thing | lake | ocean | sea | tree | mountain | stone "}';

var pubg = '{ "<start>":"<loot>%<loot>%<loot>%<loot>%<loot> | <loot>%<loot>%<loot>%<loot> | <loot>%<loot>%<loot> ", \
"<loot>":"15x 7.62 ammo[2] | 10x .200 ammo | x15 scope | x8 scope[2] | Quickdraw mag for pistol | M24 | AWM | Groza | Kar98 | Adrenaline | Painkiller | Lv.3 Helmet | Lv2 Helmet | Ghillie suit | M249 | 100x 5.56 ammo[2] | Pan " \
}';

var robin = '{ "<start>":"Nom d\'un <m> Batman! \:bat: | Nom d\'une <f> Batman! \:bat: ", \
"<m>":"<mpre> <mword> <msuf> | <mpre> <mword> | <mword> <msuf> | <mword>", \
"<f>":"<fpre> <fword> <fsuf> | <fpre> <fword> | <fword> <fsuf> | <fword>", \
"<mword>":"puit | salami | saucisson | calamar | mollet | Batman | ordinateur | meuble IKEA | cornichon ",\
"<fword>":"péridurale | péridotite | catin | rivière | maison | prémolaire ",\
"<mpre>":"gigantesque | stupide | petit | charmant | super | méga ",\
"<msuf>":"mural | artésien | en crue | en faible quantité | en rupture de stock | limitrophe | excessivement merveilleux | hanté | moisi | à la confiture ",\
"<fpre>":"gigantesque | stupide | petite | charmante | super | méga ",\
"<fsuf>":"murale | artésienne | en crue | en faible quantité | en rupture de stock | limitrophe | excessivement merveilleuse | hantée | moisie | à la confiture "\
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
					s = s.replace(new RegExp(/%/, 'g'), '\n');
					bot.sendMessage({
							to: channelID,
							message:'The crate contained :\n'+s 
						});
				}
				break;
			case 'help':
				bot.sendMessage({
						to: channelID,
						message:'Commands available : !loot !pubg !carepackage !drop robin(anywhere in the message)' 
					});
            // Just add any case commands if you want to..
         }
     }else if((message.includes("robin") || message.includes("Robin")) && !(message.includes("robinet") || message.includes("Robinet"))){
		var s = robinGrammar.expand();
		bot.sendMessage({
				to: channelID,
				message:s
			});
	 }
});







