import React, { Component } from "react";
import "./sidebar.css";

import logoIcon from "../../asserts/side-bar/logo.png";
import userIcon from "../../asserts/side-bar/user-icon.png";

import TabImgBtn from "../reusable-components/button/tab-img-btn/tab-img-btn"

class Sidebar extends Component {
  state = {
    
  };

  render() {
    return (
      <div className="sidebar">
        <div className="logo" onClick={() => console.log("hello bro")}>
          <img src={logoIcon} alt="logo" />
        </div>
        <div className="tab-container">
          {this.props.tabBtn.map(button => (
            <TabImgBtn
              key={button.id}
              button={button}
              handleTabImgBtnClick={this.props.handleTabImgBtnClick}
            />
          ))}
        </div>

        <div className="user">
          <img src={userIcon} alt="user" />
        </div>
      </div>
    );
  }
}

export default Sidebar;
