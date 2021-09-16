
2021-09-10 金 data-testid属性

::

  ふつう
  article[data-testid="tweet"]属性が移動してきた
  >d >d >d
  -d(1)「xxがリツイート」等表示される左右に伸びる枠
  -d(2) data-testidなくなった
    -d(1)左列。アイコン
    -d(2)右列。
      -d(1)名前
      >d >d
        -d(1)左側の名前テキスト
          -d(1)名前テキスト
            -a href="/fooUser"
            >d
              -d(1)名前テキスト
                -d(1) dir="auto" 名前テキスト
                >span >span **テキスト本体**
                -d(2) dir="auto" 中身多分なし
              -d(2)@スクリーンID
          -d(2)名前テキストと時間の間の「·」
          -d(3)x時間(前)とか
        -d(2)右側の[...]メニュー
      -d(2)本文親
        -d 本文
          -d lang="ja" dir="auto" id="id__hf2wo7gsn8v"
          >span **本文テキスト**
        -d MOVとかOGPカード、なければ空
        -d いいねとか

::

  リプライ
  article
  >d >d >d
  >d(2)[data-testid]
  >d(2)右列。左はアイコン
    -d(1)名前
    -d(2)本文親
      -d >d[not lang]リプライ標示 **ここが違う**
      -d >d[lang] 本文
      -d MOVとかOGPカード、なければ空
      -d いいねとか

  QT
  article
  >d >d >d
  >d(2)[data-testid]
  >d(2)右列。左はアイコン
    -d(1)名前
    -d(2)本文親
      -d 本文
      -d QT
      -d いいねとか

  -d QT 詳細
  >d >d >d
  -d(1)[dir=auto]
  -d(2)[data-focusible=true tabindex=0 rol=link]
  > d QT親
    -d 名前
    -d 本文
    -d IMG

  ピックアップ
  article
  >d >d >d
  -d(1)
  -d(2) [data-testid] ここにアイコンと名前 **ここが違う**
  -d(3) いいねボタンまで全部 **ここが違う** [data-testid]の兄弟が2より大きい
    -d 本文親1
    -d 空
    -d 日付(数値ではなく文字列のみ)
    -d いいね数
    -d いいねボタン

  -d 本文親1
  >d 親2
  >d 本文[lang]

  -d アイコンと名前
    -d アイコン
    -d >d >d >d
      -d 名前
      -d ...(もっと見る)

  リプライがピックアップ
  >d いいねボタンまで全部
    -d リプライ標示 **ここが違う**
    -d 本文親1
    -d 空
    -d 日付
    -d ボタンと数 **ここが違う**
