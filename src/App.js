import React from 'react';
import './App.css';
import firebase from 'firebase';
import Masonry from 'react-masonry-component';
import * as firebaseui from 'firebaseui';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {
  Switch,
  Route,
  Link
} from 'react-router-dom';

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

function Notes(props) {
  console.log('displaying notes... ', props.notes)
  // console.log(props.notes[0]?.dateCreated)
  // console.log(props.notes[0]?.dateCreated.seconds)

  return (
    <Masonry
      options={{
          gutter: 20,
          fitWidth: true
        }}
    >
      {
        props.notes
          .map(note => (
            <Note className="note-entry" key={note.id} id={note.id} onClick={props.onClick} title={note.title} body={note.body} />
          ))
      }
    </Masonry>
  )
}

class App extends React.Component {
  state = {
    title: '',
    body: '',
    titleField: "hidden",
    editor: "hidden",
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
        console.log('signed in as :', uid);

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
      console.log('Added document with ID: ', ref.id);
    });
  }

  updateNote = noteID => {
    const data = {
      title: this.state.title,
      body: this.state.body,
      dateModified: firebase.firestore.FieldValue.serverTimestamp()
    }
    const setDoc = firebase.firestore().collection('notes').doc(noteID).set(data, { merge: true })
  }

  editNote = noteID => {
    const note = this.state.notes.find(note => note.id === noteID);
    if (!note) return
    this.setState({
      title: note.title,
      body: note.body,
      currentNoteID: noteID,
      editor: "editor"
    })

    // firebase.firestore().collection('notes').doc(noteID).set(
    //   {
    //     title: this.state.title,
    //     body: this.state.body,
    //     dateCreated: firebase.firestore.FieldValue.serverTimestamp()
    //   }
    // );
  }

  handleCancel = () => {
    this.setState({
      title: '',
      body: '',
      currentNoteID: '',
      editor: "hidden"
    })
  }

  handleDelete = () => {
    if (!this.state.currentNoteID) return
    firebase.firestore().collection('notes').doc(this.state.currentNoteID).delete();
    this.setState({
      title: '',
      body: '',
      currentNoteID: ''
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    if (!this.state.body) return

    if (this.state.currentNoteID) this.updateNote(this.state.currentNoteID)
    else this.newNote();

    this.setState({
      title: '',
      body: '',
      currentNoteID: ''
    })
  }

  handleInputChange = e => {
    const value = e.target.value;
    const name = e.target.name;

    this.setState({
      [name]: value
    });
  }

  showTitleField = () => {
    if (this.state.titleField === "text") return;
    console.log("show");
    this.setState({
      titleField: "text"
    })
  }

  hideTitleField = e => {
    console.log(e.target);
    // if (e.target.id === "textarea") return;
    console.log("hide");
    this.setState({
      titleField: "hidden"
    })
  }

  handleSignIn = () => {
    console.log('signing in...');

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

  render() {
    console.log(this.currentUserID);

    // Configure FirebaseUI
    const uiConfig = {
      // Popup signin flow rather than redirect flow.
      signInFlow: 'popup',
      // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
      signInSuccessUrl: '/',
      // We will display Google and Facebook as auth providers.
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ]
    };

    return (
      <div className="App">
        <h1>Paper</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/signin">Sign In</Link>
        </nav>
        <Switch>
          <Route path="/signin">
            <h2>Please sign in to continue</h2>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
          </Route>
          <Route path="/">
            <div className="form-wrapper">
              <div 
                className="form-backdrop"
                onClick={this.hideTitleField}>
              </div>
              <form 
                className="form" 
                onSubmit={this.handleSubmit}
                onClick={this.showTitleField}>
                <div className="input-wrapper">
                  <input
                    type={this.state.titleField}
                    name="title"
                    value={this.state.title}
                    onChange={this.handleInputChange}
                    placeholder="Title" />
                  <textarea
                    name="body"
                    value={this.state.body}
                    onChange={this.handleInputChange}
                    id="textarea"
                    // cols="30"
                    rows="6"
                    placeholder="Take a note...">
                  </textarea>
                  <input type="submit" value={this.state.currentNoteID ? "Done" : "+"} />
                  {this.state.currentNoteID && <input type="button" value="Cancel" onClick={this.handleCancel} />}
                  {this.state.currentNoteID && <input type="button" value="Delete" onClick={this.handleDelete} />}
                </div>
              </form>
            </div>
            <div className="notes-grid-container">
              <Notes className="notes-flex-container" notes={this.state.notes} onClick={this.editNote} />
              <div className={this.state.editor}>
                <form 
                  className="form" 
                  onSubmit={this.handleSubmit}>
                  <div className="input-wrapper">
                    <input
                      type={this.state.titleField}
                      name="title"
                      value={this.state.title}
                      onChange={this.handleInputChange}
                      placeholder="Title" />
                    <textarea
                      name="body"
                      value={this.state.body}
                      onChange={this.handleInputChange}
                      id="textarea"
                      // cols="30"
                      rows="6"
                      placeholder="Take a note...">
                    </textarea>
                    <input type="submit" value={this.state.currentNoteID ? "Done" : "+"} />
                    {this.state.currentNoteID && <input type="button" value="Cancel" onClick={this.handleCancel} />}
                    {this.state.currentNoteID && <input type="button" value="Delete" onClick={this.handleDelete} />}
                  </div>
                </form>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    );
  }

}

export default App;
