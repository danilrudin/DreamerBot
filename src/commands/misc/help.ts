import { 
    ActionRowBuilder,
    ChatInputCommandInteraction, 
    ComponentType, 
    EmbedBuilder,
    MessageFlags,
    PermissionsBitField,
    SlashCommandBuilder, 
    StringSelectMenuBuilder
} from "discord.js";
import path from "node:path";
import { TranslationFunctions } from "../../localizations/i18n/i18n-types.js";
import { Command, isCommand } from "../command.js";
import { hasPermissions } from "../../helpers/permissionHelper.js"
import { getDirectories, getModules } from "../../helpers/fsHelper.js";
import { getBaseGuildTextChannel, getGuildMemberLocale, getMemberPermissions } from "../../helpers/interactionHelper.js";
import { getLocalization, generateLocalizations, getDefaultLocalization } from "../../helpers/localizationHelper.js";
import { Path, ApiRestriction, ApiResponse } from "../../constants.js";

const defaultCommandLocalization = getDefaultLocalization().misc.help;
const helpCategorySelectorId = 'help-category-selector';

export default {
    data: new SlashCommandBuilder()
        .setName(defaultCommandLocalization.name())
        .setDescription(defaultCommandLocalization.description())
        .setDescriptionLocalizations(generateLocalizations('misc.help.description')),
    async execute(interaction: ChatInputCommandInteraction) {
        const localization = getLocalization(getGuildMemberLocale(interaction));
        const commandLocalization = localization.misc.help;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const categoryRecords = await getCommandCategoriesByPermissions(getMemberPermissions(interaction));

        const categoryRecordKeys = Object.keys(categoryRecords);
        if (categoryRecordKeys.length === 0) {
            interaction.followUp({
                content: commandLocalization.when.noAvailableCommands(),
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const categorySelectMenuOptions = categoryRecordKeys.map(category => ({
            label: localization[category].category(),
            value: category
        }));

        const categorySelectMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(helpCategorySelectorId)
                .setPlaceholder(commandLocalization.when.selectCategoryPlaceholder())
                .addOptions(categorySelectMenuOptions)
        );

        await interaction.followUp({
            content: commandLocalization.when.selectCategoryMessage(),
            components: [categorySelectMenu],
            flags: MessageFlags.Ephemeral
        });

        const collector = getBaseGuildTextChannel(interaction)
            .createMessageComponentCollector({ 
                componentType: ComponentType.StringSelect, 
                time: ApiResponse.componentCollector.commandCategoryResponseTime 
            });

        collector?.on('collect', async collected => {
            if (collected.user.id !== interaction.user.id) return;
            
            const category = collected.values[0];
            const embeds = await buildCategoryEmbeds(category, categoryRecords[category], localization);

            if (embeds.length === 0) {
                await collected.reply({
                    content: commandLocalization.when.noAvailableCommands(),
                    flags: MessageFlags.Ephemeral
                });
                return;
            }

            await collected.reply({ embeds, flags: MessageFlags.Ephemeral });
            
            collector.stop();
        });

        collector?.on('end', (collected, reason) => {
            if (reason === 'time') {
                if (!interaction.replied) {
                    interaction.editReply({
                        content: commandLocalization.when.timeout(),
                        components: []
                    });
                }
            } else {
                interaction.deleteReply();
            }
        });
    }
} satisfies Command;

async function getCommandCategoriesByPermissions(userPermissions: PermissionsBitField) {
    const categoriesPath = await getDirectories(Path.commands);
    const categoryRecords: Record<string, Command[]> = {};

    for (const categoryPath of categoriesPath) {
        const modules = await getModules(categoryPath);
        const commands = modules
            .map(module => module.default)
            .filter((module): module is Command => isCommand(module))
            .filter(command => hasRequiredPermissions(userPermissions, command));

        if (commands.length > 0) {
            const category = path.basename(categoryPath);
            categoryRecords[category] = commands;
        }
    }

    return categoryRecords;
}

function hasRequiredPermissions(userPermissions: PermissionsBitField, command: Command): boolean {
    const commandPermissions = command.data.default_member_permissions;
    return !commandPermissions || hasPermissions(userPermissions, BigInt(commandPermissions));
}

async function buildCategoryEmbeds(
    category: string,
    commands: Command[],
    locale: TranslationFunctions
): Promise<EmbedBuilder[]> {
    const embeds: EmbedBuilder[] = [];
    let currentEmbed = createCategoryEmbed(category, locale);

    for (const command of commands) {
        const commandName = locale[category]?.[command.data.name]?.name();
        const commandDescription = locale[category]?.[command.data.name]?.description();

        if (!commandName || !commandDescription) continue;

        const field = { name: `/${commandName}`, value: commandDescription };

        if (exceedsEmbedLimits(currentEmbed, field)) {
            embeds.push(currentEmbed);
            currentEmbed = createCategoryEmbed(category, locale);
        }

        addFieldToEmbed(currentEmbed, field);
    }

    if (currentEmbed.data.fields?.length) {
        embeds.push(currentEmbed);
    }

    return embeds;
}

function createCategoryEmbed(category: string, locale: TranslationFunctions): EmbedBuilder {
    return new EmbedBuilder().setTitle(locale[category].category());
}

function exceedsEmbedLimits(currentEmbed: EmbedBuilder, field: { name: string; value: string }): boolean {
    const currentSize = JSON.stringify(field).length;
    const fieldsCount = currentEmbed.data.fields?.length ?? 0;
    return (
        currentSize > ApiRestriction.maxCharactersInEmbed ||
        fieldsCount >= ApiRestriction.maxFieldsInEmbed
    );
}

function addFieldToEmbed(embed: EmbedBuilder, field: { name: string; value: string }): EmbedBuilder {
    return embed.addFields(field);
}