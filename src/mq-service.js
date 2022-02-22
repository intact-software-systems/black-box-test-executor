const mq = require('ibmmq')

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

MQStatus = {
    mqConnection: undefined,
    mqHandle: undefined
}

function connect(hostNameList, channel, queueManager) {
    if (MQStatus.mqConnection) {
        return Promise.resolve(MQStatus.mqConnection)
    }

    const cd = new mq.MQCD()
    cd.ConnectionName = hostNameList
    cd.ChannelName = channel

    const cno = new mq.MQCNO()
    cno.ClientConn = cd

    return new Promise((resolve, reject) => {
        mq.Connx(queueManager, cno, (err, conn) => {
            if (err) {
                MQStatus.mqConnection = undefined
                reject(err)
            } else {
                MQStatus.mqConnection = conn
                resolve(conn)
            }
        })
    })
}

function open(conn, queueName) {
    if (MQStatus.mqHandle) {
        return Promise.resolve(MQStatus.mqHandle)
    }

    var od = new mq.MQOD()
    od.ObjectName = queueName
    od.ObjectType = mq.MQC.MQOT_Q
    var openOptions = mq.MQC.MQOO_OUTPUT
    return mq.OpenPromise(conn, od, openOptions)
        .then(mqHandle => {
            MQStatus.mqHandle = mqHandle
            return mqHandle
        })
}

// Define some functions that will be used from the main flow
function putMessage(handle, msg) {
    var mqmd = new mq.MQMD() // Defaults are fine.

    // mqmd.ReplyToQ = null
    // mqmd.ReplyToQMgr = null

    var pmo = new mq.MQPMO()

    // Describe how the Put should behave
    pmo.Options = mq.MQC.MQPMO_NO_SYNCPOINT |
        mq.MQC.MQPMO_NEW_MSG_ID |
        mq.MQC.MQPMO_NEW_CORREL_ID

    // TODO: set header using this?
    // const rfh2 = new mq.MQRFH2()
    // rfh2.

    return mq.PutPromise(handle, mqmd, pmo, JSON.stringify(msg))
}

function getMessage(handle) {
    // TODO: Implement
}

function disconnect(conn) {
    return new Promise((resolve, reject) => {
        mq.Disc(conn, err => {
            if (err) {
                reject(err)
            } else {
                resolve(conn)
            }
        })
    })
}

function cleanup(hObj) {
    return new Promise((resolve, reject) => {
        mq.Close(hObj, 0, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}


module.exports = {
    sendToQueue: async (MQ, msg) => {
        return connect(MQ.hostNameList, MQ.channel, MQ.queueManager)
            .then(conn => open(conn, MQ.queueName))
            .then(handle => putMessage(handle, msg))
            .then(mqmd => {
                console.log("Successfully sent " + mqmd)
                console.log(msg)
                return mqmd
            })
    },
    getFromQueue: async (MQ) => {
        return connect(MQ.hostNameList, MQ.channel, MQ.queueManager)
            .then(conn => open(conn, MQ.queueName))
            .then(handle => getMessage(handle))
            .then(mqmd => {
                console.log("Successfully received " + mqmd)
                console.log(msg)
                return mqmd
            })
    }
}