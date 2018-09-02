
if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}

const escapeHtmlChar = (tgtText) => {
  return tgtText.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * make and return Object contains each datetime infos as string, made from mill seconds string.
 * @param {string} milsec_txt - string
 * @returns {?result} - Object
 */
const parseFromMillsec = (milsec_txt) => {
  const wk = new Date(parseInt(milsec_txt));
  return {
    year : wk.getFullYear(),
    month : ('00' + (wk.getMonth() + 1)).slice(-2),
    day : ('00' + wk.getDate()).slice(-2),
    hour : ('00' + wk.getHours()).slice(-2),
    minute : ('00' + wk.getMinutes()).slice(-2),
  };
};
  
const resetTemplateIndex = () => {
  browser.runtime.sendMessage({
    task: 'resetTemplateIndex',
  });
};

const textPicker = {
  RESULT_ARR : [],
  
  build : (tgt) => {
    const result = [];
    tgt.forEach((val) => {
      if(val.hasOwnProperty('string')) {
        result.push(val.string);
      }
      else if(val.hasOwnProperty('plain')) {
        if(val.plain === 'url') {
          result.push(window.location.href);
        }
        else if(val.plain === 'url_nohs') {
          const wkURL = new URL(window.location.href);
          // when url includes '#!' path, all things become 'hash' after that part.
          // so, we cannot use very convenient properties like URL.hash, URL.search.
          result.push(
            wkURL.protocol + wkURL.host + wkURL.pathname
          );
        }
        else if(val.plain === 'title') {
          result.push(document.title);
        }
        else if(val.plain === 'title_esc') {
          result.push(escapeHtmlChar(document.title));
        }
      }
    });
    textPicker.RESULT_ARR = result;
  },

  onCopy : (evt) => {
    if(window.getSelection().toString() === '') {
      const outputText = textPicker.RESULT_ARR
        .reduce((acm, val) => {
          return acm + val;
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

};

const tweetPicker = {

  RESULT_ARR : [],

  regexHref : /(https?:\/\/\S+)(\s…)?/g,
  
  activateHrefText : (tgtText) => {
    const resultTextArr = [];
    let headIdx = 0;
    let wkMatchArr; // cannot declare in condition-clause
    while((wkMatchArr = tweetPicker.regexHref.exec(tgtText)) !== null) {
      console.log('MATCH');
      resultTextArr.push(escapeHtmlChar(tgtText.slice(headIdx, wkMatchArr.index)));
      resultTextArr.push(`<a href="${wkMatchArr[1]}">URL</a>`);
      headIdx = tweetPicker.regexHref.lastIndex;
    }
    resultTextArr.push(escapeHtmlChar(tgtText.slice(headIdx)));

    return resultTextArr.join('');
  },
  
  getQuoteTweetText : (tgt_elm) => {
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
        if(tweetPicker.regexInnerHref.test(mainText)) {
          mainText = tweetPicker.activateHrefText(mainText);
        }
        wk += mainText + '</div>';
      }
      ret += wk;
    }
    return ret;
  },
  
  getTweetUrl : (tgt_elm) => {
    const wk_elm = tgt_elm.getElementsByClassName('tweet-timestamp');
    if(wk_elm && wk_elm.length > 0) {
      return wk_elm[0].href.trim();
    }
    else {
      return '';
    }
  },
  
  getTweetTimestamp : (tgt_elm) => {
    const wk_elm = tgt_elm.getElementsByClassName('_timestamp');
    if(wk_elm && wk_elm.length > 0 && wk_elm[0].getAttribute('data-time-ms')) {
      const result = parseFromMillsec(wk_elm[0].getAttribute('data-time-ms').trim());
      return result['year'] + '-'
      + result['month'] + '-'
      + result['day'] + ' '
      + result['hour'] + ':'
      + result['minute'];
    }
    else {
      return '';
    }
  },
  
  getTweetUsername : (tgt_elm) => {
    const wk_elm = tgt_elm.getElementsByClassName('fullname');
    if(wk_elm && wk_elm.length > 0) {
      return escapeHtmlChar(wk_elm[0].textContent.trim());
    }
    else {
      return '';
    }
  },
  
  getTweetText : (tgt_elm) => {
    const wk_elm = tgt_elm.getElementsByClassName('tweet-text');
    if(wk_elm && wk_elm.length > 0) {
      let mainText = wk_elm[0].textContent.trim();
      mainText = mainText.replace(/\r\n/g, ' ');
      mainText = mainText.replace(/\n\r/g, ' ');
      mainText = mainText.replace(/\n/g, ' ');
      const quoteTweetText = tweetPicker.getQuoteTweetText(tgt_elm);
      if(quoteTweetText !== '') {
        console.log('add quote');
        mainText = mainText.replace(/(.+)(https:\/\/twitter\.com\/.+)$/, '$1');
      }
      mainText = tweetPicker.activateHrefText(mainText);
      mainText += quoteTweetText;
      return mainText;
    }
    else {
      return '';
    }
  },
  
  CUR_MAIN_TWEET : undefined,
  
  getCurTweet : () => {
    if(!tweetPicker.CUR_MAIN_TWEET) {
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
            tweetPicker.CUR_MAIN_TWEET = wk_elm[0];
          }
        }
      }
      if(!tweetPicker.CUR_MAIN_TWEET) {
        wk_elm = document.getElementsByClassName('selected-stream-item');
        if(wk_elm && wk_elm.length > 0) {
          console.log(`may be selected one ${wk_elm.length}`);
          tweetPicker.CUR_MAIN_TWEET = wk_elm[0];
        }
      }
    }
    return tweetPicker.CUR_MAIN_TWEET;
  },
  
  build : (tgt) => {
    const result = [];
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
        const tweetBody = tweetPicker.getCurTweet();
        if(val.twitter === 'url') {
          tgt[idx] = {string: tweetPicker.getTweetUrl(tweetBody)};
        }
        else if(val.twitter === 'datetime') {
          tgt[idx] = {string: tweetPicker.getTweetTimestamp(tweetBody)};
        }
        else if(val.twitter === 'username') {
          tgt[idx] = {string: tweetPicker.getTweetUsername(tweetBody)};
        }
        else if(val.twitter === 'text') {
          tgt[idx] = {string: tweetPicker.getTweetText(tweetBody)};
        }
        console.log(tgt[idx]);
      }
    });
    tweetPicker.RESULT_ARR = result;
    tweetPicker.CUR_MAIN_TWEET = null;
  },
  
  handleKeydown : (evt) => {
    switch(evt.key) {
      case 'j':
        resetTemplateIndex();
        break;
      case 'k':
        resetTemplateIndex();
        break;
    }
  },

  onCopy : (evt) => {
    console.log('onCopy start');
    if(window.getSelection().toString() === '') {
      const outputText = tweetPicker.RESULT_ARR
        .reduce((acm, val) => {
          return acm + val;
        }, '');
      console.log(outputText);
      if(outputText !== '') {
        evt.preventDefault();
        const transfer = evt.clipboardData;
        transfer.setData('text/plain', outputText);
      }
    }
    document.removeEventListener('copy', tweetPicker.onCopy);
    browser.runtime.sendMessage({
      task: 'copyEnd',
      result: tweetPicker.RESULT_ARR,
    });
  },
  
};

if(window.location.href.startsWith('https://twitter.com')) {
  document.addEventListener('keydown', tweetPicker.handleKeydown);
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`${message.task} coming`);
  if(message.task === 'what') {
    if(message.picker === 'twitter') {
      document.addEventListener('copy', tweetPicker.onCopy);
      tweetPicker.build(message.target);
    }
    else {
      document.addEventListener('copy', textPicker.onCopy);
      textPicker.build(message.target);
    }
    document.execCommand('copy');
  }
  return true;
});

// vim:expandtab ff=dos fenc=utf-8 sw=2
