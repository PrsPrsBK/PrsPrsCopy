
if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}

/**
 * make and return Object contains each datetime infos as string, made from mill seconds string.
 * @param {string} milsec_txt - string
 * @returns {?result} - Object
 */
const parseTweetTime = (milsec_txt) => {
  const wk = new Date(parseInt(milsec_txt));
  const result = {};
  result.year = wk.getFullYear();
  result.month = ('00' + (wk.getMonth() + 1)).slice(-2);
  result.day = ('00' + wk.getDate()).slice(-2);
  result.hour = ('00' + wk.getHours()).slice(-2);
  result.minute = ('00' + wk.getMinutes()).slice(-2);
  return result;
};

const regexInnerHref = /(.+)(https?:\/\/[^ ]+) …(.*)/;

const escapeHtmlChar = (tgtText) => {
  return tgtText.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

const activateHrefText = (tgtText) => {
  let headText = '';
  let hrefText = '';
  let tailText = '';
  if(regexInnerHref.test(tgtText)) {
    headText = tgtText.replace(regexInnerHref, '$1');
    hrefText = tgtText.replace(regexInnerHref, '<a href="$2">URL</a>');
    tailText = tgtText.replace(regexInnerHref, '$3');
  }
  else {
    headText = tgtText;
  }
  console.log(`head==${headText}`);
  console.log(`href==${hrefText}`);
  console.log(`tail==${tailText}`);
  headText = headText.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  tailText = tailText.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return headText + hrefText + tailText;
};

const getQuoteTweetText = (tgt_elm) => {
  let ret = '';
  let wk_elm;
  wk_elm = tgt_elm.getElementsByClassName('QuoteTweet-link');
  if(wk_elm && wk_elm.length > 0) {
    console.log('scrape1');
    let wk = ` <div class="quotedTweet"><a href="${wk_elm[0].href}">`;
    wk_elm = tgt_elm.getElementsByClassName('QuoteTweet-fullname');
    if(wk_elm && wk_elm.length > 0) {
      const fullname = escapeHtmlChar(wk_elm[0].textContent.trim());
      wk += fullname + ':</a> ';
    }
    wk_elm = tgt_elm.getElementsByClassName('QuoteTweet-text');
    if(wk_elm && wk_elm.length > 0) {
      let mainText = wk_elm[0].textContent.trim();
      mainText = mainText.replace(/\r?\n/g, ' ');
      if(regexInnerHref.test(mainText)) {
        mainText = activateHrefText(mainText);
      }
      wk += mainText + '</div>';
    }
    ret += wk;
  }
  return ret;
};

const copyFromOverlay = (tgt_elm) => {
  const result = {};
  let wk_elm;
  wk_elm = tgt_elm.getElementsByClassName('tweet-timestamp');
  if(wk_elm && wk_elm.length > 0) {
    console.log(1);
    result.href = wk_elm[0].href.trim();
  }
  wk_elm = tgt_elm.getElementsByClassName('_timestamp');
  if(wk_elm && wk_elm.length > 0) {
    console.log(2);
    result.time = parseTweetTime(wk_elm[0].getAttribute('data-time-ms').trim());
  }
  wk_elm = tgt_elm.getElementsByClassName('fullname');
  if(wk_elm && wk_elm.length > 0) {
    console.log(3);
    const fullname = escapeHtmlChar(wk_elm[0].textContent.trim());
    result.fullname = fullname;
  }
  wk_elm = tgt_elm.getElementsByClassName('tweet-text');
  if(wk_elm && wk_elm.length > 0) {
    console.log(4);
    let mainText = wk_elm[0].textContent.trim();
    mainText = mainText.replace(/\r?\n/g, ' ');
    const quoteTweetText = getQuoteTweetText(tgt_elm);
    if(quoteTweetText !== '') {
      console.log('add quote');
      mainText = mainText.replace(/(.+)(https:\/\/twitter\.com\/.+)$/, '$1');
    }
    mainText = activateHrefText(mainText);
    mainText += quoteTweetText;
    result.text = mainText;
  }
  //console.log(result);
  const result_text = '<dt><a href="' +
    result.href + '">' +
    result.time['year'] + '-' +
    result.time['month'] + '-' +
    result.time['day'] + ' ' +
    result.time['hour'] + ':' +
    result.time['minute'] + ' ' +
    result.fullname + ':</a> ' +
    result.text + '</dt>';
  return result_text;
};

const setTextForCopy = () => {
  console.log('setTextForCopy');
  let ret = '';
  let wk_elm;
  wk_elm = document.getElementById('permalink-overlay');
  console.log('setTextForCopy1');
  if(wk_elm &&
    (wk_elm.style === undefined
      || (wk_elm.style !== undefined && wk_elm.style.display === undefined)
      || wk_elm.style.display === 'block'
      || wk_elm.style.opacity === 1)) {
    console.log('go permalink0');
    wk_elm = wk_elm.getElementsByClassName('permalink-tweet-container');
    if(wk_elm && wk_elm.length > 0) {
      console.log('go permalink1');
      ret = copyFromOverlay(wk_elm[0]);
    }
    return ret;
  }
  console.log('setTextForCopy2');
  wk_elm = document.getElementsByClassName('selected-stream-item');
  console.log('setTextForCopy3');
  if(wk_elm && wk_elm.length > 0) {
    console.log('go stream-item');
    ret = copyFromOverlay(wk_elm[0]);
    return ret;
  }
  return ret;
};

const onCopy = (evt) => {
  console.log('onCopy start');
  if(window.getSelection().toString() === '') {
    const outputText = setTextForCopy();
    if(outputText !== '') {
      evt.preventDefault();
      const transfer = evt.clipboardData;
      transfer.setData('text/plain', outputText);
    }
  }
};

const start = () => {
  console.debug(window.location.href);
  document.addEventListener('copy', onCopy);
};

start();

// vim:expandtab ff=dos fenc=utf-8 sw=2

