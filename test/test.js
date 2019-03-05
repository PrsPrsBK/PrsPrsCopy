import test from 'ava';
// can not use jsdom.reconfigure(). this works.
import browserEnv from 'browser-env';
browserEnv({
  url: 'https://twitter.com/',
});
import { tweetPicker } from '../testTgt/textPicker.js';
const fs = require('fs');

test.before(t => {
  const divElm = document.createElement('div');
  document.body.appendChild(divElm);
  let htmlText = fs.readFileSync('./test/helpers/tweetQt.html', 'utf8');
  htmlText = htmlText.replace(/\r\n\s+(.+)/g, '$1');
  htmlText = htmlText.replace(/\r\n/g, '');
  divElm.innerHTML = htmlText;

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
    { twitter: 'qt_text' },
    { twitter: 'qt_text_html' },
    { twitter: 'qt_text_reST' },
    { twitter: 'qt_text_md' },
  ];
  t.context.resultArr = [
    'https://twitter.com/EXAMPLE_ACC/status/ITEM_ID',
    '2019-02-27 13:46',
    '[]サンプル`&`アカウントさん<>',
    '[]サンプル`&amp;`アカウントさん&lt;&gt;',
    '[]サンプル\\`&\\`アカウントさん<>',
    '\\[\\]サンプル`&`アカウントさん<>',
    'THIS IS TWEET-TEXT [&amp;&gt;&lt;]です`` ',
    'THIS IS TWEET-TEXT [&><]です\\`\\` ',
    'THIS IS TWEET-TEXT \\[&><\\]です`` ',
    'just quoted',
    'https://twitter.com/QUOTED-TWEET-ACC/status/QUOTED-TWEET-ITEM-ID',
    'QUOTED-ACCさん',
    '** THIS IS QUOTED TEXT ** ``<&][>ですpic.twitter.com/XXXXXXXXXXhttps://www.example.com/qtlink.html\u00A0…',
    '** THIS IS QUOTED TEXT ** ``&lt;&amp;][&gt;ですpic.twitter.com/XXXXXXXXXX<a href="https://www.example.com/qtlink.html">URL</a>',
    '** THIS IS QUOTED TEXT ** \\`\\`<&][>ですpic.twitter.com/XXXXXXXXXX`URL <https://www.example.com/qtlink.html>`__',
    '** THIS IS QUOTED TEXT ** ``<&\\]\\[>ですpic.twitter.com/XXXXXXXXXX[URL](https://www.example.com/qtlink.html)',
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
  t.is(t.context.mainText, 'THIS IS TWEET-TEXT [&><]です`` ');
});

test('tweetPicker.RESULT_ARR', t => {
  t.deepEqual(tweetPicker.RESULT_ARR, t.context.resultArr);
});
