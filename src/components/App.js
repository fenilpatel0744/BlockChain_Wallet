import React, { Component } from "react";
import daiLogo from "../dai-logo.png";
import "./App.css";
import Web3 from "web3";
import DaiTokenMock from "../abis/DaiTokenMock.json";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    console.log(accounts);
    //const daiTokenAddress = "0x7b729B07EcBDEd8879Acf997aAF6546926982830" // Replace DAI Address Here
    //address imported from abis -> DaiTokenMock.json -> 1221 line
    const daiTokenAddress = "0xcc202dcCaC10B9288c9470300F8E1Dfe09ED9105";
    const daiTokenMock = new web3.eth.Contract(
      DaiTokenMock.abi,
      daiTokenAddress
    );
    this.setState({ daiTokenMock: daiTokenMock });
    const balance = await daiTokenMock.methods
      .balanceOf(this.state.account)
      .call();
    console.log(balance.toString());
    this.setState({ balance: web3.utils.fromWei(balance.toString(), "Ether") });
    const transactions = await daiTokenMock.getPastEvents("Transfer", {
      fromBlock: 0,
      toBlock: "latest",
      filter: { from: this.state.account },
    });
    this.setState({ transactions: transactions });
    console.log(transactions);
  }

  transfer(recipient, amount) {
    this.state.daiTokenMock.methods
      .transfer(recipient, amount)
      .send({ from: this.state.account });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      daiTokenMock: null,
      balance: 0,
      transactions: [],
    };

    this.transfer = this.transfer.bind(this);
  }

  render() {
    return (
      <div>
      
        {/* <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            Blockchain Wallet
        </nav> */}
        <div class="h3">
        <h3 class="text-center mt-4 mb-4">Blockchain Wallet</h3>
        </div>
        <div
          class="card mx-auto"
          style={{
            width: "24rem",
            border: "1px solid black",
            display: "block",
          }}
        >
          <div class="img1">
          <img
            src={daiLogo}
            style={{ width: "130px", display: "block" }}
            class="card-img-top mx-auto mt-4"
            alt="..."
          ></img>
          </div>
          <div class="card-body">
            <h1 class="text-center" style={{fontSize: "20px"}}>Account Number</h1>
          <h1 class="text-center mt-3 mb-4" style={{fontSize: "15px", color: "chocolate"}}>{this.state.account}</h1>
            <h1 class="text-center mb-4">{this.state.balance} DAI</h1>
            <p class="card-text"></p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const recipient = this.recipient.value;
                const amount = window.web3.utils.toWei(
                  this.amount.value,
                  "Ether"
                );
                this.transfer(recipient, amount);
              }}
            >
              {/* <div className="form-group mr-sm-2">
                <input
                  id="recipient"
                  type="text"
                  ref={(input) => {
                    this.recipient = input;
                  }}
                  className="form-control"
                  placeholder="Recipient Address"
                  required
                />
              </div>
              <div className="form-group mr-sm-2">
                <input
                  id="amount"
                  type="text"
                  ref={(input) => {
                    this.amount = input;
                  }}
                  className="form-control"
                  placeholder="Amount"
                  required
                />
              </div> */}
              <div class="form-group mb-2">
                <input
                  type="text"
                  class="form-control"
                  id="recipient"
                  placeholder="Recipient Address"
                  ref={(input) => {
                    this.recipient = input;
                  }}
                ></input>
                <label for="RecipientAddress"></label>
              </div>
              <div class="form-group">
                <input
                  type="text"
                  class="form-control"
                  id="amount"
                  placeholder="Amount"
                  ref={(input) => {
                    this.amount = input;
                  }}
                ></input>
                <label for="amount"></label>
              </div>
              <div class="text-center mx-auto mt-4 mb-4">
              <button type="submit" className="btn btn-primary ">
                Send
              </button>
              </div>
            </form>
          </div>
        </div>
        <div class="h3">
        <h3 class="text-center mt-5">History</h3>
        </div>
        <div className="container mt-3 mb-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div
                className="content mr-auto ml-auto"
                style={{ width: "500px", marginLeft: "auto", marginRight: "auto" }}
              >
                {/* <img src={daiLogo} width="130" />
                <h1>{this.state.balance} DAI</h1> */}
                {/* <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const recipient = this.recipient.value;
                    const amount = window.web3.utils.toWei(
                      this.amount.value,
                      "Ether"
                    );
                    this.transfer(recipient, amount);
                  }}
                >
                  <div className="form-group mr-sm-2">
                    <input
                      id="recipient"
                      type="text"
                      ref={(input) => {
                        this.recipient = input;
                      }}
                      className="form-control"
                      placeholder="Recipient Address"
                      required
                    />
                  </div>
                  <div className="form-group mr-sm-2">
                    <input
                      id="amount"
                      type="text"
                      ref={(input) => {
                        this.amount = input;
                      }}
                      className="form-control"
                      placeholder="Amount"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Send
                  </button>
                </form> */}
                <table className="table table-bordered">
                  <thead class="table-dark">
                    <tr>
                      <th scope="col">Recipient</th>
                      <th scope="col">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.transactions.map((tx, key) => {
                      return (
                        <tr key={key}>
                          <td>{tx.returnValues.to}</td>
                          <td>
                            {window.web3.utils.fromWei(
                              tx.returnValues.value.toString(),
                              "Ether"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
