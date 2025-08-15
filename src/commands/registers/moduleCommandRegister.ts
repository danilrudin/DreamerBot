import { Collection, REST, Routes, Snowflake } from 'discord.js';
import ICommandRegister from "./commandRegister.js";
import { IAuthConfig, IRegisterConfig } from '../../config/index.js';
import { Command, isCommand } from '../command.js';
import { Path } from "../../constants.js";
import { getModules } from '../../helpers/fsHelper.js';

export default class ModuleCommandRegister implements ICommandRegister {
    private readonly _rest: REST;
    private readonly _clientId: Snowflake;

    constructor(authConfig: IAuthConfig, registerConfig: IRegisterConfig) {
        if (!authConfig.botToken || !registerConfig.clientId) {
            throw new Error("Missing required configuration for command registration.");
        }

        this._rest = new REST().setToken(authConfig.botToken);
        this._clientId = registerConfig.clientId;
    }

    public async Register(): Promise<Collection<string, Command>> {
        const commands = await this.loadCommands();
        await this.updateCommands(commands);

        return commands;
    }

    private async loadCommands(): Promise<Collection<string, Command>> {
        const commands = new Collection<string, Command>();

        const modules = await getModules(Path.commands);
        for (const module of modules) {
            const resolvedModule = module.default;
            if (isCommand(resolvedModule)) {
                commands.set(resolvedModule.data.name, resolvedModule);
            }
        }

        return commands;
    }

    private async updateCommands(commands: Collection<string, Command> ): Promise<unknown> {
        return await this._rest.put(
            Routes.applicationCommands(this._clientId),
            { body: commands.map(c => c.data.toJSON()) }
        );
    }
}