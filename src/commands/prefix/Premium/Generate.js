const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
const voucher_codes = require('voucher-code-generator');
const Redeem = require("../../../plugins/schemas/redeem.js");

module.exports = {
    name: "premium-generate",
    description: "Generate a premium code!",
    categories: "Premium",
    usage: "<type> <number>",
    aliases: ["pg"],
    owner: true,
    run: async (client, message, args, language, prefix) => {
        
        const plans = ['daily', 'weekly', 'monthly', 'yearly'];

        const name = args[0]
        const camount = args[1]

        if (!name || !plans.includes(name)) return message.channel.send(`${client.i18n.get(language, "utilities", "arg_error", { text: plans.join(", ") })}`);
        if (!camount) return message.channel.send(`${client.i18n.get(language, "utilities", "arg_error", { text: "number" })}`);

        let codes = [];

        const plan = name;

        let time;
        if (plan === 'daily') time = Date.now() + 86400000;
        if (plan === 'weekly') time = Date.now() + 86400000 * 7;
        if (plan === 'monthly') time = Date.now() + 86400000 * 30;
        if (plan === 'yearly') time = Date.now() + 86400000 * 365;

        let amount = camount;
        if (!amount) amount = 1;

        for (var i = 0; i < amount; i++) {
        const codePremium = voucher_codes.generate({
            pattern: '#############-#########-######'
        })

        const code = codePremium.toString().toUpperCase()
        const find = await Redeem.findOne({ code: code })

        if (!find) {
            Redeem.create({
                code: code,
                plan: plan,
                expiresAt: time
            }),
                codes.push(`${i + 1} - ${code}`)
            }
        }

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `${client.i18n.get(language, "premium", "gen_author")}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) }) //${lang.description.replace("{codes_length}", codes.length).replace("{codes}", codes.join('\n')).replace("{plan}", plan).replace("{expires}", moment(time).format('dddd, MMMM Do YYYY'))}
            .setDescription(`${client.i18n.get(language, "premium", "gen_desc", {
                codes_length: codes.length,
                codes: codes.join('\n'),
                plan: plan,
                expires: moment(time).format('dddd, MMMM Do YYYY')
            })}`)
            .setTimestamp()
            .setFooter({ text: `${client.i18n.get(language, "premium", "gen_footer", {
                prefix: prefix
            })}`, iconURL: message.author.displayAvatarURL() })

        message.channel.send({ embeds: [embed] })
        
    }
}