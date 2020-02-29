import React, { Component } from "react";
import "./file-details-section.css";
import ImgBtn from "../../../reusable-components/button/img-btn/img-btn";

import Tabbar from "../../../reusable-components/tab-bar/tab-bar";

class FileDetailsSection extends Component {
  state = {
    firstClick: false,

    tabs: [
      {
        id: 1,
        name: "details",
        label: "Details",
        active: true
      },
      {
        id: 2,
        name: "transaction",
        label: "Transaction",
        active: false
      }
    ]
  };
  handleTabClick = event => {
    let tabs = this.state.tabs;
    tabs.map(tab => {
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
  getFileDetails = details => {
    return (
      <div className="tab-details">
        {Object.entries(details).map((pairs, index) => {
          if (pairs[0] === "size") {
            pairs[0] = "Size";
            return (
              <div className="detail-item" key={index}>
                <div>{pairs[0]}</div>
                <div>{pairs[1]}</div>
              </div>
            );
          } else if (pairs[0] === "type") {
            pairs[0] = "Type";
            pairs[1] = pairs[1].replace(/\w\S*/g, function(txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
            return (
              <div className="detail-item" key={index}>
                <div>{pairs[0]}</div>
                <div>{pairs[1]}</div>
              </div>
            );
          } else if (pairs[0] === "lastOpened") {
            pairs[0] = "Last Opened";
            return (
              <div className="detail-item" key={index}>
                <div>{pairs[0]}</div>
                <div>{pairs[1]}</div>
              </div>
            );
          } else if (pairs[0] === "createDate") {
            pairs[0] = "Created On";
            return (
              <div className="detail-item" key={index}>
                <div>{pairs[0]}</div>
                <div>{pairs[1]}</div>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  getTransactionDetails = transaction => {
    return (
      <div className="tab-details">
        {Object.entries(transaction).map((pairs, index) => {
          if (pairs[0] === "amount") {
            pairs[0] = "Amount";
            return (
              <div className="detail-item" key={index}>
                <div>{pairs[0]}</div>
                <div>{pairs[1]}</div>
              </div>
            );
          } else if (pairs[0] === "date") {
            pairs[0] = "Date";
            pairs[1] = pairs[1].replace(/\w\S*/g, function(txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
            return (
              <div className="detail-item" key={index}>
                <div>{pairs[0]}</div>
                <div>{pairs[1]}</div>
              </div>
            );
          } else if (pairs[0] === "from") {
            pairs[0] = "From";
            return (
              <div className="detail-item" key={index}>
                <div>{pairs[0]}</div>
                <div>{pairs[1]}</div>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  getContentSectionClasses = () => {
    const firstClick = this.state.firstClick;
    const tabs = this.state.tabs.filter(tab => tab.active === true);

    if (!firstClick && tabs[0].name === "details") {
      return "content-section";
    } else if (firstClick && tabs[0].name === "details") {
      return "content-section-move-right";
    } else if (firstClick && tabs[0].name === "transaction") {
      return "content-section-move-left";
    }

    this.setState({ firstClick: true });
  };

  render() {
    const file = this.props.file;
    return (
      <div className="file-details-section">
        <div className="top-section">
          <div className="file-name">{file.details.name}</div>
          <ImgBtn
            button={this.props.closeBtn}
            handleImgBtnClick={this.props.handleCloseBtnClick}
          />
        </div>
        <Tabbar tabs={this.state.tabs} handleTabClick={this.handleTabClick} />
        <div className="wrapper">
          <div className={this.getContentSectionClasses()}>
            {this.getFileDetails(file.details)}
            {this.getTransactionDetails(file.transaction)}
          </div>
        </div>
      </div>
    );
  }
}

export default FileDetailsSection;
