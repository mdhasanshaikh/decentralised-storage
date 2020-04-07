import React, { Component } from "react";
import "./list-view-section.css";

import addIcon from "../../../../asserts/add-icon.png";

class ListViewSection extends Component {
  state = {
    isFileClick: false,
  };

  handleFileClick = () => {
    let isFileClick = this.state.isFileClick;
    this.setState({
      isFileClick: !isFileClick,
    });
  };

  render() {
    return (
      <div className="list-view-section">
        {this.props.files ? (
          <div className="list-title">
            <div>File Name</div>
            <div>Last Opened</div>
            <div>File size</div>
          </div>
        ) : null}
        <div className="list-content">
          {this.props.files
            ? this.props.files.map((file) => (
                <div>
                  <div
                    key={file.id}
                    className={file.active ? "list-row-active" : "list-row"}
                    onClick={() => this.props.handleFileClick(file)}>
                    <div>{file.details.name}</div>
                    <div>{file.details.lastOpened}</div>
                    <div>{file.details.size}</div>
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
              ))
            : null}
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
