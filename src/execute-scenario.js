import api from './api-service.js'
import compare from './compareJson.js'

module.exports = interactions => interactions
    .map(interaction => api.fetchData(interaction?.HTTP?.request)
        .then(returnedJson => {
            if (!returnedJson && interaction.response && interaction.response.body) {
                throw new Error('Mock server with no response. Contract expects ' + JSON.stringify(interaction.response.body))
            }
            if (!returnedJson) {
                return true
            }
            else if (interaction.response && compare.isJsonStructureCompatible(interaction.response.body, returnedJson)) {
                return true
            }
            else if (interaction.response) {
                throw new Error('Incompatible')
            }
            return returnedJson
        })
        .catch(e => {
            throw new Error('Error: ' + e)
        }))