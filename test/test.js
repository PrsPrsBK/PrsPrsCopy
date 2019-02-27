import test from 'ava';
import { tweetPicker } from '../testTgt/textPicker.js'

test('tweetPicker', t => {
	const tgtText = 'before URL. https://www.example.com … after URL.';
	const resultText = tweetPicker.activateHrefText(tgtText, {format: 'html'});
	t.is(resultText, 'before URL. <a href="https://www.example.com">URL</a> after URL.');
});
