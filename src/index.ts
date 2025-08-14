import { Client, GatewayIntentBits } from "discord.js";
import ModuleCommandRegister from "./commands/registers/moduleCommandRegister";
import { AppConfig } from "./config";
import { logger } from "./loggers";
import "./events";
import "./extensions/discordClient"
import VKMusicPlayer from "./music/vkMusicPlayer";

try {
    const config = await AppConfig.get();

    const commandRegister = new ModuleCommandRegister(config.auth!, config.register!);
    const commands = await commandRegister.Register();

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,                
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildVoiceStates
        ]
    });

    const musicPlayer = await (new VKMusicPlayer(client, config.player!))
        .loadExtractors();

    client
        .addConfig(config)
        .addCommands(commands)
        .addMusicPlayer(musicPlayer);

    client
        .handleReady()
        .handleUserJoined()
        .handleUserLeft()
        .handleInteractionCreate()

    await client.login(config.auth?.botToken);
} catch(err) {
    logger.error(err);
}