# Execute scenario

The command line tools `scenario-execute` and `scenario-black-box-execute` runs an array of requests in sequence.

Read on for installation and usage guidelines.

## Nodejs Installation

Requires Nodejs to be installed: https://nodejs.org/en/download/

Make sure the command `npm` is available in terminals (npm = node package manager). More documentation can be found
here https://docs.npmjs.com/

```shell
npm upgrade -g
````    

### Install requirements

Clone git repository

```shell
git clone https://github.com/intact-software-systems/black-box-test-tool.git
```

In cloned folder execute:

```shell
npm install
npm link
```

### Run the scenario-execute command line script

Start a Rest API server and make sure you can access it. For example

```shell
http://localhost:8080
```

Run the the example test scenario:

```shell
scenario-execute -s ./test-data/scenario.json

scenario-black-box-execute -s ./test-data/scenario.json
```

Check the terminal for status.

### Input Scenario json file

The scenario file should be in the following format:

```json
[
  {
    "HTTP": {
      "request": {
        "path": "string",
        "method": "string",
        "body": "object",
        "headers": "object"
      },
      "response": {
        "body": {
        },
        "statusCode": "200"
      }
    }
  }
]
```

### Future work

Support MQ:

https://github.com/ibm-messaging/mq-mqi-nodejs/blob/master/samples/amqsconn.js

