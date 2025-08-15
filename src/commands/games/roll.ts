import { 
    ChatInputCommandInteraction, 
    EmbedBuilder,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder 
} from "discord.js";
import { getLocalization, generateLocalizations, getDefaultLocalization } from "../../helpers/localizationHelper.js";
import { Command } from "../command.js";
import { Customization, ApiRestriction } from "../../constants.js";
import { getBaseGuildTextChannel, getGuildMemberLocale } from "../../helpers/interactionHelper.js";
import { getServerInfoFooter } from "../../helpers/formatHelper.js";

const defaultCommandLocalization = getDefaultLocalization().games.roll;

export default {
	data: new SlashCommandBuilder()
        .setName(defaultCommandLocalization.name())
        .setDescription(defaultCommandLocalization.description())
        .setDescriptionLocalizations(generateLocalizations('games.roll.description'))
        .addIntegerOption(option => 
            option
                .setName(defaultCommandLocalization.options.min.name())
                .setNameLocalizations(generateLocalizations('games.roll.options.min.name'))
                .setDescription(defaultCommandLocalization.options.min.description())
                .setDescriptionLocalizations(generateLocalizations('games.roll.options.min.description'))
                .setMinValue(ApiRestriction.options.integer.minValue)
                .setMaxValue(ApiRestriction.options.integer.maxValue - 1)
                .setRequired(true)
        )
        .addIntegerOption(option => 
            option
                .setName(defaultCommandLocalization.options.max.name())
                .setNameLocalizations(generateLocalizations('games.roll.options.max.name'))
                .setDescription(defaultCommandLocalization.options.max.description())
                .setDescriptionLocalizations(generateLocalizations('games.roll.options.max.description'))
                .setMinValue(ApiRestriction.options.integer.minValue + 1)
                .setMaxValue(ApiRestriction.options.integer.maxValue)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
	async execute(interaction: ChatInputCommandInteraction) {
        const commandLocalization = getLocalization(getGuildMemberLocale(interaction)).games.roll;
		const min = interaction.options.getInteger(commandLocalization.options.min.name(), true);
        const max = interaction.options.getInteger(commandLocalization.options.max.name(), true);

        await interaction.deferReply();

        if (min === max) {
            await interaction.followUp({
                content: commandLocalization.when.minValueIsEqualToMax(),
                flags: MessageFlags.Ephemeral
            });
            return;
        } else if (min > max) {
            await interaction.followUp({
                content: commandLocalization.when.minValueIsGreaterThanMax(),
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const value = Math.floor(Math.random() * (max - min + 1)) + min;

        const channel = getBaseGuildTextChannel(interaction);
        
        const embed = new EmbedBuilder()
            .setColor(Customization.color.success)
            .setTitle(commandLocalization.when.generated({ value }))
            .setFooter(getServerInfoFooter(channel.guild))
            .setTimestamp();

        await interaction.followUp({
            embeds: [embed]
        });
	}
} satisfies Command;