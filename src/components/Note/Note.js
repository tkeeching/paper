import React from 'react';

function Note(props) {
  const { id, onClick, title, body } = props;

  return (
    <div
      key={id}
      className="note-entry"
      onClick={() => onClick(id)}>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  )
}

export default Note;