import React, { useState, useEffect, useRef } from 'react'
import { Container, Box } from '@mui/material'
import { auth, db } from '../firebaseConfig'
import { useNavigate } from 'react-router-dom'
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  enableNetwork,
  updateDoc,
} from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import ContactList from './ContactList'
import ShowStaticMessage from './ShowStaticMessage'
import OptMenu from './Menu'
import HeaderContact from './HeaderContact'
import Messages from './Messages'
import MessageInput from './MessageInput'

const Chat = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(null)
  const [contacts, setContacts] = useState([])
  const [isOffline, setIsOffline] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [loadingContacts, setLoadingContacts] = useState(true)
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false) // State to control delete confirmation dialog visibility

  const navigate = useNavigate()
  const messageListRef = useRef(null)

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(setUser)
    return () => unsubscribeAuth()
  }, [])

  const checkNetworkStatus = async () => {
    try {
      await enableNetwork(db)
      setIsOffline(false)
    } catch (error) {
      setIsOffline(true)
    }
  }

  useEffect(() => {
    checkNetworkStatus()
  }, [])

  useEffect(() => {
    if (user && user.uid) {
      const contactsQuery = query(
        collection(db, 'contacts'),
        where('userId', '==', user.uid)
      )
      const unsubscribeContacts = onSnapshot(contactsQuery, (snapshot) => {
        setContacts(snapshot.docs.map((doc) => doc.data().contactEmail))
        setLoadingContacts(false)
      })

      return () => {
        unsubscribeContacts()
      }
    }
  }, [user])

  useEffect(() => {
    if (user && selectedContact) {
      const messagesQuery = query(
        collection(db, 'messages'),
        where('contactEmail', 'in', [user.email, selectedContact])
      )
      const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
        const sortedMessages = snapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => a.timestamp - b.timestamp)
        setMessages(sortedMessages)
      })

      return () => {
        unsubscribeMessages()
      }
    }
  }, [user, selectedContact])

  const handleSendMessage = async () => {
    if (message.trim() === '' || !selectedContact || !user) return // Ensure user is not null

    try {
      // Send the message and change its status to "sending"
      const newMessageRef = await addDoc(collection(db, 'messages'), {
        text: message,
        userId: user.uid, // The authenticated user's ID
        contactEmail: selectedContact, // The selected contact's email
        timestamp: new Date(),
        status: 'sending', // Initial status as "sending"
      })

      setMessage('')
      // Auto-scroll to the bottom after sending the message
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight

      // Update the status to "sent" after a short delay (simulating sending)
      setTimeout(async () => {
        await updateDoc(newMessageRef, {
          status: 'sent', // Change status to "sent"
        })
      }, 1000)
    } catch (error) {
      console.error('Error sending the message:', error)
      alert('Error sending the message. Please check your connection.')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUser(null) // Clear user state
      navigate('/')
    } catch (error) {
      console.error('Error logging out:', error)
      alert('There was an error logging out. Please try again.')
    }
  }

  const selectContact = (email) => {
    setSelectedContact(email)
    setMessages([]) // Clear previous messages
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Function to open the settings menu
  const handleClickSettings = (event) => {
    setAnchorEl(event.currentTarget)
  }

  // Function to close the selected chat
  const handleCloseChat = () => {
    setSelectedContact(null)
    setMessages([]) // Clear messages when closing the chat
  }

  // Handle delete chat history
  const handleDeleteChatHistory = async () => {
    // Confirmation before deletion
    setOpenDeleteConfirm(true)
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: '100vh',
          border: '1px solid #ccc',
        }}
      >
        {/* Left Sidebar: Contacts */}
        <ContactList
          loadingContacts={loadingContacts}
          contacts={contacts}
          selectContact={selectContact}
          setSelectedContact={setSelectedContact}
          selectedContact={selectedContact}
          isOffline={isOffline}
          user={user}
          openDeleteConfirm={openDeleteConfirm}
          setOpenDeleteConfirm={setOpenDeleteConfirm}
          setMessages={setMessages}
        />

        {/* Right Panel: Chat */}
        <Box
          sx={{
            width: '70%',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {selectedContact ? (
            <>
              {/* Header: Contact info */}
              <HeaderContact
                selectedContact={selectedContact}
                handleClickSettings={handleClickSettings}
                handleCloseChat={handleCloseChat}
                handleDeleteChatHistory={handleDeleteChatHistory}
              />

              {/* Messages */}
              <Messages
                messageListRef={messageListRef}
                messages={messages}
                user={user}
                formatTimestamp={formatTimestamp}
              />

              {/* Message input */}
              <MessageInput
                message={message}
                setMessage={setMessage}
                handleSendMessage={handleSendMessage}
              />
            </>
          ) : (
            // Show a static message when no contact is selected
            <ShowStaticMessage />
          )}

          {/* Logout Menu */}
          <OptMenu
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            handleLogout={handleLogout}
          />
        </Box>
      </Box>
    </Container>
  )
}

export default Chat
