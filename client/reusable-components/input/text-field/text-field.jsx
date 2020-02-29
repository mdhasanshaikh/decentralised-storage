import React, { Component } from "react";
import "./text-field.css";

class TextField extends Component {
  getTextFieldClasses = state => {
    if (state === "normal") {
      return "text-field";
    } else if (state === "active") {
      return "text-field-active";
    }
  };

  render() {
    let field = this.props.field;
    return (
      <div className={this.getTextFieldClasses(field.state)}>
        <input
          type={field.inputType}
          value={field.value}
          name={field.name}
          placeholder={field.placeholder}
          onChange={this.props.handleInputValueChange}
          required
        />
        {field.icon === undefined ? null : (
          <img src={field.icon} alt={field.name} />
        )}
        {field.label === undefined ? null : (
          <label htmlFor={field.name}>{field.label}</label>
        )}
      </div>
    );
  }
}

export default TextField;
