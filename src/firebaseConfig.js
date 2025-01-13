import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  getFirestore,
  enableIndexedDbPersistence,
  clearIndexedDbPersistence,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

if (process.env.NODE_ENV !== 'production') {
  clearIndexedDbPersistence(db).catch((err) => {
    console.error('Error clearing Firestore persistence:', err)
  })
} else {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.error('Persistence failed due to multiple tabs open')
    } else if (err.code === 'unimplemented') {
      console.error('Persistence is not available in this environment')
    }
  })
}

const auth = getAuth(app)

export { auth, db }
