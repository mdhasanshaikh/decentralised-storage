import React, { Component } from "react";
import "./tab-bar.css";

class Tabbar extends Component {
  state = {};
  render() {
    return (
      <div className="tab-bar">
        {this.props.tabs.map(tab => (
          <button
            key={tab.id}
            className={tab.active ? "tab-active" : "tab"}
            name={tab.name}
            onClick={this.props.handleTabClick}>
            {tab.label}
          </button>
        ))}
      </div>
    );
  }
}

export default Tabbar;
