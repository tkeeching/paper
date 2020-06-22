import React from 'react';
import './App.css';
import firebase from 'firebase';
import Note from './components/Note/Note';
import CreateNote from './components/CreateNote/CreateNote';
import Editor from './components/Editor/Editor';
import Masonry from 'react-masonry-component';
import * as firebaseui from 'firebaseui';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {
  Switch,
  Route,
  Link
} from 'react-router-dom';

class App extends React.Component {
  state = {
    title: '',
    body: '',
    titleField: "hidden",
    textareaRow: 1,
    submitBtn: "hidden",
    editMode: false,
    editorWrapper: "hidden",
    editor: "hidden",
    editorTitle: '',
    editorBody: '',
    currentNoteID: '',
    currentUserID: '',
    notes: []
  }

  componentDidMount = () => {
    firebase
      .firestore()
      .collection('notes')
      .orderBy('dateCreated', 'desc')
      .onSnapshot(serverUpdate => {
        const notes = serverUpdate.docs
          .map(doc => {
            const data = doc.data();
            data['id'] = doc.id;
            return data;
          })
        this.setState({
          notes: notes
        })
      })

    firebase
      .auth()
      .onAuthStateChanged(user => {
        if (user) {
          // User is signed in.
          const isAnonymous = user.isAnonymous;
          const uid = user.uid;
          console.log('signed in anonymously as :', uid);

          this.setState({
            currentUserID: uid
          })
          // ...
        } else {
          // User is signed out.
          // ...
          console.log('signed out')
        }
        // ...
      });
  }

  newNote = () => {
    const data = {
      title: this.state.title,
      body: this.state.body,
      dateCreated: firebase.firestore.FieldValue.serverTimestamp()
    }
    const setDoc = firebase.firestore().collection('notes').add(data).then(ref => {
    });
  }

  editNote = noteID => {
    const note = this.state.notes.find(note => note.id === noteID);

    if (!note) return;

    this.setState({
      titleField: note.title ? "text" : "hidden",
      title: note.title,
      body: note.body,
      currentNoteID: noteID,
      editMode: true,
      editorWrapper: "editor-wrapper",
      editor: "editor"
    })
  }

  updateNote = noteID => {
    const data = {
      title: this.state.title,
      body: this.state.body,
      dateModified: firebase.firestore.FieldValue.serverTimestamp()
    }
    const setDoc = firebase.firestore().collection('notes').doc(noteID).set(data, { merge: true })
  }

  handleCancel = () => {
    this.setState({
      title: '',
      body: '',
      currentNoteID: '',
      editor: "hidden"
    })
    this.hideTitleField();
  }

  handleDelete = () => {
    if (!this.state.currentNoteID) return;

    firebase.firestore().collection('notes').doc(this.state.currentNoteID).delete();
    this.setState({
      title: '',
      body: '',
      currentNoteID: ''
    })
    this.hideTitleField();
  }

  handleSubmit = e => {
    e.preventDefault();
    if (!this.state.body && !this.state.title) return;

    if (this.state.currentNoteID) this.updateNote(this.state.currentNoteID)
    else this.newNote();

    this.setState({
      title: '',
      body: '',
      currentNoteID: '',
      editMode: false
    })
    this.hideTitleField();
    this.hideEditor(e);
  }

  handleInputChange = e => {
    const value = e.target.value;
    const name = e.target.name;

    this.setState({
      [name]: value,
      textareaRow: this.state.editMode || value.length === 0 ? "1" : "6",
      submitBtn: this.state.editMode || value.length === 0 ? "hidden" : "submit"
    });
  }

  showTitleField = () => {
    if (this.state.titleField === "text") return;

    this.setState({
      titleField: "text"
    })
  }

  hideTitleField = e => {
    this.setState({
      titleField: "hidden",
      textareaRow: 1,
      submitBtn: "hidden"
    })
  }

  handleSignIn = () => {
    firebase
      .auth()
      .signInAnonymously()
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
  }

  hideEditor = e => {
    if (e.target.name === "body" || e.target.name === "title" || e.target.name === "editor-submit") return;

    this.setState({
      titleField: "hidden",
      editorWrapper: "hidden",
      editor: "hidden",
      editMode: false,
      title: '',
      body: '',
      currentNoteID: '',
    })
  }

  render() {
    // Configure FirebaseUI
    const uiConfig = {
      signInFlow: 'popup',
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ]
    };

    const {
      editMode,
      titleField,
      title,
      body,
      textareaRow,
      submitBtn,
      editorWrapper,
      editor,
      notes,
      currentNoteID
    } = this.state;

    return (
      <div className="App">
        <Switch>
          <Route path="/signin">
            <header>
              <Link to="/">Paper</Link>
            </header>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
          </Route>
          <Route path="/">
            <header>
              <Link to="/">Paper</Link>
            </header>
            <CreateNote
              hideTitleField={this.hideTitleField}
              handleSubmit={this.handleSubmit}
              showTitleField={this.showTitleField}
              handleInputChange={this.handleInputChange}
              editMode={editMode}
              titleField={titleField}
              title={title}
              body={body}
              textareaRow={textareaRow}
              submitBtn={submitBtn} />
            <div className="notes-grid-container">
              <Masonry
                options={{
                  gutter: 20,
                  fitWidth: true
                }}
              >
                {
                  notes
                    .map(note => (
                      <Note className="note-entry" key={note.id} id={note.id} onClick={this.editNote} title={note.title} body={note.body} />
                    ))
                }
              </Masonry>
              <Editor
                handleSubmit={this.handleSubmit}
                handleInputChange={this.handleInputChange}
                handleDelete={this.handleDelete}
                hideEditor={this.hideEditor}
                editorWrapper={editorWrapper}
                editor={editor}
                titleField={titleField}
                title={title}
                body={body}
                editMode={editMode}
                currentNoteID={currentNoteID} />
            </div>
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
