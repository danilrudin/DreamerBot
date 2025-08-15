import { BaseGuildTextChannel, Client, EmbedBuilder, Events } from "discord.js";
import { getLocalization } from "../helpers/localizationHelper.js";
import { getServerInfoFooter } from "../helpers/formatHelper.js";
import { logger } from "../loggers/index.js";

export default (client: Client): void => {
    client.on(Events.GuildMemberAdd, async mbr => {
        const channelId = client.config.channels?.userJoined;
        if (!channelId) {
            logger.warn('The Channel\'s Id is empty. Please fill the config.');
            return;
        }

        if (mbr.user.bot) {
            logger.info('The member %s is a bot. Ignoring.', mbr.user.tag);
            return;
        }

        const locale = getLocalization(mbr.guild.preferredLocale);

        const embed = new EmbedBuilder()
            .setTitle(locale.events.userJoined.notificationTitle({ 
                userName: mbr.displayName, 
                serverName: mbr.guild.name 
            }))
            .setDescription(locale.events.userJoined.notificationBody())
            .setFooter(getServerInfoFooter(mbr.guild))
            .setTimestamp();

        const channel = mbr.guild?.channels.cache.get(channelId) as BaseGuildTextChannel;
        await channel.send({ embeds: [embed] });
    });
};