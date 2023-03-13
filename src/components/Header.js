import React, {useState} from 'react'
import { TextField } from '@mui/material'

function Header() {
  const [text, setText] = useState('')

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
  )
}

export default Header