#!/usr/bin/env node

import utils from './src/utils.js'

import {Command} from 'commander'

const program = new Command()

program
    .requiredOption('-r, --result <result>', 'Result file in json')

program.on('-h, --help', () => {
    console.log('')
    console.log('Example calls:')
    console.log('  $ scenario-results-is-success --result result.json')
    console.log('  $ scenario-results-is-success -r result.json')
})

program.parse(process.argv)

const results = utils.openFile(program.opts().result)

const STATUS = {
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE'
}

const isFailure = Object.keys(results)
    .map(key => results[key].test)
    .some(testResult => testResult !== STATUS.SUCCESS)

console.log(isFailure ? STATUS.FAILURE : STATUS.SUCCESS)

process.exit(isFailure)

