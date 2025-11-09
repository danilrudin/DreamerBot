[![Build](https://github.com/danilrudin/DreamerBot/actions/workflows/build.yml/badge.svg)](https://github.com/danilrudin/DreamerBot/actions/workflows/build.yml)[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Maslinin_DreamerBot&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Maslinin_DreamerBot) [![GitHub license](https://badgen.net/github/license/Maslinin/DreamerBot)](https://github.com/Maslinin/DreamerBot/blob/master/LICENSE)

# DreamerBot
A solid foundation for building powerful Discord bots — clean, minimal, and extensible.

## Overview
This project was created to provide a reliable platform for creating your own Discord bot. You are free to use, modify, and extend it under the terms of the MIT license. If you decide to use this repository as the basis for your bot, please put a star on this repository or fork it - it will help promote it and will be the best gratitude for me.

> Please note that DreamerBot does not exist as a real Discord bot. Any Discord bot with a similar name is not related to this repository.

### Why DreamerBot?
- Clean and understandable code;
- Easily create your own commands;
- Multi-language support thanks to [typesafe-i18n](https://www.npmjs.com/package/typesafe-i18n);
- Built-in music playback capabilities thanks to [discord-player](https://www.npmjs.com/package/discord-player) and [discord-player-youtubei](https://www.npmjs.com/package/discord-player-youtubei);
- Detailed logging with the ability to deeply configure logs thanks to [log4js](https://www.npmjs.com/package/log4js).

### Requirements
- Node.js v22.15.* or higher
- Bun Runtime
- Ffmpeg

## How to add a command?
In order to add your own command, go to [``/src/commands``](https://github.com/Maslinin/DreamerBot/tree/master/src/commands). Here are the basic commands and tools for uploading them to Discord.

The commands are divided into categories, and each category has its own directory. The presence of a directory for each of the categories is also necessary for the correct operation of the [``help``](https://github.com/Maslinin/DreamerBot/tree/master/src/commands/misc/help.ts) command. You can create a new directory for the category corresponding to your command or use an existing one.

You can refer to the [official discord.js documentation](https://discordjs.guide/creating-your-bot/slash-commands.html) or to [one of the existing DreamerBot commands](https://github.com/Maslinin/DreamerBot/blob/master/src/commands/games/roll.ts) to create your own command. 

You can use both **JavaScript** or **TypeScript** to create a command.       
After you create your command file and start the bot, the DreamerBot's command register will create, update or remove your commands in Discord interface.

> You may need to restart the Discord client on your device after adding a command or changing its interface.

## How to add another localization?
Thanks to the integration with the **typesafe-i18n** library, you can easily create your own localization for the bot.

Go to the [/src/locales/i18n](https://github.com/Maslinin/DreamerBot/tree/master/src/locales/i18n) directory. Here you need to create a directory, the name of which corresponds to your localization and a file containing the corresponding localization keys. You can focus on [the current default localization](https://github.com/Maslinin/DreamerBot/tree/master/src/locales/en-US/index.ts).

Please note that the name of your localization and the localization directory must match the locales in **discord.js**. You can get acquainted with the locales supported by Discord in [the official discord.js documentation](https://discord.js.org/docs/packages/discord.js/main/Locale:Enum).

In case you forgot to add any localization key to your localization file, the bot will use the localization for this key by default. You can change the default localization in [the typesafe-i18n settings file](https://github.com/Maslinin/DreamerBot/blob/master/.typesafe-i18n.json) at any time.

After you add a new localization or change an existing one, you will only need to call the following command on the command line from the root folder:
```
npx typesafe-i18n
```
It will generate new localization files for the bot.

## 🛡 License

This project is licensed under the [MIT License](./LICENSE).  
You are free to use, modify, distribute, and build upon this project for any purpose, including commercial use, in accordance with the license terms.

### Legal Notice

DreamerBot uses [discord-player-youtubei](https://www.npmjs.com/package/discord-player-youtubei) as the default implementation for music playback.  
Please review [the legal notice](https://github.com/retrouser955/discord-player-youtubei/blob/HEAD/LEGAL.md) provided by the **discord-player-youtubei** maintainers before using the music functionality. 
Usage of this feature may violate the Terms of Service of platforms like YouTube, VK, or other third-party services — proceed at your own risk.