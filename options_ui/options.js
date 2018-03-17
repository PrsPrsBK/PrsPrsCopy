const onError = (error) => {
  console.log(`Error: ${error}`);
};

const registAdd = (e) => {
};

const addEntry = (e) => {
  e.preventDefault();
  const date = new Date();
  const aElm = document.createElement('textarea');
  const wkVal = date.getMinutes() + ':' + date.getSeconds();
  console.log(wkVal);
  aElm.id = wkVal;
  aElm.value = wkVal;
  const targetElm = document.getElementById('under_edit');
  targetElm.appendChild(aElm);

  //const set_obj = {};
  //set_obj['seconds'] = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  //browser.storage.local.set(set_obj);
};

const registModify = (e) => {
};

const restoreEntries = (e) => {

  const showContents = (result) => {
  };

  //const getting = browser.storage.local.get(some_key);
  //getting.then(showContents, onError);
};

document.addEventListener('DOMContentLoaded', restoreEntries);
//document.querySelector('form').addEventListener('submit', someFunc);
document.querySelector('#add_template').addEventListener('click', addEntry);
document.querySelector('#regist_add').addEventListener('click', registAdd);
//document.querySelector('#regist_modify').addEventListener('click', registModify);
// vim:expandtab ff=dos fenc=utf-8 sw=2

