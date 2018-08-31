if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}

const injected = {};

const registered = [
  {
    url: 'https://twitter.com',
    templates: [
      {
        name: 'dt',
        specArr: [
          {string: '<dt><a href="'},
          {twitter: 'url'},
          {string: '">'},
          {twitter: 'datetime'},
          {string: ' '},
          {twitter: 'username'},
          {string: '</a>: '},
          {twitter: 'text'},
          {string: '</dt>'},
        ]
      },
      {
        name: 'reST',
        specArr: [
          {string: '`'},
          {twitter: 'datetime'},
          {string: ' '},
          {twitter: 'username'},
          {string: ' <'},
          {twitter: 'url'},
          {string: '>`__\n'},
          {string: '  : '},
          {twitter: 'text'},
        ]
      },
      {
        name: 'Markdown',
        specArr: [
          {string: '('},
          {twitter: 'datetime'},
          {string: ' '},
          {twitter: 'username'},
          {string: ')'},
          {string: '['},
          {twitter: 'url'},
          {string: ']'},
        ]
      },
    ],
  },
  //.timestamp > relative-time:nth-child(1)
  {
    url: 'https://foogithub.com/',
    templates: [
      {
        name: 'dt',
        specArr: [
          {string: '<dt><a href="'},
          {plain: 'url'},
          {string: '">'},
          {plain: 'title'},
          {string: '</a></dt>'},
        ]
      },
      {
        name: 'ahref',
        specArr: [
          {string: '<a href="'},
          {plain: 'url'},
          {string: '">'},
          {plain: 'title'},
          {string: '</a>'},
        ]
      },
      /*
       * <a href="#issue-197739209" class="timestamp">
       * <relative-time datetime="2018-06-27T13:47:23Z" title="2018年6月27日 22:47 JST">8 minutes ago
       * </relative-time></a>
       */
      {
        name: 'some',
        specArr: [
          {string: '`'},
          {plain: 'title'},
          {string: ' <'},
          {plain: 'url'},
          {string: '>`__'},
        ]
      },
    ],
  },
];

const defaultTargets = [
  {
    name: 'dt',
    specArr: [
      {string: '<dt><a href="'},
      {plain: 'url'},
      {string: '">'},
      {plain: 'title'},
      {string: '</a></dt>'},
    ]
  },
  {
    name: 'ahref',
    specArr: [
      {string: '<a href="'},
      {plain: 'url'},
      {string: '">'},
      {plain: 'title'},
      {string: '</a>'},
    ]
  },
  {
    name: 'reST',
    specArr: [
      {string: '`'},
      {plain: 'title'},
      {string: ' <'},
      {plain: 'url'},
      {string: '>`__'},
    ]
  },
  {
    name: 'Markdown',
    specArr: [
      {string: '('},
      {plain: 'title'},
      {string: ')'},
      {string: '['},
      {plain: 'url'},
      {string: ']'},
    ]
  },
];

const onError = (err) => {
  console.log(`${err}`);
};

let iconFlip = false;

const updateIconOfTab = (tabId) => {
  browser.browserAction.setIcon({
    path: `icons/icon-48_${iconFlip ? 1 : 0}.png`,
    tabId: tabId
  });
  browser.browserAction.setBadgeText({
    text: `${injected[tabId].index}`,
    tabId: tabId
  });
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
  console.log(`tellWhat: ${tab.url} with ${templateArr[injected[tab.id].index].name}`);
  const curTgt = templateArr[injected[tab.id].index].specArr;
  injected[tab.id].index = ++injected[tab.id].index % templateArr.length;
  iconFlip = !iconFlip;
  updateIconOfTab(tab.id);
  browser.tabs.sendMessage(tab.id, {
    picker: tab.url.startsWith('https://twitter.com') ? 'twitter' : 'default',
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
  console.log(`chgInfo ${JSON.stringify(chgInfo)}`);
  if(chgInfo.status === 'complete') {
    injected[tab.id] = {
      index: 0,
    };
    iconFlip = false;
    updateIconOfTab(tab.id);
  }
});

browser.tabs.onRemoved.addListener((tabId, rmInfo) => {
  console.log('tab removed');
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
        tellWhat(tab);
      }
    });
  }
});

// Only Firefox has openPopup()...
// browser.browserAction.onClicked.addListener((tab) => {
//   console.log(`foo ${browser.extension.getURL('popup/menu.html')}`);
//   browser.browserAction.setPopup({
//     tabId: tab.id,
//     popup: browser.extension.getURL('popup/menu.html'),
//   });
//   //browser.browserAction.openPopup();
// });

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.task === 'resetTemplateIndex') {
    injected[sender.tab.id].index = 0;
    updateIconOfTab(sender.tab.id);
  }
  else if(message.task === 'copyEnd') {
    console.log(`copy end ${JSON.stringify(message.result)}`);
  }
  else if(message.task === 'getCurTemplates') {
    browser.tabs.query({currentWindow: true, active: true}, (tabs) => {
      for(const tab of tabs) {
        console.log(`getCT url: ${tab.url}`);
        const templateArr = getTemplates(tab.url);
        browser.runtime.sendMessage({
          task: 'getCurTemplates',
          result: templateArr,
        });
      }
    });
  }
});

// vim:expandtab ff=dos fenc=utf-8 sw=2
