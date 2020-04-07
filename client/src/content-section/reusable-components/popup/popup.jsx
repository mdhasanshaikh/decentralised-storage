import React, { Component } from "react";
import "./popup.css";

import DropdownMenu from "../input/dropdown-menu/dropdown-menu";
import TextBtn from "../button/text-btn/text-btn";

import successIcon from "../../../asserts/success-icon-green.png";

class Popup extends Component {
  state = {};

  componentWillMount = () => {
    if (this.props.step === "processing") {
      console.log("heloo");
    }

    // if (this.props.step === "processing") {
    //   if (this.props.uploadProcess.connectToMetaMask === "process") {
    //     await this.props.handleMetaMaskConnection();
    //   } else if (this.props.uploadProcess.confirmationPayment === "process") {
    //     await this.props.handleFileUpload();
    //   } else if (this.props.uploadProcess.confirmationGas === "process") {
    //     await this.props.handleFileUpload();
    //   } else if (this.props.uploadProcess.uploading === "process") {
    //     await this.props.handleFileUpload();
    //   } else {
    //     console.log("done");
    //   }
    // }
  };

  getCurentStatus = (processName, status) => {
    if (status === "pending") {
      return <div className="in-process">Waiting</div>;
    } else if (status === "process") {
      return <div className="in-process">In Transit</div>;
    } else if (status === "complete") {
      return (
        <div>
          <img src={successIcon} alt="complete" />
        </div>
      );
    } else {
      return (
        <div>
          <button
            onClick={() => {
              if (processName === "connect metamask") {
                this.props.handleMetaMaskConnection();
              } else if (processName === "file payment") {
                this.props.handleFilePayment();
              } else if (processName === "file upload") {
                this.props.handleFileUpload();
              } else if (processName === "gas payment") {
                this.props.handleGasPayment();
              }
            }}>
            Retry
          </button>
        </div>
      );
    }
  };

  getContent = () => {
    const step = this.props.step;
    if (step === "transaction") {
      return (
        <div className="transaction-detail-section">
          <div className="file-detail-section">
            <div className="file-detail">
              <div className="title">File Information</div>
              <div className="detail-item">
                <div>File Name</div>
                <div>{this.props.file.name}</div>
              </div>
              <div className="detail-item">
                <div>Size</div>
                <div>{this.props.file.size}</div>
              </div>
              <div className="detail-item">
                <div>Type</div>
                <div>{this.props.file.type}</div>
              </div>
            </div>
            <div className="another-file">
              <div>Would you like to change File?</div>
              <div className="button">
                <label htmlFor="new-file">New File</label>
                <input
                  type="file"
                  name="new-file"
                  onChange={this.props.handleFileChange}
                />
                {/* <button>New File</button> */}
              </div>
            </div>
          </div>
          <div className="payment-detail-section">
            <div className="title">Payment Detail</div>
            <div className="detail-item">
              <div>Net Payable</div>
              <div className="fees-container">
                <div className="netpayable">
                  <div>{this.props.file.netpayable}</div>
                  <div>ETH</div>
                </div>
                <div className="sum-all-fees">{/* < */}</div>
              </div>
            </div>
            <div className="detail-item">
              <div className="account-label">
                <div>From</div>
              </div>
              <div className="dropdown-container">
                <DropdownMenu
                  dropdownMenu={this.props.dropdownMenu}
                  toggleDropdownMenu={this.props.toggleDropdownMenu}
                  handleDropdownItemClick={this.props.handleDropdownItemClick}
                />
                {this.props.dropdownMenu.selectedAcc.balance <
                this.props.file.netpayable ? (
                  <div />
                ) : (
                  <img src={successIcon} alt="success" />
                )}
                {this.props.dropdownMenu.selectedAcc.balance >
                this.props.file.netpayable ? null : (
                  <div className="error-msg">
                    Sorry, choosen account has insufficient balance for this
                    transaction. Please choose another account or else you can
                    add moneny to this account then continue the transaction.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="button-section">
            {this.props.button.map((button) => {
              if (button.label === "Proceed") {
                return (
                  <TextBtn
                    button={button}
                    key={button.id}
                    handleBtnClick={this.props.handlePopupProceed}
                  />
                );
              } else {
                return (
                  <TextBtn
                    button={button}
                    key={button.id}
                    handleBtnClick={this.props.handlePopupClose}
                  />
                );
              }
            })}
          </div>
        </div>
      );
    } else if (step === "processing") {
      // setTimeout(this.checkProps(), 500);
      return (
        <div className="process-section">
          <div className="row-title">
            <div>Processes</div>
            <div>Status</div>
          </div>
          <div className="row-item">
            <div>Connecting to MetaMask</div>
            {this.getCurentStatus(
              "connect metamask",
              this.props.uploadProcess.connectToMetaMask
            )}
          </div>
          <div className="row-item">
            <div>Confirmation of Transaction on MetaMask to store the file</div>
            {this.getCurentStatus(
              "file payment",
              this.props.uploadProcess.confirmationPayment
            )}
          </div>
          <div className="row-item">
            <div>Uploading your File</div>
            {this.getCurentStatus(
              "file upload",
              this.props.uploadProcess.uploading
            )}
          </div>
          <div className="row-item">
            <div>
              Confirmation of Charges on MetaMask to store the transaction
              details
            </div>
            {this.getCurentStatus(
              "gas payment",
              this.props.uploadProcess.confirmationGas
            )}
          </div>
        </div>
      );
    }
  };

  getPopupboxTitle = () => {
    const step = this.props.step;
    if (step === "transaction") {
      return "Upload File";
    } else if (step === "processing") {
      return "Uploading the File";
    }
  };

  render() {
    return (
      <div className="popup">
        <div
          className="background-blur"
          onClick={
            this.props.step === "transaction"
              ? this.props.handlePopupClose
              : null
          }
        />
        <div className="popup-box">
          <div className="top-section">
            <div className="title">{this.getPopupboxTitle()}</div>
          </div>
          <div className="content-section">{this.getContent()}</div>
        </div>
      </div>
    );
  }
}

export default Popup;
