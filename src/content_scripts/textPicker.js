const escapeHtmlChar = tgtText => {
  return tgtText.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

const escapeReST = tgtText => {
  return tgtText.replace(/`/g, '\\`');
};

const escapeMd = tgtText => {
  return tgtText.replace(/\[/g, '\\[')
    .replace(/]/g, '\\]');
};

const parseFromMillsec = milsec_int => {
  const wk = new Date(milsec_int);
  return {
    year : wk.getFullYear(),
    month : ('00' + (wk.getMonth() + 1)).slice(-2),
    day : ('00' + wk.getDate()).slice(-2),
    hour : ('00' + wk.getHours()).slice(-2),
    minute : ('00' + wk.getMinutes()).slice(-2),
  };
};

const getDatetimeTextFromMillsec = milsec_int => {
  const dtObj = parseFromMillsec(milsec_int);
  return `${dtObj['year']}-${dtObj['month']}-${dtObj['day']} ${dtObj['hour']}:${dtObj['minute']}`;
};

const commonSpecExtractor = specRecord => {
  if(Object.prototype.hasOwnProperty.call(specRecord, 'string')) {
    return specRecord.string;
  }
  else if(Object.prototype.hasOwnProperty.call(specRecord, 'plain')) {
    if(specRecord.plain === 'url') {
      return window.location.href;
    }
    else if(specRecord.plain === 'url_nohs') {
      // when URL includes '#!' path, all things become 'hash' after that part.
      // so, you cannot use very convenient properties like URL.hash, URL.search.
      // if you can use them, assigning URL.hash = "" and URL.search = "" is enough.
      const parts = window.location.href.split('#');
      if(parts.length === 1) {
        // no #. remove query part.
        return window.location.href.split('?')[0];
      }
      else if(parts.length === 2) {
        // only 1 #
        if(parts[1].includes('/')) {
          // only remove query http://example.com/#!/foo.html?bar=1
          // dont know http://example.com/#!/?bar=1
          return window.location.href.split('?')[0];
        }
        else {
          // O.K. http://example.com/foo#point?bar=1
          // dont know http://example.com/#foo?bar=1
          return parts[0];
        }
      }
      else {
        // more #. remove last one and after part.
        const lastIdx = window.location.href.lastIndexOf('#');
        return window.location.href.slice(0, lastIdx);
      }
    }
    else if(specRecord.plain === 'title') {
      return document.title;
    }
    else if(specRecord.plain === 'title_esc') {
      return escapeHtmlChar(document.title);
    }
    else if(specRecord.plain === 'title_reST') {
      return escapeReST(document.title);
    }
    else if(specRecord.plain === 'title_md') {
      return escapeMd(document.title);
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

  build : tgt => {
    const result = [];
    tgt.forEach(val => {
      result.push(commonSpecExtractor(val));
    });
    textPicker.RESULT_ARR = result;
  },

  onCopy : evt => {
    if(window.getSelection().toString() === '') {
      const outputText = textPicker.RESULT_ARR
        .reduce((acm, val) => {
          return acm + val;
        }, '');
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

  regexHref : /(https?:\/\/[^\s…]+)…?/g,

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
        resultTextArr.push(escapeReST(tgtText.slice(headIdx, wkMatchArr.index)));
        resultTextArr.push(`\`URL <${wkMatchArr[1]}>\`__`);
        headIdx = tweetPicker.regexHref.lastIndex;
      }
      resultTextArr.push(escapeReST(tgtText.slice(headIdx)));
    }
    else if(opt.format === 'md') {
      while((wkMatchArr = tweetPicker.regexHref.exec(tgtText)) !== null) {
        resultTextArr.push(escapeMd(tgtText.slice(headIdx, wkMatchArr.index)));
        resultTextArr.push(`[URL](${wkMatchArr[1]})`);
        headIdx = tweetPicker.regexHref.lastIndex;
      }
      resultTextArr.push(escapeMd(tgtText.slice(headIdx)));
    }

    return resultTextArr.join('');
  },

  getTweetUrl : tgt_elm => {
    if(tweetPicker.CUR_IS_PICKUP) {
      return window.location.href;
    }
    else {
      const selector = ':scope > div > div > div > div > div > div > div > div > div > a';
      const urlElm = tgt_elm.querySelector(selector);
      return urlElm === null ? '' : urlElm.href.trim();
    }
  },

  getQTUrl : tgt_elm => {
    return '';
  },

  getTweetTimestamp : tgt_elm => {
    if(tweetPicker.CUR_IS_PICKUP) {
      const timeElm = tgt_elm.querySelector(`:scope div[data-testid="tweet"] + div > div:nth-child(${tweetPicker.CUR_IS_REPLY ? 4 : 3}) > div > div > a`);
      return timeElm === null ? '' : timeElm.textContent.trim();
    }
    const timeElm = tgt_elm.querySelector(':scope time');
    return timeElm === null ? '' : getDatetimeTextFromMillsec(Date.parse(timeElm.getAttribute('datetime').trim()));
  },

  getQTTimestamp : tgt_elm => {
    const selector = tweetPicker.CUR_IS_PICKUP
      ? `:scope > div > div:nth-child(${tweetPicker.CUR_IS_REPLY ? 5 : 4}) > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(2) time`
      : `:scope div[data-testid="tweet"] > div:nth-child(2) > div:nth-child(2) > div:nth-child(${tweetPicker.CUR_IS_REPLY ? 3 : 2}) > div > div > div > div:nth-child(2) > div > div > div:nth-child(2) time`;
    const timeElm = tgt_elm.querySelector(selector);
    return timeElm === null ? '' : getDatetimeTextFromMillsec(Date.parse(timeElm.getAttribute('datetime').trim()));
  },

  getTweetUsername : tgt_elm => {
    const selector = tweetPicker.CUR_IS_PICKUP
      ? ':scope div[data-testid="tweet"] > div:nth-child(2) > div > div > div > div > a > div > div > div'
      : ':scope > div > div > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div > div > div > a > div > div';
    const usernameElm = tgt_elm.querySelector(selector);
    return usernameElm === null ? '' : usernameElm.textContent.trim();
  },

  getQTUsername : tgt_elm => {
    const selector = tweetPicker.CUR_IS_PICKUP
      ? `:scope > div > div:nth-child(${tweetPicker.CUR_IS_REPLY ? 5 : 4}) > div:nth-child(2) > div > div:nth-child(2) > div > div > div > div > div > div > div > div`
      : `:scope div[data-testid="tweet"] > div:nth-child(2) > div:nth-child(2) > div:nth-child(${tweetPicker.CUR_IS_REPLY ? 3 : 2}) > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div > div:nth-child(2)`;
    const usernameElm = tgt_elm.querySelector(selector);
    return usernameElm === null ? '' : usernameElm.textContent.trim();
  },

  CUR_ARTICLE : null,
  CUR_HAS_QT : false,
  CUR_IS_PICKUP : false,
  CUR_IS_REPLY : false,
  CUR_MAIN_TEXT : '',
  CUR_QT_TEXT : '',

  prepareCurText : tgt_elm => {
    const mainTextSelector = tweetPicker.CUR_IS_PICKUP
      ? `:scope div[data-testid="tweet"] + div > div:nth-child(${tweetPicker.CUR_IS_REPLY ? 2 : 1}) > div > div`
      : `:scope > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(${tweetPicker.CUR_IS_REPLY ? 2 : 1}) > div > div`;
    const mainTextElm = tgt_elm.querySelector(mainTextSelector);
    if(mainTextElm?.hasAttribute('lang')) {
      let mainText = mainTextElm.textContent.trim();
      let qtText = '';
      // anyway oneline
      mainText = mainText.replace(/\r\n/g, ' ')
        .replace(/\n\r/g, ' ')
        .replace(/\n/g, ' ');
      if(tweetPicker.CUR_HAS_QT) {
        const qtTextSelector = tweetPicker.CUR_IS_PICKUP
          ? `:scope > div > div:nth-child(${tweetPicker.CUR_IS_REPLY ? 5 : 4}) > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) div[dir]`
          : `:scope > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(${tweetPicker.CUR_IS_REPLY ? 3 : 2}) > div > div > div > div:nth-child(2) > div > div:nth-child(2) > div`;
        const qtTextElm = tgt_elm.querySelector(qtTextSelector);
        if(qtTextElm) {
          qtText = qtTextElm.textContent.trim();
          qtText = qtText.replace(/\r\n/g, ' ')
            .replace(/\n\r/g, ' ')
            .replace(/\n/g, ' ');
        }
      }
      tweetPicker.CUR_MAIN_TEXT = mainText;
      tweetPicker.CUR_QT_TEXT = qtText;
    }
  },

  getCurTweet : () => {
    // almost once in each request to copy-with-template
    if(tweetPicker.CUR_ARTICLE === null) {
      tweetPicker.CUR_ARTICLE = document.querySelector('article[data-focusvisible-polyfill="true"]');
      if(tweetPicker.CUR_ARTICLE !== null) {
        const siblingOnlyWhenPickup = tweetPicker.CUR_ARTICLE.querySelector(':scope div[data-testid="tweet"] + div');
        if(siblingOnlyWhenPickup !== null) {
          tweetPicker.CUR_IS_PICKUP = true;
        }
        const unlessReplySelector = tweetPicker.CUR_IS_PICKUP
          ? ':scope div[data-testid="tweet"] + div > div:nth-child(1) > div > div'
          : ':scope > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div';
        const textUnlessReply = tweetPicker.CUR_ARTICLE.querySelector(unlessReplySelector);
        if(textUnlessReply?.hasAttribute('lang') === false) {
          tweetPicker.CUR_IS_REPLY = true;
        }
        const qtTextSelector = tweetPicker.CUR_IS_PICKUP
          ? `:scope > div > div:nth-child(${tweetPicker.CUR_IS_REPLY ? 5 : 4}) div[role="blockquote"]`
          : `:scope > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(${tweetPicker.CUR_IS_REPLY ? 3 : 2}) > div > div > div > div:nth-child(2) > div > div:nth-child(2) > div`;
        const qtTextElm = tweetPicker.CUR_ARTICLE.querySelector(qtTextSelector);
        tweetPicker.CUR_HAS_QT = qtTextElm?.hasAttribute('lang');
        tweetPicker.prepareCurText(tweetPicker.CUR_ARTICLE);
      }
    }
    return tweetPicker.CUR_ARTICLE;
  },

  build : specArr => {
    const result = [];
    specArr.forEach(spec => {
      if(Object.prototype.hasOwnProperty.call(spec, 'twitter') === false) {
        result.push(commonSpecExtractor(spec));
      }
      else {
        const tweetBody = tweetPicker.getCurTweet();
        if(!tweetBody) {
          console.debug('cannot copy for tweet');
        }
        else if(spec.twitter === 'url') {
          result.push(tweetPicker.getTweetUrl(tweetBody));
        }
        else if(spec.twitter === 'datetime') {
          result.push(tweetPicker.getTweetTimestamp(tweetBody));
        }
        else if(spec.twitter === 'username') {
          result.push(tweetPicker.getTweetUsername(tweetBody));
        }
        else if(spec.twitter === 'username_esc') {
          result.push(escapeHtmlChar(tweetPicker.getTweetUsername(tweetBody)));
        }
        else if(spec.twitter === 'username_reST') {
          result.push(escapeReST(tweetPicker.getTweetUsername(tweetBody)));
        }
        else if(spec.twitter === 'username_md') {
          result.push(escapeMd(tweetPicker.getTweetUsername(tweetBody)));
        }
        else if(spec.twitter === 'text') {
          result.push(tweetPicker.CUR_MAIN_TEXT);
        }
        else if(spec.twitter === 'text_html') {
          result.push(tweetPicker.activateHrefText(tweetPicker.CUR_MAIN_TEXT, {format: 'html'}));
        }
        else if(spec.twitter === 'text_reST') {
          result.push(tweetPicker.activateHrefText(tweetPicker.CUR_MAIN_TEXT, {format: 'reST'}));
        }
        else if(spec.twitter === 'text_md') {
          result.push(tweetPicker.activateHrefText(tweetPicker.CUR_MAIN_TEXT, {format: 'md'}));
        }
        else if(tweetPicker.CUR_HAS_QT) {
          if(spec.twitter === 'qt_string' && Object.prototype.hasOwnProperty.call(spec, 'string')) {
            result.push(spec.string);
          }
          else if(spec.twitter === 'qt_url') {
            result.push(tweetPicker.getQTUrl(tweetBody));
          }
          else if(spec.twitter === 'qt_datetime') {
            result.push(tweetPicker.getQTTimestamp(tweetBody));
          }
          else if(spec.twitter === 'qt_username') {
            result.push(tweetPicker.getQTUsername(tweetBody));
          }
          else if(spec.twitter === 'qt_username_esc') {
            result.push(escapeHtmlChar(tweetPicker.getQTUsername(tweetBody)));
          }
          else if(spec.twitter === 'qt_username_reST') {
            result.push(escapeReST(tweetPicker.getQTUsername(tweetBody)));
          }
          else if(spec.twitter === 'qt_username_md') {
            result.push(escapeMd(tweetPicker.getQTUsername(tweetBody)));
          }
          else if(spec.twitter === 'qt_text') {
            result.push(tweetPicker.CUR_QT_TEXT);
          }
          else if(spec.twitter === 'qt_text_html') {
            result.push(tweetPicker.activateHrefText(tweetPicker.CUR_QT_TEXT, {format: 'html'}));
          }
          else if(spec.twitter === 'qt_text_reST') {
            result.push(tweetPicker.activateHrefText(tweetPicker.CUR_QT_TEXT, {format: 'reST'}));
          }
          else if(spec.twitter === 'qt_text_md') {
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
    tweetPicker.CUR_ARTICLE = null;
    tweetPicker.CUR_HAS_QT = false;
    tweetPicker.CUR_IS_PICKUP = false;
    tweetPicker.CUR_IS_REPLY = false;
    tweetPicker.CUR_MAIN_TEXT = '';
    tweetPicker.CUR_QT_TEXT = '';
  },

  handleKeydown : evt => {
    switch(evt.key) {
      case 'j':
        resetTemplateIndex();
        break;
      case 'k':
        resetTemplateIndex();
        break;
    }
  },

  onCopy : evt => {
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

browser.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
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
