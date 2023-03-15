console.log('background loaded')

let menuInfo = {
    id: "ITSD Search In Salesforce",
    title: "Search salesforce for \"%s\"",
    contexts: ["selection"]
}
chrome.contextMenus.create(menuInfo)

chrome.contextMenus.onClicked.addListener((clickedMenu) => {
    if(clickedMenu.menuItemId === menuInfo.id && clickedMenu.selectionText.length > 0){
        const searchTerm = clickedMenu.selectionText.trim()
            searchInSalesforce(searchTerm, getCurrentTab())
    }
})

async function getCurrentTab(){
    let queryOptions = {
        active: true, lastFocusedWindow: true
    }
    let [tab] = await chrome.tabs.query(queryOptions)
    return tab
}

let createdTabId = 'itsdExtension'

function searchInSalesforce(term, tab){
    term = term.trim()
    const newTabInfo = {
        url: `https://sunrun.my.salesforce.com/_ui/search/ui/UnifiedSearchResults?searchType=2&sen=001&sen=003&sen=a7Z&sen=500&sen=005&sen=0Hn&sen=006&sen=810&sen=a08&sen=a7e&str=${term}`,
        active: true,
    }

    if(createdTabId == 'itsdExtension'){
        chrome.tabs.create(newTabInfo, tab => {
            createdTabId = tab.id
        })
    } else {
        chrome.tabs.get(createdTabId, tab => {
            if(tab){
                chrome.tabs.update(tab.id, newTabInfo)
            } else {
                chrome.tabs.create(newTabInfo, tab => {
                    createdTabId = tab.id
                })
            }
        })
    }
}