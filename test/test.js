import test from 'ava';
import { tweetPicker } from '../testTgt/textPicker.js'

const qtElm = document.createElement('div');
qtElm.innerHTML = `
<li class="js-stream-item stream-item stream-item selected-stream-item">
  <div class="tweet js-stream-tweet tweet-has-context">
    <div class="context">
      <div class="tweet-context with-icn">
        <span class="Icon Icon--small Icon--retweeted"></span>
        <span class="js-retweet-text">
          <a class="pretty-link js-user-profile-link" href="/EXAMPLE_ACC" data-user-id="EXAMPLE_ACC_NUM" rel="noopener"><b>EXAMPLE ONE</b></a>さんがリツイート
        </span>
      </div>
    </div>
    <div class="content">
      <div class="stream-item-header">
        <a class="account-group js-account-group js-action-profile js-user-profile-link js-nav" href="/EXAMPLE_ACC" data-user-id="EXAMPLE_ACC_NUM">
          <img class="avatar js-action-profile-avatar" src="https://pbs.twimg.com/profile_images/XXXXXXXXXXXXXXXXXX/XXXXXXXX_bigger.png" alt="">
          <span class="FullNameGroup">
            <strong class="fullname show-popup-with-id u-textTruncate ">サンプルアカウントさん</strong>
            <span>‏</span><span class="UserBadges"></span><span class="UserNameBreak">&nbsp;</span>
          </span>
          <span class="username u-dir u-textTruncate" dir="ltr">@<b>EXAMPLE_ACC</b></span>
        </a>
        <small class="time">
          <a href="/EXAMPLE_ACC/status/ITEM_ID" class="tweet-timestamp js-permalink" data-conversation-id="ITEM_ID" data-original-title="13:46 - 2019年2月27日">
            <span class="_timestamp js-short-timestamp js-relative-timestamp" data-time="1551242807" data-time-ms="1551242807000" data-long-form="true" aria-hidden="true">11時間</span>
            <span class="u-hiddenVisually" data-aria-label-part="last" id="uuid-5">11時間前</span>
          </a>
        </small>
        <div class="ProfileTweet-action ProfileTweet-action--more js-more-ProfileTweet-actions">
        </div>
      </div>
    </div>
    <div class="js-tweet-text-container">
      <p class="TweetTextSize  js-tweet-text tweet-text" lang="ja">
        THIS IS TWEET-TEXTです <a href="https://t.co/XXXXXXXXXX" rel="nofollow noopener" dir="ltr" data-expanded-url="https://twitter.com/QUOTED-TWEET-ACC/status/QUOTED-TWEET-ITEM-ID" class="twitter-timeline-link u-hidden" target="_blank"
        title="https://twitter.com/QUOTED-TWEET-ACC/status/QUOTED-TWEET-ITEM-ID">
        <span class="tco-ellipsis"></span>
        <span class="invisible">https://</span>
        <span class="js-display-url">twitter.com/QUOTED-TWEET-ACC/s</span>
        <span class="invisible">tatus/QUOTED-TWEET-ITEM-ID</span>
        <span class="tco-ellipsis"><span class="invisible">&nbsp;</span>…</span>
        </a>
      </p>
    </div>
    <div class="QuoteTweet">
      <div class="QuoteTweet-container">
        <a class="QuoteTweet-link js-nav" href="/QUOTED-TWEET-ACC/status/QUOTED-TWEET-ITEM-ID" data-conversation-id="QUOTED-TWEET-ITEM-ID" aria-hidden="true"></a>
        <div class="QuoteTweet-innerContainer data-item-id="QUOTED-TWEET-ITEM-ID" data-item-type="tweet" data-screen-name="QUOTED-TWEET-ACC" data-user-id="QUOTED-TWEET-ACC-NUM"
        href="/QUOTED-TWEET-ACC/status/QUOTED-TWEET-ITEM-ID" data-conversation-id="QUOTED-TWEET-ITEM-ID" tabindex="0">
          <div class="tweet-content">
            <div class="QuoteMedia">
              <div class="QuoteMedia-container js-quote-media-container">
                <div class="QuoteMedia-singlePhoto">
                  <div class="QuoteMedia-photoContainer js-quote-photo" data-image-url="https://pbs.twimg.com/media/XXXXXXXXXXXXXXX.jpg" data-element-context="platform_photo_card" style="background-color:rgba(64,64,64,1.0);" data-dominant-color="[64,64,64]">
                    <img src="https://pbs.twimg.com/media/XXXXXXXXXXXXXXX.jpg" alt="" style="width: 100%; top: -0px;" data-aria-label-part="">
                  </div>
                </div>
              </div>
            </div>
            <div class="QuoteTweet-authorAndText u-alignTop">
              <div class="QuoteTweet-originalAuthor u-cf u-textTruncate stream-item-header account-group js-user-profile-link">
                <b class="QuoteTweet-fullname u-linkComplex-target">QUOTED-ACCさん</b><span class="UserBadges"></span><span class="UserNameBreak">&nbsp;</span><span class="username u-dir u-textTruncate" dir="ltr">@<b>QUOTED-TWEET-ACC</b></span>
              </div>
            <div class="QuoteTweet-text tweet-text u-dir" lang="ja" data-aria-label-part="2" dir="ltr" id="uuid-2">** THIS IS QUOTED TEXT ** です
              <span class="twitter-timeline-link u-hidden" data-pre-embedded="true" dir="ltr">pic.twitter.com/XXXXXXXXXX</span>
            </div>
          </div>
        </div>
      </div>
    </div><!-- QuoteTweet -->
  </div><!-- tweet -->
  <div class="stream-item-footer">
    <div class="ProfileTweet-actionCountList u-hiddenVisually">
      <span class="ProfileTweet-action--reply u-hiddenVisually">
        <span class="ProfileTweet-actionCount" data-tweet-stat-count="1">
          <span class="ProfileTweet-actionCountForAria" id="profile-tweet-action-reply-count-aria-ITEM_ID" data-aria-label-part="">1件の返信</span>
        </span>
      </span>
      <span class="ProfileTweet-action--retweet u-hiddenVisually">
        <span class="ProfileTweet-actionCount" data-tweet-stat-count="8">
          <span class="ProfileTweet-actionCountForAria" id="profile-tweet-action-retweet-count-aria-ITEM_ID" data-aria-label-part="">8件のリツイート</span>
        </span>
      </span>
      <span class="ProfileTweet-action--favorite u-hiddenVisually">
        <span class="ProfileTweet-actionCount" data-tweet-stat-count="9">
          <span class="ProfileTweet-actionCountForAria" id="profile-tweet-action-favorite-count-aria-ITEM_ID" data-aria-label-part="">9 いいね</span>
        </span>
      </span>
    </div>
    <div class="ProfileTweet-actionList js-actions" role="group" aria-label="ツイートアクション">
      返信 リツイート いいね DM
    </div>
  </div>
</li>`;

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
