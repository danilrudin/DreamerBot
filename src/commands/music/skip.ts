import {
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder 
} from "discord.js";
import { Command } from "../command.js";
import { getLocalization, generateLocalizations, getDefaultLocalization } from "../../helpers/localizationHelper.js";
import { isUserNotInVoiceChannel, getGuildMember, getGuildMemberLocale } from "../../helpers/interactionHelper.js";
import { PlayerState } from "../../music/musicPlayer.js";
import { DiscordPlayer } from "../../music/discordPlayer.js";

const defaultCommandLocalization = getDefaultLocalization().music.skip;

export default {
	data: new SlashCommandBuilder()
        .setName(defaultCommandLocalization.name())
        .setDescription(defaultCommandLocalization.description())
        .setDescriptionLocalizations(generateLocalizations('music.skip.description'))
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

        const musicPlayer = interaction.client.musicPlayer as DiscordPlayer;

        const state = await musicPlayer.skip(interaction);
        switch(state) {
            case PlayerState.PlayingInAnotherChannel:
                await interaction.followUp({
                    content: musicLocalization.when.userIsNotInSameVoiceChannelAsBot(),
                    flags: MessageFlags.Ephemeral
                });
                break;
            case PlayerState.QueueDoesNotExist | PlayerState.QueueIsEmpty:
                await interaction.followUp({ 
                    content: musicLocalization.when.queueDoesNotExist(),
                    flags: MessageFlags.Ephemeral
                });
                break;
            case PlayerState.UnknownError:
                await interaction.followUp({
                    content: musicLocalization.when.unknownError(),
                    flags: MessageFlags.Ephemeral
                });
                break;
            default:
                await interaction.deleteReply();
                break;
        }
	}
} satisfies Command;
