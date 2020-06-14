import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content">
      <div>
      <h1>Welcome Agent!</h1>
        <p>Your account {this.props.account} has been verified as an Agent.</p>
        </div>
        <h1>Add Gun</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          const sno = this.productName.value
          const reason = this.productReason.value
          this.props.createProduct(name, price, reason)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Gun Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Gun Price"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productReason"
              type="text"
              ref={(input) => { this.productReason = input }}
              className="form-control"
              placeholder="Reason"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Gun</button>
        </form>
        <p>&nbsp;</p>
        <h2>Buy Gun</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col">Serial No.</th>
              <th scope="col">Reason</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.props.products.map((product, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                  <td>{product.owner}</td>
                  <td>{product.sno.toString()}</td>
                  <td>{product.reason}</td>
                  <td>
                    { !product.purchased
                      ? <button
                          name={product.id}
                          value={product.price}
                          onClick={(event) => {
                            this.props.purchaseProduct(event.target.name, event.target.value)
                          }}
                        >
                          Buy
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;




