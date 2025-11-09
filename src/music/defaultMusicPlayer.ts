import { Client } from "discord.js";
import { IMusicPlayerConfig } from "../config";
import { DiscordPlayer } from "./discordPlayer";
import { DefaultExtractors } from "@discord-player/extractor";

export default class DefaultMusicPlayer extends DiscordPlayer {
    private readonly _playerConfig: IMusicPlayerConfig;

    constructor(client: Client, playerConfig: IMusicPlayerConfig) {
        super(client);

        this._playerConfig = playerConfig;
    }

    protected async registerExtractors(): Promise<void> {
        await this._player.extractors.loadMulti(DefaultExtractors);
    }
}