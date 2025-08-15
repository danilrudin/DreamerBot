import { Locale } from "discord.js";
import L from "../localizations/i18n/i18n-node.js";
import { baseLocale, locales } from "../localizations/i18n/i18n-util.js";
import { Locales, TranslationFunctions } from "../localizations/i18n/i18n-types.js";

export function getLocalization(locale: Locale): typeof L[keyof typeof L] {
    const matchedLocale = locales.find(l => l === locale);
    return L[matchedLocale ?? baseLocale];
}

export function getDefaultLocalization(): TranslationFunctions {
    return L[baseLocale];
}

export function generateLocalizations(path: string): Record<Locales, string> {
    return locales.reduce((acc, locale) => {
        const keys = path.split(".");
        let value: any = L[locale];

        for (const key of keys) {
            if (value[key]) {
                value = value[key];
            } else {
                throw new Error(`Path "${path}" not found for locale "${locale}"`);
            }
        }

        acc[locale] = value();
        return acc;
    }, {} as Record<Locales, string>);
}