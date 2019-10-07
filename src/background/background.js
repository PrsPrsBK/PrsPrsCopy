const STORE_NAME = 'site_arr';
const INJECTED = {};

const INITIAL_STORE = [
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
          {string: '['},
          {plain: 'title'},
          {string: ']'},
          {string: '('},
          {plain: 'url'},
          {string: ')'},
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
          {string: '['},
          {twitter: 'datetime'},
          {string: ' '},
          {twitter: 'username'},
          {string: ']'},
          {string: '('},
          {twitter: 'url'},
          {string: ')'},
          {twitter: 'text_md'},
        ]
      },
    ],
  },
];

let IS_ICON_FLIP = false;
let CUR_POPUP_TEMPLATES = [];

const onError = errObj => {
  browser.browserAction.setBadgeText({
    text: errObj.message,
    tabId: errObj.tabId,
  });
};

const restoreEmptyTemplate = () => {
  browser.storage.local.get(STORE_NAME).then(store_obj => {
    const result = store_obj[STORE_NAME];
    if(!result || result.length === 0) {
      browser.storage.local.set({
        [STORE_NAME]: INITIAL_STORE,
      });
    }
  });
};

const updateIconOfTab = tabId => {
  browser.browserAction.setIcon({
    path: `icons/icon-48_${IS_ICON_FLIP ? 1 : 0}.png`,
    tabId: tabId
  });
  browser.browserAction.setBadgeText({
    text: `${INJECTED[tabId].index}`,
    tabId: tabId
  });
};

const getTemplates = tab => {
  return new Promise((resolve, reject) => {
    browser.storage.local.get(STORE_NAME).then(store_obj => {
      const result = store_obj[STORE_NAME];
      const match1st = result.find(elm => { return (elm.urlHead && tab.url.startsWith(elm.urlHead)); });
      const curTempateArr = match1st ? match1st.templates : result.find(elm => { return elm.default; }).templates;
      if(!curTempateArr || !Array.isArray(curTempateArr)) {
        reject({message: 'none', tabId: tab.id, });
      }
      if(curTempateArr.length === 0) {
        reject({message: 'empty', tabId: tab.id, });
      }
      else {
        resolve(curTempateArr);
      }
    });
  });
};

browser.tabs.onUpdated.addListener((tabId, chgInfo, _tab) => {
  //console.log(`chgInfo ${JSON.stringify(chgInfo)}`);
  if(chgInfo.status === 'complete') {
    INJECTED[tabId] = {
      index: 0,
    };
    IS_ICON_FLIP = false;
    updateIconOfTab(tabId);
  }
});

browser.tabs.onRemoved.addListener((tabId, _rmInfo) => {
  INJECTED[tabId] = undefined;
});

browser.commands.onCommand.addListener(cmd => {
  if(cmd === 'PrsPrsCopy') {
    browser.tabs.query({currentWindow: true, active: true}).then(tabs => {
      for(const tab of tabs) {
        getTemplates(tab).then(templateArr => {
          // console.log(`requestCopy: ${tab.url} with ${templateArr[INJECTED[tab.id].index].name}`);
          const curSpecArr = templateArr[INJECTED[tab.id].index].specArr;
          INJECTED[tab.id].index = ++INJECTED[tab.id].index % templateArr.length;
          IS_ICON_FLIP = !IS_ICON_FLIP;
          updateIconOfTab(tab.id);
          browser.tabs.sendMessage(tab.id, {
            picker: tab.url.startsWith('https://twitter.com') ? 'twitter' : 'default',
            task: 'copyWithSpecArr',
            specArr: curSpecArr
          });
        }, onError);
      }
    });
  }
});

browser.runtime.onMessage.addListener((message, sender, _sendResponse) => {
  if(message.task === 'resetTemplateIndex') {
    INJECTED[sender.tab.id].index = 0;
    IS_ICON_FLIP = false;
    updateIconOfTab(sender.tab.id);
  }
  else if(message.task === 'copyEnd') {
    // nothing to do... change the color of badgetext to green?
    // console.log(`copy end ${JSON.stringify(message.result)}`);
  }
  else if(message.task === 'getCurTemplates') {
    browser.tabs.query({currentWindow: true, active: true}).then(tabs => {
      for(const tab of tabs) {
        getTemplates(tab).then(templateArr => {
          CUR_POPUP_TEMPLATES = templateArr;
          browser.runtime.sendMessage({
            task: 'getCurTemplates',
            result: CUR_POPUP_TEMPLATES,
          });
        }, onError);
      }
    });
  }
  else if(message.task === 'copyFromPopup') {
    /* NOTICE:
     * When we set CUR_POPUP_TEMPLATES, it's value-check was done.
     */
    browser.tabs.query({currentWindow: true, active: true}).then(tabs => {
      for(const tab of tabs) {
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
    });
  }
});

restoreEmptyTemplate();

// vim:expandtab ff=dos fenc=utf-8 sw=2
