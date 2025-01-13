import React, { useEffect } from 'react'
import { Box, List, ListItem, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckIcon from '@mui/icons-material/Check'

const Messages = ({
  messageListRef,
  messages,
  user,
  formatTimestamp,
  markMessagesAsRead,
}) => {
  // Scroll to the bottom of the messages when new messages arrive or user selects a contact
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messageListRef, messages])

  // Trigger marking messages as read when scrolled to the bottom
  const handleScroll = () => {
    const bottom =
      messageListRef.current.scrollHeight ===
      messageListRef.current.scrollTop + messageListRef.current.clientHeight
    if (bottom) {
      markMessagesAsRead() // Call the function to mark messages as read when user scrolls to the bottom
    }
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: 2,
        maxHeight: 'calc(100vh - 200px)',
      }}
      ref={messageListRef}
      onScroll={handleScroll}
    >
      <List sx={{ width: '100%' }}>
        {messages.length ? (
          messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                display: 'flex',
                justifyContent:
                  msg.userId === user?.uid ? 'flex-end' : 'flex-start',
              }}
            >
              <Box
                sx={{
                  padding: 1,
                  backgroundColor:
                    msg.userId === user?.uid ? '#DCF8C6' : '#DDDDDD',
                  borderRadius: 2,
                  maxWidth: '70%',
                  marginBottom: 1,
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
                <Typography variant="caption" sx={{ textAlign: 'right' }}>
                  {formatTimestamp(msg.timestamp)}
                </Typography>
                {/* Status icon */}
                {msg.fromEmail === user.email && (
                  <>
                    {msg.status === 'sending' && (
                      <AccessTimeIcon fontSize="10" />
                    )}
                    {msg.status === 'sent' && (
                      <CheckIcon
                        fontSize="10"
                        color={msg.isRead ? 'success' : 'default'}
                      />
                    )}
                    {msg.isRead && (
                      <>
                        <CheckIcon fontSize="10" color="success" />{' '}
                        {/* Double tick */}
                      </>
                    )}
                  </>
                )}
              </Box>
            </ListItem>
          ))
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            <Typography variant="h6">Say Hi!</Typography>
          </Box>
        )}
      </List>
    </Box>
  )
}

export default Messages
