var Tokens = artifacts.require('./Tokens.sol')

var balanceContract = -1; //Cost of gas

contract('Tokens', function (accounts) {

    it('should put 100000 Tokens in the first account', function () {
      return Tokens.deployed().then(function (instance) {
        return instance.balanceOf.call(accounts[0])
      }).then(function (balance) {
        assert.equal(balance.valueOf(), 100000, "100000 wasn't in the first account")
      })
    })

    it('should be 100000 Tokens as total supply', function () {
        return Tokens.deployed().then(function (instance) {
          return instance.totalSupply.call()
        }).then(function (balance) {
          assert.equal(balance.valueOf(), 100000, "100000 wasn't the total supply")
        })
    })

    it('should be RicToken as token name', function () {
        return Tokens.deployed().then(function (instance) {
          return instance.getName.call()
        }).then(function (name) {
          assert.equal(name.valueOf(), "RicToken", "RicToken wasn't the token name")
        })
    })

    it('should be RIC as token symbol', function () {
        return Tokens.deployed().then(function (instance) {
          return instance.getSymbol.call()
        }).then(function (name) {
          assert.equal(name.valueOf(), "RIC", "RIC wasn't the token symbol")
        })
    })

  
    it('should send tokens correctly', function () {
      var token
  
      // Get initial balances of first and second account.
      var accountOne = accounts[0]
      var accountTwo = accounts[1]
  
      var accountOneStartingBalance
      var accountTwoStartingBalance
      var accountOneEndingBalance
      var accountTwoEndingBalance
  
      var amount = 100
  
      return Tokens.deployed().then(function (instance) {
        token = instance
        return token.balanceOf.call(accountOne)
      }).then(function (balance) {
        accountOneStartingBalance = balance.toNumber()
        return token.balanceOf.call(accountTwo)
      }).then(function (balance) {
        accountTwoStartingBalance = balance.toNumber()
        return token.transfer(accountTwo, amount, { from: accountOne })
      }).then(function () {
        return token.balanceOf.call(accountOne)
      }).then(function (balance) {
        accountOneEndingBalance = balance.toNumber()
        return token.balanceOf.call(accountTwo)
      }).then(function (balance) {
        accountTwoEndingBalance = balance.toNumber()
  
        assert.equal(
          accountOneEndingBalance,
          accountOneStartingBalance - amount,
          "Amount wasn't correctly taken from the sender"
        )
        assert.equal(
          accountTwoEndingBalance,
          accountTwoStartingBalance + amount,
          "Amount wasn't correctly sent to the receiver"
        )
      })
    })

    it('should buy tokens correctly', function () {
      var token
  
      // Get initial balances of first and second account.
      var accountOne = accounts[0]
      var accountTwo = accounts[2]
  
      var accountOneStartingBalance
      var accountTwoStartingBalance
      var accountOneEndingBalance
      var accountTwoEndingBalance
  
      var amount = 3
      var conversion
      var balanceOld = balanceContract
  
      return Tokens.deployed().then(function (instance) {
        token = instance
        return token.balanceOf.call(accountOne)
      }).then(function (balance) {
        accountOneStartingBalance = balance.toNumber()
        return token.balanceOf.call(accountTwo)
      }).then(function (balance) {
        accountTwoStartingBalance = balance.toNumber()
        return token.buy({ from: accountTwo, to: accountOne, value: amount * 1000000000000000000 })
      }).then(function () {
        return token.balanceOf.call(accountOne)
      }).then(function (balance) {
        accountOneEndingBalance = balance.toNumber()
        return token.balanceOf.call(accountTwo)
      }).then(function (balance) {
        accountTwoEndingBalance = balance.toNumber()
        return token.getPrice.call()
      }).then(function (price) {
        conversion = price.toNumber() * amount
        return token.getBalance.call()
      }).then(function (balance) {
        balanceContract = balance.toNumber()
  
        assert.equal(
          accountOneEndingBalance,
          accountOneStartingBalance - conversion,
          "Buying: Amount in Token wasn't correctly taken from the sender"
        )
        assert.equal(
          accountTwoEndingBalance,
          accountTwoStartingBalance + conversion,
          "Buying: Amount in Token wasn't correctly sent to the receiver"
        )
        assert.equal(
          balanceContract,
          amount + balanceOld,
          "Buying: Amount in ETH wasn't correctly sent to the contract"
        )  
      })
    })

    it('should buy tokens correctly, though fallback function', function () {
      var token
  
      // Get initial balances of first and second account.
      var accountOne = accounts[0]
      var accountTwo = accounts[3]
  
      var accountOneStartingBalance
      var accountTwoStartingBalance
      var accountOneEndingBalance
      var accountTwoEndingBalance
  
      var amount = 2
      var conversion
      var balanceOld = balanceContract
  
      return Tokens.deployed().then(function (instance) {
        token = instance
        return token.balanceOf.call(accountOne)
      }).then(function (balance) {
        accountOneStartingBalance = balance.toNumber()
        return token.balanceOf.call(accountTwo)
      }).then(function (balance) {
        accountTwoStartingBalance = balance.toNumber()
        return token.sendTransaction({ from: accountTwo, to: accountOne, value: amount * 1000000000000000000 })
      }).then(function () {
        return token.balanceOf.call(accountOne)
      }).then(function (balance) {
        accountOneEndingBalance = balance.toNumber()
        return token.balanceOf.call(accountTwo)
      }).then(function (balance) {
        accountTwoEndingBalance = balance.toNumber()
        return token.getPrice.call()
      }).then(function (price) {
        conversion = price.toNumber() * amount
        return token.getBalance.call()
      }).then(function (balance) {
        balanceContract = balance.toNumber()
  
        assert.equal(
          accountOneEndingBalance,
          accountOneStartingBalance - conversion,
          "Sending transaction: Amount in Token wasn't correctly taken from the sender"
        )
        assert.equal(
          accountTwoEndingBalance,
          accountTwoStartingBalance + conversion,
          "Sending transaction: Amount in Token wasn't correctly sent to the receiver"
        )
        assert.equal(
          balanceContract,
          amount + balanceOld,
          "Sending transaction: Amount in ETH wasn't correctly sent to the contract"
        )  
      })
    })


    it('should mint tokens correctly', function () {
        var token
        // Get initial and final supply.
        var startingSupply
        var endingSupply

        var amount = 1000
    
        return Tokens.deployed().then(function (instance) {
          token = instance
          return token.totalSupply.call()
        }).then(function (supply) {
          startingSupply = supply.toNumber()
          return token.mint(amount)
        }).then(function () {
          return token.totalSupply.call()
        }).then(function (supply) {
          endingSupply = supply.toNumber()
    
          assert.equal(
            endingSupply,
            startingSupply + amount,
            "Amount wasn't correctly taken from the sender"
          )
        })
      })

      it('should burn tokens correctly', function () {
        var token
        // Get initial and final supply.
        var startingSupply
        var endingSupply

        var amount = 1000
    
        return Tokens.deployed().then(function (instance) {
          token = instance
          return token.totalSupply.call()
        }).then(function (supply) {
          startingSupply = supply.toNumber()
          return token.burn(amount)
        }).then(function () {
          return token.totalSupply.call()
        }).then(function (supply) {
          endingSupply = supply.toNumber()
    
          assert.equal(
            endingSupply,
            startingSupply - amount,
            "Amount wasn't correctly taken from the sender"
          )
        })
      })

      it('should stop contract', function () {
        var token
        return Tokens.deployed().then(function (instance) {
          token = instance
          return token.breaker.call()
        }).then(function (stopped) {
          return token.isStopped.call() 

          assert.equal(stopped.valueOf(), "true", "contract wasn't sttoped")
        })
    })

  })
  