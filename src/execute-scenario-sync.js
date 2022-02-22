import api from './api-service.js'

function executeInteraction(interaction) {
    if (!interaction) {
        return Promise.resolve()
    }

    const request = interaction.HTTP || interaction.MQ
    const key = request.request.method + ' ' + request.request.path

    return api
        .fetchData(request.request)
        .then(data => {
            return {
                [key]: data
            }
        })
        .catch(e => {
            return {
                [key]: e
            }
        })
}

function executeInteractions(interactions, index) {
    const executeNext = data => {
        if (index + 1 < interactions.length) {
            return executeInteractions(interactions, ++index)
                .then(d => {
                    return {...data, ...d}
                })
                .catch(e => {
                    return {...data, ...e}
                })
        }
        else {
            return data
        }
    }

    return executeInteraction(interactions[index])
        .then(data => executeNext(data))
        .catch(e => executeNext(e))
}

export default {
    executeInteractions: executeInteractions
}

