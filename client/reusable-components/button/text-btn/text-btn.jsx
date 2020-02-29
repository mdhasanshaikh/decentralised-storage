import React, { Component } from "react";
import "./text-btn.css";

class TextBtn extends Component {
  state = {
    button: {
      id: 1,
      label: "Proceed",
      type: "secondary"
    }
  };
  getBtnClasses = type => {
    if (type === "primary") {
      return "primary-btn";
    } else if (type === "secondary") {
      return "secondary-btn";
    }
  };
  render() {
    let button = this.props.button;

    return (
      <button
        key={button.id}
        className={this.getBtnClasses(button.type)}
        onClick={this.props.handleBtnClick}>
        {button.label}
      </button>
    );
  }
}

export default TextBtn;
