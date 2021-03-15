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
  let htmlText = fs.readFileSync('./test/helpers/twQuote.html', 'utf8');
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
    { twitter: 'qt_string', string: 'just quoted', },
    { twitter: 'qt_url' },
    { twitter: 'qt_datetime' },
    { twitter: 'qt_username' },
    { twitter: 'qt_text' },
    { twitter: 'qt_text_html' },
    { twitter: 'qt_text_reST' },
    { twitter: 'qt_text_md' },
  ];
  t.context.resultArr = [
    'https://twitter.com/foouser/status/1111333355557777999',
    '2021-01-27 23:49',
    '[]Foo`&`User<>',
    '[]Foo`&amp;`User&lt;&gt;',
    '[]Foo\\`&\\`User<>',
    '\\[\\]Foo`&`User<>',
    'TwQuoteの引用した側のテキスト [&amp;&gt;&lt;]です`` <a href="https://example.com">URL</a> テキストの続き',
    'TwQuoteの引用した側のテキスト [&><]です\\`\\` `URL <https://example.com>`__ テキストの続き',
    'TwQuoteの引用した側のテキスト \\[&><\\]です`` [URL](https://example.com) テキストの続き',
    'just quoted',
    '',
    '2021-03-01 23:50',
    '[]Quoted`&`User<>',
    'これは引用されたツイートのテキスト [&><]です``https://example.com/foopath/…スペースないので左にくっつく。引用されたテキストの続き',
    'これは引用されたツイートのテキスト [&amp;&gt;&lt;]です``<a href="https://example.com/foopath/">URL</a>スペースないので左にくっつく。引用されたテキストの続き',
    'これは引用されたツイートのテキスト [&><]です\\`\\``URL <https://example.com/foopath/>`__スペースないので左にくっつく。引用されたテキストの続き',
    'これは引用されたツイートのテキスト \\[&><\\]です``[URL](https://example.com/foopath/)スペースないので左にくっつく。引用されたテキストの続き',
  ];
  tweetPicker.getCurTweet();
  t.context.mainText = tweetPicker.CUR_MAIN_TEXT;
  t.context.qtText = tweetPicker.CUR_QT_TEXT;
  tweetPicker.build(specArr);
});

test('tweetPicker.CUR_MAIN_TEXT', t => {
  t.is(t.context.mainText, 'TwQuoteの引用した側のテキスト [&><]です`` https://example.com テキストの続き');
});

test('tweetPicker.RESULT_ARR', t => {
  t.deepEqual(tweetPicker.RESULT_ARR, t.context.resultArr);
});
