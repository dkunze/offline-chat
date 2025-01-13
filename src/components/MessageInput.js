import React from 'react'
import { TextField, Box, IconButton } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

const MessageInput = ({ message, setMessage, handleSendMessage }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <TextField
        label="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{ marginRight: 2 }}
      />
      <IconButton color="primary" onClick={handleSendMessage}>
        <SendIcon />
      </IconButton>
    </Box>
  )
}

export default MessageInput
