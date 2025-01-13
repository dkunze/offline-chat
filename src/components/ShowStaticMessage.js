import React from 'react'
import { Typography, Box } from '@mui/material'

const ShowStaticMessage = () => {
  return (
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
      <Typography variant="h6">
        You must select a contact to start the chat
      </Typography>
    </Box>
  )
}

export default ShowStaticMessage
