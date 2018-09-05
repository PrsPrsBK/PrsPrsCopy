if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}

const injected = {};

const initialStore = [
  {
    default: true,
    name: 'default',
    templates: [
      {
        name: 'dt',
        frozen: false,
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
        frozen: false,
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
        frozen: false,
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
        frozen: false,
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
    default: false,
    urlHead: 'https://twitter.com',
    name: 'twitter',
    templates: [
      {
        name: 'dt',
        frozen: false,
        specArr: [
          {string: '<dt><a href="'},
          {twitter: 'url'},
          {string: '">'},
          {twitter: 'datetime'},
          {string: ' '},
          {twitter: 'username_esc'},
          {string: '</a>: '},
          {twitter: 'text_html'},
          {twitter: 'qt_string', string: ' <div class="yourClass"><a href="'},
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
        frozen: false,
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
        frozen: false,
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

let CUR_POPUP_TEMPLATES = [];

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

/* ---------- FROM THIS LINE : SHOULD REMOVED AND Chrome Edition NEVER UPDATED --------------
 * anyway I'm not feel like devising not-so-bad code for Google Chrome.
 * I would rather choice copy-and-pasting no-brain code.
 */

const endRequestCopyDevotedToGoogleChrome = (tab, templateArr) => {
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
    task: 'copyWithSpecArr',
    specArr: curTgt
  });
};

const getTemplatesDevotedToGoogleChrome = (tab) => {
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
    result.forEach((elm) => {
      console.log(`--${elm.urlHead}`);
    });
    const match1st = result.find((elm) => { return (elm.urlHead && tab.url.startsWith(elm.urlHead)); });
    if(match1st) {
      console.log('--match1st');
      ret = match1st.templates;
    }
    else {
      console.log('--default');
      ret = result.find((elm) => { return elm.default; }).templates;
    }
    endRequestCopyDevotedToGoogleChrome(tab, ret);
  });
};

const beginRequestCopyDevotedToGoogleChrome = (tab) => {
  getTemplatesDevotedToGoogleChrome(tab);
};

const getTemplatesFromMenuDevotedToGoogleChrome = (tab) => {
  browser.storage.local.get('arr_by_site', (store_obj) => {
    const result = store_obj['arr_by_site'];
    if(!result || result.length === 0) {
      browser.browserAction.setBadgeText({
        text: 'empty',
        tabId: tab.id,
      });
      return;
    }
    result.forEach((elm) => {
      console.log(`${elm.urlHead}`);
    });
    const match1st = result.find((elm) => { return (elm.urlHead && tab.url.startsWith(elm.urlHead)); });
    if(match1st) {
      console.log('match1st');
      CUR_POPUP_TEMPLATES = match1st.templates;
    }
    else {
      console.log('default');
      CUR_POPUP_TEMPLATES = result.find((elm) => { return elm.default; }).templates;
    }
    browser.runtime.sendMessage({
      task: 'getCurTemplates',
      result: CUR_POPUP_TEMPLATES,
    });
  });
};

/* ---------- UNTIL THIS LINE : SHOULD REMOVED AND Chrome Edition NEVER UPDATED -------------- */


const requestCopyFromMenu = (tab, clickedIdx) => {
  if(!CUR_POPUP_TEMPLATES || CUR_POPUP_TEMPLATES.length === 0) {
    browser.browserAction.setBadgeText({
      text: 'NONE',
      tabId: tab.id,
    });
    return;
  }
  const curTgt = CUR_POPUP_TEMPLATES[clickedIdx].specArr;
  console.log(`${tab.url} ${clickedIdx} ${curTgt.length}`);
  /** not update index and icon
   * injected[tab.id].index = ++injected[tab.id].index % templateArr.length;
   * iconFlip = !iconFlip;
   * updateIconOfTab(tab.id);
   */
  browser.tabs.sendMessage(tab.id, {
    picker: tab.url.startsWith('https://twitter.com') ? 'twitter' : 'default',
    task: 'copyWithSpecArr',
    specArr: curTgt
  });
};

const getTemplates = (tab) => {
  browser.storage.local.get('arr_by_site', (store_obj) => {
    const result = store_obj['arr_by_site'];
    let ret;
    if(!result || result.length === 0) {
      ret = undefined;
    }
    const match1st = result.find((elm) => { return (elm.urlHead && tab.url.startsWith(elm.urlHead)); });
    if(match1st) {
      console.log('wow url match');
      ret = match1st.templates;
    }
    else {
      console.log('use default');
      ret = result.find((elm) => { return elm.default; }).templates;
    }
    return new Promise((resolve, reject) => {
      if(!ret || !Array.isArray(ret)) {
        reject('none');
      }
      else if(ret.length === 0) {
        reject('empty');
      }
      else {
        resolve(ret);
      }
    });
  });
};

const requestCopy = (tab) => {
  getTemplates(tab).then((templateArr) => {
    console.log(`requestCopy: ${tab.url} with ${templateArr[injected[tab.id].index].name}`);
    const curTgt = templateArr[injected[tab.id].index].specArr;
    injected[tab.id].index = ++injected[tab.id].index % templateArr.length;
    iconFlip = !iconFlip;
    updateIconOfTab(tab.id);
    browser.tabs.sendMessage(tab.id, {
      picker: tab.url.startsWith('https://twitter.com') ? 'twitter' : 'default',
      task: 'copyWithSpecArr',
      specArr: curTgt
    });
    //Google Chrome, sendResponse not work.
    //sendResponse({
    //  task: 'what',
    //  target: curTgt
    //});
  }, (errBadgeText) => {
    browser.browserAction.setBadgeText({
      text: errBadgeText,
      tabId: tab.id,
    });
  });
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
        beginRequestCopyDevotedToGoogleChrome(tab);
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
        getTemplatesFromMenuDevotedToGoogleChrome(tab);
      }
    });
  }
  else if(message.task === 'copyFromPopup') {
    browser.tabs.query({currentWindow: true, active: true}, (tabs) => {
      for(const tab of tabs) {
        requestCopyFromMenu(tab, message.clickedIdx);
      }
    });
  }
});

restoreEmptyTemplate();

// vim:expandtab ff=dos fenc=utf-8 sw=2
