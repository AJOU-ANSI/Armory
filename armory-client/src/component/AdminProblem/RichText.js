import React, {Component} from 'react';
import {Editor, Raw, Block} from 'slate';
import isUrl from 'is-url';
import isImage from 'is-image';

import initialState from './state.json';

import './RichText.css';

const DEFAULT_NODE = 'paragraph';

const defaultBlock = {
  type: 'paragraph',
  isVoid: false,
  data: {}
};

const schema = {
  nodes: {
    'block-quote': props => <blockquote {...props.attributes}>{props.children}</blockquote>,
    'bulleted-list': props => <ul {...props.attributes}>{props.children}</ul>,
    'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
    'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
    'list-item': props => <li {...props.attributes}>{props.children}</li>,
    'numbered-list': props => <ol {...props.attributes}>{props.children}</ol>,
    'image': (props) => {
      const { node, state } = props
      const active = state.isFocused && state.selection.hasEdgeIn(node)
      const src = node.data.get('src')
      const className = active ? 'active' : null
      return (
        <img src={src} className={className} {...props.attributes} />
      )
    },
    paragraph: (props) => {
      return <p {...props.attributes}>{props.children}</p>
    }
  },
  marks: {
    bold: {
      fontWeight: 'bold'
    },
    code: {
      fontFamily: 'monospace',
      backgroundColor: '#eee',
      padding: '3px',
      borderRadius: '4px'
    },
    italic: {
      fontStyle: 'italic'
    },
    underlined: {
      textDecoration: 'underline'
    }
  },
  rules: [
    // Rule to insert a paragraph block if the document is empty.
    {
      match: (node) => {
        return node.kind === 'document'
      },
      validate: (document) => {
        return document.nodes.size ? null : true
      },
      normalize: (transform, document) => {
        const block = Block.create(defaultBlock)
        transform.insertNodeByKey(document.key, 0, block)
      }
    },
    // Rule to insert a paragraph below a void node (the image) if that node is
    // the last one in the document.
    {
      match: (node) => {
        return node.kind === 'document'
      },
      validate: (document) => {
        const lastNode = document.nodes.last()
        return lastNode && lastNode.isVoid ? true : null
      },
      normalize: (transform, document) => {
        const block = Block.create(defaultBlock)
        transform.insertNodeByKey(document.key, document.nodes.size, block)
      }
    }
  ]
};

