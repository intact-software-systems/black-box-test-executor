#!/usr/bin/env node

import sync from './src/execute-scenario-sync.js'
import utils from './src/utils.js'

import {Command} from 'commander'

const program = new Command()

program
    .requiredOption('-s, --scenario <scenario>', 'Scenario file in json')

program.on('-h, --help', () => {
    console.log('')
    console.log('Example calls:')
    console.log('  $ scenario-execute --scenario scenario.json')
    console.log('  $ scenario-execute -s scenario.json')
})

program.parse(process.argv)

const scenarios = utils.openFile(program.opts().scenario)
const scenarioJson = utils.flattenInputArray(scenarios)

sync.executeInteractions(scenarioJson, 0)
    .then(data => {
        console.log(JSON.stringify(data, null, 2))
        return data
    })
    .catch(e => {
        console.log(e)
        expect(e).toBeUndefined()
    })
