import React, { Component } from "react";
import "./tab-img-btn.css";

class TabImgBtn extends Component {
  state = {};
  getImgBtnClasses = () => {
    const status = this.props.button.active;
    if (status) {
      return "tab-img-btn-active";
    } else {
      return "tab-img-btn";
    }
  };

  getImgOnStatusChange = () => {
    const status = this.props.button.active;
    if (status) {
      return this.props.button.imgSrc[0];
    } else {
      return this.props.button.imgSrc[1];
    }
  };
  render() {
    return (
      <button
        key={this.props.button.id}
        className={this.getImgBtnClasses()}
        onClick={this.props.handleTabImgBtnClick}
        name={this.props.button.name}>
        <img
          src={this.getImgOnStatusChange()}
          name={this.props.button.name}
          alt={""}
        />
      </button>
    );
  }
}

export default TabImgBtn;
