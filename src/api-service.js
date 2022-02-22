import fetch from 'node-fetch'

export default {
    fetchData: request => {
        const opts = {
            method: request.method,
            credentials: 'omit',
            mode: 'cors',
            headers: request.headers,
            body: request.body ? JSON.stringify(request.body) : undefined
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
                body: request.body ? JSON.stringify(request.body) : undefined
            }
        )
}