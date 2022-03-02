import {readFileSync, writeFile} from 'fs'

export default {
    saveToFile: (fileName, data) => {
        writeFile(fileName, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) {
                throw 'Failed to save' + err
            }
        })
    },

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