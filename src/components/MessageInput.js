import React, { useState, lazy, Suspense } from 'react'
import {
  TextField,
  Box,
  IconButton,
  Popover,
  CircularProgress,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

// Lazy load the EmojiPicker
const EmojiPicker = lazy(() => import('emoji-picker-react'))

const MessageInput = ({
  message,
  setMessage,
  handleSendMessage,
  markMessagesAsRead,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  const handleOpenEmojiPicker = (event) => {
    // Set the anchorEl to the emoji button
    setAnchorEl(event.currentTarget)
    setIsEmojiPickerOpen(true)
  }

  const handleCloseEmojiPicker = () => {
    setIsEmojiPickerOpen(false)
  }

  const handleEmojiSelect = (emoji) => {
    setMessage(message + emoji.emoji) // Add selected emoji to the message
    handleCloseEmojiPicker()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && message.trim() !== '') {
      handleSendMessage()
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', padding: 2 }}>
      <TextField
        label="Type a message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value)
          markMessagesAsRead()
        }}
        onFocus={() => markMessagesAsRead()}
        fullWidth
        variant="outlined"
        sx={{ marginRight: 2 }}
        onKeyDown={handleKeyPress}
        autoComplete="off"
      />
      <IconButton color="primary" onClick={handleSendMessage}>
        <SendIcon />
      </IconButton>
      <IconButton onClick={handleOpenEmojiPicker}>😊</IconButton>

      <Popover
        open={isEmojiPickerOpen}
        onClose={handleCloseEmojiPicker}
        anchorEl={anchorEl} // The button that opens the popover
        anchorOrigin={{
          vertical: 'bottom', // Align vertically at the bottom of the emoji button
          horizontal: 'center', // Align horizontally at the center of the emoji button
        }}
        transformOrigin={{
          vertical: 'top', // Align the top of the popover with the bottom of the emoji button
          horizontal: 'center', // Align the horizontal center of the popover with the button
        }}
      >
        <Suspense fallback={<CircularProgress />}>
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </Suspense>
      </Popover>
    </Box>
  )
}

export default MessageInput
