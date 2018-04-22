
if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}

let RESULT_ARR = [];

const escapeHtmlChar = (tgtText) => {
  return tgtText.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

const textPick = (tgt) => {
  tgt.forEach((val, idx) => {
    if(val.hasOwnProperty('plain')) {
      if(val.plain === 'url') {
        tgt[idx] = {string: window.location.href};
      }
      else if(val.plain === 'title') {
        tgt[idx] = {string: document.title};
      }
      console.log(tgt[idx]);
    }
  });
  return tgt;
};

const onCopy = (evt) => {
  console.log('onCopy start');
  if(window.getSelection().toString() === '') {
    const outputText = RESULT_ARR.filter((pair) => pair.hasOwnProperty('string'))
      .reduce((acm, val) => {
        return acm + val.string;
      }, '');
    console.log(outputText);
    if(outputText !== '') {
      evt.preventDefault();
      const transfer = evt.clipboardData;
      transfer.setData('text/plain', outputText);
    }
  }
  document.removeEventListener('copy', onCopy);
  browser.runtime.sendMessage({
    task: 'copyEnd',
    result: RESULT_ARR,
  });
};

document.addEventListener('copy', onCopy);

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.task === 'what') {
    RESULT_ARR = textPick(message.target);
    document.execCommand('copy');
  }
});

browser.runtime.sendMessage({
  task: 'what',
});

console.log('textPicker last line');
// vim:expandtab ff=dos fenc=utf-8 sw=2

