import firebase from 'firebase'
import { firebaseConfig } from './config'
import 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'

const app = firebase.initializeApp(firebaseConfig)

const auth = app.auth()

const firestore = app.firestore()

const storage = app.storage()

const firebaseAuth = firebase.auth

export { auth, firestore, storage, firebaseAuth }
