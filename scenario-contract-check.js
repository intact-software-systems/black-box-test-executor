#!/usr/bin/env node

import sync from './src/execute-contract-check.js'
import runPrism from './src/run-prism.js'
import utils from './src/utils.js'

import {Command} from 'commander'

const program = new Command()

program
    .requiredOption('-c, --contract <pact>', 'Pact contract in json')
    .option('--openapi <contract>', 'Open api contract in json or yaml. If given, a prism server will be started')
    .option('--port <port>', 'Server port. Default 8080')

program.on('-h, --help', () => {
    console.log('')
    console.log('Example calls:')
    console.log('  $ contract-check --contract pact.json')
    console.log('  $ contract-check -c pact.json')
    console.log('  $ contract-check --contract pact.json --openapi openapi.json')
})

program.parse(process.argv)

const SERVER_PORT = program.opts().port || 8080

let prismHandle = undefined

const scenarios = utils.openFile(program.opts().contract)
const scenarioJson = utils.flattenInputArray(scenarios)


runPrism(program.opts().openapi, SERVER_PORT)
    .then(prism => {
        if (prism) {
            prismHandle = prism
        }

        return sync.executeContractCheck(scenarioJson, 0)
    })
    .then(data => {
        console.log(JSON.stringify(data, null, 2))
        return data
    })
    .catch(e => {
        console.log(e)
    })
    .finally(() => {
        prismHandle && prismHandle.kill()
    })

