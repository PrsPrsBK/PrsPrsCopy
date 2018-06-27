if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}

const injected = {};

const registered = [
  {
    url: 'https://twitter.com',
    templates: [
      [
        {string: '<dt><a href="'},
        {twitter: 'url'},
        {string: '">'},
        {twitter: 'datetime'},
        {string: ' '},
        {twitter: 'username'},
        {string: '</a>: '},
        {twitter: 'text'},
        {string: '</dt>'},
      ],
      [
        {string: '('},
        {twitter: 'datetime'},
        {string: ' '},
        {twitter: 'username'},
        {string: ')'},
        {string: '['},
        {twitter: 'url'},
        {string: ']'},
      ],
    ],
  },
];

const defaultTargets = [
  [
    {string: '<dt><a href="'},
    {plain: 'url'},
    {string: '">'},
    {plain: 'title'},
    {string: '</a></dt>'},
  ],
  [
    {string: '<a href="'},
    {plain: 'url'},
    {string: '">'},
    {plain: 'title'},
    {string: '</a>'},
  ],
  [
    {string: '`'},
    {plain: 'title'},
    {string: ' <'},
    {plain: 'url'},
    {string: '>`__'},
  ],
  [
    {string: '('},
    {plain: 'title'},
    {string: ')'},
    {string: '['},
    {plain: 'url'},
    {string: ']'},
  ],
];

const onError = (err) => {
  console.log(`${err}`);
};

const getTemplates = (url) => {
  for(const site of registered) {
    if(url.startsWith(site.url)) {
      return site.templates;
    }
  }
  return defaultTargets;
};

const tellWhat = (tab) => {
  const templateArr = getTemplates(tab.url);
  const curTgt = templateArr[injected[tab.id].index];
  injected[tab.id].index = ++injected[tab.id].index % templateArr.length;
  browser.tabs.sendMessage(tab.id, {
    task: 'what',
    target: curTgt
  });
  //Google Chrome, sendResponse not work.
  //sendResponse({
  //  task: 'what',
  //  target: curTgt
  //});
};

browser.tabs.onUpdated.addListener((tabId, chgInfo, tab) => {
  //console.log(`chgInfo ${JSON.stringify(chgInfo)}`);
  if(chgInfo.status === 'complete') {
    if(tab.url.startsWith('https://twitter.com')) {
      //when move from twitter to twitter, content scripts remain loaded.
      if(injected[tab.id] && injected[tab.id].loaded && injected[tab.id].twitter) {
        injected[tab.id].index = 0;
      }
      else {
        injected[tab.id] = {
          loaded: false,
          twitter: true,
          index: 0,
        };
      }
    }
    else {
      injected[tab.id] = {
        loaded: false,
        twitter: false,
        index: 0,
      };
    }
  }
});

browser.tabs.onRemoved.addListener((tabId, rmInfo) => {
  injected[tabId] = undefined;
});

browser.commands.onCommand.addListener((cmd) => {
  if(cmd === 'PrsPrsCopy') {
    //Google Chrome, Promise not work.
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
        console.log(`url: ${tab.url}`);
        if(tab.url.startsWith('https://twitter.com')) {
          if(injected[tab.id].loaded) {
            tellWhat(tab);
          }
          else {
            browser.tabs.executeScript(tab.id, {
              file: '/content_scripts/tweetPicker.js',
            });
            injected[tab.id].loaded = true;
          }
        }
        else {
          if(injected[tab.id].loaded) {
            tellWhat(tab);
          }
          else {
            browser.tabs.executeScript(tab.id, {
              file: '/content_scripts/textPicker.js',
            });
            injected[tab.id].loaded = true;
          }
        }
      }
    });
  }
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.task === 'what') {
    tellWhat(sender.tab);
  }
  else if(message.task === 'resetTemplateIndex') {
    injected[sender.tab.id].index = 0;
  }
  else if(message.task === 'copyEnd') {
    console.log(`copy end ${JSON.stringify(message.result)}`);
  }
});

// vim:expandtab ff=dos fenc=utf-8 sw=2

