import browserEnv from 'browser-env';
browserEnv(['window', 'document']);
import browserFake from 'webextensions-api-fake';
global.browser = browserFake();
