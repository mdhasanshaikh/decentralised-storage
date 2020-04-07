import React, { Component } from "react";
import "./text-field.css";

class TextField extends Component {
  state = {};

  getTextFieldClasses = () => {
    let update = this.props.field.update;
    if (update === undefined || update === false) {
      return "text-field";
    } else {
      return "text-field-update";
    }
  };

  render() {
    return (
      <div className={this.getTextFieldClasses()}>
        <input
          type={this.props.field.type}
          value={this.props.field.value}
          name={this.props.field.name}
          onChange={this.props.handleInputValueChange}
          ref={this.props.field.name}
          onKeyDown={event =>
            this.props.handleInputFieldKeyPress(this.props.field, event)
          }
          required
        />
        <label htmlFor={this.props.field.name}>{this.props.field.label}</label>
      </div>
    );
  }
}

export default TextField;
