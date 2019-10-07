const STORE_NAME = 'site_arr';

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
      ['title_reST', 'title reST'],
      ['title_md', 'title md'],
      ['today', 'today'],
    ],
    twitter : [
      ['url', 'url'],
      ['datetime', 'datetime (works UNLESS it is picked up)'],
      ['username', 'username'],
      ['username_esc', 'username ESC'],
      ['username_reST', 'username reST'],
      ['username_md', 'username md'],
      ['text', 'text'],
      ['text_html', 'text_html'],
      ['text_reST', 'text reST'],
      ['text_md', 'text md'],
      ['qt_string', 'QT string'],
      ['qt_url', 'QT url(NOT WORK)'],
      ['qt_datetime', 'QT datetime'],
      ['qt_username', 'QT username'],
      ['qt_username_esc', 'QT username ESC'],
      ['qt_username_reST', 'QT username reST'],
      ['qt_username_md', 'QT username md'],
      ['qt_text', 'QT text'],
      ['qt_text_html', 'QT text html'],
      ['qt_text_reST', 'QT text reST'],
      ['qt_text_md', 'QT text md'],
    ],
  },

  restoreEntries : () => {
    browser.storage.local.get(STORE_NAME).then(store_obj => {
      const result = store_obj[STORE_NAME];
      if(!result || result.length === 0) {
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
      inpElm.id = `si_${site.ord}_default`;
      siteTopDiv.appendChild(inpElm);

      inpElm = document.createElement('input');
      inpElm.type = 'hidden';
      inpElm.value = site.name;
      inpElm.id = `si_${site.ord}_name`;
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

  makeSiteOpeMenu : (site) => {
    const ret = document.createElement('div');
    ret.classList.add('site_ope');

    const wkTxtNode = document.createTextNode('add template');
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('site_add');
    button.id = `si_${site.ord}_menu_add`;
    button.appendChild(wkTxtNode);
    ret.appendChild(button);

    return ret;
  },

  makeEachTemplate : (template, siteOpt) => {
    const ret = document.createElement('div');
    ret.classList.add('each_template');
    ret.id = `si_${siteOpt.ord}_te_${template.ord}`;
    ret.appendChild(configUI.makeEachTemplateOpeMenu(template, siteOpt));
    ret.appendChild(configUI.makeEachTemplateBody(template, siteOpt));
    ret.appendChild(configUI.makeEachTemplatePreview(template, siteOpt));
    return ret;
  },

  displayErrorMessage : (message) => {
    const previewDivList = document.querySelectorAll('.template_preview');
    previewDivList.forEach(elm => {
      while(elm.firstChild) {
        elm.removeChild(elm.firstChild);
      }
      const wkTxtNode = document.createTextNode(message);
      const parElm = document.createElement('p');
      parElm.classList.add('show_error');
      parElm.appendChild(wkTxtNode);
      elm.appendChild(parElm);
    });
  },

  getHelptextContent : (siteOrd, templateOrd) => {
    if(siteOrd === 0 && templateOrd === 0) {
      return `
        How to use: if we click left near-outside part from this zone, we get plain concatenated-form, 
        for each template.\n
        ⇦⇦⇦⇦\n
        'xxx ESC' means (only) '& < >' to '&amp; &lt; &gt;'
        `;
    }
    else if(siteOrd === 0 && templateOrd === 1) {
      return `
        There is no menu to remove unneccessary template. 
        If we wanna do that now, use 'delete' to all spec-type. 
        But DO NOT try to remove all template of any site.
        `;
    }
    else if(siteOrd === 0 && templateOrd === 2) {
      return `
        Anyway until we click 'Save All' button and manually reload, 
        old settings remain on screen.
        If 'delete' is miss-selected and the value partially remains here, 
        we may recover by pulling back 'type' setting.
        `;
    }
    else if(siteOrd === 0 && templateOrd === 3) {
      const wk = new Date();
      return `
        'today' is just only 
        ${wk.getFullYear()}-${('00' + (wk.getMonth() + 1)).slice(-2)}-${('00' + wk.getDate()).slice(-2)}
        ${('00' + wk.getHours()).slice(-2)}:${('00' + wk.getMinutes()).slice(-2)}.
        Let's give up other important but too many formats.
        `;
    }
    else if(siteOrd === 1 && templateOrd === 0) {
      return `
        [twitter] copy from current-choice (with j/k key), or overlayed tweet.
        But I know only japanese edition, this may not work in other region.
        Version-up for the region I don't know never happen, excuse me.
        And any changes in twitter pages or alpha-beta test may happen, maybe I cannot respond to them.
        `;
    }
    else if(siteOrd === 1 && templateOrd === 1) {
      return `
        [twitter] 'text html' escapes '&amp; &lt; &gt;' to '&amp;amp; ...', 
        and transform each link in tweet to '&lt;a href...&gt;URL(⇦fixed)&lt;/a&gt;'.
        'reST' and 'md' transforms links in tweet, to each format, \`URL <..>\`__, [URL](..),
        and does not escape.
        'QT' means copying from only 1 nested quoted tweet, if exists.
        `;
    }
    else if(siteOrd === 1 && templateOrd === 2) {
      return `
        As for CSS Selector, which is useful and I want to use in template, 
        but I don't wanna empower negative or not-interesting behavior, 
        so may not be implemented.
        `;
    }
  },

  makeEachTemplatePreview : (template, siteOpt) => {
    const ret = document.createElement('div');
    ret.classList.add('template_preview');
    ret.id = `si_${siteOpt.ord}_te_${template.ord}_preview`;
    ret.classList.add('loud');
    const wkTxtNode = document.createTextNode(configUI.getHelptextContent(siteOpt.ord, template.ord));
    const parElm = document.createElement('par');
    parElm.appendChild(wkTxtNode);
    ret.appendChild(parElm);
    return ret;
  },

  makeEachTemplateOpeMenu : (template, siteOpt) => {
    const makeOpeButton = (menuName) => {
      const wkTxtNode = document.createTextNode(menuName);
      const button = document.createElement('button');
      button.type = 'button';
      button.id = `si_${siteOpt.ord}_te_${template.ord}_menu_${menuName}`;
      button.appendChild(wkTxtNode);
      return button;
    };
    const ret = document.createElement('div');
    ret.classList.add('template_ope');
    ret.appendChild(makeOpeButton('freeze'));
    ret.appendChild(makeOpeButton('up'));
    ret.appendChild(makeOpeButton('down'));
    ret.appendChild(makeOpeButton('add'));
    return ret;
  },

  makeEachTemplateBody : (template, siteOpt) => {
    const ret = document.createElement('div');
    ret.classList.add('template_body');
    ret.id = `si_${siteOpt.ord}_te_${template.ord}_body`;
    ret.appendChild(configUI.makeEachTemplateBodyContent(template, siteOpt));
    return ret;
  },

  makeEachTemplateBodyContent : (template, siteOpt) => {
    const ret = document.createDocumentFragment();
    const inpElm = document.createElement('input');
    inpElm.type = 'hidden';
    inpElm.value = !!template.frozen;
    inpElm.id = `si_${siteOpt.ord}_te_${template.ord}_frozen`;
    ret.appendChild(inpElm);

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
      let curSpecType = ''; // delete, string, plain, twitter...
      selectElm = document.createElement('select');
      selectElm.id = `si_${siteOpt.ord}_te_${template.ord}_sp_${idx}_type`;
      configUI.specTypeList[siteOpt.type].forEach(elm => {
        optionElm = document.createElement('option');
        optionElm.value = elm;
        wkTxtNode = document.createTextNode(elm);
        optionElm.appendChild(wkTxtNode);
        // when add-spec and soon up-down, empty string comes (and become false here...)
        if(spec[elm] || (elm === 'string' && spec[elm] === '')) {
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
      if(curSpecType === 'delete') {
        inpElm = document.createElement('textarea');
        inpElm.value = spec[curSpecType];
        inpElm.id = `si_${siteOpt.ord}_te_${template.ord}_sp_${idx}_val_0`;
        tdElm.appendChild(inpElm);
      }
      else if(curSpecType === 'string') {
        inpElm = document.createElement('textarea');
        inpElm.value = spec[curSpecType];
        inpElm.id = `si_${siteOpt.ord}_te_${template.ord}_sp_${idx}_val_0`;
        tdElm.appendChild(inpElm);
      }
      else if(curSpecType === 'plain') {
        selectElm = document.createElement('select');
        selectElm.id = `si_${siteOpt.ord}_te_${template.ord}_sp_${idx}_val_0`;
        configUI.specItemMap[curSpecType].forEach(pair => {
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
        configUI.specItemMap[curSpecType].forEach(pair => {
          optionElm = document.createElement('option');
          optionElm.value = pair[0];
          wkTxtNode = document.createTextNode(pair[1]);
          optionElm.appendChild(wkTxtNode);
          if(pair[0] === spec[curSpecType]) {
            optionElm.selected = true;
            if(pair[0] === 'qt_string') {
              has3rdInput = true;
              inpElm = document.createElement('textarea');
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
    siteArr.forEach((site, idx) => {
      site.ord = idx;
      const eachSiteRoot = document.createElement('div');
      eachSiteRoot.classList.add('each_site');
      eachSiteRoot.id = `si_${site.ord}_root`;
      eachSiteRoot.appendChild(configUI.makeSiteTop(site));
      eachSiteRoot.appendChild(configUI.makeSiteOpeMenu(site));
      const siteType = (site.urlHead && site.urlHead.startsWith('https://twitter.com')) ? 'twitter' : 'common';
      if(siteType === 'twitter') {
        eachSiteRoot.classList.add('twitter');
      }
      site.templates.forEach((template, teIdx) => {
        template.ord = teIdx;
        eachSiteRoot.appendChild(configUI.makeEachTemplate(template, {type:siteType, ord:site.ord}));
      });
      siteListRoot.appendChild(eachSiteRoot);
      // oh need to update
      site.templates.forEach((template, teIdx) => {
        configUI.updateFrozen(site.ord, teIdx);
      });
    });
  },

  saveEntries : () => {
    const maybeSiteArr = configUI.extractWhole();
    if(Array.isArray(maybeSiteArr) === false && maybeSiteArr.error) {
      const mess = `
        ${maybeSiteArr.name} has wrong settings.
        Templates counts ${maybeSiteArr.templates.length}.
        Nothing was registerd.`;
      configUI.displayErrorMessage(mess);
    }
    else {
      browser.storage.local.set({
        [STORE_NAME]: maybeSiteArr,
      });
    }
  },

  toggleFrozen : (siteOrd, templateOrd) => {
    const frozenInp = document.getElementById(`si_${siteOrd}_te_${templateOrd}_frozen`);
    frozenInp.value = (frozenInp.value === 'true') ? 'false' : 'true';
    configUI.updateFrozen(siteOrd, templateOrd);
  },

  updateFrozen : (siteOrd, templateOrd) => {
    const frozenInp = document.getElementById(`si_${siteOrd}_te_${templateOrd}_frozen`);
    const goDisabled = (frozenInp.value === 'true') ? true : false;
    const root = document.getElementById(`si_${siteOrd}_te_${templateOrd}`);
    let tgtElm = root.querySelector(`#si_${siteOrd}_te_${templateOrd}_name`);
    tgtElm.disabled = goDisabled;
    let specIdx = 0;
    while((tgtElm = root.querySelector(`#si_${siteOrd}_te_${templateOrd}_sp_${specIdx}_type`)) !== null) {
      tgtElm.disabled = goDisabled;
      specIdx++;
    }
    specIdx = 0;
    while((tgtElm = root.querySelector(`#si_${siteOrd}_te_${templateOrd}_sp_${specIdx}_val_0`)) !== null) {
      tgtElm.disabled = goDisabled;
      specIdx++;
    }
    // cannot use while
    for(let i = 0; i < specIdx; i++) {
      if((tgtElm = root.querySelector(`#si_${siteOrd}_te_${templateOrd}_sp_${i}_val_1`)) !== null) {
        tgtElm.disabled = goDisabled;
      }
    }
  
    const freezeBtn = document.getElementById(`si_${siteOrd}_te_${templateOrd}_menu_freeze`);
    const addSpecBtn = document.getElementById(`si_${siteOrd}_te_${templateOrd}_menu_add`);
    if(goDisabled) {
      freezeBtn.textContent = 'thaw back';
      if(!freezeBtn.classList.contains('goHot')) {
        freezeBtn.classList.add('goHot');
      }
      addSpecBtn.disabled = true;
    }
    else {
      freezeBtn.textContent = 'freeze';
      if(freezeBtn.classList.contains('goHot')) {
        freezeBtn.classList.remove('goHot');
      }
      addSpecBtn.disabled = false;
    }
  },

  addSpec : (siteOrd, templateOrd) => {
    const urlHead = document.getElementById(`si_${siteOrd}_urlhead`);
    const siteType = (urlHead && urlHead.value.startsWith('https://twitter.com')) ? 'twitter' : 'common';
    const tableElm = document.getElementById(`si_${siteOrd}_te_${templateOrd}_table`);
    const trList = tableElm.getElementsByTagName('tr');
    const nextIdx = (trList.length - 2); // we need n, s.t. template-name(1) + header(1) + td(n:0--n-1)
    const trElm = document.createElement('tr');

    let tdElm, optionElm, wkTxtNode;
    const selectElm = document.createElement('select');
    selectElm.id = `si_${siteOrd}_te_${templateOrd}_sp_${nextIdx}_type`;
    configUI.specTypeList[siteType].forEach((elm) => {
      optionElm = document.createElement('option');
      optionElm.value = elm;
      wkTxtNode = document.createTextNode(elm);
      optionElm.appendChild(wkTxtNode);
      if(elm === 'string') {
        optionElm.selected = true;
      }
      selectElm.appendChild(optionElm);
    });
    tdElm = document.createElement('td');
    tdElm.appendChild(selectElm);
    trElm.appendChild(tdElm);
    // ------------------------------------------------------------
    tdElm = document.createElement('td');
    const inpElm = document.createElement('textarea');
    inpElm.value = '';
    inpElm.id = `si_${siteOrd}_te_${templateOrd}_sp_${nextIdx}_val_0`;
    tdElm.appendChild(inpElm);
    trElm.appendChild(tdElm);
    // ------------------------------------------------------------
    tableElm.appendChild(trElm);
  },

  extractWhole : () => {
    let ret = [];
    const siteListRoot = document.getElementById('site_list');
    const siteList = siteListRoot.getElementsByClassName('each_site');
    const siteCnt = siteList.length;
    for(let i = 0; i < siteCnt; i++) {
      const siObj = configUI.extractEachSite(i);
      if(siObj.templates.length > 0) {
        ret.push(siObj);
      }
      else {
        siObj.error = true;
        ret = siObj;
        break;
      }
    }
    //console.log(`${JSON.stringify(ret, null, '  ')}`);
    return ret;
  },

  extractEachSite : (siteOrd) => {
    const ret = {};
    const siteRoot = document.getElementById(`si_${siteOrd}_root`);
    const templateList = siteRoot.getElementsByClassName('each_template');
    const templateCnt = templateList.length;
    let wkElm;
    wkElm = document.getElementById(`si_${siteOrd}_default`);
    if(wkElm && wkElm.value === 'true') {
      ret.default = true;
    }
    else {
      ret.default = false;
    }
    wkElm = document.getElementById(`si_${siteOrd}_name`);
    if(wkElm) {
      ret.name = wkElm.value;
    }
    wkElm = document.getElementById(`si_${siteOrd}_urlhead`);
    if(wkElm) {
      ret.urlHead = wkElm.value;
    }

    ret.templates = [];
    for(let i = 0; i < templateCnt; i++) {
      const teObj = configUI.extractTemplate(siteOrd, i, true);
      if(teObj.specArr.length > 0) {
        ret.templates.push(teObj);
      }
    }
    return ret;
  },

  extractTemplate : (siteOrd, templateOrd, goEliminate) => {
    const ret = {};
    let wkElm;
    wkElm = document.getElementById(`si_${siteOrd}_te_${templateOrd}_frozen`);
    ret.frozen = (wkElm.value === 'true') ? true : false;
    wkElm = document.getElementById(`si_${siteOrd}_te_${templateOrd}_name`);
    ret.name = wkElm.value;

    ret.specArr = [];
    let specIdx = 0, tgtElm;
    if(goEliminate) {
      while((tgtElm = document.getElementById(`si_${siteOrd}_te_${templateOrd}_sp_${specIdx}_type`)) !== null) {
        const specType = tgtElm.value;
        if(specType !== 'delete') {
          let valElm = document.getElementById(`si_${siteOrd}_te_${templateOrd}_sp_${specIdx}_val_0`);
          const specVal_0 = valElm.value;
          const curSpec = {
            [specType] : specVal_0,
          };
          if(specVal_0 !== 'qt_string') {
            if(specType !== 'string') {
              ret.specArr.push(curSpec);
            }
            else if(specVal_0 !== '') {
              ret.specArr.push(curSpec);
            }
          }
          else {
            if((valElm = document.getElementById(`si_${siteOrd}_te_${templateOrd}_sp_${specIdx}_val_1`)) !== null
              && valElm.value !== '') {
              curSpec.string = valElm.value;
              ret.specArr.push(curSpec);
            }
          }
        }
        specIdx++;
      }
    }
    else {
      while((tgtElm = document.getElementById(`si_${siteOrd}_te_${templateOrd}_sp_${specIdx}_type`)) !== null) {
        const specType = tgtElm.value;
        let valElm = document.getElementById(`si_${siteOrd}_te_${templateOrd}_sp_${specIdx}_val_0`);
        const curSpec = {
          [specType] : valElm.value,
        };
        if((valElm = document.getElementById(`si_${siteOrd}_te_${templateOrd}_sp_${specIdx}_val_1`)) !== null) {
          curSpec.string = valElm.value;
        }
        ret.specArr.push(curSpec);
        specIdx++;
      }
    }

    return ret;
  },

  upTemplate : (siteOrd, templateOrd) => {
    if(templateOrd === 0) {
      return;
    }

    const urlHead = document.getElementById(`si_${siteOrd}_urlhead`);
    const siteType = (urlHead && urlHead.value.startsWith('https://twitter.com')) ? 'twitter' : 'common';
    const curTemplate = configUI.extractTemplate(siteOrd, templateOrd);
    const anoTemplate = configUI.extractTemplate(siteOrd, templateOrd - 1);

    const curPosBody = document.getElementById(`si_${siteOrd}_te_${templateOrd}_body`);
    while(curPosBody.firstChild) {
      curPosBody.removeChild(curPosBody.firstChild);
    }
    const anoPosBody = document.getElementById(`si_${siteOrd}_te_${templateOrd - 1}_body`);
    while(anoPosBody.firstChild) {
      anoPosBody.removeChild(anoPosBody.firstChild);
    }

    // EXCHANGE !!!
    curTemplate.ord = templateOrd - 1;
    anoTemplate.ord = templateOrd;
    const newCurPosBody = configUI.makeEachTemplateBodyContent(anoTemplate, {type:siteType, ord:siteOrd});
    const newAnoPosBody = configUI.makeEachTemplateBodyContent(curTemplate, {type:siteType, ord:siteOrd});
    curPosBody.appendChild(newCurPosBody);
    anoPosBody.appendChild(newAnoPosBody);
    configUI.updateFrozen(siteOrd, curTemplate.ord);
    configUI.updateFrozen(siteOrd, anoTemplate.ord);
  },

  downTemplate : (siteOrd, templateOrd) => {
    const eachSiteRoot = document.getElementById(`si_${siteOrd}_root`);
    const templateCnt = eachSiteRoot.getElementsByClassName('each_template').length;
    if(templateOrd === (templateCnt - 1)) {
      return;
    }
    else if(templateCnt > 1) {
      configUI.upTemplate(siteOrd, templateOrd + 1);
    }
  },

  addTemplate : (siteOrd) => {
    const eachSiteRoot = document.getElementById(`si_${siteOrd}_root`);
    const templateCnt = eachSiteRoot.getElementsByClassName('each_template').length;
    const nextTemplateOrd = templateCnt;
    const urlHead = document.getElementById(`si_${siteOrd}_urlhead`);
    const siteType = (urlHead && urlHead.value.startsWith('https://twitter.com')) ? 'twitter' : 'common';
    const plainTemplate = {
      name: `NEW ${nextTemplateOrd}`,
      frozen: false,
      specArr: [
        {string: '<a href="'},
        {plain: 'url_nohs'},
        {string: '">'},
        {plain: 'title_esc'},
        {string: '</a>'},
      ]
    };
    const plainTwTemplate = {
      name: `NEW ${nextTemplateOrd}`,
      frozen: false,
      specArr: [
        {string: '<a href="'},
        {twitter: 'url'},
        {string: '">'},
        {twitter: 'datetime'},
        {string: ' '},
        {twitter: 'username_esc'},
        {string: '</a>: '},
        {twitter: 'text_html'},
      ]
    };

    if(siteType === 'twitter') {
      plainTwTemplate.ord = nextTemplateOrd;
      eachSiteRoot.appendChild(configUI.makeEachTemplate(plainTwTemplate, {type:siteType, ord:siteOrd}));
    }
    else {
      plainTemplate.ord = nextTemplateOrd;
      eachSiteRoot.appendChild(configUI.makeEachTemplate(plainTemplate, {type:siteType, ord:siteOrd}));
    }
    const added = document.getElementById(`si_${siteOrd}_te_${nextTemplateOrd}`);
    added.classList.add('new_template');
    added.scrollIntoView();
  },

};

const regexSiteMenuId = /^si_(\d+)_menu_([^_]+)$/;
const regexTMenuId = /^si_(\d+)_te_(\d+)_menu_([^_]+)$/;
const regexSpecTypeId = /^si_(\d+)_te_(\d+)_sp_(\d+)_type$/;
const regexSpecValId_0 = /^si_(\d+)_te_(\d+)_sp_(\d+)_val_0$/;
const regexTBodyId = /^si_(\d+)_te_(\d+)_body$/;
document.addEventListener('DOMContentLoaded', configUI.restoreEntries);
document.getElementById('save').addEventListener('click', configUI.saveEntries);
document.getElementById('site_list').addEventListener('change', e => {
  let wkMatchArr;
  if((wkMatchArr = regexSpecValId_0.exec(e.target.id)) !== null
    && e.target.tagName && e.target.tagName.toLowerCase() === 'select') {
    const specVal_0 = e.target.value;
    let specValElm_1 = document.getElementById(`si_${wkMatchArr[1]}_te_${wkMatchArr[2]}_sp_${wkMatchArr[3]}_val_1`);
    if(specVal_0 === 'qt_string') {
      if(specValElm_1) {
        specValElm_1.disabled = false;
      }
      else {
        specValElm_1 = document.createElement('textarea');
        specValElm_1.value = '';
        specValElm_1.id = `si_${wkMatchArr[1]}_te_${wkMatchArr[2]}_sp_${wkMatchArr[3]}_val_1`;
        e.target.parentElement.appendChild(specValElm_1);
      }
    }
    else {
      if(specValElm_1) {
        specValElm_1.disabled = true;
      }
    }
  }
  else if((wkMatchArr = regexSpecTypeId.exec(e.target.id)) !== null) {
    const newSpecType = e.target.value;
    let oldInput = document.getElementById(`si_${wkMatchArr[1]}_te_${wkMatchArr[2]}_sp_${wkMatchArr[3]}_val_0`);
    const oldSpecVal_0 = oldInput.value;
    const valParentElm_0 = oldInput.parentElement;

    let oldSpecVal_1;
    oldInput = document.getElementById(`si_${wkMatchArr[1]}_te_${wkMatchArr[2]}_sp_${wkMatchArr[3]}_val_1`);
    if(oldInput) {
      oldSpecVal_1 = oldInput.value;
    }
    while(valParentElm_0.firstChild) {
      valParentElm_0.removeChild(valParentElm_0.firstChild);
    }

    let inpElm, selectElm, optionElm, wkTxtNode;
    if(newSpecType === 'delete') {
      inpElm = document.createElement('textarea');
      inpElm.value = oldSpecVal_0; // only display
      inpElm.id = `si_${wkMatchArr[1]}_te_${wkMatchArr[2]}_sp_${wkMatchArr[3]}_val_0`;
      valParentElm_0.appendChild(inpElm);
    }
    else if(newSpecType === 'string') {
      inpElm = document.createElement('textarea');
      inpElm.value = oldSpecVal_0;
      inpElm.id = `si_${wkMatchArr[1]}_te_${wkMatchArr[2]}_sp_${wkMatchArr[3]}_val_0`;
      valParentElm_0.appendChild(inpElm);
    }
    else if(newSpecType === 'plain') {
      selectElm = document.createElement('select');
      selectElm.id = `si_${wkMatchArr[1]}_te_${wkMatchArr[2]}_sp_${wkMatchArr[3]}_val_0`;
      configUI.specItemMap[newSpecType].forEach(pair => {
        optionElm = document.createElement('option');
        optionElm.value = pair[0];
        wkTxtNode = document.createTextNode(pair[1]);
        optionElm.appendChild(wkTxtNode);
        if(pair[0] === oldSpecVal_0) {
          optionElm.selected = true;
        }
        selectElm.appendChild(optionElm);
      });
      valParentElm_0.appendChild(selectElm);
    }
    else if(newSpecType === 'twitter') {
      selectElm = document.createElement('select');
      selectElm.id = `si_${wkMatchArr[1]}_te_${wkMatchArr[2]}_sp_${wkMatchArr[3]}_val_0`;
      configUI.specItemMap[newSpecType].forEach(pair => {
        optionElm = document.createElement('option');
        optionElm.value = pair[0];
        wkTxtNode = document.createTextNode(pair[1]);
        optionElm.appendChild(wkTxtNode);
        if(pair[0] === oldSpecVal_0) {
          optionElm.selected = true;
        }
        selectElm.appendChild(optionElm);
      });
      valParentElm_0.appendChild(selectElm);
    }
    if(oldSpecVal_1) {
      inpElm = document.createElement('textarea');
      inpElm.value = oldSpecVal_1;
      inpElm.id = `si_${wkMatchArr[1]}_te_${wkMatchArr[2]}_sp_${wkMatchArr[3]}_val_1`;
      valParentElm_0.appendChild(inpElm);
    }
  }
});
document.getElementById('site_list').addEventListener('click', e => {
  let wkMatchArr;
  if((wkMatchArr = regexTMenuId.exec(e.target.id)) !== null) {
    if(wkMatchArr[3] === 'freeze') {
      configUI.toggleFrozen(parseInt(wkMatchArr[1]), parseInt(wkMatchArr[2]));
    }
    else if(wkMatchArr[3] === 'add') {
      configUI.addSpec(parseInt(wkMatchArr[1]), parseInt(wkMatchArr[2]));
    }
    else if(wkMatchArr[3] === 'up') {
      configUI.upTemplate(parseInt(wkMatchArr[1]), parseInt(wkMatchArr[2]));
    }
    else if(wkMatchArr[3] === 'down') {
      configUI.downTemplate(parseInt(wkMatchArr[1]), parseInt(wkMatchArr[2]));
    }
  }
  else if(e.target.classList.contains('template_body')) {
    let wkMatchArr;
    if((wkMatchArr = regexTBodyId.exec(e.target.id)) !== null) {
      const previewDiv = document.getElementById(`si_${wkMatchArr[1]}_te_${wkMatchArr[2]}_preview`);
      while(previewDiv.firstChild) {
        previewDiv.removeChild(previewDiv.firstChild);
      }
      const previewTextArr = [];
      let specIdx = 0, specType, specVal_0, specVal_1;
      while((specType = document.getElementById(`si_${wkMatchArr[1]}_te_${wkMatchArr[2]}_sp_${specIdx}_type`)) !== null) {
        if(specType.value !== 'delete') {
          specVal_0 = document.getElementById(`si_${wkMatchArr[1]}_te_${wkMatchArr[2]}_sp_${specIdx}_val_0`);
          if(specVal_0.value === 'qt_string') {
            specVal_1 = document.getElementById(`si_${wkMatchArr[1]}_te_${wkMatchArr[2]}_sp_${specIdx}_val_1`);
            previewTextArr.push(specVal_1.value);
          }
          else {
            previewTextArr.push(specVal_0.value);
          }
        }
        specIdx++;
      }
      const wkTxtNode = document.createTextNode(previewTextArr.join(''));
      const parElm = document.createElement('p');
      parElm.appendChild(wkTxtNode);
      previewDiv.appendChild(parElm);
    }
  }
  else if((wkMatchArr = regexSiteMenuId.exec(e.target.id)) !== null) {
    if(wkMatchArr[2] === 'add') {
      configUI.addTemplate(parseInt(wkMatchArr[1]));
    }
  }
});

// vim:expandtab ff=dos fenc=utf-8 sw=2
