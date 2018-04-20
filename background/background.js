console.log('ppcopy');
if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}

browser.tabs.onUpdated.addListener((tabId, chgInfo, tab) => {
  console.log(`ppcopy ${tab.url}`);
  if(tab.url.startsWith('https://twitter.com')) {
    browser.tabs.executeScript(tabId, {
      file: '/content_scripts/TextPicker.js',
    });
  }
});

console.log('ppcopy');
// vim:expandtab ff=dos fenc=utf-8 sw=2

