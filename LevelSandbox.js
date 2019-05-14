/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level')
const chainDB = './chaindata'

class LevelSandbox {

  constructor() {
    this.db = level(chainDB)
  }

  // Promise => Block Object
  // Get data from levelDB with key
  // Returns Block Object or null
  getLevelDBData(key) {

    let self = this
    // Return promise
    return new Promise(function(resolve, reject) {
      // Get block
      self.db.get(key, function(err, value) {
        // If block not found resolve with null
        if (err instanceof level.errors.NotFoundError) {
          resolve(null)
        //} else if (err instanceof level.errors.LevelUPError) {
          //console.log(err);
          //reject(err)
        } else {
          resolve(JSON.parse(value))
        }
      })
    })
  }

  // Promise
  // Add data to levelDB with key and value
  addLevelDBData(key, value) {

    let self = this
    return new Promise(function(resolve, reject) {
        self.db.put(key, value, function(err) {
          if (err) {
            reject(console.log('Ooops!', err))
          } else {
            resolve(value, console.log('Block '+ key +' SAVED '+' => '))
          }
        })
    })
  }

  // Promise => Number
  // Returns the height of the chain
  getBlocksCount() {

    let self = this
    return new Promise(function(resolve, reject) {
      let dataArray = []
      self.db.createReadStream()
      .on('data', function (data) {
        dataArray.push(data)
      })
      .on('error', function (err) {
        reject(console.log('Ooops!', err))
      })
      .on('close', function () {
        resolve(dataArray.length)
      })
    })
  }

  // Promise
  // Deletes all data from storage
  deleteAllData() {

    let self = this
    self.getBlocksCount()
    .then(function(result) {

      let ops = []
      let i = 0
      while (i < result) {
        ops.push({ type: 'del', key: i })
        i++
      }
      return new Promise(function(resolve, reject) {
        self.db.batch(ops, function(err) {
          if (err) return reject(console.log('Ooops!', err))
          resolve(console.log('All Blocks Were Deleted'))
        })
      })
    })
  }
}

module.exports.LevelSandbox = LevelSandbox
