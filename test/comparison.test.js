const compare = require('../src/compareJsonStructure')

const expected = require('../test-data/expected-value.json')
const actual = require('../test-data/actual-value.json')
const actualNotEqual = require('../test-data/actual-value-not-equal.json')


describe('test comparison', () => {

    test('comparison with values equal', () => {

        const isEqual = compare.isJsonStructureAndValuesAsExpected(expected, actual)
        expect(isEqual).toBe(true)

    })

    test('comparison without values equal', () => {

        const isEqual = compare.isJsonStructureCompatible(expected, actual)
        expect(isEqual).toBe(true)

    })

    test('comparison with values not equal', () => {

        const isEqual = compare.isJsonStructureAndValuesAsExpected(expected, actualNotEqual)
        expect(isEqual).toBe(false)

    })

    test('comparison without values not equal', () => {

        const isEqual = compare.isJsonStructureCompatible(expected, actualNotEqual)
        expect(isEqual).toBe(false)

    })

})