import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    Guild,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder 
} from "discord.js";
import { Command } from "../command.js";
import { getDefaultLocalization, getLocalization, generateLocalizations } from "../../helpers/localizationHelper.js";
import { isUserNotInVoiceChannel, getGuildMember, getGuildMemberLocale, getGuild, getGuildId } from "../../helpers/interactionHelper.js";
import { PlayerState, RepeatMode } from "../../music/musicPlayer.js";
import { Customization } from "../../constants.js";
import { getServerInfoFooter } from "../../helpers/formatHelper.js";
import { DiscordPlayer } from "../../music/discordPlayer.js";

const defaultCommandLocalization = getDefaultLocalization().music.repeat;

export default {
	data: new SlashCommandBuilder()
        .setName(defaultCommandLocalization.name())
        .setDescription(defaultCommandLocalization.description())
        .setDescriptionLocalizations(generateLocalizations('music.repeat.description'))
        .addNumberOption((option) =>
            option
                .setName(defaultCommandLocalization.options.mode.name())
                .setDescription(defaultCommandLocalization.options.mode.description())
                .setRequired(true)
                .addChoices(
                    {
                        name: defaultCommandLocalization.choices.mode.Off(),
                        value: RepeatMode.Off,
                    },
                    {
                        name: defaultCommandLocalization.choices.mode.Track(),
                        value: RepeatMode.Track,
                    },
                    {
                        name: defaultCommandLocalization.choices.mode.Queue(),
                        value: RepeatMode.Queue,
                    }
              ),
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	async execute(interaction: ChatInputCommandInteraction) {
        const musicLocalization = getLocalization(getGuildMemberLocale(interaction)).music;
        const commandLocalization = musicLocalization.repeat;

        await interaction.deferReply();

        const member = getGuildMember(interaction);
        if (isUserNotInVoiceChannel(member)) {
            await interaction.followUp({ 
                content: musicLocalization.when.userIsNotInVoiceChannel(), 
                flags: MessageFlags.Ephemeral
            });
            return;
        }

		const mode = interaction.options.getInteger(commandLocalization.options.mode.name(), true);

        const musicPlayer = interaction.client.musicPlayer as DiscordPlayer;

        const state = await musicPlayer.repeat(interaction, mode);
        switch(state) {
            case PlayerState.PlayingInAnotherChannel:
                await interaction.followUp({
                    content: musicLocalization.when.userIsNotInSameVoiceChannelAsBot(),
                    flags: MessageFlags.Ephemeral
                });
                break;
            case PlayerState.QueueDoesNotExist:
                await interaction.followUp({ 
                    content: musicLocalization.when.queueDoesNotExist(),
                    flags: MessageFlags.Ephemeral
                });
                break;
            case PlayerState.RepeatDisabled:
                await sendRepeatStateEmbed(interaction, musicPlayer, state);

                await interaction.deleteReply();
                break;
            case PlayerState.RepeatAlreadyDisabled:
                await interaction.followUp({ 
                    content: commandLocalization.when.repeatIsAlreadyDisabled(),
                    flags: MessageFlags.Ephemeral
                });
                break;
            case PlayerState.RepeatTrackEnabled:
                await sendRepeatStateEmbed(interaction, musicPlayer, state);

                await interaction.deleteReply();
                break;
            case PlayerState.RepeatTrackAlreadyEnabled:
                await interaction.followUp({ 
                    content: commandLocalization.when.repeatTrackIsAlreadyEnabled(),
                    flags: MessageFlags.Ephemeral
                });
                break;
            case PlayerState.RepeatQueueEnabled:
                await sendRepeatStateEmbed(interaction, musicPlayer, state);

                await interaction.deleteReply();
                break;
            case PlayerState.RepeatQueueAlreadyEnabled:
                await interaction.followUp({ 
                    content: commandLocalization.when.repeatQueueIsAlreadyEnabled(),
                    flags: MessageFlags.Ephemeral
                });
                break;
            default:
                await interaction.deleteReply();
                break;
        }
	}
} satisfies Command;

async function sendRepeatStateEmbed(
    interaction: ChatInputCommandInteraction,
    musicPlayer: DiscordPlayer,
    state: PlayerState
): Promise<void> {
    const guildId = getGuildId(interaction);
    const currentQueue = musicPlayer.getCurrentQueue(guildId)!;

    const localization = getLocalization(currentQueue!.metadata.locale);
    const commandLocalization = localization.music.repeat;

    const stateToTitleMap: Partial<Record<PlayerState, () => string>> = {
        [PlayerState.RepeatDisabled]: () => commandLocalization.when.repeatIsDisabled(),
        [PlayerState.RepeatTrackEnabled]: () => commandLocalization.when.repeatTrackIsEnabled(),
        [PlayerState.RepeatQueueEnabled]: () => commandLocalization.when.repeatQueueIsEnabled(),
    };

    const embed = createTrackEmbed(
        stateToTitleMap[state]?.() ?? "Unknown State",
        getGuild(interaction)
    );

    await currentQueue.metadata.channel.send({ embeds: [embed] });
}

function createTrackEmbed(
    title: string,
    guild: Guild
): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(Customization.color.playerNotification)
        .setTitle(title)
        .setFooter(getServerInfoFooter(guild));
}