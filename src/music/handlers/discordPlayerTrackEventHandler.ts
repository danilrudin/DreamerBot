import { GuildQueueEvent, Track } from "discord-player";
import { EmbedBuilder } from "discord.js";
import { Customization } from '../../constants.js';
import { getLocalization } from "../../helpers/localizationHelper.js";
import { getServerInfoFooter } from "../../helpers/formatHelper.js";
import { IDiscordPlayerGuildQueueTrackEventHandler } from "../types/discordPlayerEventTypes.js";
import { 
    getChannelByQueueMetadata, 
    getLocaleByQueueMetadata, 
    getTrackDescription, 
    getTrackMetadataFields, 
    getTrackThumbnail 
} from "../../helpers/discordPlayerHelper.js";
import L from "../../localizations/i18n/i18n-node.js";

export const trackEventHandlers: IDiscordPlayerGuildQueueTrackEventHandler[] = [
    {
        event: GuildQueueEvent.AudioTrackAdd,
        handler: async (queue, track) => {
            const channel = getChannelByQueueMetadata(queue);
            const localization = getLocalization(getLocaleByQueueMetadata(queue))
            const eventLocalization = localization.events.music;

            const embed = new EmbedBuilder()
                .setColor(Customization.color.playerNotification)
                .setTitle(eventLocalization.trackAddedToQueue())
                .setDescription(getTrackDescription(track))
                .addFields(getLocalizedTrackMetadataFields(track, localization))
                .setThumbnail(getTrackThumbnail(track))
                .setFooter(getServerInfoFooter(channel.guild));

                await channel.send({ embeds: [embed] });
        },
    },
    {
        event: GuildQueueEvent.AudioTracksAdd,
        handler: async (queue, track) => {
            const channel = getChannelByQueueMetadata(queue);
            const localization = getLocalization(getLocaleByQueueMetadata(queue));
            const eventLocalization = localization.events.music;

            const embed = new EmbedBuilder()
                .setColor(Customization.color.playerNotification)
                .setTitle(eventLocalization.tracksAddedToQueue())
                .setDescription(getTrackDescription(track))
                .addFields(getLocalizedTrackMetadataFields(track, localization))
                .setThumbnail(getTrackThumbnail(track))
                .setFooter(getServerInfoFooter(channel.guild));

            await channel.send({ embeds: [embed] });
        },
    },
    {
        event: GuildQueueEvent.PlayerStart,
        handler: async (queue, track) => {
            const channel = getChannelByQueueMetadata(queue);
            const localization = getLocalization(getLocaleByQueueMetadata(queue));
            const eventLocalization = localization.events.music;

            const embed = new EmbedBuilder()
                .setColor(Customization.color.playerNotification)
                .setTitle(eventLocalization.nowPlaying())
                .setDescription(getTrackDescription(track))
                .addFields(getLocalizedTrackMetadataFields(track, localization))
                .setThumbnail(getTrackThumbnail(track))
                .setFooter(getServerInfoFooter(channel.guild));

            await channel.send({ embeds: [embed] });
        },
    },
    {
        event: GuildQueueEvent.PlayerFinish,
        handler: async (queue, track) => {
            const channel = getChannelByQueueMetadata(queue);
            const localization = getLocalization(getLocaleByQueueMetadata(queue));
            const eventLocalization = localization.events.music;

            const embed = new EmbedBuilder()
                .setColor(Customization.color.playerNotification)
                .setTitle(eventLocalization.playbackFinished())
                .setDescription(getTrackDescription(track))
                .setThumbnail(getTrackThumbnail(track))
                .setFooter(getServerInfoFooter(channel.guild));

            await channel.send({ embeds: [embed] });
        },
    },
    {
        event: GuildQueueEvent.PlayerPause,
        handler: async (queue, track) => {
            const channel = getChannelByQueueMetadata(queue);
            const localization = getLocalization(getLocaleByQueueMetadata(queue));
            const eventLocalization = localization.events.music;

            const embed = new EmbedBuilder()
                .setColor(Customization.color.playerNotification)
                .setTitle(eventLocalization.trackPaused())
                .setDescription(getTrackDescription(track))
                .setThumbnail(getTrackThumbnail(track))
                .setFooter(getServerInfoFooter(channel.guild));

            await channel.send({ embeds: [embed] });
        },
    },
    {
        event: GuildQueueEvent.PlayerResume,
        handler: async (queue, track) => {
            const channel = getChannelByQueueMetadata(queue);
            const localization = getLocalization(getLocaleByQueueMetadata(queue));
            const eventLocalization = localization.events.music;

            const embed = new EmbedBuilder()
                .setColor(Customization.color.playerNotification)
                .setTitle(eventLocalization.trackResumed())
                .setDescription(getTrackDescription(track))
                .addFields(getLocalizedTrackMetadataFields(track, localization))
                .setThumbnail(getTrackThumbnail(track))
                .setFooter(getServerInfoFooter(channel.guild));

            await channel.send({ embeds: [embed] });
        },
    },
    {
        event: GuildQueueEvent.PlayerSkip,
        handler: async (queue, track: Track) => {
            const channel = getChannelByQueueMetadata(queue);
            const localization = getLocalization(getLocaleByQueueMetadata(queue));
            const eventLocalization = localization.events.music;

            const embed = new EmbedBuilder()
                .setColor(Customization.color.playerNotification)
                .setTitle(eventLocalization.trackSkipped())
                .setDescription(getTrackDescription(track))
                .setThumbnail(getTrackThumbnail(track))
                .setFooter(getServerInfoFooter(channel.guild));

            await channel.send({ embeds: [embed] });
        },
    },
    {
        event: GuildQueueEvent.EmptyQueue,
        handler: async (queue) => {
            const channel = getChannelByQueueMetadata(queue);
            const localization = getLocalization(getLocaleByQueueMetadata(queue));
            const eventLocalization = localization.events.music;

            const embed = new EmbedBuilder()
                .setColor(Customization.color.playerNotification)
                .setTitle(eventLocalization.queueIsEmptyTitle())
                .setDescription(eventLocalization.queueIsEmptyDescription())
                .setFooter(getServerInfoFooter(channel.guild));

            await channel.send({ embeds: [embed] });
        },
    }
];


function getLocalizedTrackMetadataFields(track: Track, localization: typeof L[keyof typeof L]) {
    const eventLocalization = localization.events.music;
    return getTrackMetadataFields(track, { 
        duration: eventLocalization.duration(), 
        author: eventLocalization.author()
    });
}