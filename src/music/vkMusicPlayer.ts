import { Client } from 'discord.js';
import { IMusicPlayerConfig } from '../config';
import { DiscordPlayer } from './discordPlayer.js';
import { VKMusicExtractor } from 'discord-player-vkmusic';

export default class VKMusicPlayer extends DiscordPlayer {
	private readonly _playerConfig: IMusicPlayerConfig;

	constructor(client: Client, playerConfig: IMusicPlayerConfig) {
		super(client);

		this._playerConfig = playerConfig;
	}

	protected async registerExtractors(): Promise<void> {
		await this._player.extractors.register(VKMusicExtractor, {
			token: this._playerConfig.tokens.vkmusic
		});
	}
}
