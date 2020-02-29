import React, { Component } from "react";
import "./grid-view-section.css";
import FileContainer from "./file-container/file-container";

import addIcon from "../../../asserts/add-icon.png";

class GridViewSection extends Component {
  state = {};
  render() {
    return (
      <div className="grid-view-section">
        {this.props.files.map(file => (
          <FileContainer
            key={file.id}
            file={file}
            handleFileContainerClick={() => this.props.handleFileClick(file)}
          />
        ))}
        <div className="add-file-btn" name="add-file">
          <div className="file-btn-design">
            <div className="icon">
              <img src={addIcon} alt="add-file" />
            </div>
            <div className="text">Add File</div>
          </div>
          <input
            type="file"
            name="file"
            onChange={this.props.handleFileChange}
          />
        </div>
      </div>
    );
  }
}

export default GridViewSection;
