const Discord = require('discord.js');
const {
    Client,
    Attachment
} = require('discord.js');
const config = require('./config.json'); //Arquivo contendo as informações do bot
const client = new Discord.Client(); //Cria o cliente a usar o bot (client = bot)
const leveling = require('discord-leveling/index.js');

//Carrega as informações em 'config.json'
const {
    prefix
} = config;
const {
    version
} = config;
const {
    author
} = config;
const {
    botname
} = config;

//Informa no console se o bot está online
client.once('ready', () => {
    console.log('A Aiya tá ON!');
    client.user.setActivity('Animes', {
        type: "WATCHING"
    });
})

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'boas-vindas');
    if (!channel) return;
    channel.send(`Seja bem-vindo(a) ao servidor, ${member}! Quem bom que você está aqui ^_^`);
});

//Carrega as mensagens enviadas no canal de texto
client.on('message', async message => {

    if (message.author.bot) return;

    //When someone sends a message add xp
    var profile = await leveling.Fetch(message.author.id)
    leveling.AddXp(message.author.id, 10)
    //If user xp higher than 100 add level
    if (profile.xp + 10 > 100) {
        await leveling.AddLevel(message.author.id, 1)
        await leveling.SetXp(message.author.id, 0)
        message.reply(`Eita, você subiu de nível! Seu nível agora é: ${profile.level + 1}`)
    }

    //If the message does not start with your prefix return.
    if (!message.content.startsWith(prefix)) return;

    //Verifica o prefixo
    if (message.content.substring(0, 1) == prefix) {
        args = message.content.substring(1).split(' ');
        var cmd = args[0];
        var subcmd = args[1];
        args = args.splice(1);

        user = message.author.username; //'user'é mais facil do que essa linha toda sempre

        switch (cmd) {
            case 'ping':
                message.channel.send('pong');
                break;

            case 'info':
                const embedInfo = new Discord.MessageEmbed()
                    .setTitle('Sobre mim, Aiya ^_^')
                    .addField('Meu nome: ', botname)
                    .addField('Criador: ', author)
                    .addField('Versão: ', version)
                    .addField('Plataforma: ', 'Node.JS')
                    .setThumbnail('https://cdn.discordapp.com/avatars/712669022197645323/b0882227f1d6838a2cbad39e250224bd.webp')
                    .setFooter(`Obrigada pela atenção. Espero ser útil :D`)
                    .setColor(0x9B59B6);
                message.channel.send(embedInfo);
                break;

            case 'limpar':
            case 'clear':
                total = parseInt(subcmd) + 1; //A mensagem pra deletar já é uma a se deletar.
                totalDeletado = total - 1; // Recalcula o total anterior para exibir o valor correto.

                if (subcmd == 0) return message.channel.send('❎ Como assim deletar 0 mensagens? Não posso fazer isso.');
                if (!total) return message.channel.send('❎ Oops... você esqueceu de informar quantas mensagens devo deletar!');
                message.channel.bulkDelete(total);
                mensagem1 = `✅ Como você pediu, ${user}! Eu deletei ${totalDeletado} mensagens deste canal.`;
                mensagem2 = `✅ Está feito! Apaguei ${totalDeletado} mensagens deste canal.`;
                mensagem3 = `✅ Limpinho! ${user}, apaguei as ${totalDeletado} mensagens que você pediu.`;
                mensagem4 = `✅ As ${totalDeletado} mensagens foram deletadas com sucesso, ${user}!`;
                mensagem5 = `✅ Mensagens apagadas, ${user}! Foi um total de ${totalDeletado} removidas.`;

                const mensagens = [mensagem1, mensagem2, mensagem3, mensagem4, mensagem5];
                const randomMensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
                message.channel.send(randomMensagem);
                break;

            case 'servidor':
            case 'server':
                const embedServer = new Discord.MessageEmbed()
                    .setTitle('Informações do servidor')
                    .addField('Nome do servidor: ', message.guild.name)
                    .addField('Dono do servidor: ', message.guild.owner)
                    .addField('Quantidade de membros: ', message.guild.memberCount)
                    .setThumbnail(message.guild.iconURL())
                    .setFooter(`Ta aí as informações desse servidor ^_^ ~${botname}`)
                    .setColor(0x9B59B6);
                message.channel.send(embedServer);
                break;

            case 'comandos':
                const embedCommands = new Discord.MessageEmbed()
                    .setTitle('Lista de Comandos')
                    .addField('**ping**', 'Pong!')
                    .addField('**info**', 'Exibe informações sobre o bot.')
                    .addField('**limpar**, *clear*', 'Deleta mensagens do canal de texto.')
                    .addField('**servidor**, *server*', 'Informações sobre o servidor.')
                    .setThumbnail(message.guild.iconURL())
                    .setFooter(`Esses são todos meus comandos atuais. Me desculpe se faltou algum :/ ~${botname}`)
                    .setColor(0xF1C40F);
                message.channel.send(embedCommands);
                break;

            case 'send':
                const attachtment = new Discord.MessageAttachment('D:/Arquivos/Random/91487357_1090952921272440_7369498701170999296_n.jpg')
                message.channel.send(message.author, attachtment);
                break;

            case 'perfil':
                var user = message.mentions.users.first() || message.author
                var output = await leveling.Fetch(user.id)

                const embedPerfil = new Discord.MessageEmbed()
                    .setTitle('Seu Perfil')
                    .addField('Nick: ', user.tag)
                    .addField('Nível', output.level)
                    .addField('XP', output.xp)
                    .setThumbnail(message.author.displayAvatarURL())
                    .setFooter(`Ta aí as suas informações de nível ^_^ ~${botname}`)
                    .setColor(0xF1C40F);
                message.channel.send(embedPerfil);
                break;

            case 'leaderboard':
            case 'placar':
                //If you put a mention behind the command it searches for the mentioned user in database and tells the position.
                if (message.mentions.users.first()) {

                    var output = await leveling.Leaderboard({
                        search: message.mentions.users.first().id
                    })
                    message.channel.send(`The user ${message.mentions.users.first().tag} is number ${output.placement} on my leaderboard!`);

                    //Searches for the top 3 and outputs it to the user.
                } else {

                    leveling.Leaderboard({
                        limit: 3 //Only takes top 3 ( Totally Optional )
                    }).then(async users => { //make sure it is async

                        if (users[0]) var firstplace = await client.fetchUser(users[0].userid) //Searches for the user object in discord for first place
                        if (users[1]) var secondplace = await client.fetchUser(users[1].userid) //Searches for the user object in discord for second place
                        if (users[2]) var thirdplace = await client.fetchUser(users[2].userid) //Searches for the user object in discord for third place

                        message.channel.send(`My leaderboard:
   
                        1 - ${firstplace && firstplace.tag || 'Nobody Yet'} : ${users[0] && users[0].level || 'None'} : ${users[0] && users[0].xp || 'None'}
                        2 - ${secondplace && secondplace.tag || 'Nobody Yet'} : ${users[1] && users[1].level || 'None'} : ${users[0] && users[0].xp || 'None'}
                        3 - ${thirdplace && thirdplace.tag || 'Nobody Yet'} : ${users[2] && users[2].level || 'None'} : ${users[0] && users[0].xp || 'None'}`)

                    })

                }

        }
    }
})

//Realiza login no Discord a partir do token
client.login(config.token);