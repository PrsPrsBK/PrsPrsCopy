import test from 'ava';
import { tweetPicker } from '../testTgt/textPicker.js'
const fs = require('fs');

test.before(t => {
  const divElm = document.createElement('div');
  document.body.appendChild(divElm);
  // divElm.insertAdjacentHTML('afterbegin', fs.readFileSync('./test/helpers/tweetQt.html', 'utf8').replace(/^\s*(\S+)$/g, '$1').replace(/\r\n/g, ''));
  let text = fs.readFileSync('./test/helpers/tweetQt.html', 'utf8');
  // I can not understand nodejs's regex at all. 
  // text = text.replace(/^(\s+)(\S+.+)/g, '$2');
  text = text.replace(/  /g, '');
  text = text.replace(/\r\n/g, '');
  divElm.innerHTML = text;
  // const qtElm = divElm.firstElementChild;
  // document.body.appendChild(qtElm);

  const specArr = [
    { twitter: 'url' },
    { twitter: 'datetime' },
    { twitter: 'username' },
    { twitter: 'text_html' },
    { twitter: 'qt_string', string: 'just quoted', },
    { twitter: 'qt_url' },
    { twitter: 'qt_username' },
  ];
  t.context.resultArr = [
    '/EXAMPLE_ACC/status/ITEM_ID',
    '2019-02-27 13:46',
    'サンプルアカウントさん',
    'THIS IS TWEET-TEXTです <a href="https://twitter.com/QUOTED-TWEET-ACC/status/QUOTED-TWEET-ITEM-ID">URL</a>',
    'just quoted',
    '/QUOTED-TWEET-ACC/status/QUOTED-TWEET-ITEM-ID',
    'QUOTED-ACCさん',
  ];
  tweetPicker.getCurTweet();
  t.context.mainText = tweetPicker.CUR_MAIN_TEXT;
  t.context.qtText = tweetPicker.CUR_QT_TEXT;
  tweetPicker.build(specArr);
});

test('tweetPicker', t => {
	const tgtText = 'before URL. https://www.example.com … after URL.';
	const resultText = tweetPicker.activateHrefText(tgtText, {format: 'html'});
	t.is(resultText, 'before URL. <a href="https://www.example.com">URL</a> after URL.');
});

test('tweetPicker.CUR_MAIN_TEXT', t => {
	t.is(t.context.mainText, 'THIS IS TWEET-TEXTです');
});
test('tweetPicker.CUR_QT_TEXT', t => {
	t.is(t.context.qtText, '** THIS IS QUOTED TEXT ** です');
});

test('tweetPicker.RESULT_ARR', t => {
	t.deepEqual(tweetPicker.RESULT_ARR, t.context.resultArr);
});
