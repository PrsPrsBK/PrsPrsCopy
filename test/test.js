import test from 'ava';
import { tweetPicker } from '../testTgt/textPicker.js'

test('foo', t => {
	t.pass();
});

test('bar', async t => {
	const bar = Promise.resolve('bar');
	t.is(await bar, 'bar');
});

/* 
1 test failed

  tweetPicker

  D:\prsprscopy\test\test.js:16

   15:   const resultText = tweetPicker.activateHrefText(tgtText, {format: 'html'});
   16:   t.is(resultText, 'before URL. <a href="https://www.example.com">URL</a> after URL.');
   17: });

  Difference:

  - 'before URL. <a href="https://www.example.com">URL</a>after URL.'
  + 'before URL. <a href="https://www.example.com">URL</a> after URL.'

*/
test('tweetPicker', t => {
	const tgtText = 'before URL. https://www.example.com after URL.';
	const resultText = tweetPicker.activateHrefText(tgtText, {format: 'html'});
	t.is(resultText, 'before URL. <a href="https://www.example.com">URL</a> after URL.');
});
