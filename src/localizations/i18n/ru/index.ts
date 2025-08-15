import { ApiRestriction } from '../../../constants.js'
import type { BaseTranslation } from '../i18n-types.js'

const ru = {
    misc: {
        category: 'Разное',
        help: {
            name: 'help',
            description: 'Отображает список доступных команд и их описание.',
            when: {
                selectCategoryMessage: 'Пожалуйста, выберите категорию, по которой хотите получить помощь:',
                selectCategoryPlaceholder: 'Выберите категорию',
                messageTitle: 'Список команд',
                noAvailableCommands: 'К сожалению, на сервере нет команд, доступных Вам.',
                timeout: 'Закончилось время, отведенное на ответ.'
            }
        }
    },
    games: {
        category: 'Игры',
        roll: {
            name: 'roll',
            description: 'Генерирует случайное число в заданном диапазоне.',
            options: {
                min: {
                    name: 'min',
                    description: 'Минимальное значение для генерации.'
                },
                max: {
                    name: 'max',
                    description: 'Максимальное значение для генерации.'
                }
            },
            when: {
                minValueIsEqualToMax: ':x: Минимальное значение не может быть равным максимальному.',
                minValueIsGreaterThanMax: ':x: Минимальное значение не может быть больше максимального.',
                generated: 'Ваше число: {value:number}!'
            }
        }
    },
    management: {
        category: 'Управление',
        delete: {
            name: 'delete',
            description: 'Удаляет указанное число сообщений в текстовом канале.',
            descriptionTitle: ':white_check_mark: Сообщения удалены',
            options: {
                amount: {
                    name: 'amount',
                    description: 'Количество сообщений для удаления.'
                }
            },
            when: {
                deleted: 'Успешно удалено {total:integer} сообщений.',
                notDeleted: `Не удалось удалить {remaining:number} сообщений, так как они старше ${ApiRestriction.maxDaysForMessageDeletion} дней.`
            }
        },
    },
    music: {
        category: 'Музыка',
        play: {
            name: 'play',
            description: 'Воспроизводит трек или добавляет его в очередь, если другой трек уже играет.',
            options: {
                query: {
                    name: 'query',
                    description: 'URL песни или её название.'
                }
            },
            when: {
                noTrackSearchResult: ':x: Не найдено результатов по запросу \'{query:string}.\''
            }
        },
        skip: {
            name: 'skip',
            description: 'Пропускает текущий трек.'
        },
        stop: {
            name: 'stop',
            description: 'Останавливает воспроизведение и удаляет текущую очередь.'
        },
        pause: {
            name: 'pause',
            description: 'Останавливает текущий трек или продолжает его воспроизведение.',
            when: {
                paused: 'Воспроизведение трека поставлено на паузу.',
                resumed: 'Воспроизведение трека возобновлено.'
            }
        },
        queue: {
            name: 'queue',
            description: 'Отображает список треков на воспроизведение в очереди.',
            when: {
                messageTitle: 'Список треков'
            }
        },
        repeat: {
            name: 'repeat',
            description: 'Задаёт режим повтора для очереди.',
            options: {
                mode: {
                    name: 'mode',
                    description: 'Режим повтора.'
                }
            },
            choices: {
                mode: {
                    Off: 'Off',
                    Track: 'Track',
                    Queue: 'Queue'
                }
            },
            when: {
                repeatIsDisabled: 'Режим повтора выключен.',
                repeatIsAlreadyDisabled: 'Режим повтора уже выключен.',
                repeatTrackIsEnabled: 'Режим повтора трека включен.',
                repeatTrackIsAlreadyEnabled: 'Режим повтора трека уже был включен.',
                repeatQueueIsEnabled: 'Режим повтора очереди включен.',
                repeatQueueIsAlreadyEnabled: 'Режим повтора очереди уже был включен.'
            }
        },
        when: {
            unknownError: 'Произошла неизвестная ошибка. Пожалуйста, повторите попытку позже.',
            queueDoesNotExist: ':x: Нет каких-либо воспроизводимых треков для выполнения этой команды.',
            userIsNotInVoiceChannel: ':x: Для выполнения этой команды Вам необходимо находиться в голосом канале.',
            userIsNotInSameVoiceChannelAsBot: ':x: Для выполнения этой команды Вам необходимо находиться в том же голосом канале, что и бот.'
        }
    },
    events: {
        music: {
            duration: 'Продолжительность',
            author: 'Автор',
            nowPlaying: 'Сейчас играет',
            trackAddedToQueue: 'В очередь был добавлен новый трек',
            tracksAddedToQueue: 'В очередь был добавлен плейлист',
            trackPaused: 'Трек поставлен на паузу',
            trackResumed: 'Трек снят с паузы',
            trackSkipped: 'Трек пропущен',
            playbackFinished: 'Воспроизведение завершено',
            queueIsEmptyTitle: 'Очередь пуста',
            queueIsEmptyDescription: 'Все песни из очереди были воспроизведены.',
            playbackError: 'Ошибка воспроизведения. Пожалуйста, повторите попытку позже.',
            playerError: 'Ошибка плеера. Пожалуйста, повторите попытку позже.',
        },
        userJoined: {
            notificationTitle: '{userName:string}, рады видеть тебя на сервере {serverName:string}!',
            notificationBody: 'На сервере есть собственный бот. Используйте ``/help``, что бы просмотреть список доступных команд.'
        },
        userLeft: {
            notificationTitle: '{userName:string} вышел с сервера.'
        },
        interactionCreate: {
            unknownError: 'При выполнении команды произошла ошибка.'
        }
    }
} satisfies BaseTranslation

export default ru
