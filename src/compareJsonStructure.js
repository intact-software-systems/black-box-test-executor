function isObject(expectedValue, key) {
    return expectedValue[key] instanceof Object || Array.isArray(expectedValue[key])
}

function isBasicField(expectedValue, key) {
    return isObject(expectedValue, key) === false
}

function isCompatible(expected, actual, compareValues) {
    if (Array.isArray(expected)) {
        return Array.isArray(actual) && expected.length === actual.length
    }

    const ret = Object.keys(expected)
        .map(key => {
            if (actual.hasOwnProperty(key)) {

                if (compareValues && isBasicField(expected, key)) {
                    return expected[key] === actual[key]
                }

                return true
            }

            return false
        })

    const find = ret.find(a => a === false)
    return find === undefined
}

function compareJsons(expected, actual, compareValues) {

    if (!isCompatible(expected, actual, compareValues)) {
        return false
    }

    if (Array.isArray(expected)) {
        for (const expectedValue of expected) {
            for (const key of Object.keys(expectedValue)) {
                for (const actualValue of actual) {

                    if (!actualValue.hasOwnProperty(key)) {
                        return false
                    }

                    if (isObject(expectedValue, key)) {

                        if (!compareJsons(expectedValue[key], actualValue[key], compareValues)) {
                            return false
                        }
                    }
                    else if (compareValues && expectedValue[key] !== actualValue[key]) {
                        return false
                    }
                }
            }
        }
    }
    else {
        for (const key of Object.keys(expected)) {

            if (isObject(expected, key) && expected[key] && actual[key]) {

                if (!compareJsons(expected[key], actual[key], compareValues)) {
                    return false
                }
            }
            else if (!actual.hasOwnProperty(key)) {
                return false
            }

            if (compareValues && isBasicField(expected, key)) {
                return expected[key] === actual[key]
            }
        }
    }

    return true
}

export default {
    isJsonStructureCompatible: (expected, actual) => compareJsons(expected, actual, false),
    isJsonStructureAndValuesAsExpected: (expected, actual) => compareJsons(expected, actual, true)
}
