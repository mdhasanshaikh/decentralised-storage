import React, { Component } from "react";
import "./list-view-section.css";

import addIcon from "../../../asserts/add-icon.png";

class ListViewSection extends Component {
  state = {};

  render() {
    return (
      <div className="list-view-section">
        <div className="list-title">
          <div>File Name</div>
          <div>Last Opened</div>
          <div>File size</div>
        </div>
        <div className="list-content">
          {this.props.files.map(file => (
            <div
              key={file.id}
              className={file.active ? "list-row-active" : "list-row"}
              onClick={() => this.props.handleFileClick(file)}>
              <div>{file.details.name}</div>
              <div>{file.details.lastOpened}</div>
              <div>{file.details.size}</div>
            </div>
          ))}
        </div>
        <div className="add-file-btn" name="add-file">
          <div className="file-btn-design">
            <div className="icon">
              <img src={addIcon} alt="add-file" />
            </div>
            <div className="text">Add File</div>
          </div>
          <input type="file" name="file" onChange={this.handleFileChange} />
        </div>
      </div>
    );
  }
}

export default ListViewSection;
