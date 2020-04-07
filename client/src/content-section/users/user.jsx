import React, { Component } from "react";

//import packages
import SolidityDriveContract from "../../contracts/SolidityDrive.json";
import getWeb3 from "../../utils/getWeb3";
import fileReaderPullStream from "pull-file-reader";
import ipfs from "../../utils/ipfs";
import mimeTypes from "mime-types";
import axios from "axios";

//import components
import Sidebar from "../side-bar/sidebar";
import FileSection from "./file-section/file-section";
import TransactionSection from "./transaction-section/transaction-section";
import FeedbackSection from "./feedback-section/feedback-section";
import Popup from "../reusable-components/popup/popup";

//import asserts
import fileIconOutline from "../../asserts/side-bar/file-icon-outline.png";
import fileIconFilled from "../../asserts/side-bar/file-icon-filled.png";
import walletIconOutline from "../../asserts/side-bar/wallet-icon-outline.png";
import walletIconFilled from "../../asserts/side-bar/wallet-icon-filled.png";
import feedbackIconOutline from "../../asserts/side-bar/feedback-icon-outline.png";
import feedbackIconFilled from "../../asserts/side-bar/feedback-icon-filled.png";

class User extends Component {
  state = {
    isPopupVisible: false,
    solidityDrive: [],
    selectedAccount: {},
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
      perms2: ["encrypt", "decrypt"],
    },

    //navigation components params
    tabBtn: [
      {
        id: 1,
        name: "file",
        active: true,
        imgSrc: [fileIconFilled, fileIconOutline],
      },
      {
        id: 2,
        name: "wallet",
        active: false,
        imgSrc: [walletIconFilled, walletIconOutline],
      },
      {
        id: 3,
        name: "feedback",
        active: false,
        imgSrc: [feedbackIconFilled, feedbackIconOutline],
      },
    ],

    //acc components params
    dropdownMenu: {
      id: 1,
      name: "account",
      dropdownActive: false,
      selectedAcc: {
        // id: "0x0591c3661c044427fBA199124cBEB745116432D2",
        // spendAmount: "5.0",
        // active: true,
        // balance: "100.0",
        // files: [
        //   {
        //     id: 1,
        //     details: {
        //       name: "chatbot",
        //       type: "txt",
        //       size: "4 KB",
        //       createDate: "19/02/2020",
        //       lastOpened: "20/02/2020",
        //     },
        //     transaction: {
        //       amount: "0.0025ETH",
        //       date: "19/02/2020",
        //       from: "0x0591c3661c044427fBA199124cBEB745116432D2",
        //     },
        //     active: false,
        //   },
        //   {
        //     id: 2,
        //     details: {
        //       name: "Latex4_zip (1)",
        //       type: "pdf",
        //       size: "1 MB",
        //       lastOpened: "18/02/2020",
        //       createDate: "19/02/2020",
        //     },
        //     transaction: {
        //       amount: "0.0025ETH",
        //       date: "19/02/2020",
        //       from: "0x0591c3661c044427fBA199124cBEB745116432D2",
        //     },
        //     active: false,
        //   },
        // ],
      },
      dropdown: [
        // {
        //   id: "0x0591c3661c044427fBA199124cBEB745116432D2",
        //   spendAmount: "5.0",
        //   active: true,
        //   balance: "100.0",
        //   files: [
        //     {
        //       id: 1,
        //       details: {
        //         name: "chatbot",
        //         type: "txt",
        //         size: "4 KB",
        //         createDate: "19/02/2020",
        //         lastOpened: "20/02/2020",
        //       },
        //       transaction: {
        //         amount: "0.0025ETH",
        //         date: "19/02/2020",
        //         from: "0x0591c3661c044427fBA199124cBEB745116432D2",
        //       },
        //       active: false,
        //     },
        //     {
        //       id: 2,
        //       details: {
        //         name: "Latex4_zip (1)",
        //         type: "pdf",
        //         size: "1 MB",
        //         lastOpened: "18/02/2020",
        //         createDate: "19/02/2020",
        //       },
        //       transaction: {
        //         amount: "0.0025ETH",
        //         date: "19/02/2020",
        //         from: "0x0591c3661c044427fBA199124cBEB745116432D2",
        //       },
        //       active: false,
        //     },
        //   ],
        // },
      ],
    },

