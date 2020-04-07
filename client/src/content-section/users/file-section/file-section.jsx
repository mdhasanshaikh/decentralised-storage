import React, { Component } from "react";
import "./file-section.css";
import TextField from "../../reusable-components/input/text-field/text-field";

import searchIcon from "../../../asserts/search-icon-grey.png";
import gridViewIconGrey from "../../../asserts/grid-view-icon-grey.png";
import gridViewIconWhite from "../../../asserts/grid-view-icon-white.png";
import listViewIconGrey from "../../../asserts/list-view-icon-grey.png";
import listViewIconWhite from "../../../asserts/list-view-icon-white.png";

import closeIcon from "../../../asserts/close-icon.png";

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
      state: "normal",
    },

    viewTools: [
      {
        id: 1,
        name: "grid",
        active: true,
        imgSrc: [gridViewIconWhite, gridViewIconGrey],
      },
      {
        id: 2,
        name: "list",
        active: false,
        imgSrc: [listViewIconWhite, listViewIconGrey],
      },
    ],

    detailSection: {
      active: false,
      closeBtn: {
        id: 1,
        name: "grid",
        active: false,
        imgSrc: [closeIcon, closeIcon],
      },
    },
    clickedFile: {},
  };

  componentWillMount = () => {
    console.log(this.props.account.files);
    // if (this.props.account.files.length) {
    //   this.props.account.files.map((file) => {
    //     if (file.active) {
    //       let detailSection = this.state.detailSection;
    //       detailSection.active = true;
    //       this.setState({ clickedFile: file, detailSection, firstClick: true });
    //     }
    //     return file;
    //   });
    // }
  };

  handleInputValueChange = (event) => {
    let searchField = this.state.searchField;
    searchField.value = event.target.value;
    if (searchField.value.length > 0) {
      searchField.state = "active";
    }
    this.setState({ searchField });
  };

  handleImgBtnClick = (event) => {
    event.persist();
    let viewTools = this.state.viewTools;

    viewTools = viewTools.map((tool) => {
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
      viewTools,
    });
  };

  handleFileClick = (file) => {
    console.log(file);
    // const scope = this;

    // let files = this.state.files;
    let firstClick = this.state.firstClick;

    let clickedFile = this.state.clickedFile;
    let detailSection = this.state.detailSection;

    if (!detailSection.active) {
      clickedFile = file;
      detailSection.active = true;
    } else {
      clickedFile = {};
      detailSection.active = false;
    }

    if (!firstClick) {
      firstClick = true;
    }
    this.setState(
      { firstClick, clickedFile, detailSection },
      this.props.handleFileClick(this.props.account.id, file.id)
    );
  };

  getContent = () => {
    const viewTools = this.state.viewTools.filter(
      (tool) => tool.active === true
    );
    if (viewTools[0].name === "grid") {
      return (
        <GridViewSection
          files={this.props.account.files}
          handleFileClick={this.handleFileClick}
          handleFileDownloadRequest={this.props.handleFileDownloadRequest}
          handleFileChange={this.props.handleFileChange}
        />
      );
    } else {
      return (
        <ListViewSection
          files={this.props.account.files}
          handleFileClick={this.handleFileClick}
          handleFileDownloadRequest={this.props.handleFileDownloadRequest}
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
              {this.state.viewTools.map((tool) => (
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
            <div className={this.getContentClasses()}>
              {this.props.account.files ? this.getContent() : null}
            </div>
            {!this.state.detailSection.active ? null : (
              <FileDetailsSection
                file={this.state.clickedFile}
                closeBtn={this.state.detailSection.closeBtn}
                handleCloseBtnClick={() =>
                  this.handleFileClick(this.state.clickedFile)
                }
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default FileSection;
