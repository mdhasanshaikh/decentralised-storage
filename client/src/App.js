//import default
import "./App.css";
import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";

import metamaskLogo from "./asserts/metamask-logo.png";
import User from "./content-section/users/user";

class App extends Component {
  state = {
    isPopupVisible: false,
  };

  handleModalVisibility = () => {
    let isPopupVisible = this.state.isPopupVisible;
    this.setState({
      isPopupVisible: !isPopupVisible,
    });
  };

  handleLoginBtnClick = async () => {
    try {
      const web3 = await getWeb3();
      // Using web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  render() {
    return (
      <React.Fragment>
        <User />
        {/* <div className="App">
          <nav>
            <div className="logo">Logo</div>
            <button onClick={() => this.handleModalVisibility()}>Login</button>
          </nav>
        </div>
        {this.state.isPopupVisible ? (
          <div className="modal-container">
            <div
              className="background-blur"
              onClick={() => this.handleModalVisibility()}
            />
            <div className="modal">
              <h3 className="title">Sign in</h3>
              <h4 className="sub-title">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                nulla erat, iaculis vel justo eget, dictum accumsan elit.
                Vivamus suscipit vitae velit sollicitudin varius.
              </h4>
              <div className="content-section">
                <div className="metamask-logo">
                  <img src={metamaskLogo} alt="MetaMask-logo" />
                  <div>MetaMask</div>
                </div>
                <button className="" onClick={() => this.handleLoginBtnClick()}>
                  Sign in
                </button>
              </div>
            </div>
          </div>
        ) : null} */}
      </React.Fragment>
    );
  }
}

export default App;

//

// <button>Hello</button>
