
if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}

const textPicker = {
  RESULT_ARR : [],

  escapeHtmlChar : (tgtText) => {
    return tgtText.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  onCopy : (evt) => {
    console.log('onCopy start');
    if(window.getSelection().toString() === '') {
      const outputText = textPicker.RESULT_ARR.filter((pair) => pair.hasOwnProperty('string'))
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
    document.removeEventListener('copy', textPicker.onCopy);
    browser.runtime.sendMessage({
      task: 'copyEnd',
      result: textPicker.RESULT_ARR,
    });
  },
  
  textPick : (tgt) => {
    textPicker.RESULT_ARR = [];
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
  },

};

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`${message.task} coming`);
  if(message.task === 'what') {
    document.addEventListener('copy', textPicker.onCopy);
    console.log('what coming 59');
    textPicker.RESULT_ARR = textPicker.textPick(message.target);
    document.execCommand('copy');
  }
  return true;
});

// vim:expandtab ff=dos fenc=utf-8 sw=2
