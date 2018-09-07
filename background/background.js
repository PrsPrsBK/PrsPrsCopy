const STORE_NAME = 'site_arr';
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
  browser.storage.local.get(STORE_NAME, (store_obj) => {
    const result = store_obj[STORE_NAME];
    if(!result || result.length === 0) {
      browser.storage.local.set({
        [STORE_NAME]: initialStore,
      });
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
  browser.storage.local.get(STORE_NAME, (store_obj) => {
    const result = store_obj[STORE_NAME];
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

const getTemplatesFromMenu = (tab) => {
  browser.storage.local.get(STORE_NAME, (store_obj) => {
    const result = store_obj[STORE_NAME];
    if(!result || result.length === 0) {
      browser.browserAction.setBadgeText({
        text: 'empty',
        tabId: tab.id,
      });
      return;
    }
    const match1st = result.find((elm) => { return (elm.urlHead && tab.url.startsWith(elm.urlHead)); });
    if(match1st) {
      CUR_POPUP_TEMPLATES = match1st.templates;
    }
    else {
      CUR_POPUP_TEMPLATES = result.find((elm) => { return elm.default; }).templates;
    }
    browser.runtime.sendMessage({
      task: 'getCurTemplates',
      result: CUR_POPUP_TEMPLATES,
    });
  });
};

/* ---------- UNTIL THIS LINE : SHOULD REMOVED AND Chrome Edition NEVER UPDATED -------------- */


const getTemplates = (tab) => {
  return new Promise((resolve, reject) => {
    browser.storage.local.get(STORE_NAME, (store_obj) => {
      const result = store_obj[STORE_NAME];
      const match1st = result.find((elm) => { return (elm.urlHead && tab.url.startsWith(elm.urlHead)); });
      const curTempateArr = match1st ? match1st.templates : result.find((elm) => { return elm.default; }).templates;
      if(!curTempateArr || !Array.isArray(curTempateArr)) {
        reject('none');
      }
      if(curTempateArr.length === 0) {
        reject('empty');
      }
      else {
        resolve(curTempateArr);
      }
    });
  });
};

const requestCopy = (tab) => {
  getTemplates(tab).then((templateArr) => {
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
  //console.log(`chgInfo ${JSON.stringify(chgInfo)}`);
  if(chgInfo.status === 'complete') {
    injected[tab.id] = {
      index: 0,
    };
    iconFlip = false;
    updateIconOfTab(tab.id);
  }
});

browser.tabs.onRemoved.addListener((tabId, rmInfo) => {
  injected[tabId] = undefined;
});

browser.commands.onCommand.addListener((cmd) => {
  if(cmd === 'PrsPrsCopy') {
    browser.tabs.query({currentWindow: true, active: true}, (tabs) => {
      for(const tab of tabs) {
        beginRequestCopyDevotedToGoogleChrome(tab);
      }
    });
  }
});

browser.runtime.onMessage.addListener((message, sender, _sendResponse) => {
  if(message.task === 'resetTemplateIndex') {
    injected[sender.tab.id].index = 0;
    updateIconOfTab(sender.tab.id);
  }
  else if(message.task === 'copyEnd') {
    // nothing to do... change the color of badgetext to green?
    console.log(`copy end ${JSON.stringify(message.result)}`);
  }
  else if(message.task === 'getCurTemplates') {
    browser.tabs.query({currentWindow: true, active: true}, (tabs) => {
      for(const tab of tabs) {
        getTemplates(tab).then((arr) => {
          CUR_POPUP_TEMPLATES = arr;
          browser.runtime.sendMessage({
            task: 'getCurTemplates',
            result: CUR_POPUP_TEMPLATES,
          });
        }, (errStr) => {
          browser.browserAction.setBadgeText({
            text: errStr,
            tabId: tab.id,
          });
        });
      }
    });
  }
  else if(message.task === 'copyFromPopup') {
    browser.tabs.query({currentWindow: true, active: true}, (tabs) => {
      for(const tab of tabs) {
        let errStr = '';
        if(!CUR_POPUP_TEMPLATES || !Array.isArray(CUR_POPUP_TEMPLATES)) {
          errStr = 'none';
        }
        else if(CUR_POPUP_TEMPLATES.length === 0) {
          errStr = 'empty';
        }
        console.log(`errStr: ${errStr}`);
        if(errStr !== '') {
          browser.browserAction.setBadgeText({
            text: errStr,
            tabId: tab.id,
          });
        }
        else {
          const curSpecArr = CUR_POPUP_TEMPLATES[message.clickedIdx].specArr;
          /* NOTICE: 
           * not update index and icon
           */
          browser.tabs.sendMessage(tab.id, {
            picker: tab.url.startsWith('https://twitter.com') ? 'twitter' : 'default',
            task: 'copyWithSpecArr',
            specArr: curSpecArr
          });
        }
      }
    });
  }
});

restoreEmptyTemplate();

// vim:expandtab ff=dos fenc=utf-8 sw=2
