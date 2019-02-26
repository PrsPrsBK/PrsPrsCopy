/* manually modified */

const escapeHtmlChar = (tgtText) => {
  return tgtText.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

const escapeReST = (tgtText) => {
  return tgtText.replace(/`/g, '\\`');
};

const escapeMd = (tgtText) => {
  return tgtText.replace(/\[/g, '\\[')
    .replace(/]/g, '\\]');
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
      return `${wkURL.protocol}//${wkURL.host}${wkURL.pathname}`;
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
        resultTextArr.push(`[URL](${wkMatchArr[1]})`);
        headIdx = tweetPicker.regexHref.lastIndex;
      }
      resultTextArr.push(tgtText.slice(headIdx));
    }

    return resultTextArr.join('');
  },
  
};


module.exports = {
  tweetPicker,
};
