import React from 'react'
import { Box, Typography, IconButton, Avatar } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import DeleteIcon from '@mui/icons-material/Delete'

const HeaderContact = ({
  selectedContact,
  handleClickSettings,
  handleCloseChat,
  handleDeleteChatHistory, // Function to handle deleting chat history
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: 2,
        backgroundColor: '#DDDDDD',
        padding: '10px',
      }}
    >
      <Avatar sx={{ marginRight: 2 }} />
      <Typography variant="h6">{selectedContact}</Typography>

      {/* Settings icon */}
      <IconButton onClick={handleClickSettings} sx={{ marginLeft: 'auto' }}>
        <SettingsIcon />
      </IconButton>

      {/* Delete icon to delete the chat */}
      <IconButton
        onClick={handleDeleteChatHistory}
        sx={{ marginLeft: 1 }}
        color="error" // Use red color for the delete icon to make it stand out
      >
        <DeleteIcon />
      </IconButton>

      {/* Close button */}
      <IconButton onClick={handleCloseChat} sx={{ marginLeft: 1 }}>
        X
      </IconButton>
    </Box>
  )
}

export default HeaderContact
