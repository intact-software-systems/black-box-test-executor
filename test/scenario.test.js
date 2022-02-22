const scenario = require('../test-data/example-scenario.json')
const sync = require('../src/execute-scenario-sync')
const executeScenario = require('../src/execute-scenario')

describe('test scenarios', () => {
    test('scenario parallel', async () => {
        const promises = executeScenario(scenario)
        return Promise.all(promises)
            .then(data => {
                const failedTests = data.find(a => a === false)
                expect(failedTests).toBe(undefined)
                if (failedTests) {
                    console.log(data)
                    throw 'Incompatible'
                }
                return data
            })
            .catch(e => {
                console.log(e)
                expect(e).toBeUndefined()
            })
            .finally(a => {
                console.log('yes finally!', a)
            })
    })

    test('scenario sequential', async () => {
        await sync.executeInteractions(scenario, 0)
            .then(data => {
                console.log(JSON.stringify(data))
                return data
            })
            .catch(e => {
                console.log(e)
                expect(e).toBeUndefined()
            })
            .finally(a => {
                console.log('yes finally!', a)
            })
    })

})

