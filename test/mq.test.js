const mq = require('ibmmq')
const mqService = require('../src/mq-service')

const MQ = {
    hostNameList: "localhost(1414)",
    queueManager: "DEVMQ",
    channel: "DEV.APP.SVRCONN",
    queueName: "TESTQUEUE1",
    userName: "admin",
    password: "passw0rd",
    replyToQueueName: "TESTQUEUE1.REPLY",
    headerFile: "./templates/mq-header-template.json",
    body: {}
}

describe('test mq', () => {

    test('mq connect', async () => {

        const cd = new mq.MQCD()
        cd.ConnectionName = MQ.hostNameList
        cd.ChannelName = MQ.channel

        const cno = new mq.MQCNO()
        cno.ClientConn = cd

        await new Promise(((resolve, reject) => {
            mq.Connx(MQ.queueManager, cno, (err, conn) => {
                if (err) {
                    reject(err)
                    console.log("error " + err.message)
                } else {
                    console.log("Success!")
                    mq.Disc(conn, err => {
                        if (err) {
                            reject(err)
                            console.log("error disconnect " + err.message)
                        } else {
                            console.log("Disconnected")
                            resolve()
                        }
                    })
                }
            })

        }))

    })

    test('mq send', async () => {
        await mqService.sendToQueue(
            MQ,
            {
                data: "hei"
            }
        )
            .then(a => {
                console.log("Success ")
                console.log(a)
            })
            .catch(err => {
                console.log("error")
                console.error(err)
            })
    })
})