    button: [
      { id: 1, label: "Proceed", type: "primary" },
      { id: 2, label: "Cancel", type: "secondary" },
    ],
    step: "none",
    uploadProcess: {
      connectToMetaMask: "pending",
      confirmationPayment: "pending",
      confirmationGas: "pending",
      uploading: "pending",
    },
    file: {},
  };

  componentWillMount = async () => {
    try {
      // Geting network provider and web3 instance.
      const web3 = await getWeb3();
      // Using web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // console.log(accounts);

      // Geting the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SolidityDriveContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SolidityDriveContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      let dropdownMenu = this.state.dropdownMenu;
      // console.log(dropdownMenu);
      dropdownMenu = await this.settingDropdownMenu(web3, accounts);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        {
          web3,
          accounts,
          contract: instance,
          dropdownMenu,
        },
        this.getFiles
      );

      web3.currentProvider.publicConfigStore.on("update", async () => {
        const changedAccounts = await web3.eth.getAccounts();
        dropdownMenu = await this.settingDropdownMenu(web3, changedAccounts);
        this.setState(
          { accounts: changedAccounts, dropdownMenu },
          this.getFiles
        );
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  settingDropdownMenu = async (web3, accounts) => {
    var dropdownMenu = this.state.dropdownMenu;

    for (let index = 0; index < accounts.length; index++) {
      let balance = 0.0;
      await web3.eth.getBalance(accounts[index]).then((result) => {
        balance = web3.utils.fromWei(result, "ether");
      });
      if (index === 0) {
        dropdownMenu.selectedAcc = {
          id: index,
          value: accounts[index],
          balance: balance,
          active: index === 0 ? true : false,
        };
      }
      dropdownMenu.dropdown.push({
        id: index,
        value: accounts[index],
        balance: balance,
        active: index === 0 ? true : false,
      });
    }

    dropdownMenu.dropdown = await this.getUniqueAccounts(
      dropdownMenu.dropdown,
      dropdownMenu.selectedAcc
    );

    return dropdownMenu;
  };

  getUniqueAccounts = async (dropdown, selectedAcc) => {
    var uniqueDropdown = [{}];

    if (dropdown.length === 1) {
      return dropdown;
    }
    console.log(dropdown);
    // Loop through array values
    for (var index = 0; index < dropdown.length; index++) {
      if (index === 0) {
        if (dropdown[index].value !== undefined) {
          dropdown[index].id = index;
          dropdown[index].active =
            dropdown[index].value === selectedAcc.value ? true : false;
          uniqueDropdown.push(dropdown[index]);
        }
      } else {
        if (
          dropdown[index - 1].value !== dropdown[index].value &&
          dropdown[index] !== undefined &&
          dropdown[index].value !== undefined
        ) {
          dropdown[index].id = index;
          dropdown[index].active =
            dropdown[index].value === selectedAcc.value ? true : false;
          uniqueDropdown.push(dropdown[index]);
        }
      }
    }

    uniqueDropdown = uniqueDropdown.filter((item) => item.value !== undefined);
    return uniqueDropdown;
  };

  // getTransactionsByAccount = (
  //   eth,
  //   myaccount,
  //   startBlockNumber,
  //   endBlockNumber
  // ) => {
  //   endBlockNumber = endBlockNumber === null ? 100000000000000 : endBlockNumber;
  //   startBlockNumber = startBlockNumber === null ? 0 : startBlockNumber;

  //   console.log(eth.getBlock);
  //   for (var i = startBlockNumber; i <= endBlockNumber; i++) {
  //     if (i % 1000 === 0) {
  //       console.log("Searching block " + i);
  //     }
  //     var block = eth.getBlock(i, true);
  //     console.log(block);
  //     if (block !== null && block.transactions !== null) {
  //       block.transactions.forEach(function (e) {
  //         if (myaccount === "*" || myaccount === e.from || myaccount === e.to) {
  //           console.log(
  //             "  tx hash          : " +
  //               e.hash +
  //               "\n" +
  //               "   nonce           : " +
  //               e.nonce +
  //               "\n" +
  //               "   blockHash       : " +
  //               e.blockHash +
  //               "\n" +
  //               "   blockNumber     : " +
  //               e.blockNumber +
  //               "\n" +
  //               "   transactionIndex: " +
  //               e.transactionIndex +
  //               "\n" +
  //               "   from            : " +
  //               e.from +
  //               "\n" +
  //               "   to              : " +
  //               e.to +
  //               "\n" +
  //               "   value           : " +
  //               e.value +
  //               "\n" +
  //               "   time            : " +
  //               block.timestamp +
  //               " " +
  //               new Date(block.timestamp * 1000).toGMTString() +
  //               "\n" +
  //               "   gasPrice        : " +
  //               e.gasPrice +
  //               "\n" +
  //               "   gas             : " +
  //               e.gas +
  //               "\n" +
  //               "   input           : " +
  //               e.input
  //           );
  //         }
  //       });
  //     }
  //   }
  // };

  getAccBalance = async (acc) => {
    // Geting network provider and web3 instance.
    const web3 = await getWeb3();

    let balance = 0.0;
    balance = web3.eth.getBalance(acc).then((result) => {
      return web3.utils.fromWei(result, "ether");
    });

    console.log(balance);
  };

  //Function to get files of the selected account
  getFiles = async () => {
    try {
      const { dropdownMenu, contract } = this.state;

      for (
        let accountIndex = 0;
        accountIndex < dropdownMenu.dropdown.length;
        accountIndex++
      ) {
        let spendAmount = 0.0;
        let filesCount = await contract.methods
          .getLength()
          .call({ from: dropdownMenu.dropdown[accountIndex].value });
        let files = [];
        for (let fileIndex = 0; fileIndex < filesCount; fileIndex++) {
          let file = await contract.methods
            .getFile(fileIndex)
            .call({ from: dropdownMenu.dropdown[accountIndex].value });

          let formatedFile = {};
          formatedFile.id = file.hash;
          formatedFile.details = {
            name: file.fileName,
            type: file.fileType,
            size: "--",
            lastOpened: file.date,
            createDate: file.date,
          };
          formatedFile.transaction = {
            amount: file.amount,
            date: file.date,
            from: dropdownMenu.dropdown[accountIndex].value,
          };
          spendAmount += file.amount;
          formatedFile.active = false;
          files.push(formatedFile);
        }

        if (
          dropdownMenu.dropdown[accountIndex].value ===
          dropdownMenu.selectedAcc.value
        ) {
          dropdownMenu.selectedAcc = dropdownMenu.dropdown[accountIndex];
        }

        dropdownMenu.dropdown[accountIndex].spendAmount = spendAmount
          ? String(spendAmount)
          : "--";
        dropdownMenu.dropdown[accountIndex].files = files;
      }

      console.log(dropdownMenu);
      this.setState({
        dropdownMenu,
      });
    } catch (error) {
      console.log(error);
    }
  };
  //Function to store files in the ipfs
  onDrop = async (file) => {
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
          type: mimeTypes.contentType(fileExt[fileExt.length - 1]),
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
          value: this.state.web3.utils.toWei("0.05", "ether"),
        },
        handleReceipt
      );
      this.getFiles();
    } catch (error) {
      console.log(error);
    }
  };

  getFund = () => {
    const { accounts, contract } = this.state;
    setTimeout(() => {
      let getFund = contract.methods
        .withdraw(accounts[0])
        .send({ from: accounts[0], gas: 300000 });
    }, 1);
  };

  //
  //
  //Encryption & Decryption file
  str2ab = (str) => {
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
        name: cryptoParams.algoName1,
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
          name: cryptoParams.hash,
        },
      },
      getSecretKey,
      { name: cryptoParams.algoName2, length: cryptoParams.algoLength },
      false,
      cryptoParams.perms2
    );
  };

  encryption = async (file) => {
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
            name: "AES-GCM",
          },
          derivedKey,
          content
        )
        .then(function(encrypted) {
          let encryptData = [iv, cryptoParams.salt, new Uint8Array(encrypted)];
          scope.setState({
            encryptFile: {
              name: "Encrypted-" + file.name,
              data: encryptData,
            },
          });

          // console.log(scope.state.encryptFile);
        })
        .catch(function(err) {
          console.log(err);
        });
    };

    reader.readAsArrayBuffer(file);
  };

  deriveDecryptionSecretKey = async (salt) => {
    let cryptoParams = this.state.cryptoParams;
    let getSecretKey = await this.importSecretKey();

    return window.crypto.subtle.deriveKey(
      {
        name: cryptoParams.algoName1,
        salt: new Uint8Array(salt),
        iterations: cryptoParams.itr,
        hash: {
          name: cryptoParams.hash,
        },
      },
      getSecretKey,
      { name: cryptoParams.algoName2, length: cryptoParams.algoLength },
      false,
      cryptoParams.perms2
    );
  };

  decryption = (file) => {
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
            name: cryptoParams.algoName2,
          },
          derivedKey,
          content
        )
        .then(function(decrypted) {
          const decryptFile = {
            name: file.name,
            data: decrypted,
          };
          scope.handleFileDownload(decryptFile);
        })
        .catch(function() {
          alert("Wrong password\nPlease enter correct password");
        });
    };

    reader.readAsArrayBuffer(file.data);
  };

  //Encryption & Decryption file ends
  //
  //

  handleFileDownloadRequest = (file) => {
    const scope = this;
    var config = {
      headers: {
        "Content-Type": "application/octet-stream",
      },
      responseType: "blob",
    };
    axios
      .get("http://localhost:8080/ipfs/" + String(file.id), config)
      .then((response) => {
        const file = {
          name: file.details.name,
          data: response.data,
        };

        scope.decryption(file);
      });
  };

  handleFileDownload = async (file) => {
    const temp = file.name.split(".");

    const blob = await new Blob([file.data], {
      type: mimeTypes.contentType(temp[temp.length - 1]),
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
      isFileDowloaded: true,
    });
  };

  //
  // tab button listener
  handleTabImgBtnClick = (event) => {
    event.persist();
    let tabBtn = this.state.tabBtn;

    tabBtn = tabBtn.map((button) => {
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
      tabBtn,
    });
  };
  // tab button listener
  //

  //
  //
  //handle MetaMask Connection
  handleMetaMaskConnection = async () => {
    let uploadProcess = this.state.uploadProcess;
    uploadProcess.connectToMetaMask = "complete";
    uploadProcess.confirmationPayment = "process";

    console.log("Connectiong to MetaMask is done successfully");

    this.setState({
      uploadProcess,
    });

    await this.handleFilePayment();
  };
  //handle MetaMask Connection ends

  //handle file payment
  handleFilePayment = async () => {
    let uploadProcess = this.state.uploadProcess;
    const { contract, accounts, file } = this.state;

    //Here we will be getting account address of available peers online
    await contract.methods
      .depositsFund([accounts[0]])
      .send({
        from: accounts[0],
        value: this.state.web3.utils.toWei(file.amount.toString(), "ether"),
      })
      .then(async () => {
        uploadProcess.confirmationPayment = "complete";
        uploadProcess.uploading = "process";
        console.log("File payment is done successfully");
      })
      .catch(async (error) => {
        uploadProcess.confirmationPayment = "fail";
        console.log("Error: ", error);
      });

    this.setState({
      uploadProcess,
    });

    if (uploadProcess.uploading === "process") {
      await this.handleFileUpload();
    }
  };
  //handle file payment ends

  //handle file upload
  handleFileUpload = async () => {
    var result = "";
    let uploadProcess = this.state.uploadProcess;
    // uploadProcess.confirmationGas = "complete";

    const { contract, accounts, file } = this.state;
    const encryptFile = this.state.encryptFile;
    const fileExt = encryptFile.name.split(".");
    const blob = new Blob(encryptFile.data, {
      type: mimeTypes.contentType(fileExt[fileExt.length - 1]),
    });
    const uploadFile = new File([blob], file.name);
    const streamData = new fileReaderPullStream(uploadFile);
    result = await ipfs.add(streamData);

    var handleReceipt = (error, receipt) => {
      if (!error) {
        uploadProcess.confirmationGas = "fail";
      } else {
        uploadProcess.confirmationGas = "complete";
      }
    };

    const timestamp = Math.round(+new Date() / 1000);
    const type = file.name.substr(file.name.lastIndexOf(".") + 1);
    let uploaded = await contract.methods
      .add(result[0].hash, file.name, type, file.amount, timestamp)
      .send({ from: accounts[0], gas: 300000 }, handleReceipt)
      .then(() => {
        console.log("Hello world");
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
    // console.log(uploaded);
    // console.log(this.state.web3);

    console.log("File is uploaded successfully");

    this.setState({
      uploadProcess,
    });
  };
  //handle file upload ends

  //handle gas payment
  handleGasPayment = async () => {
    let uploadProcess = this.state.uploadProcess;
    uploadProcess.uploading = "complete";
    uploadProcess.confirmationGas = "process";

    var result = "";
    const { contract, accounts, file } = this.state;

    var handleReceipt = (error, receipt) => {
      if (error) {
        uploadProcess.confirmationGas = "fail";
      } else {
        uploadProcess.confirmationGas = "complete";
      }
    };

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
        value: this.state.web3.utils.toWei("0.05", "ether"),
      },
      handleReceipt
    );

    console.log("Gas payment is done successfully");

    this.setState({
      uploadProcess,
    });
  };
  //handle gas payment ends

  //handle file encryption
  handelFileEncryption = async () => {
    let step = this.state.step;
    step = "processing";

    let uploadProcess = this.state.uploadProcess;
    uploadProcess.connectToMetaMask = "process";

    const file = this.state.file;

    await this.encryption(file.data);
    console.log("Encryption is done successfully");

    this.setState({
      uploadProcess,
      step,
    });

    await this.handleMetaMaskConnection();
  };
  //handle file encryption ends
  //
  //

  //
  //handle file change
  handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      let step = this.state.step;
      step = "transaction";

      const nBytes = event.target.files[0].size,
        file = {};
      let fileSize = nBytes + " bytes";

      file.netpayable = 0.000000005 * nBytes + 0.005;
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
        step,
      });
    }
  };
  //handle file change ends
  //

  //
  //toggle acc dropdown
  toggleDropdownMenu = () => {
    let dropdownMenu = this.state.dropdownMenu;
    dropdownMenu.dropdownActive = dropdownMenu.dropdownActive ? false : true;
    this.setState({ dropdownMenu });
  };
  //toggle acc dropdown ends
  //

  //
  //handle acc click
  handleDropdownItemClick = (clickItem) => {
    const scope = this;
    let dropdownMenu = this.state.dropdownMenu;
    dropdownMenu.dropdown.map((dropdown) => {
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
  //handle acc click ends
  //

  //
  //handle popup close
  handlePopupClose = () => {
    let step = this.state.step;
    step = "none";

    let file = this.state.file;
    file = {};

    this.setState({ step, file });
  };
  //handle popup close ends
  //

  handleFileClick = (accountId, clickFileId) => {
    let dropdownMenu = this.state.dropdownMenu;

    dropdownMenu.dropdown.map((account) => {
      if (account.id === accountId) {
        account.files.map((file) => {
          if (file.id === clickFileId && !file.active) {
            file.active = true;
          } else if (file.id === clickFileId && file.active) {
            file.active = false;
          }
          return file;
        });
      }

      if (account.id === dropdownMenu.selectedAcc.id) {
        dropdownMenu.selectedAcc = account;
      }
      return account;
    });

    this.setState({ dropdownMenu });
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

  //
  //get tab section content
  getContent = () => {
    const activeBtn = this.state.tabBtn.filter(
      (button) => button.active === true
    );
    if (activeBtn[0].name === "file") {
      return (
        <FileSection
          account={this.state.dropdownMenu.selectedAcc}
          handleFileChange={this.handleFileChange}
          handleFileDownloadRequest={this.handleFileDownloadRequest}
          handleFileClick={this.handleFileClick}
        />
      );
    } else if (activeBtn[0].name === "wallet") {
      return (
        <TransactionSection
          account={this.state.dropdownMenu.selectedAcc}
          dropdownMenu={this.state.dropdownMenu}
          toggleDropdownMenu={this.toggleDropdownMenu}
          handleDropdownItemClick={this.handleDropdownItemClick}
        />
      );
    } else if (activeBtn[0].name === "feedback") {
      return <FeedbackSection />;
    }
  };
  //get tab section content
  //

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

export default User;
