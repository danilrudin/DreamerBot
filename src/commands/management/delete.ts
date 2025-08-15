import {
    ChatInputCommandInteraction, 
    EmbedBuilder,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder 
} from "discord.js";
import { getLocalization, generateLocalizations, getDefaultLocalization } from "../../helpers/localizationHelper.js";
import { Command } from "../command.js";
import { ApiRestriction, Customization } from '../../constants.js';
import { getBaseGuildTextChannel, getGuildMemberLocale } from "../../helpers/interactionHelper.js";
import { getServerInfoFooter } from "../../helpers/formatHelper.js";

const defaultCommandLocalization = getDefaultLocalization().management.delete;

export default {
	data: new SlashCommandBuilder()
        .setName(defaultCommandLocalization.name())
        .setDescription(defaultCommandLocalization.description())
        .setDescriptionLocalizations(generateLocalizations('management.delete.description'))
        .addIntegerOption(option => 
            option
                .setName(defaultCommandLocalization.options.amount.name())
                .setNameLocalizations(generateLocalizations('management.delete.options.amount.name'))
                .setDescription(defaultCommandLocalization.options.amount.description())
                .setDescriptionLocalizations(generateLocalizations('management.delete.options.amount.description'))
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(ApiRestriction.maxMessagesToDelete)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction: ChatInputCommandInteraction) {
        const commandLocalization = getLocalization(getGuildMemberLocale(interaction)).management.delete;
		const amount = interaction.options.getInteger(commandLocalization.options.amount.name(), true);

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const channel = getBaseGuildTextChannel(interaction);
        let remaining = amount;
        while (remaining > 0) {
            const fetchLimit = Math.min(remaining, ApiRestriction.maxMessagesToDelete);
        
            const deletedCount = (await channel.bulkDelete(fetchLimit, true)).size;
            remaining -= deletedCount;

            if (deletedCount < fetchLimit) break;
        }
        
        const embed = new EmbedBuilder()
            .setColor(Customization.color.success)
            .setTitle(commandLocalization.descriptionTitle())
            .setFooter(getServerInfoFooter(channel.guild))
            .setTimestamp();
        
        if (!remaining) {
            await interaction.followUp({ 
                embeds: [embed],
                flags: MessageFlags.Ephemeral
            });
        } else if (remaining !== amount) {
            embed.setDescription(commandLocalization.when.deleted({ total: amount - remaining }));
            await interaction.followUp({ 
                embeds: [embed],
                flags: MessageFlags.Ephemeral
            });
        } else {
            await interaction.followUp({ 
                content: commandLocalization.when.notDeleted({ remaining }), 
                flags: MessageFlags.Ephemeral 
            });
        }
	}
} satisfies Command;