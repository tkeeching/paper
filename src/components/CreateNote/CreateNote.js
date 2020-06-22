import React from 'react';

function CreateNote(props) {
  const { 
    hideTitleField, 
    handleSubmit, 
    showTitleField, 
    handleInputChange,
    editMode,
    titleField,
    title,
    body,
    textareaRow,
    submitBtn 
  } = props;

  return (
    <div className="form-wrapper">
      <div
        className="form-backdrop"
        onClick={hideTitleField}>
      </div>
      <form 
        className="form" 
        onSubmit={handleSubmit}
        onClick={showTitleField}>
        <div className="input-wrapper">
          <input
            type={!editMode ? titleField : "hidden"}
            name="title"
            value={!editMode ? title : ''}
            onChange={handleInputChange}
            placeholder="Title" />
          <textarea
            name="body"
            value={!editMode ? body : ''}
            onChange={handleInputChange}
            id="textarea"
            rows={textareaRow}
            placeholder="Take a note...">
          </textarea>
        </div>
        <div className="input-btn-wrapper">
          <input type={submitBtn} value="+"/>
        </div>
      </form>
    </div>
  )
}

export default CreateNote;