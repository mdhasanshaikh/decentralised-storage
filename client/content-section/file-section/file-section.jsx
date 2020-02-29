import React, { Component } from "react";
import "./file-section.css";
import TextField from "../../reusable-components/input/text-field/text-field";

import searchIcon from "../../asserts/search-icon-grey.png";
import gridViewIconGrey from "../../asserts/grid-view-icon-grey.png";
import gridViewIconWhite from "../../asserts/grid-view-icon-white.png";
import listViewIconGrey from "../../asserts/list-view-icon-grey.png";
import listViewIconWhite from "../../asserts/list-view-icon-white.png";

import closeIcon from "../../asserts/close-icon.png";

import ImgBtn from "../../reusable-components/button/img-btn/img-btn";
import GridViewSection from "./grid-view-section/grid-view-section";
import ListViewSection from "./list-view-section/list-view-section";
import FileDetailsSection from "./file-details-section/file-details-section";

class FileSection extends Component {
  state = {
    firstClick: false,
    searchField: {
      id: 1,
      name: "field",
      placeholder: "Field",
      //   label: "Field",
      inputType: "text",
      value: "",
      icon: searchIcon,
      state: "normal"
    },

    viewTools: [
      {
        id: 1,
        name: "grid",
        active: true,
        imgSrc: [gridViewIconWhite, gridViewIconGrey]
      },
      {
        id: 2,
        name: "list",
        active: false,
        imgSrc: [listViewIconWhite, listViewIconGrey]
      }
    ],
    files: [
      {
        id: 1,
        details: {
          name: "chatbot",
          type: "txt",
          size: "4 KB",
          createDate: "19/02/2020",
          lastOpened: "20/02/2020"
        },
        transaction: {
          amount: "0.0025ETH",
          date: "19/02/2020",
          from: "0x0591c3661c044427fBA199124cBEB745116432D2"
        },
        active: false
      },
      {
        id: 2,
        details: {
          name: "Latex4_zip (1)",
          type: "pdf",
          size: "1 MB",
          lastOpened: "18/02/2020",
          createDate: "19/02/2020"
        },
        transaction: {
          amount: "0.0025ETH",
          date: "19/02/2020",
          from: "0x0591c3661c044427fBA199124cBEB745116432D2"
        },
        active: false
      },
      {
        id: 3,
        details: {
          name: "Screen_recording_01",
          type: "video",
          size: "535 KB",
          lastOpened: "16/02/2020",
          createDate: "13/02/2020"
        },
        transaction: {
          amount: "0.0025ETH",
          date: "13/02/2020",
          from: "0x0591c3661c044427fBA199124cBEB745116432D2"
        },
        active: false
      },
      {
        id: 4,
        details: {
          name: "IMG_2002",
          type: "image",
          size: "20 MB",
          lastOpened: "12/02/2020",
          createDate: "11/02/2020"
        },
        transaction: {
          amount: "0.0025ETH",
          date: "11/02/2020",
          from: "0x0591c3661c044427fBA199124cBEB745116432D2"
        },

        active: false
      }
    ],
    detailSection: {
      active: false,
      closeBtn: {
        id: 1,
        name: "grid",
        active: false,
        imgSrc: [closeIcon, closeIcon]
      }
    },
    clickedFile: {}
  };

  handleInputValueChange = event => {
    let searchField = this.state.searchField;
    searchField.value = event.target.value;
    if (searchField.value.length > 0) {
      searchField.state = "active";
    }
    this.setState({ searchField });
  };

  handleImgBtnClick = event => {
    event.persist();
    let viewTools = this.state.viewTools;

    viewTools = viewTools.map(tool => {
      if (
        (tool.name === event.target.name && tool.active === false) ||
        (tool.name === event.target.name && tool.active === true)
      ) {
        tool.active = true;
      } else {
        tool.active = false;
      }
      return tool;
    });

    this.setState({
      viewTools
    });
  };

  handleFileClick = clickFile => {
    const scope = this;

    let files = this.state.files;
    let firstClick = this.state.firstClick;

    let clickedFile = this.state.clickedFile;
    let detailSection = this.state.detailSection;

    files.map(file => {
      if (file.details.name === clickFile.details.name && !file.active) {
        clickedFile = clickFile;
        detailSection.active = true;
        file.active = true;
      } else if (file.details.name === clickFile.details.name && file.active) {
        file.active = false;
        clickedFile = {};
        detailSection.active = false;

        setTimeout(() => {
          scope.setState({ detailSection, clickedFile });
        }, 300);
      } else {
        file.active = false;
      }
      return file;
    });

    if (!firstClick) {
      firstClick = true;
    }

    if (detailSection.active) {
      this.setState({ files, firstClick, clickedFile, detailSection });
    } else {
      this.setState({ files, firstClick });
    }
  };

  handleCloseBtnClick = () => {
    let files = this.state.files;

    files.map(file => {
      file.active = false;
      return file;
    });

    const scope = this;

    setTimeout(() => {
      let detailSection = scope.state.detailSection;
      detailSection.active = false;
      scope.setState({ detailSection, clickedFile: {} });
    }, 300);

    this.setState({ files });
  };

  getContent = () => {
    const viewTools = this.state.viewTools.filter(tool => tool.active === true);
    if (viewTools[0].name === "grid") {
      return (
        <GridViewSection
          files={this.state.files}
          handleFileClick={this.handleFileClick}
          handleFileChange={this.props.handleFileChange}
        />
      );
    } else {
      return (
        <ListViewSection
          files={this.state.files}
          handleFileClick={this.handleFileClick}
          handleFileChange={this.props.handleFileChange}
        />
      );
    }
  };

  getContentClasses = () => {
    const firstClick = this.state.firstClick;
    const detailSectionActive = this.state.detailSection.active;

    if (!firstClick && !detailSectionActive) {
      return "content";
    } else if (firstClick && detailSectionActive) {
      return "content-contract";
    } else if (firstClick && !detailSectionActive) {
      return "content-expand";
    }
  };
  render() {
    return (
      <div className="file-section">
        <div className="top-section">
          <div className="title">All Files</div>
          <div className="tool-section">
            <TextField
              field={this.state.searchField}
              handleInputValueChange={this.handleInputValueChange}
            />
            <div className="view-tools">
              {this.state.viewTools.map(tool => (
                <div
                  className={tool.active ? "tool-active" : "tool"}
                  key={tool.id}>
                  <ImgBtn
                    button={tool}
                    handleImgBtnClick={this.handleImgBtnClick}
                  />
                  {/* <div className="tool-indicator" /> */}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="wrapper">
          <div className="content-holder">
            <div className={this.getContentClasses()}>{this.getContent()}</div>
            {!this.state.detailSection.active ? null : (
              <FileDetailsSection
                file={this.state.clickedFile}
                closeBtn={this.state.detailSection.closeBtn}
                handleCloseBtnClick={this.handleCloseBtnClick}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default FileSection;
