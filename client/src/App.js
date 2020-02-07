import React, { Component } from "react";
import SolidityDriveContract from "./contracts/SolidityDrive.json";
import getWeb3 from "./utils/getWeb3";
import { StyledDropZone } from "react-drop-zone";
import FileIcon, { defaultStyles } from "react-file-icon";
import "react-drop-zone/dist/styles.css";
import "bootstrap/dist/css/bootstrap.css";
import { Table } from "reactstrap";
import fileReaderPullStream from "pull-file-reader";
import ipfs from "./utils/ipfs";
import Moment from "react-moment";
import "./App.css";
import mimeTypes from "mime-types";
import ReactEncrypt from "react-encrypt";
var crypto = require("crypto");
var fs = require("fs");
var CryptoJS = require("crypto-js");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      }
    };
  }

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

  encryption = async file => {
    const cryptoParams = this.state.cryptoParams;
    const scope = this;
    const derivedKey = await this.deriveEncryptionSecretKey();
    const reader = new FileReader();

    reader.onload = async () => {
      const iv = window.crypto.getRandomValues(new Uint8Array(16));
      const content = new Uint8Array(reader.result);

      await window.crypto.subtle
        .encrypt(
          {
            iv,
            name: "AES-GCM"
          },
          derivedKey,
          content
        )
        .then(function(encrypted) {
          let encryptData = [iv, cryptoParams.salt, new Uint8Array(encrypted)];
          scope.setState({
            encryptFile: {
              name: "Encrypted-" + file.name,
              data: encryptData
            }
          });

          // console.log(scope.state.encryptFile);
        })
        .catch(function(err) {
          console.log(err);
        });
    };

    reader.readAsArrayBuffer(file);
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
      setTimeout(async() => {
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
        let uploaded = await contract.methods
          .add(result[0].hash, file.name, type, timestamp)
          .send({ from: accounts[0], gas: 300000 });
        console.log(uploaded);
        console.log(this.state.web3);
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
          value: this.state.web3.utils.toWei("1", "ether")
        },
        handleReceipt
      );
      this.getFiles();
    } catch (error) {
      console.log(error);
    }
  };

  //UI of the app
  render() {
    const { solidityDrive } = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="container pt-3">
          <StyledDropZone onDrop={this.onDrop} />
          <Table>
            <thead>
              <tr>
                <th width="7%" scope="row">
                  Type
                </th>
                <th className="text-left">File Name</th>
                <th className="text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {solidityDrive !== []
                ? solidityDrive.map((item, key) => (
                    <tr>
                      <th>
                        <FileIcon
                          size={30}
                          extension={item[2]}
                          {...defaultStyles[item[2]]}
                        />
                      </th>
                      <th className="text-left">
                        <a href={"http://localhost:8080/ipfs/" + item[0]}>
                          {item[1]}
                        </a>
                      </th>
                      <th className="text-right">
                        <Moment format="YYYY/MM/DD" unix>
                          {item[3]}
                        </Moment>
                      </th>
                    </tr>
                  ))
                : null}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default App;
