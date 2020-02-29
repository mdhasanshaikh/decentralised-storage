import React, { Component } from "react";
import "./file-container.css";

import filePdfIcon from "../../../../asserts/file-pdf-icon.png";
import filePdfIconActive from "../../../../asserts/file-pdf-icon-active.png";
import fileImgIcon from "../../../../asserts/file-img-icon.png";
import fileImgIconActive from "../../../../asserts/file-img-icon-active.png";
import fileVideoIcon from "../../../../asserts/file-video-icon.png";
import fileVideoIconActive from "../../../../asserts/file-video-icon-active.png";
import fileTxtIcon from "../../../../asserts/file-txt-icon.png";
import fileTxtIconActive from "../../../../asserts/file-txt-icon-active.png";

class FileContainer extends Component {
  state = {
    file: {
      id: 1,
      name: "File Name",
      type: "pdf",
      active: false
    }
  };

  getFileIcon = (type, state) => {
    if (type === "pdf") {
      return state === false ? filePdfIcon : filePdfIconActive;
    } else if (type === "image") {
      return state === false ? fileImgIcon : fileImgIconActive;
    } else if (type === "video") {
      return state === false ? fileVideoIcon : fileVideoIconActive;
    } else if (type === "txt") {
      return state === false ? fileTxtIcon : fileTxtIconActive;
    }
  };

  render() {
    let file = this.props.file;
    return (
      <div
        className={file.active ? "file-container-active" : "file-container"}
        onClick={() => this.props.handleFileContainerClick(file)}>
        <div className="icon">
          <img
            src={this.getFileIcon(file.details.type, file.active)}
            alt={file.details.name}
          />
        </div>
        <div className="detail">
          <div className="title">{file.details.name}</div>
        </div>
      </div>
    );
  }
}

export default FileContainer;
