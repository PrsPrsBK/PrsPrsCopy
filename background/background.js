console.log('ppcopy');
if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}
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

browser.tabs.onUpdated.addListener((tabId, chgInfo, tab) => {
  console.log(`chgInfo ${JSON.stringify(chgInfo)}`);
  if(chgInfo.status === 'complete') {
    if(tab.url.startsWith('https://twitter.com')) {
      browser.tabs.executeScript(tabId, {
        file: '/content_scripts/tweetPicker.js',
      });
    }
  }
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
        if(!tab.url.startsWith('https://twitter.com')) {
          browser.tabs.executeScript(tab.id, {
            file: '/content_scripts/textPicker.js',
          });
        }
      }
    });
  }
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.task === 'what') {
    browser.tabs.sendMessage(sender.tab.id, {
      task: 'what',
      target: defaultTargets
    });
    //Google Chrome, sendResponse not work.
    //sendResponse({
    //  task: 'what',
    //  target: defaultTargets
    //});
  }
  else if(message.task === 'copyEnd') {
    console.log(`copy end ${JSON.stringify(message.result)}`);
  }
});

// vim:expandtab ff=dos fenc=utf-8 sw=2

