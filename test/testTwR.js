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
  let htmlText = fs.readFileSync('./test/helpers/twR.html', 'utf8');
  htmlText = htmlText.replace(/\r\n\s+(.+)/g, '$1').replace(/\r\n/g, '');
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
  ];
  t.context.resultArr = [
    'https://twitter.com/foouser/status/1111222233334444555',
    '2021-01-27 23:50',
    '[]Foo`&`User<>',
    '[]Foo`&amp;`User&lt;&gt;',
    '[]Foo\\`&\\`User<>',
    '\\[\\]Foo`&`User<>',
    'TwRのテキスト [&amp;&gt;&lt;]です``',
    'TwRのテキスト [&><]です\\`\\`',
    'TwRのテキスト \\[&><\\]です``',
  ];
  tweetPicker.getCurTweet();
  t.context.mainText = tweetPicker.CUR_MAIN_TEXT;
  t.context.qtText = tweetPicker.CUR_QT_TEXT;
  tweetPicker.build(specArr);
});

test('tweetPicker.CUR_MAIN_TEXT', t => {
  t.is(t.context.mainText, 'TwRのテキスト [&><]です``');
});

test('tweetPicker.RESULT_ARR', t => {
  t.deepEqual(tweetPicker.RESULT_ARR, t.context.resultArr);
});
