import {spawn} from 'child_process'

export default (openapiJson, port) => {
    if (!openapiJson) {
        return Promise.resolve(undefined)
    }

    return new Promise((resolve, reject) => {

        const prism = spawn('prism', ['mock', openapiJson, '--cors=false', '--port=' + port], {detached: false})

        let resolvePromise = true

        prism.on('error', () => {
            reject(undefined)
        })

        prism.stdout.on('data', (data) => {
            const string = data.toString()
            process.stdout.write(string)
            if (resolvePromise && string.includes('listening on')) {
                resolve(prism)
                resolvePromise = false
            }
        })

        prism.stderr.on('data', (data) => {
            process.stdout.write(`stderr: ${data}`)
        })

        prism.on('close', (code) => {
            process.stdout.write(`child process exited with code ${code}`)
        })
    })
}
