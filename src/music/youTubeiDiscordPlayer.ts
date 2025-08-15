import { DiscordPlayer } from "./discordPlayer.js";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { MusicPlayerSettings } from "../constants.js";
import { IMusicPlayerConfig } from "../config";
import { Client } from "discord.js";

export default class YouTubeiPlayer extends DiscordPlayer {
    private readonly _playerConfig: IMusicPlayerConfig;

    constructor(client: Client, playerConfig: IMusicPlayerConfig) {
        super(client);

        this._playerConfig = playerConfig;
    }

    protected async registerExtractors(): Promise<void> {
        await this._player.extractors.register(YoutubeiExtractor, {
            cookie: this._playerConfig.cookies.youtubei,
            generateWithPoToken: true,
            streamOptions: {
                useClient: 'WEB',
                highWaterMark: MusicPlayerSettings.youTubei.highWaterMark
            }
        });
    }
}