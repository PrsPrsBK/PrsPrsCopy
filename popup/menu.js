if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}

console.log('here popup');

const getCurTemplates = () => {
  browser.runtime.sendMessage({
    task: 'getCurTemplates',
  });
};

const loadTemplates = (templatesArr) => {
  const rootElm = document.getElementById('menu_root');
  const docFragment = document.createDocumentFragment();
  let trElm, tdElm, tdTxt;
  templatesArr.forEach((rec) => {
    trElm = document.createElement('tr');
    tdElm = document.createElement('td');
    tdTxt = document.createTextNode(`${rec.name}`);
    tdElm.appendChild(tdTxt);
    trElm.appendChild(tdElm);
    docFragment.appendChild(trElm);
  });
  rootElm.appendChild(docFragment);
};

const copy = (flag_nam) => {
};

document.addEventListener('click', (e) => {
  if(e.target.id.indexOf('copy_') === 0) {
    console.log('let us copy ' + e.target.id);
    const flag_nam = e.target.id.replace(/^copy_(.+)$/, '$1');
    copy(flag_nam);
  }
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`${message.task} coming`);
  if(message.task === 'getCurTemplates') {
    loadTemplates(message.result);
  }
});

document.addEventListener('DOMContentLoaded', getCurTemplates);

// vim:expandtab ff=dos fenc=utf-8 sw=2
