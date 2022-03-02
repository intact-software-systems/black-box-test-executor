function isObject(expectedValue, key) {
    return expectedValue[key] instanceof Object || Array.isArray(expectedValue[key])
}

function isCompatible(expected, actual) {
    if (Array.isArray(expected)) {
        return Array.isArray(actual)
    }

    return Object.keys(expected)
        .map(key => actual.hasOwnProperty(key))
        .find(a => a === false) === undefined
}

function compareJsons(expected, actual) {

    if (!isCompatible(expected, actual)) {
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

                        if (!compareJsons(expectedValue[key], actualValue[key])) {
                            return false
                        }
                    }
                }
            }
        }
    }
    else {
        for (const key of Object.keys(expected)) {

            if (isObject(expected, key) && expected[key] && actual[key]) {

                if (!compareJsons(expected[key], actual[key])) {
                    return false
                }
            }
            else if (!actual.hasOwnProperty(key)) {
                return false
            }
        }
    }

    return true
}

export default {
    isJsonCompatible: (expected, actual) => compareJsons(expected, actual)
}
