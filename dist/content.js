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
    let color = response['salesforceColor']
    if(isSalesforcePage)
    document.body.style.backgroundColor = color.newValue.toString()
})

let selections = [...document.querySelectorAll('table tbody tr')].map((row) => {
  const [id] = row.querySelectorAll('th')
  return {
    id: id
  }
})


console.log('Extension Loaded')

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.greeting === 'ping'){

    let pageType;
    let currentTab = request.currentTab.url.toString()

    if(currentTab.includes('wfproject')){
      pageType = 'project'
    } else {
      pageType = document.getElementsByClassName('pageType')[0].innerText
    }

    let pResultArr = []
    let pResultUrl = []

    let opptyProposal
    let opptyProposalUrl
    let opptyProject
    let opptyLink
    let opptyName


      let hasProject = false
      let proj
      const pageTh = document.getElementsByTagName('th')
      Object.values(pageTh).forEach((p) => {
        if(p.innerText.toLowerCase().includes('pr-')){
          hasProject = true
          proj = p.innerText
        } else {
          null
        }
      })

      const pResult = document.getElementsByClassName('dataCell')
      Object.values(pResult).forEach((p) => {
        if(p.innerText.includes('PK')){
          pResultArr.push(p.innerText)
          pResultUrl.push(p.firstChild.href)
        }
      })

      // get oppty name for proposals
      if(pageType.toLowerCase() === 'proposal'){
        const opptyResult = document.getElementsByClassName('dataCol col02')
        Object.values(opptyResult).forEach((o) => {
          let pattern = /0066Q000029/
          if(pattern.test(o.firstChild.id)){
            opptyName = o.firstChild.innerText
            opptyLink = o.firstChild.href
          } else {
            null
          }
        })
      }

      if(pageType.toLowerCase() === 'project'){
        let pageLinks = document.getElementsByClassName('lookup-link')
        opptyLink = Object.values(pageLinks)[1].href
        opptyName = Object.values(pageLinks)[1].innerText
      }
      
      if(hasProject){
        opptyProposal = pResultArr[0]
        opptyProposalUrl = pResultUrl[0]
        opptyProject = proj
      } else {
        opptyProposal = ''
        opptyProposalUrl = ''
        opptyProject = ''
      }

    let paths;

    switch(pageType.toLowerCase()){
      case "opportunity":
        paths = ['//*[@id="bodyCell"]/div[1]/div[1]/div[1]/h2','//*[@id="ep"]/div[2]/div[11]/table/tbody/tr[1]/td[2]','//*[@id="ep"]/div[2]/div[11]/table/tbody/tr[6]/td[4]']
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


      let opptyInfo = [pageType, opportunityURL, data[0], data[1], data[2], opptyProject, opptyProposalUrl]
      let contractInfo = [pageType, opportunityURL, data[0], data[1], data[2], data[3], data[4], data[5], data[6]]
      let projectInfo = [pageType, opportunityURL, data[0], data[1], data[2], opptyProject, opptyLink, opptyName]
      let proposalInfo = [pageType, opportunityURL, data[0], data[1], data[2], opptyProject, opptyLink, opptyName]
      // let userInfo = [pageType, opportunityURL, data[0], data[1], data[2]]


      switch(pageType.toLowerCase()){
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
  }
})