import React, { useState, useEffect, useRef } from 'react'
import { Container, Box, Snackbar, Alert } from '@mui/material'
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
  getDocs,
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

  // Snackbar state for unread messages notification
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)

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
        where('fromEmail', 'in', [user.email, selectedContact])
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

  // Track unread messages
  useEffect(() => {
    if (user) {
      const unreadMessagesQuery = query(
        collection(db, 'messages'),
        where('sendTo', '==', user.email),
        where('isRead', '==', false)
      )

      const unsubscribeUnreadMessages = onSnapshot(
        unreadMessagesQuery,
        (snapshot) => {
          const unreadMessagesCount = snapshot.size
          setUnreadMessageCount(unreadMessagesCount)

          // Trigger Snackbar when new unread messages arrive
          if (unreadMessagesCount > 0) {
            setOpenSnackbar(true)
          }
        }
      )

      return () => unsubscribeUnreadMessages()
    }
  }, [user])

  const handleSendMessage = async () => {
    if (message.trim() === '' || !selectedContact || !user) return // Ensure user is not null

    // Check if there is an internet connection
    if (isOffline) {
      // Store message locally for later synchronization
      storeMessageLocally(message)
      // Mark message as 'sending via Bluetooth' and update UI
      setMessage('')
      return
    }

    try {
      // Send the message and change its status to "sending"
      const newMessageRef = await addDoc(collection(db, 'messages'), {
        text: message,
        userId: user.uid, // The authenticated user's ID
        sendTo: selectedContact, // The selected contact's email
        fromEmail: user.email, // The selected contact's email
        timestamp: new Date(),
        status: 'sending', // Initial status as "sending"
        isRead: false,
      })

      setMessage('')
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

  const storeMessageLocally = (messageText) => {
    const savedMessages =
      JSON.parse(localStorage.getItem('savedMessages')) || []
    savedMessages.push({
      text: messageText,
      timestamp: new Date(),
      status: 'sending via Bluetooth',
      fromEmail: user.email,
      sendTo: selectedContact,
    })
    localStorage.setItem('savedMessages', JSON.stringify(savedMessages))
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
    if (selectedContact === email) return
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

  const handleDeleteChatHistory = async () => {
    // Confirmation before deletion
    setOpenDeleteConfirm(true)
  }

  // Function to close Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  const markMessagesAsRead = async () => {
    const unreadMessagesQuery = query(
      collection(db, 'messages'),
      where('fromEmail', '==', selectedContact),
      where('sendTo', '==', user.email),
      where('isRead', '==', false)
    )
    const querySnapshot = await getDocs(unreadMessagesQuery)
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, { isRead: true })
    })
  }

  const sendMessageViaBluetooth = async (messageText) => {
    try {
      // Use Web Bluetooth API to send the message via Bluetooth
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['battery_service'] }], // Customize this filter for Bluetooth communication
      })

      // Connect to the device and send the message
      const server = await device.gatt.connect()
      const service = await server.getPrimaryService('battery_service') // Change to the appropriate service
      const characteristic = await service.getCharacteristic('battery_level') // Change to the appropriate characteristic

      // Send the message (you will need to modify this based on Bluetooth service and characteristics)
      await characteristic.writeValue(new TextEncoder().encode(messageText))
      console.log('Message sent via Bluetooth: ', messageText)
    } catch (error) {
      console.error('Error sending message via Bluetooth:', error)
    }
  }

  useEffect(() => {
    if (!isOffline) {
      // Sync saved messages when back online
      const savedMessages =
        JSON.parse(localStorage.getItem('savedMessages')) || []
      savedMessages.forEach((savedMessage) => {
        if (savedMessage.status === 'sending via Bluetooth') {
          sendMessageViaBluetooth(savedMessage.text)
        }
        // Send the message via normal method (network)
        handleSendMessage(savedMessage.text)
      })

      // Clear saved messages after successful send
      localStorage.removeItem('savedMessages')
    }
  }, [isOffline])

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
                markMessagesAsRead={markMessagesAsRead}
              />

              {/* Message input */}
              <MessageInput
                message={message}
                setMessage={setMessage}
                handleSendMessage={handleSendMessage}
                markMessagesAsRead={markMessagesAsRead}
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

      {/* Snackbar for unread messages notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        sx={{ width: '50%' }} // Make Snackbar take 50% of the screen width
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="info"
          sx={{ width: '100%' }}
        >
          You have {unreadMessageCount} unread messages!
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Chat
