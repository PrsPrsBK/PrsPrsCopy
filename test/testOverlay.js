import test from 'ava';
// can not use jsdom.reconfigure(). this works.
import browserEnv from 'browser-env';
browserEnv({
  url: 'https://twitter.com/ZENMEN_ACC/status/ZENMEN-TWEET-IDXXXX',
});
import { tweetPicker } from '../testTgt/textPicker.js';
const fs = require('fs');

test.before(t => {
  const divElm = document.createElement('div');
  document.body.appendChild(divElm);
  let htmlText = fs.readFileSync('./test/helpers/tweetOverlay.html', 'utf8');
  htmlText = htmlText.replace(/\r\n\s+(.+)/g, '$1');
  htmlText = htmlText.replace(/\r\n/g, '');
  divElm.innerHTML = htmlText;

  const specArr = [
    { twitter: 'url' },
    { twitter: 'datetime' },
    { twitter: 'username' },
    { twitter: 'text_html' },
  ];
  t.context.resultArr = [
    'https://twitter.com/ZENMEN_ACC/status/ZENMEN-TWEET-IDXXXX',
    '2019-03-06 22:30',
    'ZENMEN_ACCさん',
    'これは前面に表示されるツイートです',
  ];
  tweetPicker.getCurTweet();
  tweetPicker.build(specArr);
});

test('Overlay tweetPicker.RESULT_ARR', t => {
  t.deepEqual(tweetPicker.RESULT_ARR, t.context.resultArr);
});
