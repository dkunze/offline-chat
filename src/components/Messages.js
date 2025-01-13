import React from 'react'
import { Box, List, ListItem, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckIcon from '@mui/icons-material/Check'

const Messages = ({ messageListRef, messages, user, formatTimestamp }) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: 2,
        maxHeight: 'calc(100vh - 200px)',
      }}
      ref={messageListRef}
    >
      <List sx={{ width: '100%' }}>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            <Box
              sx={{
                padding: 1,
                backgroundColor:
                  msg.userId === user?.uid ? '#DCF8C6' : '#FFFFFF',
                borderRadius: 2,
                alignSelf: msg.userId === user?.uid ? 'flex-end' : 'flex-start',
                marginBottom: 1,
                maxWidth: '70%',
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
              <Typography variant="caption" sx={{ textAlign: 'right' }}>
                {formatTimestamp(msg.timestamp)}
              </Typography>
              {/* Status icon */}
              {msg.status === 'sending' && <AccessTimeIcon fontSize="10" />}
              {msg.status === 'sent' && <CheckIcon fontSize="10" />}
              {msg.status === 'read' && (
                <>
                  <CheckIcon fontSize="10" />
                  <CheckIcon fontSize="10" /> {/* Doble tilde */}
                </>
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default Messages
