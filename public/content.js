const activeURL = window.location.href.toString()
const pattern = /sunrun.my.salesforce/
const pattern2 = /visual.force.com/

let isSalesforcePage = pattern.test(activeURL) || pattern2.test(activeURL)
console.log(isSalesforcePage, activeURL)

chrome.storage.sync.get('salesforceColor', (resp) => {
  for (key in resp){
    if(isSalesforcePage)
    document.body.style.backgroundColor = resp[key].toString()
  }
})

chrome.storage.sync.onChanged.addListener(async (response) => {
  for (key in response){
    let color = response[key]
    if(isSalesforcePage)
    document.body.style.backgroundColor = color.newValue.toString()
  }
})


console.log('Extension Loaded')

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  let currentTab = request.currentTab.url.toString()

  let pageType;

  if(currentTab.includes('wfproject')){
    pageType = 'project'
  } else {
    pageType = document.getElementsByClassName('pageType')[0].innerText
  }


    let paths;

    switch(pageType.toLowerCase()){
      case "opportunity":
        paths = ['//*[@id="ep"]/div[2]/div[9]/table/tbody/tr[28]/td[4]','//*[@id="ep"]/div[2]/div[11]/table/tbody/tr[1]/td[2]','//*[@id="ep"]/div[2]/div[11]/table/tbody/tr[6]/td[4]']
        break;
      case "service contract":
        paths = ['//*[@id="bodyCell"]/div[1]/div[1]/div[1]/h2', '//*[@id="ep"]/div[2]/div[5]/table/tbody/tr[1]/td[2]', '//*[@id="ep"]/div[2]/div[5]/table/tbody/tr[1]/td[4]/a', '//*[@id="ep"]/div[2]/div[5]/table/tbody/tr[2]/td[2]', '//*[@id="ep"]/div[2]/div[5]/table/tbody/tr[3]/td[2]', '//*[@id="ep"]/div[2]/div[5]/table/tbody/tr[4]/td[2]', '//*[@id="ep"]/div[2]/div[5]/table/tbody/tr[5]/td[2]', '//*[@id="ep"]/div[2]/div[5]/table/tbody/tr[4]/td[2]', '//*[@id="ep"]/div[2]/div[5]/table/tbody/tr[5]/td[2]']
        break;
      case "project":
        paths = ['//*/div/div[1]/div/div/div/div/div[2]/h1', '//*/div/table/tbody/tr[2]/td[1]/c-display-fields/div/div/div[2]/div/div/a','//*/div/div/div/div/div[2]/c-wfm-project-details-section/div/div/div[1]/c-display-fields[5]/div/div/div[2]/div/lightning-formatted-rich-text/span']
        break;
      case "proposal":
        paths = ['//*[@id="bodyCell"]/div[1]/div[1]/div[1]/h2', '//*[@id="ep"]/div[2]/div[15]/table/tbody/tr[1]/td[2]', '//*[@id="ep"]/div[2]/div[5]/table/tbody/tr[7]/td[2]']
        break;
      case "user":
        paths = ['//*[@id="bodyCell"]/div[1]/div[1]/div[1]/h2','//*[@id="ep"]/div[2]/div[2]/table/tbody/tr[3]/td[4]/a', '//*[@id="ep"]/div[2]/div[2]/table/tbody/tr[6]/td[2]','//*[@id="_RelatedPermsetAssignmentList_body"]/table']
        break;
    }

    let opportunityURL = window.location.href

    let data;

    if(pageType.toLowerCase() === 'user'){
      data = paths.map((path) => {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
      })  
    } else {
      data = paths.map((path) => {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText
      })
    }


      let opptyInfo = [pageType, opportunityURL, data[0], data[1], data[2]]
      let contractInfo = [pageType, opportunityURL, data[0], data[1], data[2], data[3], data[4], data[5], data[6]]
      let projectInfo = [pageType, opportunityURL, data[0], data[1], data[2]]
      let proposalInfo = [pageType, opportunityURL, data[0], data[1], data[2]]
      let userInfo = [pageType, opportunityURL, data[0], data[1], data[2]]


      switch(request.greeting === "ping" && pageType.toLowerCase()){
        case 'opportunity':
          sendResponse({farewell: "pong", data: opptyInfo});
          break;
        case 'service contract':
          sendResponse({farewell: "pong", data: contractInfo});
          break;
        case 'project':
          sendResponse({farewell: "pong", data: projectInfo});
          break;
        case 'proposal':
          sendResponse({farewell: "pong", data: proposalInfo});
          break;
      }
})