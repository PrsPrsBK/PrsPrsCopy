import test from 'ava';
import { tweetPicker } from '../testTgt/textPicker.js'
const fs = require('fs');

const divElm = document.createElement('div');
divElm.insertAdjacentHTML('afterbegin', fs.readFileSync('./test/helpers/tweetQt.html', 'utf8'));
const qtElm = divElm.firstElementChild;

const specArr = [
  { twitter: 'url' },
  { twitter: 'datetime' },
  { twitter: 'username' },
  { twitter: 'text_html' },
  { twitter: 'qt_string', string: 'just quoted', },
  { twitter: 'qt_url' },
  { twitter: 'qt_username' },
];
const resultArr = [
  '/EXAMPLE_ACC/status/ITEM_ID',
  '2019-02-27 13:46',
  'サンプルアカウントさん',
  'THIS IS TWEET-TEXTです <a href="https://twitter.com/QUOTED-TWEET-ACC/status/QUOTED-TWEET-ITEM-ID">URL</a>',
  'just quoted',
  '/QUOTED-TWEET-ACC/status/QUOTED-TWEET-ITEM-ID',
  'QUOTED-ACCさん',
];
document.body.appendChild(qtElm);
tweetPicker.getCurTweet();
const mainText = tweetPicker.CUR_MAIN_TEXT;
const qtText = tweetPicker.CUR_QT_TEXT;
tweetPicker.build(specArr);


test('tweetPicker', t => {
	const tgtText = 'before URL. https://www.example.com … after URL.';
	const resultText = tweetPicker.activateHrefText(tgtText, {format: 'html'});
	t.is(resultText, 'before URL. <a href="https://www.example.com">URL</a> after URL.');
});

test('tweetPicker.CUR_MAIN_TEXT', t => {
	t.is(mainText, 'THIS IS TWEET-TEXTです');
});
test('tweetPicker.CUR_QT_TEXT', t => {
	t.is(qtText, '** THIS IS QUOTED TEXT ** です');
});

test('tweetPicker.RESULT_ARR', t => {
	t.deepEqual(tweetPicker.RESULT_ARR, resultArr);
});
