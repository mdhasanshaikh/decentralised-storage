import React, { Component } from "react";
import "./transaction-section.css";

import DropdownMenu from "../../reusable-components/input/dropdown-menu/dropdown-menu";
import Tabbar from "../../reusable-components/tab-bar/tab-bar";
import TextField from "../../reusable-components/input/text-field/text-field";
import searchIcon from "../../../asserts/search-icon-grey.png";

class TransactionSection extends Component {
  state = {
    dropdownMenu: {
      id: 1,
      name: "account",
      dropdownActive: false,
      selectedAcc: {},
      dropdown: [],
    },
    months: [
      "Jan",
      "Feb",
      "Mar",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ],
    recentTransactions: [
      {
        id: 1,
        txnId: "S37750030",
        date: "24/02/2020",
        fileName: "File name 1",
        amount: 0.00015,
      },
      {
        id: 2,
        txnId: "S37750031",
        date: "25/02/2020",
        fileName: "File name 2",
        amount: 0.00031,
      },
      {
        id: 3,
        txnId: "S37750032",
        date: "26/02/2020",
        fileName: "File name 3",
        amount: 0.00043,
      },
      {
        id: 4,
        txnId: "S37750033",
        date: "27/02/2020",
        fileName: "File name 4",
        amount: 0.00003,
      },
    ],
    transactions: [
      {
        id: 1,
        txnId: "S37750030",
        date: "24/02/2020",
        fileName: "File name 1",
        amount: 0.00015,
      },
      {
        id: 2,
        txnId: "S37750031",
        date: "25/02/2020",
        fileName: "File name 2",
        amount: 0.00031,
      },
      {
        id: 3,
        txnId: "S37750032",
        date: "26/02/2020",
        fileName: "File name 3",
        amount: 0.00043,
      },
      {
        id: 4,
        txnId: "S37750033",
        date: "27/02/2020",
        fileName: "File name 4",
        amount: 0.00003,
      },
      {
        id: 5,
        txnId: "S37750034",
        date: "27/02/2020",
        fileName: "File name 5",
        amount: 0.00015,
      },
      {
        id: 6,
        txnId: "S37750035",
        date: "28/02/2020",
        fileName: "File name 6",
        amount: 0.00031,
      },
      {
        id: 7,
        txnId: "S37750036",
        date: "29/02/2020",
        fileName: "File name 7",
        amount: 0.00043,
      },
      {
        id: 8,
        txnId: "S37750037",
        date: "29/02/2020",
        fileName: "File name 8",
        amount: 0.00003,
      },
    ],
    tabs: [
      {
        id: 1,
        name: "recent-transaction",
        label: "Recent Transactions",
        active: true,
      },
      {
        id: 2,
        name: "all-transaction",
        label: "All Transactions",
        active: false,
      },
    ],

    searchField: {
      id: 1,
      name: "field",
      placeholder: "Field",
      //   label: "Field",
      inputType: "text",
      value: "",
      icon: searchIcon,
      state: "normal",
    },
  };

  // componentWillMount = () => {
  //   const dropdownMenu = this.props.dropdownMenu;
  //   this.setState({ dropdownMenu });
  // };

  // componentDidUpdate = (prevProps) => {
  //   const dropdownMenu = this.props.dropdownMenu;
  //   console.log(prevProps.dropdownMenu, dropdownMenu);

  //   if (
  //     dropdownMenu.selectedAcc.value !==
  //     prevProps.dropdownMenu.selectedAcc.value
  //   ) {
  //     console.log(dropdownMenu);

  //   }
  // };

  handleInputValueChange = (event) => {
    let searchField = this.state.searchField;
    searchField.value = event.target.value;
    if (searchField.value.length > 0) {
      searchField.state = "active";
    }
    this.setState({ searchField });
  };

  handleTabClick = (event) => {
    let tabs = this.state.tabs;
    tabs.map((tab) => {
      if (
        (tab.name === event.target.name && !tab.active) ||
        (tab.name === event.target.name && tab.active)
      ) {
        tab.active = true;
      } else {
        tab.active = false;
      }
      return tab;
    });

    this.setState({ tabs });
  };

  getTransactions = () => {
    const tabs = this.state.tabs.filter((tab) => tab.active === true);

    if (tabs[0].name === "recent-transaction") {
      let files = this.props.account.files.slice(0, 3);
      // transactions = transactions.sort((a, b) => (a.date < b.date ? 1 : -1));

      return files.map((file) => (
        <div className="row-item" key={file.id}>
          <div className="left-side">
            <div className="txn-id">{file.id}</div>
            <div className="normal-text">
              {file.details.name + file.details.type}
            </div>
          </div>
          <div className="right-side">
            <div className="amt">
              {file.transaction.amount}
              <span>ETH</span>
            </div>
            <div className="normal-text">{file.transaction.date}</div>
          </div>
        </div>
      ));
    } else {
      let files = this.props.account.files;

      return files.map((file) => (
        <div className="row-item" key={file.id}>
          <div className="left-side">
            <div className="txn-id">{file.id}</div>
            <div className="normal-text">
              {file.details.name + file.details.type}
            </div>
          </div>
          <div className="right-side">
            <div className="amt">
              {file.transaction.amount}
              <span>ETH</span>
            </div>
            <div className="normal-text">{file.transaction.date}</div>
          </div>
        </div>
      ));
    }
  };
  render() {
    let date = new Date();
    return (
      <div className="transaction-section">
        <div className="top-section">
          <div className="title">All Transactions</div>
          <div className="tool-section">
            <DropdownMenu
              dropdownMenu={this.props.dropdownMenu}
              toggleDropdownMenu={this.props.toggleDropdownMenu}
              handleDropdownItemClick={this.props.handleDropdownItemClick}
            />
          </div>
        </div>
        <div className="middle-section">
          <div className="content-box">
            <div className="value-text">
              {this.props.account.spendAmount}
              <span>ETH</span>
            </div>
            <div className="descript-text">Current Spending</div>
          </div>
          <div className="content-box">
            <div className="value-text">
              {this.state.months[date.getMonth()]}
            </div>
            <div className="descript-text">Current Month</div>
          </div>
          <div className="content-box">
            <div className="value-text">
              {this.props.account.balance}
              <span>ETH</span>
            </div>
            <div className="descript-text">Current Balance</div>
          </div>
        </div>
        {this.props.account.files.length ? (
          <div className="content-section">
            <div className="top-section">
              <div className="tab-holder">
                <Tabbar
                  tabs={this.state.tabs}
                  handleTabClick={this.handleTabClick}
                />
              </div>
              <div className="search-holder">
                <TextField
                  field={this.state.searchField}
                  handleInputValueChange={this.handleInputValueChange}
                />
              </div>
            </div>
            <div className="table-section">
              <div className="row-title">
                <div className="left-side">Txn id/File</div>
                <div className="right-side">Amt/Date</div>
              </div>
              {this.getTransactions()}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default TransactionSection;
