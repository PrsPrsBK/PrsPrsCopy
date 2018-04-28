
if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}

let RESULT_ARR = [];

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

const getTweetUrl = (tgt_elm) => {
  const wk_elm = tgt_elm.getElementsByClassName('tweet-timestamp');
  if(wk_elm && wk_elm.length > 0) {
    return wk_elm[0].href.trim();
  }
  else {
    return '';
  }
};

const getTweetTimestamp = (tgt_elm) => {
  const wk_elm = tgt_elm.getElementsByClassName('_timestamp');
  if(wk_elm && wk_elm.length > 0) {
    const result = parseTweetTime(wk_elm[0].getAttribute('data-time-ms').trim());
    return result['year'] + '-'
    + result['month'] + '-'
    + result['day'] + ' '
    + result['hour'] + ':'
    + result['minute'];
  }
  else {
    return '';
  }
};

const getTweetUsername = (tgt_elm) => {
  const wk_elm = tgt_elm.getElementsByClassName('fullname');
  if(wk_elm && wk_elm.length > 0) {
    return escapeHtmlChar(wk_elm[0].textContent.trim());
  }
  else {
    return '';
  }
};

const getTweetText = (tgt_elm) => {
  const wk_elm = tgt_elm.getElementsByClassName('tweet-text');
  if(wk_elm && wk_elm.length > 0) {
    let mainText = wk_elm[0].textContent.trim();
    mainText = mainText.replace(/\r?\n/g, ' ');
    const quoteTweetText = getQuoteTweetText(tgt_elm);
    if(quoteTweetText !== '') {
      console.log('add quote');
      mainText = mainText.replace(/(.+)(https:\/\/twitter\.com\/.+)$/, '$1');
    }
    mainText = activateHrefText(mainText);
    mainText += quoteTweetText;
    return mainText;
  }
  else {
    return '';
  }
};

let CUR_MAIN_TWEET = undefined;

const getCurTweet = () => {
  if(!CUR_MAIN_TWEET) {
    let wk_elm = document.getElementById('permalink-overlay');
    if(wk_elm) {
      const computedStyle = window.getComputedStyle(wk_elm);
      if(computedStyle === undefined
        || computedStyle.display === undefined
        || computedStyle.display === 'block'
        || computedStyle.opacity === 1) {
        console.log('may be modal overlay');
        wk_elm = wk_elm.getElementsByClassName('permalink-tweet-container');
        if(wk_elm && wk_elm.length > 0) {
          console.log(`overlay ${wk_elm.length}`);
          CUR_MAIN_TWEET = wk_elm[0];
        }
      }
    }
    if(!CUR_MAIN_TWEET) {
      wk_elm = document.getElementsByClassName('selected-stream-item');
      if(wk_elm && wk_elm.length > 0) {
        console.log(`may be selected one ${wk_elm.length}`);
        CUR_MAIN_TWEET = wk_elm[0];
      }
    }
  }
  return CUR_MAIN_TWEET;
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
    else if(val.hasOwnProperty('twitter')) {
      const tweetBody = getCurTweet();
      if(val.twitter === 'url') {
        tgt[idx] = {string: getTweetUrl(tweetBody)};
      }
      else if(val.twitter === 'datetime') {
        tgt[idx] = {string: getTweetTimestamp(tweetBody)};
      }
      else if(val.twitter === 'username') {
        tgt[idx] = {string: getTweetUsername(tweetBody)};
      }
      else if(val.twitter === 'text') {
        tgt[idx] = {string: getTweetText(tweetBody)};
      }
      console.log(tgt[idx]);
    }
  });
  CUR_MAIN_TWEET = null;
  return tgt;
};

const resetTemplateIndex = () => {
  browser.runtime.sendMessage({
    task: 'resetTemplateIndex',
  });
};

const handleKeydown = (evt) => {
  switch(evt.key) {
    case 'j':
      resetTemplateIndex();
      break;
    case 'k':
      resetTemplateIndex();
      break;
  }
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

console.debug(window.location.href);
document.addEventListener('keydown', handleKeydown);

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.task === 'what') {
    console.log(`consc: ${window.location.href}`);
    document.addEventListener('copy', onCopy);
    RESULT_ARR = textPick(message.target);
    document.execCommand('copy');
  }
});

browser.runtime.sendMessage({
  task: 'what',
});

// vim:expandtab ff=dos fenc=utf-8 sw=2

