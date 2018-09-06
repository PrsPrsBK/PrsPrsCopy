const escapeHtmlChar = (tgtText) => {
  return tgtText.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * make and return Object contains each datetime infos as string, made from mill seconds string.
 * @param {number} milsec_txt - string
 * @returns {?result} - Object
 */
const parseFromMillsec = (milsec_int) => {
  const wk = new Date(milsec_int);
  return {
    year : wk.getFullYear(),
    month : ('00' + (wk.getMonth() + 1)).slice(-2),
    day : ('00' + wk.getDate()).slice(-2),
    hour : ('00' + wk.getHours()).slice(-2),
    minute : ('00' + wk.getMinutes()).slice(-2),
  };
};

const getDatetimeTextFromMillsec = (milsec_int) => {
  const dtObj = parseFromMillsec(milsec_int);
  return `${dtObj['year']}-${dtObj['month']}-${dtObj['day']} ${dtObj['hour']}:${dtObj['minute']}`;
};

const commonSpecExtractor = (specRecord) => {
  if(specRecord.hasOwnProperty('string')) {
    return specRecord.string;
  }
  else if(specRecord.hasOwnProperty('plain')) {
    if(specRecord.plain === 'url') {
      return window.location.href;
    }
    else if(specRecord.plain === 'url_nohs') {
      const wkURL = new URL(window.location.href);
      // when url includes '#!' path, all things become 'hash' after that part.
      // so, we cannot use very convenient properties like URL.hash, URL.search.
      // if we can use, we assigning URL.hash = "" and URL.search = "" is enough.
      return wkURL.protocol + wkURL.host + wkURL.pathname;
    }
    else if(specRecord.plain === 'title') {
      return document.title;
    }
    else if(specRecord.plain === 'title_esc') {
      return escapeHtmlChar(document.title);
    }
    else if(specRecord.plain === 'title_reST') {
      return document.title.replace(/`/g, '\\`');
    }
    else if(specRecord.plain === 'title_md') {
      return document.title.replace(/\[/g, '\\[')
        .replace(/]/g, '\\]');
    }
    else if(specRecord.plain === 'today') {
      return getDatetimeTextFromMillsec(Date.now());
    }
  }
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
      result.push(commonSpecExtractor(val));
    });
    textPicker.RESULT_ARR = result;
  },

  onCopy : (evt) => {
    if(window.getSelection().toString() === '') {
      const outputText = textPicker.RESULT_ARR
        .reduce((acm, val) => {
          return acm + val;
        }, '');
      //console.log(outputText);
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

  regexHref : /(https?:\/\/\S+)(\s…?)?/g,
  
  activateHrefText : (tgtText, opt) => {
    const resultTextArr = [];
    let headIdx = 0;
    let wkMatchArr; // cannot declare in condition-clause
    if(opt.format === 'html') {
      while((wkMatchArr = tweetPicker.regexHref.exec(tgtText)) !== null) {
        resultTextArr.push(escapeHtmlChar(tgtText.slice(headIdx, wkMatchArr.index)));
        resultTextArr.push(`<a href="${wkMatchArr[1]}">URL</a>`);
        headIdx = tweetPicker.regexHref.lastIndex;
      }
      // may not be exact
      resultTextArr.push(escapeHtmlChar(tgtText.slice(headIdx)));
    }
    else if(opt.format === 'reST') {
      while((wkMatchArr = tweetPicker.regexHref.exec(tgtText)) !== null) {
        resultTextArr.push(tgtText.slice(headIdx, wkMatchArr.index));
        resultTextArr.push(`\`URL <${wkMatchArr[1]}>\`__`);
        headIdx = tweetPicker.regexHref.lastIndex;
      }
      resultTextArr.push(tgtText.slice(headIdx));
    }
    else if(opt.format === 'md') {
      while((wkMatchArr = tweetPicker.regexHref.exec(tgtText)) !== null) {
        resultTextArr.push(tgtText.slice(headIdx, wkMatchArr.index));
        resultTextArr.push(`(URL)[${wkMatchArr[1]}]`);
        headIdx = tweetPicker.regexHref.lastIndex;
      }
      resultTextArr.push(tgtText.slice(headIdx));
    }

    return resultTextArr.join('');
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
  
  getQTUrl : (tgt_elm) => {
    const wk_elm = tgt_elm.getElementsByClassName('QuoteTweet-link');
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
      return getDatetimeTextFromMillsec(parseInt(wk_elm[0].getAttribute('data-time-ms').trim()));
    }
    else {
      return '';
    }
  },
  
  getTweetUsername : (tgt_elm) => {
    const wk_elm = tgt_elm.getElementsByClassName('fullname');
    if(wk_elm && wk_elm.length > 0) {
      return wk_elm[0].textContent.trim();
    }
    else {
      return '';
    }
  },
  
  getQTUsername : (tgt_elm) => {
    const wk_elm = tgt_elm.getElementsByClassName('QuoteTweet-fullname');
    if(wk_elm && wk_elm.length > 0) {
      return wk_elm[0].textContent.trim();
    }
    else {
      return '';
    }
  },
  
  CUR_MAIN_TWEET : null,
  CUR_HAS_QT : false,
  CUR_MAIN_TEXT : '',
  CUR_QT_TEXT : '',
  
  prepareCurText : (tgt_elm) => {
    let wk_elm = tgt_elm.getElementsByClassName('tweet-text');
    if(wk_elm && wk_elm.length > 0) {
      let mainText = wk_elm[0].textContent.trim();
      let qtText = '';
      // anyway oneline
      mainText = mainText.replace(/\r\n/g, ' ')
        .replace(/\n\r/g, ' ')
        .replace(/\n/g, ' ');
      if(tweetPicker.CUR_HAS_QT) {
        wk_elm = tgt_elm.getElementsByClassName('QuoteTweet-text');
        if(wk_elm && wk_elm.length > 0) {
          qtText = wk_elm[0].textContent.trim();
          qtText = qtText.replace(/\r\n/g, ' ')
            .replace(/\n\r/g, ' ')
            .replace(/\n/g, ' ');
        }
        mainText = mainText.replace(/(.+)(https:\/\/twitter\.com\/.+)$/, '$1');
      }
      tweetPicker.CUR_MAIN_TEXT = mainText;
      tweetPicker.CUR_QT_TEXT = qtText;
    }
  },
  
  getCurTweet : () => {
    // almost once in each request to copy-with-template
    if(!tweetPicker.CUR_MAIN_TWEET) {
      let wk_elm = document.getElementById('permalink-overlay');
      if(wk_elm) {
        const computedStyle = window.getComputedStyle(wk_elm);
        if(computedStyle === undefined
          || computedStyle.display === undefined
          || computedStyle.display === 'block'
          || computedStyle.opacity === 1) {
          wk_elm = wk_elm.getElementsByClassName('permalink-tweet-container');
          if(wk_elm && wk_elm.length > 0) {
            tweetPicker.CUR_MAIN_TWEET = wk_elm[0];
          }
        }
      }
      if(!tweetPicker.CUR_MAIN_TWEET) {
        wk_elm = document.getElementsByClassName('selected-stream-item');
        if(wk_elm && wk_elm.length > 0) {
          tweetPicker.CUR_MAIN_TWEET = wk_elm[0];
        }
      }
      if(tweetPicker.CUR_MAIN_TWEET !== null) {
        wk_elm = tweetPicker.CUR_MAIN_TWEET.getElementsByClassName('QuoteTweet-link');
        tweetPicker.CUR_HAS_QT = (wk_elm && wk_elm.length > 0) ? true : false;
        tweetPicker.prepareCurText(tweetPicker.CUR_MAIN_TWEET);
      }
    }
    return tweetPicker.CUR_MAIN_TWEET;
  },
  
  build : (tgt) => {
    const result = [];
    tgt.forEach((val) => {
      if(val.hasOwnProperty('twitter') === false) {
        result.push(commonSpecExtractor(val));
      }
      else {
        const tweetBody = tweetPicker.getCurTweet();
        if(!tweetBody) {
          console.debug('cannot copy for tweet');
        }
        else if(val.twitter === 'url') {
          result.push(tweetPicker.getTweetUrl(tweetBody));
        }
        else if(val.twitter === 'datetime') {
          result.push(tweetPicker.getTweetTimestamp(tweetBody));
        }
        else if(val.twitter === 'username') {
          result.push(tweetPicker.getTweetUsername(tweetBody));
        }
        else if(val.twitter === 'username_esc') {
          result.push(escapeHtmlChar(tweetPicker.getTweetUsername(tweetBody)));
        }
        else if(val.twitter === 'text') {
          result.push(tweetPicker.CUR_MAIN_TEXT);
        }
        else if(val.twitter === 'text_html') {
          result.push(tweetPicker.activateHrefText(tweetPicker.CUR_MAIN_TEXT, {format: 'html'}));
        }
        else if(val.twitter === 'text_reST') {
          result.push(tweetPicker.activateHrefText(tweetPicker.CUR_MAIN_TEXT, {format: 'reST'}));
        }
        else if(val.twitter === 'text_md') {
          result.push(tweetPicker.activateHrefText(tweetPicker.CUR_MAIN_TEXT, {format: 'md'}));
        }
        else if(tweetPicker.CUR_HAS_QT) {
          if(val.twitter === 'qt_string' && val.hasOwnProperty('string')) {
            result.push(val.string);
          }
          else if(val.twitter === 'qt_url') {
            result.push(tweetPicker.getQTUrl(tweetBody));
          }
          else if(val.twitter === 'qt_username') {
            result.push(tweetPicker.getQTUsername(tweetBody));
          }
          else if(val.twitter === 'qt_username_esc') {
            result.push(escapeHtmlChar(tweetPicker.getQTUsername(tweetBody)));
          }
          else if(val.twitter === 'qt_text') {
            result.push(tweetPicker.CUR_QT_TEXT);
          }
          else if(val.twitter === 'qt_text_html') {
            result.push(tweetPicker.activateHrefText(tweetPicker.CUR_QT_TEXT, {format: 'html'}));
          }
          else if(val.twitter === 'qt_text_reST') {
            result.push(tweetPicker.activateHrefText(tweetPicker.CUR_QT_TEXT, {format: 'reST'}));
          }
          else if(val.twitter === 'qt_text_md') {
            result.push(tweetPicker.activateHrefText(tweetPicker.CUR_QT_TEXT, {format: 'md'}));
          }
        }
      }
    });
    tweetPicker.RESULT_ARR = result;
    // clear everytime for each request to copy-with-template, 
    // because we need to search current tweet for tweet's URL is changed or not.
    tweetPicker.clearCurTweet();
  },

  clearCurTweet : () => {
    tweetPicker.CUR_MAIN_TWEET = null;
    tweetPicker.CUR_HAS_QT = false;
    tweetPicker.CUR_MAIN_TEXT = '';
    tweetPicker.CUR_QT_TEXT = '';
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
    if(window.getSelection().toString() === '') {
      const outputText = tweetPicker.RESULT_ARR
        .reduce((acm, val) => {
          return acm + val;
        }, '');
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
  if(message.task === 'copyWithSpecArr') {
    if(message.picker === 'twitter') {
      document.addEventListener('copy', tweetPicker.onCopy);
      tweetPicker.build(message.specArr);
    }
    else {
      document.addEventListener('copy', textPicker.onCopy);
      textPicker.build(message.specArr);
    }
    document.execCommand('copy');
  }
  return true;
});

// vim:expandtab ff=dos fenc=utf-8 sw=2
