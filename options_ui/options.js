if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}

const configUI = {

  onError : (error) => {
    console.log(`Error: ${error}`);
  },

  specTypeList : {
    'common' : [
      'string',
      'plain',
    ],
    'twitter' : [
      'string',
      'plain',
      'twitter',
    ],
  },

  specItemMap : {
    plain : [
      'url',
      'url_nohs',
      'title',
      'title_esc',
      'today',
    ],
    twitter : [
      'url',
      'datetime',
      'username',
      'username_esc',
      'text',
      'text_html',
      'text_reST',
      'text_md',
      'qt_string',
      'qt_url',
      'qt_username',
      'qt_username_esc',
      'qt_text',
      'qt_text_html',
      'qt_text_reST',
      'qt_text_md',
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
    let wkTxtNode, wkLabel;
    const siteTopDesc = document.createElement('div');
    siteTopDesc.classList.add('site_top');
    if(site.default) {
      const siteRootDefault = document.createElement('input');
      siteRootDefault.type = 'hidden';
      siteRootDefault.value = 'true';
      siteRootDefault.id = 'default_site_mark';
      siteTopDesc.appendChild(siteRootDefault);

      wkTxtNode = document.createTextNode('default');
      wkLabel = document.createElement('label');
      wkLabel.appendChild(wkTxtNode);
      siteTopDesc.appendChild(wkLabel);
    }
    else if(site.urlHead && site.urlHead !== '') {
      wkTxtNode = document.createTextNode('URL Starts WIth: ');
      wkLabel = document.createElement('label');
      wkLabel.appendChild(wkTxtNode);

      const siteRootUrlHead = document.createElement('input');
      siteRootUrlHead.type = 'url';
      siteRootUrlHead.value = site.urlHead;
      siteRootUrlHead.id = 'site_url_head';
      siteRootUrlHead.style.display = 'inline';
      wkLabel.appendChild(siteRootUrlHead);

      siteTopDesc.appendChild(wkLabel);
    }
    return siteTopDesc;
  },

  makeSiteOpeMenu : () => {
    let button, wkTxtNode;
    const ret = document.createElement('div');
    ret.classList.add('site_ope');

    wkTxtNode = document.createTextNode('up');
    button = document.createElement('button');
    button.classList.add('site_up');
    button.appendChild(wkTxtNode);
    ret.appendChild(button);

    wkTxtNode = document.createTextNode('down');
    button = document.createElement('button');
    button.classList.add('site_down');
    button.appendChild(wkTxtNode);
    ret.appendChild(button);

    wkTxtNode = document.createTextNode('add template');
    button = document.createElement('button');
    button.classList.add('site_add');
    button.appendChild(wkTxtNode);
    ret.appendChild(button);

    return ret;
  },

  makeEachTemplate : (template, siteType) => {
    const ret = document.createElement('div');
    ret.classList.add('each_template');
    ret.appendChild(configUI.makeEachTemplateOpeMenu());
    ret.appendChild(configUI.makeEachTemplateBody(template, siteType));
    return ret;
  },

  makeEachTemplateOpeMenu : () => {
    let button, wkTxtNode;
    const ret = document.createElement('div');
    ret.classList.add('template_ope');

    wkTxtNode = document.createTextNode('freeze');
    button = document.createElement('button');
    button.classList.add('template_freeze');
    button.appendChild(wkTxtNode);
    ret.appendChild(button);

    wkTxtNode = document.createTextNode('up');
    button = document.createElement('button');
    button.classList.add('template_up');
    button.appendChild(wkTxtNode);
    ret.appendChild(button);

    wkTxtNode = document.createTextNode('down');
    button = document.createElement('button');
    button.classList.add('template_down');
    button.appendChild(wkTxtNode);
    ret.appendChild(button);

    wkTxtNode = document.createTextNode('add row');
    button = document.createElement('button');
    button.classList.add('template_add');
    button.appendChild(wkTxtNode);
    ret.appendChild(button);

    return ret;
  },

  makeEachTemplateBody : (template, siteType) => {
    const ret = document.createElement('div');
    ret.classList.add('template_body');
    const tableElm = document.createElement('table');
    tableElm.classList.add('template_rows');
    tableElm.appendChild(configUI.makeEachTemplateRows(template, siteType));
    ret.appendChild(tableElm);
    return ret;
  },

  makeEachTemplateRows : (template, siteType) => {
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
    labelElm.appendChild(inpElm);
    tdElm.appendChild(labelElm);
    trElm.appendChild(tdElm);

    docFragment.appendChild(trElm);

    // Header -------------------------------------------------------
    trElm = document.createElement('tr');

    thElm = document.createElement('th');
    wkTxtNode = document.createTextNode('delete');
    thElm.appendChild(wkTxtNode);
    trElm.appendChild(thElm);

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
    template.specArr.forEach((spec) => {
      trElm = document.createElement('tr');

      tdElm = document.createElement('td');
      inpElm = document.createElement('input');
      inpElm.type = 'checkbox';
      tdElm.appendChild(inpElm);
      trElm.appendChild(tdElm);
      // ------------------------------------------------------------
      let curSpecType = '';
      selectElm = document.createElement('select');
      configUI.specTypeList[siteType].forEach((elm) => {
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
        tdElm.appendChild(inpElm);
      }
      else if(curSpecType === 'plain') {
        selectElm = document.createElement('select');
        configUI.specItemMap[curSpecType].forEach((elm) => {
          optionElm = document.createElement('option');
          optionElm.value = elm;
          wkTxtNode = document.createTextNode(elm);
          optionElm.appendChild(wkTxtNode);
          if(elm === spec[curSpecType]) {
            optionElm.selected = true;
          }
          selectElm.appendChild(optionElm);
        });
        tdElm.appendChild(selectElm);
      }
      else if(curSpecType === 'twitter') {
        selectElm = document.createElement('select');
        let has3rdInput = false;
        configUI.specItemMap[curSpecType].forEach((elm) => {
          optionElm = document.createElement('option');
          optionElm.value = elm;
          wkTxtNode = document.createTextNode(elm);
          optionElm.appendChild(wkTxtNode);
          if(elm === spec[curSpecType]) {
            optionElm.selected = true;
            if(elm === 'qt_string') {
              has3rdInput = true;
              inpElm = document.createElement('input');
              inpElm.type = 'text';
              inpElm.value = spec['string'];
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
    console.log('lets reload');
    const siteListRoot = document.getElementById('site_list');
    while(siteListRoot.firstChild) {
      siteListRoot.removeChild(siteListRoot.firstChild);
    }
    console.log('go-----------------------');
    siteArr.forEach((site) => {
      const eachSiteRoot = document.createElement('div');
      eachSiteRoot.classList.add('each_site');
      eachSiteRoot.appendChild(configUI.makeSiteTop(site));
      eachSiteRoot.appendChild(configUI.makeSiteOpeMenu());
      const siteType = (site.urlHead && site.urlHead.startsWith('https://twitter.com')) ? 'twitter' : 'common';
      site.templates.forEach((template) => {
        eachSiteRoot.appendChild(configUI.makeEachTemplate(template, siteType));
      });
      siteListRoot.appendChild(eachSiteRoot);
    });
  },

  saveEntries : () => {
  },

};

document.addEventListener('DOMContentLoaded', configUI.restoreEntries);
configUI.restoreEntries();
document.querySelector('#save').addEventListener('click', configUI.saveEntries);

// vim:expandtab ff=dos fenc=utf-8 sw=2
