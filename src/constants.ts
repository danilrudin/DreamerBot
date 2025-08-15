import { ColorResolvable } from "discord.js";

export const Path = {
  appConfig: "./src/config/config.json",
  log4jsConfig: "./src/loggers/log4js.config.json",
  commands: "./dist/commands",
};

export const FileExtension = {
  modules: [".js", ".ts"],
};

export const ApiRestriction = {
  maxMessagesToDelete: 100,
  maxDaysForMessageDeletion: 14,
  maxFieldsInEmbed: 25,
  maxCharactersInEmbed: 4096,
  options: {
    integer: {
      minValue: -2147483648,
      maxValue: 2147483647,
    },
  },
};

export const ApiResponse = {
  componentCollector: {
    commandCategoryResponseTime: 60000,
    queuePageSelectorResponseTime: 60000,
  },
};

export const MusicPlayerSettings = {
  leaveOnEnd: false,
  leaveOnEmpty: true,
  leaveOnStop: true,
  maxTracksToSearch: 10,
  maxTracksToDequeue: 5,
  youTubei: {
    highWaterMark: 1 << 25, //32 MB
  },
};

export const Customization = {
  color: {
    success: "Green",
    playerNotification: 0x38e038,
    failure: "Red",
  } as Record<string, ColorResolvable>,
};
