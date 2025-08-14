import fs from 'node:fs';
import path from 'node:path';
import { Path } from '../constants';
import { Snowflake } from 'discord.js';

export class AppConfig {
    private _auth?: IAuthConfig;
    private _register?: IRegisterConfig;
    private _channels?: IChannelConfig;
    private _player?: IMusicPlayerConfig;

    public get auth(): IAuthConfig | undefined {
        return this._auth;
    }

    public set auth(config: IAuthConfig | undefined) {
        this._auth = config;
    }

    public get register(): IRegisterConfig | undefined {
        return this._register;
    }

    public set register(config: IRegisterConfig | undefined) {
        this._register = config;
    }

    public get channels(): IChannelConfig | undefined {
        return this._channels;
    }

    public set channels(config: IChannelConfig | undefined) {
        this._channels = config;
    }

    public get player(): IMusicPlayerConfig | undefined {
        return this._player;
    }

    public set player(config: IMusicPlayerConfig | undefined) {
        this._player = config;
    }

    public static async get(): Promise<AppConfig> {
        const absolutePath = path.resolve(Path.appConfig);
        const fileContent = await fs.promises.readFile(absolutePath, 'utf-8');
        return JSON.parse(fileContent) as AppConfig;
    }
}

export interface IAuthConfig {
    botToken: string;
}

export interface IRegisterConfig {
    clientId: Snowflake;
}

export interface IChannelConfig {
    userJoined: string;
    userLeft: string;
}

export interface IMusicPlayerConfig {
	tokens: {
		vkmusic: string;
	};
	cookies: {
		youtubei: string;
	};
}