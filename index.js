const Telegraf = require('telegraf');
const bot = new Telegraf("1140995083:AAFkI3dVvfVq8P-tWSd2p9xNn4Cnbi6WgUY");
const {connect, model} = require('mongoose');
const date = require('date-and-time');
const now = new Date();
const request = require('request');
connect('mongodb://admin:Sarik1212@bot-shard-00-00-ux4ds.mongodb.net:27017,bot-shard-00-01-ux4ds.mongodb.net:27017,bot-shard-00-02-ux4ds.mongodb.net:27017/test?ssl=true&replicaSet=bot-shard-0&authSource=admin&retryWrites=true&w=majority');
const fetch = require('node-fetch');


var User = model("user",{
    user_id: Number,
    lang: String,
    menu: Number
});
function msleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function sleep(n) {
    msleep(n * 1000);
}

let admins = 887391119;
var options = {
    method: 'GET',
    url: 'https://covid-193.p.rapidapi.com/statistics',
    qs: {country: 'Uzbekistan'},
    headers: {
        'x-rapidapi-host': 'covid-193.p.rapidapi.com',
        'x-rapidapi-key': '35efb55b96msha7028a46ea57b63p123ebejsn6d5f63488fca'
    }
};
let send_post = 1;
let home = 0;

let send_en = 3;
let send_ru = 4;
let send_uz = 5;

