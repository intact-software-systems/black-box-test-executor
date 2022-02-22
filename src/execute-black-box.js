import api from './api-service.js'
import compare from './compareJsonStructure.js'

const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'

async function toJson(res) {
    return res.json()
        .catch(() => {
            return {}
        })
}

function toStatus(result, actualJson, res, interaction, testResult) {
    return {
        test: testResult,
        result: result,
        method: interaction.request.method,
        path: interaction.request.path,
        expected: interaction.response,
        actual: {
            body: actualJson,
            statusCode: res.status,
            statusText: res.statusText
        }
    }
}

function executeInteraction(index, interaction) {
    if (!interaction) {
        return Promise.resolve()
    }

    return api
        .fetchDataBasic(interaction.request)
        .then(async res => {
            if (!res.ok) {
                throw res.statusText
            }

            const returnedJson = await toJson(res)

            if (interaction?.response?.body) {
                if (!returnedJson) {
                    return toStatus('Server with no body in response. Expects a body.', returnedJson, res, interaction, FAILURE)
                }
                else {
                    if (!compare.isJsonStructureCompatible(interaction.response.body, returnedJson)) {
                        return toStatus('Expected response incompatible with actual response', returnedJson, res, interaction, FAILURE)
                    }

                    if (!compare.isJsonStructureAndValuesAsExpected(interaction.response.body, returnedJson)) {
                        return toStatus('Expected response not the same as actual response', returnedJson, res, interaction, FAILURE)
                    }
                }
            }

            if (interaction?.response?.statusCode && interaction.response.statusCode !== res.status) {
                return toStatus('Expected responseCode not the same as actual responseCode', returnedJson, res, interaction, FAILURE)
            }

            return toStatus('OK', returnedJson, res, interaction, SUCCESS)
        })
        .then(status => {
            if (status.test === FAILURE) {
                throw status
            }
            return status
        })
        .then(data => {
            return {
                [index]: data
            }
        })
        .catch(e => {
            return {
                [index]: e
            }
        })
}

function toInteraction(interactions, index) {
    return interactions[index]?.HTTP || interactions[index]?.MQ
}

function executeBlackBox(interactions, index) {
    const executeNext = data => {
        if (index + 1 < interactions.length) {
            return executeBlackBox(interactions, ++index)
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

    return executeInteraction(index, toInteraction(interactions, index))
        .then(data => executeNext(data))
        .catch(e => executeNext(e))
}

export default {
    executeBlackBox: executeBlackBox
}