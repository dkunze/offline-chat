import React from 'react'
import { Menu, MenuItem } from '@mui/material'

const OptMenu = ({ anchorEl, setAnchorEl, handleLogout }) => {
  const handleCloseSettings = () => setAnchorEl(null)

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleCloseSettings}
    >
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  )
}

export default OptMenu
