import { Client, Interaction } from "discord.js";
import { GuildQueue, Player, Track } from "discord-player";
import { IMusicPlayer, PlayerState, RepeatMode } from "./musicPlayer.js";
import { trackEventHandlers } from "./handlers/discordPlayerTrackEventHandler.js";
import { errorEventHandlers } from "./handlers/discordPlayerErrorEventHandler.js";
import { debugEventHandlers, debugQueueEventHandlers } from "./handlers/discordPlayerDebugEventHandler.js";
import { getTrackThumbnail } from "../helpers/discordPlayerHelper.js";
import { IQueueMetadata } from "./types/discordPlayerMetadataTypes.js";
import { 
    getBaseGuildTextChannel, 
    getBotAsGuildMember, 
    getCurrentVoiceChannel, 
    getGuild, 
    getGuildId, 
    getGuildMember, 
    getGuildMemberLocale, 
    isUserNotInSameVoiceChannelAsBot 
} from "../helpers/interactionHelper.js";
import { MusicPlayerSettings } from "../constants.js";

export abstract class DiscordPlayer implements IMusicPlayer<Track, GuildQueue<IQueueMetadata>> {
    private static readonly playerStateValues = new Set(Object.values(PlayerState));

    protected readonly _player: Player;

    constructor(client: Client) {
        this._player = new Player(client);
        this.registerHandlers();
    }

    protected abstract registerExtractors(): Promise<void>;

    public async loadExtractors(): Promise<this> {
        await this.registerExtractors();
        return this;
    }

    public async search(query: string): Promise<Track[] | null> {
        const result = (await this._player.search(query)).tracks;
        return result.length > 0 ? result : null;
    }

    public async play(interaction: Interaction, track: Track): Promise<PlayerState> {
        const queue = this.getCurrentQueue(getGuildId(interaction)) 
            ?? this._player.nodes.create(getGuild(interaction), {
                leaveOnEnd: MusicPlayerSettings.leaveOnEnd,
                leaveOnEmpty: MusicPlayerSettings.leaveOnEmpty,
                leaveOnStop: MusicPlayerSettings.leaveOnStop,
                metadata: {
                    channel: getBaseGuildTextChannel(interaction),
                    locale: getGuildMemberLocale(interaction)
                } as IQueueMetadata
            });

        const voiceChannel = getCurrentVoiceChannel(interaction)!;

        if (!queue.connection) await queue.connect(voiceChannel);

        if (this.isUserNotInSameVoiceChannelAsBot(interaction)) {
            return PlayerState.PlayingInAnotherChannel;
        }
        
        queue.addTrack(track?.playlist ?? track);

        if (!queue.isPlaying()) await queue.node.play();

        return PlayerState.AddedToQueue;
    }

    public async skip(interaction: Interaction): Promise<PlayerState> {
        if (this.isUserNotInSameVoiceChannelAsBot(interaction)) {
            return PlayerState.PlayingInAnotherChannel;
        }

        const guildId = getGuildId(interaction);

        const queueOrState = this.ValidateQueue(guildId, { checkEmpty: true });
        if (this.isPlayerState(queueOrState)) return queueOrState;

        const result = queueOrState.node.skip();
        return result ? PlayerState.Skipped : PlayerState.UnknownError;
    }

    public async stop(interaction: Interaction): Promise<PlayerState> {
        if (this.isUserNotInSameVoiceChannelAsBot(interaction)) {
            return PlayerState.PlayingInAnotherChannel;
        }

        const guildId = getGuildId(interaction);

        const queueOrState = this.ValidateQueue(guildId);
        if (this.isPlayerState(queueOrState)) return queueOrState;

        const result = queueOrState.node.stop();
        if (!result) return PlayerState.UnknownError;
        
        queueOrState.delete();
        return PlayerState.Stopped;
    }

    public async pause(interaction: Interaction): Promise<PlayerState> {
        if (this.isUserNotInSameVoiceChannelAsBot(interaction)) {
            return PlayerState.PlayingInAnotherChannel;
        }
    
        const guildId = getGuildId(interaction);

        const queueOrState = this.ValidateQueue(guildId, { checkEmpty: true });
        if (this.isPlayerState(queueOrState)) return queueOrState;

        if (queueOrState.node.isPaused()) {
            const result = queueOrState.node.resume();
            return result ? PlayerState.Resumed : PlayerState.UnknownError;
        } else {
            const result = queueOrState.node.pause();
            return result ? PlayerState.Paused : PlayerState.UnknownError;
        }
    }

