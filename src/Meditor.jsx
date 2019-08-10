import PropTypes from "prop-types";
import React from "react";
import remarkParse from "remark-parse";
import remarkReact from "remark-react";
import unified from "unified";

import Editor from "./components/Editor.jsx";

import "./Meditor.css";

class Meditor extends React.Component {
  constructor(props) {
    super(props);

    const { defaultValue } = props;
    this.defaultValue = defaultValue !== undefined ? defaultValue : "";

    const jsx = this.convertMarkdownToJsx(this.defaultValue);
    this.state = {
      jsx
    };
  }

  customizeMarkdown(source) {
    const { headersOffset = 1 } = this.props;
    if (headersOffset === 1) return source;

    return source.replace(/^\s*(#+)/gm, `$1${"#".repeat(headersOffset - 1)}`);
  }

  convertMarkdownToJsx(source) {
    const customSource = this.customizeMarkdown(source);

    return unified()
      .use(remarkParse)
      .use(remarkReact)
      .processSync(customSource).contents;
  }

  onChange(output) {
    this.setState({ jsx: output.jsx });

    const { onChange } = this.props;
    if (onChange === undefined) return;

    onChange(output);
  }

  render() {
    const { defaultValue } = this;
    const {
      className = "",
      disabled = false,
      editorClassName = "",
      editorStyle = {},
      noEditor = false,
      noPreview = false,
      noSpellCheck = false,
      previewClassName = "",
      previewStyle = {},
      style = {}
    } = this.props;
    const { jsx } = this.state;

    return (
      <div className={`container ${className}`} style={style}>
        {!noEditor && (
          <Editor
            className={`editor ${editorClassName}`}
            defaultValue={defaultValue}
            disabled={disabled}
            onChange={this.onChange.bind(this)}
            spellCheck={!noSpellCheck}
            style={editorStyle}
          />
        )}
        {!noPreview && (
          <div className={`preview ${previewClassName}`} style={previewStyle}>
            {jsx}
          </div>
        )}
      </div>
    );
  }
}

Meditor.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  editorClassName: PropTypes.string,
  editorStyle: PropTypes.object,
  headersOffset: PropTypes.number,
  onChange: PropTypes.func,
  noEditor: PropTypes.bool,
  noPreview: PropTypes.bool,
  previewStyle: PropTypes.object,
  previewClassName: PropTypes.string,
  noSpellCheck: PropTypes.bool,
  style: PropTypes.object
};

export default Meditor;
