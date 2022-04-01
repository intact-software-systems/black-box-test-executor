# Contract validation

The command line tool `contract-check` validates consumer contracts against an openapi contract.

It supports a subset of the Pact contract, but has no relation to the Pact framework. You can simply write your contract
in a json file if you want to test it out.

Read on for installation and usage guidelines.

## Nodejs Installation

Requires Nodejs to be installed: https://nodejs.org/en/download/

Make sure the command `npm` is available in terminals (npm = node package manager). More documentation can be found
here https://docs.npmjs.com/

### Install requirements

Required npm packages. Execute these lines in a terminal:

    npm install -g @stoplight/prism-cli

Check out this git repository and from the repository root folder execute:

    npm install
    npm link

#### Upgrade the global npm packages

    npm upgrade -g

### Run the contract-check command line script

To run the the test you need a consumer contract (for example, a Pact contract) and an openapi contract.

You can download an openapi contract from an online Rest API.

Execute script:

    contract-check --contract contracts.json --openapi openapi.json

Check the terminal for status.

### Run prism mocking server separately

The contract-check script runs a prism server internally. But it is possible to run the prism server separately. Docs
here: https://stoplight.io/p/docs/gh/stoplightio/prism

The prism server takes as input an openapi contract and can then act as a mocking http server.

To start the mocking server:

    prism mock openapi.json

You can then execute the contract-check script without the openapi.json file:

    contract-check --contract contracts.json 

### Run prism as validation proxy

Prism can be used as a validation proxy, see https://meta.stoplight.io/docs/prism/docs/guides/03-validation-proxy.md.

As a validation proxy, prism forwards input and output to a URL.

For example, if we want to use prism to validate traffic to an existing Rest API we could start prism like so:

    prism proxy openapi.json http://ip.address/path/to/api/v1

You can then execute the contract-check script without the openapi.json file:

    contract-check --contract contracts.json 

### Input requirements

#### Open api contract

A valid openapi contract is required for prism to do its job. Formats supported are json and yaml.

#### Consumer contract json formats

The consumer contracts has to be in the following format (a subset of a Pact contract):

    [
        {
            request: {
                path: string,
                method: string,
                body: object,
                headers: object
            },
            response: {
                body: object
            }
        }
    ]

Example:

    [
      {
        "request": {
          "method": "POST",
          "path": "/product",
          "headers": {
            "X-Company-header": "data",
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          "body": {
            "productId": "1"
          }
        },
        "response": {
          "body": {
            "productName": "spade"
          }
        }
      }
    ]
