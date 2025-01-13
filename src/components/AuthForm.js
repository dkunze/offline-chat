import React, { useState } from 'react'
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
} from '@mui/material'
import { auth } from '../firebaseConfig'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'

const AuthForm = ({ isRegister, onAuthSuccess, toggleAuthMode }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      onAuthSuccess()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
          {isRegister ? 'Register' : 'Login'}
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: '10px 0',
              borderRadius: 4,
              textTransform: 'none',
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            {isRegister ? 'Register' : 'Login'}
          </Button>
        </form>
        <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
          <Button
            onClick={toggleAuthMode}
            sx={{ textTransform: 'none', fontSize: '0.875rem' }}
          >
            {isRegister
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Button>
        </Grid>
      </Box>
    </Container>
  )
}

export default AuthForm
