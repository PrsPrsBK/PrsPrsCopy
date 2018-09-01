if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}

console.log('here popup');

const getCurTemplates = () => {
  browser.runtime.sendMessage({
    task: 'getCurTemplates',
  });
};

let CUR_TEMPLATES;

const loadTemplates = (templatesArr) => {
  CUR_TEMPLATES = templatesArr;
  const rootElm = document.getElementById('menu_root');
  const docFragment = document.createDocumentFragment();
  let trElm, tdElm, tdTxt;
  templatesArr.forEach((rec, idx) => {
    trElm = document.createElement('tr');
    tdElm = document.createElement('td');
    tdElm.id = `template_${idx}`;
    tdElm.classList.add('button');
    tdTxt = document.createTextNode(`${rec.name}`);
    tdElm.appendChild(tdTxt);
    trElm.appendChild(tdElm);
    docFragment.appendChild(trElm);
  });
  rootElm.appendChild(docFragment);
};

document.addEventListener('click', (e) => {
  if(e.target.id.indexOf('template_') === 0) {
    console.log('let us copy ' + e.target.id);
    const clickedIdx = e.target.id.replace(/^template_(.+)$/, '$1');
    browser.runtime.sendMessage({
      task: 'copyFromPopup',
      clickedIdx: parseInt(clickedIdx),
    });
  }
  window.close();
});

document.getElementById('menu_root').addEventListener('mouseover', (e) => {
  if(e.target.id.indexOf('template_') === 0) {
    const tgtIdx = e.target.id.replace(/^template_(.+)$/, '$1');
    const monitorElm = document.getElementById('spec_monitor');
    while(monitorElm.firstChild) {
      monitorElm.removeChild(monitorElm.firstChild);
    }
    let descAcc = '';
    CUR_TEMPLATES[tgtIdx].specArr.forEach((spec) => {
      descAcc += Object.values(spec)[0];
    });
    const txtDiv = document.createElement('div');
    const parElm = document.createElement('p');
    const descTxt = document.createTextNode(descAcc);
    parElm.appendChild(descTxt);
    txtDiv.appendChild(parElm);
    monitorElm.appendChild(txtDiv);
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
