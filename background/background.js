console.log('ppcopy');
if(typeof browser === 'undefined') {
  window.browser = window.chrome;
}
const defaultTargets = [
  '  <dt><a href="',
  '">',
  '</a></dt>\n',
];

browser.tabs.onUpdated.addListener((tabId, chgInfo, tab) => {
  console.log(`chgInfo ${JSON.stringify(chgInfo)}`);
  if(chgInfo.status === 'complete') {
    if(tab.url.startsWith('https://twitter.com')) {
      browser.tabs.executeScript(tabId, {
        file: '/content_scripts/tweetPicker.js',
      });
    }
  }
});

browser.commands.onCommand.addListener((cmd) => {
  if(cmd === 'PrsPrsCopy') {
  }
});

// vim:expandtab ff=dos fenc=utf-8 sw=2

