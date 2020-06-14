import React, { Component } from 'react';
import Web3 from 'web3'
import logo from '../logo.png';
import './App.css';
// import Authorized from './Authorized'
import Unauthorized from './Unauthorized'
import Guns from '../abis/Guns.json'
import Main from './Main'



class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.fetchAccount()
    await this.checkAuthorization()
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async fetchAccount() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
  }

  async checkAuthorization() {
    const authorizedAccounts = [
      '0xA3E53F1047cA1b376F7Aba9cbB96B586f1536Ec8',
      '0xAE2f34aEead72Bfd46138A4E662FE284F9a4DB43',
      '0x1E2418fe04D20cD7eE6A91A3AD1d299fa8c9e20c',
      '0x8A97d72B4c823d96f18d76bA668e2a5CDcAC95Af',
      '0x719C632328eB541183F34C5c616ac359E828ec21'
    ]
    const authorized = authorizedAccounts.includes(this.state.account)
    this.setState({ authorized })
  }


  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Guns.networks[networkId]
    if(networkData) {
      const guncontrol = web3.eth.Contract(Guns.abi, networkData.address)
      this.setState({ guncontrol })
      const productCount = await guncontrol.methods.productCount().call()
      this.setState({ productCount })
      // Load products
      for (var i = 1; i <= productCount; i++) {
        const product = await guncontrol.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false})
    } else {
      window.alert('GunControl contract not deployed to detected network.')
    }
  }



  constructor(props) {
    super(props)
    this.state = {
      account: '',
      authorized: false,
      productCount: 0,
      products: [],
      loading: true
    }

    this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)
  }


  createProduct(name, price, reason) {
    this.setState({ loading: true })
    this.state.guncontrol.methods.createProduct(name, price, reason).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  purchaseProduct(id, price) {
    this.setState({ loading: true })
    this.state.guncontrol.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  render() {
    let body

    if (this.state.authorized) { 
                
              
      body = <Main account={this.state.account}
                  products={this.state.products}
                  createProduct={this.createProduct}
                  purchaseProduct={this.purchaseProduct}
                         />
    } else {
      body = <Unauthorized account={this.state.account} />
    }

    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gun Monitoring
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {body}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
