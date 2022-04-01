#!/usr/bin/env node

import utils from './src/utils.js'

import {Command} from 'commander'

const program = new Command()

program
    .requiredOption('-r, --result <result>', 'Result file in json')

program.on('-h, --help', () => {
    console.log('')
    console.log('Example calls:')
    console.log('  $ extract-actual-from-results --result result.json')
    console.log('  $ extract-actual-from-results -r result.json')
})

program.parse(process.argv)

const results = utils.openFile(program.opts().result)

const actualResponses = Object.keys(results)
    .map(key => {
        return {
            [key]: results[key].actual.body
        }
    })
    .reduce((a, b) => {
        return {...a, ...b}
    })

utils.saveToFile('actualResponses.json', actualResponses)

