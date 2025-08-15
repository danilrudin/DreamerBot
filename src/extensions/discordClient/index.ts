import { Client } from "discord.js";

import type { Collection } from "discord.js";
import type { Command } from "../../commands/command";
import type { AppConfig } from "../../config";
import type { IMusicPlayer } from "../../music/musicPlayer";

Client.prototype.addConfig = function (config: AppConfig): Client {
    this.config = config;
    return this;
};

Client.prototype.addCommands = function (commands: Collection<string, Command>): Client {
    this.commands = commands;
    return this;
};

Client.prototype.addMusicPlayer = function (musicPlayer: IMusicPlayer): Client {
    this.musicPlayer = musicPlayer;
    return this;
};
