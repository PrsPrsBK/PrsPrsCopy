if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}

const injected = {};

const initialStore = [
  {
    default: true,
    templates: [
      {
        name: 'dt',
        specArr: [
          {string: '<dt><a href="'},
          {plain: 'url_nohs'},
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
          {plain: 'today'},
          {string: ' `'},
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
    ],
  },
  {
    urlHead: 'https://twitter.com',
    templates: [
      {
        name: 'dt',
        specArr: [
          {string: '<dt><a href="'},
          {twitter: 'url'},
          {string: '">'},
          {twitter: 'datetime'},
          {string: ' '},
          {twitter: 'username_esc'},
          {string: '</a>: '},
          {twitter: 'text_html'},
          {twitter: 'qt_string', string: ' <div class="quotedTweet"><a href="'},
          {twitter: 'qt_url'},
          {twitter: 'qt_string', string: '">'},
          {twitter: 'qt_username_esc'},
          {twitter: 'qt_string', string: ':</a> '},
          {twitter: 'qt_text_html'},
          {twitter: 'qt_string', string: '</div>'},
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
          {twitter: 'text_reST'},
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
          {twitter: 'text_md'},
        ]
      },
    ],
  },
];

const onError = (err) => {
  console.log(`${err}`);
};

let iconFlip = false;

const restoreEmptyTemplate = () => {
  console.log('health check');
  browser.storage.local.get('arr_by_site', (store_obj) => {
    const result = store_obj['arr_by_site'];
    if(!result || result.length === 0) {
      console.log('oh no let us restore');
      browser.storage.local.set({
        arr_by_site: initialStore,
      });
    }
    else {
      console.log(`${JSON.stringify(result)}`);
    }
  });
};

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

const dearGreatestBrowserGoogleChrome = (tab, templateArr) => {
  if(!templateArr || templateArr.length === 0) {
    browser.browserAction.setBadgeText({
      text: 'none',
      tabId: tab.id,
    });
    return;
  }
  console.log(`requestCopy: ${tab.url} with ${templateArr[injected[tab.id].index].name}`);
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

const getTemplates = (tab) => {
  browser.storage.local.get('arr_by_site', (store_obj) => {
    const result = store_obj['arr_by_site'];
    let ret;
    if(!result || result.length === 0) {
      browser.browserAction.setBadgeText({
        text: 'empty',
        tabId: tab.id,
      });
      return;
    }
    const match1st = result.find((elm) => { return (!elm.urlHead && tab.url.startsWith(elm.urlHead)); });
    if(match1st) {
      console.log('wow url match');
      ret = match1st.templates;
    }
    else {
      console.log('use default');
      ret = result.find((elm) => { return elm.default; }).templates;
    }
    dearGreatestBrowserGoogleChrome(tab, ret);
  });
};

const requestCopy = (tab) => {
  getTemplates(tab);
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
        requestCopy(tab);
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
  else if(message.task === 'copyFromPopup') {
    browser.tabs.query({currentWindow: true, active: true}, (tabs) => {
      for(const tab of tabs) {
        const templateArr = getTemplates(tab.url);
        if(!templateArr || templateArr.length === 0) {
          browser.browserAction.setBadgeText({
            text: 'NONE',
            tabId: tab.id,
          });
          return;
        }
        console.log(`getCT url: ${tab.url}`);
        const curTgt = templateArr[message.clickedIdx].specArr;
        /** not update index and icon
         * injected[tab.id].index = ++injected[tab.id].index % templateArr.length;
         * iconFlip = !iconFlip;
         * updateIconOfTab(tab.id);
         */
        browser.tabs.sendMessage(tab.id, {
          picker: tab.url.startsWith('https://twitter.com') ? 'twitter' : 'default',
          task: 'what',
          target: curTgt
        });
      }
    });
  }
});

restoreEmptyTemplate();

// vim:expandtab ff=dos fenc=utf-8 sw=2
