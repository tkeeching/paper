import React from 'react';

function Editor(props) {
  const {
    editorWrapper,
    hideEditor,
    editor,
    handleSubmit,
    handleInputChange,
    handleDelete,
    titleField,
    title,
    body,
    editMode,
    currentNoteID
  } = props;
  return (
    <div 
      className={editorWrapper}
      onClick={hideEditor}>
      <div className={editor}>
        <form 
          className="form" 
          onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input
              type={titleField}
              name="title"
              value={editMode ? title : ''}
              onChange={handleInputChange}
              placeholder="Title" />
            <textarea
              name="body"
              value={editMode ? body : ''}
              onChange={handleInputChange}
              id="textarea"
              rows="6"
              placeholder="Take a note...">
            </textarea>
            <div className="editor-btn-wrapper">
              {currentNoteID && <input className="editor-delete-btn" type="button" value="Delete" onClick={handleDelete} />}
              <input className="editor-done-btn" name="editor-submit" type="submit" value={currentNoteID ? "Done" : "+"} />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Editor;