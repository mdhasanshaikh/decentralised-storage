import React, { Component } from "react";
import "./file-container.css";

import filePdfIcon from "../../../../../asserts/file-pdf-icon.png";
import filePdfIconActive from "../../../../../asserts/file-pdf-icon-active.png";
import fileImgIcon from "../../../../../asserts/file-img-icon.png";
import fileImgIconActive from "../../../../../asserts/file-img-icon-active.png";
import fileVideoIcon from "../../../../../asserts/file-video-icon.png";
import fileVideoIconActive from "../../../../../asserts/file-video-icon-active.png";
import fileTxtIcon from "../../../../../asserts/file-txt-icon.png";
import fileTxtIconActive from "../../../../../asserts/file-txt-icon-active.png";

class FileContainer extends Component {
  state = {
    isFileClick: false,
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

  handleFileClick = () => {
    let isFileClick = this.state.isFileClick;
    this.setState({
      isFileClick: !isFileClick,
    });
  };

  render() {
    let file = this.props.file;
    return (
      <div>
        <div
          className={file.active ? "file-container-active" : "file-container"}
          onClick={() => this.handleFileClick()}>
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
        {this.state.isFileClick ? (
          <div className="file-more-option">
            <div
              onClick={() => {
                this.handleFileClick();
                this.props.handleFileContainerClick();
              }}>
              More Details
            </div>
            <div
              onClick={() => {
                this.handleFileClick();
                this.props.handleFileDownloadRequest();
              }}>
              Download
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default FileContainer;
