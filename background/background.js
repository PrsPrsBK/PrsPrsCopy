console.log('ppcopy');
if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}

const injected = {};

const defaultTargets = [
  {string: '  <dt><a href="'},
  {plain: 'url'},
  {string: '">'},
  {plain: 'title'},
  {string: '</a></dt>\n'},
];

const onError = (err) => {
  console.log(`${err}`);
};

const tellWhat = (tabId) => {
  browser.tabs.sendMessage(tabId, {
    task: 'what',
    target: defaultTargets
  });
  //Google Chrome, sendResponse not work.
  //sendResponse({
  //  task: 'what',
  //  target: defaultTargets
  //});
};

browser.tabs.onUpdated.addListener((tabId, chgInfo, tab) => {
  console.log(`chgInfo ${JSON.stringify(chgInfo)}`);
  if(chgInfo.status === 'complete') {
    if(tab.url.startsWith('https://twitter.com')) {
      browser.tabs.executeScript(tabId, {
        file: '/content_scripts/tweetPicker.js',
      });
    }
    else {
      injected[tab.id] = false;
    }
  }
});

browser.tabs.onRemoved.addListener((tabId, rmInfo) => {
  injected[tabId] = undefined;
});

browser.commands.onCommand.addListener((cmd) => {
  if(cmd === 'PrsPrsCopy') {
    //const querying = browser.tabs.query({currentWindow: true, active: true});
    //querying.then((tabs) => {
    //  for(const tab of tabs) {
    //    if(!tab.url.startsWith('https://twitter.com')) {
    //      browser.tabs.executeScript(tab.id, {
    //        file: '/content_scripts/textPicker.js',
    //      });
    //    }
    //  }
    //}, onError);
    browser.tabs.query({currentWindow: true, active: true}, (tabs) => {
      for(const tab of tabs) {
        if(!injected[tab.id] && !tab.url.startsWith('https://twitter.com')) {
          browser.tabs.executeScript(tab.id, {
            file: '/content_scripts/textPicker.js',
          });
          injected[tab.id] = true;
        }
        else if(injected[tab.id] && !tab.url.startsWith('https://twitter.com')) {
          tellWhat(tab.id);
        }
      }
    });
  }
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.task === 'what') {
    tellWhat(sender.tab.id);
  }
  else if(message.task === 'copyEnd') {
    console.log(`copy end ${JSON.stringify(message.result)}`);
  }
});

// vim:expandtab ff=dos fenc=utf-8 sw=2

