/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256')
const LevelSandbox = require('./LevelSandbox.js')
const Block = require('./Block.js')

class Blockchain {

  constructor() {
    this.bd = new LevelSandbox.LevelSandbox()
    this.generateGenesisBlock()
    .then(function(result) {
      console.log(result)
    })
    .catch(function(err) {
      console.log(err)
    })
  }

  // Promise => String
  // Helper method to create a Genesis Block (always with height = 0)
  generateGenesisBlock() {

    let self = this
    return new Promise(function(resolve, reject) {
      // Get block height
      self.getBlockHeight()
      .then(function(height) {
        // If blocks not exist, create Genesis Block
        if (height == 0) {
          // Create Genesis Block
          return self.addBlock(new Block.Block('Genesis Block'))
        } else {
          resolve("Genesis Block already exists.")
        }
      })
      .then(function(block) {
        resolve('Genesis Block Created.')
      })
      .catch(function(err) {
        reject(err)
      })
    })
  }

  // Promise => Number
  // Get block height, it is a helper method that
  // Return the height of the blockchain
  getBlockHeight() {
    // Add your code here
    let self = this
    return new Promise(function(resolve, reject) {
      self.bd.getBlocksCount()
      .then(function(result) {
        resolve(result)
      })
      .catch(function(err) {
        reject(err)
      })
    })
  }

  // Promise => Block Object
  // Adds new block to the chain
  // Returns block object
  addBlock(newBlock) {

    let self = this
    return new Promise(function(resolve, reject) {
      // Get chain height
      self.getBlockHeight()
      .then(function(height) {
        // Configure new block height
        newBlock.height = height
        // Configure new block UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0,-3)
        // Get previous block
        return self.bd.getLevelDBData(height - 1)
      })
      .then(function(block) {
        if (block) {
          // Configure new block previous block hash
          newBlock.previousBlockHash = block.hash
        } else {
          // Configure new block previous block hash
          newBlock.previousBlockHash = ''
        }
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString()
        // Add block to level db
        return self.bd.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString())
      })
      .then(function() {
        resolve(newBlock)
      })
      .catch(function(err) {
        reject(err)
      })
    })
  }

  // Promise => Block Object
  // Get Block By Height
  // Returns block object or null.
  getBlock(height) {
    // Add your code here
    let self = this
    // Return promise
    return new Promise(function(resolve, reject) {
      // Get block
      self.bd.getLevelDBData(height)
      .then(function(result) {
        resolve(result)
      })
      .catch(function(err) {
        reject(err)
      })
    })
  }

  // Promise => Bool
  // Validates block
  // Returns true if block is valid.
  validateBlock(height) {

    let self = this
    return new Promise(function(resolve, reject) {
      // Get block
      self.getBlock(height)
      .then(function(result) {
        // Block to be validated
        let block = result
        // Block hash
        let blockHash = block.hash
        // Remove hash
        block.hash = ''
        // Generate new hash
        let validHash = SHA256(JSON.stringify(block)).toString()
        // Validate
        if (blockHash === validHash) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      .catch(function(err) {
        reject(err)
      })
    })
  }

  // Promise => []
  // Validates Blockchain
  validateChain() {

    let self = this
    return new Promise(function(resolve, reject) {
      // Array to log the errors
      let errorLog = []
      // Get chain length
      self.getBlockHeight()
      .then(function(height) {
        let promiseArray = []
        // Validate each individual block
        for (var i = 0; i < height - 1; i++) {
          promiseArray.push(self.validateBlock(i))
        }
        return Promise.all(promiseArray)
      })
      .then(function(result) {
        // Log errors from block validation
        for (var i = 0; i < result.length; i++) {
          if (result[i] == false) {
            errorLog.push(`Block ${i} is not valid.`)
          }
        }
        // Validate links between blocks
        let promiseArray = []
        for (var i = 0; i < result.length - 1; i++) {
          promiseArray.push(self.validateLink(i))
        }
        return Promise.all(promiseArray)
      })
      .then(function(result) {
        // Log errors from block links
        for (var i = 0; i < result.length; i++) {
          if (result[i] == false) {
            errorLog.push(`Link between blocks ${i} and ${i + 1} is not valid.`)
          }
        }
        // Resolve with error logs
        if (errorLog.length > 0) {
          resolve(errorLog)
        } else {
          resolve(errorLog)
        }
      })
      .catch(function(err) {
        reject(err)
      })
    })
  }

  // Promise => Bool
  // Validates link between block at height and next block.
  // Returns true if link is valid.
  validateLink(height) {

    let self = this
    return new Promise(function(resolve, reject) {
      let blockHash = ''
      // Get block
      self.getBlock(height)
      .then(function(block) {
        blockHash = block.hash
        // Get next block
        return self.getBlock(height + 1)
      })
      .then(function(nextBlock) {
        // Compare hashes
        if (nextBlock.previousBlockHash !== blockHash) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
      .catch(function(err) {
        reject(err)
      })
    })
  }

  // Utility Method to Tamper a Block for Test Validation
  // This method is for testing purpose
  _modifyBlock(height, block) {
    let self = this
    return new Promise( (resolve, reject) => {
      self.bd.addLevelDBData(height, JSON.stringify(block).toString())
      .then((blockModified) => {
        resolve(blockModified)
      })
      .catch((err) => {
        console.log(err); reject(err)
      })
    })
  }
}

module.exports.Blockchain = Blockchain
