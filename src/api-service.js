import fetch from 'node-fetch'

function toBody(request) {
    return request.body && request.method !== 'GET'
        ? JSON.stringify(request.body)
        : undefined
}

export default {
    fetchData: request => {
        const opts = {
            method: request.method,
            credentials: 'omit',
            mode: 'cors',
            headers: request.headers,
            body: toBody(request)
        }

        return fetch(request.path, opts)
            .then(res => {
                if (!res.ok) {
                    throw res.statusText
                }
                return res
            })
            .then(async res =>
                res.json()
                    .catch(() => {
                        return {}
                    })
            )
    },
    fetchDataBasic: request =>
        fetch(
            request.path,
            {
                method: request.method,
                credentials: 'omit',
                mode: 'cors',
                headers: request.headers,
                body: toBody(request)
            }
        )
}