bot.on('inline_query', async ({ inlineQuery, answerInlineQuery }) => {
    let query = inlineQuery.query;
    let user = await User.findOne({user_id: inlineQuery.from.id});
    if (!user){
        let date = "";
        let cases_total = "";
        let cases_new = "";
        let active_cases = "";
        let critical = "";
        let recovered = "";

        let death_total = "";
        let death_new = "";
        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            var info = JSON.parse(body);
            cases_total = info.response[0].cases.total;
            cases_new = info.response[0].cases.new;
            active_cases = info.response[0].cases.active;
            critical = info.response[0].cases.critical;
            date = info.response[0].day;
            recovered = info.response[0].cases.recovered;
            death_total = info.response[0].deaths.total;
            death_new = info.response[0].deaths.new;
            let txt = "";
            let title = "";
            let descp = "";
            title = "COVID-19 STATISTICS!";
            descp = 'Official statistics cases of COVID-19';
            txt = `*Date: ${date}*\n------\nCases: *${cases_total}* (total)\nNew: *${cases_new}*\nCritical: *${critical}*\nDeaths: *${death_total}*\n\n@koronavirusinfouz\n@outbreakuzbot`
            let resp = {
                type: 'article',
                id: '4',
                title: title,
                description: descp,
                input_message_content: {
                    message_text: txt ,
                    parse_mode: 'markdown'
                },
            };
            answerInlineQuery([resp], {cache_time: 1})
        });
        return
    }
    let date = "";
    let cases_total = "";
    let cases_new = "";
    let active_cases = "";
    let critical = "";
    let recovered = "";

    let death_total = "";
    let death_new = "";
    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        var info = JSON.parse(body);
        cases_total = info.response[0].cases.total;
        cases_new = info.response[0].cases.new;
        active_cases = info.response[0].cases.active;
        critical = info.response[0].cases.critical;
        date = info.response[0].day;
        recovered = info.response[0].cases.recovered;
        death_total = info.response[0].deaths.total;
        death_new = info.response[0].deaths.new;
        let txt = "";
        let title = "";
        let descp = "";
        if (user.lang === 'uz') {
            title = "COVID-19 STATISTIKASI!";
            descp = 'Rasmiy COVID-19 bilan kasallanganlar statistikasi!';
            txt = `*📆 Sana: ${date}*\n------\n🥴 Kasallanganlar: *${cases_total}* (xammasi)\n🤧 Yangi kasallanganlar: *${cases_new}*\n🤢 Jiddiy: *${critical}*\n🤕 Tuzalganlar: *${recovered}*\n😵 Vafot etganlar: *${death_total}*\n\n@outbreakuzbot\n@outbreakuz`;
        }
        if (user.lang === 'ru'){
            title = "СТАТИСТИКА COVID-19!";
            descp = 'Официальная статистика зараженных вирусом COVID-19';
            txt = `*📆 Дата: ${date}*\n------\n🥴 Зарaжено: *${cases_total}* (общий)\n🤧 Новых: *${cases_new}*\n🤢 Критический: *${critical}*\n🤕 Выздоровел: *${recovered}*\n😵 Смертей: *${death_total}*\n\n@outbreakuzbot\n@outbreakuz`;
        }
        if (user.lang === 'en'){
            title = "COVID-19 STATISTICS!";
            descp = 'Official statistics cases of COVID-19';
            txt =`*📆 Date: ${date}*\n------\n🥴 Cases: *${cases_total}* (total)\n🤧 New: *${cases_new}*\n🤢 Critical: *${critical}*\n🤕 Recovered: *${recovered}*\n😵 Deaths: *${death_total}*\n\n@outbreakuzbot\n@outbreakuz`;
        }
        let resp = {
            type: 'article',
            id: '4',
            title: title,
            description: descp,
            input_message_content: {
                message_text: txt ,
                parse_mode: 'markdown'
            },
        };
        answerInlineQuery([resp], {cache_time: 1})
    });
});
bot.command('start', async msg => {
    let user = await User.findOne({user_id: msg.message.chat.id});
    if (!user){
        new User({
            user_id: msg.message.chat.id,
            lang: 'en',
            menu: home
        }).save();
        msg.replyWithMarkdown("*Welcome* to offical outbreak bot of Uzbekistan!\n\nSet Uzbek language: /uz\nSet Russian language: /ru\nSet English language: /en\n\nOfficial channel of news: @koronavirusinfouz");
        msg.replyWithMarkdown("*Hey! Join updates channel of the bot!*", {reply_markup: {inline_keyboard: [[{text: 'Join', url:'t.me/outbreakuz'}]]}})
    } else {
        let date = "";
        let cases_total = "";
        let cases_new = "";
        let active_cases = "";
        let critical = "";
        let recovered = "";

        let death_total = "";
        let death_new = "";
        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            var info = JSON.parse(body);
            cases_total = info.response[0].cases.total;
            cases_new = info.response[0].cases.new;
            active_cases = info.response[0].cases.active;
            critical = info.response[0].cases.critical;
            date = info.response[0].day;
            recovered = info.response[0].cases.recovered;
            death_total = info.response[0].deaths.total;
            death_new = info.response[0].deaths.new;
            if (user.lang === 'uz'){
                msg.replyWithMarkdown(`*📆 Sana: ${date}*\n------\n🥴 Kasallanganlar: *${cases_total}* (xammasi)\n🤧 Yangi kasallanganlar: *${cases_new}*\n🤢 Jiddiy: *${critical}*\n🤕 Tuzalganlar: *${recovered}*\n😵 Vafot etganlar: *${death_total}*\n\n@outbreakuzbot\n@outbreakuz`)
            }
            if (user.lang === 'ru'){
                msg.replyWithMarkdown(`*📆 Дата: ${date}*\n------\n🥴 Зарaжено: *${cases_total}* (общий)\n🤧 Новых: *${cases_new}*\n🤢 Критический: *${critical}*\n🤕 Выздоровел: *${recovered}*\n😵 Смертей: *${death_total}*\n\n@outbreakuzbot\n@outbreakuz`)
            }
            if (user.lang === 'en'){
                msg.replyWithMarkdown(`*📆 Date: ${date}*\n------\n🥴 Cases: *${cases_total}* (total)\n🤧 New: *${cases_new}*\n🤢 Critical: *${critical}*\n🤕 Recovered: *${recovered}*\n😵 Deaths: *${death_total}*\n\n@outbreakuzbot\n@outbreakuz`)
            }

        });
    }
});
bot.command('uz', async msg => {
    let user = await User.findOne({user_id: msg.message.from.id});
    user.set('lang', 'uz');
    msg.replyWithMarkdown("Uzbek tili tanlandi!")
});
bot.command('cancel', async msg => {
    let user = await User.findOne({user_id: msg.message.from.id});
    user.set('menu', home);
    msg.reply("Canceled");
});
bot.command('ru', async msg => {
    let user = await User.findOne({user_id: msg.message.from.id});
    user.set('lang', 'ru');
    msg.replyWithMarkdown("Русский язык выбран")
});
bot.command('en', async msg => {
    let user = await User.findOne({user_id: msg.message.from.id});
    user.set('lang', 'en');
    msg.replyWithMarkdown("English language set!")
});
bot.command('users', async msg => {
        let users = await User.count();
        let users_en = await User.count({lang: 'en'});
        let users_uz = await User.count({lang: 'uz'});
        let users_ru = await User.count({lang: 'ru'});
        if (msg.message.from.id === admins){
            msg.replyWithMarkdown(`*All users: ${users}*\n\n*Languages:*\n*English:* ${users_en}\n*Uzbek:* ${users_uz}\n*Russian:* ${users_ru}`)
        }
    }
);
bot.command('mail', async msg => {
    if (msg.message.from.id === admins){
        msg.replyWithMarkdown("*Choice lang users:*", {reply_markup:{inline_keyboard: [[{text:"English", callback_data:"mail:en"}, {text:"Russian", callback_data:"mail:ru"}], [{text:"Uzbek", callback_data:"mail:uz"}]]}})
    }
});
bot.on('callback_query', async msg => {
    let user_id = msg.callbackQuery.message.chat.id;
    let user = await User.findOne({user_id: user_id});
    let data = msg.callbackQuery.data;
    if (msg.callbackQuery.message.chat.id === admins){
        switch (data.split('mail:')[1]) {
            case "en":
                user.set('menu', send_en);
                msg.deleteMessage()
                msg.replyWithMarkdown("*Send me a post! You can do button! Just type: Button NAME - LINK*")
                break
            case "ru":
                user.set('menu', send_ru);
                msg.deleteMessage()
                msg.replyWithMarkdown("*Send me a post! You can do button! Just type: Button NAME - LINK*")
                break
            case "uz":
                user.set('menu', send_uz);
                msg.deleteMessage();
                msg.replyWithMarkdown("*Send me a post! You can do button! Just type: Button NAME - LINK*")
                break
        }
    }
});
bot.on('message', async msg => {
    let user = await User.findOne({user_id: msg.message.chat.id});
    if (!user){return msg.replyWithMarkdown('*Error! Please:* /start')}
    if (msg.message.forward_from_chat){
        let id = msg.message.forward_from_chat.id
        console.log(id)
    }
    if (user.menu === send_uz){
        let users = await User.find({lang: 'uz'});
        await user.set("menu", home);

        msg.replyWithMarkdown("*Starting!*");

        users.forEach((item, i, arr) => {
            if(msg.message.photo) {
                let file_id = msg.message.photo[msg.message.photo.length - 1].file_id;
                let params = {
                    caption: msg.message.caption,
                    parse_mode: "Markdown",
                    disable_web_page_preview: true
                }

                if(msg.message.caption.match(/(?:button)\s(.*)\s-\s(.*)/i)) {
                    let [ msgText, label, url ] = msg.message.caption.match(/(?:Button)\s(.*)\s-\s(.*)/i);
                    params.reply_markup = {
                        inline_keyboard: [
                            [{ text: label, url: url }]
                        ]
                    }

                    params.caption = params.caption.replace(/(button)\s(.*)\s-\s(.*)/i, "");
                }

                bot.telegram.sendPhoto(users[i].user_id, file_id, params);
            }

            if(!msg.message.photo) {
                let params = {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true
                }

                if(msg.message.text.match(/(?:button)\s(.*)\s-\s(.*)/i)) {
                    let [ msgText, label, url ] = msg.message.text.match(/(?:button)\s(.*)\s-\s(.*)/i);
                    params.reply_markup = {
                        inline_keyboard: [
                            [{ text: label, url: url }]
                        ]
                    }
                }

                bot.telegram.sendMessage(users[i].user_id, msg.message.text.replace(/(button)\s(.*)\s-\s(.*)/i, ""), params);
            }

            msleep(10);
        });

        return msg.replyWithMarkdown("*Complated*");
    }
    if (user.menu === send_en){
        let users = await User.find({lang: 'en'});
        await user.set("menu", home);

        msg.replyWithMarkdown("*Starting!*");

        users.forEach((item, i, arr) => {
            if(msg.message.photo) {
                let file_id = msg.message.photo[msg.message.photo.length - 1].file_id;
                let params = {
                    caption: msg.message.caption,
                    parse_mode: "Markdown",
                    disable_web_page_preview: true
                }

                if(msg.message.caption.match(/(?:button)\s(.*)\s-\s(.*)/i)) {
                    let [ msgText, label, url ] = msg.message.caption.match(/(?:button)\s(.*)\s-\s(.*)/i);
                    params.reply_markup = {
                        inline_keyboard: [
                            [{ text: label, url: url }]
                        ]
                    }

                    params.caption = params.caption.replace(/(button)\s(.*)\s-\s(.*)/i, "");
                }

                bot.telegram.sendPhoto(users[i].user_id, file_id, params);
            }

            if(!msg.message.photo) {
                let params = {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true
                }

                if(msg.message.text.match(/(?:button)\s(.*)\s-\s(.*)/i)) {
                    let [ msgText, label, url ] = msg.message.text.match(/(?:button)\s(.*)\s-\s(.*)/i);
                    params.reply_markup = {
                        inline_keyboard: [
                            [{ text: label, url: url }]
                        ]
                    }
                }

                bot.telegram.sendMessage(users[i].user_id, msg.message.text.replace(/(button)\s(.*)\s-\s(.*)/i, ""), params);
            }

            msleep(10);
        });

        return msg.replyWithMarkdown("*Complated*");
    }
    if (user.menu === send_ru){
        let users = await User.find({lang: 'ru'});
        await user.set("menu", home);

        msg.replyWithMarkdown("*Starting!*");

        users.forEach((item, i, arr) => {
            if(msg.message.photo) {
                let file_id = msg.message.photo[msg.message.photo.length - 1].file_id;
                let params = {
                    caption: msg.message.caption,
                    parse_mode: "Markdown",
                    disable_web_page_preview: true
                }

                if(msg.message.caption.match(/(?:button)\s(.*)\s-\s(.*)/i)) {
                    let [ msgText, label, url ] = msg.message.caption.match(/(?:button)\s(.*)\s-\s(.*)/i);
                    params.reply_markup = {
                        inline_keyboard: [
                            [{ text: label, url: url }]
                        ]
                    }

                    params.caption = params.caption.replace(/(button)\s(.*)\s-\s(.*)/i, "");
                }

                bot.telegram.sendPhoto(users[i].user_id, file_id, params);
            }

            if(!msg.message.photo) {
                let params = {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true
                }

                if(msg.message.text.match(/(?:button)\s(.*)\s-\s(.*)/i)) {
                    let [ msgText, label, url ] = msg.message.text.match(/(?:button)\s(.*)\s-\s(.*)/i);
                    params.reply_markup = {
                        inline_keyboard: [
                            [{ text: label, url: url }]
                        ]
                    }
                }

                bot.telegram.sendMessage(users[i].user_id, msg.message.text.replace(/(button)\s(.*)\s-\s(.*)/i, ""), params);
            }

            msleep(10);
        });

        return msg.replyWithMarkdown("*Complated*");
    }
    let date = "";
    let cases_total = "";
    let cases_new = "";
    let active_cases = "";
    let critical = "";
    let recovered = "";

    let death_total = "";
    let death_new = "";
    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        var info = JSON.parse(body);
        cases_total = info.response[0].cases.total;
        cases_new = info.response[0].cases.new;
        active_cases = info.response[0].cases.active;
        critical = info.response[0].cases.critical;
        date = info.response[0].day;
        recovered = info.response[0].cases.recovered;
        death_total = info.response[0].deaths.total;
        death_new = info.response[0].deaths.new;
        if (user.lang === 'uz'){
            msg.replyWithMarkdown(`*📆 Sana: ${date}*\n------\n🥴 Kasallanganlar: *${cases_total}* (xammasi)\n🤧 Yangi kasallanganlar: *${cases_new}*\n🤢 Jiddiy: *${critical}*\n🤕 Tuzalganlar: *${recovered}*\n😵 Vafot etganlar: *${death_total}*\n\n@outbreakuzbot\n@outbreakuz`)
        }
        if (user.lang === 'ru'){
            msg.replyWithMarkdown(`*📆 Дата: ${date}*\n------\n🥴 Зарaжено: *${cases_total}* (общий)\n🤧 Новых: *${cases_new}*\n🤢 Критический: *${critical}*\n🤕 Выздоровел: *${recovered}*\n😵 Смертей: *${death_total}*\n\n@outbreakuzbot\n@outbreakuz`)
        }
        if (user.lang === 'en'){
            msg.replyWithMarkdown(`*📆 Date: ${date}*\n------\n🥴 Cases: *${cases_total}* (total)\n🤧 New: *${cases_new}*\n🤢 Critical: *${critical}*\n🤕 Recovered: *${recovered}*\n😵 Deaths: *${death_total}*\n\n@outbreakuzbot\n@outbreakuz`)
        }

    });
});
User.prototype.inc = function(field, value = 1) {
    this[field] += value;
    return this.save();
};

User.prototype.dec = function(field, value = 1) {
    this[field] -= value;
    return this.save();
};

User.prototype.set = function(field, value) {
    this[field] = value;
    return this.save();
};
bot.catch(err => {
    if (err.response && err.response.error_code === 403) {}
    else {
        console.log(err)
    }
});
bot.startPolling();
