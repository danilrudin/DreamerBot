import { GuildQueue, GuildQueueEvent, PlayerEvent, Track } from "discord-player";
import { IQueueMetadata } from "./discordPlayerMetadataTypes.js";

export interface IDiscordPlayerEventHandler {
    event: PlayerEvent;
}

export interface IDiscordPlayerDebugHandler extends IDiscordPlayerEventHandler {
    handler: (message: string) => Promise<void>;
}

export interface IDiscordPlayerGuildQueueEventHandler {
    event: GuildQueueEvent;
}

export interface IDiscordPlayerGuildQueueTrackEventHandler extends IDiscordPlayerGuildQueueEventHandler {
    handler: (queue: GuildQueue<IQueueMetadata>, track: Track) => Promise<void>;
}

export interface IDiscordPlayerGuildQueueErrorHandler extends IDiscordPlayerGuildQueueEventHandler {
    handler: (queue: GuildQueue<IQueueMetadata>, error: Error) => Promise<void>;
}

export interface IDiscordPlayerGuildQueueDebugHandler extends IDiscordPlayerGuildQueueEventHandler {
    handler: (queue: GuildQueue<IQueueMetadata>, message: string) => Promise<void>;
}