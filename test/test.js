import test from 'ava';
import { tweetPicker } from '../testTgt/textPicker.js'
const fs = require('fs');

test.before(t => {
  const divElm = document.createElement('div');
  document.body.appendChild(divElm);
  let text = fs.readFileSync('./test/helpers/tweetQt.html', 'utf8');
  text = text.replace(/\r\n\s+(.+)/g, '$1');
  text = text.replace(/\r\n/g, '');
  divElm.innerHTML = text;

  const specArr = [
    { twitter: 'url' },
    { twitter: 'datetime' },
    { twitter: 'username' },
    { twitter: 'username_esc' },
    { twitter: 'username_reST' },
    { twitter: 'username_md' },
    { twitter: 'text_html' },
    { twitter: 'text_reST' },
    { twitter: 'text_md' },
    { twitter: 'qt_string', string: 'just quoted', },
    { twitter: 'qt_url' },
    { twitter: 'qt_username' },
  ];
  t.context.resultArr = [
    '/EXAMPLE_ACC/status/ITEM_ID',
    '2019-02-27 13:46',
    '[]サンプル`&`アカウントさん<>',
    '[]サンプル`&amp;`アカウントさん&lt;&gt;',
    '[]サンプル\\`&\\`アカウントさん<>',
    '\\[\\]サンプル`&`アカウントさん<>',
    'THIS IS TWEET-TEXTです ',
    'THIS IS TWEET-TEXTです ',
    'THIS IS TWEET-TEXTです ',
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
	t.is(t.context.mainText, 'THIS IS TWEET-TEXTです ');
});
test('tweetPicker.CUR_QT_TEXT', t => {
	t.is(t.context.qtText, '** THIS IS QUOTED TEXT ** ですpic.twitter.com/XXXXXXXXXX');
});

test('tweetPicker.RESULT_ARR', t => {
	t.deepEqual(tweetPicker.RESULT_ARR, t.context.resultArr);
});
