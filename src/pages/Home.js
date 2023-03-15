import React, {useState, useEffect, useRef} from 'react'
import { Button } from '@mui/material'


function Home() {
  const [data, setData] = useState([])
  const pref = useRef();

  useEffect(() => {
      getData().then((resp) => {
          setData(resp)
      })
  }, [])
  
  let msg = "ping"
  async function getData(){
      const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
      let response = await chrome.tabs.sendMessage(tab.id, {greeting: msg, currentTab: tab})
      return [response.data]
  }

  function getRef(){
    let info = pref.current.outerText
    navigator.clipboard.writeText(info)
  }
  
  return (
    <div className='homeContainer'>
      {data.length > 0 && data.map((dat) => {
        if(dat[0].toLowerCase() === 'opportunity' || dat[0].toLowerCase() === 'project' || dat[0].toLowerCase() === 'proposal'){
          return (
            <div key={dat[0]} className='customerInfo'>
              <div className='pageType'>Currently viewing: {dat[0]}</div>
              <div ref={pref} className='popupInfo'>
              <p>Oppty/Project Number: {dat[2]}</p>
              <p>Link for proposal and oppty: {dat[1]} </p>
              <p>Customer name and Address: {dat[3]} {dat[4]}</p>
              <p>Screenshot of error (type out information in SS): </p>
              <p>What is the user/rep trying to accomplish?:</p>
              <p>Troubleshooting steps taken:</p>
              <p>T - Salesforce: </p>
              <p>*Clarify whether this is an issue with Brightpath, Salesforce, or SPLat*</p>
              </div>
            </div>
          )
        } else if(dat[0].toLowerCase() === 'service contract'){
          return (
            <div key={dat[0]} className='customerInfo'>
              <div className='pageType'> Currently Viewing: {dat[0]}</div>
              <div ref={pref} className='popupInfo'>
              <p>Gathered Customer -</p>
              <p>Issue/Problem:</p>
              <p>Email: {dat[4]}</p>
              <p>Name: {dat[3]} </p>
              <p>Address with Zip Code: {dat[5]} {dat[6]}, {dat[7]} {dat[8]}</p>
              <p>Account #: {dat[2]}</p>
              <br />
              <br />
              <p>T - MySunrun:</p> 
              <p>Escalating to Tier II</p>
              </div>
            </div>
          )
        } else if(dat[0].toLowerCase() === 'user'){
          <div>
            <p>dat[2]</p>
          </div>
        }
      })}
      {!data.length > 0 &&<div className='loadError'>
        <h3>Uh Oh! Data Not Found</h3>
        <p>Please load an Opportunity, a Project, a Service Contract, or a proposal in Salesforce. </p>
        </div>}
              <Button onClick={() => getRef()} variant="contained" size="small" style={{
                  marginBottom: ".5rem"
              }}>Copy Template</Button>
    </div>
  )
}
export default Home