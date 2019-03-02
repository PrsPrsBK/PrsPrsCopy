import test from 'ava';
import { textPicker } from '../testTgt/textPicker.js'
const fs = require('fs');
// import { fs } from 'fs';

test.before(t => {
  //Error: Not implemented: navigation (except hash changes)
  // window.location.href = 'http://www.example.com/';
  // window.location.assign('http://www.example.com/');
  //message: 'Cannot set property URL of #<Document> which has only a getter',
  // document.URL = 'http://www.example.com/';
  let text = fs.readFileSync('./test/helpers/foo.html', 'utf8');
  document.body.innerHTML = text;

  const specArr = [
    { string: 'just string' },
    { plain: 'url'},
    { plain: 'title'},
  ];
  t.context.resultArr = [
    'just string',
    'http://www.example.com/',
    'foo title',
  ];
  textPicker.build(specArr);
});

test('tweetPicker.RESULT_ARR', t => {
	t.deepEqual(textPicker.RESULT_ARR, t.context.resultArr);
});
