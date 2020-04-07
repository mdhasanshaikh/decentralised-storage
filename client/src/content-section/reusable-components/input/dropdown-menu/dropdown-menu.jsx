import React, { Component } from "react";
import "./dropdown-menu.css";

import dropdownIcon from "../../../../asserts/dropdown-icon.png";

class DropdownMenu extends Component {
  state = {};

  getDropdownClasses = (state) => {
    if (state) {
      return "dropdown-item-active";
    } else {
      return "dropdown-item";
    }
  };

  render() {
    let dropdownMenu = this.props.dropdownMenu;
    return (
      <div className="dropdown-menu">
        <div className="dropdown-field">
          <input
            type="text"
            onChange={(value) => console.log(value)}
            onClick={this.props.toggleDropdownMenu}
            value={dropdownMenu.selectedAcc.value}
            name={dropdownMenu.name}
            readOnly
          />
          <img src={dropdownIcon} alt="dropdown-icon" />
        </div>
        {!dropdownMenu.dropdownActive ? null : (
          <div className="dropdown">
            {dropdownMenu.dropdown.map((dropdown) => (
              <button
                className={this.getDropdownClasses(dropdown.active)}
                key={dropdown.id}
                onClick={() => this.props.handleDropdownItemClick(dropdown)}>
                {dropdown.value}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default DropdownMenu;
