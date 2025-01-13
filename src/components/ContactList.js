import React, { useState } from 'react'
import { db } from '../firebaseConfig'
import {
  List,
  ListItem,
  Avatar,
  Typography,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material'
import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  deleteDoc,
  getDocs,
} from 'firebase/firestore'

const ContactList = ({
  contacts,
  selectContact,
  loadingContacts,
  isOffline,
  user,
  setMessages,
  openDeleteConfirm,
  setOpenDeleteConfirm,
  selectedContact,
  setSelectedContact,
}) => {
  const [open, setOpen] = useState(false) // State to control dialog visibility
  const [newContactEmail, setNewContactEmail] = useState('') // State for new contact email
  const [errorMessage, setErrorMessage] = useState('') // State for error message
  const [openSnackbar, setOpenSnackbar] = useState(false) // State to control Snackbar visibility

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setErrorMessage('') // Clear error message when closing the dialog
  }

  const handleAddNewContact = () => {
    handleAddContact(newContactEmail) // Use handleAddContact prop method
    setNewContactEmail('') // Clear the input field
  }

  const handleAddContact = async (contactEmail) => {
    if (!contactEmail.trim()) return

    try {
      if (isOffline) {
        setErrorMessage(
          'You are offline. Cannot add the contact at the moment.'
        )
        setOpenSnackbar(true)
        return
      }

      // Check if contact already exists for the user
      const contactQuery = query(
        collection(db, 'contacts'),
        where('userId', '==', user.uid),
        where('contactEmail', '==', contactEmail)
      )
      const querySnapshot = await getDocs(contactQuery)

      if (!querySnapshot.empty) {
        setErrorMessage('This contact is already added.')
        setOpenSnackbar(true) // Show message for existing contact
        return
      }

      const userRef = doc(db, 'users', contactEmail)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        await addDoc(collection(db, 'contacts'), {
          userId: user.uid,
          contactEmail: contactEmail,
        })
        setNewContactEmail('')
        handleClose() // Close the dialog if the contact was added successfully
      } else {
        setErrorMessage('User does not exist')
        setOpenSnackbar(true) // Show error message
      }
    } catch (error) {
      console.error('Error adding contact:', error)
      setErrorMessage(
        'Could not access the database. Ensure you are connected to the internet.'
      )
      setOpenSnackbar(true) // Show error message
    }
  }

  const confirmDeleteChatHistory = async () => {
    try {
      // Query messages for the selected contact
      const messagesQuery = query(
        collection(db, 'messages'),
        where('contactEmail', '==', selectedContact)
      )
      const querySnapshot = await getDocs(messagesQuery)

      // Delete all messages for this chat
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref)
      })

      // Clear the messages state and remove selected contact
      setMessages([])
      setSelectedContact(null) // Remove selected contact
      setOpenDeleteConfirm(false) // Close delete confirmation
      setOpenSnackbar(true) // Show snackbar to confirm deletion
      setErrorMessage('Chat history deleted successfully.')
    } catch (error) {
      console.error('Error deleting chat history:', error)
      setOpenDeleteConfirm(false)
      setErrorMessage('Failed to delete chat history. Please try again.')
      setOpenSnackbar(true)
    }
  }

  return (
    <Box
      sx={{
        width: '30%',
        padding: 2,
        borderRight: '1px solid #ccc',
        height: '100%',
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Contacts
      </Typography>

      {/* Show loading spinner while contacts are loading */}
      {loadingContacts ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List
          sx={{
            width: '100%',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
          }}
        >
          {contacts.map((contact, index) => (
            <ListItem
              button
              key={index}
              onClick={() => selectContact(contact)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 1,
                padding: '8px 16px',
                borderRadius: 2,
                '&:hover': { backgroundColor: '#f1f1f1' },
              }}
            >
              <Avatar sx={{ marginRight: 2 }} />
              <Typography variant="body1">{contact}</Typography>
            </ListItem>
          ))}
        </List>
      )}

      {/* Button to trigger the Add Contact dialog */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleClickOpen}
      >
        Add Contact
      </Button>

      {/* Dialog for adding a new contact */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm" // Make the modal larger
        fullWidth // Makes the modal take 100% of the available width
      >
        <DialogTitle>Add Contact</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Enter Contact's Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newContactEmail}
            onChange={(e) => setNewContactEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddNewContact} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for showing error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        sx={{ width: '50%' }} // Make Snackbar take 50% of the screen width
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={errorMessage.includes('deleted') ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Delete Chat History Confirmation */}
      <Dialog
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this chat history? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirm(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteChatHistory} color="primary">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ContactList