    public async repeat(interaction: Interaction, repeatMode: RepeatMode): Promise<PlayerState> {
        if (this.isUserNotInSameVoiceChannelAsBot(interaction)) {
            return PlayerState.PlayingInAnotherChannel;
        }

        const guildId = getGuildId(interaction);

        const queueOrState = this.ValidateQueue(guildId, { checkEmpty: true });
        if (this.isPlayerState(queueOrState)) return queueOrState;
        
        const currentRepeatMode = queueOrState.repeatMode;
        if (currentRepeatMode === repeatMode) {
            switch (repeatMode) {
                case RepeatMode.Off:
                    return PlayerState.RepeatAlreadyDisabled;
                case RepeatMode.Track:
                    return PlayerState.RepeatTrackAlreadyEnabled;
                case RepeatMode.Queue:
                    return PlayerState.RepeatQueueAlreadyEnabled;
            }
        }
    
        queueOrState.setRepeatMode(repeatMode);
    
        return {
            [RepeatMode.Off]: PlayerState.RepeatDisabled,
            [RepeatMode.Track]: PlayerState.RepeatTrackEnabled,
            [RepeatMode.Queue]: PlayerState.RepeatQueueEnabled,
        }[repeatMode];
    }

    public async queue(interaction: Interaction, start: number, limit: number): Promise<[
        PlayerState, 
        Partial<Track>[], 
        boolean
    ]> {
        if (this.isUserNotInSameVoiceChannelAsBot(interaction)) {
            return [PlayerState.PlayingInAnotherChannel, [], false];
        }
    
        const guildId = getGuildId(interaction);

        const queueOrState = this.ValidateQueue(guildId, { checkEmpty: true });
        if (this.isPlayerState(queueOrState)) return [queueOrState, [], false];
    
        const tracks = queueOrState.tracks
            .map(this.mapTrackToPartial)
            .slice(start, start + limit);
    
        const hasMoreTracks = queueOrState.tracks.size > start + limit;
        return [PlayerState.QueueRetrieved, tracks, hasMoreTracks];
    }

    public getCurrentTrack(guildId: string): Partial<Track> | null {
        const queue = this.getCurrentQueue(guildId);
        if (!queue?.isPlaying()) return null;
        return this.mapTrackToPartial(queue.currentTrack!);
    }

    public getCurrentQueue(guildId: string): GuildQueue<IQueueMetadata> | null {
        return this._player.nodes.get(guildId);
    }

    private ValidateQueue(guildId: string, options: { checkEmpty?: boolean } = {}): GuildQueue | PlayerState {
        const queue = this.getCurrentQueue(guildId);
        if (!queue) return PlayerState.QueueDoesNotExist;
        if (options.checkEmpty && queue.tracks.size === 0) return PlayerState.QueueIsEmpty;
        return queue;
    }

    private isPlayerState(value: any): value is PlayerState {
        return DiscordPlayer.playerStateValues.has(value as PlayerState);
    }

    private isUserNotInSameVoiceChannelAsBot(interaction: Interaction): boolean {
        const member = getGuildMember(interaction), bot = getBotAsGuildMember(interaction);
        return isUserNotInSameVoiceChannelAsBot(member, bot);
    }
    
    private mapTrackToPartial(track: Track): Partial<Track> {
        return {
            title: track.title,
            url: track.url,
            duration: track.duration,
            author: track.author,
            thumbnail: getTrackThumbnail(track)!
        };
    }

    private registerHandlers(): void {
        trackEventHandlers.forEach(({ event, handler }) => {
            this._player.events.on(event, async (queue: GuildQueue<IQueueMetadata>, track: Track) => await handler(queue, track));
        });

        errorEventHandlers.forEach(({ event, handler }) => {
            this._player.events.on(event, async (queue: GuildQueue<IQueueMetadata>, error: Error) => await handler(queue, error));
        });

        debugQueueEventHandlers.forEach(({ event, handler }) => {
            this._player.events.on(event, async (queue: GuildQueue<IQueueMetadata>, message: string) => await handler(queue, message));
        });

        debugEventHandlers.forEach(({ event, handler }) => {
            this._player.on(event, async (message: string) => await handler(message));
        });
    }
}
