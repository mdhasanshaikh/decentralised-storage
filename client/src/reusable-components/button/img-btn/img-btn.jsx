import React, { Component } from "react";
import "./img-btn.css";

class ImgBtn extends Component {
  state = {};

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
        className="img-btn"
        onClick={this.props.handleImgBtnClick}
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

export default ImgBtn;
