import { Interaction, Client, Events } from "discord.js";
import { getLocalization } from "../helpers/localizationHelper.js";
import { getGuildMemberLocale } from "../helpers/interactionHelper.js";
import { logger } from "../loggers/index.js";

export default (client: Client): void => {
    client.on(Events.InteractionCreate, async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            await handleChatInputCommand(interaction);
        } else if (interaction.isAutocomplete()) {
            await handleAutocomplete(interaction);
        }
    });
    
    const handleChatInputCommand = async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;

        try {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                throw Error(`No command matching ${interaction.commandName} was found.`);
            }

            if (!command.execute) {
                throw Error(`Command ${interaction.commandName} does not have an execute function.`);
            }

            await command.execute(interaction);
        } catch (err) {
            logger.error(err);

            const locale = getLocalization(getGuildMemberLocale(interaction));
            await interaction.followUp(locale.events.interactionCreate.unknownError());
        }
    };

    const handleAutocomplete = async (interaction: Interaction) => {
        if (!interaction.isAutocomplete()) return;

        try {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                throw Error(`No command matching ${interaction.commandName} was found.`);
            }

            if (!command.autocomplete) {
                throw Error(`Command ${interaction.commandName} does not have an autocomplete function.`);
            }

            await command.autocomplete(interaction);
        } catch (err) {
            logger.error(err);
        }
    };
};