// Hapi Server
'use strict'

const Hapi = require('@hapi/hapi')
const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const BlockChain = require('./BlockChain.js')
const Block = require('./Block.js')

const init = async () => {
  const myBlockChain = new BlockChain.Blockchain()
  const server = Hapi.server({
    port: 8000,
    host: 'localhost'
  })
  // GET Block Endpoint
  server.route({
    method: 'GET',
    path:'/block/{height}',
    handler: (request, h) => {

      return myBlockChain.getBlockHeight()
      .then((height) => {
        // Check for out of bounds
        if (request.params.height >= height) {
          throw Boom.badRequest(`Block height => ${height - 1}`)
        } else {
          // Get block
          return myBlockChain.getBlock(request.params.height)
        }
      })
    },
    options: {
      validate: {
        params: {
          // Validation
          height: Joi.number().integer().min(0)
        }
      }
    }
  })

  // POST Block Endpoint
  server.route({
    method: 'POST',
    path:'/block',
    handler: (request, h) => {
      // Add new block
      return myBlockChain.addBlock(new Block.Block(request.payload.body))
    },
    options: {
      validate: {
        payload: {
          // Validation
          body: Joi.string()
        }
      }
    }
  })

  // Start server
  await server.start()
  console.log('Server running on %s', server.info.uri)
};

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
});

init();
