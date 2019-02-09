// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
//import metaCoinArtifact from '../../build/contracts/MetaCoin.json'

// Import our custom contract artifacts 
import tokensArtifact from '../../build/contracts/Tokens.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
//const MetaCoin = contract(metaCoinArtifact)

// Tokens is our usable abstractrion
const Tokens = contract(tokensArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    //MetaCoin.setProvider(web3.currentProvider)
    Tokens.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]

      self.refreshBalance()
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  setStatusMint: function (message) {
    const status = document.getElementById('statusMint')
    status.innerHTML = message
  },

  setStatusSend: function (message) {
    const status = document.getElementById('statusSend')
    status.innerHTML = message
  },

  setStatusBurn: function (message) {
    const status = document.getElementById('statusBurn')
    status.innerHTML = message
  },

  setStatusBuy: function (message) {
    const status = document.getElementById('statusBuy')
    status.innerHTML = message
  },

  setStatusContract: function (message) {
    const status = document.getElementById('statusContract')
    status.innerHTML = message
  },

  refreshBalance: function () {
    const self = this

    let token

    Tokens.deployed().then(function (instance) {
      token = instance
      return token.getName.call({ from: account })
    }).then(function (value) {
      const nameElement = document.getElementById('nameToken')
      nameElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting name; see log.')
    })

    Tokens.deployed().then(function (instance) {
      token = instance
      return token.getSymbol.call({ from: account })
    }).then(function (value) {
      const symbolElement = document.getElementById('symbolToken')
      symbolElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting symbol; see log.')
    })

    Tokens.deployed().then(function (instance) {
      token = instance
      return token.balanceOf.call(account, { from: account })
    }).then(function (value) {
      const balanceElement = document.getElementById('balanceToken')
      balanceElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting balance; see log.')
    })
  
    Tokens.deployed().then(function (instance) {
      token = instance
      return token.totalSupply.call({ from: account })
    }).then(function (value) {
      const supplyElement = document.getElementById('supplyToken')
      supplyElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting supply; see log.')
    })

    Tokens.deployed().then(function (instance) {
      token = instance
      return token.isOwner.call({ from: account })
    }).then(function (value) {
      const ownerElement = document.getElementById('isOwner')
      ownerElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting if sender is owner; see log.')
    })

    Tokens.deployed().then(function (instance) {
      token = instance
      return token.getBalance.call({ from: account })
    }).then(function (value) {
      const balanceElement = document.getElementById('getBalance')
      balanceElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting balance; see log.')
    })

    Tokens.deployed().then(function (instance) {
      token = instance
      return token.getPrice.call({ from: account })
    }).then(function (value) {
      const priceElement = document.getElementById('getPrice')
      priceElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting price; see log.')
    })

    Tokens.deployed().then(function (instance) {
      token = instance
      return token.getAddress.call({ from: account })
    }).then(function (value) {
      const addressElement = document.getElementById('getAddress')
      addressElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting address; see log.')
    })

    Tokens.deployed().then(function (instance) {
      token = instance
      return token.isStopped.call({ from: account })
    }).then(function (value) {
      const addressElement = document.getElementById('isStopped')
      addressElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting if stopped; see log.')
    })

  },

  setCoin: function () {
    const self = this
    const supply = parseInt(document.getElementById('supply').value)
    const name = document.getElementById('name').value
    const symbol = document.getElementById('symbol').value
    this.setStatus('Initiating transaction... (please wait)')
    let token
    Tokens.deployed().then(function (instance) {
      token = instance
      return token.setToken(supply, name, symbol, { from: account })
    }).then(function () {
      self.setStatus('Setting complete!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error setting coin; see log.')
    })

  },

  sendCoin: function () {
    const self = this
    const amount = parseInt(document.getElementById('amount').value)
    const receiver = document.getElementById('receiver').value
    this.setStatusSend('Initiating transaction... (please wait)')
    let token
    Tokens.deployed().then(function (instance) {
      token = instance
      return token.transfer(receiver, amount, { from: account })
    }).then(function () {
      self.setStatusSend('Transaction complete!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatusSend('Error sending coin; see log.')
    })

  },

  burnCoin: function () {
    const self = this
    const amount = parseInt(document.getElementById('amountB').value)
    this.setStatusBurn('Initiating transaction... (please wait)')
    let token
    Tokens.deployed().then(function (instance) {
      token = instance
      return token.burn(amount, { from: account })
    }).then(function () {
      self.setStatusBurn('Burn complete!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatusBurn('Error burning coin; see log.')
    })

  },

  mintCoin: function () {
    const self = this
    const amount = parseInt(document.getElementById('amountM').value)
    this.setStatusMint('Initiating transaction... (please wait)')
    let token
    Tokens.deployed().then(function (instance) {
      token = instance
      return token.mint(amount, { from: account })
    }).then(function () {
      self.setStatusMint('Mint complete!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatusMint('Error minting coin; see log.')
    })

  },

  buyCoin: function () {
    const self = this
    this.setStatusBuy('Initiating transaction... (please wait)')
    let token
    Tokens.deployed().then(function (instance) {
      const _value = parseInt(document.getElementById('amountEth').value)
      token = instance
      return token.buy({ from: account, to: accounts[0], value: _value * 1000000000000000000 })
    }).then(function () {
      self.setStatusBuy('Buy complete!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatusBuy('Error buying coin; see log.')
    })

  },

  toggleContract: function () {
    const self = this
    this.setStatusContract('Initiating circuit breaker... (please wait)')
    let token
    Tokens.deployed().then(function (instance) {
      token = instance
      return token.breaker({ from: account })
    }).then(function () {
      self.setStatusContract('Circuit breaker complete!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatusBuy('Error setting circuit breaker; see log.')
    })

  }

}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  // Refresh page if address changes
  var accountInterval = setInterval(function() {
    if (web3.eth.accounts[0] !== account) {
      account = web3.eth.accounts[0];
      window.location.reload();
    }
  }, 100);

  App.start()
})
