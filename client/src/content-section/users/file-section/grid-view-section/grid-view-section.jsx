import React, { Component } from "react";
import "./grid-view-section.css";
import FileContainer from "./file-container/file-container";
import axios from "axios";

import addIcon from "../../../../asserts/add-icon.png";

class GridViewSection extends Component {
  state = {};

  viewHandler = async () => {
    axios(`http://localhost:8000/api/files/ipfs`, {
      method: "GET",
      responseType: "blob",
      //Force to receive data in a Blob Format
    })
      .then((response) => {
        //Create a Blob from the PDF Stream
        const file = new Blob([response.data], {
          type: "octet/stream",
        });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = fileURL;
        a.download = "Hello.txt";
        a.click();
        window.URL.revokeObjectURL(fileURL);
        //Open the URL on new Window
        // window.open(fileURL);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="grid-view-section">
        {this.props.files.map((file) => (
          <FileContainer
            key={file.id}
            file={file}
            handleFileContainerClick={() => this.props.handleFileClick(file)}
            handleFileDownloadRequest={() =>
              this.props.handleFileDownloadRequest(file)
            }
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
