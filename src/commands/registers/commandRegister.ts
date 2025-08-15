import { Collection } from "discord.js";
import { Command } from "../command.js";

export default interface ICommandRegister {
    Register(): Promise<Collection<string, Command>>;
}