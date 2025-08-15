import { ApiRestriction } from '../../../constants.js'
import type { BaseTranslation } from '../i18n-types.js'

const en_US = {
    misc: {
        category: 'Misc',
        help: {
            name: 'help',
            description: 'Displays a list of available commands and their descriptions.',
            when: {
                selectCategoryMessage: 'Please select the category for which you want to receive help:',
                selectCategoryPlaceholder: 'Select a category',
                messageTitle: 'Command List',
                noAvailableCommands: 'Unfortunately, there are no commands available to you on the server.',
                timeout: 'The response time has expired.'
            }
        }
    },
    games: {
        category: 'Games',
        roll: {
            name: 'roll',
            description: 'Generates a random number in the specified range.',
            options: {
                min: {
                    name: 'min',
                    description: 'Minimum value to generate.'
                },
                max: {
                    name: 'max',
                    description: 'Maximum value to generate.'
                }
            },
            when: {
                minValueIsEqualToMax: ':x: The minimum value cannot be equal to the maximum value.',
                minValueIsGreaterThanMax: ':x: The minimum value cannot be greater than the maximum.',
                generated: 'Your number is {value:number}!'
            }
        }
    },
    management: {
        category: 'Management',
        delete: {
            name: 'delete',
            description: 'Deletes the specified amount of messages in a text channel.',
            descriptionTitle: ':white_check_mark: Messages Deleted',
            options: {
                amount: {
                    name: 'amount',
                    description: 'Amount of messages to delete.'
                }
            },
            when: {
                deleted: 'successfully deleted {total:number} messages.',
                notDeleted: `Cannot delete {remaining:number} messages because they are older than ${ApiRestriction.maxDaysForMessageDeletion} days.`
            }
        },
    },
    music: {
        category: 'Music',
        play: {
            name: 'play',
            description: 'Plays a track or adds it to the queue if another track is already playing.',
            options: {
                query: {
                    name: 'query',
                    description: 'The URL of a track or its name.'
                }
            },
            when: {
                noTrackSearchResult: ':x: No results have been found by the query \'{query:string}.\''
            }
        },
        skip: {
            name: 'skip',
            description: 'Skips a current track.'
        },
        stop: {
            name: 'stop',
            description: 'Stops playback and deletes the queue.'
        },
        pause: {
            name: 'pause',
            description: 'Pauses or resumes a current track.',
            when: {
                paused: 'The playback of the track has been paused.',
                resumed: 'The track has resumed playback.'
            }
        },
        queue: {
            name: 'queue',
            description: 'Displays a list of tracks in the queue.',
            when: {
                messageTitle: 'Track List'
            }
        },
        repeat: {
            name: 'repeat',
            description: 'Sets a repeat mode for the queue.',
            options: {
                mode: {
                    name: 'mode',
                    description: 'Repeat mode.'
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
                repeatIsDisabled: 'Repeat mode is disabled.',
                repeatIsAlreadyDisabled: 'Repeat mode is already off.',
                repeatTrackIsEnabled: 'Track repeat mode is enabled.',
                repeatTrackIsAlreadyEnabled: 'Track repeat mode has already been enabled.',
                repeatQueueIsEnabled: 'Queue repeat mode is enabled.',
                repeatQueueIsAlreadyEnabled: 'Queue repeat mode has already been enabled.'
            }
        },
        when: {
            unknownError: 'An unknown error has occurred. Please try again later.',
            queueDoesNotExist: ':x: There are no playable tracks to execute this command.',
            userIsNotInVoiceChannel: ':x: To execute this command, you need to be in a voice channel.',
            userIsNotInSameVoiceChannelAsBot: ':x: To execute this command, you must be in the same voice channel as the bot.'
        }
    },
    events: {
        music: {
            duration: 'Duration',
            author: 'Author',
            nowPlaying: 'Now playing',
            trackAddedToQueue: 'A new track has been added to the queue',
            tracksAddedToQueue: 'A playlist has been added to the queue',
            trackPaused: 'The track has paused',
            trackResumed: 'The track has resumed',
            trackSkipped: 'Track skipped',
            playbackFinished: 'Playback finished',
            queueIsEmptyTitle: 'Queue is empty',
            queueIsEmptyDescription: 'All tracks from the queue have been played.',
            playbackError: 'Playback error. Please try again later.',
            playerError: 'Player error. Please try again later.'
        },
        userJoined: {
            notificationTitle: '{userName:string}, welcome to the {serverName:string} server!',
            notificationBody: 'There is a local bot here. Use ``/help`` to view available commands.'
        },
        userLeft: {
            notificationTitle: '{userName:string} has left the server.'
        },
        interactionCreate: {
            unknownError: 'An error occurred while trying to execute the command.'
        }
    }
} satisfies BaseTranslation

export default en_US
