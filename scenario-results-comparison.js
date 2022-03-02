#!/usr/bin/env node

import utils from './src/utils.js'
import compare from './src/compareJsonByValue.js'

import {Command} from 'commander'

const STATUS = {
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE'
}

const program = new Command()


program
    .requiredOption('-r, --result <result>', 'Result file in json')

program.on('-h, --help', () => {
    console.log('')
    console.log('Example calls:')
    console.log('  $ scenario-results-comparison --result result.json')
    console.log('  $ scenario-results-comparison -r result.json')
})

program.parse(process.argv)

const results = utils.openFile(program.opts().result)


const isFailure = Object.keys(results)
    .map(key => compare.isJsonCompatible(results[key].expected.body, results[key].actual.body))
    .some(testResult => testResult === false)

console.log(isFailure ? STATUS.FAILURE : STATUS.SUCCESS)

process.exit(isFailure)


