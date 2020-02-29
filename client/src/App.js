//import default
import "./App.css";
import React, { Component } from "react";

//import components
import Sidebar from "./side-bar/sidebar";
import FileSection from "./content-section/file-section/file-section";
import TransactionSection from "./content-section/transaction-section/transaction-section";
import FeedbackSection from "./content-section/feedback-section/feedback-section";
import Popup from "./reusable-components/popup/popup";

//import packages
import SolidityDriveContract from "./contracts/SolidityDrive.json";
import getWeb3 from "./utils/getWeb3";
import fileReaderPullStream from "pull-file-reader";
import ipfs from "./utils/ipfs";
import mimeTypes from "mime-types";
import Moment from "react-moment";
import fetch from "node-fetch";
import axios from "axios";

//import asserts
import fileIconOutline from "./asserts/side-bar/file-icon-outline.png";
import fileIconFilled from "./asserts/side-bar/file-icon-filled.png";
import walletIconOutline from "./asserts/side-bar/wallet-icon-outline.png";
import walletIconFilled from "./asserts/side-bar/wallet-icon-filled.png";
import feedbackIconOutline from "./asserts/side-bar/feedback-icon-outline.png";
import feedbackIconFilled from "./asserts/side-bar/feedback-icon-filled.png";

// var crypto = require("crypto");
// var fs = require("fs");
// var CryptoJS = require("crypto-js");
// const FileDownload = require("js-file-download");

class App extends Component {
  state = {
    solidityDrive: [],
    web3: null,
    accounts: null,
    contract: null,
    encryptFile: {},
    //initialiaing parameter
    cryptoParams: {
      hash: "SHA-512",
      algoName1: "PBKDF2",
      algoName2: "AES-GCM",
      algoLength: 256,
      itr: 80000,
      salt: window.crypto.getRandomValues(new Uint8Array(16)),
      perms1: ["deriveKey"],
      perms2: ["encrypt", "decrypt"]
    },

    //navigation components params
    tabBtn: [
      {
        id: 1,
        name: "file",
        active: true,
        imgSrc: [fileIconFilled, fileIconOutline]
      },
      {
        id: 2,
        name: "wallet",
        active: false,
        imgSrc: [walletIconFilled, walletIconOutline]
      },
      {
        id: 3,
        name: "feedback",
        active: false,
        imgSrc: [feedbackIconFilled, feedbackIconOutline]
      }
    ],

    //acc components params
    dropdownMenu: {
      id: 1,
      name: "account",
      dropdownActive: false,
      selectedAcc: {
        id: 1,
        value: "0x0591c3661c044427fBA199124cBEB745116432D8",
        balance: 23.5,
        active: true
      },
      dropdown: [
        {
          id: 1,
          value: "0x0591c3661c044427fBA199124cBEB745116432D8",
          balance: 23.5,
          active: true
        },
        {
          id: 2,
          value: "0x0591c3661c044427fBA199124cBEB745116432D7",
          balance: 0,
          active: false
        },
        {
          id: 3,
          value: "0x0591c3661c044427fBA199124cBEB745116432D6",
          balance: 12,
          active: false
        }
      ]
    },

    button: [
      { id: 1, label: "Proceed", type: "primary" },
      { id: 2, label: "Cancel", type: "secondary" }
    ],
    step: "none",
    uploadProcess: {
      connectToMetaMask: "pending",
      confirmationPayment: "pending",
      confirmationGas: "pending",
      uploading: "pending"
    },
    file: {}
  };

