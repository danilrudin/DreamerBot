import {
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from "discord.js";
import { Command } from "../command.js";
import { getLocalization, generateLocalizations, getDefaultLocalization } from "../../helpers/localizationHelper.js";
import { isUserNotInVoiceChannel, getGuildMember, getBaseGuildTextChannel, getGuildMemberLocale, getGuildId } from "../../helpers/interactionHelper.js";
import { PlayerState } from "../../music/musicPlayer.js";
import { DiscordPlayer } from "../../music/discordPlayer.js";
import { ApiResponse, Customization, MusicPlayerSettings } from "../../constants.js";
import { Track } from "discord-player";
import { getTrackDescription, getTrackMetadataFields } from "../../helpers/discordPlayerHelper.js";
import { L } from "../../localizations/i18n/i18n-node.js";

const defaultCommandLocalization = getDefaultLocalization().music.queue;
const nextPageSelectorId = 'next-page';
const prevPageSelectorId = 'prev-page';

export default {
    data: new SlashCommandBuilder()
        .setName(defaultCommandLocalization.name())
        .setDescription(defaultCommandLocalization.description())
        .setDescriptionLocalizations(generateLocalizations('music.queue.description'))
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
    async execute(interaction: ChatInputCommandInteraction) {
        const musicLocalization = getLocalization(getGuildMemberLocale(interaction)).music;

        await interaction.deferReply();

        const member = getGuildMember(interaction);
        if (isUserNotInVoiceChannel(member)) {
            await interaction.followUp({ 
                content: musicLocalization.when.userIsNotInVoiceChannel(), 
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        let page = 0;
        const maxTracks = MusicPlayerSettings.maxTracksToDequeue;

        const updateQueueMessage = async () => {
            const musicPlayer = interaction.client.musicPlayer as DiscordPlayer;
            
            const [state, tracks, hasMoreTracks] = await musicPlayer.queue(interaction, page * maxTracks, maxTracks);

            if (state !== PlayerState.QueueRetrieved) {
                await interaction.followUp({
                    content: musicLocalization.when.queueDoesNotExist(),
                    flags: MessageFlags.Ephemeral
                });
                return;
            }

            const queueLocale = musicPlayer.getCurrentQueue(getGuildId(interaction))!.metadata.locale;
            const localization = getLocalization(queueLocale);
            const commandLocalization = localization.music.queue;

            const embed = new EmbedBuilder()
                .setTitle(commandLocalization.when.messageTitle())
                .setColor(Customization.color.playerNotification);

                tracks.forEach((track, index) => {
                    const trackNumber = getTrackNumber(page, maxTracks, index);
                    const fields = getTrackDescriptionFields(track, trackNumber, localization);
                    fields.forEach(field => embed.addFields(field));
                });

            const row = createQueueButtons(page, hasMoreTracks);

            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({
                    embeds: [embed],
                    components: row.components.length ? [row] : []
                });
            } else {
                await interaction.reply({
                    embeds: [embed],
                    components: row.components.length ? [row] : []
                });
            }
        };

        await updateQueueMessage();

        const collector = getBaseGuildTextChannel(interaction)
            .createMessageComponentCollector({
                filter: (i) => [nextPageSelectorId, prevPageSelectorId]
                    .includes(i.customId) && i.user.id === interaction.user.id,
                time: ApiResponse.componentCollector.queuePageSelectorResponseTime
            });

        collector?.on('collect', async (i) => {
            if (i.customId === nextPageSelectorId) page++;
            else if (i.customId === prevPageSelectorId) page--;
            
            await updateQueueMessage();
            await i.deferUpdate();
        });

        collector?.on('end', () => {
            interaction.editReply({ components: [] }).catch(() => {});
        });
    }
} satisfies Command;

function getTrackDescriptionFields(
    track: Partial<Track>,
    trackNumber: number,
    localization: typeof L[keyof typeof L]
): { name: string; value: string; inline: boolean }[] {
    const titleField = {
        name: `${trackNumber}. ${getTrackDescription(track)}`,
        value: '\u200B',
        inline: false
    };

    const eventLocalization = localization.events.music;

    const metadataFields = getTrackMetadataFields(track, {
        duration: eventLocalization.duration(),
        author: eventLocalization.author()
    });

    return [titleField, ...metadataFields];
}

function getTrackNumber(page: number, maxTracks: number, index: number) {
    return page * maxTracks + index + 1;
}

function createQueueButtons(page: number, hasMoreTracks: boolean): ActionRowBuilder<ButtonBuilder> {
    const row = new ActionRowBuilder<ButtonBuilder>();
    if (page > 0) {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId(prevPageSelectorId)
                .setLabel('<<')
                .setStyle(ButtonStyle.Primary)
        );
    }
    if (hasMoreTracks) {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId(nextPageSelectorId)
                .setLabel('>>')
                .setStyle(ButtonStyle.Primary)
        );
    }
    return row;
}
