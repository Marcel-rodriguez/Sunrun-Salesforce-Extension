import React, {createContext, useEffect, useState} from "react";

export const PopupContext = createContext()

export const PopupProvider = props => {
    const [isSpacingChecked, setIsSpacingChecked] = useState(false)

    chrome.storage.sync.get(['isSpacingChecked'], (resp) => {
        setIsSpacingChecked(resp['isSpacingChecked'])
    })

    chrome.storage.sync.onChanged.addListener(async (resp) => {
        let newValue = resp['isSpacingChecked'].newValue
        setIsSpacingChecked(newValue)
    })

    function handleSpacing(){
        let isSpace = isSpacingChecked
        chrome.storage.sync.set({'isSpacingChecked': !isSpace})
      }


    const contextValue = {isSpacingChecked, setIsSpacingChecked, handleSpacing}
    return (
        <PopupContext.Provider value={contextValue}>
            {props.children}
        </PopupContext.Provider>
    )
}