  str2ab = str => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);

    for (let index = 0, strLen = str.length; index < strLen; index++) {
      bufView[index] = str.charCodeAt(index);
    }

    return buf;
  };

  importSecretKey = async () => {
    let cryptoParams = this.state.cryptoParams;
    let rawPswrd;

    rawPswrd = this.str2ab(this.state.accounts[0]);

    return window.crypto.subtle.importKey(
      "raw",
      rawPswrd,
      {
        name: cryptoParams.algoName1
      },
      false,
      cryptoParams.perms1
    );
  };

  //Function to get files of the selected account
  getFiles = async () => {
    try {
      const { accounts, contract } = this.state;

      let filesLength = await contract.methods
        .getLength()
        .call({ from: accounts[0] });
      let files = [];
      for (let i = 0; i < filesLength; i++) {
        let file = await contract.methods
          .getFile(i)
          .call({ from: accounts[0] });
        files.push(file);
      }
      this.setState({ solidityDrive: files });
    } catch (error) {
      console.log(error);
    }
  };
  //Function to store files in the ipfs
  onDrop = async file => {
    var result = "";
    const scope = this;
    try {
      var handleReceipt = (error, receipt) => {
        if (error) console.error(error);
        else {
          console.log(receipt);
        }
      };
      console.log(file);
      const { contract, accounts } = this.state;
      await this.encryption(file);
      setTimeout(async () => {
        console.log(scope.state.encryptFile);
        const encryptFile = scope.state.encryptFile;
        const fileExt = encryptFile.name.split(".");
        const blob = new Blob(encryptFile.data, {
          type: mimeTypes.contentType(fileExt[fileExt.length - 1])
        });
        const uploadFile = new File([blob], file.name);
        const streamData = new fileReaderPullStream(uploadFile);
        result = await ipfs.add(streamData);
        console.log("Result value ");
        console.log(result);
        const timestamp = Math.round(+new Date() / 1000);
        const type = file.name.substr(file.name.lastIndexOf(".") + 1);
        let uploaded = contract.methods
          .add(result[0].hash, file.name, type, timestamp)
          .send({ from: accounts[0], gas: 300000 });
        console.log(uploaded);
        console.log(this.state.web3);

        //Here we will be getting account address of available peers online
        let depositAmount = contract.methods
          .depositsFund([
            "0xE028aBA988CB3f65c752BC2703458F073d7E164B",
            "0x0830d1517A6BB9AeAEdD222b00Ef5aB2E68d124C"
          ])
          .send({
            from: accounts[0],
            value: this.state.web3.utils.toWei("0.05", "ether")
          });
      }, 10);

      // const stream = fileReaderPullStream(this.state.encryptFile);
      // console.log(typeof stream);

      const timestamp = Math.round(+new Date() / 1000);
      const type = file.name.substr(file.name.lastIndexOf(".") + 1);
      let uploaded = await contract.methods
        .add(result[0].hash, file.name, type, timestamp)
        .send({ from: accounts[0], gas: 300000 });
      console.log(uploaded);
      console.log(this.state.web3);
      this.state.web3.eth.sendTransaction(
        {
          from: accounts[0],
          to: "0xa98996860DfBc4DdB5b46A74ac4d07eA7a82d3A4",
          value: this.state.web3.utils.toWei("0.05", "ether")
        },
        handleReceipt
      );
      this.getFiles();
    } catch (error) {
      console.log(error);
    }
  };

  deriveEncryptionSecretKey = async () => {
    let cryptoParams = this.state.cryptoParams;
    let getSecretKey = await this.importSecretKey();

    return window.crypto.subtle.deriveKey(
      {
        name: cryptoParams.algoName1,
        salt: cryptoParams.salt,
        iterations: cryptoParams.itr,
        hash: {
          name: cryptoParams.hash
        }
      },
      getSecretKey,
      { name: cryptoParams.algoName2, length: cryptoParams.algoLength },
      false,
      cryptoParams.perms2
    );
  };

  componentDidMount = async () => {
    try {
      // Geting network provider and web3 instance.
      const web3 = await getWeb3();

      // Using web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Geting the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SolidityDriveContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SolidityDriveContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getFiles);
      web3.currentProvider.publicConfigStore.on("update", async () => {
        const changedAccounts = await web3.eth.getAccounts();

        this.setState({ accounts: changedAccounts });
        console.log(this.state.accounts[0]);

        const { accounts, contract } = this.state;

        this.getFiles();
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };
  deriveDecryptionSecretKey = async salt => {
    let cryptoParams = this.state.cryptoParams;
    let getSecretKey = await this.importSecretKey();

    return window.crypto.subtle.deriveKey(
      {
        name: cryptoParams.algoName1,
        salt: new Uint8Array(salt),
        iterations: cryptoParams.itr,
        hash: {
          name: cryptoParams.hash
        }
      },
      getSecretKey,
      { name: cryptoParams.algoName2, length: cryptoParams.algoLength },
      false,
      cryptoParams.perms2
    );
  };

  decryption = file => {
    const scope = this;
    const cryptoParams = this.state.cryptoParams;
    const reader = new FileReader();

    reader.onload = async () => {
      const derivedKey = await this.deriveDecryptionSecretKey(
        new Uint8Array(reader.result.slice(16, 32))
      );
      const iv = new Uint8Array(reader.result.slice(0, 16));
      const content = new Uint8Array(reader.result.slice(32));

      await window.crypto.subtle
        .decrypt(
          {
            iv,
            name: cryptoParams.algoName2
          },
          derivedKey,
          content
        )
        .then(function(decrypted) {
          const decryptFile = {
            name: file.name,
            data: decrypted
          };
          scope.handleFileDownload(decryptFile);
        })
        .catch(function() {
          alert("Wrong password\nPlease enter correct password");
        });
    };

    reader.readAsArrayBuffer(file.data);
  };

  getFund = () => {
    const { accounts, contract } = this.state;
    setTimeout(() => {
      let getFund = contract.methods
        .withdraw(accounts[0])
        .send({ from: accounts[0], gas: 300000 });
    }, 1);
  };

  handleFileDownload = async file => {
    const temp = file.name.split(".");

    const blob = await new Blob([file.data], {
      type: mimeTypes.contentType(temp[temp.length - 1])
    });

    const url = URL.createObjectURL(blob);

    var element = document.createElement("a");
    element.setAttribute("href", url);

    element.setAttribute("download", file.name);
    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

    this.setState({
      isFileDowloaded: true
    });
  };

  handleTabImgBtnClick = event => {
    event.persist();
    let tabBtn = this.state.tabBtn;

    tabBtn = tabBtn.map(button => {
      if (
        (button.name === event.target.name && button.active === false) ||
        (button.name === event.target.name && button.active === true)
      ) {
        button.active = true;
      } else {
        button.active = false;
      }
      return button;
    });

    this.setState({
      tabBtn
    });
  };

  getContent = () => {
    const activeBtn = this.state.tabBtn.filter(
      button => button.active === true
    );
    if (activeBtn[0].name === "file") {
      return <FileSection handleFileChange={this.handleFileChange} />;
    } else if (activeBtn[0].name === "wallet") {
      return <TransactionSection />;
    } else if (activeBtn[0].name === "feedback") {
      return <FeedbackSection />;
    }
  };

  handleMetaMaskConnection = () => {
    let uploadProcess = this.state.uploadProcess;
    uploadProcess.connectToMetaMask = "complete";
    uploadProcess.confirmationPayment = "process";

    console.log("Connectiong to MetaMask is done successfully");

    this.setState({
      uploadProcess
    });
  };

  handleFilePayment = () => {
    let uploadProcess = this.state.uploadProcess;
    uploadProcess.confirmationPayment = "complete";
    uploadProcess.confirmationGas = "process";

    console.log("File payment is done successfully");

    this.setState({
      uploadProcess
    });
  };
  handleGasPayment = () => {
    let uploadProcess = this.state.uploadProcess;
    uploadProcess.confirmationGas = "complete";
    uploadProcess.uploading = "process";

    console.log("Gas payment is done successfully");

    this.setState({
      uploadProcess
    });
  };
  handleFileUpload = () => {
    let uploadProcess = this.state.uploadProcess;
    uploadProcess.uploading = "complete";

    console.log("File is uploaded successfully");

    this.setState({
      uploadProcess
    });
  };

  handelFileEncryption = () => {
    let step = this.state.step;
    step = "processing";

    let uploadProcess = this.state.uploadProcess;
    uploadProcess.connectToMetaMask = "process";

    console.log("Encryption is done successfully");

    this.setState({
      uploadProcess,
      step
    });
  };

  toggleDropdownMenu = () => {
    let dropdownMenu = this.state.dropdownMenu;
    dropdownMenu.dropdownActive = dropdownMenu.dropdownActive ? false : true;
    this.setState({ dropdownMenu });
  };

  handleDropdownItemClick = clickItem => {
    const scope = this;
    let dropdownMenu = this.state.dropdownMenu;
    dropdownMenu.dropdown.map(dropdown => {
      if (
        (dropdown.value === clickItem.value && !dropdown.active) ||
        (dropdown.value === clickItem.value && dropdown.active)
      ) {
        dropdown.active = true;
        dropdownMenu.selectedAcc = clickItem;
      } else {
        dropdown.active = false;
      }
      return dropdown;
    });

    setTimeout(() => {
      scope.toggleDropdownMenu();
    }, 100);

    this.setState({ dropdownMenu });
  };

  handleFileChange = event => {
    if (event.target.files.length > 0) {
      let step = this.state.step;
      step = "transaction";

      const nBytes = event.target.files[0].size,
        file = {};
      let fileSize = nBytes + " bytes";

      file.netpayable = 0.000000005 * nBytes + 0.006;
      file.amount = 0.000000005 * nBytes;

      const decimalCount = file.netpayable.toString().split(".")[1].length;

      if (decimalCount > 10) {
        const splitFees = file.netpayable.toString().split(".");
        file.netpayable = parseFloat(
          String(splitFees[0] + "." + splitFees[1].substring(0, 10))
        );
      }

      file.size = " (" + fileSize + ")";

      const fileExt = event.target.files[0].name.split(".");

      for (
        let sizes = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
          index = 0,
          approx = nBytes / 1024;
        approx > 1;
        approx /= 1024, index++
      ) {
        fileSize = approx.toFixed(2) + " " + sizes[index];
      }

      file.name = fileExt[0];
      file.size = fileSize + file.size;
      file.type = fileExt[fileExt.length - 1];
      file.data = event.target.files[0];

      this.setState({
        file,
        step
      });
    }
  };

  handlePopupClose = () => {
    let step = this.state.step;
    step = "none";

    let file = this.state.file;
    file = {};

    this.setState({ step, file });
  };

  getPopup = () => {
    const step = this.state.step;
    if (step === "none") {
      return null;
    } else if (step === "transaction") {
      return (
        <Popup
          step={this.state.step}
          file={this.state.file}
          dropdownMenu={this.state.dropdownMenu}
          toggleDropdownMenu={this.toggleDropdownMenu}
          handleDropdownItemClick={this.handleDropdownItemClick}
          handleFileChange={this.handleFileChange}
          button={this.state.button}
          handlePopupProceed={this.handelFileEncryption}
          handlePopupClose={this.handlePopupClose}
        />
      );
    } else if (step === "processing") {
      return (
        <Popup
          step={this.state.step}
          uploadProcess={this.state.uploadProcess}
          handleMetaMaskConnection={this.handleMetaMaskConnection}
          handleFilePayment={this.handleFilePayment}
          handleGasPayment={this.handleGasPayment}
          handleFileUpload={this.handleFileUpload}
          // handlePopupClose={this.handlePopupClose}
        />
      );
    }
  };
  render() {
    return (
      <div className="App">
        <Sidebar
          tabBtn={this.state.tabBtn}
          handleTabImgBtnClick={this.handleTabImgBtnClick}
        />
        <div className="content-section">{this.getContent()}</div>
        {this.getPopup()}
      </div>
    );
  }
}

export default App;
