function isCompatibleObjects(expected, actual) {
    if (Array.isArray(expected)) {
        return isCompatibleArrays(expected, actual)
    }

    for (const key of Object.keys(expected)) {

        if (expected[key] instanceof Object) {

            if (!(actual[key] instanceof Object)) {
                return false
            }

            if (!isCompatibleObjects(expected[key], actual[key])) {
                return false
            }
        }
        else if (Array.isArray(expected[key])) {

            if (!Array.isArray(actual[key])) {
                return false
            }

            if (!isCompatibleArrays(expected[key], actual[key])) {
                return false
            }
        }
        else {

            if (!actual.hasOwnProperty(key)) {
                return false
            }

            if (expected[key] !== actual[key]) {
                return false
            }
        }
    }
    return true
}


function isCompatibleArrays(expected, actual) {
    if (!Array.isArray(actual)) {
        return false
    }

    if (expected.length !== actual.length) {
        return false
    }

    const expectedFound = []
    const actualToCompare = [...actual]

    for (const expectedValue of expected) {

        // Algorithm: find first actualValue in actual that is identical to expectedValue
        for (let i = 0; i < actualToCompare.length; i++) {
            if (actualToCompare[i] === undefined) {
                continue
            }

            const actualValue = actualToCompare[i]

            if (Array.isArray(expectedValue)) {
                if (!isCompatibleArrays(expectedValue, actualValue)) {
                    return false
                }
            }
            else if (isCompatibleObjects(expectedValue, actualValue)) {
                expectedFound.push(expectedValue)
                actualToCompare[i] = undefined
            }
        }
    }

    return expectedFound.length === expected.length
}

export default {
    isJsonCompatible: (expected, actual) =>
        Array.isArray(expected)
            ? isCompatibleArrays(expected, actual)
            : isCompatibleObjects(expected, actual)
}
