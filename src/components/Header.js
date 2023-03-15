import React, { useContext, useState } from 'react'
import { TextField } from '@mui/material'
import { PopupContext } from '../context/popupContext'

function Header(props) {
  const [text, setText] = useState('')
  const {isSpacingChecked, handleSpacing} = useContext(PopupContext)

  function handleSubmit(e){
    e.preventDefault()
    let newText = text.toString().toLowerCase()
    if(newText === 'victoria'){
      chrome.storage.sync.set({"salesforceColor": '#FF69B4'})
    } else {
      chrome.storage.sync.set({"salesforceColor": newText})
    }
    setText('')
  }

  return (
    <div className='header'>
      <div className='header-top'>
        <h1 className='logo'>Sunrun</h1>
        <form onSubmit={handleSubmit}>
          <TextField onSubmit={handleSubmit} id="outlined" variant="outlined" label="Change Salesforce color"
           inputProps={{style: {
            height: ".5rem",
          }}}
           value={text} onChange={(e) =>{
            setText(e.target.value)
          }}/>
        </form>
      </div>
      <div className='header-bottom'>
        <label>Remove template spacing</label>
        <input type='checkbox' checked={isSpacingChecked} onChange={() => handleSpacing()}/>
      </div>
    </div>
  )
}

export default Header