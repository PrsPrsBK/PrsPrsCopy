if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}

const configUI = {

  onError : (error) => {
    console.log(`Error: ${error}`);
  },

  specTypeList : {
    'common' : [
      'delete',
      'string',
      'plain',
    ],
    'twitter' : [
      'delete',
      'string',
      'plain',
      'twitter',
    ],
  },

  specItemMap : {
    plain : [
      ['url', 'url'],
      ['url_nohs', 'url NO hash/search'],
      ['title', 'title'],
      ['title_esc', 'title ESC'],
      ['today', 'today'],
    ],
    twitter : [
      ['url', 'url'],
      ['datetime', 'datetime'],
      ['username', 'username'],
      ['username_esc', 'username ESC'],
      ['text', 'text'],
      ['text_html', 'text_html'],
      ['text_reST', 'text reST'],
      ['text_md', 'text md'],
      ['qt_string', 'QT string'],
      ['qt_url', 'QT url'],
      ['qt_username', 'QT username'],
      ['qt_username_esc', 'QT username ESC'],
      ['qt_text', 'QT text'],
      ['qt_text_html', 'QT text html'],
      ['qt_text_reST', 'QT text reST'],
      ['qt_text_md', 'QT text md'],
    ],
  },

  restoreEntries : () => {
    browser.storage.local.get('arr_by_site', (store_obj) => {
      const result = store_obj['arr_by_site'];
      if(!result || result.length === 0) {
        console.log('no result!');
        return;
      }
      configUI.reloadHtml(result);
    });
  },

  makeSiteTop : (site) => {
    let wkTxtNode, wkLabel, inpElm, markSpan;
    const siteTopDiv = document.createElement('div');
    siteTopDiv.classList.add('site_top');
    //siteTopDiv.id = `si_${0}`;
    if(site.default) {
      inpElm = document.createElement('input');
      inpElm.type = 'hidden';
      inpElm.value = 'true';
      inpElm.id = 'default_mark';
      siteTopDiv.appendChild(inpElm);

      wkTxtNode = document.createTextNode(`${site.name}`);
      wkLabel = document.createElement('label');
      wkLabel.appendChild(wkTxtNode);
      siteTopDiv.appendChild(wkLabel);
    }
    else {
      wkTxtNode = document.createTextNode('Name: ');
      wkLabel = document.createElement('label');
      wkLabel.appendChild(wkTxtNode);
      inpElm = document.createElement('input');
      inpElm.type = 'text';
      inpElm.required = true;
      inpElm.value = site.name;
      inpElm.id = `si_${site.ord}_name`;
      wkLabel.appendChild(inpElm);
      // do not change this order to append
      markSpan = document.createElement('span');
      wkLabel.appendChild(markSpan);
      siteTopDiv.appendChild(wkLabel);

      wkTxtNode = document.createTextNode('URL Starts: ');
      wkLabel = document.createElement('label');
      wkLabel.appendChild(wkTxtNode);
      inpElm = document.createElement('input');
      inpElm.type = 'url';
      inpElm.required = true;
      inpElm.pattern = 'https?://.+';
      inpElm.value = site.urlHead;
      inpElm.id = `si_${site.ord}_urlhead`;
      wkLabel.appendChild(inpElm);
      // do not change this order to append
      markSpan = document.createElement('span');
      wkLabel.appendChild(markSpan);
      siteTopDiv.appendChild(wkLabel);
    }
    return siteTopDiv;
  },

  /* this maybe does not need to be implemented. 
   * so not called.
   */
  // makeSiteOpeMenu : () => {
  //   let button, wkTxtNode;
  //   const ret = document.createElement('div');
  //   ret.classList.add('site_ope');

  //   wkTxtNode = document.createTextNode('up');
  //   button = document.createElement('button');
  //   button.type = 'button';
  //   button.classList.add('site_up');
  //   button.appendChild(wkTxtNode);
  //   ret.appendChild(button);

  //   wkTxtNode = document.createTextNode('down');
  //   button = document.createElement('button');
  //   button.type = 'button';
  //   button.classList.add('site_down');
  //   button.appendChild(wkTxtNode);
  //   ret.appendChild(button);

  //   wkTxtNode = document.createTextNode('add template');
  //   button = document.createElement('button');
  //   button.type = 'button';
  //   button.classList.add('site_add');
  //   button.appendChild(wkTxtNode);
  //   ret.appendChild(button);

  //   return ret;
  // },

  makeEachTemplate : (template, siteOpt) => {
    const ret = document.createElement('div');
    ret.classList.add('each_template');
    ret.id = `si_${siteOpt.ord}_te_${template.ord}`;
    ret.appendChild(configUI.makeEachTemplateOpeMenu(template, siteOpt));
    ret.appendChild(configUI.makeEachTemplateBody(template, siteOpt));
    ret.appendChild(configUI.makeEachTemplatePreview(template, siteOpt));
    return ret;
  },

  makeEachTemplatePreview : (template, siteOpt) => {
    const ret = document.createElement('div');
    ret.classList.add('template_preview');
    ret.id = `si_${siteOpt.ord}_te_${template.ord}_preview`;
    return ret;
  },

  makeEachTemplateOpeMenu : (template, siteOpt) => {
    let button, wkTxtNode;
    const ret = document.createElement('div');
    ret.classList.add('template_ope');

    wkTxtNode = document.createTextNode('freeze');
    button = document.createElement('button');
    button.type = 'button';
    button.classList.add('template_freeze');
    button.id = `si_${siteOpt.ord}_te_${template.ord}_freeze`;
    button.appendChild(wkTxtNode);
    ret.appendChild(button);

    wkTxtNode = document.createTextNode('up');
    button = document.createElement('button');
    button.type = 'button';
    button.classList.add('template_up');
    button.id = `si_${siteOpt.ord}_te_${template.ord}_up`;
    button.appendChild(wkTxtNode);
    ret.appendChild(button);

    wkTxtNode = document.createTextNode('down');
    button = document.createElement('button');
    button.type = 'button';
    button.classList.add('template_down');
    button.id = `si_${siteOpt.ord}_te_${template.ord}_down`;
    button.appendChild(wkTxtNode);
    ret.appendChild(button);

    wkTxtNode = document.createTextNode('add spec');
    button = document.createElement('button');
    button.type = 'button';
    button.classList.add('template_add');
    button.id = `si_${siteOpt.ord}_te_${template.ord}_add`;
    button.appendChild(wkTxtNode);
    ret.appendChild(button);

    return ret;
  },

  makeEachTemplateBody : (template, siteOpt) => {
    const ret = document.createElement('div');
    ret.classList.add('template_body');
    ret.id = `si_${siteOpt.ord}_te_${template.ord}_body`;
    const tableElm = document.createElement('table');
    tableElm.classList.add('template_rows');
    tableElm.id = `si_${siteOpt.ord}_te_${template.ord}_table`;
    tableElm.appendChild(configUI.makeEachTemplateRows(template, siteOpt));
    ret.appendChild(tableElm);
    return ret;
  },

  makeEachTemplateRows : (template, siteOpt) => {
    let trElm, thElm, tdElm, inpElm, selectElm, wkTxtNode;
    const docFragment = document.createDocumentFragment();

    // template name ------------------------------------------------
    trElm = document.createElement('tr');
    tdElm = document.createElement('td');
    tdElm.colSpan = '3';
    wkTxtNode = document.createTextNode('template name: ');
    const labelElm = document.createElement('label');
    labelElm.appendChild(wkTxtNode);
    inpElm = document.createElement('input');
    inpElm.type = 'text';
    inpElm.value = template.name;
    inpElm.id = `si_${siteOpt.ord}_te_${template.ord}_name`;
    labelElm.appendChild(inpElm);
    tdElm.appendChild(labelElm);
    trElm.appendChild(tdElm);

    docFragment.appendChild(trElm);

    // Header -------------------------------------------------------
    trElm = document.createElement('tr');

    thElm = document.createElement('th');
    wkTxtNode = document.createTextNode('type');
    thElm.appendChild(wkTxtNode);
    trElm.appendChild(thElm);

    thElm = document.createElement('th');
    wkTxtNode = document.createTextNode('spec');
    thElm.appendChild(wkTxtNode);
    trElm.appendChild(thElm);

    docFragment.appendChild(trElm);

    // each spec ----------------------------------------------------
    let optionElm;
    template.specArr.forEach((spec, idx) => {
      trElm = document.createElement('tr');

      // ------------------------------------------------------------
      let curSpecType = ''; //string, plain, twitter...
      selectElm = document.createElement('select');
      selectElm.id = `si_${siteOpt.ord}_te_${template.ord}_sp_${idx}_type`;
      configUI.specTypeList[siteOpt.type].forEach((elm) => {
        optionElm = document.createElement('option');
        optionElm.value = elm;
        wkTxtNode = document.createTextNode(elm);
        optionElm.appendChild(wkTxtNode);
        if(spec[elm]) {
          optionElm.selected = true;
          curSpecType = elm;
        }
        selectElm.appendChild(optionElm);
      });
      tdElm = document.createElement('td');
      tdElm.appendChild(selectElm);
      trElm.appendChild(tdElm);
      // ------------------------------------------------------------
      tdElm = document.createElement('td');
      if(curSpecType === 'string') {
        inpElm = document.createElement('input');
        inpElm.type = 'text';
        inpElm.value = spec[curSpecType];
        inpElm.id = `si_${siteOpt.ord}_te_${template.ord}_sp_${idx}_val_0`;
        tdElm.appendChild(inpElm);
      }
      else if(curSpecType === 'plain') {
        selectElm = document.createElement('select');
        selectElm.id = `si_${siteOpt.ord}_te_${template.ord}_sp_${idx}_val_0`;
        configUI.specItemMap[curSpecType].forEach((pair) => {
          optionElm = document.createElement('option');
          optionElm.value = pair[0];
          wkTxtNode = document.createTextNode(pair[1]);
          optionElm.appendChild(wkTxtNode);
          if(pair[0] === spec[curSpecType]) {
            optionElm.selected = true;
          }
          selectElm.appendChild(optionElm);
        });
        tdElm.appendChild(selectElm);
      }
      else if(curSpecType === 'twitter') {
        selectElm = document.createElement('select');
        selectElm.id = `si_${siteOpt.ord}_te_${template.ord}_sp_${idx}_val_0`;
        let has3rdInput = false;
        configUI.specItemMap[curSpecType].forEach((pair) => {
          optionElm = document.createElement('option');
          optionElm.value = pair[0];
          wkTxtNode = document.createTextNode(pair[1]);
          optionElm.appendChild(wkTxtNode);
          if(pair[0] === spec[curSpecType]) {
            optionElm.selected = true;
            if(pair[0] === 'qt_string') {
              has3rdInput = true;
              inpElm = document.createElement('input');
              inpElm.type = 'text';
              inpElm.value = spec['string'];
              inpElm.id = `si_${siteOpt.ord}_te_${template.ord}_sp_${idx}_val_1`;
            }
          }
          selectElm.appendChild(optionElm);
        });
        tdElm.appendChild(selectElm);
        if(has3rdInput) {
          tdElm.appendChild(inpElm);
        }
      }
      trElm.appendChild(tdElm);
  
      // ------------------------------------------------------------
      docFragment.appendChild(trElm);
    });

    return docFragment;    
  },

  reloadHtml : (siteArr) => {
    const siteListRoot = document.getElementById('site_list');
    while(siteListRoot.firstChild) {
      siteListRoot.removeChild(siteListRoot.firstChild);
    }
    console.log('go-----------------------');
    siteArr.forEach((site, idx) => {
      site.ord = idx;
      const eachSiteRoot = document.createElement('div');
      eachSiteRoot.classList.add('each_site');
      eachSiteRoot.appendChild(configUI.makeSiteTop(site));
      //eachSiteRoot.appendChild(configUI.makeSiteOpeMenu());
      const siteType = (site.urlHead && site.urlHead.startsWith('https://twitter.com')) ? 'twitter' : 'common';
      site.templates.forEach((template, teIdx) => {
        template.ord = teIdx;
        eachSiteRoot.appendChild(configUI.makeEachTemplate(template, {type:siteType, ord:site.ord}));
      });
      siteListRoot.appendChild(eachSiteRoot);
    });
  },

  saveEntries : () => {
    console.log('yes save');
  },

  discardEntries : () => {
    console.log('yes destroy');
    browser.storage.local.set({
      'arr_by_site': [],
    });
  },

  toggleFreeze : (siteOrd, templateOrd) => {
    console.log(`si_${siteOrd}_te_${templateOrd}`);
    const root = document.getElementById(`si_${siteOrd}_te_${templateOrd}`);
    let tgtElm = root.querySelector(`#si_${siteOrd}_te_${templateOrd}_name`);
    tgtElm.disabled = !tgtElm.disabled;
    const goDisabled = tgtElm.disabled;
    const menuElm = document.getElementById(`si_${siteOrd}_te_${templateOrd}_freeze`);
    menuElm.textContent = goDisabled ? 'thaw back' : 'freeze';
    menuElm.classList.toggle('goHot');
    let specIdx = 0;
    while((tgtElm = root.querySelector(`#si_${siteOrd}_te_${templateOrd}_sp_${specIdx}_type`)) !== null) {
      tgtElm.disabled = !tgtElm.disabled;
      specIdx++;
    }
    specIdx = 0;
    while((tgtElm = root.querySelector(`#si_${siteOrd}_te_${templateOrd}_sp_${specIdx}_val_0`)) !== null) {
      tgtElm.disabled = !tgtElm.disabled;
      specIdx++;
    }
    specIdx = 0;
    while((tgtElm = root.querySelector(`#si_${siteOrd}_te_${templateOrd}_sp_${specIdx}_val_1`)) !== null) {
      tgtElm.disabled = !tgtElm.disabled;
      specIdx++;
    }
  },

};

const regexTMenuId = /^si_(\d+)_te_(\d+)_([^_]+)$/;
document.addEventListener('DOMContentLoaded', configUI.restoreEntries);
document.getElementById('save').addEventListener('click', configUI.saveEntries);
document.getElementById('discard').addEventListener('click', configUI.discardEntries);
document.getElementById('site_list').addEventListener('click', (e) => {
  let wkMatchArr;
  if((wkMatchArr = regexTMenuId.exec(e.target.id)) !== null) {
    console.log(`site: ${wkMatchArr[1]} te: ${wkMatchArr[2]} menu: ${wkMatchArr[3]}`);
    if(wkMatchArr[3] === 'freeze') {
      configUI.toggleFreeze(wkMatchArr[1], wkMatchArr[2]);
    }
  }
});

// vim:expandtab ff=dos fenc=utf-8 sw=2
