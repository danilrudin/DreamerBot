import type { Collection } from "discord.js";
import type { Command } from "../../commands/command";
import type { AppConfig } from "../../config";
import type { IMusicPlayer } from "../../music/musicPlayer";

declare module "discord.js" {
    interface Client {
        config: AppConfig;
        commands: Collection<string, Command>;
        musicPlayer: IMusicPlayer;

        addConfig(config: AppConfig): Client;
        addCommands(commands: Collection<string, Command>): Client;
        addMusicPlayer(musicPlayer: IMusicPlayer): Client;
    }
}