import firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyAgsgjjdMim8bcJbs_X7_mijWJQfMuIExc',
  authDomain: 'whatsapp-clone-45b8f.firebaseapp.com',
  projectId: 'whatsapp-clone-45b8f',
  storageBucket: 'whatsapp-clone-45b8f.appspot.com',
  messagingSenderId: '282403146650',
  appId: '1:282403146650:web:07c1d73b968c71709c0823',
}

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app()

const db = app.firestore()
const auth = app.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { db, auth, provider }
