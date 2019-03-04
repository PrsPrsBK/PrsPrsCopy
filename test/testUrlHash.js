import test from 'ava';
// can not use jsdom.reconfigure(). this works.
import browserEnv from 'browser-env';
import { textPicker } from '../testTgt/textPicker.js';

test.serial('NO Hash', t => {
  browserEnv({
    url: 'http://www.example.com/foo/zero.html?query=foo&next=bar',
  });
  const specArr = [
    { plain: 'url_nohs'},
  ];
  const resultArr = [
    'http://www.example.com/foo/zero.html',
  ];
  textPicker.build(specArr);
  t.deepEqual(textPicker.RESULT_ARR, resultArr);
});

test.serial('1 Hash follwed by slashed part', t => {
  browserEnv({
    url: 'http://www.example.com/foo/#!/one.html?query=foo&next=bar',
  });
  const specArr = [
    { plain: 'url_nohs'},
  ];
  const resultArr = [
    'http://www.example.com/foo/#!/one.html',
  ];
  textPicker.build(specArr);
  t.deepEqual(textPicker.RESULT_ARR, resultArr);
});

test.serial('1 Hash NOT follwed by slashed part', t => {
  browserEnv({
    url: 'http://www.example.com/foo/one.html#point?query=foo&next=bar',
  });
  const specArr = [
    { plain: 'url_nohs'},
  ];
  const resultArr = [
    'http://www.example.com/foo/one.html',
  ];
  textPicker.build(specArr);
  t.deepEqual(textPicker.RESULT_ARR, resultArr);
});

test.serial('2 Hashs', t => {
  browserEnv({
    url: 'http://www.example.com/foo/#!/two.html#point?query=foo&next=bar',
  });
  const specArr = [
    { plain: 'url_nohs'},
  ];
  const resultArr = [
    'http://www.example.com/foo/#!/two.html',
  ];
  textPicker.build(specArr);
  t.deepEqual(textPicker.RESULT_ARR, resultArr);
});

test.serial('3 Hashs', t => {
  browserEnv({
    url: 'http://www.example.com/foo/#!/#?/three.html#point?query=foo&next=bar',
  });
  const specArr = [
    { plain: 'url_nohs'},
  ];
  const resultArr = [
    'http://www.example.com/foo/#!/#?/three.html',
  ];
  textPicker.build(specArr);
  t.deepEqual(textPicker.RESULT_ARR, resultArr);
});
