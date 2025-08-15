import log4js from "log4js";
import { ILogger } from "./logger.js";
import { Path } from "../constants.js";

log4js.configure(Path.log4jsConfig);

const log4jsLogger = log4js.getLogger() as ILogger;
export default log4jsLogger;