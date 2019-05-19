# Private Blockchain

This project was created for the Blockchain Developer Nanodegree at Udacity. It's a rather simple implementation of a private Blockchain with a RESTful API.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Download and install [Node.js](https://nodejs.org)

### Installing

* Download or clone the project
* Open Terminal
* Change the current working directory to the location the project files were saved
* Install project dependencies with the command ```npm install```

## Testing

Test functionality with the automated test or by using the API.

### API Endpoints

The project’s API service is configured to run on port 8000. The default URL is using localhost for connectivity ( http://localhost:8000 ).

* Start the server with the command ```node server.js```

#### GET Block Endpoint

**URL:** http://localhost:8000/block/{height}

**height:** Height of the block you want.

* Example

http://localhost:8000/block/0

```
{
    "hash": "20723bda4f85fc6b90dabff6248cb8d6cf0f01c7c0d2dac47f210d3df0d42bd9",
    "height": 0,
    "body": "Genesis Block",
    "time": "1558199092",
    "previousBlockHash": ""
}
```

#### POST Block Endpoint

**URL:** http://localhost:8000/block

**payload:** ```{ "body": "This is a string" }```

* Example

**payload:** ```{ "body": "My first API Block" }```

```
{
    "hash": "2fab42fc080cce92324c7e1675c11bbf31f5479334cf079a65a0f66fba65df41",
    "height": 1,
    "body": "My first API Block",
    "time": "1558199155",
    "previousBlockHash": "20723bda4f85fc6b90dabff6248cb8d6cf0f01c7c0d2dac47f210d3df0d42bd9"
}
```

### Tests

The file **simpleChain.js** has all the code to be able to test the project's functionality. By running the automated test a simple Blockchain is created and then tampered and tested.

* Run the test with the command ```node simpleChain.js```

## Built With

* [Node.js](https://nodejs.org)
* [Hapi](https://hapijs.com) - Server Framework
* [level](https://www.npmjs.com/package/level) - LevelDB wrapper for Node.js

## Authors

* **Gravvanis Dimitris**
