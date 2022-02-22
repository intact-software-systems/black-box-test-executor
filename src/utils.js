import {readFileSync} from 'fs'

export default {
    openFile: filename => {
        return JSON.parse(readFileSync(filename))
    },

    flattenInputArray: array => array
        .reduce((a, b) => {
            if (Array.isArray(a) && Array.isArray(b)) {
                return [...a, ...b]
            }
            else if (Array.isArray(a)) {
                return [...a, b]
            }
            else if (Array.isArray(b)) {
                return [a, ...b]
            }
            return [a, b]
        })
}