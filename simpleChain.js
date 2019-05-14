/* ===== Executable Test ==================================
|  Use this file to test your project.
|  =========================================================*/

const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');

let myBlockChain = new BlockChain.Blockchain();


setTimeout(function () {
	//myBlockChain.bd.deleteAllData()
	console.log('Waiting...')
}, 100);

/******************************************
 ** Function for Create Tests Blocks   ****
 ******************************************/

 setTimeout(function () {
	 (function theLoop(i) {
 		setTimeout(function() {
 			let blockTest = new Block.Block('Test Block - ' + (i + 1))
 			// Be careful this only will work if your method 'addBlock' in the Blockchain.js file return a Promise
 			myBlockChain.addBlock(blockTest)
 			.then(function(result) {
				console.log(result)
 				i++
 				if (i < 10) theLoop(i)
 			})
 			.catch(function(err) {
 				console.log(err)
 			})
 		}, 1000)
 	})(0)
 }, 2000);

/***********************************************
 ** Function to get the Height of the Chain ****
 ***********************************************/

 setTimeout(function () {
	 // Be careful this only will work if `getBlockHeight` method in Blockchain.js file return a Promise
	 myBlockChain.getBlockHeight()
	 .then((height) => {
	 		console.log('The height of the chain is ' + height + '.')
	 })
	 .catch((err) => {
		 console.log(err)
	 })
 }, 22000);

/***********************************************
 ******** Function to Get a Block  *************
 ***********************************************/

 setTimeout(function () {
	 // Be careful this only will work if `getBlock` method in Blockchain.js file return a Promise
	 myBlockChain.getBlock(0)
	 .then((block) => {
		 console.log(JSON.stringify(block))
	 })
	 .catch((err) => {
		 console.log(err)
	 })
 }, 23000);


/***********************************************
 ***************** Validate Block  *************
 ***********************************************/

 setTimeout(function () {
	 // Be careful this only will work if `validateBlock` method in Blockchain.js file return a Promise
	 myBlockChain.validateBlock(0).then((valid) => {
	 	console.log(valid);
	 })
	 .catch((error) => {
	 	console.log(error);
	 })
 }, 24000);

/** Tampering a Block this is only for the purpose of testing the validation methods */

setTimeout(function () {
	myBlockChain.getBlock(5).then((block) => {
		let blockAux = block
		blockAux.body = 'Tampered Block'
		myBlockChain._modifyBlock(blockAux.height, blockAux)
		.then((blockModified) => {
			console.log(`Block #${blockAux.height} was modified.`)
			if (blockModified) {
				myBlockChain.validateBlock(blockAux.height)
				.then((valid) => {
					console.log(`Is #${blockAux.height} valid? => ${valid}`);
				})
				.catch((error) => {
					console.log(error);
				})
			} else {
				console.log('The Block was not modified')
			}
		})
		.catch((err) => {
			console.log(err)
		})
	})
	.catch((err) => {
		console.log(err)
	})
}, 25000);

setTimeout(function () {
	myBlockChain.getBlock(6)
	.then((block) => {
		let blockAux = block
		blockAux.previousBlockHash = 'jndininuud94j9i3j49dij9ijij39idj9oi'
		myBlockChain._modifyBlock(blockAux.height, blockAux)
		.then((blockModified) => {
			if(blockModified){
				console.log(`Block #${blockAux.height} was modified`)
			} else {
				console.log('The Block was not modified')
			}
		})
		.catch((err) => {
			console.log(err)
		})
	})
	.catch((err) => {
		console.log(err)
	})
}, 27000);

/***********************************************
 ***************** Validate Chain  *************
 ***********************************************/

setTimeout(function () {
	// Be careful this only will work if `validateChain` method in Blockchain.js file return a Promise
	myBlockChain.validateChain()
	.then((errorLog) => {
		if(errorLog.length > 0) {
			console.log('The chain is not valid:')
			errorLog.forEach(error => { console.log(error) })
		} else {
			console.log('No errors found, The chain is Valid!')
		}
	})
	.catch((error) => {
		console.log(error)
	})
}, 29000);