class RichText extends Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  state = {
    state: Raw.deserialize(initialState, { terse: true })
  };

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = (type) => {
    const { state } = this.state
    return state.marks.some(mark => mark.type === type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = (type) => {
    const { state } = this.state
    return state.blocks.some(node => node.type === type)
  }

  /**
   * On change, save the new state.
   *
   * @param {State} state
   */

  onChange = (state) => {
    this.setState({ state })
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  onKeyDown = (e, data, state) => {
    if (!data.isMod) return
    let mark

    switch (data.key) {
      case 'b':
        mark = 'bold'
        break
      case 'i':
        mark = 'italic'
        break
      case 'u':
        mark = 'underlined'
        break
      case '`':
        mark = 'code'
        break
      default:
        return
    }

    state = state
      .transform()
      .toggleMark(mark)
      .apply()

    e.preventDefault()
    return state
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} e
   * @param {String} type
   */

  onClickMark = (e, type) => {
    e.preventDefault()
    let { state } = this.state

    state = state
      .transform()
      .toggleMark(type)
      .apply()

    this.setState({ state })
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} e
   * @param {String} type
   */

  onClickBlock = (e, type) => {
    e.preventDefault()
    let { state } = this.state
    const transform = state.transform()
    const { document } = state

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      }

      else {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
      }
    }

    // Handle the extra wrapping required for list buttons.
    else {
      const isList = this.hasBlock('list-item')
      const isType = state.blocks.some((block) => {
        return !!document.getClosest(block.key, parent => parent.type === type)
      })

      if (isList && isType) {
        transform
          .setBlock(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        transform
          .unwrapBlock(type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
          .wrapBlock(type)
      } else {
        transform
          .setBlock('list-item')
          .wrapBlock(type)
      }
    }

    state = transform.apply()
    this.setState({ state })
  }

  /**
   * On clicking the image button, prompt for an image and insert it.
   *
   * @param {Event} e
   */

  onClickImage = (e) => {
    e.preventDefault()
    const src = window.prompt('Enter the URL of the image:')
    if (!src) return
    let { state } = this.state
    state = this.insertImage(state, src)
    this.onChange(state)
  }

  /**
   * On drop, insert the image wherever it is dropped.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  onDrop = (e, data, state, editor) => {
    switch (data.type) {
      case 'files': return this.onDropOrPasteFiles(e, data, state, editor)
      case 'node': return this.onDropNode(e, data, state)
    }
  }

  onClickSave = () => {
    console.log(JSON.stringify((Raw.serialize(this.state.state))));
  }

  /**
   * On drop node, insert the node wherever it is dropped.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  onDropNode = (e, data, state) => {
    return state
      .transform()
      .deselect()
      .removeNodeByKey(data.node.key)
      .select(data.target)
      .insertBlock(data.node)
      .apply()
  }

  /**
   * On drop or paste files, read and insert the image files.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  onDropOrPasteFiles = (e, data, state, editor) => {
    for (const file of data.files) {
      const reader = new FileReader()
      const [ type ] = file.type.split('/')
      if (type !== 'image') continue

      reader.addEventListener('load', () => {
        state = editor.getState()
        state = this.insertImage(state, reader.result)
        editor.onChange(state)
      })

      reader.readAsDataURL(file)
    }
  }

  /**
   * On paste, if the pasted content is an image URL, insert it.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  onPaste = (e, data, state, editor) => {
    switch (data.type) {
      case 'files': return this.onDropOrPasteFiles(e, data, state, editor)
      case 'text': return this.onPasteText(e, data, state)
    }
  }

  /**
   * On paste text, if the pasted content is an image URL, insert it.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  onPasteText = (e, data, state) => {
    if (!isUrl(data.text)) return
    if (!isImage(data.text)) return
    return this.insertImage(state, data.text)
  }

  /**
   * Insert an image with `src` at the current selection.
   *
   * @param {State} state
   * @param {String} src
   * @return {State}
   */

  insertImage = (state, src) => {
    return state
      .transform()
      .insertBlock({
        type: 'image',
        isVoid: true,
        data: { src }
      })
      .apply()
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render = () => {
    return (
      <div className="RichText">
        <div>
          {this.renderToolbar()}
          {this.renderEditor()}
        </div>
        <button type="button" className="btn btn-success" onClick={this.onClickSave}> 기록 </button>
      </div>
    )
  }

  /**
   * Render the toolbar.
   *
   * @return {Element}
   */

  renderToolbar = () => {
    return (
      <div className="menu toolbar-menu">
        {this.renderMarkButton('bold', 'format_bold')}
        {this.renderMarkButton('italic', 'format_italic')}
        {this.renderMarkButton('underlined', 'format_underlined')}
        {this.renderMarkButton('code', 'code')}
        {this.renderBlockButton('heading-one', 'looks_one')}
        {this.renderBlockButton('heading-two', 'looks_two')}
        {this.renderBlockButton('block-quote', 'format_quote')}
        {this.renderBlockButton('numbered-list', 'format_list_numbered')}
        {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
        <span className="button" onMouseDown={this.onClickImage}>
          <span className="material-icons">image</span>
        </span>
      </div>
    )
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)
    const onMouseDown = e => this.onClickMark(e, type)

    return (
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )
  }

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderBlockButton = (type, icon) => {
    const isActive = this.hasBlock(type)
    const onMouseDown = e => this.onClickBlock(e, type)

    return (
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )
  }

  /**
   * Render the Slate editor.
   *
   * @return {Element}
   */

  renderEditor = () => {
    return (
      <div className="card">
      <div className="editor card-block">
        <Editor
          spellCheck
          placeholder={'Enter some rich text...'}
          schema={schema}
          state={this.state.state}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onDrop={this.onDrop}
          onPaste={this.onPaste}
        />
      </div>
      </div>
    )
  }

}

/**
 * Export.
 */

export default RichText
