import React, { useState, useEffect, useCallback } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig' // Asegúrate de importar db
import AuthForm from '../components/AuthForm'

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(true)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const toggleAuthMode = () => {
    setIsRegister(!isRegister)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const handleAuthSuccess = useCallback(async () => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.email) // Usamos el email como ID del documento
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists()) {
          // Si el documento no existe, lo creamos
          await setDoc(userRef, {
            email: user.email,
            uid: user.uid,
            createdAt: new Date(),
          })

          console.log('Documento de usuario creado en Firestore')
        }

        // Redirigir al chat
        navigate('/chat')
      } catch (error) {
        console.error('Error al crear el documento del usuario:', error)
      }
    }
  }, [user, navigate])

  useEffect(() => {
    if (user) {
      handleAuthSuccess()
    }
  }, [handleAuthSuccess, user])

  return (
    <div>
      <AuthForm
        isRegister={isRegister}
        onAuthSuccess={handleAuthSuccess}
        toggleAuthMode={toggleAuthMode}
      />
    </div>
  )
}

export default AuthPage
