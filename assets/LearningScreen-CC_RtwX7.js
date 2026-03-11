import{c as N,k as _,u as kn,a as j,o as y,b as l,d as D,n as T,t as g,F as G,r as Z,i as q,e as c,f as Un,_ as yt,p as ze,v as In,m as jt,C as xt,g as fn,z as zt,E as wt,j as vt}from"./index-CNkZ-EfI.js";import{a as bt,u as kt}from"./useUserProgress-C6mb0ZwM.js";import{u as It}from"./useNavState-C_h-pn3o.js";const we="chatmate_learningProgress",ne={chapters:{},stats:{totalQuizzesPassed:0,totalConversationsCompleted:0}};function _t(){try{const n=localStorage.getItem(we);return n?JSON.parse(n):{...ne}}catch(n){return console.error("Failed to load learning progress:",n),{...ne}}}function St(n){try{localStorage.setItem(we,JSON.stringify(n))}catch(e){console.error("Failed to save learning progress:",e)}}const V=_(_t());function ee(n){return V.value.chapters[n]||(V.value.chapters[n]={quizCompleted:!1,quizScore:0,quizBestScore:0,conversationCompleted:!1}),V.value.chapters[n]}function Rn(){St(V.value)}function Gn(){function n(d,p,m){const u=ee(d),f=Math.round(p/m*100);return f>u.quizBestScore&&(u.quizBestScore=f),u.quizScore=f,f>=60&&!u.quizCompleted&&(u.quizCompleted=!0,V.value.stats.totalQuizzesPassed++),Rn(),{percentage:f,passed:f>=60}}function e(d){return V.value.chapters[d]?.quizCompleted||!1}function t(d){return V.value.chapters[d]?.quizBestScore||0}function a(d){const p=ee(d);p.conversationCompleted||(p.conversationCompleted=!0,V.value.stats.totalConversationsCompleted++,Rn())}function r(d){return V.value.chapters[d]?.conversationCompleted||!1}function i(d){const p=V.value.chapters[d];return p?p.quizCompleted&&p.conversationCompleted:!1}function o(d){const p=V.value.chapters[d];return p?{quiz:p.quizCompleted,conversation:p.conversationCompleted,complete:p.quizCompleted&&p.conversationCompleted,quizBestScore:p.quizBestScore||0}:{quiz:!1,conversation:!1,complete:!1,quizBestScore:0}}const s=N(()=>V.value.stats);function h(){V.value={chapters:{},stats:{totalQuizzesPassed:0,totalConversationsCompleted:0}},Rn()}return{markQuizCompleted:n,isQuizCompleted:e,getQuizBestScore:t,markConversationCompleted:a,isConversationCompleted:r,isChapterCompleted:i,getChapterCompletionStatus:o,stats:s,resetProgress:h}}const ve="chatmate_srsProgress",J=_(At());function At(){try{const n=localStorage.getItem(ve);return n?JSON.parse(n):{words:{}}}catch{return{words:{}}}}function te(){try{localStorage.setItem(ve,JSON.stringify(J.value))}catch(n){console.error("Failed to save SRS data:",n)}}function yn(){return new Date().toISOString().split("T")[0]}function re(n,e){const t=new Date(n),a=new Date(e);return Math.round((a-t)/(1e3*60*60*24))}function Tt(n,e){let{interval:t,easeFactor:a,repetitions:r}=n;e>=3?(r===0?t=1:r===1?t=6:t=Math.round(t*a),r++):(r=0,t=1),a=Math.max(1.3,a+(.1-(5-e)*(.08+(5-e)*.02)));const i=new Date;return i.setDate(i.getDate()+t),{interval:t,easeFactor:Math.round(a*100)/100,repetitions:r,nextReview:i.toISOString().split("T")[0]}}function be(){function n(d,p,m){const u=J.value.words[d]||{interval:0,easeFactor:2.5,repetitions:0,nextReview:yn(),correctCount:0,incorrectCount:0},f=m!==void 0?m:p?4:1,x=Tt({interval:u.interval,easeFactor:u.easeFactor,repetitions:u.repetitions},f);J.value.words[d]={...x,correctCount:u.correctCount+(p?1:0),incorrectCount:u.incorrectCount+(p?0:1),lastReviewed:yn()},te()}function e(d){for(const p of d)n(p.word.id,p.isCorrect)}function t(d){const p=yn();return d.filter(m=>{const u=J.value.words[m.id];return u?u.nextReview<=p:!1}).sort((m,u)=>{const f=J.value.words[m.id],x=J.value.words[u.id];return re(f.nextReview,p)-re(x.nextReview,p)}).reverse()}function a(d){const p=yn();return d.filter(m=>{const u=J.value.words[m.id];return u?u.nextReview<=p:!1}).length}function r(d){return J.value.words[d]||null}function i(d){const p=J.value.words[d];if(!p)return 0;const m=p.correctCount+p.incorrectCount;if(m===0)return 0;const u=p.correctCount/m,f=Math.min(p.repetitions/5,1);return Math.round(u*50+f*50)}const o=N(()=>Object.keys(J.value.words).length),s=N(()=>{const d=yn();return Object.values(J.value.words).filter(p=>p.nextReview<=d).length});function h(){J.value={words:{}},te()}return{recordReview:n,recordQuizResults:e,getDueWords:t,getDueCount:a,getWordSRS:r,getWordMastery:i,totalTrackedWords:o,totalDueToday:s,resetSRS:h}}const Ct=`# Chapter: Week 7 - City & Transportation
meta:
  id: city-and-transportation
  title:
    en: "City & Transportation"
    ja: "街と交通"
    zh: "城市與交通"
  description:
    en: "Getting around town and asking for directions."
    ja: "街を歩いて道を尋ねましょう。"
    zh: "學習在城市中移動和問路。"
  icon: "🚌"
  order: 7
  level: beginner

words:
  # Day 1: Core Nouns (City Objects)
  - id: city
    word:
      en: City
      ja: 都市
      zh: 城市
    reading: "SIT-ee"
    phonetic: "/ˈsɪti/"
    description:
      en: "Large town with many buildings."
      ja: "多くの建物がある大きな町。"
      zh: "有很多建築物的大城鎮。"
    sentence:
      en: "I am new in this city."
      ja: "この街に来たばかりです。"
      zh: "我剛來這座城市。"

  - id: street
    word:
      en: Street
      ja: 通り
      zh: 街道
    reading: "STREET"
    phonetic: "/striːt/"
    description:
      en: "Where cars drive."
      ja: "車が走る場所。"
      zh: "車子行駛的地方。"
    sentence:
      en: "I walk down the street."
      ja: "通りを歩きます。"
      zh: "我沿著街道走。"

  - id: station
    word:
      en: Station
      ja: 駅
      zh: 車站
    reading: "STAY-shun"
    phonetic: "/ˈsteɪʃən/"
    description:
      en: "Train or bus stop building."
      ja: "電車やバスの停留所の建物。"
      zh: "火車或公車站的建築物。"
    sentence:
      en: "The station is near the bank."
      ja: "駅は銀行の近くにあります。"
      zh: "車站在銀行附近。"

  - id: ticket
    word:
      en: Ticket
      ja: 切符
      zh: 車票
    reading: "TIK-it"
    phonetic: "/ˈtɪkɪt/"
    description:
      en: "Paper to pay for ride."
      ja: "乗車料金を支払うための紙。"
      zh: "付錢搭乘的紙張。"
    sentence:
      en: "I need to buy a ticket for the train."
      ja: "電車の切符を買う必要があります。"
      zh: "我需要買火車票。"

  - id: traffic-light
    word:
      en: Traffic Light
      ja: 信号機
      zh: 紅綠燈
    reading: "TRAF-ik lyt"
    phonetic: "/ˈtræfɪk laɪt/"
    description:
      en: "Red, Yellow, Green signal."
      ja: "赤、黄、緑の信号。"
      zh: "紅、黃、綠的號誌。"
    sentence:
      en: "We wait for the green traffic light."
      ja: "緑の信号を待ちます。"
      zh: "我們等綠燈。"

  - id: map
    word:
      en: Map
      ja: 地図
      zh: 地圖
    reading: "MAP"
    phonetic: "/mæp/"
    description:
      en: "Drawing of the area."
      ja: "地域の図。"
      zh: "區域的圖畫。"
    sentence:
      en: "I have a map on my phone."
      ja: "スマホに地図があります。"
      zh: "我手機上有地圖。"

  - id: corner
    word:
      en: Corner
      ja: 角
      zh: 轉角
    reading: "KOR-ner"
    phonetic: "/ˈkɔːrnər/"
    description:
      en: "Where two streets meet."
      ja: "二つの通りが交わる場所。"
      zh: "兩條街道交會的地方。"
    sentence:
      en: "Please turn left at the corner."
      ja: "角を左に曲がってください。"
      zh: "請在轉角左轉。"

  # Day 2: Core Verbs (Movement)
  - id: drive
    word:
      en: Drive
      ja: 運転する
      zh: 開車
    reading: "DRYV"
    phonetic: "/draɪv/"
    description:
      en: "Control a car."
      ja: "車を運転する。"
      zh: "駕駛汽車。"
    sentence:
      en: "Drive carefully on this road."
      ja: "この道は注意して運転してください。"
      zh: "在這條路上小心開車。"

  - id: ride
    word:
      en: Ride
      ja: 乗る
      zh: 搭乘
    reading: "RYD"
    phonetic: "/raɪd/"
    description:
      en: "Travel on a bike/bus/train."
      ja: "自転車/バス/電車に乗る。"
      zh: "搭乘腳踏車/公車/火車。"
    sentence:
      en: "I ride for ten minutes."
      ja: "10分間乗ります。"
      zh: "我搭乘十分鐘。"

  - id: walk
    word:
      en: Walk
      ja: 歩く
      zh: 走路
    reading: "WAWK"
    phonetic: "/wɔːk/"
    description:
      en: "Go on foot."
      ja: "歩いて行く。"
      zh: "步行。"
    sentence:
      en: "It is a 5-minute walk."
      ja: "歩いて5分です。"
      zh: "走路5分鐘。"

  - id: turn
    word:
      en: Turn
      ja: 曲がる
      zh: 轉彎
    reading: "TURN"
    phonetic: "/tɜːrn/"
    description:
      en: "Change direction - Left/Right."
      ja: "方向を変える - 左/右。"
      zh: "改變方向 - 左/右。"
    sentence:
      en: "Turn right at the traffic light."
      ja: "信号を右に曲がってください。"
      zh: "在紅綠燈右轉。"

  - id: stop
    word:
      en: Stop
      ja: 止まる
      zh: 停止
    reading: "STOP"
    phonetic: "/stɑːp/"
    description:
      en: "Do not move."
      ja: "動かない。"
      zh: "不要移動。"
    sentence:
      en: "Get off at the next stop."
      ja: "次の停留所で降りてください。"
      zh: "在下一站下車。"

  - id: cross
    word:
      en: Cross
      ja: 渡る
      zh: 穿越
    reading: "KROSS"
    phonetic: "/krɔːs/"
    description:
      en: "Go to the other side of the street."
      ja: "通りの反対側に行く。"
      zh: "走到街道的另一邊。"
    sentence:
      en: "Let's cross the street here."
      ja: "ここで通りを渡りましょう。"
      zh: "我們在這裡過馬路吧。"

  - id: get-off
    word:
      en: Get off
      ja: 降りる
      zh: 下車
    reading: "GET off"
    phonetic: "/ɡet ɔːf/"
    description:
      en: "Leave a bus/train."
      ja: "バス/電車から降りる。"
      zh: "離開公車/火車。"
    sentence:
      en: "I get off at the big corner."
      ja: "大きな角で降ります。"
      zh: "我在大轉角下車。"

chat:
  conversations:
    - id: scenario-1-new-in-city
      title:
        en: "New in the City"
        ja: "街に来たばかり"
        zh: "初來城市"
      messages:
        - role: partner
          text:
            en: "How do you get around in this city?"
            ja: "この街ではどうやって移動しますか？"
            zh: "你在這座城市怎麼移動？"
        - role: user
          text:
            en: "I am new in this city. I have a map on my phone."
            ja: "この街に来たばかりです。スマホに地図があります。"
            zh: "我剛來這座城市。我手機上有地圖。"
        - role: partner
          text:
            en: "Where do you want to go?"
            ja: "どこに行きたいですか？"
            zh: "你想去哪裡？"
        - role: user
          text:
            en: "I want to go to the museum."
            ja: "博物館に行きたいです。"
            zh: "我想去博物館。"
        - role: partner
          text:
            en: "How will you get there?"
            ja: "どうやって行きますか？"
            zh: "你怎麼去那裡？"
        - role: user
          text:
            en: "I walk to the bus stop and wait. When the bus comes, I pay for a ticket."
            ja: "バス停まで歩いて待ちます。バスが来たら、切符を買います。"
            zh: "我走到公車站等待。公車來了，我買票。"
        - role: partner
          text:
            en: "How long is the ride?"
            ja: "どのくらい乗りますか？"
            zh: "要搭多久？"
        - role: user
          text:
            en: "I ride for ten minutes. I get off at the big corner."
            ja: "10分間乗ります。大きな角で降ります。"
            zh: "我搭十分鐘。我在大轉角下車。"
        - role: partner
          text:
            en: "And then?"
            ja: "それから？"
            zh: "然後呢？"
        - role: user
          text:
            en: "I cross the street and I see the building."
            ja: "通りを渡ると、建物が見えます。"
            zh: "我過馬路，就看到那棟建築物。"

    - id: scenario-2-asking-directions
      title:
        en: "Asking for Directions"
        ja: "道を尋ねる"
        zh: "問路"
      messages:
        - role: partner
          text:
            en: "Excuse me. I am lost."
            ja: "すみません。道に迷いました。"
            zh: "不好意思。我迷路了。"
        - role: user
          text:
            en: "Where do you want to go?"
            ja: "どこに行きたいですか？"
            zh: "你想去哪裡？"
        - role: partner
          text:
            en: "I am looking for the Central Station."
            ja: "中央駅を探しています。"
            zh: "我在找中央車站。"
        - role: user
          text:
            en: "It is very close. Go straight on this street."
            ja: "とても近いですよ。この通りをまっすぐ行ってください。"
            zh: "很近。沿著這條街直走。"
        - role: partner
          text:
            en: "Do I turn anywhere?"
            ja: "どこかで曲がりますか？"
            zh: "我需要轉彎嗎？"
        - role: user
          text:
            en: "Yes, turn right at the traffic light. You will see it."
            ja: "はい、信号を右に曲がってください。見えますよ。"
            zh: "是的，在紅綠燈右轉。你就會看到了。"
        - role: partner
          text:
            en: "Is it far?"
            ja: "遠いですか？"
            zh: "遠嗎？"
        - role: user
          text:
            en: "No, it is a 5-minute walk."
            ja: "いいえ、歩いて5分です。"
            zh: "不遠，走路5分鐘。"

    - id: scenario-3-questions-answers
      title:
        en: "Direction Questions"
        ja: "道案内の質問"
        zh: "方向問答"
      messages:
        - role: partner
          text:
            en: "Where is the station?"
            ja: "駅はどこですか？"
            zh: "車站在哪裡？"
        - role: user
          text:
            en: "Go straight and turn right."
            ja: "まっすぐ行って右に曲がってください。"
            zh: "直走然後右轉。"
        - role: partner
          text:
            en: "How do I get to the park?"
            ja: "公園にはどうやって行きますか？"
            zh: "我怎麼去公園？"
        - role: user
          text:
            en: "You can take the number 5 bus."
            ja: "5番のバスに乗れます。"
            zh: "你可以搭5號公車。"
        - role: partner
          text:
            en: "Where do I get off?"
            ja: "どこで降りますか？"
            zh: "我在哪裡下車？"
        - role: user
          text:
            en: "Get off at the next stop."
            ja: "次の停留所で降りてください。"
            zh: "在下一站下車。"
        - role: partner
          text:
            en: "Should I take the bus or the train?"
            ja: "バスと電車、どちらに乗ればいいですか？"
            zh: "我該搭公車還是火車？"
        - role: user
          text:
            en: "Take the subway. It is faster."
            ja: "地下鉄に乗ってください。そっちの方が速いです。"
            zh: "搭地鐵。比較快。"
        - role: partner
          text:
            en: "Thank you! Go straight, right?"
            ja: "ありがとうございます！まっすぐですね？"
            zh: "謝謝！直走對嗎？"
        - role: user
          text:
            en: "Yes, go straight, then go left at the corner."
            ja: "はい、まっすぐ行って、角を左に曲がってください。"
            zh: "是的，直走，然後在轉角左轉。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,Et=`# Chapter: Week 5 - Clothes & Shopping
meta:
  id: clothes-and-shopping
  title:
    en: "Clothes & Shopping"
    ja: "服とショッピング"
    zh: "服裝與購物"
  description:
    en: "Describing what you wear and buying new things."
    ja: "着ているものを説明し、新しいものを買いましょう。"
    zh: "學習描述你穿什麼以及購買新東西。"
  icon: "👕"
  order: 5
  level: beginner

words:
  # Day 1: Core Nouns (Clothing & Money)
  - id: shirt
    word:
      en: Shirt
      ja: シャツ
      zh: 襯衫
    reading: "SHURT"
    phonetic: "/ʃɜːrt/"
    description:
      en: "Top clothing."
      ja: "上半身の服。"
      zh: "上衣。"
    sentence:
      en: "I wear a blue shirt to work."
      ja: "私は仕事に青いシャツを着ていきます。"
      zh: "我穿藍色襯衫去上班。"

  - id: pants
    word:
      en: Pants
      ja: ズボン
      zh: 褲子
    reading: "PANTS"
    phonetic: "/pænts/"
    description:
      en: "Leg clothing."
      ja: "脚を覆う服。"
      zh: "腿部的衣服。"
    sentence:
      en: "Can I try on these pants?"
      ja: "このズボンを試着してもいいですか？"
      zh: "我可以試穿這條褲子嗎？"

  - id: shoes
    word:
      en: Shoes
      ja: 靴
      zh: 鞋子
    reading: "SHOOZ"
    phonetic: "/ʃuːz/"
    description:
      en: "Footwear."
      ja: "足に履くもの。"
      zh: "穿在腳上的。"
    sentence:
      en: "I need new shoes."
      ja: "新しい靴が必要です。"
      zh: "我需要新鞋子。"

  - id: jacket
    word:
      en: Jacket
      ja: ジャケット
      zh: 夾克
    reading: "JAK-it"
    phonetic: "/ˈdʒækɪt/"
    description:
      en: "Outerwear for cold."
      ja: "寒い時の上着。"
      zh: "寒冷時穿的外套。"
    sentence:
      en: "I want to buy this jacket."
      ja: "このジャケットを買いたいです。"
      zh: "我想買這件夾克。"

  - id: size
    word:
      en: Size
      ja: サイズ
      zh: 尺寸
    reading: "SYZ"
    phonetic: "/saɪz/"
    description:
      en: "Small, Medium, Large."
      ja: "S、M、L。"
      zh: "小、中、大。"
    sentence:
      en: "What size do you have?"
      ja: "どのサイズがありますか？"
      zh: "你們有什麼尺寸？"

  - id: price
    word:
      en: Price
      ja: 価格
      zh: 價格
    reading: "PRYS"
    phonetic: "/praɪs/"
    description:
      en: "How much money."
      ja: "いくらか。"
      zh: "多少錢。"
    sentence:
      en: "I look at the tag, the price is good."
      ja: "タグを見ると、価格がいいです。"
      zh: "我看了標籤，價格不錯。"

  - id: cash
    word:
      en: Cash
      ja: 現金
      zh: 現金
    reading: "KASH"
    phonetic: "/kæʃ/"
    description:
      en: "Paper money and coins."
      ja: "紙幣と硬貨。"
      zh: "紙鈔和硬幣。"
    sentence:
      en: "I pay with cash."
      ja: "現金で払います。"
      zh: "我用現金付款。"

  # Day 2: Core Verbs (Shopping Actions)
  - id: wear
    word:
      en: Wear
      ja: 着る
      zh: 穿
    reading: "WAIR"
    phonetic: "/wer/"
    description:
      en: "Have clothes on body."
      ja: "体に服をつける。"
      zh: "把衣服穿在身上。"
    sentence:
      en: "I am wearing a white T-shirt and jeans."
      ja: "白いTシャツとジーンズを着ています。"
      zh: "我穿著白色T恤和牛仔褲。"

  - id: buy
    word:
      en: Buy
      ja: 買う
      zh: 買
    reading: "BY"
    phonetic: "/baɪ/"
    description:
      en: "Exchange money for item."
      ja: "お金と品物を交換する。"
      zh: "用錢換取物品。"
    sentence:
      en: "I will buy them."
      ja: "それらを買います。"
      zh: "我要買它們。"

  - id: try-on
    word:
      en: Try on
      ja: 試着する
      zh: 試穿
    reading: "TRY on"
    phonetic: "/traɪ ɒn/"
    description:
      en: "Test if clothes fit."
      ja: "服が合うか試す。"
      zh: "試試衣服合不合身。"
    sentence:
      en: "I take it to the fitting room to try on."
      ja: "試着室に持っていって試着します。"
      zh: "我拿到試衣間試穿。"

  - id: look-for
    word:
      en: Look for
      ja: 探す
      zh: 尋找
    reading: "LOOK for"
    phonetic: "/lʊk fɔːr/"
    description:
      en: "Search."
      ja: "探す。"
      zh: "搜尋。"
    sentence:
      en: "I am looking for a new jacket."
      ja: "新しいジャケットを探しています。"
      zh: "我在找一件新夾克。"

  - id: cost
    word:
      en: Cost
      ja: 値段がする
      zh: 花費
    reading: "KAWST"
    phonetic: "/kɔːst/"
    description:
      en: "Have a price."
      ja: "値段がある。"
      zh: "有價格。"
    sentence:
      en: "It costs fifty dollars."
      ja: "50ドルします。"
      zh: "它要五十美元。"

  - id: fit
    word:
      en: Fit
      ja: 合う
      zh: 合身
    reading: "FIT"
    phonetic: "/fɪt/"
    description:
      en: "Is the right size."
      ja: "サイズが合う。"
      zh: "尺寸剛好。"
    sentence:
      en: "It fits perfectly."
      ja: "ぴったり合います。"
      zh: "非常合身。"

  - id: need
    word:
      en: Need
      ja: 必要とする
      zh: 需要
    reading: "NEED"
    phonetic: "/niːd/"
    description:
      en: "Must have."
      ja: "必要がある。"
      zh: "必須有。"
    sentence:
      en: "I need new shoes."
      ja: "新しい靴が必要です。"
      zh: "我需要新鞋子。"

chat:
  conversations:
    - id: scenario-1-shopping-story
      title:
        en: "Going Shopping"
        ja: "買い物に行く"
        zh: "去購物"
      messages:
        - role: partner
          text:
            en: "What are you doing today?"
            ja: "今日は何をしますか？"
            zh: "你今天要做什麼？"
        - role: user
          text:
            en: "Today I go shopping. I am looking for a new jacket."
            ja: "今日は買い物に行きます。新しいジャケットを探しています。"
            zh: "今天我去購物。我在找一件新夾克。"
        - role: partner
          text:
            en: "Did you find something you like?"
            ja: "気に入ったものは見つかりましたか？"
            zh: "你找到喜歡的東西了嗎？"
        - role: user
          text:
            en: "Yes, I enter a store and see a nice one. It is blue."
            ja: "はい、お店に入って素敵なのを見つけました。青いです。"
            zh: "是的，我進了一家店，看到一件不錯的。是藍色的。"
        - role: partner
          text:
            en: "Did you try it on?"
            ja: "試着しましたか？"
            zh: "你試穿了嗎？"
        - role: user
          text:
            en: "Yes, I take it to the fitting room to try on. It fits perfectly."
            ja: "はい、試着室で試着しました。ぴったり合います。"
            zh: "是的，我拿到試衣間試穿。非常合身。"
        - role: partner
          text:
            en: "How much does it cost?"
            ja: "いくらですか？"
            zh: "多少錢？"
        - role: user
          text:
            en: "I look at the tag, the price is good. I go to the cashier and pay with cash."
            ja: "タグを見ると、価格がいいです。レジに行って現金で払います。"
            zh: "我看了標籤，價格不錯。我去收銀台用現金付款。"

    - id: scenario-2-at-shoe-store
      title:
        en: "At the Shoe Store"
        ja: "靴屋で"
        zh: "在鞋店"
      messages:
        - role: partner
          text:
            en: "Can I help you?"
            ja: "何かお探しですか？"
            zh: "需要幫忙嗎？"
        - role: user
          text:
            en: "Yes, I am looking for shoes."
            ja: "はい、靴を探しています。"
            zh: "是的，我在找鞋子。"
        - role: partner
          text:
            en: "What size are you?"
            ja: "サイズはいくつですか？"
            zh: "你穿幾號？"
        - role: user
          text:
            en: "I am size 42."
            ja: "42です。"
            zh: "我穿42號。"
        - role: partner
          text:
            en: "Here, try on these."
            ja: "こちら、試着してみてください。"
            zh: "這裡，試試這雙。"
        - role: user
          text:
            en: "They are comfortable. How much do they cost?"
            ja: "履き心地がいいです。いくらですか？"
            zh: "很舒適。多少錢？"
        - role: partner
          text:
            en: "They cost $80."
            ja: "80ドルです。"
            zh: "80美元。"
        - role: user
          text:
            en: "I will buy them. Can I pay with card?"
            ja: "買います。カードで払えますか？"
            zh: "我要買。可以刷卡嗎？"

    - id: scenario-3-questions-answers
      title:
        en: "Shopping Questions"
        ja: "買い物の質問"
        zh: "購物問答"
      messages:
        - role: partner
          text:
            en: "What are you wearing?"
            ja: "何を着ていますか？"
            zh: "你穿什麼？"
        - role: user
          text:
            en: "I am wearing a white T-shirt and jeans."
            ja: "白いTシャツとジーンズを着ています。"
            zh: "我穿著白色T恤和牛仔褲。"
        - role: partner
          text:
            en: "How much is this?"
            ja: "これはいくらですか？"
            zh: "這個多少錢？"
        - role: user
          text:
            en: "It is $20."
            ja: "20ドルです。"
            zh: "20美元。"
        - role: partner
          text:
            en: "Do you like this color?"
            ja: "この色は好きですか？"
            zh: "你喜歡這個顏色嗎？"
        - role: user
          text:
            en: "No, I prefer black."
            ja: "いいえ、黒の方が好きです。"
            zh: "不，我比較喜歡黑色。"
        - role: partner
          text:
            en: "Does it fit?"
            ja: "サイズは合いますか？"
            zh: "合身嗎？"
        - role: user
          text:
            en: "No, it is too small."
            ja: "いいえ、小さすぎます。"
            zh: "不，太小了。"
        - role: partner
          text:
            en: "How about this one? Is it too big?"
            ja: "これはどうですか？大きすぎますか？"
            zh: "這件呢？太大了嗎？"
        - role: user
          text:
            en: "No, it fits perfectly!"
            ja: "いいえ、ぴったりです！"
            zh: "不，非常合身！"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,Mt=`# Chapter: Week 4 - Family & Friends
meta:
  id: family-and-friends
  title:
    en: "Family & Friends"
    ja: "家族と友達"
    zh: "家人與朋友"
  description:
    en: "Describing people around you."
    ja: "周りの人を説明しましょう。"
    zh: "學習描述你身邊的人。"
  icon: "👨‍👩‍👧‍👦"
  order: 4
  level: beginner

words:
  # Day 1: Core Nouns (People)
  - id: parents
    word:
      en: Parents
      ja: 両親
      zh: 父母
    reading: "PAIR-uhnts"
    phonetic: "/ˈperənts/"
    description:
      en: "Mother and Father."
      ja: "母親と父親。"
      zh: "母親和父親。"
    sentence:
      en: "I live with my parents."
      ja: "私は両親と一緒に住んでいます。"
      zh: "我和父母住在一起。"

  - id: father
    word:
      en: Father
      ja: 父
      zh: 父親
    reading: "FAH-ther"
    phonetic: "/ˈfɑːðər/"
    description:
      en: "Male parent."
      ja: "男性の親。"
      zh: "男性家長。"
    sentence:
      en: "My father is busy at work."
      ja: "父は仕事で忙しいです。"
      zh: "我父親工作很忙。"

  - id: mother
    word:
      en: Mother
      ja: 母
      zh: 母親
    reading: "MUHTH-er"
    phonetic: "/ˈmʌðər/"
    description:
      en: "Female parent."
      ja: "女性の親。"
      zh: "女性家長。"
    sentence:
      en: "My mother is very kind."
      ja: "母はとても優しいです。"
      zh: "我母親非常和藹。"

  - id: sister
    word:
      en: Sister
      ja: 姉妹
      zh: 姐妹
    reading: "SIS-ter"
    phonetic: "/ˈsɪstər/"
    description:
      en: "Female sibling."
      ja: "女性のきょうだい。"
      zh: "女性兄弟姐妹。"
    sentence:
      en: "I have two sisters."
      ja: "私には姉妹が2人います。"
      zh: "我有兩個姐妹。"

  - id: brother
    word:
      en: Brother
      ja: 兄弟
      zh: 兄弟
    reading: "BRUHTH-er"
    phonetic: "/ˈbrʌðər/"
    description:
      en: "Male sibling."
      ja: "男性のきょうだい。"
      zh: "男性兄弟姐妹。"
    sentence:
      en: "My brother is tall."
      ja: "私の兄弟は背が高いです。"
      zh: "我的兄弟很高。"

  - id: friend
    word:
      en: Friend
      ja: 友達
      zh: 朋友
    reading: "FREND"
    phonetic: "/frend/"
    description:
      en: "Person you like, not family."
      ja: "好きな人、家族ではない。"
      zh: "你喜歡的人，不是家人。"
    sentence:
      en: "She is my best friend."
      ja: "彼女は私の親友です。"
      zh: "她是我最好的朋友。"

  - id: family
    word:
      en: Family
      ja: 家族
      zh: 家庭
    reading: "FAM-uh-lee"
    phonetic: "/ˈfæməli/"
    description:
      en: "All your relatives group."
      ja: "親戚全員のグループ。"
      zh: "你所有親戚的群體。"
    sentence:
      en: "This is my family."
      ja: "これが私の家族です。"
      zh: "這是我的家人。"

  # Day 2: Adjectives (Describing People)
  - id: kind
    word:
      en: Kind
      ja: 優しい
      zh: 和藹
    reading: "KYND"
    phonetic: "/kaɪnd/"
    description:
      en: "Nice, helpful."
      ja: "親切で、助けになる。"
      zh: "友善、樂於助人。"
    sentence:
      en: "My mother is very kind."
      ja: "母はとても優しいです。"
      zh: "我母親非常和藹。"

  - id: funny
    word:
      en: Funny
      ja: 面白い
      zh: 有趣
    reading: "FUHN-ee"
    phonetic: "/ˈfʌni/"
    description:
      en: "Makes you laugh."
      ja: "笑わせてくれる。"
      zh: "讓你笑。"
    sentence:
      en: "My sister is funny, she always makes me laugh."
      ja: "姉妹は面白くて、いつも笑わせてくれます。"
      zh: "我姐妹很有趣，她總是讓我笑。"

  - id: tall
    word:
      en: Tall
      ja: 背が高い
      zh: 高
    reading: "TAWL"
    phonetic: "/tɔːl/"
    description:
      en: "High height."
      ja: "身長が高い。"
      zh: "身高很高。"
    sentence:
      en: "My dad is tall."
      ja: "父は背が高いです。"
      zh: "我爸爸很高。"

  - id: short
    word:
      en: Short
      ja: 背が低い
      zh: 矮
    reading: "SHORT"
    phonetic: "/ʃɔːrt/"
    description:
      en: "Low height."
      ja: "身長が低い。"
      zh: "身高很矮。"
    sentence:
      en: "No, he is short."
      ja: "いいえ、彼は背が低いです。"
      zh: "不，他很矮。"

  - id: old
    word:
      en: Old
      ja: 年をとった
      zh: 老
    reading: "OHLD"
    phonetic: "/oʊld/"
    description:
      en: "Many years."
      ja: "年齢が高い。"
      zh: "年紀大。"
    sentence:
      en: "My grandfather is old, but strong."
      ja: "祖父は年をとっていますが、元気です。"
      zh: "我爺爺年紀大了，但很強壯。"

  - id: young
    word:
      en: Young
      ja: 若い
      zh: 年輕
    reading: "YUHNG"
    phonetic: "/jʌŋ/"
    description:
      en: "Few years."
      ja: "年齢が若い。"
      zh: "年紀小。"
    sentence:
      en: "My little brother is very young."
      ja: "弟はとても若いです。"
      zh: "我弟弟很年輕。"

  - id: busy
    word:
      en: Busy
      ja: 忙しい
      zh: 忙碌
    reading: "BIZ-ee"
    phonetic: "/ˈbɪzi/"
    description:
      en: "Has lots of work."
      ja: "たくさんの仕事がある。"
      zh: "有很多工作。"
    sentence:
      en: "We are very busy during the week."
      ja: "私たちは平日とても忙しいです。"
      zh: "我們平日非常忙碌。"

chat:
  conversations:
    - id: scenario-1-my-family
      title:
        en: "My Family"
        ja: "私の家族"
        zh: "我的家人"
      messages:
        - role: partner
          text:
            en: "Tell me about your family."
            ja: "あなたの家族について教えてください。"
            zh: "跟我說說你的家人。"
        - role: user
          text:
            en: "I have a big family."
            ja: "私は大家族です。"
            zh: "我有一個大家庭。"
        - role: partner
          text:
            en: "Who do you live with?"
            ja: "誰と一緒に住んでいますか？"
            zh: "你和誰住在一起？"
        - role: user
          text:
            en: "I live with my parents and my sister."
            ja: "両親と姉妹と一緒に住んでいます。"
            zh: "我和父母還有姐妹住在一起。"
        - role: partner
          text:
            en: "What does your mother do?"
            ja: "お母さんは何をしていますか？"
            zh: "你媽媽做什麼工作？"
        - role: user
          text:
            en: "My mother is a teacher, she is very kind."
            ja: "母は先生で、とても優しいです。"
            zh: "我媽媽是老師，她非常和藹。"
        - role: partner
          text:
            en: "What about your sister?"
            ja: "お姉さんはどうですか？"
            zh: "你姐妹呢？"
        - role: user
          text:
            en: "My sister is funny, she always makes me laugh."
            ja: "姉妹は面白くて、いつも笑わせてくれます。"
            zh: "我姐妹很有趣，她總是讓我笑。"
        - role: partner
          text:
            en: "Do you meet your friends on weekends?"
            ja: "週末に友達に会いますか？"
            zh: "你週末會見朋友嗎？"
        - role: user
          text:
            en: "Yes, on weekends I meet my best friend."
            ja: "はい、週末に親友に会います。"
            zh: "是的，週末我會見我最好的朋友。"

    - id: scenario-2-family-photo
      title:
        en: "Family Photo"
        ja: "家族写真"
        zh: "家庭照片"
      messages:
        - role: partner
          text:
            en: "Is that a photo of your family?"
            ja: "それはあなたの家族の写真ですか？"
            zh: "那是你的家庭照片嗎？"
        - role: user
          text:
            en: "Yes. This is my father and this is my mother."
            ja: "はい。これが父で、これが母です。"
            zh: "是的。這是我爸爸，這是我媽媽。"
        - role: partner
          text:
            en: "Who is the young boy?"
            ja: "この若い男の子は誰ですか？"
            zh: "那個小男孩是誰？"
        - role: user
          text:
            en: "That is my little brother. He is 5 years old."
            ja: "それは弟です。5歳です。"
            zh: "那是我弟弟。他5歲。"
        - role: partner
          text:
            en: "He looks very funny."
            ja: "彼はとても面白そうですね。"
            zh: "他看起來很有趣。"
        - role: user
          text:
            en: "Yes, he always makes everyone laugh."
            ja: "はい、みんなをいつも笑わせます。"
            zh: "是的，他總是讓大家笑。"
        - role: partner
          text:
            en: "Is your father tall?"
            ja: "お父さんは背が高いですか？"
            zh: "你爸爸高嗎？"
        - role: user
          text:
            en: "No, he is short, but my brother is tall."
            ja: "いいえ、背が低いですが、兄弟は背が高いです。"
            zh: "不，他很矮，但我兄弟很高。"

    - id: scenario-3-questions-answers
      title:
        en: "Family Questions"
        ja: "家族についての質問"
        zh: "關於家人的問答"
      messages:
        - role: partner
          text:
            en: "Do you have any brothers?"
            ja: "兄弟はいますか？"
            zh: "你有兄弟嗎？"
        - role: user
          text:
            en: "Yes, I have one brother."
            ja: "はい、兄弟が1人います。"
            zh: "是的，我有一個兄弟。"
        - role: partner
          text:
            en: "Who is she?"
            ja: "彼女は誰ですか？"
            zh: "她是誰？"
        - role: user
          text:
            en: "She is my sister."
            ja: "彼女は私の姉妹です。"
            zh: "她是我姐妹。"
        - role: partner
          text:
            en: "Is your father tall?"
            ja: "お父さんは背が高いですか？"
            zh: "你爸爸高嗎？"
        - role: user
          text:
            en: "No, he is short."
            ja: "いいえ、背が低いです。"
            zh: "不，他很矮。"
        - role: partner
          text:
            en: "How are your parents?"
            ja: "ご両親はお元気ですか？"
            zh: "你父母好嗎？"
        - role: user
          text:
            en: "They are very good, thank you."
            ja: "とても元気です、ありがとうございます。"
            zh: "他們很好，謝謝。"
        - role: partner
          text:
            en: "How many friends do you have?"
            ja: "友達は何人いますか？"
            zh: "你有多少朋友？"
        - role: user
          text:
            en: "I have many friends."
            ja: "たくさん友達がいます。"
            zh: "我有很多朋友。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,Rt=`# Chapter: Week 2 - Food & Eating
meta:
  id: food-and-eating
  title:
    en: "Food & Eating"
    ja: "食べ物と食事"
    zh: "食物與用餐"
  description:
    en: "Satisfying hunger and ordering at restaurants."
    ja: "空腹を満たし、レストランで注文する方法を学びましょう。"
    zh: "學習如何滿足飢餓感和在餐廳點餐。"
  icon: "🍽️"
  order: 2
  level: beginner

words:
  # Day 1: Core Nouns (Food & Places)
  - id: menu
    word:
      en: Menu
      ja: メニュー
      zh: 菜單
    reading: "MEN-yoo"
    phonetic: "/ˈmenjuː/"
    description:
      en: "List of food options."
      ja: "食べ物の選択肢のリスト。"
      zh: "食物選項的列表。"
    sentence:
      en: "Let's look at the menu."
      ja: "メニューを見ましょう。"
      zh: "我們看一下菜單吧。"

  - id: waiter
    word:
      en: Waiter
      ja: ウェイター
      zh: 服務生
    reading: "WAY-ter"
    phonetic: "/ˈweɪtər/"
    description:
      en: "Person serving food."
      ja: "食べ物を運ぶ人。"
      zh: "提供食物的人。"
    sentence:
      en: "The waiter brings the food."
      ja: "ウェイターが食べ物を運んできます。"
      zh: "服務生送來食物。"

  - id: water
    word:
      en: Water
      ja: 水
      zh: 水
    reading: "WAW-ter"
    phonetic: "/ˈwɔːtər/"
    description:
      en: "Clear drink."
      ja: "透明な飲み物。"
      zh: "透明的飲料。"
    sentence:
      en: "I am thirsty, I need water."
      ja: "喉が渇いています、水が必要です。"
      zh: "我很渴，我需要水。"

  - id: bread
    word:
      en: Bread
      ja: パン
      zh: 麵包
    reading: "BRED"
    phonetic: "/bred/"
    description:
      en: "Basic food made of flour."
      ja: "小麦粉で作った基本的な食べ物。"
      zh: "用麵粉做的基本食物。"
    sentence:
      en: "I eat bread with butter."
      ja: "私はバターをつけてパンを食べます。"
      zh: "我吃麵包配奶油。"

  - id: meat
    word:
      en: Meat
      ja: 肉
      zh: 肉
    reading: "MEET"
    phonetic: "/miːt/"
    description:
      en: "Chicken, beef, pork."
      ja: "鶏肉、牛肉、豚肉。"
      zh: "雞肉、牛肉、豬肉。"
    sentence:
      en: "This meat tastes delicious."
      ja: "この肉はとても美味しいです。"
      zh: "這肉嚐起來很美味。"

  - id: vegetables
    word:
      en: Vegetables
      ja: 野菜
      zh: 蔬菜
    reading: "VEJ-tuh-buhlz"
    phonetic: "/ˈvedʒtəbəlz/"
    description:
      en: "Salad, carrots, greens."
      ja: "サラダ、人参、葉物野菜。"
      zh: "沙拉、胡蘿蔔、蔬菜。"
    sentence:
      en: "I order chicken and vegetables."
      ja: "私は鶏肉と野菜を注文します。"
      zh: "我點雞肉和蔬菜。"

  - id: bill
    word:
      en: Bill
      ja: 請求書
      zh: 帳單
    reading: "BIL"
    phonetic: "/bɪl/"
    description:
      en: "Paper saying the price."
      ja: "値段が書かれた紙。"
      zh: "寫著價格的紙。"
    sentence:
      en: "I will pay the bill."
      ja: "私が請求書を払います。"
      zh: "我來付帳單。"

  # Day 2: Core Verbs (Eating Actions)
  - id: hungry
    word:
      en: Hungry
      ja: お腹が空いた
      zh: 餓
    reading: "HUHNG-gree"
    phonetic: "/ˈhʌŋɡri/"
    description:
      en: "Feeling: need food."
      ja: "食べ物が必要な感覚。"
      zh: "感覺：需要食物。"
    sentence:
      en: "I am very hungry right now."
      ja: "今とてもお腹が空いています。"
      zh: "我現在很餓。"

  - id: thirsty
    word:
      en: Thirsty
      ja: 喉が渇いた
      zh: 渴
    reading: "THUR-stee"
    phonetic: "/ˈθɜːrsti/"
    description:
      en: "Feeling: need drink."
      ja: "飲み物が必要な感覚。"
      zh: "感覺：需要喝水。"
    sentence:
      en: "I am thirsty, I need water."
      ja: "喉が渇いています、水が必要です。"
      zh: "我很渴，我需要水。"

  - id: order
    word:
      en: Order
      ja: 注文する
      zh: 點餐
    reading: "OR-der"
    phonetic: "/ˈɔːrdər/"
    description:
      en: "Ask for food."
      ja: "食べ物を頼む。"
      zh: "要求食物。"
    sentence:
      en: "I want to order chicken and vegetables."
      ja: "鶏肉と野菜を注文したいです。"
      zh: "我想點雞肉和蔬菜。"

  - id: cook
    word:
      en: Cook
      ja: 料理する
      zh: 烹飪
    reading: "KOOK"
    phonetic: "/kʊk/"
    description:
      en: "Make food."
      ja: "食べ物を作る。"
      zh: "做食物。"
    sentence:
      en: "The chef cooks the steak."
      ja: "シェフがステーキを料理します。"
      zh: "主廚烹調牛排。"

  - id: taste
    word:
      en: Taste
      ja: 味わう
      zh: 品嚐
    reading: "TAYST"
    phonetic: "/teɪst/"
    description:
      en: "Sense flavor."
      ja: "味を感じる。"
      zh: "感受味道。"
    sentence:
      en: "This meat tastes delicious."
      ja: "この肉はとても美味しいです。"
      zh: "這肉嚐起來很美味。"

  - id: pay
    word:
      en: Pay
      ja: 払う
      zh: 付錢
    reading: "PAY"
    phonetic: "/peɪ/"
    description:
      en: "Give money."
      ja: "お金を渡す。"
      zh: "給錢。"
    sentence:
      en: "I ask for the bill and pay."
      ja: "請求書をもらって払います。"
      zh: "我要帳單然後付錢。"

  - id: enjoy
    word:
      en: Enjoy
      ja: 楽しむ
      zh: 享受
    reading: "en-JOY"
    phonetic: "/ɪnˈdʒɔɪ/"
    description:
      en: "Like the experience."
      ja: "経験を楽しむ。"
      zh: "喜歡這個體驗。"
    sentence:
      en: "We enjoy the food very much."
      ja: "私たちは食事をとても楽しんでいます。"
      zh: "我們非常享受這頓飯。"

chat:
  conversations:
    - id: scenario-1-restaurant-story
      title:
        en: "Lunchtime at Restaurant"
        ja: "レストランでのランチタイム"
        zh: "餐廳午餐時間"
      messages:
        - role: partner
          text:
            en: "It is lunchtime. Are you hungry?"
            ja: "ランチタイムです。お腹空いていますか？"
            zh: "午餐時間到了。你餓嗎？"
        - role: user
          text:
            en: "Yes, I am starving. Let's go to a restaurant."
            ja: "はい、とてもお腹が空いています。レストランに行きましょう。"
            zh: "是的，我餓壞了。我們去餐廳吧。"
        - role: partner
          text:
            en: "Good idea. We sit down and the waiter gives us the menu."
            ja: "いいですね。座って、ウェイターがメニューをくれます。"
            zh: "好主意。我們坐下，服務生給我們菜單。"
        - role: user
          text:
            en: "I order a steak and a salad."
            ja: "私はステーキとサラダを注文します。"
            zh: "我點一份牛排和沙拉。"
        - role: partner
          text:
            en: "I will order fish. What do you want to drink?"
            ja: "私は魚を注文します。何を飲みたいですか？"
            zh: "我點魚。你想喝什麼？"
        - role: user
          text:
            en: "I am thirsty, I need cold water."
            ja: "喉が渇いています、冷たい水が必要です。"
            zh: "我很渴，我需要冰水。"
        - role: partner
          text:
            en: "The food is here. How does it taste?"
            ja: "食べ物が来ました。味はどうですか？"
            zh: "食物來了。味道怎麼樣？"
        - role: user
          text:
            en: "It is very good. I enjoy it very much."
            ja: "とても美味しいです。とても楽しんでいます。"
            zh: "非常好吃。我很享受。"
        - role: partner
          text:
            en: "After eating, let's ask for the bill."
            ja: "食べ終わったら、請求書をもらいましょう。"
            zh: "吃完後，我們要帳單吧。"
        - role: user
          text:
            en: "Yes, I will pay the bill."
            ja: "はい、私が請求書を払います。"
            zh: "好的，我來付帳。"

    - id: scenario-2-ordering-food
      title:
        en: "Ordering at a Restaurant"
        ja: "レストランで注文する"
        zh: "在餐廳點餐"
      messages:
        - role: partner
          text:
            en: "Hello, are you ready to order?"
            ja: "こんにちは、ご注文はお決まりですか？"
            zh: "你好，準備好點餐了嗎？"
        - role: user
          text:
            en: "Yes. I will have the burger, please."
            ja: "はい。バーガーをお願いします。"
            zh: "是的。我要漢堡，謝謝。"
        - role: partner
          text:
            en: "Anything to drink?"
            ja: "お飲み物はいかがですか？"
            zh: "要喝什麼嗎？"
        - role: user
          text:
            en: "Just water, please."
            ja: "水だけでお願いします。"
            zh: "請給我水就好。"
        - role: partner
          text:
            en: "Here is your food. Enjoy your meal."
            ja: "こちらがお料理です。ごゆっくりどうぞ。"
            zh: "這是您的餐點。請慢用。"
        - role: user
          text:
            en: "Thank you. This tastes delicious!"
            ja: "ありがとうございます。とても美味しいです！"
            zh: "謝謝。這很好吃！"
        - role: partner
          text:
            en: "I'm glad you like it. Anything else?"
            ja: "気に入っていただけて嬉しいです。他にご注文は？"
            zh: "很高興你喜歡。還需要什麼嗎？"
        - role: user
          text:
            en: "Can I have the bill now?"
            ja: "今、請求書をいただけますか？"
            zh: "可以給我帳單嗎？"

    - id: scenario-3-questions-answers
      title:
        en: "Food Questions"
        ja: "食べ物の質問"
        zh: "食物問答"
      messages:
        - role: partner
          text:
            en: "Are you hungry?"
            ja: "お腹空いていますか？"
            zh: "你餓嗎？"
        - role: user
          text:
            en: "Yes, I am starving."
            ja: "はい、とてもお腹が空いています。"
            zh: "是的，我餓壞了。"
        - role: partner
          text:
            en: "What do you want to eat?"
            ja: "何を食べたいですか？"
            zh: "你想吃什麼？"
        - role: user
          text:
            en: "I want to eat pasta."
            ja: "パスタを食べたいです。"
            zh: "我想吃義大利麵。"
        - role: partner
          text:
            en: "Can I have the menu, please?"
            ja: "メニューをいただけますか？"
            zh: "可以給我菜單嗎？"
        - role: user
          text:
            en: "Here you go."
            ja: "はい、どうぞ。"
            zh: "給你。"
        - role: partner
          text:
            en: "How is the food?"
            ja: "料理はどうですか？"
            zh: "食物怎麼樣？"
        - role: user
          text:
            en: "It is very good."
            ja: "とても美味しいです。"
            zh: "非常好吃。"
        - role: partner
          text:
            en: "Can I have a fork, please?"
            ja: "フォークをいただけますか？"
            zh: "可以給我一支叉子嗎？"
        - role: user
          text:
            en: "Of course, here you go."
            ja: "もちろん、どうぞ。"
            zh: "當然，給你。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,Wt=`# Chapter: Week 10 - Health & Body
meta:
  id: health-and-body
  title:
    en: "Health & Body"
    ja: "健康と体"
    zh: "健康與身體"
  description:
    en: "Talking about your body and feeling unwell."
    ja: "体のことや体調不良について話しましょう。"
    zh: "學習談論身體和身體不適。"
  icon: "🏥"
  order: 10
  level: beginner

words:
  # Day 1: Core Nouns (Body Parts)
  - id: head
    word:
      en: Head
      ja: 頭
      zh: 頭
    reading: "HED"
    phonetic: "/hed/"
    description:
      en: "Top of body."
      ja: "体の一番上。"
      zh: "身體的最上方。"
    sentence:
      en: "My head hurts."
      ja: "頭が痛いです。"
      zh: "我頭痛。"

  - id: stomach
    word:
      en: Stomach
      ja: お腹
      zh: 肚子
    reading: "STUHM-uhk"
    phonetic: "/ˈstʌmək/"
    description:
      en: "Belly, where food goes."
      ja: "お腹、食べ物が行く場所。"
      zh: "腹部，食物去的地方。"
    sentence:
      en: "I have a pain in my stomach."
      ja: "お腹が痛いです。"
      zh: "我肚子痛。"

  - id: hand
    word:
      en: Hand
      ja: 手
      zh: 手
    reading: "HAND"
    phonetic: "/hænd/"
    description:
      en: "End of arm."
      ja: "腕の先。"
      zh: "手臂的末端。"
    sentence:
      en: "I use my hand to write."
      ja: "手を使って書きます。"
      zh: "我用手寫字。"

  - id: leg
    word:
      en: Leg
      ja: 脚
      zh: 腿
    reading: "LEG"
    phonetic: "/leɡ/"
    description:
      en: "Part for walking."
      ja: "歩くための部分。"
      zh: "用來走路的部位。"
    sentence:
      en: "He broke his leg playing soccer."
      ja: "彼はサッカーをして脚を骨折しました。"
      zh: "他踢足球時摔斷了腿。"

  - id: eye
    word:
      en: Eye
      ja: 目
      zh: 眼睛
    reading: "AY"
    phonetic: "/aɪ/"
    description:
      en: "Part for seeing."
      ja: "見るための部分。"
      zh: "用來看東西的部位。"
    sentence:
      en: "My eyes are tired from the computer."
      ja: "コンピューターで目が疲れました。"
      zh: "我的眼睛因為看電腦很累。"

  - id: medicine
    word:
      en: Medicine
      ja: 薬
      zh: 藥
    reading: "MED-uh-sin"
    phonetic: "/ˈmedɪsɪn/"
    description:
      en: "Drug to fix sickness."
      ja: "病気を治すための薬。"
      zh: "治療疾病的藥物。"
    sentence:
      en: "The doctor gave me medicine."
      ja: "医者が薬をくれました。"
      zh: "醫生給了我藥。"

  - id: doctor
    word:
      en: Doctor
      ja: 医者
      zh: 醫生
    reading: "DOK-ter"
    phonetic: "/ˈdɑːktər/"
    description:
      en: "Person who fixes health."
      ja: "健康を治す人。"
      zh: "治療健康的人。"
    sentence:
      en: "I called the doctor."
      ja: "医者に電話しました。"
      zh: "我打電話給醫生。"

  # Day 2: Verbs & Adjectives (Feeling)
  - id: sick
    word:
      en: Sick
      ja: 病気
      zh: 生病
    reading: "SIK"
    phonetic: "/sɪk/"
    description:
      en: "Not healthy, feeling bad."
      ja: "健康でない、気分が悪い。"
      zh: "不健康，感覺不舒服。"
    sentence:
      en: "I feel sick today."
      ja: "今日は気分が悪いです。"
      zh: "我今天感覺不舒服。"

  - id: hurt
    word:
      en: Hurt
      ja: 痛い
      zh: 痛
    reading: "HURT"
    phonetic: "/hɜːrt/"
    description:
      en: "Feel pain."
      ja: "痛みを感じる。"
      zh: "感到疼痛。"
    sentence:
      en: "My stomach hurts."
      ja: "お腹が痛いです。"
      zh: "我肚子痛。"

  - id: tired
    word:
      en: Tired
      ja: 疲れた
      zh: 累
    reading: "TY-erd"
    phonetic: "/ˈtaɪərd/"
    description:
      en: "No energy."
      ja: "エネルギーがない。"
      zh: "沒有精力。"
    sentence:
      en: "You look tired, go to sleep."
      ja: "疲れているようです、寝てください。"
      zh: "你看起來很累，去睡覺吧。"

  - id: healthy
    word:
      en: Healthy
      ja: 健康な
      zh: 健康
    reading: "HEL-thee"
    phonetic: "/ˈhelθi/"
    description:
      en: "Body is good."
      ja: "体が良い状態。"
      zh: "身體狀況良好。"
    sentence:
      en: "Now I feel a little more healthy."
      ja: "今は少し健康になりました。"
      zh: "現在我感覺健康多了。"

  - id: pain
    word:
      en: Pain
      ja: 痛み
      zh: 疼痛
    reading: "PAYN"
    phonetic: "/peɪn/"
    description:
      en: "Bad feeling."
      ja: "悪い感覚。"
      zh: "不好的感覺。"
    sentence:
      en: "I have a bad pain in my leg."
      ja: "脚がひどく痛いです。"
      zh: "我的腿很痛。"

  - id: rest
    word:
      en: Rest
      ja: 休む
      zh: 休息
    reading: "REST"
    phonetic: "/rest/"
    description:
      en: "Sleep or relax to get better."
      ja: "良くなるために寝たりリラックスする。"
      zh: "睡覺或放鬆來恢復。"
    sentence:
      en: "I stayed in bed all day to rest."
      ja: "休むために一日中ベッドにいました。"
      zh: "我整天都躺在床上休息。"

  - id: broken
    word:
      en: Broken
      ja: 骨折した
      zh: 斷掉
    reading: "BROH-ken"
    phonetic: "/ˈbroʊkən/"
    description:
      en: "Bone is snapped."
      ja: "骨が折れている。"
      zh: "骨頭斷裂。"
    sentence:
      en: "It is not broken, but it is hurt."
      ja: "骨折はしていませんが、痛いです。"
      zh: "沒有斷，但是很痛。"

chat:
  conversations:
    - id: scenario-1-feeling-sick
      title:
        en: "Feeling Sick"
        ja: "気分が悪い"
        zh: "感覺不舒服"
      messages:
        - role: partner
          text:
            en: "Good morning. How are you feeling?"
            ja: "おはようございます。気分はどうですか？"
            zh: "早安。你感覺怎麼樣？"
        - role: user
          text:
            en: "I woke up feeling terrible. My head was hot and my body was tired."
            ja: "ひどい気分で起きました。頭が熱くて体が疲れています。"
            zh: "我醒來感覺很糟。頭很熱，身體很累。"
        - role: partner
          text:
            en: "Did you go to work?"
            ja: "仕事に行きましたか？"
            zh: "你去上班了嗎？"
        - role: user
          text:
            en: "No, I did not go to work. I called the doctor."
            ja: "いいえ、仕事に行きませんでした。医者に電話しました。"
            zh: "不，我沒去上班。我打電話給醫生。"
        - role: partner
          text:
            en: "What did the doctor say?"
            ja: "医者は何と言いましたか？"
            zh: "醫生怎麼說？"
        - role: user
          text:
            en: "She said, 'You are sick. Take this medicine and rest.'"
            ja: "「病気です。この薬を飲んで休んでください」と言いました。"
            zh: "她說：「你生病了。吃這個藥然後休息。」"
        - role: partner
          text:
            en: "Are you feeling better now?"
            ja: "今は良くなりましたか？"
            zh: "你現在好點了嗎？"
        - role: user
          text:
            en: "I stayed in bed all day. Now I feel a little more healthy."
            ja: "一日中ベッドにいました。今は少し健康になりました。"
            zh: "我整天都躺在床上。現在我感覺健康多了。"

    - id: scenario-2-at-doctor
      title:
        en: "At the Doctor"
        ja: "医者で"
        zh: "看醫生"
      messages:
        - role: partner
          text:
            en: "Good morning. What is the problem?"
            ja: "おはようございます。どうされましたか？"
            zh: "早安。有什麼問題？"
        - role: user
          text:
            en: "I have a bad pain in my leg."
            ja: "脚がひどく痛いです。"
            zh: "我的腿很痛。"
        - role: partner
          text:
            en: "Did you fall?"
            ja: "転びましたか？"
            zh: "你摔倒了嗎？"
        - role: user
          text:
            en: "Yes, I fell yesterday."
            ja: "はい、昨日転びました。"
            zh: "是的，我昨天摔倒了。"
        - role: partner
          text:
            en: "Let me look. It is not broken, but it is hurt."
            ja: "見せてください。骨折はしていませんが、痛いですね。"
            zh: "讓我看看。沒有斷，但是有受傷。"
        - role: user
          text:
            en: "Do I need medicine?"
            ja: "薬が必要ですか？"
            zh: "我需要吃藥嗎？"
        - role: partner
          text:
            en: "No, just rest your leg."
            ja: "いいえ、脚を休めてください。"
            zh: "不用，只要讓腿休息。"
        - role: user
          text:
            en: "Thank you, doctor."
            ja: "ありがとうございます、先生。"
            zh: "謝謝醫生。"

    - id: scenario-3-questions-answers
      title:
        en: "Health Questions"
        ja: "健康の質問"
        zh: "健康問答"
      messages:
        - role: partner
          text:
            en: "Are you okay?"
            ja: "大丈夫ですか？"
            zh: "你還好嗎？"
        - role: user
          text:
            en: "No, I feel sick."
            ja: "いいえ、気分が悪いです。"
            zh: "不好，我感覺不舒服。"
        - role: partner
          text:
            en: "What is wrong?"
            ja: "どうしましたか？"
            zh: "怎麼了？"
        - role: user
          text:
            en: "My stomach hurts."
            ja: "お腹が痛いです。"
            zh: "我肚子痛。"
        - role: partner
          text:
            en: "Do you need a doctor?"
            ja: "医者が必要ですか？"
            zh: "你需要看醫生嗎？"
        - role: user
          text:
            en: "No, I just need rest."
            ja: "いいえ、休むだけで大丈夫です。"
            zh: "不用，我只需要休息。"
        - role: partner
          text:
            en: "Where is the pain?"
            ja: "どこが痛いですか？"
            zh: "哪裡痛？"
        - role: user
          text:
            en: "It is in my back."
            ja: "背中です。"
            zh: "在我的背。"
        - role: partner
          text:
            en: "Do you have a fever?"
            ja: "熱はありますか？"
            zh: "你有發燒嗎？"
        - role: user
          text:
            en: "Yes, I have a fever and a headache."
            ja: "はい、熱と頭痛があります。"
            zh: "是的，我發燒還頭痛。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,Dt=`# Chapter: Week 8 - Hobbies & Free Time
meta:
  id: hobbies-and-free-time
  title:
    en: "Hobbies & Free Time"
    ja: "趣味と自由時間"
    zh: "嗜好與休閒"
  description:
    en: "What you do for fun when you are not working."
    ja: "仕事以外の楽しみを学びましょう。"
    zh: "學習工作之外你做什麼來娛樂。"
  icon: "🎮"
  order: 8
  level: beginner

words:
  # Day 1: Core Nouns (Activities)
  - id: music
    word:
      en: Music
      ja: 音楽
      zh: 音樂
    reading: "MYOO-zik"
    phonetic: "/ˈmjuːzɪk/"
    description:
      en: "Songs, instruments."
      ja: "歌、楽器。"
      zh: "歌曲、樂器。"
    sentence:
      en: "I like to listen to music."
      ja: "私は音楽を聴くのが好きです。"
      zh: "我喜歡聽音樂。"

  - id: movie
    word:
      en: Movie
      ja: 映画
      zh: 電影
    reading: "MOO-vee"
    phonetic: "/ˈmuːvi/"
    description:
      en: "Film at cinema or TV."
      ja: "映画館やテレビで見る映像作品。"
      zh: "在電影院或電視上看的影片。"
    sentence:
      en: "They watch a movie every Friday."
      ja: "彼らは毎週金曜日に映画を見ます。"
      zh: "他們每個星期五看電影。"

  - id: book
    word:
      en: Book
      ja: 本
      zh: 書
    reading: "BOOK"
    phonetic: "/bʊk/"
    description:
      en: "Reading material."
      ja: "読み物。"
      zh: "閱讀材料。"
    sentence:
      en: "I read a good book before bed."
      ja: "寝る前に良い本を読みます。"
      zh: "我睡前讀一本好書。"

  - id: game
    word:
      en: Game
      ja: ゲーム
      zh: 遊戲
    reading: "GAYM"
    phonetic: "/ɡeɪm/"
    description:
      en: "Video game, board game."
      ja: "ビデオゲーム、ボードゲーム。"
      zh: "電子遊戲、桌遊。"
    sentence:
      en: "I play video games for fun."
      ja: "楽しみにビデオゲームをします。"
      zh: "我玩電子遊戲來娛樂。"

  - id: sport
    word:
      en: Sport
      ja: スポーツ
      zh: 運動
    reading: "SPORT"
    phonetic: "/spɔːrt/"
    description:
      en: "Physical exercise game."
      ja: "体を動かす競技。"
      zh: "身體運動的比賽。"
    sentence:
      en: "My favorite sport is basketball."
      ja: "私の好きなスポーツはバスケットボールです。"
      zh: "我最喜歡的運動是籃球。"

  - id: park
    word:
      en: Park
      ja: 公園
      zh: 公園
    reading: "PARK"
    phonetic: "/pɑːrk/"
    description:
      en: "Green place outside."
      ja: "外にある緑の場所。"
      zh: "戶外有草木的地方。"
    sentence:
      en: "Let's go to the park to run."
      ja: "公園に走りに行きましょう。"
      zh: "我們去公園跑步吧。"

  - id: hobby
    word:
      en: Hobby
      ja: 趣味
      zh: 嗜好
    reading: "HOB-ee"
    phonetic: "/ˈhɑːbi/"
    description:
      en: "Activity you like."
      ja: "好きな活動。"
      zh: "你喜歡的活動。"
    sentence:
      en: "My favorite hobby is cooking."
      ja: "私の好きな趣味は料理です。"
      zh: "我最喜歡的嗜好是烹飪。"

  # Day 2: Core Verbs (Doing things)
  - id: play
    word:
      en: Play
      ja: 遊ぶ
      zh: 玩
    reading: "PLAY"
    phonetic: "/pleɪ/"
    description:
      en: "Do a sport or game."
      ja: "スポーツやゲームをする。"
      zh: "做運動或玩遊戲。"
    sentence:
      en: "We play soccer on Saturdays."
      ja: "土曜日にサッカーをします。"
      zh: "我們星期六踢足球。"

  - id: watch
    word:
      en: Watch
      ja: 見る
      zh: 觀看
    reading: "WOCH"
    phonetic: "/wɑːtʃ/"
    description:
      en: "Look at a screen/show."
      ja: "画面やショーを見る。"
      zh: "看螢幕或表演。"
    sentence:
      en: "I usually watch a movie with my friends."
      ja: "普段は友達と映画を見ます。"
      zh: "我通常和朋友一起看電影。"

  - id: listen
    word:
      en: Listen
      ja: 聴く
      zh: 聽
    reading: "LIS-en"
    phonetic: "/ˈlɪsən/"
    description:
      en: "Hear music."
      ja: "音楽を聴く。"
      zh: "聽音樂。"
    sentence:
      en: "I listen to loud music while I clean."
      ja: "掃除をしながら大きな音楽を聴きます。"
      zh: "我打掃時聽大聲的音樂。"

  - id: read
    word:
      en: Read
      ja: 読む
      zh: 閱讀
    reading: "REED"
    phonetic: "/riːd/"
    description:
      en: "Look at words."
      ja: "文字を見る。"
      zh: "看文字。"
    sentence:
      en: "I prefer reading books."
      ja: "私は本を読むのが好きです。"
      zh: "我比較喜歡看書。"

  - id: run
    word:
      en: Run
      ja: 走る
      zh: 跑步
    reading: "RUHN"
    phonetic: "/rʌn/"
    description:
      en: "Move fast on feet."
      ja: "足で速く動く。"
      zh: "用腳快速移動。"
    sentence:
      en: "On Saturday morning, I go to the park to run."
      ja: "土曜日の朝、公園に走りに行きます。"
      zh: "星期六早上，我去公園跑步。"

  - id: swim
    word:
      en: Swim
      ja: 泳ぐ
      zh: 游泳
    reading: "SWIM"
    phonetic: "/swɪm/"
    description:
      en: "Move in water."
      ja: "水の中で動く。"
      zh: "在水中移動。"
    sentence:
      en: "I like to swim in the summer."
      ja: "夏に泳ぐのが好きです。"
      zh: "我喜歡在夏天游泳。"

  - id: relax
    word:
      en: Relax
      ja: リラックスする
      zh: 放鬆
    reading: "ri-LAKS"
    phonetic: "/rɪˈlæks/"
    description:
      en: "Rest."
      ja: "休む。"
      zh: "休息。"
    sentence:
      en: "I want to relax this weekend."
      ja: "今週末はリラックスしたいです。"
      zh: "這個週末我想放鬆。"

chat:
  conversations:
    - id: scenario-1-weekend-story
      title:
        en: "My Weekend"
        ja: "私の週末"
        zh: "我的週末"
      messages:
        - role: partner
          text:
            en: "What do you do on weekends?"
            ja: "週末は何をしますか？"
            zh: "你週末做什麼？"
        - role: user
          text:
            en: "On weekends, I have free time."
            ja: "週末は自由な時間があります。"
            zh: "週末我有空閒時間。"
        - role: partner
          text:
            en: "What do you do on Saturday morning?"
            ja: "土曜日の朝は何をしますか？"
            zh: "星期六早上你做什麼？"
        - role: user
          text:
            en: "On Saturday morning, I go to the park to run. It is good exercise."
            ja: "土曜日の朝、公園に走りに行きます。いい運動です。"
            zh: "星期六早上，我去公園跑步。這是很好的運動。"
        - role: partner
          text:
            en: "And in the afternoon?"
            ja: "午後はどうですか？"
            zh: "下午呢？"
        - role: user
          text:
            en: "In the afternoon, I relax at home. I listen to loud music while I clean."
            ja: "午後は家でリラックスします。掃除をしながら大きな音楽を聴きます。"
            zh: "下午我在家放鬆。我打掃時聽大聲的音樂。"
        - role: partner
          text:
            en: "What about Sunday?"
            ja: "日曜日はどうですか？"
            zh: "星期天呢？"
        - role: user
          text:
            en: "On Sunday, I usually watch a movie with my friends. We eat popcorn and laugh."
            ja: "日曜日は普段、友達と映画を見ます。ポップコーンを食べて笑います。"
            zh: "星期天，我通常和朋友一起看電影。我們吃爆米花和大笑。"

    - id: scenario-2-hobbies-talk
      title:
        en: "Talking About Hobbies"
        ja: "趣味について話す"
        zh: "談論嗜好"
      messages:
        - role: partner
          text:
            en: "Do you like sports?"
            ja: "スポーツは好きですか？"
            zh: "你喜歡運動嗎？"
        - role: user
          text:
            en: "Not really. I prefer reading books."
            ja: "あまり。本を読む方が好きです。"
            zh: "不太喜歡。我比較喜歡看書。"
        - role: partner
          text:
            en: "I love soccer. I play every week."
            ja: "私はサッカーが大好きです。毎週やります。"
            zh: "我喜歡足球。我每週都踢。"
        - role: user
          text:
            en: "That is good. I like to swim in the summer."
            ja: "いいですね。私は夏に泳ぐのが好きです。"
            zh: "很好。我喜歡在夏天游泳。"
        - role: partner
          text:
            en: "We should go to the pool together."
            ja: "一緒にプールに行きましょう。"
            zh: "我們應該一起去游泳池。"
        - role: user
          text:
            en: "Yes, let's do that."
            ja: "はい、そうしましょう。"
            zh: "好，我們這樣做吧。"
        - role: partner
          text:
            en: "What is your favorite movie?"
            ja: "好きな映画は何ですか？"
            zh: "你最喜歡的電影是什麼？"
        - role: user
          text:
            en: "My favorite movie is Star Wars."
            ja: "私の好きな映画はスターウォーズです。"
            zh: "我最喜歡的電影是星際大戰。"

    - id: scenario-3-questions-answers
      title:
        en: "Hobby Questions"
        ja: "趣味の質問"
        zh: "嗜好問答"
      messages:
        - role: partner
          text:
            en: "What is your hobby?"
            ja: "趣味は何ですか？"
            zh: "你的嗜好是什麼？"
        - role: user
          text:
            en: "I like painting."
            ja: "絵を描くのが好きです。"
            zh: "我喜歡畫畫。"
        - role: partner
          text:
            en: "Do you play sports?"
            ja: "スポーツをしますか？"
            zh: "你做運動嗎？"
        - role: user
          text:
            en: "Yes, I play tennis."
            ja: "はい、テニスをします。"
            zh: "是的，我打網球。"
        - role: partner
          text:
            en: "Do you want to watch a movie?"
            ja: "映画を見ませんか？"
            zh: "你想看電影嗎？"
        - role: user
          text:
            en: "Sure, I love movies."
            ja: "もちろん、映画が大好きです。"
            zh: "當然，我喜歡電影。"
        - role: partner
          text:
            en: "What do you do for fun?"
            ja: "楽しみに何をしますか？"
            zh: "你做什麼來娛樂？"
        - role: user
          text:
            en: "I play video games."
            ja: "ビデオゲームをします。"
            zh: "我玩電子遊戲。"
        - role: partner
          text:
            en: "What do you like to do?"
            ja: "何をするのが好きですか？"
            zh: "你喜歡做什麼？"
        - role: user
          text:
            en: "I like to dance and sing."
            ja: "踊ったり歌ったりするのが好きです。"
            zh: "我喜歡跳舞和唱歌。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,Nt=`# Chapter: Week 3 - Home & Living
meta:
  id: home-and-living
  title:
    en: "Home & Living"
    ja: "家と生活"
    zh: "家與居住"
  description:
    en: "Describing where you live."
    ja: "自分の住んでいる場所を説明しましょう。"
    zh: "學習描述你住的地方。"
  icon: "🏠"
  order: 3
  level: beginner

words:
  # Day 1: Core Nouns (Objects/Rooms)
  - id: kitchen
    word:
      en: Kitchen
      ja: キッチン
      zh: 廚房
    reading: "KICH-en"
    phonetic: "/ˈkɪtʃɪn/"
    description:
      en: "Room for cooking."
      ja: "料理をする部屋。"
      zh: "做飯的房間。"
    sentence:
      en: "I cook dinner in the kitchen."
      ja: "私はキッチンで夕食を作ります。"
      zh: "我在廚房做晚餐。"

  - id: bedroom
    word:
      en: Bedroom
      ja: 寝室
      zh: 臥室
    reading: "BED-room"
    phonetic: "/ˈbedruːm/"
    description:
      en: "Room for sleeping."
      ja: "寝るための部屋。"
      zh: "睡覺的房間。"
    sentence:
      en: "I sleep in the bedroom."
      ja: "私は寝室で寝ます。"
      zh: "我在臥室睡覺。"

  - id: bathroom
    word:
      en: Bathroom
      ja: バスルーム
      zh: 浴室
    reading: "BATH-room"
    phonetic: "/ˈbæθruːm/"
    description:
      en: "Room for shower/toilet."
      ja: "シャワーやトイレのある部屋。"
      zh: "淋浴和上廁所的房間。"
    sentence:
      en: "I need to clean the bathroom."
      ja: "バスルームを掃除する必要があります。"
      zh: "我需要打掃浴室。"

  - id: living-room
    word:
      en: Living Room
      ja: リビングルーム
      zh: 客廳
    reading: "LIV-ing room"
    phonetic: "/ˈlɪvɪŋ ruːm/"
    description:
      en: "Room for relaxing."
      ja: "くつろぐための部屋。"
      zh: "放鬆的房間。"
    sentence:
      en: "We watch TV in the living room."
      ja: "私たちはリビングルームでテレビを見ます。"
      zh: "我們在客廳看電視。"

  - id: sofa
    word:
      en: Sofa
      ja: ソファ
      zh: 沙發
    reading: "SOH-fuh"
    phonetic: "/ˈsoʊfə/"
    description:
      en: "Soft seat for multiple people."
      ja: "複数人が座れる柔らかい椅子。"
      zh: "可以坐多人的軟座椅。"
    sentence:
      en: "The sofa is very soft."
      ja: "ソファはとても柔らかいです。"
      zh: "沙發很軟。"

  - id: bed
    word:
      en: Bed
      ja: ベッド
      zh: 床
    reading: "BED"
    phonetic: "/bed/"
    description:
      en: "Furniture for sleeping."
      ja: "寝るための家具。"
      zh: "睡覺用的家具。"
    sentence:
      en: "I sleep in my comfortable bed."
      ja: "私は快適なベッドで寝ます。"
      zh: "我睡在舒適的床上。"

  - id: door
    word:
      en: Door
      ja: ドア
      zh: 門
    reading: "DOR"
    phonetic: "/dɔːr/"
    description:
      en: "Entrance."
      ja: "入り口。"
      zh: "入口。"
    sentence:
      en: "Please close the door."
      ja: "ドアを閉めてください。"
      zh: "請關門。"

  - id: window
    word:
      en: Window
      ja: 窓
      zh: 窗戶
    reading: "WIN-doh"
    phonetic: "/ˈwɪndoʊ/"
    description:
      en: "Glass to see outside."
      ja: "外を見るためのガラス。"
      zh: "可以看到外面的玻璃。"
    sentence:
      en: "The living room has a bright window."
      ja: "リビングルームには明るい窓があります。"
      zh: "客廳有一扇明亮的窗戶。"

  # Day 2: Core Verbs (Actions at Home)
  - id: live
    word:
      en: Live
      ja: 住む
      zh: 住
    reading: "LIV"
    phonetic: "/lɪv/"
    description:
      en: "Reside/stay long term."
      ja: "長期間住む。"
      zh: "長期居住。"
    sentence:
      en: "I live in an apartment."
      ja: "私はアパートに住んでいます。"
      zh: "我住在公寓裡。"

  - id: clean
    word:
      en: Clean
      ja: 掃除する
      zh: 打掃
    reading: "KLEEN"
    phonetic: "/kliːn/"
    description:
      en: "Make things tidy/wash."
      ja: "整理する、洗う。"
      zh: "整理乾淨、清洗。"
    sentence:
      en: "Every Saturday, I clean the whole house."
      ja: "毎週土曜日、家全体を掃除します。"
      zh: "每個星期六，我打掃整個房子。"

  - id: sleep
    word:
      en: Sleep
      ja: 寝る
      zh: 睡覺
    reading: "SLEEP"
    phonetic: "/sliːp/"
    description:
      en: "Rest at night."
      ja: "夜に休む。"
      zh: "晚上休息。"
    sentence:
      en: "I sleep in the bedroom."
      ja: "私は寝室で寝ます。"
      zh: "我在臥室睡覺。"

  - id: watch
    word:
      en: Watch
      ja: 見る
      zh: 看
    reading: "WOCH"
    phonetic: "/wɑːtʃ/"
    description:
      en: "Look at TV."
      ja: "テレビを見る。"
      zh: "看電視。"
    sentence:
      en: "We watch TV in the living room."
      ja: "私たちはリビングルームでテレビを見ます。"
      zh: "我們在客廳看電視。"

  - id: open
    word:
      en: Open
      ja: 開ける
      zh: 打開
    reading: "OH-pen"
    phonetic: "/ˈoʊpən/"
    description:
      en: "Unlock door/window."
      ja: "ドアや窓を開ける。"
      zh: "打開門或窗戶。"
    sentence:
      en: "Please open the window."
      ja: "窓を開けてください。"
      zh: "請打開窗戶。"

  - id: close
    word:
      en: Close
      ja: 閉める
      zh: 關閉
    reading: "KLOHZ"
    phonetic: "/kloʊz/"
    description:
      en: "Shut door/window."
      ja: "ドアや窓を閉める。"
      zh: "關上門或窗戶。"
    sentence:
      en: "Please close the door."
      ja: "ドアを閉めてください。"
      zh: "請關門。"

  - id: sit
    word:
      en: Sit
      ja: 座る
      zh: 坐
    reading: "SIT"
    phonetic: "/sɪt/"
    description:
      en: "Rest on a chair/sofa."
      ja: "椅子やソファに座る。"
      zh: "坐在椅子或沙發上。"
    sentence:
      en: "Please sit on the sofa."
      ja: "ソファに座ってください。"
      zh: "請坐在沙發上。"

chat:
  conversations:
    - id: scenario-1-my-house
      title:
        en: "My House"
        ja: "私の家"
        zh: "我的家"
      messages:
        - role: partner
          text:
            en: "Where do you live?"
            ja: "どこに住んでいますか？"
            zh: "你住在哪裡？"
        - role: user
          text:
            en: "I live in a small house."
            ja: "私は小さな家に住んでいます。"
            zh: "我住在一間小房子裡。"
        - role: partner
          text:
            en: "How many rooms does it have?"
            ja: "いくつ部屋がありますか？"
            zh: "有幾個房間？"
        - role: user
          text:
            en: "It has two bedrooms and one bathroom."
            ja: "寝室が2つとバスルームが1つあります。"
            zh: "有兩間臥室和一間浴室。"
        - role: partner
          text:
            en: "What is your favorite room?"
            ja: "一番好きな部屋はどこですか？"
            zh: "你最喜歡哪個房間？"
        - role: user
          text:
            en: "My favorite room is the living room."
            ja: "一番好きな部屋はリビングルームです。"
            zh: "我最喜歡客廳。"
        - role: partner
          text:
            en: "Why do you like it?"
            ja: "なぜ好きですか？"
            zh: "為什麼喜歡？"
        - role: user
          text:
            en: "It has a big sofa and a bright window."
            ja: "大きなソファと明るい窓があります。"
            zh: "有一張大沙發和一扇明亮的窗戶。"
        - role: partner
          text:
            en: "Do you clean your house often?"
            ja: "よく家を掃除しますか？"
            zh: "你常打掃房子嗎？"
        - role: user
          text:
            en: "Yes, every Saturday I clean the whole house."
            ja: "はい、毎週土曜日に家全体を掃除します。"
            zh: "是的，每個星期六我打掃整個房子。"

    - id: scenario-2-welcome-home
      title:
        en: "Welcome to My Home"
        ja: "我が家へようこそ"
        zh: "歡迎來我家"
      messages:
        - role: partner
          text:
            en: "Welcome! Please come in."
            ja: "ようこそ！どうぞお入りください。"
            zh: "歡迎！請進。"
        - role: user
          text:
            en: "Thank you for inviting me."
            ja: "招待してくれてありがとうございます。"
            zh: "謝謝你邀請我。"
        - role: partner
          text:
            en: "Your house is beautiful. The living room is so big!"
            ja: "あなたの家は素敵ですね。リビングルームがとても広い！"
            zh: "你的房子很漂亮。客廳好大！"
        - role: user
          text:
            en: "Thank you. Please sit on the sofa."
            ja: "ありがとうございます。ソファにどうぞ座ってください。"
            zh: "謝謝。請坐在沙發上。"
        - role: partner
          text:
            en: "Where is the bathroom?"
            ja: "バスルームはどこですか？"
            zh: "浴室在哪裡？"
        - role: user
          text:
            en: "It is next to the kitchen, on the left."
            ja: "キッチンの隣、左側にあります。"
            zh: "在廚房旁邊，左邊。"
        - role: partner
          text:
            en: "Is the window open? It feels nice."
            ja: "窓は開いていますか？気持ちいいですね。"
            zh: "窗戶開著嗎？感覺很舒服。"
        - role: user
          text:
            en: "Yes, I like fresh air. Should I close it?"
            ja: "はい、新鮮な空気が好きです。閉めましょうか？"
            zh: "是的，我喜歡新鮮空氣。需要關上嗎？"

    - id: scenario-3-questions-answers
      title:
        en: "Home Questions"
        ja: "家についての質問"
        zh: "關於家的問答"
      messages:
        - role: partner
          text:
            en: "Where do you live?"
            ja: "どこに住んでいますか？"
            zh: "你住在哪裡？"
        - role: user
          text:
            en: "I live in a house."
            ja: "私は家に住んでいます。"
            zh: "我住在房子裡。"
        - role: partner
          text:
            en: "Is the window open?"
            ja: "窓は開いていますか？"
            zh: "窗戶開著嗎？"
        - role: user
          text:
            en: "No, the window is closed."
            ja: "いいえ、窓は閉まっています。"
            zh: "不，窗戶是關著的。"
        - role: partner
          text:
            en: "Where are you now?"
            ja: "今どこにいますか？"
            zh: "你現在在哪裡？"
        - role: user
          text:
            en: "I am in the kitchen."
            ja: "キッチンにいます。"
            zh: "我在廚房。"
        - role: partner
          text:
            en: "Do you like your house?"
            ja: "あなたの家は好きですか？"
            zh: "你喜歡你的房子嗎？"
        - role: user
          text:
            en: "Yes, it is very comfortable."
            ja: "はい、とても快適です。"
            zh: "是的，非常舒適。"
        - role: partner
          text:
            en: "Please open the window."
            ja: "窓を開けてください。"
            zh: "請打開窗戶。"
        - role: user
          text:
            en: "Okay, I will open it now."
            ja: "わかりました、今開けます。"
            zh: "好的，我現在打開。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,Pt=`# Chapter: Week 1 - The Morning Routine
meta:
  id: morning-routine
  title:
    en: "The Morning Routine"
    ja: "朝のルーティン"
    zh: "早晨日常"
  description:
    en: "Things you do every day when you start the day."
    ja: "毎日朝にすることを学びましょう。"
    zh: "學習每天早上起床後做的事情。"
  icon: "☀️"
  order: 1
  level: beginner

words:
  # Day 1: Core Nouns (Things)
  - id: alarm
    word:
      en: Alarm
      ja: 目覚まし時計
      zh: 鬧鐘
    reading: "uh-LARM"
    phonetic: "/əˈlɑːrm/"
    description:
      en: "Clock that makes noise to wake you."
      ja: "あなたを起こすために音を鳴らす時計。"
      zh: "發出聲音叫醒你的時鐘。"
    sentence:
      en: "The alarm rings at 7 AM."
      ja: "目覚まし時計は朝7時に鳴ります。"
      zh: "鬧鐘在早上7點響。"

  - id: coffee
    word:
      en: Coffee
      ja: コーヒー
      zh: 咖啡
    reading: "KAW-fee"
    phonetic: "/ˈkɔːfi/"
    description:
      en: "Hot black drink."
      ja: "熱い黒い飲み物。"
      zh: "熱的黑色飲料。"
    sentence:
      en: "I drink a cup of coffee."
      ja: "私はコーヒーを一杯飲みます。"
      zh: "我喝一杯咖啡。"

  - id: breakfast
    word:
      en: Breakfast
      ja: 朝食
      zh: 早餐
    reading: "BREK-fuhst"
    phonetic: "/ˈbrekfəst/"
    description:
      en: "First meal of the day."
      ja: "一日の最初の食事。"
      zh: "一天的第一餐。"
    sentence:
      en: "I eat breakfast every morning."
      ja: "私は毎朝朝食を食べます。"
      zh: "我每天早上吃早餐。"

  - id: shower
    word:
      en: Shower
      ja: シャワー
      zh: 淋浴
    reading: "SHOW-er"
    phonetic: "/ˈʃaʊər/"
    description:
      en: "Washing body with water."
      ja: "水で体を洗うこと。"
      zh: "用水沖洗身體。"
    sentence:
      en: "I take a hot shower to feel fresh."
      ja: "私は爽快になるために熱いシャワーを浴びます。"
      zh: "我洗個熱水澡讓自己清爽。"

  - id: clothes
    word:
      en: Clothes
      ja: 服
      zh: 衣服
    reading: "KLOHZ"
    phonetic: "/kloʊðz/"
    description:
      en: "What you wear."
      ja: "着るもの。"
      zh: "你穿的東西。"
    sentence:
      en: "I put on my clothes."
      ja: "私は服を着ます。"
      zh: "我穿上衣服。"

  - id: bus
    word:
      en: Bus
      ja: バス
      zh: 公車
    reading: "BUHS"
    phonetic: "/bʌs/"
    description:
      en: "Public transport vehicle."
      ja: "公共交通機関の車両。"
      zh: "公共交通工具。"
    sentence:
      en: "I go to work by bus."
      ja: "私はバスで仕事に行きます。"
      zh: "我搭公車去上班。"

  - id: train
    word:
      en: Train
      ja: 電車
      zh: 火車
    reading: "TRAYN"
    phonetic: "/treɪn/"
    description:
      en: "Public transport on rails."
      ja: "線路を走る公共交通機関。"
      zh: "在軌道上行駛的交通工具。"
    sentence:
      en: "I take the train to my office."
      ja: "私は電車でオフィスに行きます。"
      zh: "我搭火車去辦公室。"

  - id: office
    word:
      en: Office
      ja: オフィス
      zh: 辦公室
    reading: "AW-fis"
    phonetic: "/ˈɔːfɪs/"
    description:
      en: "Place of work."
      ja: "仕事をする場所。"
      zh: "工作的地方。"
    sentence:
      en: "I arrive at the office at 9 AM."
      ja: "私は朝9時にオフィスに着きます。"
      zh: "我早上9點到達辦公室。"

  # Day 2: Core Verbs (Actions)
  - id: wake-up
    word:
      en: Wake up
      ja: 起きる
      zh: 醒來
    reading: "WAYK uhp"
    phonetic: "/weɪk ʌp/"
    description:
      en: "Stop sleeping."
      ja: "眠りから覚める。"
      zh: "停止睡眠。"
    sentence:
      en: "I wake up at 7 AM."
      ja: "私は朝7時に起きます。"
      zh: "我早上7點醒來。"

  - id: get-up
    word:
      en: Get up
      ja: 起き上がる
      zh: 起床
    reading: "GET uhp"
    phonetic: "/ɡet ʌp/"
    description:
      en: "Leave the bed."
      ja: "ベッドから出る。"
      zh: "離開床鋪。"
    sentence:
      en: "I get up at 7:30."
      ja: "私は7時半に起き上がります。"
      zh: "我7點半起床。"

  - id: brush
    word:
      en: Brush
      ja: 磨く
      zh: 刷
    reading: "BRUHSH"
    phonetic: "/brʌʃ/"
    description:
      en: "Clean teeth."
      ja: "歯を磨く。"
      zh: "刷牙。"
    sentence:
      en: "I brush my teeth in the bathroom."
      ja: "私は浴室で歯を磨きます。"
      zh: "我在浴室刷牙。"

  - id: drink
    word:
      en: Drink
      ja: 飲む
      zh: 喝
    reading: "DRINGK"
    phonetic: "/drɪŋk/"
    description:
      en: "Swallow liquid."
      ja: "液体を飲み込む。"
      zh: "吞嚥液體。"
    sentence:
      en: "I drink tea every morning."
      ja: "私は毎朝お茶を飲みます。"
      zh: "我每天早上喝茶。"

  - id: eat
    word:
      en: Eat
      ja: 食べる
      zh: 吃
    reading: "EET"
    phonetic: "/iːt/"
    description:
      en: "Consume food."
      ja: "食べ物を食べる。"
      zh: "吃食物。"
    sentence:
      en: "I eat toast and eggs."
      ja: "私はトーストと卵を食べます。"
      zh: "我吃吐司和蛋。"

  - id: go
    word:
      en: Go
      ja: 行く
      zh: 去
    reading: "GOH"
    phonetic: "/ɡoʊ/"
    description:
      en: "Move to a place."
      ja: "場所に移動する。"
      zh: "移動到某個地方。"
    sentence:
      en: "I go to work at 8 AM."
      ja: "私は朝8時に仕事に行きます。"
      zh: "我早上8點去上班。"

  - id: work
    word:
      en: Work
      ja: 働く
      zh: 工作
    reading: "WURK"
    phonetic: "/wɜːrk/"
    description:
      en: "Do your job."
      ja: "仕事をする。"
      zh: "做你的工作。"
    sentence:
      en: "I start to work at 9 AM."
      ja: "私は朝9時に仕事を始めます。"
      zh: "我早上9點開始工作。"

chat:
  conversations:
    - id: scenario-1-morning-story
      title:
        en: "My Morning Routine"
        ja: "私の朝のルーティン"
        zh: "我的早晨日常"
      messages:
        - role: partner
          text:
            en: "Good morning! What time do you wake up?"
            ja: "おはようございます！何時に起きますか？"
            zh: "早安！你幾點起床？"
        - role: user
          text:
            en: "I wake up at 7 AM. The alarm rings every day."
            ja: "朝7時に起きます。毎日目覚ましが鳴ります。"
            zh: "我早上7點起床。鬧鐘每天都會響。"
        - role: partner
          text:
            en: "What do you do first in the morning?"
            ja: "朝一番に何をしますか？"
            zh: "你早上第一件事做什麼？"
        - role: user
          text:
            en: "First, I take a hot shower to feel fresh."
            ja: "まず、爽快になるために熱いシャワーを浴びます。"
            zh: "首先，我洗個熱水澡讓自己清爽。"
        - role: partner
          text:
            en: "Do you eat breakfast?"
            ja: "朝食を食べますか？"
            zh: "你吃早餐嗎？"
        - role: user
          text:
            en: "Yes, I eat toast and eggs. I also drink coffee."
            ja: "はい、トーストと卵を食べます。コーヒーも飲みます。"
            zh: "是的，我吃吐司和蛋。我也喝咖啡。"
        - role: partner
          text:
            en: "How do you go to work?"
            ja: "どうやって仕事に行きますか？"
            zh: "你怎麼去上班？"
        - role: user
          text:
            en: "I go by train. I arrive at the office at 9 AM."
            ja: "電車で行きます。朝9時にオフィスに着きます。"
            zh: "我搭火車去。我早上9點到達辦公室。"

    - id: scenario-2-questions-answers
      title:
        en: "Morning Questions"
        ja: "朝の質問"
        zh: "早晨問答"
      messages:
        - role: partner
          text:
            en: "What time do you get up?"
            ja: "何時に起き上がりますか？"
            zh: "你幾點起床？"
        - role: user
          text:
            en: "I get up at 7:30."
            ja: "7時半に起き上がります。"
            zh: "我7點半起床。"
        - role: partner
          text:
            en: "Do you drink coffee?"
            ja: "コーヒーを飲みますか？"
            zh: "你喝咖啡嗎？"
        - role: user
          text:
            en: "No, I drink tea."
            ja: "いいえ、お茶を飲みます。"
            zh: "不，我喝茶。"
        - role: partner
          text:
            en: "Do you brush your teeth before breakfast?"
            ja: "朝食前に歯を磨きますか？"
            zh: "你在早餐前刷牙嗎？"
        - role: user
          text:
            en: "Yes, I brush my teeth in the bathroom."
            ja: "はい、浴室で歯を磨きます。"
            zh: "是的，我在浴室刷牙。"
        - role: partner
          text:
            en: "What clothes do you wear to work?"
            ja: "仕事に何の服を着ますか？"
            zh: "你穿什麼衣服去上班？"
        - role: user
          text:
            en: "I put on a shirt and pants."
            ja: "シャツとズボンを着ます。"
            zh: "我穿襯衫和褲子。"

    - id: scenario-3-tired-morning
      title:
        en: "Tired Morning"
        ja: "疲れた朝"
        zh: "疲憊的早晨"
      messages:
        - role: partner
          text:
            en: "Good morning! You look tired."
            ja: "おはよう！疲れているように見えるね。"
            zh: "早安！你看起來很累。"
        - role: user
          text:
            en: "Yes, I woke up very early today."
            ja: "はい、今日はとても早く起きました。"
            zh: "是的，我今天很早就醒了。"
        - role: partner
          text:
            en: "Did you have coffee?"
            ja: "コーヒーは飲みましたか？"
            zh: "你喝咖啡了嗎？"
        - role: user
          text:
            en: "Not yet. I need a cup right now."
            ja: "まだです。今すぐ一杯必要です。"
            zh: "還沒。我現在需要一杯。"
        - role: partner
          text:
            en: "Let's go to the cafe before we work."
            ja: "仕事の前にカフェに行こう。"
            zh: "我們上班前去咖啡廳吧。"
        - role: user
          text:
            en: "Good idea. I also want some breakfast."
            ja: "いいね。朝食も食べたいです。"
            zh: "好主意。我也想吃點早餐。"
        - role: partner
          text:
            en: "Every morning is the same for you?"
            ja: "毎朝同じですか？"
            zh: "你每天早上都一樣嗎？"
        - role: user
          text:
            en: "Yes, it is a busy morning every day."
            ja: "はい、毎日忙しい朝です。"
            zh: "是的，每天都是忙碌的早晨。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,Ot=`# Chapter: Week 6 - Time & Schedules
meta:
  id: time-and-schedules
  title:
    en: "Time & Schedules"
    ja: "時間とスケジュール"
    zh: "時間與行程"
  description:
    en: "Making plans and understanding the clock."
    ja: "予定を立てて、時計を理解しましょう。"
    zh: "學習安排計畫和看懂時鐘。"
  icon: "⏰"
  order: 6
  level: beginner

words:
  # Day 1: Core Nouns (Time Units)
  - id: hour
    word:
      en: Hour
      ja: 時間
      zh: 小時
    reading: "OW-er"
    phonetic: "/ˈaʊər/"
    description:
      en: "60 minutes."
      ja: "60分。"
      zh: "60分鐘。"
    sentence:
      en: "We talk for two hours."
      ja: "私たちは2時間話します。"
      zh: "我們聊了兩個小時。"

  - id: minute
    word:
      en: Minute
      ja: 分
      zh: 分鐘
    reading: "MIN-it"
    phonetic: "/ˈmɪnɪt/"
    description:
      en: "Small time unit."
      ja: "小さな時間の単位。"
      zh: "小的時間單位。"
    sentence:
      en: "We start in 10 minutes."
      ja: "10分後に始めます。"
      zh: "我們10分鐘後開始。"

  - id: morning
    word:
      en: Morning
      ja: 朝
      zh: 早上
    reading: "MOR-ning"
    phonetic: "/ˈmɔːrnɪŋ/"
    description:
      en: "Start of day."
      ja: "一日の始まり。"
      zh: "一天的開始。"
    sentence:
      en: "On Monday morning, I start work at 9."
      ja: "月曜日の朝、9時に仕事を始めます。"
      zh: "星期一早上，我9點開始工作。"

  - id: afternoon
    word:
      en: Afternoon
      ja: 午後
      zh: 下午
    reading: "af-ter-NOON"
    phonetic: "/ˌæftərˈnuːn/"
    description:
      en: "Middle of day."
      ja: "一日の真ん中。"
      zh: "一天的中間。"
    sentence:
      en: "I have a meeting in the afternoon."
      ja: "午後に会議があります。"
      zh: "我下午有個會議。"

  - id: evening
    word:
      en: Evening
      ja: 夕方
      zh: 傍晚
    reading: "EEV-ning"
    phonetic: "/ˈiːvnɪŋ/"
    description:
      en: "End of day."
      ja: "一日の終わり。"
      zh: "一天的結束。"
    sentence:
      en: "I finish work in the evening."
      ja: "夕方に仕事を終えます。"
      zh: "我傍晚下班。"

  - id: week
    word:
      en: Week
      ja: 週
      zh: 週
    reading: "WEEK"
    phonetic: "/wiːk/"
    description:
      en: "Monday to Sunday."
      ja: "月曜日から日曜日まで。"
      zh: "星期一到星期日。"
    sentence:
      en: "I have a busy week."
      ja: "忙しい週です。"
      zh: "我這週很忙。"

  - id: weekend
    word:
      en: Weekend
      ja: 週末
      zh: 週末
    reading: "WEEK-end"
    phonetic: "/ˈwiːkend/"
    description:
      en: "Saturday and Sunday."
      ja: "土曜日と日曜日。"
      zh: "星期六和星期日。"
    sentence:
      en: "On the weekend, I sleep late."
      ja: "週末は遅くまで寝ます。"
      zh: "週末我睡得很晚。"

  # Day 2: Core Verbs (Time Actions)
  - id: start
    word:
      en: Start
      ja: 始める
      zh: 開始
    reading: "START"
    phonetic: "/stɑːrt/"
    description:
      en: "Begin."
      ja: "始まる。"
      zh: "開始。"
    sentence:
      en: "The movie starts at 8 PM."
      ja: "映画は夜8時に始まります。"
      zh: "電影晚上8點開始。"

  - id: finish
    word:
      en: Finish
      ja: 終わる
      zh: 結束
    reading: "FIN-ish"
    phonetic: "/ˈfɪnɪʃ/"
    description:
      en: "Stop."
      ja: "終わる。"
      zh: "停止。"
    sentence:
      en: "I finish at 6 PM."
      ja: "夕方6時に終わります。"
      zh: "我下午6點結束。"

  - id: meet
    word:
      en: Meet
      ja: 会う
      zh: 見面
    reading: "MEET"
    phonetic: "/miːt/"
    description:
      en: "See a person."
      ja: "人に会う。"
      zh: "見某個人。"
    sentence:
      en: "Let's meet at the cafe."
      ja: "カフェで会いましょう。"
      zh: "我們在咖啡廳見面吧。"

  - id: wait
    word:
      en: Wait
      ja: 待つ
      zh: 等待
    reading: "WAYT"
    phonetic: "/weɪt/"
    description:
      en: "Stay until something happens."
      ja: "何かが起きるまでいる。"
      zh: "停留直到某事發生。"
    sentence:
      en: "I have to wait for the bus."
      ja: "バスを待たなければなりません。"
      zh: "我必須等公車。"

  - id: arrive
    word:
      en: Arrive
      ja: 到着する
      zh: 到達
    reading: "uh-RYV"
    phonetic: "/əˈraɪv/"
    description:
      en: "Come to a place."
      ja: "場所に来る。"
      zh: "來到某個地方。"
    sentence:
      en: "She arrives at 10:30."
      ja: "彼女は10時30分に到着します。"
      zh: "她10點30分到達。"

  - id: leave
    word:
      en: Leave
      ja: 出発する
      zh: 離開
    reading: "LEEV"
    phonetic: "/liːv/"
    description:
      en: "Go away."
      ja: "去る。"
      zh: "離開。"
    sentence:
      en: "We are going away for the weekend."
      ja: "週末に出かけます。"
      zh: "我們週末要出門。"

  - id: late
    word:
      en: Late
      ja: 遅い
      zh: 遲到
    reading: "LAYT"
    phonetic: "/leɪt/"
    description:
      en: "After the correct time."
      ja: "正しい時間の後。"
      zh: "在正確時間之後。"
    sentence:
      en: "Don't be late."
      ja: "遅れないでください。"
      zh: "不要遲到。"

chat:
  conversations:
    - id: scenario-1-busy-week
      title:
        en: "My Busy Week"
        ja: "忙しい週"
        zh: "我忙碌的一週"
      messages:
        - role: partner
          text:
            en: "How is your week going?"
            ja: "今週はどうですか？"
            zh: "這週過得怎麼樣？"
        - role: user
          text:
            en: "I have a busy week."
            ja: "忙しい週です。"
            zh: "我這週很忙。"
        - role: partner
          text:
            en: "What time do you start work on Monday?"
            ja: "月曜日は何時に仕事を始めますか？"
            zh: "星期一你幾點開始工作？"
        - role: user
          text:
            en: "On Monday morning, I start work at 9."
            ja: "月曜日の朝、9時に仕事を始めます。"
            zh: "星期一早上，我9點開始工作。"
        - role: partner
          text:
            en: "Do you have any meetings?"
            ja: "会議はありますか？"
            zh: "你有會議嗎？"
        - role: user
          text:
            en: "Yes, I have a meeting in the afternoon. I finish at 6 PM."
            ja: "はい、午後に会議があります。夕方6時に終わります。"
            zh: "是的，我下午有個會議。我下午6點結束。"
        - role: partner
          text:
            en: "What about Friday?"
            ja: "金曜日はどうですか？"
            zh: "星期五呢？"
        - role: user
          text:
            en: "On Friday evening, I meet my friends for dinner. We talk for two hours."
            ja: "金曜日の夕方、友達と夕食を食べます。2時間話します。"
            zh: "星期五晚上，我和朋友吃晚餐。我們聊了兩個小時。"
        - role: partner
          text:
            en: "And on the weekend?"
            ja: "週末はどうですか？"
            zh: "週末呢？"
        - role: user
          text:
            en: "On the weekend, I sleep late."
            ja: "週末は遅くまで寝ます。"
            zh: "週末我睡得很晚。"

    - id: scenario-2-making-plans
      title:
        en: "Making Lunch Plans"
        ja: "ランチの予定を立てる"
        zh: "安排午餐計畫"
      messages:
        - role: partner
          text:
            en: "Do you want to have lunch?"
            ja: "ランチを食べませんか？"
            zh: "你想吃午餐嗎？"
        - role: user
          text:
            en: "Sure. What time?"
            ja: "いいですね。何時ですか？"
            zh: "好啊。幾點？"
        - role: partner
          text:
            en: "Is 12:30 okay?"
            ja: "12時30分でいいですか？"
            zh: "12點30分可以嗎？"
        - role: user
          text:
            en: "No, I am busy then. Can we meet at 1:00?"
            ja: "いいえ、その時間は忙しいです。1時に会えますか？"
            zh: "不行，我那時候在忙。我們可以1點見面嗎？"
        - role: partner
          text:
            en: "That is fine. Where should we meet?"
            ja: "いいですよ。どこで会いましょうか？"
            zh: "可以。我們在哪裡見面？"
        - role: user
          text:
            en: "Let's meet at the cafe."
            ja: "カフェで会いましょう。"
            zh: "我們在咖啡廳見面吧。"
        - role: partner
          text:
            en: "Great! Don't be late!"
            ja: "いいですね！遅れないでね！"
            zh: "太好了！不要遲到！"
        - role: user
          text:
            en: "I will be there on time."
            ja: "時間通りに着きます。"
            zh: "我會準時到。"

    - id: scenario-3-questions-answers
      title:
        en: "Time Questions"
        ja: "時間の質問"
        zh: "時間問答"
      messages:
        - role: partner
          text:
            en: "What time is it?"
            ja: "今何時ですか？"
            zh: "現在幾點？"
        - role: user
          text:
            en: "It is three o'clock."
            ja: "3時です。"
            zh: "3點。"
        - role: partner
          text:
            en: "When do we start?"
            ja: "いつ始めますか？"
            zh: "我們什麼時候開始？"
        - role: user
          text:
            en: "We start in 10 minutes."
            ja: "10分後に始めます。"
            zh: "我們10分鐘後開始。"
        - role: partner
          text:
            en: "Are you busy today?"
            ja: "今日は忙しいですか？"
            zh: "你今天忙嗎？"
        - role: user
          text:
            en: "Yes, I have no time."
            ja: "はい、時間がありません。"
            zh: "是的，我沒有時間。"
        - role: partner
          text:
            en: "Can we meet on Monday?"
            ja: "月曜日に会えますか？"
            zh: "我們星期一可以見面嗎？"
        - role: user
          text:
            en: "Yes, Monday is fine. See you next week."
            ja: "はい、月曜日でいいです。来週会いましょう。"
            zh: "好，星期一可以。下週見。"
        - role: partner
          text:
            en: "See you tomorrow!"
            ja: "また明日！"
            zh: "明天見！"
        - role: user
          text:
            en: "See you tonight!"
            ja: "今夜会いましょう！"
            zh: "今晚見！"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,Ft=`# Chapter: Week 9 - Weather & Seasons
meta:
  id: weather-and-seasons
  title:
    en: "Weather & Seasons"
    ja: "天気と季節"
    zh: "天氣與季節"
  description:
    en: "Describing the outside world and temperature."
    ja: "外の世界と気温を説明しましょう。"
    zh: "學習描述戶外環境和溫度。"
  icon: "🌤️"
  order: 9
  level: beginner

words:
  # Day 1: Core Nouns (Nature)
  - id: sun
    word:
      en: Sun
      ja: 太陽
      zh: 太陽
    reading: "SUHN"
    phonetic: "/sʌn/"
    description:
      en: "Bright star in sky."
      ja: "空にある明るい星。"
      zh: "天空中明亮的星星。"
    sentence:
      en: "The sun is very bright today."
      ja: "今日は太陽がとても明るいです。"
      zh: "今天太陽很亮。"

  - id: rain
    word:
      en: Rain
      ja: 雨
      zh: 雨
    reading: "RAYN"
    phonetic: "/reɪn/"
    description:
      en: "Water falling from sky."
      ja: "空から落ちてくる水。"
      zh: "從天空落下的水。"
    sentence:
      en: "Take your umbrella, it is raining."
      ja: "傘を持って、雨が降っています。"
      zh: "帶上雨傘，正在下雨。"

  - id: snow
    word:
      en: Snow
      ja: 雪
      zh: 雪
    reading: "SNOH"
    phonetic: "/snoʊ/"
    description:
      en: "White ice falling from sky."
      ja: "空から落ちてくる白い氷。"
      zh: "從天空落下的白色冰晶。"
    sentence:
      en: "Look at the white snow on the ground."
      ja: "地面の白い雪を見てください。"
      zh: "看地上的白雪。"

  - id: wind
    word:
      en: Wind
      ja: 風
      zh: 風
    reading: "WIND"
    phonetic: "/wɪnd/"
    description:
      en: "Moving air."
      ja: "動いている空気。"
      zh: "移動的空氣。"
    sentence:
      en: "It is cold and windy outside."
      ja: "外は寒くて風が強いです。"
      zh: "外面又冷又有風。"

  - id: cloud
    word:
      en: Cloud
      ja: 雲
      zh: 雲
    reading: "KLOWD"
    phonetic: "/klaʊd/"
    description:
      en: "White fluff in sky."
      ja: "空にある白いふわふわ。"
      zh: "天空中白色的棉絮。"
    sentence:
      en: "The clouds cover the sky."
      ja: "雲が空を覆っています。"
      zh: "雲遮住了天空。"

  - id: umbrella
    word:
      en: Umbrella
      ja: 傘
      zh: 雨傘
    reading: "uhm-BREL-uh"
    phonetic: "/ʌmˈbrelə/"
    description:
      en: "Tool to stay dry."
      ja: "濡れないための道具。"
      zh: "保持乾燥的工具。"
    sentence:
      en: "I used my umbrella, but my shoes got wet."
      ja: "傘を使いましたが、靴が濡れました。"
      zh: "我用了雨傘，但鞋子還是濕了。"

  - id: temperature
    word:
      en: Temperature
      ja: 温度
      zh: 溫度
    reading: "TEM-per-uh-chur"
    phonetic: "/ˈtemprətʃər/"
    description:
      en: "Hot or Cold degree."
      ja: "暑さや寒さの度合い。"
      zh: "熱或冷的程度。"
    sentence:
      en: "The temperature is high, it is hot."
      ja: "気温が高くて、暑いです。"
      zh: "溫度很高，很熱。"

  # Day 2: Adjectives & Verbs (Conditions)
  - id: hot
    word:
      en: Hot
      ja: 暑い
      zh: 熱
    reading: "HOT"
    phonetic: "/hɑːt/"
    description:
      en: "High temperature, like fire."
      ja: "火のように高い温度。"
      zh: "像火一樣的高溫。"
    sentence:
      en: "It is so hot today!"
      ja: "今日はとても暑いです！"
      zh: "今天好熱！"

  - id: cold
    word:
      en: Cold
      ja: 寒い
      zh: 冷
    reading: "KOHLD"
    phonetic: "/koʊld/"
    description:
      en: "Low temperature, like ice."
      ja: "氷のように低い温度。"
      zh: "像冰一樣的低溫。"
    sentence:
      en: "Yes, you need a coat. It is cold outside."
      ja: "はい、コートが必要です。外は寒いです。"
      zh: "是的，你需要外套。外面很冷。"

  - id: sunny
    word:
      en: Sunny
      ja: 晴れ
      zh: 晴天
    reading: "SUHN-ee"
    phonetic: "/ˈsʌni/"
    description:
      en: "Sun is shining."
      ja: "太陽が輝いている。"
      zh: "太陽正在照耀。"
    sentence:
      en: "I like dry and sunny days."
      ja: "乾燥した晴れた日が好きです。"
      zh: "我喜歡乾燥晴朗的日子。"

  - id: wet
    word:
      en: Wet
      ja: 濡れた
      zh: 濕
    reading: "WET"
    phonetic: "/wet/"
    description:
      en: "Covered in water."
      ja: "水で覆われている。"
      zh: "被水覆蓋。"
    sentence:
      en: "My shoes got wet."
      ja: "靴が濡れました。"
      zh: "我的鞋子濕了。"

  - id: dry
    word:
      en: Dry
      ja: 乾いた
      zh: 乾
    reading: "DRY"
    phonetic: "/draɪ/"
    description:
      en: "No water."
      ja: "水がない。"
      zh: "沒有水。"
    sentence:
      en: "I like dry and sunny days."
      ja: "乾燥した晴れた日が好きです。"
      zh: "我喜歡乾燥晴朗的日子。"

  - id: shine
    word:
      en: Shine
      ja: 輝く
      zh: 照耀
    reading: "SHYN"
    phonetic: "/ʃaɪn/"
    description:
      en: "Give light."
      ja: "光を放つ。"
      zh: "發出光芒。"
    sentence:
      en: "The sun is shining."
      ja: "太陽が輝いています。"
      zh: "太陽正在照耀。"

  - id: blow
    word:
      en: Blow
      ja: 吹く
      zh: 吹
    reading: "BLOH"
    phonetic: "/bloʊ/"
    description:
      en: "Air moving hard."
      ja: "空気が強く動く。"
      zh: "空氣用力移動。"
    sentence:
      en: "The wind is blowing hard."
      ja: "風が強く吹いています。"
      zh: "風吹得很大。"

chat:
  conversations:
    - id: scenario-1-weather-story
      title:
        en: "Yesterday and Today"
        ja: "昨日と今日"
        zh: "昨天和今天"
      messages:
        - role: partner
          text:
            en: "How was the weather yesterday?"
            ja: "昨日の天気はどうでしたか？"
            zh: "昨天天氣怎麼樣？"
        - role: user
          text:
            en: "Yesterday the weather was bad. It was very windy and cold."
            ja: "昨日は天気が悪かったです。とても風が強くて寒かったです。"
            zh: "昨天天氣很差。又風又冷。"
        - role: partner
          text:
            en: "Did it rain?"
            ja: "雨は降りましたか？"
            zh: "有下雨嗎？"
        - role: user
          text:
            en: "Yes, dark clouds filled the sky. Then, the rain started."
            ja: "はい、暗い雲が空を覆いました。そして、雨が降り始めました。"
            zh: "是的，烏雲佈滿天空。然後開始下雨。"
        - role: partner
          text:
            en: "Did you get wet?"
            ja: "濡れましたか？"
            zh: "你有淋濕嗎？"
        - role: user
          text:
            en: "I used my umbrella, but my shoes got wet."
            ja: "傘を使いましたが、靴が濡れました。"
            zh: "我用了雨傘，但鞋子還是濕了。"
        - role: partner
          text:
            en: "How is the weather today?"
            ja: "今日の天気はどうですか？"
            zh: "今天天氣怎麼樣？"
        - role: user
          text:
            en: "Today is different. The sun is out and it is warm. It is a beautiful sunny day."
            ja: "今日は違います。太陽が出ていて暖かいです。美しい晴れた日です。"
            zh: "今天不一樣。太陽出來了，很暖和。是美麗的晴天。"

    - id: scenario-2-hot-day
      title:
        en: "A Hot Day"
        ja: "暑い日"
        zh: "炎熱的一天"
      messages:
        - role: partner
          text:
            en: "It is so hot today!"
            ja: "今日はとても暑いですね！"
            zh: "今天好熱！"
        - role: user
          text:
            en: "Yes, the temperature is 35 degrees."
            ja: "はい、気温は35度です。"
            zh: "是啊，溫度35度。"
        - role: partner
          text:
            en: "I want to go swimming."
            ja: "泳ぎに行きたいです。"
            zh: "我想去游泳。"
        - role: user
          text:
            en: "Good idea. The sun is shining."
            ja: "いいですね。太陽が輝いています。"
            zh: "好主意。太陽正在照耀。"
        - role: partner
          text:
            en: "Wait, look at that cloud."
            ja: "待って、あの雲を見て。"
            zh: "等等，看那朵雲。"
        - role: user
          text:
            en: "Oh no. I think it will rain soon."
            ja: "ああ。すぐ雨が降りそうです。"
            zh: "糟糕。我想快要下雨了。"
        - role: partner
          text:
            en: "Should we bring an umbrella?"
            ja: "傘を持って行きましょうか？"
            zh: "我們要帶雨傘嗎？"
        - role: user
          text:
            en: "Yes, just in case."
            ja: "はい、念のため。"
            zh: "是的，以防萬一。"

    - id: scenario-3-questions-answers
      title:
        en: "Weather Questions"
        ja: "天気の質問"
        zh: "天氣問答"
      messages:
        - role: partner
          text:
            en: "How is the weather?"
            ja: "天気はどうですか？"
            zh: "天氣怎麼樣？"
        - role: user
          text:
            en: "It is raining hard."
            ja: "激しく雨が降っています。"
            zh: "雨下得很大。"
        - role: partner
          text:
            en: "Is it cold outside?"
            ja: "外は寒いですか？"
            zh: "外面冷嗎？"
        - role: user
          text:
            en: "Yes, you need a coat."
            ja: "はい、コートが必要です。"
            zh: "是的，你需要外套。"
        - role: partner
          text:
            en: "Do you like snow?"
            ja: "雪は好きですか？"
            zh: "你喜歡雪嗎？"
        - role: user
          text:
            en: "Yes, it is beautiful."
            ja: "はい、きれいです。"
            zh: "是的，很美。"
        - role: partner
          text:
            en: "Is it sunny?"
            ja: "晴れていますか？"
            zh: "是晴天嗎？"
        - role: user
          text:
            en: "No, it is cloudy."
            ja: "いいえ、曇っています。"
            zh: "不，是陰天。"
        - role: partner
          text:
            en: "How do you feel?"
            ja: "どう感じますか？"
            zh: "你感覺怎麼樣？"
        - role: user
          text:
            en: "I feel warm. It is a nice day."
            ja: "暖かいです。いい日ですね。"
            zh: "我覺得很暖和。天氣很好。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,Lt=`# Chapter: Week 3 - Future & Plans
meta:
  id: future-and-plans
  title:
    en: "Future & Plans"
    ja: "未来と計画"
    zh: "未來與計劃"
  description:
    en: "Talk about your goals, schedule, and predictions using Will, Going to, and Present Continuous correctly."
    ja: "Will、Going to、現在進行形を正しく使って、目標、予定、予測について話しましょう。"
    zh: "學習正確使用 Will、Going to 和現在進行式來談論目標、行程和預測。"
  icon: "🔮"
  order: 3
  level: intermediate

words:
  # Core Vocabulary (Day 1 - Technology Predictions)
  - id: likely
    word:
      en: Likely
      ja: おそらく
      zh: 可能
    reading: "LYK-lee"
    phonetic: "/ˈlaɪkli/"
    description:
      en: "Probable, expected to happen."
      ja: "起こる可能性が高い。"
      zh: "有可能發生的。"
    sentence:
      en: "Electric cars are likely to become more affordable in the next decade."
      ja: "電気自動車は今後10年でより手頃になる可能性が高いです。"
      zh: "電動車在未來十年內可能會變得更實惠。"

  - id: projected-to
    word:
      en: Projected to
      ja: 〜と予測されている
      zh: 預計會
    reading: "proh-JEK-tid too"
    phonetic: "/prəˈdʒektɪd tuː/"
    description:
      en: "Officially estimated or forecasted."
      ja: "公式に推定または予測されている。"
      zh: "正式估計或預測的。"
    sentence:
      en: "The global population is projected to reach 10 billion by 2050."
      ja: "世界人口は2050年までに100億人に達すると予測されています。"
      zh: "全球人口預計到2050年將達到100億。"

  - id: trend
    word:
      en: Trend
      ja: 傾向・トレンド
      zh: 趨勢
    reading: "trend"
    phonetic: "/trend/"
    description:
      en: "A general direction of change or development."
      ja: "変化や発展の一般的な方向性。"
      zh: "變化或發展的大致方向。"
    sentence:
      en: "Remote work is a trend that will continue to grow."
      ja: "リモートワークは成長し続けるトレンドです。"
      zh: "遠端工作是一個將持續增長的趨勢。"

  - id: prediction
    word:
      en: Prediction
      ja: 予測
      zh: 預測
    reading: "pri-DIK-shuhn"
    phonetic: "/prɪˈdɪkʃən/"
    description:
      en: "A statement about what will happen in the future."
      ja: "将来起こることについての声明。"
      zh: "關於未來會發生什麼的陳述。"
    sentence:
      en: "My prediction is that AI will change education completely."
      ja: "私の予測は、AIが教育を完全に変えるということです。"
      zh: "我的預測是人工智慧將徹底改變教育。"

  # Grammar Patterns (Day 2 - Will vs. Going to vs. Present Continuous)
  - id: will-instant
    word:
      en: Will (instant decision)
      ja: 〜します（即座の決定）
      zh: 會（即時決定）
    reading: "wil"
    phonetic: "/wɪl/"
    description:
      en: "Used for decisions made at the moment of speaking."
      ja: "話す瞬間に決めたことに使う。"
      zh: "用於說話當下做出的決定。"
    sentence:
      en: "Someone's at the door. I'll open it."
      ja: "誰か玄関にいます。開けます。"
      zh: "有人在門口。我去開門。"

  - id: going-to-plan
    word:
      en: Going to (plan)
      ja: 〜する予定です
      zh: 打算要
    reading: "GOH-ing too"
    phonetic: "/ˈɡoʊɪŋ tuː/"
    description:
      en: "Used for plans decided before the moment of speaking."
      ja: "話す前にすでに決めた計画に使う。"
      zh: "用於說話之前已經決定好的計劃。"
    sentence:
      en: "I'm going to fly to Japan next month. I already bought the ticket."
      ja: "来月日本に行く予定です。もうチケットを買いました。"
      zh: "我下個月打算飛去日本。我已經買好機票了。"

  - id: present-continuous-fixed
    word:
      en: Present Continuous (fixed)
      ja: 〜する予定です（確定）
      zh: 正在安排（確定的）
    reading: "PREZ-uhnt kuhn-TIN-yoo-uhs"
    phonetic: "/ˈprezənt kənˈtɪnjuəs/"
    description:
      en: "Used for fixed arrangements with specific time/place."
      ja: "具体的な時間や場所が決まった予定に使う。"
      zh: "用於有具體時間/地點的確定安排。"
    sentence:
      en: "I'm meeting him at 5 PM tomorrow at the coffee shop."
      ja: "明日午後5時にコーヒーショップで彼と会います。"
      zh: "我明天下午五點要在咖啡店跟他見面。"

  # Writing Phrases (Day 4 - The 5-Year Plan)
  - id: hope-to
    word:
      en: I hope to...
      ja: 〜したいと思っています
      zh: 我希望能...
    reading: "ay hohp too"
    phonetic: "/aɪ hoʊp tuː/"
    description:
      en: "Express a wish for the future (not certain)."
      ja: "将来の願望を表す（確実ではない）。"
      zh: "表達對未來的願望（不確定）。"
    sentence:
      en: "I hope to travel more and see different cultures."
      ja: "もっと旅行して、様々な文化を見たいと思っています。"
      zh: "我希望能多旅行，看看不同的文化。"

  - id: plan-on
    word:
      en: I plan on...
      ja: 〜するつもりです
      zh: 我計劃要...
    reading: "ay plan on"
    phonetic: "/aɪ plæn ɒn/"
    description:
      en: "Express intention to do something."
      ja: "何かをする意図を表す。"
      zh: "表達做某事的意圖。"
    sentence:
      en: "I plan on learning a new language this year."
      ja: "今年は新しい言語を学ぶつもりです。"
      zh: "我計劃今年學習一門新語言。"

  - id: my-goal-is
    word:
      en: My goal is to...
      ja: 私の目標は〜です
      zh: 我的目標是...
    reading: "my gohl iz too"
    phonetic: "/maɪ ɡoʊl ɪz tuː/"
    description:
      en: "State a specific objective."
      ja: "具体的な目標を述べる。"
      zh: "陳述一個具體的目標。"
    sentence:
      en: "My goal is to get promoted within two years."
      ja: "私の目標は2年以内に昇進することです。"
      zh: "我的目標是在兩年內升職。"

  # Phrasal Verbs (Day 5 - Planning)
  - id: look-forward-to
    word:
      en: Look forward to
      ja: 〜を楽しみにする
      zh: 期待
    reading: "look FOR-werd too"
    phonetic: "/lʊk ˈfɔːrwərd tuː/"
    description:
      en: "Feel excited about something in the future."
      ja: "将来のことにワクワクする。"
      zh: "對未來的事情感到興奮。"
    sentence:
      en: "I'm looking forward to the weekend. I need a break!"
      ja: "週末を楽しみにしています。休憩が必要です！"
      zh: "我很期待週末。我需要休息！"

  - id: put-off
    word:
      en: Put off
      ja: 延期する・先延ばしにする
      zh: 延後、拖延
    reading: "put awf"
    phonetic: "/pʊt ɒf/"
    description:
      en: "Delay or postpone something."
      ja: "何かを遅らせる、先延ばしにする。"
      zh: "推遲或延後某事。"
    sentence:
      en: "I've been putting off going to the gym. I really need to start."
      ja: "ジムに行くのを先延ばしにしています。本当に始めないと。"
      zh: "我一直在拖延去健身房這件事。我真的需要開始了。"

  - id: get-around-to
    word:
      en: Get around to
      ja: ようやく〜する
      zh: 終於去做
    reading: "get uh-ROWND too"
    phonetic: "/ɡet əˈraʊnd tuː/"
    description:
      en: "Finally do something after delay."
      ja: "延期した後でようやく何かをする。"
      zh: "拖延之後終於去做某事。"
    sentence:
      en: "I never get around to cleaning my room. It's always messy."
      ja: "部屋の掃除をする暇がありません。いつも散らかっています。"
      zh: "我總是沒時間打掃房間。它總是很亂。"

chat:
  conversations:
    - id: scenario-1-five-year-plan
      title:
        en: "The 5-Year Plan"
        ja: "5年計画"
        zh: "五年計劃"
      messages:
        - role: partner
          text:
            en: "So, do you have any big plans for the future?"
            ja: "それで、将来の大きな計画はありますか？"
            zh: "那麼，你對未來有什麼大計劃嗎？"
        - role: user
          text:
            en: "Yes, actually. My goal is to get promoted within two years."
            ja: "はい、実は。私の目標は2年以内に昇進することです。"
            zh: "有的，其實。我的目標是在兩年內升職。"
        - role: partner
          text:
            en: "That's ambitious! What else do you hope to achieve?"
            ja: "野心的ですね！他に達成したいことは何ですか？"
            zh: "很有抱負！你還希望達成什麼？"
        - role: user
          text:
            en: "I hope to travel more. I plan on visiting at least three new countries."
            ja: "もっと旅行したいと思っています。少なくとも3つの新しい国を訪れるつもりです。"
            zh: "我希望能多旅行。我計劃至少去三個新的國家。"
        - role: partner
          text:
            en: "Nice! Any specific destinations you're looking forward to?"
            ja: "いいですね！楽しみにしている具体的な目的地はありますか？"
            zh: "不錯！有什麼特別期待的目的地嗎？"
        - role: user
          text:
            en: "I'm looking forward to visiting Japan. I'm going to start saving money this month."
            ja: "日本を訪れるのを楽しみにしています。今月から貯金を始める予定です。"
            zh: "我很期待去日本。我這個月打算開始存錢。"
        - role: partner
          text:
            en: "Have you been putting off any plans recently?"
            ja: "最近先延ばしにしている計画はありますか？"
            zh: "你最近有拖延什麼計劃嗎？"
        - role: user
          text:
            en: "Honestly, yes. I've been putting off learning a new language. But I plan on starting next month."
            ja: "正直に言うと、はい。新しい言語を学ぶのを先延ばしにしています。でも来月から始めるつもりです。"
            zh: "老實說，有的。我一直在拖延學習新語言。但我計劃下個月開始。"

    - id: scenario-2-making-weekend-plans
      title:
        en: "Making Weekend Plans"
        ja: "週末の予定を立てる"
        zh: "規劃週末"
      messages:
        - role: partner
          text:
            en: "Hey, what are you doing this weekend?"
            ja: "ねえ、今週末は何をするの？"
            zh: "嘿，你這週末要做什麼？"
        - role: user
          text:
            en: "I'm meeting my sister at 2 PM on Saturday. We're having lunch together."
            ja: "土曜日の午後2時に姉と会います。一緒にランチをします。"
            zh: "我星期六下午兩點要跟我姐見面。我們要一起吃午餐。"
        - role: partner
          text:
            en: "Nice! What about Sunday? Do you have any plans?"
            ja: "いいね！日曜日は？何か予定ある？"
            zh: "不錯！星期天呢？你有什麼計劃嗎？"
        - role: user
          text:
            en: "I'm going to clean my apartment. I've been putting it off for weeks."
            ja: "アパートを掃除する予定です。何週間も先延ばしにしていました。"
            zh: "我打算打掃公寓。我已經拖延好幾週了。"
        - role: partner
          text:
            en: "Ha! I know that feeling. Want to grab coffee after you finish?"
            ja: "わかる！終わったらコーヒー飲まない？"
            zh: "哈！我懂那種感覺。你忙完後要不要去喝杯咖啡？"
        - role: user
          text:
            en: "Sure, I'll text you when I'm done. Oh wait, I just remembered - the weather forecast said it will be rainy on Sunday."
            ja: "いいよ、終わったらメッセージするね。あ、待って、思い出した - 天気予報で日曜日は雨だって。"
            zh: "好啊，我忙完傳訊息給你。哦等等，我剛想起來 - 天氣預報說星期天會下雨。"
        - role: partner
          text:
            en: "Perfect weather for staying home then! What time works for you?"
            ja: "じゃあ家にいるのにぴったりの天気だね！何時がいい？"
            zh: "那正好是待在家的好天氣！你幾點方便？"
        - role: user
          text:
            en: "I'll be free around 4 PM. I'll come to the cafe near your place."
            ja: "4時頃には空くと思う。あなたの家の近くのカフェに行くよ。"
            zh: "我大概下午四點會有空。我會去你家附近的咖啡廳。"

    - id: scenario-3-predictions-and-schedules
      title:
        en: "Predictions and Schedules"
        ja: "予測とスケジュール"
        zh: "預測和行程"
      messages:
        - role: partner
          text:
            en: "What do you think the future of work will look like?"
            ja: "仕事の未来はどうなると思いますか？"
            zh: "你認為工作的未來會是什麼樣子？"
        - role: user
          text:
            en: "Remote work is likely to become even more common. It's a growing trend."
            ja: "リモートワークはさらに一般的になる可能性が高いです。成長しているトレンドです。"
            zh: "遠端工作可能會變得更加普遍。這是一個增長中的趨勢。"
        - role: partner
          text:
            en: "What's your prediction for AI and jobs?"
            ja: "AIと仕事についての予測は何ですか？"
            zh: "你對人工智慧和工作有什麼預測？"
        - role: user
          text:
            en: "My prediction is that AI will change many industries. Some jobs are projected to disappear."
            ja: "私の予測は、AIが多くの産業を変えるということです。いくつかの仕事は消えると予測されています。"
            zh: "我的預測是人工智慧將改變許多產業。有些工作預計會消失。"
        - role: partner
          text:
            en: "Are you doing anything to prepare for these changes?"
            ja: "これらの変化に備えて何かしていますか？"
            zh: "你有在為這些變化做準備嗎？"
        - role: user
          text:
            en: "Yes, I'm taking an online course next month. The classes start on the 15th."
            ja: "はい、来月オンラインコースを受講します。授業は15日に始まります。"
            zh: "有的，我下個月要上一個線上課程。課程十五號開始。"
        - role: partner
          text:
            en: "That's smart! How long is the course?"
            ja: "賢いですね！コースはどのくらいの長さですか？"
            zh: "很聰明！課程有多長？"
        - role: user
          text:
            en: "It's three months. I'm looking forward to learning new skills. I've been putting off upgrading my skills for too long."
            ja: "3ヶ月です。新しいスキルを学ぶのを楽しみにしています。スキルアップを長い間先延ばしにしていました。"
            zh: "三個月。我很期待學習新技能。我拖延提升技能太久了。"
        - role: partner
          text:
            en: "When do you think you'll finally get around to using those new skills?"
            ja: "いつ頃その新しいスキルを使えるようになると思いますか？"
            zh: "你覺得你什麼時候會終於開始使用那些新技能？"
        - role: user
          text:
            en: "Hopefully by next year. My goal is to switch to a more tech-focused role."
            ja: "来年までにはできると思います。私の目標は、より技術に特化した役職に移ることです。"
            zh: "希望明年之前。我的目標是轉到一個更專注於科技的職位。"

quiz:
  questionsPerRound: 5
  xpReward: 25
`,Ht=`# Chapter: Week 4 - Experiences & Achievements
meta:
  id: experiences-and-achievements
  title:
    en: "Experiences & Achievements"
    ja: "経験と達成"
    zh: "經歷與成就"
  description:
    en: "Discuss life achievements and travel experiences using Present Perfect. Learn when time matters and when it doesn't."
    ja: "現在完了形を使って人生の達成や旅行経験について話しましょう。時間が重要な場合とそうでない場合を学びます。"
    zh: "用現在完成式討論人生成就和旅行經歷。學習何時時間重要，何時不重要。"
  icon: "🏆"
  order: 4
  level: intermediate

words:
  # Present Perfect Structures (Day 1-2)
  - id: have-done
    word:
      en: I have done...
      ja: 〜したことがある
      zh: 我做過...
    reading: "ay hav duhn"
    phonetic: "/aɪ hæv dʌn/"
    description:
      en: "Present Perfect for life experiences (time not specified)."
      ja: "人生経験を表す現在完了形（時間は指定しない）。"
      zh: "用現在完成式表達人生經歷（不指定時間）。"
    sentence:
      en: "I have seen that movie three times. It's my favorite."
      ja: "その映画を3回見たことがあります。私のお気に入りです。"
      zh: "那部電影我看過三次了。是我的最愛。"

  - id: have-you-ever
    word:
      en: Have you ever...?
      ja: 〜したことがありますか？
      zh: 你曾經...嗎？
    reading: "hav yoo EV-er"
    phonetic: "/hæv juː ˈevər/"
    description:
      en: "Ask about someone's life experiences."
      ja: "誰かの人生経験について尋ねる。"
      zh: "詢問某人的人生經歷。"
    sentence:
      en: "Have you ever been to Japan? I'd love to visit someday."
      ja: "日本に行ったことはありますか？いつか訪れたいです。"
      zh: "你去過日本嗎？我很想有一天去看看。"

  - id: have-never
    word:
      en: I have never...
      ja: 一度も〜したことがない
      zh: 我從未...
    reading: "ay hav NEV-er"
    phonetic: "/aɪ hæv ˈnevər/"
    description:
      en: "Express something you haven't experienced in your life."
      ja: "人生で経験したことがないことを表す。"
      zh: "表達你人生中從未經歷過的事。"
    sentence:
      en: "I have never tried skydiving. It looks terrifying!"
      ja: "スカイダイビングをしたことがありません。恐ろしそうです！"
      zh: "我從沒試過跳傘。看起來太可怕了！"

  - id: havent-yet
    word:
      en: I haven't... yet
      ja: まだ〜していない
      zh: 我還沒...
    reading: "ay HAV-uhnt yet"
    phonetic: "/aɪ ˈhævənt jet/"
    description:
      en: "Something not done but expected or planned."
      ja: "まだしていないが、予定していることや期待していること。"
      zh: "尚未完成但預期或計劃要做的事。"
    sentence:
      en: "I haven't learned to ski yet, but it's on my bucket list."
      ja: "まだスキーを習っていませんが、やりたいことリストに入っています。"
      zh: "我還沒學會滑雪，但它在我的願望清單上。"

  - id: already
    word:
      en: Already
      ja: すでに・もう
      zh: 已經
    reading: "awl-RED-ee"
    phonetic: "/ɔːlˈredi/"
    description:
      en: "Something completed sooner than expected."
      ja: "予想より早く完了したこと。"
      zh: "比預期更早完成的事。"
    sentence:
      en: "I've already finished the report. I can help you now."
      ja: "すでにレポートを終えました。今あなたを手伝えます。"
      zh: "我已經完成報告了。現在可以幫你。"

  # Strong Adjectives (Day 5)
  - id: breath-taking
    word:
      en: Breath-taking
      ja: 息を呑むほど美しい
      zh: 令人嘆為觀止的
    reading: "BRETH-tay-king"
    phonetic: "/ˈbreθˌteɪkɪŋ/"
    description:
      en: "Extremely beautiful or impressive (stronger than 'beautiful')."
      ja: "極めて美しい、印象的（'beautiful'より強い）。"
      zh: "極其美麗或令人印象深刻（比 'beautiful' 更強烈）。"
    sentence:
      en: "The view from the mountain was breath-taking. I'll never forget it."
      ja: "山からの景色は息を呑むほど美しかったです。決して忘れません。"
      zh: "山上的景色令人嘆為觀止。我永遠不會忘記。"

  - id: exhausting
    word:
      en: Exhausting
      ja: 疲れ果てる
      zh: 令人精疲力竭的
    reading: "ig-ZAWS-ting"
    phonetic: "/ɪɡˈzɔːstɪŋ/"
    description:
      en: "Extremely tiring (stronger than 'tiring')."
      ja: "極めて疲れる（'tiring'より強い）。"
      zh: "極度疲累的（比 'tiring' 更強烈）。"
    sentence:
      en: "The hike was exhausting but totally worth it."
      ja: "ハイキングは疲れ果てましたが、完全にその価値がありました。"
      zh: "那次健行令人精疲力竭，但完全值得。"

  - id: terrifying
    word:
      en: Terrifying
      ja: 恐ろしい
      zh: 令人恐懼的
    reading: "TER-uh-fy-ing"
    phonetic: "/ˈterɪfaɪɪŋ/"
    description:
      en: "Extremely scary (stronger than 'scary')."
      ja: "極めて怖い（'scary'より強い）。"
      zh: "極度可怕的（比 'scary' 更強烈）。"
    sentence:
      en: "The experience was terrifying. My hands were shaking the whole time."
      ja: "その経験は恐ろしかったです。ずっと手が震えていました。"
      zh: "那次經歷令人恐懼。我的手全程都在發抖。"

  - id: overwhelming
    word:
      en: Overwhelming
      ja: 圧倒的な
      zh: 令人難以承受的
    reading: "oh-ver-WELM-ing"
    phonetic: "/ˌoʊvərˈwelmɪŋ/"
    description:
      en: "Too much emotion or information to handle."
      ja: "処理しきれないほどの感情や情報。"
      zh: "情緒或資訊多到難以處理。"
    sentence:
      en: "Starting a new job can be overwhelming at first."
      ja: "新しい仕事を始めるのは最初は圧倒的です。"
      zh: "剛開始新工作可能會讓人難以承受。"

  - id: life-changing
    word:
      en: Life-changing
      ja: 人生を変える
      zh: 改變人生的
    reading: "LYFE-chayn-jing"
    phonetic: "/ˈlaɪfˌtʃeɪndʒɪŋ/"
    description:
      en: "Changes your perspective or life completely."
      ja: "視点や人生を完全に変える。"
      zh: "徹底改變你的觀點或人生。"
    sentence:
      en: "Traveling alone was a life-changing experience for me."
      ja: "一人旅は私にとって人生を変える経験でした。"
      zh: "獨自旅行對我來說是一次改變人生的經歷。"

  # Achievement Vocabulary (Day 3)
  - id: managed-to
    word:
      en: I have managed to...
      ja: なんとか〜できた
      zh: 我設法做到了...
    reading: "ay hav MAN-ijd too"
    phonetic: "/aɪ hæv ˈmænɪdʒd tuː/"
    description:
      en: "Successfully accomplished something difficult."
      ja: "難しいことを首尾よく成し遂げた。"
      zh: "成功完成了困難的事情。"
    sentence:
      en: "I have managed a team of 10 people for two years."
      ja: "2年間10人のチームを管理してきました。"
      zh: "我已經管理一個十人團隊兩年了。"

  - id: achievement
    word:
      en: Achievement
      ja: 達成・業績
      zh: 成就
    reading: "uh-CHEEV-muhnt"
    phonetic: "/əˈtʃiːvmənt/"
    description:
      en: "Something accomplished through effort or skill."
      ja: "努力やスキルによって達成したこと。"
      zh: "通過努力或技能完成的事情。"
    sentence:
      en: "What is your biggest achievement so far?"
      ja: "これまでで一番の達成は何ですか？"
      zh: "到目前為止你最大的成就是什麼？"

  - id: bucket-list
    word:
      en: Bucket list
      ja: やりたいことリスト
      zh: 願望清單
    reading: "BUH-kit list"
    phonetic: "/ˈbʌkɪt lɪst/"
    description:
      en: "List of things you want to do before you die."
      ja: "死ぬまでにやりたいことのリスト。"
      zh: "死前想做的事情清單。"
    sentence:
      en: "Visiting the Northern Lights is on my bucket list."
      ja: "オーロラを見ることがやりたいことリストに入っています。"
      zh: "看北極光在我的願望清單上。"

  - id: paid-my-dues
    word:
      en: Paid my dues
      ja: 苦労を重ねてきた
      zh: 付出了代價
    reading: "payd my dooz"
    phonetic: "/peɪd maɪ duːz/"
    description:
      en: "Worked hard and earned your position through experience."
      ja: "一生懸命働き、経験を通じて地位を得た。"
      zh: "努力工作並通過經驗贏得了你的地位。"
    sentence:
      en: "I've paid my dues in this industry for over ten years."
      ja: "この業界で10年以上苦労を重ねてきました。"
      zh: "我在這個行業付出了十多年的代價。"

chat:
  conversations:
    - id: scenario-1-job-interview
      title:
        en: "The Job Interview"
        ja: "就職面接"
        zh: "工作面試"
      messages:
        - role: partner
          text:
            en: "Thank you for coming in today. Let's start - what is your biggest achievement?"
            ja: "今日はお越しいただきありがとうございます。始めましょう - あなたの一番の達成は何ですか？"
            zh: "感謝你今天過來。我們開始吧 - 你最大的成就是什麼？"
        - role: user
          text:
            en: "I have managed a team of 10 people for two years. We increased sales by 30%."
            ja: "2年間10人のチームを管理してきました。売上を30%増加させました。"
            zh: "我管理了一個十人團隊兩年。我們讓銷售額增加了30%。"
        - role: partner
          text:
            en: "Impressive! Have you ever worked under pressure with tight deadlines?"
            ja: "素晴らしい！厳しい締め切りのプレッシャーの下で働いたことはありますか？"
            zh: "令人印象深刻！你曾經在緊迫的截止日期壓力下工作過嗎？"
        - role: user
          text:
            en: "Yes, I have. It was overwhelming at first, but I've learned to prioritize tasks effectively."
            ja: "はい、あります。最初は圧倒的でしたが、タスクを効果的に優先することを学びました。"
            zh: "是的，有過。一開始讓人難以承受，但我學會了有效地排定任務優先順序。"
        - role: partner
          text:
            en: "Have you ever had to deal with a difficult client?"
            ja: "難しいクライアントに対処しなければならなかったことはありますか？"
            zh: "你曾經處理過難搞的客戶嗎？"
        - role: user
          text:
            en: "I have. Last year, I managed to turn an unhappy customer into our biggest supporter."
            ja: "あります。去年、不満を持っていた顧客を最大のサポーターに変えることができました。"
            zh: "有過。去年，我設法把一個不滿意的客戶變成我們最大的支持者。"
        - role: partner
          text:
            en: "That's a life-changing skill in this industry. Is there anything you haven't done yet?"
            ja: "それはこの業界で人生を変えるスキルですね。まだやっていないことはありますか？"
            zh: "那在這個行業是改變人生的技能。有什麼你還沒做過的事嗎？"
        - role: user
          text:
            en: "I haven't led an international team yet, but it's definitely on my list. I'm excited about the opportunity."
            ja: "まだ国際チームを率いたことはありませんが、それは確実にリストにあります。この機会にワクワクしています。"
            zh: "我還沒有領導過國際團隊，但這絕對在我的清單上。我對這個機會感到興奮。"

    - id: scenario-2-travel-stories
      title:
        en: "Travel Stories"
        ja: "旅行の話"
        zh: "旅行故事"
      messages:
        - role: partner
          text:
            en: "I heard you've traveled a lot! What's the most breath-taking place you've been to?"
            ja: "たくさん旅行したと聞きました！一番息を呑むような場所はどこでしたか？"
            zh: "我聽說你旅行過很多地方！你去過最令人嘆為觀止的地方是哪裡？"
        - role: user
          text:
            en: "I've been to the Grand Canyon. The view was absolutely breath-taking. I'll never forget it."
            ja: "グランドキャニオンに行ったことがあります。景色は本当に息を呑むほどでした。決して忘れません。"
            zh: "我去過大峽谷。那裡的景色絕對令人嘆為觀止。我永遠不會忘記。"
        - role: partner
          text:
            en: "Have you ever had a terrifying travel experience?"
            ja: "恐ろしい旅行経験はありましたか？"
            zh: "你有過令人恐懼的旅行經歷嗎？"
        - role: user
          text:
            en: "Yes! I've gone bungee jumping in New Zealand. It was terrifying but also life-changing."
            ja: "はい！ニュージーランドでバンジージャンプをしたことがあります。恐ろしかったですが、人生を変える体験でした。"
            zh: "有！我在紐西蘭跳過高空彈跳。很恐怖但也是改變人生的經歷。"
        - role: partner
          text:
            en: "What about physically challenging trips? Have you done any exhausting hikes?"
            ja: "体力的に大変な旅行はどうですか？疲れ果てるようなハイキングをしたことはありますか？"
            zh: "那體力挑戰型的旅行呢？你有做過令人精疲力竭的健行嗎？"
        - role: user
          text:
            en: "I've hiked Mount Fuji. It was exhausting but totally worth it. The sunrise was incredible."
            ja: "富士山に登ったことがあります。疲れ果てましたが、完全にその価値がありました。日の出は信じられないほどでした。"
            zh: "我爬過富士山。非常累人但完全值得。日出太驚人了。"
        - role: partner
          text:
            en: "Is there anywhere you haven't been yet but really want to visit?"
            ja: "まだ行ったことがないけど、本当に行きたい場所はありますか？"
            zh: "有什麼你還沒去過但真的很想去的地方嗎？"
        - role: user
          text:
            en: "I haven't visited the Northern Lights yet. It's been on my bucket list for years."
            ja: "まだオーロラを見たことがありません。何年もやりたいことリストに入っています。"
            zh: "我還沒看過北極光。它在我的願望清單上好幾年了。"
        - role: partner
          text:
            en: "I've already been there twice! The experience was overwhelming - I actually cried."
            ja: "私はすでに2回行きました！その経験は圧倒的で、実際に泣きました。"
            zh: "我已經去過兩次了！那種體驗讓人難以承受 - 我真的哭了。"
        - role: user
          text:
            en: "Now I want to go even more! I've paid my dues saving money. This year is the year!"
            ja: "今はもっと行きたくなりました！お金を貯めるために苦労を重ねてきました。今年こそは！"
            zh: "現在我更想去了！我存錢存了很久。今年就是那一年！"

    - id: scenario-3-never-have-i-ever
      title:
        en: "Never Have I Ever"
        ja: "やったことがないゲーム"
        zh: "我從來沒有"
      messages:
        - role: partner
          text:
            en: "Let's play a game! Have you ever eaten something really unusual?"
            ja: "ゲームをしよう！本当に変わったものを食べたことがありますか？"
            zh: "來玩個遊戲吧！你曾經吃過什麼真的很特別的東西嗎？"
        - role: user
          text:
            en: "Yes, I have! I've eaten sushi with raw horse meat in Japan. Have you ever tried it?"
            ja: "はい、あります！日本で馬刺しの寿司を食べたことがあります。試したことはありますか？"
            zh: "有啊！我在日本吃過生馬肉壽司。你試過嗎？"
        - role: partner
          text:
            en: "No, I haven't tried that yet! Have you ever sung karaoke in public?"
            ja: "いいえ、まだ試したことがありません！公衆の前でカラオケを歌ったことはありますか？"
            zh: "沒有，我還沒試過那個！你曾經在公開場合唱過卡拉OK嗎？"
        - role: user
          text:
            en: "I have never sung karaoke. The idea is terrifying to me! How about you?"
            ja: "カラオケを歌ったことがありません。私には恐ろしいアイデアです！あなたはどうですか？"
            zh: "我從來沒唱過卡拉OK。這個想法對我來說很可怕！你呢？"
        - role: partner
          text:
            en: "I've already done it many times! It's fun. Have you ever run a marathon?"
            ja: "すでに何度もやりました！楽しいですよ。マラソンを走ったことはありますか？"
            zh: "我已經唱過很多次了！很好玩。你跑過馬拉松嗎？"
        - role: user
          text:
            en: "I haven't run a marathon yet, but it's on my bucket list. It sounds exhausting!"
            ja: "まだマラソンを走ったことはありませんが、やりたいことリストに入っています。疲れそうですね！"
            zh: "我還沒跑過馬拉松，但它在我的願望清單上。聽起來超累的！"
        - role: partner
          text:
            en: "Trust me, it's exhausting but life-changing. Have you ever learned a new language?"
            ja: "信じて、疲れますが人生を変えますよ。新しい言語を学んだことはありますか？"
            zh: "相信我，很累但會改變人生。你學過新語言嗎？"
        - role: user
          text:
            en: "Yes! I've studied English for years. It was overwhelming at first but I've managed to improve a lot."
            ja: "はい！何年も英語を勉強してきました。最初は圧倒的でしたが、かなり上達することができました。"
            zh: "有！我學英語學了好幾年。一開始讓人難以承受，但我設法進步了很多。"
        - role: partner
          text:
            en: "That's an amazing achievement! What haven't you done yet that you really want to try?"
            ja: "それは素晴らしい達成ですね！まだやっていないけど本当にやりたいことは何ですか？"
            zh: "那是很棒的成就！有什麼你還沒做過但真的很想嘗試的？"
        - role: user
          text:
            en: "I've never tried skydiving. It looks terrifying, but maybe one day I'll be brave enough!"
            ja: "スカイダイビングをしたことがありません。恐ろしそうですが、いつか勇気が出るかもしれません！"
            zh: "我從沒試過跳傘。看起來很可怕，但也許有一天我會夠勇敢！"

quiz:
  questionsPerRound: 5
  xpReward: 25
`,Yt=`# Chapter: Week 5 - Travel Problems & Complaints
meta:
  id: travel-problems-and-complaints
  title:
    en: "Travel Problems & Complaints"
    ja: "旅行のトラブルと苦情"
    zh: "旅行問題與投訴"
  description:
    en: "Handle travel problems politely using modal verbs. Learn to make complaints, describe lost items, and give balanced feedback."
    ja: "丁寧な表現を使って旅行のトラブルに対処しましょう。苦情の伝え方、紛失物の説明、バランスの取れたフィードバックを学びます。"
    zh: "學習用禮貌的情態動詞處理旅行問題。學會投訴、描述遺失物品，以及給予平衡的反饋。"
  icon: "🧳"
  order: 5
  level: intermediate

words:
  # Complaint Adjectives (Day 1)
  - id: filthy
    word:
      en: Filthy
      ja: 不潔な
      zh: 骯髒的
    reading: "FIL-thee"
    phonetic: "/ˈfɪlθi/"
    description:
      en: "Extremely dirty (stronger than 'dirty')."
      ja: "極めて汚い（'dirty'より強い）。"
      zh: "極度髒的（比 'dirty' 更強烈）。"
    sentence:
      en: "The bathroom was filthy. There was mold everywhere."
      ja: "バスルームは不潔でした。至る所にカビがありました。"
      zh: "浴室非常髒。到處都是霉菌。"

  - id: rude
    word:
      en: Rude
      ja: 失礼な
      zh: 粗魯的
    reading: "rood"
    phonetic: "/ruːd/"
    description:
      en: "Not polite or respectful in behavior."
      ja: "礼儀正しくない、無礼な行動。"
      zh: "行為不禮貌或不尊重人的。"
    sentence:
      en: "The staff was rude and unhelpful when I asked for assistance."
      ja: "スタッフは私が助けを求めた時、失礼で役に立ちませんでした。"
      zh: "當我尋求幫助時，員工很粗魯且不願意幫忙。"

  - id: unacceptable
    word:
      en: Unacceptable
      ja: 受け入れられない
      zh: 無法接受的
    reading: "uhn-ak-SEP-tuh-buhl"
    phonetic: "/ˌʌnəkˈseptəbl/"
    description:
      en: "Not good enough to be accepted or allowed."
      ja: "受け入れたり許可したりするには不十分。"
      zh: "不夠好，無法被接受或允許。"
    sentence:
      en: "The service was unacceptable. We waited two hours for our food."
      ja: "サービスは受け入れられませんでした。食事を2時間待ちました。"
      zh: "服務無法接受。我們等了兩個小時才上菜。"

  - id: disappointing
    word:
      en: Disappointing
      ja: がっかりする
      zh: 令人失望的
    reading: "dis-uh-POIN-ting"
    phonetic: "/ˌdɪsəˈpɔɪntɪŋ/"
    description:
      en: "Not as good as you hoped or expected."
      ja: "期待や希望ほど良くない。"
      zh: "不如你期望或希望的那麼好。"
    sentence:
      en: "The view was disappointing. It was nothing like the photos online."
      ja: "景色はがっかりでした。オンラインの写真とは全く違いました。"
      zh: "景色令人失望。跟網上的照片完全不一樣。"

  - id: overpriced
    word:
      en: Overpriced
      ja: 高すぎる
      zh: 定價過高的
    reading: "oh-ver-PRYST"
    phonetic: "/ˌoʊvərˈpraɪst/"
    description:
      en: "Costing more than it is worth."
      ja: "価値より高い値段。"
      zh: "價格超過其實際價值。"
    sentence:
      en: "The hotel was overpriced for what you get. Not worth the money."
      ja: "そのホテルは内容に対して高すぎました。お金の価値がありません。"
      zh: "這間飯店以提供的內容來說定價過高。不值那個錢。"

  # Polite Modal Verbs (Day 2)
  - id: would-like
    word:
      en: I would like...
      ja: 〜をお願いしたいのですが
      zh: 我想要...
    reading: "ay wuud lyk"
    phonetic: "/aɪ wʊd laɪk/"
    description:
      en: "Polite way to say 'I want' (formal requests)."
      ja: "'I want'の丁寧な言い方（正式な依頼）。"
      zh: "'I want' 的禮貌說法（正式請求）。"
    sentence:
      en: "I would like a refund, please. The product was defective."
      ja: "返金をお願いしたいのですが。製品に欠陥がありました。"
      zh: "我想要退款。產品有瑕疵。"

  - id: could-you-please
    word:
      en: Could you please...?
      ja: 〜していただけますか？
      zh: 能否請您...？
    reading: "kuud yoo pleez"
    phonetic: "/kʊd juː pliːz/"
    description:
      en: "Very polite way to ask someone to do something."
      ja: "誰かに何かをしてもらうとても丁寧な方法。"
      zh: "非常禮貌地請求某人做某事的方式。"
    sentence:
      en: "Could you please look into this? There seems to be a mistake."
      ja: "これを確認していただけますか？間違いがあるようです。"
      zh: "能否請您查看一下？似乎有個錯誤。"

  - id: would-you-mind
    word:
      en: Would you mind...?
      ja: 〜していただいても構いませんか？
      zh: 您介意...嗎？
    reading: "wuud yoo mynd"
    phonetic: "/wʊd juː maɪnd/"
    description:
      en: "Extremely polite way to make a request."
      ja: "極めて丁寧な依頼の方法。"
      zh: "極其禮貌的請求方式。"
    sentence:
      en: "Would you mind checking again? I'm sure I made a reservation."
      ja: "もう一度確認していただいても構いませんか？予約したはずです。"
      zh: "您介意再查一次嗎？我確定我有訂位。"

  - id: would-appreciate
    word:
      en: I would appreciate it if...
      ja: 〜していただけると幸いです
      zh: 如果...我會很感激
    reading: "ay wuud uh-PREE-shee-ayt"
    phonetic: "/aɪ wʊd əˈpriːʃieɪt/"
    description:
      en: "Formal, polite way to express a strong request."
      ja: "強い依頼を表す正式で丁寧な方法。"
      zh: "表達強烈請求的正式、禮貌方式。"
    sentence:
      en: "I would appreciate it if you could move me to a quieter room."
      ja: "静かな部屋に移していただけると幸いです。"
      zh: "如果您能幫我換到安靜一點的房間，我會很感激。"

  # Travel Phrasal Verbs (Day 5)
  - id: check-in
    word:
      en: Check in
      ja: チェックインする
      zh: 辦理入住/報到
    reading: "chek in"
    phonetic: "/tʃek ɪn/"
    description:
      en: "Register arrival at a hotel or airport."
      ja: "ホテルや空港で到着を登録する。"
      zh: "在飯店或機場登記到達。"
    sentence:
      en: "What time can we check in? We arrived early."
      ja: "何時にチェックインできますか？早く着きました。"
      zh: "我們幾點可以辦理入住？我們提早到了。"

  - id: check-out
    word:
      en: Check out
      ja: チェックアウトする
      zh: 辦理退房
    reading: "chek out"
    phonetic: "/tʃek aʊt/"
    description:
      en: "Leave a hotel and pay the bill."
      ja: "ホテルを出て精算する。"
      zh: "離開飯店並結帳。"
    sentence:
      en: "What time is check out? I need to catch an early flight."
      ja: "チェックアウトは何時ですか？早い便に乗らなければなりません。"
      zh: "退房時間是幾點？我需要趕早班飛機。"

  - id: drop-off
    word:
      en: Drop off
      ja: 降ろす・届ける
      zh: 送達/放下
    reading: "drop awf"
    phonetic: "/drɑːp ɔːf/"
    description:
      en: "Take someone or something to a place and leave them there."
      ja: "誰かや何かを場所に連れて行き、そこに残す。"
      zh: "把某人或某物送到某處並離開。"
    sentence:
      en: "Could you drop me off at the airport, please?"
      ja: "空港で降ろしていただけますか？"
      zh: "能否請您送我到機場？"

  - id: get-around
    word:
      en: Get around
      ja: 移動する
      zh: 四處走動
    reading: "get uh-ROUND"
    phonetic: "/ɡet əˈraʊnd/"
    description:
      en: "Move from place to place within an area."
      ja: "ある地域内で場所から場所へ移動する。"
      zh: "在一個區域內從一個地方移動到另一個地方。"
    sentence:
      en: "It's easy to get around Taipei by MRT. Very convenient!"
      ja: "台北はMRTで移動するのが簡単です。とても便利！"
      zh: "在台北搭捷運四處走動很方便！"

  # Balanced Feedback (Day 4)
  - id: however
    word:
      en: However
      ja: しかしながら
      zh: 然而
    reading: "how-EV-er"
    phonetic: "/haʊˈevər/"
    description:
      en: "Used to introduce a contrasting point (formal 'but')."
      ja: "対照的なポイントを導入する（正式な'but'）。"
      zh: "用來引入對比觀點（正式的 'but'）。"
    sentence:
      en: "The room was lovely. However, it was quite noisy at night."
      ja: "部屋は素敵でした。しかしながら、夜はかなりうるさかったです。"
      zh: "房間很漂亮。然而，晚上相當吵。"

chat:
  conversations:
    - id: scenario-1-lost-luggage
      title:
        en: "Lost Luggage"
        ja: "紛失した荷物"
        zh: "行李遺失"
      messages:
        - role: partner
          text:
            en: "Good afternoon. Welcome to the baggage claim counter. How can I help you?"
            ja: "こんにちは。手荷物カウンターへようこそ。どうされましたか？"
            zh: "午安。歡迎來到行李提領櫃檯。有什麼我能幫您的嗎？"
        - role: user
          text:
            en: "Hello. My luggage hasn't arrived. I've been waiting for over an hour."
            ja: "こんにちは。荷物が届いていません。1時間以上待っています。"
            zh: "你好。我的行李還沒到。我已經等了一個多小時了。"
        - role: partner
          text:
            en: "I'm sorry to hear that. May I have your flight number and baggage tag?"
            ja: "申し訳ございません。フライト番号と手荷物タグをいただけますか？"
            zh: "很抱歉聽到這個消息。可以給我您的航班號和行李標籤嗎？"
        - role: user
          text:
            en: "Yes, here's my tag. I was on flight BA287 from London."
            ja: "はい、これがタグです。ロンドンからのBA287便でした。"
            zh: "好的，這是我的標籤。我搭的是從倫敦來的BA287航班。"
        - role: partner
          text:
            en: "Could you please describe your luggage for me?"
            ja: "荷物の特徴を教えていただけますか？"
            zh: "能否請您描述一下您的行李？"
        - role: user
          text:
            en: "It's a large black suitcase with a red ribbon on the handle. The brand is Samsonite."
            ja: "大きな黒いスーツケースで、取っ手に赤いリボンが付いています。ブランドはサムソナイトです。"
            zh: "是一個大型黑色行李箱，把手上有紅色緞帶。品牌是新秀麗。"
        - role: partner
          text:
            en: "Thank you. I can see your bag was put on the wrong connecting flight. It should arrive tomorrow morning."
            ja: "ありがとうございます。お荷物が間違った乗り継ぎ便に載せられたようです。明日の朝届く予定です。"
            zh: "謝謝。我看到您的行李被放到錯誤的轉機航班了。應該明天早上會到。"
        - role: user
          text:
            en: "I see. I would appreciate it if you could deliver it to my hotel when it arrives."
            ja: "わかりました。届いたらホテルに届けていただけると幸いです。"
            zh: "我明白了。如果行李到了能送到我的飯店，我會很感激。"
        - role: partner
          text:
            en: "Of course. We'll arrange delivery. Here's a toiletry kit for tonight. We apologize for the inconvenience."
            ja: "もちろんです。配送を手配します。今夜用のアメニティキットをどうぞ。ご不便をおかけして申し訳ございません。"
            zh: "當然可以。我們會安排送達。這是今晚用的盥洗包。造成您的不便，我們深感抱歉。"
        - role: user
          text:
            en: "Thank you. What can you do if my bag doesn't arrive by tomorrow?"
            ja: "ありがとうございます。明日までに届かなかったらどうなりますか？"
            zh: "謝謝。如果我的行李明天還沒到，你們能怎麼處理？"
        - role: partner
          text:
            en: "If it doesn't arrive within 24 hours, you can claim up to $200 for essential items. Keep your receipts."
            ja: "24時間以内に届かない場合、必需品に対して最大200ドルまで請求できます。レシートを保管してください。"
            zh: "如果24小時內沒到，您可以申請最高200美元的必需品補償。請保留收據。"

    - id: scenario-2-hotel-complaint
      title:
        en: "Hotel Complaint"
        ja: "ホテルへの苦情"
        zh: "飯店投訴"
      messages:
        - role: partner
          text:
            en: "Front desk, how may I assist you this evening?"
            ja: "フロントです。今夜はどのようなご用件でしょうか？"
            zh: "這裡是櫃檯，今晚有什麼我能為您效勞的嗎？"
        - role: user
          text:
            en: "Hello. I'm calling from room 412. I'm afraid there's a problem with my room."
            ja: "もしもし。412号室から電話しています。部屋に問題があるようです。"
            zh: "你好。我從412號房打來。恐怕我的房間有問題。"
        - role: partner
          text:
            en: "I'm sorry to hear that. What seems to be the issue?"
            ja: "申し訳ございません。どのような問題でしょうか？"
            zh: "很抱歉聽到這個消息。請問是什麼問題？"
        - role: user
          text:
            en: "The air conditioning is broken. It's been making a loud noise and the room is getting very hot."
            ja: "エアコンが壊れています。大きな音がして、部屋がとても暑くなっています。"
            zh: "空調壞了。一直發出很大的噪音，房間也變得很熱。"
        - role: partner
          text:
            en: "I apologize for the inconvenience. Would you like me to send maintenance up right away?"
            ja: "ご不便をおかけして申し訳ございません。すぐにメンテナンスを送りましょうか？"
            zh: "造成您的不便，我深感抱歉。需要我立刻派維修人員上去嗎？"
        - role: user
          text:
            en: "Actually, I would appreciate it if you could move me to a quieter room instead. It's already quite late."
            ja: "実は、静かな部屋に移していただけると幸いです。もうかなり遅いので。"
            zh: "其實，如果能幫我換到安靜一點的房間，我會很感激。已經很晚了。"
        - role: partner
          text:
            en: "Let me check our availability. Yes, we have a room on the 8th floor. Would that work?"
            ja: "空室を確認いたします。はい、8階にお部屋がございます。いかがでしょうか？"
            zh: "讓我查看一下空房。是的，我們8樓有房間。可以嗎？"
        - role: user
          text:
            en: "That would be great. Could you please send someone to help me move my things?"
            ja: "それで結構です。荷物を運ぶのを手伝う人を送っていただけますか？"
            zh: "那太好了。能否請您派人幫我搬東西？"
        - role: partner
          text:
            en: "Of course. A bellhop will be there in five minutes. We'll also offer you a complimentary breakfast for the trouble."
            ja: "もちろんです。5分以内にベルボーイが参ります。ご迷惑をおかけしたお詫びに、朝食を無料でご提供します。"
            zh: "當然可以。服務生五分鐘內就到。為了補償您的困擾，我們也會提供免費早餐。"
        - role: user
          text:
            en: "Thank you very much. I appreciate your help in resolving this so quickly."
            ja: "どうもありがとうございます。迅速に対応していただき感謝します。"
            zh: "非常感謝。感謝您這麼快速地幫我解決問題。"

    - id: scenario-3-writing-review
      title:
        en: "Writing a Review"
        ja: "レビューを書く"
        zh: "撰寫評論"
      messages:
        - role: partner
          text:
            en: "How was your hotel in Tokyo? Are you going to write a review?"
            ja: "東京のホテルはどうでしたか？レビューを書く予定ですか？"
            zh: "你在東京的飯店怎麼樣？你打算寫評論嗎？"
        - role: user
          text:
            en: "Yes, but I'm not sure how to write it. It was a mixed experience."
            ja: "はい、でもどう書けばいいかわかりません。良いところと悪いところがありました。"
            zh: "是的，但我不太確定怎麼寫。體驗好壞參半。"
        - role: partner
          text:
            en: "Start with something positive. What did you like about it?"
            ja: "まず良いところから始めましょう。何が良かったですか？"
            zh: "從正面的部分開始。你喜歡什麼地方？"
        - role: user
          text:
            en: "The location was excellent. It was easy to get around the city by train from there."
            ja: "立地は最高でした。そこから電車で街中を移動するのが簡単でした。"
            zh: "位置非常好。從那裡搭火車在市區四處走動很方便。"
        - role: partner
          text:
            en: "Great! Now use 'however' to introduce the negative part."
            ja: "いいですね！では'however'を使って否定的な部分を導入しましょう。"
            zh: "很好！現在用 'however' 來引入負面的部分。"
        - role: user
          text:
            en: "The location was excellent. However, the room was quite noisy at night due to street traffic."
            ja: "立地は最高でした。しかしながら、夜は交通騒音で部屋がかなりうるさかったです。"
            zh: "位置非常好。然而，由於街上的交通，房間晚上相當吵。"
        - role: partner
          text:
            en: "Perfect structure! What about the staff and service?"
            ja: "完璧な構成！スタッフやサービスはどうでしたか？"
            zh: "結構完美！員工和服務怎麼樣？"
        - role: user
          text:
            en: "The staff at check in was friendly. However, the restaurant service was disappointing and slow."
            ja: "チェックイン時のスタッフはフレンドリーでした。しかしながら、レストランのサービスはがっかりで遅かったです。"
            zh: "辦理入住時的員工很友善。然而，餐廳服務令人失望又慢。"
        - role: partner
          text:
            en: "And what about value for money? Was it overpriced?"
            ja: "コスパはどうでしたか？高すぎましたか？"
            zh: "那性價比呢？定價過高嗎？"
        - role: user
          text:
            en: "The breakfast was overpriced for what you get. I would recommend eating outside the hotel."
            ja: "朝食は内容に対して高すぎました。ホテル外で食べることをお勧めします。"
            zh: "早餐以提供的內容來說定價過高。我建議在飯店外面吃。"
        - role: partner
          text:
            en: "Excellent balanced review! Would you stay there again?"
            ja: "素晴らしいバランスの取れたレビュー！また泊まりますか？"
            zh: "很棒的平衡評論！你會再住那裡嗎？"
        - role: user
          text:
            en: "Maybe. I would appreciate it if they fixed the noise issue. Overall, three out of five stars."
            ja: "多分。騒音の問題を解決してくれると嬉しいです。総合的には5つ星中3つです。"
            zh: "也許吧。如果他們能解決噪音問題，我會很感激。總體來說，五顆星給三顆。"

quiz:
  questionsPerRound: 5
  xpReward: 25
`,Bt=`# Chapter: Week 6 - Opinions & Disagreement
meta:
  id: opinions-and-disagreement
  title:
    en: "Opinions & Disagreement"
    ja: "意見と反論"
    zh: "意見與異議"
  description:
    en: "Learn to disagree politely using softeners. Express opinions without sounding aggressive by saying 'I see your point, but...' instead of 'You are wrong.'"
    ja: "緩和表現を使って丁寧に反論する方法を学びましょう。「あなたは間違っている」ではなく「おっしゃることはわかりますが...」と言って、攻撃的にならずに意見を述べましょう。"
    zh: "學習使用緩和語禮貌地表達不同意見。用「我理解你的觀點，但是...」而不是「你錯了」來表達意見，避免聽起來具有攻擊性。"
  icon: "💬"
  order: 6
  level: intermediate

words:
  # Core Opinion Phrases (Day 1)
  - id: personally
    word:
      en: Personally
      ja: 個人的には
      zh: 就個人而言
    reading: "PER-suh-nuh-lee"
    phonetic: "/ˈpɜːrsənəli/"
    description:
      en: "Used to express your own opinion (not a universal truth)."
      ja: "自分自身の意見を表すときに使う（普遍的な真実ではない）。"
      zh: "用於表達自己的意見（而非普遍真理）。"
    sentence:
      en: "Personally, I believe that pineapple belongs on pizza."
      ja: "個人的には、ピザにパイナップルはありだと思います。"
      zh: "就個人而言，我認為披薩上可以放鳳梨。"

  - id: i-believe
    word:
      en: I believe
      ja: 私は〜と思う
      zh: 我相信
    reading: "ay bi-LEEV"
    phonetic: "/aɪ bɪˈliːv/"
    description:
      en: "Soft way to state an opinion (less aggressive than 'I think')."
      ja: "意見を述べる柔らかい方法（'I think'より攻撃的でない）。"
      zh: "表達意見的柔和方式（比 'I think' 更委婉）。"
    sentence:
      en: "I believe that working from home increases productivity."
      ja: "在宅勤務は生産性を上げると思います。"
      zh: "我相信在家工作可以提高生產力。"

  - id: the-reason-is
    word:
      en: The reason is...
      ja: その理由は...
      zh: 原因是...
    reading: "thuh REE-zuhn iz"
    phonetic: "/ðə ˈriːzən ɪz/"
    description:
      en: "Used to explain why you hold an opinion."
      ja: "なぜその意見を持っているかを説明するときに使う。"
      zh: "用於解釋你持有某種意見的原因。"
    sentence:
      en: "The reason is that I've tried both and I prefer this one."
      ja: "その理由は、両方試してこちらの方が好きだからです。"
      zh: "原因是我兩種都試過，我比較喜歡這個。"

  # Softeners (Day 2)
  - id: seems
    word:
      en: Seems
      ja: 〜のようだ
      zh: 似乎
    reading: "seemz"
    phonetic: "/siːmz/"
    description:
      en: "Makes statements less direct and more tentative."
      ja: "発言をより間接的で暫定的にする。"
      zh: "使陳述變得不那麼直接，更加試探性。"
    sentence:
      en: "That seems like it might be a bit risky."
      ja: "それは少しリスクがあるように見えます。"
      zh: "這似乎有點風險。"

  - id: might
    word:
      en: Might
      ja: 〜かもしれない
      zh: 可能
    reading: "myt"
    phonetic: "/maɪt/"
    description:
      en: "Shows possibility, not certainty. Softens opinions."
      ja: "確実性ではなく可能性を示す。意見を和らげる。"
      zh: "表示可能性而非確定性。使意見變得委婉。"
    sentence:
      en: "That might not be the best approach for this situation."
      ja: "この状況には最適なアプローチではないかもしれません。"
      zh: "這可能不是這種情況的最佳方法。"

  - id: tend-to
    word:
      en: Tend to
      ja: 〜する傾向がある
      zh: 傾向於
    reading: "tend too"
    phonetic: "/tend tuː/"
    description:
      en: "Express general patterns, not absolute rules."
      ja: "絶対的なルールではなく、一般的なパターンを表す。"
      zh: "表達一般模式，而非絕對規則。"
    sentence:
      en: "I tend to think that experience matters more than degrees."
      ja: "私は学歴より経験の方が重要だと思う傾向があります。"
      zh: "我傾向於認為經驗比學歷更重要。"

  - id: kind-of
    word:
      en: Kind of
      ja: ちょっと・やや
      zh: 有點
    reading: "KYND uhv"
    phonetic: "/kaɪnd əv/"
    description:
      en: "Informal softener to make statements less harsh."
      ja: "発言を和らげる非公式な緩和語。"
      zh: "非正式的緩和語，使陳述不那麼尖銳。"
    sentence:
      en: "I kind of disagree with that approach."
      ja: "そのアプローチにはちょっと同意できません。"
      zh: "我有點不同意那個方法。"

  # Debate Idioms (Day 5)
  - id: play-devils-advocate
    word:
      en: Play devil's advocate
      ja: あえて反対意見を述べる
      zh: 唱反調
    reading: "play DEV-uhlz AD-vuh-kuht"
    phonetic: "/pleɪ ˈdevəlz ˈædvəkət/"
    description:
      en: "Argue the opposite side to test an argument, not because you believe it."
      ja: "信じているからではなく、議論をテストするために反対側を主張する。"
      zh: "為了測試論點而提出相反意見，並非因為你相信它。"
    sentence:
      en: "Let me play devil's advocate here - what if AI actually creates more jobs?"
      ja: "ここであえて反対意見を述べますが、もしAIが実際にはもっと多くの仕事を生み出すとしたら？"
      zh: "讓我唱個反調——如果 AI 實際上創造了更多工作呢？"

  - id: sit-on-the-fence
    word:
      en: Sit on the fence
      ja: どっちつかずでいる
      zh: 保持中立
    reading: "sit on thuh fens"
    phonetic: "/sɪt ɒn ðə fens/"
    description:
      en: "Be undecided, not taking either side in a debate."
      ja: "決められない、議論でどちらの側にもつかない。"
      zh: "猶豫不決，不站在辯論的任何一方。"
    sentence:
      en: "I'm still sitting on the fence about this issue."
      ja: "この問題についてはまだどっちつかずです。"
      zh: "關於這個問題，我還在保持中立。"

  - id: see-eye-to-eye
    word:
      en: See eye to eye
      ja: 意見が一致する
      zh: 看法一致
    reading: "see ay too ay"
    phonetic: "/siː aɪ tuː aɪ/"
    description:
      en: "Agree with someone completely on an issue."
      ja: "ある問題について誰かと完全に同意する。"
      zh: "在某個問題上與某人完全一致。"
    sentence:
      en: "We don't really see eye to eye on this topic."
      ja: "この話題については私たちはあまり意見が一致しません。"
      zh: "我們在這個話題上看法不太一致。"

  - id: have-a-point
    word:
      en: Have a point
      ja: 一理ある
      zh: 有道理
    reading: "hav uh poynt"
    phonetic: "/hæv ə pɔɪnt/"
    description:
      en: "Acknowledge that someone's argument is valid."
      ja: "誰かの議論が正当であることを認める。"
      zh: "承認某人的論點是有效的。"
    sentence:
      en: "You have a point, but I still think there are other factors to consider."
      ja: "一理ありますが、まだ考慮すべき他の要因があると思います。"
      zh: "你有道理，但我仍然認為還有其他因素需要考慮。"

  - id: beg-to-differ
    word:
      en: Beg to differ
      ja: 失礼ながら異論がある
      zh: 恕我不同意
    reading: "beg too DIF-er"
    phonetic: "/beɡ tuː ˈdɪfər/"
    description:
      en: "Politely disagree with someone (formal)."
      ja: "丁寧に誰かに反対する（フォーマル）。"
      zh: "禮貌地表示不同意（正式用語）。"
    sentence:
      en: "I beg to differ. The data suggests otherwise."
      ja: "失礼ながら異論があります。データは別のことを示唆しています。"
      zh: "恕我不同意。數據顯示的是另一回事。"

  # Polite Interjections (Day 6)
  - id: if-i-may
    word:
      en: If I may...
      ja: よろしければ...
      zh: 如果可以的話...
    reading: "if ay may"
    phonetic: "/ɪf aɪ meɪ/"
    description:
      en: "Polite way to interrupt or add to a conversation."
      ja: "会話を中断したり付け加えたりする丁寧な方法。"
      zh: "禮貌地打斷或加入對話的方式。"
    sentence:
      en: "If I may, I'd like to add a different perspective."
      ja: "よろしければ、別の視点を加えさせてください。"
      zh: "如果可以的話，我想補充一個不同的觀點。"

  - id: thats-a-good-point-but
    word:
      en: That's a good point, but...
      ja: いい指摘ですが...
      zh: 這是個好觀點，但是...
    reading: "thats uh guud poynt but"
    phonetic: "/ðæts ə ɡʊd pɔɪnt bʌt/"
    description:
      en: "Acknowledge before disagreeing (sandwich technique)."
      ja: "反対する前に認める（サンドイッチ技法）。"
      zh: "在表達不同意之前先肯定對方（三明治技巧）。"
    sentence:
      en: "That's a good point, but I think we need to consider the costs as well."
      ja: "いい指摘ですが、コストも考慮する必要があると思います。"
      zh: "這是個好觀點，但我認為我們也需要考慮成本。"

chat:
  conversations:
    - id: scenario-1-pineapple-debate
      title:
        en: "The Pineapple Debate"
        ja: "パイナップル論争"
        zh: "鳳梨之爭"
      messages:
        - role: partner
          text:
            en: "Okay, I have an unpopular opinion. I think pineapple absolutely belongs on pizza. Fight me!"
            ja: "じゃあ、世間に逆らった意見を言うね。パイナップルは絶対にピザに合うと思う。反論して！"
            zh: "好吧，我有個不受歡迎的觀點。我認為鳳梨絕對可以放在披薩上。來辯論吧！"
        - role: user
          text:
            en: "Hmm, I tend to think that sweet fruits don't belong on savory dishes."
            ja: "うーん、私は甘いフルーツは塩味の料理には合わないと思う傾向があるな。"
            zh: "嗯，我傾向於認為甜的水果不適合放在鹹味料理上。"
        - role: partner
          text:
            en: "But have you actually tried it? The combination of sweet and salty is amazing!"
            ja: "でも実際に食べたことある？甘いのとしょっぱいの組み合わせは最高だよ！"
            zh: "但你實際試過嗎？甜和鹹的組合超棒的！"
        - role: user
          text:
            en: "You have a point. Personally, I believe the texture is the problem - it gets too soggy."
            ja: "一理あるね。個人的には、食感が問題だと思う - ベチャベチャになりすぎる。"
            zh: "你有道理。就個人而言，我認為口感是問題——它變得太濕軟了。"
        - role: partner
          text:
            en: "That seems like it might be a cooking problem, not a pineapple problem!"
            ja: "それはパイナップルの問題じゃなくて、調理の問題のように見えるけど！"
            zh: "這似乎可能是烹飪問題，不是鳳梨的問題！"
        - role: user
          text:
            en: "I beg to differ. The reason is that pineapple releases juice when heated. It's just how it works."
            ja: "失礼ながら異論があるな。その理由は、パイナップルは加熱すると果汁が出るから。そういうものなんだ。"
            zh: "恕我不同意。原因是鳳梨加熱時會釋放汁液。就是這樣運作的。"
        - role: partner
          text:
            en: "Okay, okay. I guess we don't really see eye to eye on this one!"
            ja: "わかった、わかった。この件では私たち意見が一致しないね！"
            zh: "好吧好吧。我想我們在這件事上看法不太一致！"
        - role: user
          text:
            en: "That's a good point, but at least we can agree that pizza itself is delicious!"
            ja: "いい指摘だけど、少なくともピザ自体は美味しいってことには同意できるよね！"
            zh: "這是個好觀點，但至少我們可以同意披薩本身很美味！"

    - id: scenario-2-ai-in-education
      title:
        en: "AI in Education"
        ja: "教育におけるAI"
        zh: "教育中的 AI"
      messages:
        - role: partner
          text:
            en: "I read an article saying AI will replace teachers within 10 years. What do you think?"
            ja: "AIが10年以内に教師に取って代わるという記事を読んだんだ。どう思う？"
            zh: "我讀到一篇文章說 AI 將在10年內取代教師。你怎麼看？"
        - role: user
          text:
            en: "I see your point, but I think that might be an exaggeration. Teachers do more than just deliver information."
            ja: "おっしゃることはわかりますが、それは誇張かもしれないと思います。教師は情報を伝えるだけではありません。"
            zh: "我理解你的觀點，但我認為這可能有點誇張。教師做的不僅僅是傳遞資訊。"
        - role: partner
          text:
            en: "Let me play devil's advocate here. AI can already grade essays and answer student questions 24/7."
            ja: "ここであえて反対意見を述べるね。AIはすでにエッセイを採点したり、24時間学生の質問に答えたりできる。"
            zh: "讓我唱個反調。AI 已經可以批改作文，全天候回答學生問題。"
        - role: user
          text:
            en: "That's an interesting perspective, however, teaching involves emotional support and motivation too."
            ja: "興味深い視点ですが、しかしながら、教えることには感情的なサポートとモチベーションも含まれます。"
            zh: "這是個有趣的觀點，然而，教學也涉及情感支持和激勵。"
        - role: partner
          text:
            en: "I'm not sure I agree with that. Some students might actually prefer learning from AI without judgment."
            ja: "それには同意できないかな。一部の学生は実際には判断されずにAIから学ぶことを好むかもしれない。"
            zh: "我不太同意。有些學生可能實際上更喜歡從 AI 學習，不會被評判。"
        - role: user
          text:
            en: "You have a point, but I tend to think that human connection is essential for learning."
            ja: "一理ありますが、私は人とのつながりが学習には不可欠だと思う傾向があります。"
            zh: "你有道理，但我傾向於認為人際連結對學習至關重要。"
        - role: partner
          text:
            en: "If I may, I think the future might be a hybrid - AI for content, humans for mentorship."
            ja: "よろしければ、未来はハイブリッドかもしれないと思う - コンテンツはAI、メンタリングは人間。"
            zh: "如果可以的話，我認為未來可能是混合模式——AI 負責內容，人類負責指導。"
        - role: user
          text:
            en: "Now that's something I can agree with. I believe that's the most likely outcome."
            ja: "それなら同意できるね。私はそれが最も可能性の高い結果だと思う。"
            zh: "這我可以同意。我相信那是最可能的結果。"
        - role: partner
          text:
            en: "Great! So we finally see eye to eye on something!"
            ja: "やった！ついに何かで意見が一致したね！"
            zh: "太好了！我們終於在某件事上看法一致了！"

    - id: scenario-3-polite-disagreement
      title:
        en: "Polite Disagreement Practice"
        ja: "丁寧な反論練習"
        zh: "禮貌地表達不同意見練習"
      messages:
        - role: partner
          text:
            en: "Let's practice softening statements. How would you politely disagree with 'That's a terrible idea'?"
            ja: "発言を和らげる練習をしよう。「それはひどいアイデアだ」に丁寧に反対するにはどう言う？"
            zh: "我們來練習緩和語氣。你會怎麼禮貌地不同意「那是個糟糕的主意」？"
        - role: user
          text:
            en: "I'm not sure I agree with that. It seems like it might have some challenges."
            ja: "それには同意できるかわかりません。いくつかの課題があるように見えます。"
            zh: "我不太確定我同意。這似乎可能有一些挑戰。"
        - role: partner
          text:
            en: "Perfect! Now how would you soften 'You're completely wrong about this'?"
            ja: "完璧！では「あなたはこれについて完全に間違っている」を和らげるとどうなる？"
            zh: "完美！那你會怎麼緩和「你在這件事上完全錯了」？"
        - role: user
          text:
            en: "I see your point, but I believe there might be another way to look at it."
            ja: "おっしゃることはわかりますが、別の見方があるかもしれないと思います。"
            zh: "我理解你的觀點，但我相信可能有另一種看法。"
        - role: partner
          text:
            en: "Excellent! What if someone says something you really disagree with at work?"
            ja: "素晴らしい！職場で本当に同意できないことを誰かが言ったらどうする？"
            zh: "太棒了！如果在工作中有人說了你真的不同意的話，你會怎麼說？"
        - role: user
          text:
            en: "That's a good point, but if I may, I'd like to suggest an alternative approach."
            ja: "いい指摘ですが、よろしければ、別のアプローチを提案させてください。"
            zh: "這是個好觀點，但如果可以的話，我想建議一個替代方案。"
        - role: partner
          text:
            en: "Now imagine you're sitting on the fence about an issue. How would you express that?"
            ja: "今度はある問題についてどっちつかずだと想像して。どう表現する？"
            zh: "現在想像你對某個問題保持中立。你會怎麼表達？"
        - role: user
          text:
            en: "Honestly, I'm still sitting on the fence about this. I can see both sides of the argument."
            ja: "正直、この件についてはまだどっちつかずです。両方の主張が理解できます。"
            zh: "老實說，關於這件事我還在保持中立。我能理解雙方的論點。"
        - role: partner
          text:
            en: "Great! And finally, how do you politely disagree while acknowledging the other person?"
            ja: "いいね！最後に、相手を認めながら丁寧に反対するにはどうする？"
            zh: "很好！最後，你怎麼在肯定對方的同時禮貌地表示不同意？"
        - role: user
          text:
            en: "You have a point there, but I beg to differ on the conclusion. The reason is that the data shows something different."
            ja: "一理ありますが、結論については失礼ながら異論があります。その理由は、データが別のことを示しているからです。"
            zh: "你有道理，但對於結論我恕我不同意。原因是數據顯示的是不同的結果。"

quiz:
  questionsPerRound: 5
  xpReward: 25
`,$t=`# Chapter: Week 7 - Describing Personality
meta:
  id: describing-personality
  title:
    en: "Describing Personality"
    ja: "性格を描写する"
    zh: "描述個性"
  description:
    en: "Go beyond 'He is nice.' Learn to describe character, habits, and relationships using relative clauses (who/which/that) and precise personality vocabulary."
    ja: "「彼は優しい」を超えて。関係代名詞（who/which/that）と正確な性格語彙を使って、性格、習慣、人間関係を描写する方法を学びましょう。"
    zh: "超越「他很好」。學習使用關係子句（who/which/that）和精確的個性詞彙來描述性格、習慣和人際關係。"
  icon: "🎭"
  order: 7
  level: intermediate

words:
  # Positive Personality Adjectives (Day 1 & 4)
  - id: punctual
    word:
      en: Punctual
      ja: 時間厳守の
      zh: 準時的
    reading: "PUHNK-choo-uhl"
    phonetic: "/ˈpʌŋktʃuəl/"
    description:
      en: "Always arriving or doing things at the expected time."
      ja: "常に予定通りの時間に到着したり物事を行う。"
      zh: "總是準時到達或做事。"
    sentence:
      en: "She's very punctual - she never arrives late to meetings."
      ja: "彼女はとても時間厳守で、会議に遅刻することは決してありません。"
      zh: "她非常準時——從不遲到開會。"

  - id: reliable
    word:
      en: Reliable
      ja: 信頼できる
      zh: 可靠的
    reading: "ri-LY-uh-buhl"
    phonetic: "/rɪˈlaɪəbəl/"
    description:
      en: "Someone you can trust and depend on."
      ja: "信頼して頼りにできる人。"
      zh: "你可以信任和依賴的人。"
    sentence:
      en: "He's the most reliable person I know - he always keeps his promises."
      ja: "彼は私が知っている中で最も信頼できる人です。いつも約束を守ります。"
      zh: "他是我認識的最可靠的人——總是信守承諾。"

  - id: ambitious
    word:
      en: Ambitious
      ja: 野心的な
      zh: 有野心的
    reading: "am-BISH-uhs"
    phonetic: "/æmˈbɪʃəs/"
    description:
      en: "Having a strong desire to succeed or achieve goals."
      ja: "成功したり目標を達成したりする強い願望を持っている。"
      zh: "有強烈的成功或實現目標的願望。"
    sentence:
      en: "She's incredibly ambitious - she wants to become CEO before 40."
      ja: "彼女は非常に野心的で、40歳前にCEOになりたいと思っています。"
      zh: "她非常有野心——想在40歲前成為CEO。"

  - id: easy-going
    word:
      en: Easy-going
      ja: のんびりした
      zh: 隨和的
    reading: "EE-zee-GOH-ing"
    phonetic: "/ˈiːzi ˈɡoʊɪŋ/"
    description:
      en: "Relaxed, not easily worried or stressed."
      ja: "リラックスしていて、心配やストレスを感じにくい。"
      zh: "放鬆的，不容易擔心或緊張。"
    sentence:
      en: "He's quite easy-going - he doesn't stress about small things."
      ja: "彼はかなりのんびりしていて、小さなことでストレスを感じません。"
      zh: "他很隨和——不會為小事煩惱。"

  - id: outgoing
    word:
      en: Outgoing
      ja: 社交的な
      zh: 外向的
    reading: "OWT-goh-ing"
    phonetic: "/ˈaʊtˌɡoʊɪŋ/"
    description:
      en: "Friendly and enjoys meeting new people."
      ja: "フレンドリーで新しい人に会うのを楽しむ。"
      zh: "友善且喜歡認識新朋友。"
    sentence:
      en: "My sister is very outgoing - she can make friends anywhere."
      ja: "私の妹はとても社交的で、どこでも友達を作れます。"
      zh: "我妹妹很外向——她在哪裡都能交到朋友。"

  - id: thoughtful
    word:
      en: Thoughtful
      ja: 思いやりのある
      zh: 體貼的
    reading: "THAWT-fuhl"
    phonetic: "/ˈθɔːtfəl/"
    description:
      en: "Considerate of others' feelings and needs."
      ja: "他人の気持ちやニーズに配慮する。"
      zh: "考慮他人的感受和需求。"
    sentence:
      en: "She's the type of person who remembers everyone's birthday."
      ja: "彼女は皆の誕生日を覚えているタイプの人です。"
      zh: "她是那種記得每個人生日的人。"

  - id: organized
    word:
      en: Organized
      ja: 整理整頓された
      zh: 有條理的
    reading: "OR-guh-nyzd"
    phonetic: "/ˈɔːrɡənaɪzd/"
    description:
      en: "Keeping things in order, planning well."
      ja: "物事を整理し、上手に計画する。"
      zh: "保持事物井井有條，善於規劃。"
    sentence:
      en: "He's extremely organized - his desk is always perfectly tidy."
      ja: "彼は非常に整理整頓されていて、机はいつも完璧に整頓されています。"
      zh: "他非常有條理——他的桌子總是完美整齊。"

  # Negative Personality Adjectives (Day 4)
  - id: messy
    word:
      en: Messy
      ja: だらしない
      zh: 凌亂的
    reading: "MES-ee"
    phonetic: "/ˈmesi/"
    description:
      en: "Untidy, not keeping things in order."
      ja: "散らかっていて、物を整理しない。"
      zh: "不整潔，不保持東西井然有序。"
    sentence:
      en: "I have a friend who is incredibly messy - you can't see his floor!"
      ja: "私には信じられないほどだらしない友達がいます。床が見えないんです！"
      zh: "我有個朋友非常凌亂——你看不到他的地板！"

  - id: moody
    word:
      en: Moody
      ja: 気分屋の
      zh: 喜怒無常的
    reading: "MOO-dee"
    phonetic: "/ˈmuːdi/"
    description:
      en: "Having unpredictable changes in emotions."
      ja: "感情の変化が予測できない。"
      zh: "情緒變化難以預測。"
    sentence:
      en: "He can be quite moody - happy one minute, angry the next."
      ja: "彼はかなり気分屋になることがある。1分前は幸せで、次の瞬間は怒っている。"
      zh: "他有時很喜怒無常——前一分鐘開心，下一分鐘就生氣。"

  - id: stubborn
    word:
      en: Stubborn
      ja: 頑固な
      zh: 固執的
    reading: "STUHB-urn"
    phonetic: "/ˈstʌbərn/"
    description:
      en: "Unwilling to change opinion or behavior."
      ja: "意見や行動を変えたがらない。"
      zh: "不願改變意見或行為。"
    sentence:
      en: "She's so stubborn - once she decides something, you can't change her mind."
      ja: "彼女はとても頑固で、一度決めたら考えを変えられません。"
      zh: "她很固執——一旦她決定了什麼，你就無法改變她的想法。"

  - id: strict
    word:
      en: Strict
      ja: 厳格な
      zh: 嚴格的
    reading: "strikt"
    phonetic: "/strɪkt/"
    description:
      en: "Demanding that rules be followed exactly."
      ja: "ルールを正確に守ることを要求する。"
      zh: "要求嚴格遵守規則。"
    sentence:
      en: "My boss is strict about deadlines - no extensions allowed."
      ja: "私の上司は締め切りに厳格で、延長は認められません。"
      zh: "我的老闆對截止日期很嚴格——不允許延期。"

  # Neutral Personality Adjectives
  - id: introverted
    word:
      en: Introverted
      ja: 内向的な
      zh: 內向的
    reading: "IN-troh-vur-tid"
    phonetic: "/ˈɪntrəvɜːrtɪd/"
    description:
      en: "Preferring quiet time alone rather than social activities."
      ja: "社交活動よりも一人の静かな時間を好む。"
      zh: "喜歡獨處的安靜時間而不是社交活動。"
    sentence:
      en: "I'm quite introverted - I need alone time to recharge."
      ja: "私はかなり内向的で、エネルギーを充電するには一人の時間が必要です。"
      zh: "我很內向——我需要獨處時間來充電。"

  - id: reserved
    word:
      en: Reserved
      ja: 控えめな
      zh: 矜持的
    reading: "ri-ZURVD"
    phonetic: "/rɪˈzɜːrvd/"
    description:
      en: "Quiet and not showing feelings openly."
      ja: "静かで感情をオープンに表さない。"
      zh: "安靜且不公開表露感情。"
    sentence:
      en: "He seems reserved at first, but he opens up once you know him."
      ja: "彼は最初は控えめに見えますが、知り合うと打ち解けます。"
      zh: "他一開始看起來很矜持，但熟了就會敞開心扉。"

  # Personality Idioms (Day 5)
  - id: social-butterfly
    word:
      en: Social butterfly
      ja: 社交的な人
      zh: 社交達人
    reading: "SOH-shuhl BUHT-er-fly"
    phonetic: "/ˈsoʊʃəl ˈbʌtərflaɪ/"
    description:
      en: "Someone who loves parties and is very sociable."
      ja: "パーティーが大好きでとても社交的な人。"
      zh: "喜歡派對且非常善於社交的人。"
    sentence:
      en: "My sister is a total social butterfly - she knows everyone in town."
      ja: "私の妹は完全に社交的な人で、町の誰もが知っています。"
      zh: "我妹妹是個徹底的社交達人——她認識鎮上的每個人。"

  - id: couch-potato
    word:
      en: Couch potato
      ja: カウチポテト
      zh: 沙發馬鈴薯
    reading: "KOWCH puh-TAY-toh"
    phonetic: "/kaʊtʃ pəˈteɪtoʊ/"
    description:
      en: "Someone lazy who watches TV all day."
      ja: "一日中テレビを見ている怠け者。"
      zh: "整天看電視的懶人。"
    sentence:
      en: "My brother is a bit of a couch potato - he binge-watches shows all weekend."
      ja: "私の兄はちょっとしたカウチポテトで、週末中ずっとドラマを一気見します。"
      zh: "我哥哥有點像沙發馬鈴薯——他整個週末都在追劇。"

  - id: down-to-earth
    word:
      en: Down to earth
      ja: 現実的な
      zh: 腳踏實地的
    reading: "down too urth"
    phonetic: "/daʊn tuː ɜːrθ/"
    description:
      en: "Practical, humble, and realistic."
      ja: "実用的で謙虚で現実的。"
      zh: "務實、謙遜、實際。"
    sentence:
      en: "She's really down to earth despite being successful and famous."
      ja: "彼女は成功して有名にもかかわらず、本当に現実的です。"
      zh: "儘管她成功又出名，她真的很腳踏實地。"

  - id: people-person
    word:
      en: People person
      ja: 人付き合いが上手な人
      zh: 善於交際的人
    reading: "PEE-puhl PUR-suhn"
    phonetic: "/ˈpiːpəl ˈpɜːrsən/"
    description:
      en: "Someone who enjoys being around others."
      ja: "他の人と一緒にいることを楽しむ人。"
      zh: "喜歡與他人相處的人。"
    sentence:
      en: "He's a people person - he can talk to anyone about anything."
      ja: "彼は人付き合いが上手な人で、誰とでも何でも話せます。"
      zh: "他善於交際——他可以和任何人聊任何事。"

  - id: old-soul
    word:
      en: Old soul
      ja: 大人びた人
      zh: 老靈魂
    reading: "ohld sohl"
    phonetic: "/oʊld soʊl/"
    description:
      en: "Someone wise beyond their years."
      ja: "年齢以上に賢い人。"
      zh: "智慧超越年齡的人。"
    sentence:
      en: "Even as a child, she was an old soul who preferred reading to playing."
      ja: "子供の頃から、彼女は遊ぶより読書を好む大人びた子でした。"
      zh: "即使是孩子時，她也是個老靈魂，喜歡閱讀勝過玩耍。"

  # Relative Clause Patterns (Day 2 & 3)
  - id: the-kind-of-person-who
    word:
      en: The kind of person who...
      ja: ～するタイプの人
      zh: 那種...的人
    reading: "thuh kynd uhv PUR-suhn hoo"
    phonetic: "/ðə kaɪnd əv ˈpɜːrsən huː/"
    description:
      en: "Pattern to describe someone's typical behavior."
      ja: "誰かの典型的な行動を説明するパターン。"
      zh: "用於描述某人典型行為的句型。"
    sentence:
      en: "He is the kind of person who always wakes up early."
      ja: "彼はいつも早起きするタイプの人です。"
      zh: "他是那種總是早起的人。"

  - id: the-type-of-person-who
    word:
      en: The type of person who...
      ja: ～するような人
      zh: 那類...的人
    reading: "thuh typ uhv PUR-suhn hoo"
    phonetic: "/ðə taɪp əv ˈpɜːrsən huː/"
    description:
      en: "Alternative pattern to describe typical behavior."
      ja: "典型的な行動を説明する別のパターン。"
      zh: "描述典型行為的另一種句型。"
    sentence:
      en: "She's the type of person who always brings homemade cookies to work."
      ja: "彼女は職場にいつも手作りクッキーを持ってくるような人です。"
      zh: "她是那類總是帶自製餅乾去上班的人。"

chat:
  conversations:
    - id: scenario-1-describing-a-friend
      title:
        en: "Describing a Friend"
        ja: "友達を描写する"
        zh: "描述朋友"
      messages:
        - role: partner
          text:
            en: "I heard you're meeting my friend Sarah this weekend. What kind of people do you usually get along with?"
            ja: "今週末、私の友達のサラに会うって聞いたよ。普段どんな人とうまくいくの？"
            zh: "聽說你這週末要見我朋友 Sarah。你通常跟什麼樣的人合得來？"
        - role: user
          text:
            en: "I tend to get along with people who are easy-going and don't take themselves too seriously."
            ja: "私はのんびりしていて、自分をあまり深刻に考えない人とうまくいく傾向があります。"
            zh: "我通常和隨和、不把自己看得太重的人合得來。"
        - role: partner
          text:
            en: "Oh, you'll love Sarah then! She's the kind of person who can laugh at anything."
            ja: "じゃあサラのこと気に入るよ！彼女は何でも笑えるタイプの人なんだ。"
            zh: "那你會喜歡 Sarah 的！她是那種什麼都能笑的人。"
        - role: user
          text:
            en: "That sounds great! I have a friend who loves coffee - does Sarah like cafes?"
            ja: "それはいいね！私にはコーヒー好きの友達がいるんだけど、サラはカフェが好き？"
            zh: "聽起來很棒！我有個喜歡咖啡的朋友——Sarah 喜歡咖啡廳嗎？"
        - role: partner
          text:
            en: "Absolutely! She's a total social butterfly. She knows the best cafes in town."
            ja: "もちろん！彼女は完全に社交的な人で、町で一番いいカフェを知ってるよ。"
            zh: "當然！她是個徹底的社交達人。她知道鎮上最棒的咖啡廳。"
        - role: user
          text:
            en: "Is she outgoing then? I'm quite introverted, so I hope we balance each other out."
            ja: "じゃあ彼女は社交的なの？私はかなり内向的だから、お互いにバランスが取れるといいな。"
            zh: "那她是外向的嗎？我很內向，希望我們能互相平衡。"
        - role: partner
          text:
            en: "Don't worry! She's also very thoughtful. She's the type of person who notices when someone needs space."
            ja: "心配しないで！彼女はとても思いやりもあるよ。誰かがスペースを必要としている時に気づくタイプの人なんだ。"
            zh: "別擔心！她也很體貼。她是那種會注意到別人需要空間的人。"
        - role: user
          text:
            en: "She sounds really down to earth. I bought a gift which I hope she'll like."
            ja: "彼女は本当に現実的そうだね。彼女が気に入ってくれるといいなと思うプレゼントを買ったんだ。"
            zh: "她聽起來很腳踏實地。我買了個禮物希望她會喜歡。"
        - role: partner
          text:
            en: "That's so sweet! She's definitely not the type who cares about expensive things. It's the thought that counts."
            ja: "優しいね！彼女は絶対に高価なものを気にするタイプじゃないよ。気持ちが大切だから。"
            zh: "真貼心！她絕對不是那種在意貴重東西的人。重要的是心意。"

    - id: scenario-2-the-new-colleague
      title:
        en: "The New Colleague"
        ja: "新しい同僚"
        zh: "新同事"
      messages:
        - role: partner
          text:
            en: "Did you meet the new colleague who joined our team last week? What's your impression?"
            ja: "先週チームに加わった新しい同僚に会った？どんな印象？"
            zh: "你見到上週加入我們團隊的新同事了嗎？你的印象如何？"
        - role: user
          text:
            en: "Yes! That's the colleague who sits next to me now. She seems very organized."
            ja: "うん！今私の隣に座っている同僚だよ。彼女はとても整理整頓されているみたい。"
            zh: "見到了！就是現在坐我旁邊的同事。她看起來很有條理。"
        - role: partner
          text:
            en: "Really? How can you tell? I only talked to her briefly."
            ja: "本当？どうしてわかるの？私は少ししか話してないんだ。"
            zh: "真的嗎？你怎麼看出來的？我只跟她簡短聊過。"
        - role: user
          text:
            en: "She's very punctual - she arrives exactly at 9 every day. And her desk is immaculate."
            ja: "彼女はとても時間厳守で、毎日ちょうど9時に到着する。そして机がピカピカなんだ。"
            zh: "她很準時——每天剛好9點到。而且她的桌子一塵不染。"
        - role: partner
          text:
            en: "Sounds like the opposite of Tom! He's so messy - you can never find anything on his desk."
            ja: "トムの正反対みたいだね！彼はすごくだらしなくて、机の上で何も見つからないんだ。"
            zh: "聽起來跟 Tom 完全相反！他很凌亂——你永遠在他桌上找不到東西。"
        - role: user
          text:
            en: "Ha! Tom is reliable though - he's the kind of person who always meets deadlines."
            ja: "はは！でもトムは信頼できるよ。彼はいつも締め切りを守るタイプの人なんだ。"
            zh: "哈！不過 Tom 很可靠——他是那種總是趕上截止日期的人。"
        - role: partner
          text:
            en: "True. What about the new colleague's personality? Is she easy-going or more strict?"
            ja: "確かに。新しい同僚の性格はどう？のんびりしてる、それとも厳格？"
            zh: "對。那新同事的個性呢？她是隨和還是比較嚴格？"
        - role: user
          text:
            en: "She seems ambitious but also down to earth. She mentioned wanting to lead a project someday."
            ja: "彼女は野心的だけど現実的にも見える。いつかプロジェクトをリードしたいって言ってたよ。"
            zh: "她看起來有野心但也很腳踏實地。她提到有一天想帶領一個專案。"
        - role: partner
          text:
            en: "That's great! We need more people who are ambitious. Is she a people person?"
            ja: "いいね！野心的な人がもっと必要だよ。彼女は人付き合いが上手なタイプ？"
            zh: "太好了！我們需要更多有野心的人。她善於交際嗎？"
        - role: user
          text:
            en: "I think she's a bit reserved at first, but she opens up quickly. She's not moody at all."
            ja: "最初は少し控えめだと思うけど、すぐに打ち解けるよ。全然気分屋じゃない。"
            zh: "我覺得她一開始有點矜持，但很快就會敞開心扉。她一點都不喜怒無常。"

    - id: scenario-3-personality-quiz
      title:
        en: "Personality Quiz"
        ja: "性格クイズ"
        zh: "個性測驗"
      messages:
        - role: partner
          text:
            en: "Let's do a fun personality quiz! First question: Would you call yourself a social butterfly or a couch potato?"
            ja: "楽しい性格クイズをしよう！最初の質問：自分のことを社交的な人とカウチポテト、どっちだと思う？"
            zh: "我們來做個有趣的個性測驗！第一題：你會說自己是社交達人還是沙發馬鈴薯？"
        - role: user
          text:
            en: "Honestly, I'm probably more of a couch potato on weekends, but I can be outgoing when I need to be."
            ja: "正直、週末はカウチポテト寄りだと思うけど、必要な時は社交的になれるよ。"
            zh: "老實說，我週末可能比較像沙發馬鈴薯，但需要的時候我也可以很外向。"
        - role: partner
          text:
            en: "Interesting! Next: Are you the kind of person who plans everything, or do you prefer being spontaneous?"
            ja: "面白い！次：あなたは全部計画するタイプの人？それとも自然に任せる方が好き？"
            zh: "有趣！下一題：你是那種計劃好一切的人，還是比較喜歡隨興？"
        - role: user
          text:
            en: "I'm quite organized when it comes to work, but with friends, I'm pretty easy-going."
            ja: "仕事に関してはかなり整理整頓されてるけど、友達といる時はかなりのんびりしてるよ。"
            zh: "工作上我很有條理，但和朋友在一起時我很隨和。"
        - role: partner
          text:
            en: "What about being stubborn? Do people ever say you're the type of person who never changes their mind?"
            ja: "頑固さについては？考えを絶対変えないタイプの人だって言われたことある？"
            zh: "固執呢？有人說過你是那種永遠不改變想法的人嗎？"
        - role: user
          text:
            en: "Ha! My family says I can be stubborn about small things, but I'm open to new ideas at work."
            ja: "はは！家族は小さいことには頑固になれるって言うけど、仕事では新しいアイデアに開かれてるよ。"
            zh: "哈！我家人說我對小事可能會固執，但在工作上我對新想法很開放。"
        - role: partner
          text:
            en: "Would you describe yourself as an old soul? Someone who is wise beyond their years?"
            ja: "自分のことを大人びた人だと思う？年齢以上に賢い人？"
            zh: "你會形容自己是老靈魂嗎？就是智慧超越年齡的人？"
        - role: user
          text:
            en: "Not really. I'm more of a people person who enjoys being around others and having fun."
            ja: "あまりそうじゃないかな。私はむしろ人付き合いが好きで、楽しむことが好きな人だよ。"
            zh: "不太算。我比較是善於交際的人，喜歡和別人在一起玩樂。"
        - role: partner
          text:
            en: "Last question: Are you reliable? The type who always keeps promises?"
            ja: "最後の質問：あなたは信頼できる？いつも約束を守るタイプ？"
            zh: "最後一題：你可靠嗎？那種總是信守承諾的人？"
        - role: user
          text:
            en: "I try to be! I'm the kind of person who hates being late or breaking commitments."
            ja: "そうなるよう努力してる！私は遅刻したり約束を破ったりするのが嫌いなタイプの人なんだ。"
            zh: "我努力做到！我是那種討厭遲到或違背承諾的人。"
        - role: partner
          text:
            en: "Perfect! Based on your answers, you seem like a reliable, easy-going people person with some couch potato tendencies!"
            ja: "完璧！回答から見ると、あなたはちょっとカウチポテト傾向のある、信頼できる、のんびりした、人付き合いが上手な人みたいだね！"
            zh: "完美！根據你的回答，你似乎是個可靠、隨和、善於交際的人，帶有一點沙發馬鈴薯傾向！"

quiz:
  questionsPerRound: 5
  xpReward: 25
`,qt=`# Chapter: Week 8 - Entertainment & Reviews
meta:
  id: entertainment-and-reviews
  title:
    en: "Entertainment & Reviews"
    ja: "エンターテインメントとレビュー"
    zh: "娛樂與評論"
  description:
    en: "Talk about movies, books, and shows like a pro! Master the -ED vs -ING adjective distinction and learn to give recommendations and reviews."
    ja: "映画、本、番組についてプロのように話そう！-EDと-ING形容詞の違いをマスターし、おすすめやレビューの仕方を学びましょう。"
    zh: "像專家一樣談論電影、書籍和節目！掌握 -ED 與 -ING 形容詞的區別，學會給予推薦和評論。"
  icon: "🎬"
  order: 8
  level: intermediate

words:
  # Review Vocabulary (Day 1 - Nouns/Adjectives)
  - id: masterpiece
    word:
      en: Masterpiece
      ja: 傑作
      zh: 傑作
    reading: "MAS-ter-pees"
    phonetic: "/ˈmæstərpiːs/"
    description:
      en: "A work of outstanding quality or skill."
      ja: "卓越した品質や技術の作品。"
      zh: "品質或技術出眾的作品。"
    sentence:
      en: "It's a masterpiece - absolutely gripping from start to finish."
      ja: "それは傑作です。最初から最後まで完全に引き込まれます。"
      zh: "這是一部傑作——從頭到尾都扣人心弦。"

  - id: gripping
    word:
      en: Gripping
      ja: 引き込まれる
      zh: 扣人心弦的
    reading: "GRIP-ing"
    phonetic: "/ˈɡrɪpɪŋ/"
    description:
      en: "So exciting that it holds your attention completely."
      ja: "とてもエキサイティングで、完全に注意を引きつける。"
      zh: "非常刺激，完全吸引你的注意力。"
    sentence:
      en: "The thriller was so gripping that I couldn't stop watching."
      ja: "そのスリラーはとても引き込まれて、見るのをやめられませんでした。"
      zh: "那部驚悚片太扣人心弦了，我停不下來。"

  - id: hilarious
    word:
      en: Hilarious
      ja: 爆笑の
      zh: 爆笑的
    reading: "hih-LAIR-ee-uhs"
    phonetic: "/hɪˈleriəs/"
    description:
      en: "Extremely funny."
      ja: "非常に面白い。"
      zh: "極度好笑。"
    sentence:
      en: "That comedy was hilarious - I laughed until I cried."
      ja: "そのコメディは爆笑でした。泣くまで笑いました。"
      zh: "那部喜劇太爆笑了——我笑到哭。"

  - id: thought-provoking
    word:
      en: Thought-provoking
      ja: 考えさせられる
      zh: 發人深省的
    reading: "THAWT-pruh-voh-king"
    phonetic: "/ˈθɔːt prəˌvoʊkɪŋ/"
    description:
      en: "Making you think deeply about something."
      ja: "何かについて深く考えさせる。"
      zh: "讓你對某事深思。"
    sentence:
      en: "That documentary was really thought-provoking - I'm still thinking about it."
      ja: "そのドキュメンタリーは本当に考えさせられました。まだ考えています。"
      zh: "那部紀錄片真的發人深省——我還在想著它。"

  - id: overrated
    word:
      en: Overrated
      ja: 過大評価された
      zh: 被高估的
    reading: "oh-ver-RAY-tid"
    phonetic: "/ˌoʊvərˈreɪtɪd/"
    description:
      en: "Given more praise than deserved."
      ja: "実際よりも高く評価されている。"
      zh: "得到比應得的更多讚揚。"
    sentence:
      en: "I found it a bit overrated, to be honest."
      ja: "正直なところ、ちょっと過大評価されていると思いました。"
      zh: "老實說，我覺得它有點被高估了。"

  - id: underwhelming
    word:
      en: Underwhelming
      ja: 期待外れの
      zh: 令人失望的
    reading: "uhn-der-WELM-ing"
    phonetic: "/ˌʌndərˈwelmɪŋ/"
    description:
      en: "Failing to impress or meet expectations."
      ja: "印象を与えられない、期待に応えられない。"
      zh: "未能給人留下深刻印象或達到期望。"
    sentence:
      en: "The sequel was pretty underwhelming compared to the original."
      ja: "続編はオリジナルに比べてかなり期待外れでした。"
      zh: "續集與原作相比相當令人失望。"

  # -ED/-ING Adjective Pairs (Day 2 - Verbs/Adjectives)
  - id: bored-boring
    word:
      en: Bored / Boring
      ja: 退屈している / 退屈な
      zh: 感到無聊的 / 無聊的
    reading: "bord / BOR-ing"
    phonetic: "/bɔːrd/ /ˈbɔːrɪŋ/"
    description:
      en: "Bored = how you feel; Boring = describes the thing."
      ja: "Bored = あなたの気持ち；Boring = 物事を描写する。"
      zh: "Bored = 你的感受；Boring = 描述事物。"
    sentence:
      en: "The movie was boring, so I was bored."
      ja: "映画が退屈だったので、私は退屈でした。"
      zh: "電影很無聊，所以我感到無聊。"

  - id: excited-exciting
    word:
      en: Excited / Exciting
      ja: ワクワクしている / ワクワクする
      zh: 興奮的 / 令人興奮的
    reading: "ik-SY-tid / ik-SY-ting"
    phonetic: "/ɪkˈsaɪtɪd/ /ɪkˈsaɪtɪŋ/"
    description:
      en: "Excited = how you feel; Exciting = describes the thing."
      ja: "Excited = あなたの気持ち；Exciting = 物事を描写する。"
      zh: "Excited = 你的感受；Exciting = 描述事物。"
    sentence:
      en: "I was so excited because the game was exciting."
      ja: "ゲームがワクワクするものだったので、とてもワクワクしました。"
      zh: "我非常興奮因為這場比賽很刺激。"

  - id: interested-interesting
    word:
      en: Interested / Interesting
      ja: 興味がある / 興味深い
      zh: 感興趣的 / 有趣的
    reading: "IN-ter-es-tid / IN-ter-es-ting"
    phonetic: "/ˈɪntrəstɪd/ /ˈɪntrəstɪŋ/"
    description:
      en: "Interested = how you feel; Interesting = describes the thing."
      ja: "Interested = あなたの気持ち；Interesting = 物事を描写する。"
      zh: "Interested = 你的感受；Interesting = 描述事物。"
    sentence:
      en: "I'm interested in sci-fi movies because they're so interesting."
      ja: "SF映画はとても興味深いので、興味があります。"
      zh: "我對科幻電影感興趣因為它們很有趣。"

  - id: fascinated-fascinating
    word:
      en: Fascinated / Fascinating
      ja: 魅了された / 魅力的な
      zh: 著迷的 / 迷人的
    reading: "FAS-ih-nay-tid / FAS-ih-nay-ting"
    phonetic: "/ˈfæsɪneɪtɪd/ /ˈfæsɪneɪtɪŋ/"
    description:
      en: "Fascinated = how you feel; Fascinating = describes the thing."
      ja: "Fascinated = あなたの気持ち；Fascinating = 物事を描写する。"
      zh: "Fascinated = 你的感受；Fascinating = 描述事物。"
    sentence:
      en: "That documentary was fascinating - I was completely fascinated."
      ja: "そのドキュメンタリーは魅力的で、完全に魅了されました。"
      zh: "那部紀錄片很迷人——我完全著迷了。"

  - id: disappointed-disappointing
    word:
      en: Disappointed / Disappointing
      ja: がっかりした / がっかりさせる
      zh: 失望的 / 令人失望的
    reading: "dis-uh-POIN-tid / dis-uh-POIN-ting"
    phonetic: "/ˌdɪsəˈpɔɪntɪd/ /ˌdɪsəˈpɔɪntɪŋ/"
    description:
      en: "Disappointed = how you feel; Disappointing = describes the thing."
      ja: "Disappointed = あなたの気持ち；Disappointing = 物事を描写する。"
      zh: "Disappointed = 你的感受；Disappointing = 描述事物。"
    sentence:
      en: "The ending was disappointing - I felt so disappointed."
      ja: "結末はがっかりさせるもので、とてもがっかりしました。"
      zh: "結局令人失望——我感到非常失望。"

  # Media Verbs (Day 5)
  - id: binge-watch
    word:
      en: Binge-watch
      ja: 一気見する
      zh: 追劇
    reading: "BINJ-woch"
    phonetic: "/bɪndʒ wɑːtʃ/"
    description:
      en: "Watch many episodes or a whole series in one sitting."
      ja: "一度に多くのエピソードや全シリーズを見る。"
      zh: "一次看很多集或整部劇。"
    sentence:
      en: "I binge-watched the entire season last weekend."
      ja: "先週末、シーズン全部を一気見しました。"
      zh: "我上週末追完了整季。"

  - id: spoil
    word:
      en: Spoil
      ja: ネタバレする
      zh: 劇透
    reading: "spoyl"
    phonetic: "/spɔɪl/"
    description:
      en: "Reveal important plot details, ruining the surprise."
      ja: "重要なプロット詳細を明かして驚きを台無しにする。"
      zh: "透露重要劇情細節，破壞驚喜。"
    sentence:
      en: "Don't spoil it for me! I haven't seen the finale yet."
      ja: "ネタバレしないで！まだ最終話見てないんだ。"
      zh: "別劇透！我還沒看完結篇。"

  - id: stream
    word:
      en: Stream
      ja: ストリーミングする
      zh: 串流
    reading: "streem"
    phonetic: "/striːm/"
    description:
      en: "Watch content online without downloading."
      ja: "ダウンロードせずにオンラインでコンテンツを見る。"
      zh: "不下載而在線上觀看內容。"
    sentence:
      en: "You can stream it on Netflix - no need to download."
      ja: "Netflixでストリーミングできるよ。ダウンロード不要だよ。"
      zh: "你可以在 Netflix 上串流——不用下載。"

  - id: subtitles
    word:
      en: Subtitles
      ja: 字幕
      zh: 字幕
    reading: "SUHB-ty-tuhlz"
    phonetic: "/ˈsʌbˌtaɪtəlz/"
    description:
      en: "Text at the bottom of the screen showing dialogue."
      ja: "セリフを表示する画面下部のテキスト。"
      zh: "螢幕底部顯示對話的文字。"
    sentence:
      en: "I prefer watching with subtitles - it helps me understand better."
      ja: "字幕付きで見る方が好きです。理解しやすくなります。"
      zh: "我比較喜歡看有字幕的——幫助我更好理解。"

  # Recommendation Phrases (Day 4)
  - id: must-watch
    word:
      en: Must-watch
      ja: 必見
      zh: 必看
    reading: "muhst-woch"
    phonetic: "/mʌst wɑːtʃ/"
    description:
      en: "Something so good that everyone should see it."
      ja: "みんなが見るべきほど良いもの。"
      zh: "好到每個人都應該看的東西。"
    sentence:
      en: "This documentary is a must-watch for anyone interested in history."
      ja: "このドキュメンタリーは歴史に興味がある人は必見です。"
      zh: "這部紀錄片是對歷史感興趣的人必看的。"

  - id: right-up-your-alley
    word:
      en: Right up your alley
      ja: あなた好み
      zh: 正合你的胃口
    reading: "ryt uhp yor AL-ee"
    phonetic: "/raɪt ʌp jɔːr ˈæli/"
    description:
      en: "Perfect for someone's taste or interests."
      ja: "誰かの趣味や興味にぴったり。"
      zh: "完全符合某人的口味或興趣。"
    sentence:
      en: "It's right up your alley - you would love it!"
      ja: "あなた好みだよ。きっと気に入るよ！"
      zh: "正合你的胃口——你會喜歡的！"

chat:
  conversations:
    - id: scenario-1-movie-night-discussion
      title:
        en: "Movie Night Discussion"
        ja: "映画鑑賞後の感想"
        zh: "電影之夜討論"
      messages:
        - role: partner
          text:
            en: "So, what did you think of the movie? I heard it's supposed to be a masterpiece."
            ja: "で、映画どうだった？傑作らしいって聞いたんだけど。"
            zh: "那麼，你覺得這部電影怎麼樣？我聽說它應該是部傑作。"
        - role: user
          text:
            en: "Honestly, the first half was boring, so I was quite bored. But then it got really exciting!"
            ja: "正直、前半は退屈で、かなり退屈だった。でもその後、本当にワクワクしたよ！"
            zh: "老實說，前半部很無聊，所以我蠻無聊的。但後來變得很刺激！"
        - role: partner
          text:
            en: "I know what you mean! I was so excited during the final scene. Did you find the plot confusing at all?"
            ja: "わかる！最後のシーンですごくワクワクした。プロットは混乱した？"
            zh: "我懂你意思！最後一幕我超興奮的。你覺得劇情有讓你困惑嗎？"
        - role: user
          text:
            en: "A little bit. Some parts were confusing, so I was confused about who the villain was at first."
            ja: "ちょっとね。いくつかの部分が混乱させるものだったから、最初は誰が悪役かわからなかった。"
            zh: "有一點。有些地方很讓人困惑，所以我一開始搞不清誰是反派。"
        - role: partner
          text:
            en: "That's the twist though! What about the documentary part? I found it fascinating."
            ja: "でもそれがどんでん返しだよ！ドキュメンタリーの部分は？私は魅力的だと思った。"
            zh: "那就是轉折啊！那紀錄片的部分呢？我覺得很迷人。"
        - role: user
          text:
            en: "That documentary was fascinating - I was completely fascinated by the historical details."
            ja: "そのドキュメンタリーは魅力的だった。歴史的な詳細に完全に魅了されたよ。"
            zh: "那部紀錄片很迷人——我完全被歷史細節迷住了。"
        - role: partner
          text:
            en: "Me too! Although some critics say the movie is overrated. What do you think?"
            ja: "私も！でも一部の批評家は映画が過大評価されてるって言ってるけど。どう思う？"
            zh: "我也是！雖然有些評論家說這電影被高估了。你怎麼想？"
        - role: user
          text:
            en: "I don't think it's overrated. It's gripping and thought-provoking. The ending left me amazed!"
            ja: "過大評価されてるとは思わない。引き込まれるし、考えさせられる。結末には驚いたよ！"
            zh: "我不覺得它被高估。它扣人心弦又發人深省。結局讓我驚嘆！"
        - role: partner
          text:
            en: "I felt the same way - the ending was amazing! So overall, worth watching?"
            ja: "同感！結末は素晴らしかった！全体的に、見る価値ある？"
            zh: "我也有同感——結局很精彩！所以整體來說，值得看嗎？"
        - role: user
          text:
            en: "Definitely! It's a must-watch. I wasn't disappointed at all - I was actually really impressed."
            ja: "絶対に！必見だよ。全然がっかりしなかった。むしろ本当に感動した。"
            zh: "絕對！必看的。我一點都不失望——我其實印象深刻。"

    - id: scenario-2-the-recommendation
      title:
        en: "The Recommendation"
        ja: "おすすめ"
        zh: "推薦"
      messages:
        - role: partner
          text:
            en: "I'm looking for something new to watch this weekend. Any recommendations?"
            ja: "今週末何か新しいもの見たいんだけど。何かおすすめある？"
            zh: "我在找這週末看的新東西。有什麼推薦嗎？"
        - role: user
          text:
            en: "You have to check out this new series on Netflix! I binge-watched the entire season last weekend."
            ja: "Netflixの新しいシリーズを見て！先週末、シーズン全部を一気見したんだ。"
            zh: "你一定要看看 Netflix 上這部新劇！我上週末追完了整季。"
        - role: partner
          text:
            en: "Really? What's it about? I'm interested in sci-fi and mystery shows."
            ja: "本当？何の話？私はSFとミステリー番組に興味があるんだ。"
            zh: "真的嗎？是關於什麼的？我對科幻和懸疑劇感興趣。"
        - role: user
          text:
            en: "It's right up your alley then! It's a sci-fi thriller - super gripping and thought-provoking."
            ja: "じゃああなた好みだよ！SFスリラーで、すごく引き込まれて考えさせられるよ。"
            zh: "那正合你的胃口！是部科幻驚悚片——超扣人心弦又發人深省。"
        - role: partner
          text:
            en: "Sounds interesting! Can I stream it easily? I don't want to download anything."
            ja: "面白そう！簡単にストリーミングできる？何もダウンロードしたくないんだ。"
            zh: "聽起來很有趣！可以輕鬆串流嗎？我不想下載任何東西。"
        - role: user
          text:
            en: "Yes, you can stream it on Netflix. I prefer watching with subtitles - it helps catch all the details."
            ja: "うん、Netflixでストリーミングできるよ。字幕付きで見るのが好きなんだ。詳細を全部把握できるから。"
            zh: "可以，你可以在 Netflix 上串流。我喜歡看有字幕的——幫助抓住所有細節。"
        - role: partner
          text:
            en: "Good tip! Don't spoil anything for me though! I hate knowing the ending in advance."
            ja: "いいヒント！でもネタバレしないでね！事前に結末を知るのは嫌なんだ。"
            zh: "好建議！不過別劇透給我！我討厭提前知道結局。"
        - role: user
          text:
            en: "Don't worry, I won't spoil it for you! Just trust me - you would love it. It's a must-watch."
            ja: "心配しないで、ネタバレしないよ！信じて。きっと気に入るよ。必見だから。"
            zh: "別擔心，我不會劇透的！相信我——你會喜歡的。必看的。"
        - role: partner
          text:
            en: "What about the acting? Is it convincing?"
            ja: "演技はどう？説得力ある？"
            zh: "演技呢？有說服力嗎？"
        - role: user
          text:
            en: "The acting is amazing! The lead actress was nominated for an award. You won't be disappointed."
            ja: "演技は素晴らしい！主演女優は賞にノミネートされたんだ。がっかりしないよ。"
            zh: "演技很精彩！女主角還被提名獎項。你不會失望的。"

    - id: scenario-3-the-critic
      title:
        en: "The Critic"
        ja: "批評家"
        zh: "評論家"
      messages:
        - role: partner
          text:
            en: "What kind of movies are you interested in? I'm curious about your taste."
            ja: "どんな映画に興味がある？あなたの好みが気になるんだ。"
            zh: "你對什麼類型的電影感興趣？我很好奇你的品味。"
        - role: user
          text:
            en: "I'm interested in sci-fi movies and documentaries. Action films can be entertaining but often feel predictable."
            ja: "SF映画とドキュメンタリーに興味があるよ。アクション映画は楽しめるけど、よく予測可能に感じる。"
            zh: "我對科幻電影和紀錄片感興趣。動作片可以很有娛樂性但常常感覺可預測。"
        - role: partner
          text:
            en: "Have you seen any good documentaries recently? I want something thought-provoking."
            ja: "最近いいドキュメンタリー見た？考えさせられるものが見たいんだ。"
            zh: "你最近有看到什麼好的紀錄片嗎？我想要發人深省的。"
        - role: user
          text:
            en: "Yes! There's one about climate change that was fascinating. I was fascinated by the research they showed."
            ja: "うん！気候変動についてのがあって、魅力的だったよ。見せてくれた研究に魅了されたんだ。"
            zh: "有！有一部關於氣候變遷的很迷人。我被他們展示的研究迷住了。"
        - role: partner
          text:
            en: "What makes a movie disappointing for you? When do you feel disappointed?"
            ja: "何が映画をがっかりさせる？いつがっかりする？"
            zh: "什麼讓一部電影令人失望？你什麼時候感到失望？"
        - role: user
          text:
            en: "I feel disappointed when the ending is underwhelming after a great build-up. That's so disappointing!"
            ja: "素晴らしい盛り上がりの後に結末が期待外れだとがっかりする。それはすごくがっかりするんだ！"
            zh: "當精彩的鋪陳後結局卻令人失望時我會感到失望。那真的很令人失望！"
        - role: partner
          text:
            en: "I totally agree. What about horror movies? Are you terrified easily?"
            ja: "完全に同意。ホラー映画は？簡単に怖がる？"
            zh: "我完全同意。恐怖片呢？你容易被嚇到嗎？"
        - role: user
          text:
            en: "Horror movies are terrifying! I get terrified during jump scares, but I find psychological horror more interesting."
            ja: "ホラー映画は恐ろしい！ジャンプスケアでは怖くなるけど、サイコホラーの方が興味深いと思う。"
            zh: "恐怖片很可怕！驚嚇畫面會嚇到我，但我覺得心理恐怖更有趣。"
        - role: partner
          text:
            en: "Do you think most blockbusters are overrated these days?"
            ja: "最近のほとんどの大作映画は過大評価されてると思う？"
            zh: "你覺得現在大部分大片都被高估了嗎？"
        - role: user
          text:
            en: "Some are overrated, yes. I find sequels underwhelming compared to originals. But there are still some hilarious comedies!"
            ja: "いくつかは過大評価されてる、うん。続編はオリジナルに比べて期待外れだと思う。でもまだ爆笑コメディもあるよ！"
            zh: "有些是被高估了，對。我覺得續集比原作令人失望。但還是有一些爆笑的喜劇！"
        - role: partner
          text:
            en: "What's the last movie that left you amazed?"
            ja: "最後に驚かされた映画は何？"
            zh: "最後一部讓你驚嘆的電影是什麼？"
        - role: user
          text:
            en: "A Korean thriller last month - it was amazing! The plot twists were incredible. Definitely a masterpiece."
            ja: "先月の韓国スリラー。素晴らしかった！どんでん返しが信じられなかった。間違いなく傑作だよ。"
            zh: "上個月的一部韓國驚悚片——太精彩了！劇情轉折令人難以置信。絕對是傑作。"

quiz:
  questionsPerRound: 5
  xpReward: 25
`,Ut=`# Chapter: Week 1 - Identity & Background
meta:
  id: identity-and-background
  title:
    en: "Identity & Background"
    ja: "アイデンティティと経歴"
    zh: "身份與背景"
  description:
    en: "Introduce yourself professionally and personally without sounding like a textbook."
    ja: "教科書のようにならずに、プロフェッショナルかつ個人的に自己紹介しましょう。"
    zh: "學習專業且自然地介紹自己，不要像教科書一樣生硬。"
  icon: "🪪"
  order: 1
  level: intermediate

words:
  # Personality Adjectives
  - id: innovative
    word:
      en: Innovative
      ja: 革新的な
      zh: 創新的
    reading: "IN-oh-vay-tiv"
    phonetic: "/ˈɪnəveɪtɪv/"
    description:
      en: "Introducing new ideas or methods."
      ja: "新しいアイデアや方法を導入する。"
      zh: "引進新想法或方法。"
    sentence:
      en: "Steve Jobs was known for his innovative approach to technology."
      ja: "スティーブ・ジョブズはテクノロジーへの革新的なアプローチで知られていました。"
      zh: "史蒂夫·賈伯斯以他對科技的創新方法而聞名。"

  - id: resilient
    word:
      en: Resilient
      ja: 回復力のある
      zh: 有韌性的
    reading: "ri-ZIL-ee-uhnt"
    phonetic: "/rɪˈzɪliənt/"
    description:
      en: "Able to recover quickly from difficulties."
      ja: "困難から素早く回復できる。"
      zh: "能夠從困難中快速恢復。"
    sentence:
      en: "She is resilient and never gives up when facing challenges."
      ja: "彼女は回復力があり、困難に直面しても決して諦めません。"
      zh: "她很有韌性，面對挑戰時從不放棄。"

  - id: ambitious
    word:
      en: Ambitious
      ja: 野心的な
      zh: 有抱負的
    reading: "am-BISH-uhs"
    phonetic: "/æmˈbɪʃəs/"
    description:
      en: "Having a strong desire to succeed."
      ja: "成功への強い意欲がある。"
      zh: "有強烈成功慾望的。"
    sentence:
      en: "He is ambitious and always sets high goals for himself."
      ja: "彼は野心的で、常に高い目標を設定しています。"
      zh: "他很有抱負，總是為自己設定高目標。"

  - id: resourceful
    word:
      en: Resourceful
      ja: 機知に富んだ
      zh: 足智多謀的
    reading: "ri-SORS-fuhl"
    phonetic: "/rɪˈsɔːrsfəl/"
    description:
      en: "Good at finding ways to solve problems."
      ja: "問題を解決する方法を見つけるのが得意。"
      zh: "善於找到解決問題的方法。"
    sentence:
      en: "A resourceful person can adapt to any situation."
      ja: "機知に富んだ人はどんな状況にも適応できます。"
      zh: "足智多謀的人能適應任何情況。"

  # Grammar: Used to vs. Usually
  - id: used-to
    word:
      en: Used to
      ja: 以前は〜していた
      zh: 曾經
    reading: "YOOST too"
    phonetic: "/juːst tuː/"
    description:
      en: "Past habit that stopped. Not anymore."
      ja: "もうしなくなった過去の習慣。"
      zh: "過去的習慣，現在不再做了。"
    sentence:
      en: "I used to play piano as a child, but I stopped in high school."
      ja: "子供の頃はピアノを弾いていましたが、高校でやめました。"
      zh: "我小時候曾經彈鋼琴，但高中就停了。"

  - id: usually
    word:
      en: Usually
      ja: 普段は
      zh: 通常
    reading: "YOO-zhoo-uh-lee"
    phonetic: "/ˈjuːʒuəli/"
    description:
      en: "Present habit. What you do regularly now."
      ja: "現在の習慣。今定期的にすること。"
      zh: "現在的習慣。你現在經常做的事。"
    sentence:
      en: "I usually go to the gym on weekends."
      ja: "週末は普段ジムに行きます。"
      zh: "我通常週末去健身房。"

  # Phrasal Verbs (Life Stages)
  - id: grow-up
    word:
      en: Grow up
      ja: 成長する
      zh: 長大
    reading: "GROH uhp"
    phonetic: "/ɡroʊ ʌp/"
    description:
      en: "Mature, become an adult."
      ja: "成熟する、大人になる。"
      zh: "成熟，變成大人。"
    sentence:
      en: "I grew up in a small town near the mountains."
      ja: "私は山の近くの小さな町で育ちました。"
      zh: "我在山附近的小鎮長大。"

  - id: settle-down
    word:
      en: Settle down
      ja: 落ち着く
      zh: 定居
    reading: "SET-uhl down"
    phonetic: "/ˈsetl daʊn/"
    description:
      en: "Buy a house, get married, stay in one place."
      ja: "家を買う、結婚する、一か所に住む。"
      zh: "買房子、結婚、在一個地方定居。"
    sentence:
      en: "After traveling for years, she decided to settle down in Tokyo."
      ja: "何年も旅行した後、彼女は東京に落ち着くことにしました。"
      zh: "旅行多年後，她決定在東京定居。"

  - id: take-up
    word:
      en: Take up
      ja: 始める
      zh: 開始從事
    reading: "TAYK uhp"
    phonetic: "/teɪk ʌp/"
    description:
      en: "Start a new hobby or activity."
      ja: "新しい趣味や活動を始める。"
      zh: "開始一個新的嗜好或活動。"
    sentence:
      en: "I took up photography during the pandemic."
      ja: "パンデミック中に写真を始めました。"
      zh: "我在疫情期間開始學攝影。"

  # Professional Verbs (avoid "do")
  - id: manage
    word:
      en: Manage
      ja: 管理する
      zh: 管理
    reading: "MAN-ij"
    phonetic: "/ˈmænɪdʒ/"
    description:
      en: "Be in charge of people or projects."
      ja: "人やプロジェクトを担当する。"
      zh: "負責人員或專案。"
    sentence:
      en: "I manage a team of five software developers."
      ja: "私は5人のソフトウェア開発者のチームを管理しています。"
      zh: "我管理一個五人的軟體開發團隊。"

  - id: design
    word:
      en: Design
      ja: 設計する
      zh: 設計
    reading: "di-ZYN"
    phonetic: "/dɪˈzaɪn/"
    description:
      en: "Create plans or drawings for something."
      ja: "何かの計画や図面を作成する。"
      zh: "為某事物創建計劃或圖紙。"
    sentence:
      en: "She designs user interfaces for mobile apps."
      ja: "彼女はモバイルアプリのユーザーインターフェースを設計しています。"
      zh: "她為手機應用程式設計使用者介面。"

  - id: analyze
    word:
      en: Analyze
      ja: 分析する
      zh: 分析
    reading: "AN-uh-lyz"
    phonetic: "/ˈænəlaɪz/"
    description:
      en: "Examine something in detail."
      ja: "何かを詳細に調べる。"
      zh: "詳細檢查某事物。"
    sentence:
      en: "My job is to analyze market trends and write reports."
      ja: "私の仕事は市場動向を分析してレポートを書くことです。"
      zh: "我的工作是分析市場趨勢並撰寫報告。"

  - id: support
    word:
      en: Support
      ja: サポートする
      zh: 支援
    reading: "suh-PORT"
    phonetic: "/səˈpɔːrt/"
    description:
      en: "Help or assist someone or something."
      ja: "誰かや何かを助ける。"
      zh: "幫助或協助某人或某事。"
    sentence:
      en: "I support clients with technical issues every day."
      ja: "私は毎日クライアントの技術的な問題をサポートしています。"
      zh: "我每天協助客戶處理技術問題。"

  - id: coordinate
    word:
      en: Coordinate
      ja: 調整する
      zh: 協調
    reading: "koh-OR-di-nayt"
    phonetic: "/koʊˈɔːrdɪneɪt/"
    description:
      en: "Organize different elements to work together."
      ja: "異なる要素を組織して一緒に機能させる。"
      zh: "組織不同元素使其一起運作。"
    sentence:
      en: "He coordinates between the design and engineering teams."
      ja: "彼はデザインチームとエンジニアリングチームの間を調整しています。"
      zh: "他協調設計團隊和工程團隊之間的工作。"

chat:
  conversations:
    - id: scenario-1-elevator-pitch
      title:
        en: "The Elevator Pitch"
        ja: "エレベーターピッチ"
        zh: "電梯簡報"
      messages:
        - role: partner
          text:
            en: "Hi! I don't think we've met. What do you do?"
            ja: "こんにちは！初めましてですね。お仕事は何をされていますか？"
            zh: "嗨！我們好像沒見過。你是做什麼的？"
        - role: user
          text:
            en: "Hi! I'm a product manager. I coordinate between design and engineering teams to build mobile apps."
            ja: "こんにちは！プロダクトマネージャーです。モバイルアプリを作るためにデザインチームとエンジニアリングチームの間を調整しています。"
            zh: "嗨！我是產品經理。我協調設計和工程團隊來開發手機應用程式。"
        - role: partner
          text:
            en: "That sounds interesting! How did you get into that field?"
            ja: "面白そうですね！どうやってその分野に入ったんですか？"
            zh: "聽起來很有趣！你是怎麼進入這個領域的？"
        - role: user
          text:
            en: "I used to work as a software developer, but I took up project management three years ago."
            ja: "以前はソフトウェア開発者として働いていましたが、3年前にプロジェクト管理を始めました。"
            zh: "我曾經是軟體開發人員，但三年前開始從事專案管理。"
        - role: partner
          text:
            en: "Nice career change! What do you enjoy most about it?"
            ja: "素敵なキャリアチェンジですね！一番楽しいことは何ですか？"
            zh: "很棒的職業轉換！你最喜歡什麼部分？"
        - role: user
          text:
            en: "I enjoy working with people. You have to be resourceful and resilient in this role."
            ja: "人と働くのが楽しいです。この役割では機知に富んで回復力がないといけません。"
            zh: "我喜歡與人合作。這個角色需要足智多謀和有韌性。"

    - id: scenario-2-past-and-present
      title:
        en: "Past vs. Present Habits"
        ja: "過去と現在の習慣"
        zh: "過去與現在的習慣"
      messages:
        - role: partner
          text:
            en: "Where did you grow up?"
            ja: "どこで育ちましたか？"
            zh: "你在哪裡長大的？"
        - role: user
          text:
            en: "I grew up in a small town near the coast. Very different from city life."
            ja: "海岸近くの小さな町で育ちました。都会の生活とは全然違います。"
            zh: "我在海邊附近的小鎮長大。跟城市生活很不一樣。"
        - role: partner
          text:
            en: "What did you use to do there as a kid?"
            ja: "子供の頃はそこで何をしていましたか？"
            zh: "你小時候在那裡都做什麼？"
        - role: user
          text:
            en: "I used to spend every summer at the beach. I used to surf almost every day."
            ja: "毎年夏はビーチで過ごしていました。ほぼ毎日サーフィンをしていました。"
            zh: "我以前每個夏天都在海邊度過。我幾乎每天都衝浪。"
        - role: partner
          text:
            en: "Do you still surf now?"
            ja: "今でもサーフィンしますか？"
            zh: "你現在還衝浪嗎？"
        - role: user
          text:
            en: "Not really. I usually just go to the gym now. City life is different."
            ja: "あまり。今は普段ジムに行くだけです。都会の生活は違いますね。"
            zh: "不太衝了。我現在通常只是去健身房。城市生活不一樣。"
        - role: partner
          text:
            en: "Have you taken up any new hobbies?"
            ja: "何か新しい趣味を始めましたか？"
            zh: "你有開始什麼新嗜好嗎？"
        - role: user
          text:
            en: "Yes, I took up photography last year. It helps me explore the city."
            ja: "はい、去年写真を始めました。街を探索するのに役立っています。"
            zh: "有，我去年開始學攝影。這幫助我探索城市。"

    - id: scenario-3-professional-intro
      title:
        en: "Professional Self-Description"
        ja: "プロフェッショナルな自己紹介"
        zh: "專業自我介紹"
      messages:
        - role: partner
          text:
            en: "Can you tell me about your current role?"
            ja: "現在の役職について教えていただけますか？"
            zh: "你能告訴我你目前的職位嗎？"
        - role: user
          text:
            en: "Sure. I manage a team of five people. We analyze customer data and design marketing strategies."
            ja: "もちろん。5人のチームを管理しています。顧客データを分析してマーケティング戦略を設計しています。"
            zh: "當然。我管理一個五人團隊。我們分析客戶數據並設計行銷策略。"
        - role: partner
          text:
            en: "That sounds like a lot of responsibility. What skills are important?"
            ja: "責任が大きそうですね。どんなスキルが重要ですか？"
            zh: "聽起來責任很大。什麼技能很重要？"
        - role: user
          text:
            en: "You need to be ambitious but also resilient. Not every campaign succeeds."
            ja: "野心的であると同時に回復力も必要です。すべてのキャンペーンが成功するわけではありません。"
            zh: "你需要有抱負，但也要有韌性。不是每個活動都會成功。"
        - role: partner
          text:
            en: "How did you develop those skills?"
            ja: "どうやってそのスキルを身につけましたか？"
            zh: "你是怎麼培養這些技能的？"
        - role: user
          text:
            en: "I used to be afraid of failure. But working in startups taught me to be more resourceful."
            ja: "以前は失敗を恐れていました。でもスタートアップで働いて、より機知に富むようになりました。"
            zh: "我以前害怕失敗。但在新創公司工作教會了我更加足智多謀。"
        - role: partner
          text:
            en: "Do you plan to settle down in this career?"
            ja: "このキャリアに落ち着く予定ですか？"
            zh: "你打算在這個職業定下來嗎？"
        - role: user
          text:
            en: "For now, yes. But I'm always open to taking up new challenges."
            ja: "今のところはい。でも常に新しい挑戦を始めることにオープンです。"
            zh: "目前是的。但我總是願意接受新挑戰。"

quiz:
  questionsPerRound: 5
  xpReward: 25
`,Gt=`# Chapter: Week 2 - Telling Stories
meta:
  id: telling-stories
  title:
    en: "Telling Stories"
    ja: "ストーリーを語る"
    zh: "講故事"
  description:
    en: "Tell a short story about a past event clearly, using the right timing."
    ja: "適切な時制を使って、過去の出来事を明確に語りましょう。"
    zh: "學習用正確的時態清楚地講述過去發生的事。"
  icon: "📖"
  order: 2
  level: intermediate

words:
  # Story Starters
  - id: so-one-time
    word:
      en: So, one time...
      ja: それで、ある時...
      zh: 所以，有一次...
    reading: "soh wuhn tym"
    phonetic: "/soʊ wʌn taɪm/"
    description:
      en: "Casual way to start a story."
      ja: "カジュアルに話を始める方法。"
      zh: "開始講故事的隨意方式。"
    sentence:
      en: "So, one time I was traveling in Thailand and I got completely lost."
      ja: "それで、ある時タイを旅行していて完全に迷子になりました。"
      zh: "所以，有一次我在泰國旅行，完全迷路了。"

  - id: i-remember-when
    word:
      en: I remember when...
      ja: 〜した時のことを覚えている
      zh: 我記得有一次...
    reading: "ay ri-MEM-ber wen"
    phonetic: "/aɪ rɪˈmembər wen/"
    description:
      en: "Nostalgic way to introduce a memory."
      ja: "懐かしく思い出を紹介する方法。"
      zh: "帶著懷舊感介紹回憶的方式。"
    sentence:
      en: "I remember when we first moved to this city. Everything was so confusing."
      ja: "この街に初めて引っ越した時のことを覚えています。全てがとても混乱していました。"
      zh: "我記得我們剛搬到這個城市的時候。一切都很混亂。"

  # Past Simple vs Past Continuous
  - id: was-doing
    word:
      en: Was/Were + doing
      ja: 〜していた
      zh: 正在做
    reading: "wuhz DOO-ing"
    phonetic: "/wɒz ˈduːɪŋ/"
    description:
      en: "Past Continuous: Background action in progress."
      ja: "過去進行形：進行中の背景動作。"
      zh: "過去進行式：正在進行的背景動作。"
    sentence:
      en: "I was sleeping when the phone rang."
      ja: "電話が鳴った時、私は寝ていました。"
      zh: "電話響的時候我正在睡覺。"

  - id: interrupted
    word:
      en: When (interruption)
      ja: 〜した時（中断）
      zh: 當...的時候（中斷）
    reading: "wen"
    phonetic: "/wen/"
    description:
      en: "Past Simple: The main action that interrupts."
      ja: "過去形：中断する主要な動作。"
      zh: "過去式：打斷的主要動作。"
    sentence:
      en: "I was walking down the street when I saw my ex-girlfriend."
      ja: "通りを歩いていたら、元カノを見かけました。"
      zh: "我正走在街上，突然看到我前女友。"

  # Connectors (The Glue)
  - id: suddenly
    word:
      en: Suddenly
      ja: 突然
      zh: 突然
    reading: "SUHD-n-lee"
    phonetic: "/ˈsʌdənli/"
    description:
      en: "Something unexpected happens quickly."
      ja: "予期しないことが急に起こる。"
      zh: "意外的事情快速發生。"
    sentence:
      en: "I was walking down the street when suddenly a dog started chasing me."
      ja: "通りを歩いていたら、突然犬が追いかけてきました。"
      zh: "我正走在街上，突然一隻狗開始追我。"

  - id: meanwhile
    word:
      en: Meanwhile
      ja: その間に
      zh: 與此同時
    reading: "MEEN-wyl"
    phonetic: "/ˈmiːnwaɪl/"
    description:
      en: "Something happening at the same time elsewhere."
      ja: "別の場所で同時に起きていること。"
      zh: "在其他地方同時發生的事情。"
    sentence:
      en: "I was stuck in traffic. Meanwhile, my friends were already at the restaurant."
      ja: "私は渋滞にはまっていました。その間に、友達はすでにレストランにいました。"
      zh: "我被困在車陣裡。與此同時，我的朋友們已經在餐廳了。"

  - id: eventually
    word:
      en: Eventually
      ja: 最終的に
      zh: 最後
    reading: "i-VEN-choo-uh-lee"
    phonetic: "/ɪˈventʃuəli/"
    description:
      en: "After a long time or process."
      ja: "長い時間やプロセスの後で。"
      zh: "經過很長時間或過程之後。"
    sentence:
      en: "We got lost three times, but eventually we found the hotel."
      ja: "3回迷子になりましたが、最終的にホテルを見つけました。"
      zh: "我們迷路了三次，但最後找到了飯店。"

  # Sensory Words (for vivid stories)
  - id: spicy
    word:
      en: Spicy
      ja: 辛い
      zh: 辣
    reading: "SPY-see"
    phonetic: "/ˈspaɪsi/"
    description:
      en: "Hot flavor, like chili."
      ja: "唐辛子のような辛い味。"
      zh: "像辣椒一樣的辣味。"
    sentence:
      en: "The curry was so spicy that my eyes started watering."
      ja: "カレーがとても辛くて、目から涙が出ました。"
      zh: "咖哩辣到我眼淚都流出來了。"

  - id: bitter
    word:
      en: Bitter
      ja: 苦い
      zh: 苦
    reading: "BIT-er"
    phonetic: "/ˈbɪtər/"
    description:
      en: "Sharp, unpleasant taste like black coffee."
      ja: "ブラックコーヒーのような鋭い不快な味。"
      zh: "像黑咖啡一樣尖銳、不愉快的味道。"
    sentence:
      en: "The medicine was extremely bitter. I almost couldn't swallow it."
      ja: "その薬はとても苦かったです。飲み込めないくらいでした。"
      zh: "那藥非常苦。我幾乎嚥不下去。"

  - id: crunchy
    word:
      en: Crunchy
      ja: カリカリ
      zh: 脆脆的
    reading: "KRUHN-chee"
    phonetic: "/ˈkrʌntʃi/"
    description:
      en: "Makes a crisp sound when you bite."
      ja: "噛むとパリパリ音がする。"
      zh: "咬下去會發出酥脆的聲音。"
    sentence:
      en: "The fried chicken was perfectly crunchy on the outside."
      ja: "フライドチキンは外側が完璧にカリカリでした。"
      zh: "炸雞外皮非常酥脆。"

  - id: freezing
    word:
      en: Freezing
      ja: 凍えるほど寒い
      zh: 冷得要命
    reading: "FREE-zing"
    phonetic: "/ˈfriːzɪŋ/"
    description:
      en: "Extremely cold (stronger than 'cold')."
      ja: "極端に寒い（'cold'より強い）。"
      zh: "非常冷（比'cold'更強烈）。"
    sentence:
      en: "The restaurant was freezing. I had to keep my jacket on the whole time."
      ja: "レストランは凍えるほど寒かったです。ずっとジャケットを着ていなければなりませんでした。"
      zh: "餐廳冷得要命。我整餐都得穿著外套。"

  - id: disgusting
    word:
      en: Disgusting
      ja: まずい・気持ち悪い
      zh: 噁心的
    reading: "dis-GUHS-ting"
    phonetic: "/dɪsˈɡʌstɪŋ/"
    description:
      en: "Extremely unpleasant, makes you feel sick."
      ja: "とても不快で、気分が悪くなる。"
      zh: "非常令人不快，讓你感到噁心。"
    sentence:
      en: "The fish smelled disgusting. I couldn't even try it."
      ja: "その魚は気持ち悪いにおいがしました。試すことすらできませんでした。"
      zh: "那魚聞起來很噁心。我連試都不敢試。"

  - id: hilarious
    word:
      en: Hilarious
      ja: 爆笑するほど面白い
      zh: 爆笑的
    reading: "hi-LAIR-ee-uhs"
    phonetic: "/hɪˈleriəs/"
    description:
      en: "Extremely funny (stronger than 'funny')."
      ja: "とても面白い（'funny'より強い）。"
      zh: "非常好笑（比'funny'更強烈）。"
    sentence:
      en: "The whole situation was hilarious. We couldn't stop laughing."
      ja: "状況全体が爆笑でした。笑いが止まりませんでした。"
      zh: "整個情況太爆笑了。我們笑個不停。"

chat:
  conversations:
    - id: scenario-1-travel-story
      title:
        en: "Travel Horror Story"
        ja: "旅行のホラーストーリー"
        zh: "旅行恐怖故事"
      messages:
        - role: partner
          text:
            en: "Have you ever had a terrible travel experience?"
            ja: "ひどい旅行経験はありますか？"
            zh: "你有過很糟糕的旅行經歷嗎？"
        - role: user
          text:
            en: "Oh yes. So, one time I was traveling in Thailand and everything went wrong."
            ja: "ありますよ。それで、ある時タイを旅行していて、全部うまくいかなかったんです。"
            zh: "有啊。所以，有一次我在泰國旅行，一切都出了問題。"
        - role: partner
          text:
            en: "What happened?"
            ja: "何があったんですか？"
            zh: "發生了什麼事？"
        - role: user
          text:
            en: "I was walking to my hotel when suddenly it started pouring rain. I had no umbrella."
            ja: "ホテルに歩いていたら、突然土砂降りになりました。傘を持っていませんでした。"
            zh: "我正走去飯店，突然下起傾盆大雨。我沒帶傘。"
        - role: partner
          text:
            en: "Oh no! What did you do?"
            ja: "大変！どうしたんですか？"
            zh: "糟糕！你怎麼辦？"
        - role: user
          text:
            en: "I ran into a restaurant. Meanwhile, my phone got completely wet and stopped working."
            ja: "レストランに駆け込みました。その間に、電話が完全に濡れて動かなくなりました。"
            zh: "我跑進一家餐廳。與此同時，我的手機完全濕透，停止運作了。"
        - role: partner
          text:
            en: "That's terrible! Did you find your hotel?"
            ja: "ひどい！ホテルは見つかりましたか？"
            zh: "太慘了！你找到飯店了嗎？"
        - role: user
          text:
            en: "Eventually, yes. A kind stranger helped me. But I was freezing and exhausted."
            ja: "最終的には、はい。親切な見知らぬ人が助けてくれました。でも凍えるほど寒くて疲れ果てていました。"
            zh: "最後找到了。一個好心的陌生人幫了我。但我冷得要命又精疲力盡。"

    - id: scenario-2-memorable-meal
      title:
        en: "A Memorable Meal"
        ja: "忘れられない食事"
        zh: "難忘的一餐"
      messages:
        - role: partner
          text:
            en: "Tell me about a meal you'll never forget."
            ja: "忘れられない食事について教えてください。"
            zh: "跟我說說你永遠忘不了的一餐。"
        - role: user
          text:
            en: "I remember when I tried street food in Korea for the first time."
            ja: "韓国で初めて屋台料理を食べた時のことを覚えています。"
            zh: "我記得第一次在韓國吃街頭小吃的時候。"
        - role: partner
          text:
            en: "Was it good?"
            ja: "美味しかったですか？"
            zh: "好吃嗎？"
        - role: user
          text:
            en: "The fried chicken was amazing - perfectly crunchy on the outside and juicy inside."
            ja: "フライドチキンは最高でした - 外はカリカリで中はジューシー。"
            zh: "炸雞超好吃 - 外皮酥脆，裡面多汁。"
        - role: partner
          text:
            en: "What about the spicy food? I heard Korean food is hot."
            ja: "辛い食べ物はどうでしたか？韓国料理は辛いと聞きましたが。"
            zh: "辣的食物呢？我聽說韓國菜很辣。"
        - role: user
          text:
            en: "The kimchi stew was so spicy that my eyes started watering! But I loved it."
            ja: "キムチチゲはとても辛くて目から涙が出ました！でも大好きでした。"
            zh: "泡菜鍋辣到我眼淚都流出來了！但我超愛。"
        - role: partner
          text:
            en: "Did you try anything you didn't like?"
            ja: "嫌いなものはありましたか？"
            zh: "有試到不喜歡的嗎？"
        - role: user
          text:
            en: "Yes, one dish tasted bitter and had a disgusting texture. I couldn't finish it."
            ja: "はい、一つの料理は苦くて気持ち悪い食感でした。食べきれませんでした。"
            zh: "有，有一道菜嚐起來苦苦的，口感很噁心。我吃不完。"

    - id: scenario-3-funny-story
      title:
        en: "A Hilarious Mistake"
        ja: "爆笑の失敗"
        zh: "爆笑的錯誤"
      messages:
        - role: partner
          text:
            en: "Do you have any funny stories from your past?"
            ja: "過去の面白い話はありますか？"
            zh: "你有什麼過去的有趣故事嗎？"
        - role: user
          text:
            en: "So, one time I was giving a presentation at work. It was going really well."
            ja: "それで、ある時仕事でプレゼンをしていました。とてもうまくいっていました。"
            zh: "所以，有一次我在工作上做簡報。進行得很順利。"
        - role: partner
          text:
            en: "And then what happened?"
            ja: "それからどうなりましたか？"
            zh: "然後呢？"
        - role: user
          text:
            en: "I was explaining the data when suddenly my cat jumped onto my keyboard!"
            ja: "データを説明していたら、突然猫がキーボードの上に飛び乗りました！"
            zh: "我正在解釋數據，突然我的貓跳到鍵盤上！"
        - role: partner
          text:
            en: "Oh no! This was a video call?"
            ja: "大変！これはビデオ通話でしたか？"
            zh: "糟糕！這是視訊會議嗎？"
        - role: user
          text:
            en: "Yes! Meanwhile, my cat was walking across the screen. Everyone started laughing."
            ja: "はい！その間に、猫が画面を歩いていました。みんな笑い始めました。"
            zh: "對！與此同時，我的貓走過螢幕。大家都開始笑。"
        - role: partner
          text:
            en: "That must have been embarrassing!"
            ja: "恥ずかしかったでしょう！"
            zh: "那一定很尷尬！"
        - role: user
          text:
            en: "At first, yes. But eventually everyone said it was hilarious. Best meeting ever!"
            ja: "最初はそうでした。でも最終的にみんな爆笑だと言いました。最高の会議でした！"
            zh: "一開始是的。但最後大家都說太爆笑了。有史以來最棒的會議！"

quiz:
  questionsPerRound: 5
  xpReward: 25
`,Kt=`# Chapter: Comprehension Check
meta:
  id: comprehension-check
  title:
    en: "Comprehension Check"
    ja: "理解度の確認"
    zh: "理解度確認"
  description:
    en: "Learn to ask for clarification and repetition."
    ja: "説明や繰り返しを求める方法を学びましょう。"
    zh: "學習如何請求澄清和重複說明。"
  icon: "🤔"
  order: 8
  level: beginner

words:
  - id: understand
    word:
      en: Understand
      ja: 理解する
      zh: 懂/明白
    reading: Rikai suru
    phonetic: "/ˌʌndərˈstænd/"
    description:
      en: "To know the meaning of something."
      ja: "何かの意味を知ること。"
      zh: "了解某事的意思。"
    sentence:
      en: "Do you understand?"
      ja: "わかりますか？"
      zh: "你懂嗎？"

  - id: again
    word:
      en: Again
      ja: もう一度
      zh:再一次
    reading: Mō ichido
    phonetic: "/əˈɡɛn/"
    description:
      en: "One more time."
      ja: "もう一回。"
      zh: "再一次。"
    sentence:
      en: "Please say it again."
      ja: "もう一度言ってください。"
      zh: "請再說一次。"

  - id: slowly
    word:
      en: Slowly
      ja: ゆっくり
      zh: 慢一點
    reading: Yukkuri
    phonetic: "/ˈsloʊli/"
    description:
      en: "At a low speed."
      ja: "遅い速度で。"
      zh: "速度很慢地。"
    sentence:
      en: "Please speak slowly."
      ja: "ゆっくり話してください。"
      zh: "請說慢一點。"

  - id: mean
    word:
      en: Mean
      ja: 意味する
      zh: 意思/意味著
    reading: Imi suru
    phonetic: "/miːn/"
    description:
      en: "To have a specific meaning."
      ja: "特定の意味を持つこと。"
      zh: "具有特定的含義。"
    sentence:
      en: "What does this mean?"
      ja: "これはどういう意味ですか？"
      zh: "這是什麼意思？"

  - id: question
    word:
      en: Question
      ja: 質問
      zh: 問題
    reading: Shitsumon
    phonetic: "/ˈkwɛstʃən/"
    description:
      en: "A sentence that asks for information."
      ja: "情報を求める文。"
      zh: "用來詢問資訊的語句。"
    sentence:
      en: "I have a question."
      ja: "質問があります。"
      zh: "我有一個問題。"

  - id: speak
    word:
      en: Speak
      ja: 話す
      zh: 說
    reading: Hanasu
    phonetic: "/spiːk/"
    description:
      en: "To say words."
      ja: "言葉を言うこと。"
      zh: "說話。"
    sentence:
      en: "I speak English."
      ja: "私は英語を話します。"
      zh: "我說英語。"

chat:
  conversations:
    - id: scenario-1-asking-repetition
      title:
        en: "Asking for Repetition"
        ja: "繰り返しをお願いする"
        zh: "請求重複"
      messages:
        - role: partner
          text:
            en: "This is very important."
            ja: "これはとても重要です。"
            zh: "這非常重要。"
        - role: user
          text:
            en: "Sorry, I do not understand."
            ja: "すみません、わかりません。"
            zh: "抱歉，我不懂。"
        - role: partner
          text:
            en: "Okay, I will say it again."
            ja: "わかりました、もう一度言います。"
            zh: "好，我再說一次。"
        - role: user
          text:
            en: "Please speak slowly."
            ja: "ゆっくり話してください。"
            zh: "請說慢一點。"
        - role: partner
          text:
            en: "Is this speed okay?"
            ja: "この速さで大丈夫ですか？"
            zh: "這個速度可以嗎？"
        - role: user
          text:
            en: "Yes, thank you."
            ja: "はい、ありがとう。"
            zh: "可以，謝謝。"
        - role: partner
          text:
            en: "Do you have a question?"
            ja: "質問はありますか？"
            zh: "你有問題嗎？"
        - role: user
          text:
            en: "No questions now."
            ja: "今は質問ありません。"
            zh: "現在沒有問題。"

    - id: scenario-2-clarifying-meaning
      title:
        en: "Clarifying Meaning"
        ja: "意味を確認する"
        zh: "確認意思"
      messages:
        - role: partner
          text:
            en: "Do you speak Japanese?"
            ja: "日本語を話しますか？"
            zh: "你會說日語嗎？"
        - role: user
          text:
            en: "Yes, I speak a little."
            ja: "はい、少し話します。"
            zh: "會，我會說一點。"
        - role: partner
          text:
            en: "Look at this word."
            ja: "この単語を見てください。"
            zh: "看看這個字。"
        - role: user
          text:
            en: "What does it mean?"
            ja: "それはどういう意味ですか？"
            zh: "那是什麼意思？"
        - role: partner
          text:
            en: "It means 'Hello'."
            ja: "それは「こんにちは」という意味です。"
            zh: "它是「你好」的意思。"
        - role: user
          text:
            en: "Ah, I understand now."
            ja: "あ、今はわかります。"
            zh: "啊，我現在懂了。"
        - role: partner
          text:
            en: "That is good."
            ja: "それはよかったです。"
            zh: "那很好。"
        - role: user
          text:
            en: "Thank you for helping."
            ja: "助けてくれてありがとう。"
            zh: "謝謝你的幫忙。"

quiz:
  questionsPerRound: 5
  xpReward: 20`,Vt=`# Chapter: Me and You
meta:
  id: me-and-you
  title:
    en: "Me & You"
    ja: "私とあなた"
    zh: "我與你"
  description:
    en: "Learn how to introduce yourself and ask about others."
    ja: "自己紹介や他人のことを尋ねる方法を学びましょう。"
    zh: "學習如何自我介紹和詢問他人。"
  icon: "🤝"
  order: 1
  level: beginner

words:
  - id: i-watashi
    word:
      en: I
      ja: 私
      zh: 我
    reading: Watashi
    phonetic: "/waˈtɑːʃi/"
    description:
      en: "Used to talk about yourself."
      ja: "自分のことを話すときに使います。"
      zh: "用來談論自己。"
    sentence:
      en: "I am a student."
      ja: "私は学生です。"
      zh: "我是學生。"

  - id: you-anata
    word:
      en: You
      ja: あなた
      zh: 你
    reading: Anata
    phonetic: "/ɑːˈnɑːtɑː/"
    description:
      en: "Used to talk to the other person."
      ja: "相手のことを話すときに使います。"
      zh: "用來對對方說話。"
    sentence:
      en: "Are you Tanaka?"
      ja: "あなたは田中さんですか？"
      zh: "你是田中嗎？"

  - id: name
    word:
      en: Name
      ja: 名前
      zh: 名字
    reading: Namae
    phonetic: "/nɑːˈmɑːeɪ/"
    description:
      en: "What people call you."
      ja: "人があなたを呼ぶときの言葉。"
      zh: "別人稱呼你的詞。"
    sentence:
      en: "My name is Ken."
      ja: "私の名前はケンです。"
      zh: "我的名字是Ken。"

  - id: who
    word:
      en: Who
      ja: 誰
      zh: 誰
    reading: Dare
    phonetic: "/ˈdɑːreɪ/"
    description:
      en: "Used to ask about a person."
      ja: "人について尋ねるときに使います。"
      zh: "用來詢問某人。"
    sentence:
      en: "Who is that?"
      ja: "あれは誰ですか？"
      zh: "那是誰？"

  - id: friend
    word:
      en: Friend
      ja: 友達
      zh: 朋友
    reading: Tomodachi
    phonetic: "/toʊmoʊˈdɑːtʃi/"
    description:
      en: "Someone you like and know well."
      ja: "好きでよく知っている人。"
      zh: "你喜歡且熟悉的人。"
    sentence:
      en: "He is my friend."
      ja: "彼は私の友達です。"
      zh: "他是我的朋友。"

  - id: student
    word:
      en: Student
      ja: 学生
      zh: 學生
    reading: Gakusei
    phonetic: "/gɑːkˈseɪ/"
    description:
      en: "A person who studies at school."
      ja: "学校で勉強している人。"
      zh: "在學校學習的人。"
    sentence:
      en: "I am not a student."
      ja: "私は学生ではありません。"
      zh: "我不是學生。"

chat:
  conversations:
    - id: scenario-1-introduction
      title:
        en: "Self Introduction"
        ja: "自己紹介"
        zh: "自我介紹"
      messages:
        - role: partner
          text:
            en: "Hello. I am Ken."
            ja: "こんにちは。私はケンです。"
            zh: "你好。我是Ken。"
        - role: user
          text:
            en: "Hello. My name is John."
            ja: "こんにちは。私の名前はジョンです。"
            zh: "你好。我的名字是John。"
        - role: partner
          text:
            en: "Are you a student?"
            ja: "あなたは学生ですか？"
            zh: "你是學生嗎？"
        - role: user
          text:
            en: "Yes, I am a student."
            ja: "はい、私は学生です。"
            zh: "是的，我是學生。"
        - role: partner
          text:
            en: "Me too. Nice to meet you."
            ja: "私もです。はじめまして。"
            zh: "我也是。很高興認識你。"
        - role: user
          text:
            en: "Nice to meet you too."
            ja: "こちらこそ、はじめまして。"
            zh: "我也很高興認識你。"
        - role: partner
          text:
            en: "Are you Japanese?"
            ja: "あなたは日本人ですか？"
            zh: "你是日本人嗎？"
        - role: user
          text:
            en: "No, I am American."
            ja: "いいえ、私はアメリカ人です。"
            zh: "不是，我是美國人。"

    - id: scenario-2-asking-who
      title:
        en: "Who is that?"
        ja: "あの人は誰？"
        zh: "那是誰？"
      messages:
        - role: partner
          text:
            en: "Who is that person?"
            ja: "あの人は誰ですか？"
            zh: "那個人是誰？"
        - role: user
          text:
            en: "That is my friend."
            ja: "あれは私の友達です。"
            zh: "那是我的朋友。"
        - role: partner
          text:
            en: "What is his name?"
            ja: "彼の名前は何ですか？"
            zh: "他叫什麼名字？"
        - role: user
          text:
            en: "His name is Tanaka."
            ja: "彼の名前は田中です。"
            zh: "他的名字是田中。"
        - role: partner
          text:
            en: "Is he a student too?"
            ja: "彼も学生ですか？"
            zh: "他也是學生嗎？"
        - role: user
          text:
            en: "No, he is a teacher."
            ja: "いいえ、彼は先生です。"
            zh: "不是，他是老師。"
        - role: partner
          text:
            en: "Oh, I see."
            ja: "ああ、そうですか。"
            zh: "喔，原來如此。"
        - role: user
          text:
            en: "He is very kind."
            ja: "彼はとても親切です。"
            zh: "他非常親切。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,Qt=`# Chapter: Me, You, and Professionals
meta:
  id: me-you-and-professionals
  title:
    en: "Me, You, and Professionals"
    ja: "私、あなた、そして仕事"
    zh: "我、你與職業"
  description:
    en: "Learn to introduce yourself and discuss jobs."
    ja: "自己紹介や仕事について話す方法を学びましょう。"
    zh: "學習自我介紹和談論職業。"
  icon: "🤝"
  order: 2
  level: beginner

words:
  - id: name
    word:
      en: Name
      ja: 名前
      zh: 名字
    reading: Namae
    phonetic: "/neɪm/"
    description:
      en: "What you call a person."
      ja: "人を呼ぶ時の言葉。"
      zh: "用來稱呼一個人的詞。"
    sentence:
      en: "My name is Tanaka."
      ja: "私の名前は田中です。"
      zh: "我的名字是田中。"

  - id: teacher
    word:
      en: Teacher
      ja: 先生
      zh: 老師
    reading: Sensei
    phonetic: "/ˈtiːtʃər/"
    description:
      en: "A person who teaches students."
      ja: "生徒に教える人。"
      zh: "教導學生的人。"
    sentence:
      en: "Mr. Sato is a teacher."
      ja: "佐藤さんは先生です。"
      zh: "佐藤先生是老師。"

  - id: student
    word:
      en: Student
      ja: 学生
      zh: 學生
    reading: Gakusei
    phonetic: "/ˈstjuːdənt/"
    description:
      en: "A person who studies at school."
      ja: "学校で勉強する人。"
      zh: "在學校學習的人。"
    sentence:
      en: "I am a university student."
      ja: "私は大学生です。"
      zh: "我是大學生。"

  - id: job
    word:
      en: Job
      ja: 仕事
      zh: 工作
    reading: Shigoto
    phonetic: "/dʒɒb/"
    description:
      en: "Work you do for money."
      ja: "お金のためにする労働。"
      zh: "為了賺錢而做的勞動。"
    sentence:
      en: "Do you have a job?"
      ja: "仕事はありますか？"
      zh: "你有工作嗎？"

  - id: doctor
    word:
      en: Doctor
      ja: 医者
      zh: 醫生
    reading: Isha
    phonetic: "/ˈdɒktər/"
    description:
      en: "A person who helps sick people."
      ja: "病気の人を助ける人。"
      zh: "幫助生病的人的人。"
    sentence:
      en: "She is a good doctor."
      ja: "彼女は良い医者です。"
      zh: "她是個好醫生。"

  - id: company
    word:
      en: Company
      ja: 会社
      zh: 公司
    reading: Kaisha
    phonetic: "/ˈkʌmpəni/"
    description:
      en: "A business or organization."
      ja: "ビジネスや組織。"
      zh: "企業或組織。"
    sentence:
      en: "I go to the company."
      ja: "私は会社に行きます。"
      zh: "我去公司。"

chat:
  conversations:
    - id: scenario-1-introduction
      title:
        en: "Self Introduction"
        ja: "自己紹介"
        zh: "自我介紹"
      messages:
        - role: partner
          text:
            en: "Hello. What is your name?"
            ja: "こんにちは。お名前は何ですか？"
            zh: "你好。你叫什麼名字？"
        - role: user
          text:
            en: "My name is Ken."
            ja: "私の名前はケンです。"
            zh: "我的名字是Ken。"
        - role: partner
          text:
            en: "Nice to meet you, Ken."
            ja: "はじめまして、ケンさん。"
            zh: "很高興認識你，Ken。"
        - role: user
          text:
            en: "Are you a student?"
            ja: "あなたは学生ですか？"
            zh: "你是學生嗎？"
        - role: partner
          text:
            en: "No, I am a teacher."
            ja: "いいえ、私は先生です。"
            zh: "不是，我是老師。"
        - role: user
          text:
            en: "Oh, I see."
            ja: "ああ、そうですか。"
            zh: "喔，原來如此。"
        - role: partner
          text:
            en: "Are you a student?"
            ja: "あなたは学生ですか？"
            zh: "你是學生嗎？"
        - role: user
          text:
            en: "Yes, I study English."
            ja: "はい、英語を勉強しています。"
            zh: "是的，我在學英文。"

    - id: scenario-2-talking-about-work
      title:
        en: "Talking About Work"
        ja: "仕事について話す"
        zh: "談論工作"
      messages:
        - role: partner
          text:
            en: "Do you have a job?"
            ja: "仕事はしていますか？"
            zh: "你有工作嗎？"
        - role: user
          text:
            en: "Yes, I work at a company."
            ja: "はい、会社で働いています。"
            zh: "有，我在公司上班。"
        - role: partner
          text:
            en: "Is it a big company?"
            ja: "大きな会社ですか？"
            zh: "是大公司嗎？"
        - role: user
          text:
            en: "No, it is small."
            ja: "いいえ、小さいです。"
            zh: "不是，是小公司。"
        - role: partner
          text:
            en: "Is your father a doctor?"
            ja: "お父さんはお医者さんですか？"
            zh: "你爸爸是醫生嗎？"
        - role: user
          text:
            en: "Yes, he is a doctor."
            ja: "はい、彼は医者です。"
            zh: "是的，他是醫生。"
        - role: partner
          text:
            en: "That is a hard job."
            ja: "それは大変な仕事ですね。"
            zh: "那是很辛苦的工作。"
        - role: user
          text:
            en: "Yes, he is very busy."
            ja: "はい、彼はとても忙しいです。"
            zh: "是的，他非常忙。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,Jt=`# Chapter: Mixed Practice (Dialogue Flow)
meta:
  id: mixed-practice-dialogue-flow
  title:
    en: "Natural Conversation Practice"
    ja: "自然な会話の練習"
    zh: "自然對話練習"
  description:
    en: "Practice simple interactions for making plans."
    ja: "予定を立てるための簡単なやり取りを練習します。"
    zh: "練習制定計畫的簡單互動。"
  icon: "🗣️"
  order: 6
  level: beginner

words:
  - id: time
    word:
      en: Time
      ja: 時間
      zh: 時間
    reading: Jikan
    phonetic: "/taɪm/"
    description:
      en: "A point or period in the day."
      ja: "1日の中の時点や期間。"
      zh: "一天中的某個時刻或時段。"
    sentence:
      en: "Do you have time?"
      ja: "時間がありますか？"
      zh: "你有時間嗎？"

  - id: meet
    word:
      en: Meet
      ja: 会う
      zh: 見面
    reading: Au
    phonetic: "/miːt/"
    description:
      en: "To see and talk to someone."
      ja: "誰かに会って話すこと。"
      zh: "見到某人並交談。"
    sentence:
      en: "Let's meet today."
      ja: "今日会いましょう。"
      zh: "我們今天見面吧。"

  - id: lunch
    word:
      en: Lunch
      ja: ランチ
      zh: 午餐
    reading: Ranchi
    phonetic: "/lʌntʃ/"
    description:
      en: "The meal eaten in the middle of the day."
      ja: "日中に食べる食事。"
      zh: "中午吃的飯。"
    sentence:
      en: "I eat lunch at noon."
      ja: "私は正午にランチを食べます。"
      zh: "我中午吃午餐。"

  - id: where
    word:
      en: Where
      ja: どこ
      zh: 哪裡
    reading: Doko
    phonetic: "/wɛər/"
    description:
      en: "Used to ask about a place."
      ja: "場所を尋ねるときに使います。"
      zh: "用於詢問地點。"
    sentence:
      en: "Where are you?"
      ja: "どこにいますか？"
      zh: "你在哪裡？"

  - id: station
    word:
      en: Station
      ja: 駅
      zh: 車站
    reading: Eki
    phonetic: "/ˈsteɪʃən/"
    description:
      en: "A place where trains stop."
      ja: "電車が止まる場所。"
      zh: "火車停靠的地方。"
    sentence:
      en: "The station is near."
      ja: "駅は近いです。"
      zh: "車站很近。"

  - id: busy
    word:
      en: Busy
      ja: 忙しい
      zh: 忙
    reading: Isogashii
    phonetic: "/ˈbɪzi/"
    description:
      en: "Having a lot to do."
      ja: "やることがたくさんあること。"
      zh: "有很多事情要做。"
    sentence:
      en: "I am very busy."
      ja: "私はとても忙しいです。"
      zh: "我很忙。"

chat:
  conversations:
    - id: scenario-1-making-plans
      title:
        en: "Making a Plan"
        ja: "予定を立てる"
        zh: "制定計畫"
      messages:
        - role: partner
          text:
            en: "Do you have time today?"
            ja: "今日、時間がありますか？"
            zh: "你今天有時間嗎？"
        - role: user
          text:
            en: "Yes, I am free."
            ja: "はい、暇です。"
            zh: "是的，我有空。"
        - role: partner
          text:
            en: "Let's meet for lunch."
            ja: "ランチに会いましょう。"
            zh: "我們見面吃午餐吧。"
        - role: user
          text:
            en: "That sounds good."
            ja: "それはいいですね。"
            zh: "聽起來不錯。"
        - role: partner
          text:
            en: "Where do you want to go?"
            ja: "どこに行きたいですか？"
            zh: "你想去哪裡？"
        - role: user
          text:
            en: "I like the burger shop."
            ja: "ハンバーガー屋が好きです。"
            zh: "我喜歡那家漢堡店。"
        - role: partner
          text:
            en: "Okay, let's go there."
            ja: "わかりました、そこに行きましょう。"
            zh: "好，我們去那裡。"
        - role: user
          text:
            en: "See you soon."
            ja: "またね。"
            zh: "待會見。"

    - id: scenario-2-setting-details
      title:
        en: "Setting Details"
        ja: "詳細を決める"
        zh: "決定細節"
      messages:
        - role: partner
          text:
            en: "Are you busy now?"
            ja: "今、忙しいですか？"
            zh: "你現在忙嗎？"
        - role: user
          text:
            en: "No, I am ready."
            ja: "いいえ、準備できました。"
            zh: "不，我準備好了。"
        - role: partner
          text:
            en: "Let's meet at the station."
            ja: "駅で会いましょう。"
            zh: "我們在車站見。"
        - role: user
          text:
            en: "Which station?"
            ja: "どの駅ですか？"
            zh: "哪個車站？"
        - role: partner
          text:
            en: "Tokyo Station, North Exit."
            ja: "東京駅の北口です。"
            zh: "東京車站北出口。"
        - role: user
          text:
            en: "Okay, what time?"
            ja: "わかりました、何時ですか？"
            zh: "好，幾點？"
        - role: partner
          text:
            en: "Is 12:00 okay?"
            ja: "12時は大丈夫ですか？"
            zh: "12點可以嗎？"
        - role: user
          text:
            en: "Yes, 12:00 is perfect."
            ja: "はい、12時で完璧です。"
            zh: "可以，12點很完美。"

quiz:
  questionsPerRound: 5
  xpReward: 20`,Zt=`# Chapter: The Negative (Not X)
meta:
  id: negative-not-x
  title:
    en: "The Negative (Not X)"
    ja: "否定形（Xではありません）"
    zh: "否定句 (不是 X)"
  description:
    en: "Learn how to say what something is not."
    ja: "何かがそうではないと言う方法を学びましょう。"
    zh: "學習如何表達「不是...」。"
  icon: "🙅"
  order: 5
  level: beginner

words:
  - id: doctor
    word:
      en: Doctor
      ja: 医者
      zh: 醫生
    reading: Isha
    phonetic: "/ˈdɒktər/"
    description:
      en: "A person who helps sick people."
      ja: "病気の人を助ける人。"
      zh: "幫助病人的人。"
    sentence:
      en: "I am not a doctor."
      ja: "私は医者ではありません。"
      zh: "我不是醫生。"

  - id: teacher
    word:
      en: Teacher
      ja: 先生
      zh: 老師
    reading: Sensei
    phonetic: "/ˈtiːtʃər/"
    description:
      en: "A person who teaches students."
      ja: "学生に教える人。"
      zh: "教導學生的人。"
    sentence:
      en: "He is not a teacher."
      ja: "彼は先生ではありません。"
      zh: "他不是老師。"

  - id: cat
    word:
      en: Cat
      ja: 猫
      zh: 貓
    reading: Neko
    phonetic: "/kæt/"
    description:
      en: "A small animal that says meow."
      ja: "ニャーと鳴く小さな動物。"
      zh: "會喵喵叫的小動物。"
    sentence:
      en: "It is not a cat."
      ja: "それは猫ではありません。"
      zh: "那不是貓。"

  - id: dog
    word:
      en: Dog
      ja: 犬
      zh: 狗
    reading: Inu
    phonetic: "/dɔːg/"
    description:
      en: "An animal that barks."
      ja: "吠える動物。"
      zh: "會吠叫的動物。"
    sentence:
      en: "That is not a dog."
      ja: "あれは犬ではありません。"
      zh: "那不是狗。"

  - id: book
    word:
      en: Book
      ja: 本
      zh: 書
    reading: Hon
    phonetic: "/bʊk/"
    description:
      en: "Something you read."
      ja: "読むもの。"
      zh: "用來閱讀的東西。"
    sentence:
      en: "This is not a book."
      ja: "これは本ではありません。"
      zh: "這不是書。"

  - id: pen
    word:
      en: Pen
      ja: ペン
      zh: 筆
    reading: Pen
    phonetic: "/pɛn/"
    description:
      en: "Something used to write."
      ja: "書くために使うもの。"
      zh: "用來書寫的東西。"
    sentence:
      en: "It is not a pen."
      ja: "それはペンではありません。"
      zh: "那不是筆。"

chat:
  conversations:
    - id: scenario-1-guessing-profession
      title:
        en: "Guessing the Job"
        ja: "仕事を推測する"
        zh: "猜測職業"
      messages:
        - role: partner
          text:
            en: "Is he a doctor?"
            ja: "彼は医者ですか？"
            zh: "他是醫生嗎？"
        - role: user
          text:
            en: "No, he is not a doctor."
            ja: "いいえ、彼は医者ではありません。"
            zh: "不，他不是醫生。"
        - role: partner
          text:
            en: "Is he a teacher?"
            ja: "彼は先生ですか？"
            zh: "他是老師嗎？"
        - role: user
          text:
            en: "No, he is not a teacher."
            ja: "いいえ、彼は先生ではありません。"
            zh: "不，他不是老師。"
        - role: partner
          text:
            en: "Who is he?"
            ja: "彼は誰ですか？"
            zh: "他是誰？"
        - role: user
          text:
            en: "He is a student."
            ja: "彼は学生です。"
            zh: "他是學生。"
        - role: partner
          text:
            en: "Oh, I see."
            ja: "あ、そうですか。"
            zh: "喔，我了解了。"
        - role: user
          text:
            en: "He is my friend."
            ja: "彼は私の友達です。"
            zh: "他是我的朋友。"

    - id: scenario-2-identifying-objects
      title:
        en: "What is this?"
        ja: "これは何ですか？"
        zh: "這是什麼？"
      messages:
        - role: partner
          text:
            en: "Is this a cat?"
            ja: "これは猫ですか？"
            zh: "這是貓嗎？"
        - role: user
          text:
            en: "No, it is not a cat."
            ja: "いいえ、それは猫ではありません。"
            zh: "不，那不是貓。"
        - role: partner
          text:
            en: "Is it a dog?"
            ja: "それは犬ですか？"
            zh: "那是狗嗎？"
        - role: user
          text:
            en: "No, it is not a dog."
            ja: "いいえ、それは犬ではありません。"
            zh: "不，那不是狗。"
        - role: partner
          text:
            en: "What is it?"
            ja: "それは何ですか？"
            zh: "那是什麼？"
        - role: user
          text:
            en: "It is a fox."
            ja: "それはキツネです。"
            zh: "那是狐狸。"
        - role: partner
          text:
            en: "Is that a pen?"
            ja: "あれはペンですか？"
            zh: "那是筆嗎？"
        - role: user
          text:
            en: "No, that is not a pen."
            ja: "いいえ、あれはペンではありません。"
            zh: "不，那不是筆。"
        - role: partner
          text:
            en: "Is it a book?"
            ja: "それは本ですか？"
            zh: "那是書嗎？"
        - role: user
          text:
            en: "Yes, it is a book."
            ja: "はい、それは本です。"
            zh: "是的，那是書。"

quiz:
  questionsPerRound: 5
  xpReward: 20`,Xt=`# Chapter: Shadowing (Speed & Rhythm)
# Focus: Repeat these rapidly without pausing.
meta:
  id: shadowing-speed-rhythm
  title:
    en: "Shadowing: Speed & Rhythm"
    ja: "シャドーイング：スピードとリズム"
    zh: "跟讀練習：速度與節奏"
  description:
    en: "Practice speaking quickly and smoothly."
    ja: "速く、スムーズに話す練習をしましょう。"
    zh: "練習快速且流暢地說話。"
  icon: "⚡"
  order: 7
  level: beginner

words:
  - id: hurry
    word:
      en: Hurry
      ja: 急ぐ
      zh: 快點
    reading: Isogu
    phonetic: "/ˈhʌri/"
    description:
      en: "To move or act quickly."
      ja: "速く動いたり行動したりすること。"
      zh: "迅速移動或行動。"
    sentence:
      en: "Please hurry up."
      ja: "急いでください。"
      zh: "請快一點。"

  - id: fast
    word:
      en: Fast
      ja: 速い
      zh: 快
    reading: Hayai
    phonetic: "/fæst/"
    description:
      en: "Moving with high speed."
      ja: "スピードが速いこと。"
      zh: "速度很快。"
    sentence:
      en: "He runs very fast."
      ja: "彼はとても速く走ります。"
      zh: "他跑得很快。"

  - id: late
    word:
      en: Late
      ja: 遅刻
      zh: 遲到
    reading: Chikoku
    phonetic: "/leɪt/"
    description:
      en: "Not on time."
      ja: "時間通りではないこと。"
      zh: "沒有準時。"
    sentence:
      en: "We are late for school."
      ja: "私たちは学校に遅刻です。"
      zh: "我們上學遲到了。"

  - id: ready
    word:
      en: Ready
      ja: 準備完了
      zh: 準備好
    reading: Junbi kanryou
    phonetic: "/ˈrɛdi/"
    description:
      en: "Prepared to do something."
      ja: "何かをする準備ができていること。"
      zh: "準備好做某事。"
    sentence:
      en: "Are you ready to go?"
      ja: "行く準備はできましたか？"
      zh: "你準備好要走了嗎？"

  - id: wait
    word:
      en: Wait
      ja: 待つ
      zh: 等
    reading: Matsu
    phonetic: "/weɪt/"
    description:
      en: "To stay in one place."
      ja: "一箇所に留まること。"
      zh: "留在一個地方。"
    sentence:
      en: "Wait for me here."
      ja: "ここで私を待ってください。"
      zh: "在這裡等我。"

  - id: go
    word:
      en: Go
      ja: 行く
      zh: 走
    reading: Iku
    phonetic: "/ɡoʊ/"
    description:
      en: "To move to another place."
      ja: "別の場所に移動すること。"
      zh: "移動到另一個地方。"
    sentence:
      en: "Let's go now."
      ja: "今行きましょう。"
      zh: "我們現在走吧。"

chat:
  conversations:
    - id: scenario-1-rushing
      title:
        en: "Rushing to the Bus"
        ja: "バスに急ぐ"
        zh: "趕公車"
      messages:
        - role: partner
          text:
            en: "Hurry up! We are late."
            ja: "急いで！遅刻しちゃうよ。"
            zh: "快一點！我們要遲到了。"
        - role: user
          text:
            en: "I am coming fast."
            ja: "急いで行きます。"
            zh: "我很快就來。"
        - role: partner
          text:
            en: "The bus leaves now."
            ja: "バスがもう出るよ。"
            zh: "公車現在要開了。"
        - role: user
          text:
            en: "Wait! Do not go."
            ja: "待って！行かないで。"
            zh: "等一下！別走。"
        - role: partner
          text:
            en: "Run fast! It is here."
            ja: "速く走って！ここだよ。"
            zh: "快跑！在這裡。"
        - role: user
          text:
            en: "I run very fast."
            ja: "私はとても速く走っています。"
            zh: "我跑得很快。"
        - role: partner
          text:
            en: "Good. Let's go in."
            ja: "よし。入ろう。"
            zh: "好，我們進去吧。"
        - role: user
          text:
            en: "Okay, I am safe."
            ja: "よし、セーフだ。"
            zh: "好了，我趕上了。"

    - id: scenario-2-getting-ready
      title:
        en: "Are You Ready?"
        ja: "準備はいい？"
        zh: "你準備好了嗎？"
      messages:
        - role: partner
          text:
            en: "Are you ready?"
            ja: "準備はいい？"
            zh: "你準備好了嗎？"
        - role: user
          text:
            en: "No, please wait."
            ja: "いいえ、待ってください。"
            zh: "還沒，請等一下。"
        - role: partner
          text:
            en: "Why? We are late."
            ja: "なんで？遅れちゃうよ。"
            zh: "為什麼？我們要遲到了。"
        - role: user
          text:
            en: "I cannot find my bag."
            ja: "鞄が見つかりません。"
            zh: "我找不到我的包包。"
        - role: partner
          text:
            en: "Hurry, please."
            ja: "急いで、お願い。"
            zh: "拜託快一點。"
        - role: user
          text:
            en: "Okay, I am ready now."
            ja: "よし、準備できました。"
            zh: "好了，我準備好了。"
        - role: partner
          text:
            en: "Let's go fast."
            ja: "速く行こう。"
            zh: "我們快走吧。"
        - role: user
          text:
            en: "Yes, let's go."
            ja: "はい、行きましょう。"
            zh: "好，走吧。"

quiz:
  questionsPerRound: 5
  xpReward: 20`,nr=`# Chapter: Stating Facts
meta:
  id: stating-facts
  title:
    en: "Stating Facts"
    ja: "事実を述べる"
    zh: "陳述事實"
  description:
    en: "Learn how to describe things and state simple facts."
    ja: "物事を説明し、簡単な事実を述べる方法を学びましょう。"
    zh: "學習如何描述事物並陳述簡單的事實。"
  icon: "☝️"
  order: 3
  level: beginner

words:
  - id: weather
    word:
      en: Weather
      ja: 天気
      zh: 天氣
    reading: Tenki
    phonetic: "/ˈwɛðər/"
    description:
      en: "The state of the atmosphere (sun, rain, wind)."
      ja: "大気の状態（晴れ、雨、風など）。"
      zh: "大氣的狀態（陽光、雨、風）。"
    sentence:
      en: "The weather is nice."
      ja: "天気が良いです。"
      zh: "天氣很好。"

  - id: cold
    word:
      en: Cold
      ja: 寒い
      zh: 冷
    reading: Samui
    phonetic: "/koʊld/"
    description:
      en: "Having a low temperature."
      ja: "気温が低いこと。"
      zh: "溫度很低。"
    sentence:
      en: "The water is cold."
      ja: "水が冷たいです。"
      zh: "水很冷。"

  - id: true
    word:
      en: True
      ja: 本当
      zh: 真的
    reading: Hontou
    phonetic: "/truː/"
    description:
      en: "Based on facts; not false."
      ja: "事実に基づいていること。嘘ではないこと。"
      zh: "基於事實；不是假的。"
    sentence:
      en: "That is not true."
      ja: "それは本当ではありません。"
      zh: "那不是真的。"

  - id: time
    word:
      en: Time
      ja: 時間
      zh: 時間
    reading: Jikan
    phonetic: "/taɪm/"
    description:
      en: "What is measured in minutes and hours."
      ja: "分や時間で測られるもの。"
      zh: "以分和小時計算的概念。"
    sentence:
      en: "Do you have time?"
      ja: "時間はありますか？"
      zh: "你有時間嗎？"

  - id: open
    word:
      en: Open
      ja: 開いている
      zh: 開著
    reading: Aiteiru
    phonetic: "/ˈoʊpən/"
    description:
      en: "Not closed; allowing entry."
      ja: "閉まっていないこと。入れる状態。"
      zh: "沒關；允許進入。"
    sentence:
      en: "The store is open."
      ja: "店は開いています。"
      zh: "商店開著。"

  - id: expensive
    word:
      en: Expensive
      ja: 高い
      zh: 貴
    reading: Takai
    phonetic: "/ɪkˈspɛnsɪv/"
    description:
      en: "Costing a lot of money."
      ja: "多くのお金がかかること。"
      zh: "花費很多錢。"
    sentence:
      en: "This car is expensive."
      ja: "この車は高いです。"
      zh: "這輛車很貴。"

chat:
  conversations:
    - id: scenario-1-outside
      title:
        en: "Outside Today"
        ja: "今日の外"
        zh: "今天的戶外"
      messages:
        - role: partner
          text:
            en: "Look at the weather."
            ja: "天気を見てください。"
            zh: "看看這個天氣。"
        - role: user
          text:
            en: "Yes, it is very cold."
            ja: "はい、とても寒いです。"
            zh: "對，非常冷。"
        - role: partner
          text:
            en: "What time is it now?"
            ja: "今、何時ですか？"
            zh: "現在幾點了？"
        - role: user
          text:
            en: "It is five o'clock."
            ja: "5時です。"
            zh: "現在五點。"
        - role: partner
          text:
            en: "It gets dark fast."
            ja: "暗くなるのが早いです。"
            zh: "天黑得很快。"
        - role: user
          text:
            en: "That is true."
            ja: "それは本当です。"
            zh: "那是真的。"
        - role: partner
          text:
            en: "Let's go inside."
            ja: "中に入りましょう。"
            zh: "我們進去吧。"
        - role: user
          text:
            en: "Good idea."
            ja: "いい考えです。"
            zh: "好主意。"

    - id: scenario-2-shopping
      title:
        en: "At the Shop"
        ja: "お店で"
        zh: "在商店"
      messages:
        - role: partner
          text:
            en: "Is the shop open?"
            ja: "店は開いていますか？"
            zh: "商店有開嗎？"
        - role: user
          text:
            en: "Yes, the door is open."
            ja: "はい、ドアが開いています。"
            zh: "有，門是開著的。"
        - role: partner
          text:
            en: "Look at this red bag."
            ja: "この赤い鞄を見てください。"
            zh: "看這個紅色的包包。"
        - role: user
          text:
            en: "It is very nice."
            ja: "とても素敵です。"
            zh: "非常漂亮。"
        - role: partner
          text:
            en: "But it is expensive."
            ja: "でも、高いです。"
            zh: "但是它很貴。"
        - role: user
          text:
            en: "How much is it?"
            ja: "いくらですか？"
            zh: "多少錢？"
        - role: partner
          text:
            en: "It costs 200 dollars."
            ja: "200ドルします。"
            zh: "它要兩百元。"
        - role: user
          text:
            en: "We cannot buy it."
            ja: "私たちは買えません。"
            zh: "我們買不起。"

quiz:
  questionsPerRound: 5
  xpReward: 20`,er=`# Chapter: Yes / No Questions
# Focus: Notice the "ka" sound at the end makes it a question.
meta:
  id: yes-no-questions
  title:
    en: "Yes / No Questions"
    ja: "「はい」か「いいえ」の質問"
    zh: "是非問句"
  description:
    en: "Learn how to ask questions using 'ka'."
    ja: "「か」を使って質問する方法を学びましょう。"
    zh: "學習如何使用「ka」來提問。"
  icon: "❓"
  order: 4
  level: beginner

words:
  - id: yes
    word:
      en: Yes
      ja: はい
      zh: 是
    reading: Hai
    phonetic: "/haɪ/"
    description:
      en: "Used to agree or answer positively."
      ja: "同意したり、肯定的に答える時に使います。"
      zh: "用於同意或肯定回答。"
    sentence:
      en: "Yes, that is correct."
      ja: "はい、それは正しいです。"
      zh: "是的，那是對的。"

  - id: no
    word:
      en: No
      ja: いいえ
      zh: 不
    reading: Iie
    phonetic: "/iːe/"
    description:
      en: "Used to disagree or answer negatively."
      ja: "同意しない、または否定的に答える時に使います。"
      zh: "用於不同意或否定回答。"
    sentence:
      en: "No, I am not a student."
      ja: "いいえ、私は学生ではありません。"
      zh: "不，我不是學生。"

  - id: understand
    word:
      en: Understand
      ja: 分かります
      zh: 明白
    reading: Wakarimasu
    phonetic: "/wɑːkɑːriːmɑːsuː/"
    description:
      en: "To know the meaning of something."
      ja: "何かの意味を知ること。"
      zh: "知道某事的含义。"
    sentence:
      en: "Do you understand Japanese?"
      ja: "日本語が分かりますか？"
      zh: "你懂日語嗎？"

  - id: like
    word:
      en: Like
      ja: 好き
      zh: 喜歡
    reading: Suki
    phonetic: "/skiː/"
    description:
      en: "To find something agreeable or enjoyable."
      ja: "何かを好ましい、楽しいと感じること。"
      zh: "覺得某事物令人愉快或喜愛。"
    sentence:
      en: "I like sushi."
      ja: "私は寿司が好きです。"
      zh: "我喜歡壽司。"

  - id: eat
    word:
      en: Eat
      ja: 食べます
      zh: 吃
    reading: Tabemasu
    phonetic: "/tɑːbeɪmɑːsuː/"
    description:
      en: "To consume food."
      ja: "食べ物を摂取すること。"
      zh: "食用食物。"
    sentence:
      en: "I eat breakfast everyday."
      ja: "私は毎日朝食を食べます。"
      zh: "我每天吃早餐。"

  - id: book
    word:
      en: Book
      ja: 本
      zh: 書
    reading: Hon
    phonetic: "/hɒn/"
    description:
      en: "A set of pages with writing."
      ja: "文字が書かれたページの集まり。"
      zh: "有文字的頁面集合。"
    sentence:
      en: "Is this a book?"
      ja: "これは本ですか？"
      zh: "這是一本書嗎？"

chat:
  conversations:
    - id: scenario-1-asking-preferences
      title:
        en: "Asking Preferences"
        ja: "好みを尋ねる"
        zh: "詢問喜好"
      messages:
        - role: partner
          text:
            en: "Do you like sushi?"
            ja: "寿司が好きですか？"
            zh: "你喜歡壽司嗎？"
        - role: user
          text:
            en: "Yes, I like it."
            ja: "はい、好きです。"
            zh: "是的，我喜歡。"
        - role: partner
          text:
            en: "Do you eat fish?"
            ja: "魚を食べますか？"
            zh: "你吃魚嗎？"
        - role: user
          text:
            en: "No, I do not eat it."
            ja: "いいえ、食べません。"
            zh: "不，我不吃。"
        - role: partner
          text:
            en: "Do you eat meat?"
            ja: "肉を食べますか？"
            zh: "你吃肉嗎？"
        - role: user
          text:
            en: "Yes, I eat meat."
            ja: "はい、肉を食べます。"
            zh: "是的，我吃肉。"
        - role: partner
          text:
            en: "Is it delicious?"
            ja: "おいしいですか？"
            zh: "好吃嗎？"
        - role: user
          text:
            en: "Yes, it is delicious."
            ja: "はい、おいしいです。"
            zh: "是的，很好吃。"

    - id: scenario-2-understanding-objects
      title:
        en: "Checking Understanding"
        ja: "理解を確認する"
        zh: "確認理解"
      messages:
        - role: partner
          text:
            en: "Do you understand Japanese?"
            ja: "日本語が分かりますか？"
            zh: "你懂日語嗎？"
        - role: user
          text:
            en: "No, I do not understand."
            ja: "いいえ、分かりません。"
            zh: "不，我不懂。"
        - role: partner
          text:
            en: "Is this a book?"
            ja: "これは本ですか？"
            zh: "這是一本書嗎？"
        - role: user
          text:
            en: "Yes, that is a book."
            ja: "はい、それは本です。"
            zh: "是的，那是一本書。"
        - role: partner
          text:
            en: "Do you like books?"
            ja: "本が好きですか？"
            zh: "你喜歡書嗎？"
        - role: user
          text:
            en: "Yes, I like books."
            ja: "はい、本が好きです。"
            zh: "是的，我喜歡書。"
        - role: partner
          text:
            en: "Do you read everyday?"
            ja: "毎日読みますか？"
            zh: "你每天讀書嗎？"
        - role: user
          text:
            en: "No, not everyday."
            ja: "いいえ、毎日ではありません。"
            zh: "不，不是每天。"

quiz:
  questionsPerRound: 5
  xpReward: 20`,tr=`# Chapter: Discussing Movies

meta:
  id: discussing-movies
  title:
    en: "Discussing Movies"
    ja: "映画について語る"
  description:
    en: "Share your opinions on films, acting, and storylines."
    ja: "映画、演技、ストーリーについての意見を共有しましょう。"
  icon: "🎬"
  order: 3
  level: intermediate

words:
  - id: plot
    word:
      en: Plot
      ja: あらすじ
    reading: Arasuji
    phonetic: "/plɒt/"
    description:
      en: "The main events of a play, novel, or movie."
      ja: "劇、小説、または映画の主な出来事や筋書き。"
    sentence:
      en: "The plot was complex, but I understood the main idea."
      ja: "あらすじは複雑でしたが、要点は理解できました。"

  - id: performance
    word:
      en: Performance
      ja: 演技
    reading: Engi
    phonetic: "/pəˈfɔːməns/"
    description:
      en: "How well an actor plays their role in the film."
      ja: "俳優が映画の中でどれだけうまく役を演じているか。"
    sentence:
      en: "I thought the main actor's performance was incredibly moving."
      ja: "主演俳優の演技は信じられないほど感動的だと思いました。"

  - id: soundtrack
    word:
      en: Soundtrack
      ja: サウンドトラック
    reading: Saundotorakku
    phonetic: "/ˈsaʊndtræk/"
    description:
      en: "The music that is recorded for a movie."
      ja: "映画のために録音された音楽。"
    sentence:
      en: "This movie features a soundtrack that was composed by a famous artist."
      ja: "この映画は、有名なアーティストが作曲したサウンドトラックを特徴としています。"

  - id: genre
    word:
      en: Genre
      ja: ジャンル
    reading: Janru
    phonetic: "/ˈʒɒnrə/"
    description:
      en: "A category of artistic composition, like comedy or horror."
      ja: "コメディやホラーのような芸術作品のカテゴリー。"
    sentence:
      en: "I usually prefer action, but this romance genre is interesting."
      ja: "私は普段アクションを好みますが、この恋愛ジャンルは面白いです。"

  - id: recommend
    word:
      en: Recommend
      ja: 勧める
    reading: Susumeru
    phonetic: "/ˌrɛkəˈmɛnd/"
    description:
      en: "To suggest that something is good or suitable."
      ja: "何かが良い、または適していると提案すること。"
    sentence:
      en: "I have recommended this film to everyone who likes history."
      ja: "私は歴史が好きな人全員にこの映画を勧めました。"

  - id: disappointing
    word:
      en: Disappointing
      ja: 残念な
    reading: Zannen na
    phonetic: "/ˌdɪsəˈpɔɪntɪŋ/"
    description:
      en: "Failing to fulfill someone's hopes or expectations."
      ja: "誰かの希望や期待を満たせなかったこと。"
    sentence:
      en: "The ending was a bit disappointing because it felt unresolved."
      ja: "結末は未解決な感じがして、少し残念でした。"

chat:
  conversations:
    - id: scenario-1-post-movie-thoughts
      title:
        en: "Post-Movie Thoughts"
        ja: "映画を見終わった後の感想"
      messages:
        - role: partner
          text:
            en: "Have you ever seen a movie with such an intense ending before?"
            ja: "これほど強烈な結末の映画を、今までに見たことがありますか？"
        - role: user
          text:
            en: "No, I haven't. The plot twists really surprised me until the very end."
            ja: "いいえ、ありません。あらすじの展開には最後まで本当に驚かされました。"
        - role: partner
          text:
            en: "I agree, although I felt the lead actor's performance was slightly exaggerated."
            ja: "同感ですが、主演俳優の演技は少し大げさだと感じました。"
        - role: user
          text:
            en: "Really? I actually thought his emotional acting was the best part."
            ja: "そうですか？私はむしろ、彼の感情的な演技が一番良かったと思いました。"
        - role: partner
          text:
            en: "Well, at least the soundtrack that played during the final scene was beautiful."
            ja: "まあ、少なくとも最後のシーンで流れたサウンドトラックは美しかったです。"
        - role: user
          text:
            en: "Yes, the music perfectly matched the mysterious mood of the scene."
            ja: "はい、音楽はそのシーンの神秘的な雰囲気に完璧に合っていました。"
        - role: partner
          text:
            en: "I am glad we decided to watch this drama genre today."
            ja: "今日はこのドラマジャンルを見ることに決めてよかったです。"
        - role: user
          text:
            en: "Me too. It has been a long time since I enjoyed a film this much."
            ja: "私もです。これほど映画を楽しめたのは久しぶりです。"

    - id: scenario-2-sharing-recommendations
      title:
        en: "Sharing Recommendations"
        ja: "おすすめを共有する"
      messages:
        - role: partner
          text:
            en: "Since you liked that movie, would you recommend it to my brother?"
            ja: "あの映画が気に入ったのなら、私の兄にも勧めますか？"
        - role: user
          text:
            en: "Yes, I have already sent him a message telling him to watch it."
            ja: "はい、もう彼に「見るように」とメッセージを送りました。"
        - role: partner
          text:
            en: "He often finds slow movies disappointing, so I was worried he might get bored."
            ja: "彼はよく遅い展開の映画を残念に思うので、退屈しないか心配でした。"
        - role: user
          text:
            en: "Even if it is slow, the story is compelling enough to keep his attention."
            ja: "たとえ展開が遅くても、物語は彼の注意を引くのに十分魅力的です。"
        - role: partner
          text:
            en: "That is good to know. By the way, have you heard about the sequel?"
            ja: "それは良かったです。ところで、続編について聞いたことはありますか？"
        - role: user
          text:
            en: "I have heard rumors, but I don't know if they have started filming yet."
            ja: "噂は聞いていますが、まだ撮影が始まったかどうかは知りません。"
        - role: partner
          text:
            en: "If the original cast returns, I will definitely buy tickets immediately."
            ja: "もしオリジナルのキャストが戻ってくるなら、私は間違いなくすぐにチケットを買います。"
        - role: user
          text:
            en: "Let's hope the sequel lives up to the high standards of the first one."
            ja: "続編が１作目の高い基準に応えてくれることを期待しましょう。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`;function ke(n){return typeof n>"u"||n===null}function rr(n){return typeof n=="object"&&n!==null}function ar(n){return Array.isArray(n)?n:ke(n)?[]:[n]}function ir(n,e){var t,a,r,i;if(e)for(i=Object.keys(e),t=0,a=i.length;t<a;t+=1)r=i[t],n[r]=e[r];return n}function or(n,e){var t="",a;for(a=0;a<e;a+=1)t+=n;return t}function sr(n){return n===0&&Number.NEGATIVE_INFINITY===1/n}var lr=ke,hr=rr,dr=ar,ur=or,cr=sr,pr=ir,H={isNothing:lr,isObject:hr,toArray:dr,repeat:ur,isNegativeZero:cr,extend:pr};function Ie(n,e){var t="",a=n.reason||"(unknown reason)";return n.mark?(n.mark.name&&(t+='in "'+n.mark.name+'" '),t+="("+(n.mark.line+1)+":"+(n.mark.column+1)+")",!e&&n.mark.snippet&&(t+=`

`+n.mark.snippet),a+" "+t):a}function xn(n,e){Error.call(this),this.name="YAMLException",this.reason=n,this.mark=e,this.message=Ie(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}xn.prototype=Object.create(Error.prototype);xn.prototype.constructor=xn;xn.prototype.toString=function(e){return this.name+": "+Ie(this,e)};var U=xn;function Wn(n,e,t,a,r){var i="",o="",s=Math.floor(r/2)-1;return a-e>s&&(i=" ... ",e=a-s+i.length),t-a>s&&(o=" ...",t=a+s-o.length),{str:i+n.slice(e,t).replace(/\t/g,"→")+o,pos:a-e+i.length}}function Dn(n,e){return H.repeat(" ",e-n.length)+n}function gr(n,e){if(e=Object.create(e||null),!n.buffer)return null;e.maxLength||(e.maxLength=79),typeof e.indent!="number"&&(e.indent=1),typeof e.linesBefore!="number"&&(e.linesBefore=3),typeof e.linesAfter!="number"&&(e.linesAfter=2);for(var t=/\r?\n|\r|\0/g,a=[0],r=[],i,o=-1;i=t.exec(n.buffer);)r.push(i.index),a.push(i.index+i[0].length),n.position<=i.index&&o<0&&(o=a.length-2);o<0&&(o=a.length-1);var s="",h,d,p=Math.min(n.line+e.linesAfter,r.length).toString().length,m=e.maxLength-(e.indent+p+3);for(h=1;h<=e.linesBefore&&!(o-h<0);h++)d=Wn(n.buffer,a[o-h],r[o-h],n.position-(a[o]-a[o-h]),m),s=H.repeat(" ",e.indent)+Dn((n.line-h+1).toString(),p)+" | "+d.str+`
`+s;for(d=Wn(n.buffer,a[o],r[o],n.position,m),s+=H.repeat(" ",e.indent)+Dn((n.line+1).toString(),p)+" | "+d.str+`
`,s+=H.repeat("-",e.indent+p+3+d.pos)+`^
`,h=1;h<=e.linesAfter&&!(o+h>=r.length);h++)d=Wn(n.buffer,a[o+h],r[o+h],n.position-(a[o]-a[o+h]),m),s+=H.repeat(" ",e.indent)+Dn((n.line+h+1).toString(),p)+" | "+d.str+`
`;return s.replace(/\n$/,"")}var mr=gr,fr=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],yr=["scalar","sequence","mapping"];function jr(n){var e={};return n!==null&&Object.keys(n).forEach(function(t){n[t].forEach(function(a){e[String(a)]=t})}),e}function xr(n,e){if(e=e||{},Object.keys(e).forEach(function(t){if(fr.indexOf(t)===-1)throw new U('Unknown option "'+t+'" is met in definition of "'+n+'" YAML type.')}),this.options=e,this.tag=n,this.kind=e.kind||null,this.resolve=e.resolve||function(){return!0},this.construct=e.construct||function(t){return t},this.instanceOf=e.instanceOf||null,this.predicate=e.predicate||null,this.represent=e.represent||null,this.representName=e.representName||null,this.defaultStyle=e.defaultStyle||null,this.multi=e.multi||!1,this.styleAliases=jr(e.styleAliases||null),yr.indexOf(this.kind)===-1)throw new U('Unknown kind "'+this.kind+'" is specified for "'+n+'" YAML type.')}var Y=xr;function ae(n,e){var t=[];return n[e].forEach(function(a){var r=t.length;t.forEach(function(i,o){i.tag===a.tag&&i.kind===a.kind&&i.multi===a.multi&&(r=o)}),t[r]=a}),t}function zr(){var n={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},e,t;function a(r){r.multi?(n.multi[r.kind].push(r),n.multi.fallback.push(r)):n[r.kind][r.tag]=n.fallback[r.tag]=r}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(a);return n}function Hn(n){return this.extend(n)}Hn.prototype.extend=function(e){var t=[],a=[];if(e instanceof Y)a.push(e);else if(Array.isArray(e))a=a.concat(e);else if(e&&(Array.isArray(e.implicit)||Array.isArray(e.explicit)))e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(a=a.concat(e.explicit));else throw new U("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");t.forEach(function(i){if(!(i instanceof Y))throw new U("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(i.loadKind&&i.loadKind!=="scalar")throw new U("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(i.multi)throw new U("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),a.forEach(function(i){if(!(i instanceof Y))throw new U("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var r=Object.create(Hn.prototype);return r.implicit=(this.implicit||[]).concat(t),r.explicit=(this.explicit||[]).concat(a),r.compiledImplicit=ae(r,"implicit"),r.compiledExplicit=ae(r,"explicit"),r.compiledTypeMap=zr(r.compiledImplicit,r.compiledExplicit),r};var _e=Hn,Se=new Y("tag:yaml.org,2002:str",{kind:"scalar",construct:function(n){return n!==null?n:""}}),Ae=new Y("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(n){return n!==null?n:[]}}),Te=new Y("tag:yaml.org,2002:map",{kind:"mapping",construct:function(n){return n!==null?n:{}}}),Ce=new _e({explicit:[Se,Ae,Te]});function wr(n){if(n===null)return!0;var e=n.length;return e===1&&n==="~"||e===4&&(n==="null"||n==="Null"||n==="NULL")}function vr(){return null}function br(n){return n===null}var Ee=new Y("tag:yaml.org,2002:null",{kind:"scalar",resolve:wr,construct:vr,predicate:br,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function kr(n){if(n===null)return!1;var e=n.length;return e===4&&(n==="true"||n==="True"||n==="TRUE")||e===5&&(n==="false"||n==="False"||n==="FALSE")}function Ir(n){return n==="true"||n==="True"||n==="TRUE"}function _r(n){return Object.prototype.toString.call(n)==="[object Boolean]"}var Me=new Y("tag:yaml.org,2002:bool",{kind:"scalar",resolve:kr,construct:Ir,predicate:_r,represent:{lowercase:function(n){return n?"true":"false"},uppercase:function(n){return n?"TRUE":"FALSE"},camelcase:function(n){return n?"True":"False"}},defaultStyle:"lowercase"});function Sr(n){return 48<=n&&n<=57||65<=n&&n<=70||97<=n&&n<=102}function Ar(n){return 48<=n&&n<=55}function Tr(n){return 48<=n&&n<=57}function Cr(n){if(n===null)return!1;var e=n.length,t=0,a=!1,r;if(!e)return!1;if(r=n[t],(r==="-"||r==="+")&&(r=n[++t]),r==="0"){if(t+1===e)return!0;if(r=n[++t],r==="b"){for(t++;t<e;t++)if(r=n[t],r!=="_"){if(r!=="0"&&r!=="1")return!1;a=!0}return a&&r!=="_"}if(r==="x"){for(t++;t<e;t++)if(r=n[t],r!=="_"){if(!Sr(n.charCodeAt(t)))return!1;a=!0}return a&&r!=="_"}if(r==="o"){for(t++;t<e;t++)if(r=n[t],r!=="_"){if(!Ar(n.charCodeAt(t)))return!1;a=!0}return a&&r!=="_"}}if(r==="_")return!1;for(;t<e;t++)if(r=n[t],r!=="_"){if(!Tr(n.charCodeAt(t)))return!1;a=!0}return!(!a||r==="_")}function Er(n){var e=n,t=1,a;if(e.indexOf("_")!==-1&&(e=e.replace(/_/g,"")),a=e[0],(a==="-"||a==="+")&&(a==="-"&&(t=-1),e=e.slice(1),a=e[0]),e==="0")return 0;if(a==="0"){if(e[1]==="b")return t*parseInt(e.slice(2),2);if(e[1]==="x")return t*parseInt(e.slice(2),16);if(e[1]==="o")return t*parseInt(e.slice(2),8)}return t*parseInt(e,10)}function Mr(n){return Object.prototype.toString.call(n)==="[object Number]"&&n%1===0&&!H.isNegativeZero(n)}var Re=new Y("tag:yaml.org,2002:int",{kind:"scalar",resolve:Cr,construct:Er,predicate:Mr,represent:{binary:function(n){return n>=0?"0b"+n.toString(2):"-0b"+n.toString(2).slice(1)},octal:function(n){return n>=0?"0o"+n.toString(8):"-0o"+n.toString(8).slice(1)},decimal:function(n){return n.toString(10)},hexadecimal:function(n){return n>=0?"0x"+n.toString(16).toUpperCase():"-0x"+n.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),Rr=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function Wr(n){return!(n===null||!Rr.test(n)||n[n.length-1]==="_")}function Dr(n){var e,t;return e=n.replace(/_/g,"").toLowerCase(),t=e[0]==="-"?-1:1,"+-".indexOf(e[0])>=0&&(e=e.slice(1)),e===".inf"?t===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:e===".nan"?NaN:t*parseFloat(e,10)}var Nr=/^[-+]?[0-9]+e/;function Pr(n,e){var t;if(isNaN(n))switch(e){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===n)switch(e){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===n)switch(e){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(H.isNegativeZero(n))return"-0.0";return t=n.toString(10),Nr.test(t)?t.replace("e",".e"):t}function Or(n){return Object.prototype.toString.call(n)==="[object Number]"&&(n%1!==0||H.isNegativeZero(n))}var We=new Y("tag:yaml.org,2002:float",{kind:"scalar",resolve:Wr,construct:Dr,predicate:Or,represent:Pr,defaultStyle:"lowercase"}),De=Ce.extend({implicit:[Ee,Me,Re,We]}),Ne=De,Pe=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Oe=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function Fr(n){return n===null?!1:Pe.exec(n)!==null||Oe.exec(n)!==null}function Lr(n){var e,t,a,r,i,o,s,h=0,d=null,p,m,u;if(e=Pe.exec(n),e===null&&(e=Oe.exec(n)),e===null)throw new Error("Date resolve error");if(t=+e[1],a=+e[2]-1,r=+e[3],!e[4])return new Date(Date.UTC(t,a,r));if(i=+e[4],o=+e[5],s=+e[6],e[7]){for(h=e[7].slice(0,3);h.length<3;)h+="0";h=+h}return e[9]&&(p=+e[10],m=+(e[11]||0),d=(p*60+m)*6e4,e[9]==="-"&&(d=-d)),u=new Date(Date.UTC(t,a,r,i,o,s,h)),d&&u.setTime(u.getTime()-d),u}function Hr(n){return n.toISOString()}var Fe=new Y("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:Fr,construct:Lr,instanceOf:Date,represent:Hr});function Yr(n){return n==="<<"||n===null}var Le=new Y("tag:yaml.org,2002:merge",{kind:"scalar",resolve:Yr}),Kn=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function Br(n){if(n===null)return!1;var e,t,a=0,r=n.length,i=Kn;for(t=0;t<r;t++)if(e=i.indexOf(n.charAt(t)),!(e>64)){if(e<0)return!1;a+=6}return a%8===0}function $r(n){var e,t,a=n.replace(/[\r\n=]/g,""),r=a.length,i=Kn,o=0,s=[];for(e=0;e<r;e++)e%4===0&&e&&(s.push(o>>16&255),s.push(o>>8&255),s.push(o&255)),o=o<<6|i.indexOf(a.charAt(e));return t=r%4*6,t===0?(s.push(o>>16&255),s.push(o>>8&255),s.push(o&255)):t===18?(s.push(o>>10&255),s.push(o>>2&255)):t===12&&s.push(o>>4&255),new Uint8Array(s)}function qr(n){var e="",t=0,a,r,i=n.length,o=Kn;for(a=0;a<i;a++)a%3===0&&a&&(e+=o[t>>18&63],e+=o[t>>12&63],e+=o[t>>6&63],e+=o[t&63]),t=(t<<8)+n[a];return r=i%3,r===0?(e+=o[t>>18&63],e+=o[t>>12&63],e+=o[t>>6&63],e+=o[t&63]):r===2?(e+=o[t>>10&63],e+=o[t>>4&63],e+=o[t<<2&63],e+=o[64]):r===1&&(e+=o[t>>2&63],e+=o[t<<4&63],e+=o[64],e+=o[64]),e}function Ur(n){return Object.prototype.toString.call(n)==="[object Uint8Array]"}var He=new Y("tag:yaml.org,2002:binary",{kind:"scalar",resolve:Br,construct:$r,predicate:Ur,represent:qr}),Gr=Object.prototype.hasOwnProperty,Kr=Object.prototype.toString;function Vr(n){if(n===null)return!0;var e=[],t,a,r,i,o,s=n;for(t=0,a=s.length;t<a;t+=1){if(r=s[t],o=!1,Kr.call(r)!=="[object Object]")return!1;for(i in r)if(Gr.call(r,i))if(!o)o=!0;else return!1;if(!o)return!1;if(e.indexOf(i)===-1)e.push(i);else return!1}return!0}function Qr(n){return n!==null?n:[]}var Ye=new Y("tag:yaml.org,2002:omap",{kind:"sequence",resolve:Vr,construct:Qr}),Jr=Object.prototype.toString;function Zr(n){if(n===null)return!0;var e,t,a,r,i,o=n;for(i=new Array(o.length),e=0,t=o.length;e<t;e+=1){if(a=o[e],Jr.call(a)!=="[object Object]"||(r=Object.keys(a),r.length!==1))return!1;i[e]=[r[0],a[r[0]]]}return!0}function Xr(n){if(n===null)return[];var e,t,a,r,i,o=n;for(i=new Array(o.length),e=0,t=o.length;e<t;e+=1)a=o[e],r=Object.keys(a),i[e]=[r[0],a[r[0]]];return i}var Be=new Y("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:Zr,construct:Xr}),na=Object.prototype.hasOwnProperty;function ea(n){if(n===null)return!0;var e,t=n;for(e in t)if(na.call(t,e)&&t[e]!==null)return!1;return!0}function ta(n){return n!==null?n:{}}var $e=new Y("tag:yaml.org,2002:set",{kind:"mapping",resolve:ea,construct:ta}),Vn=Ne.extend({implicit:[Fe,Le],explicit:[He,Ye,Be,$e]}),ln=Object.prototype.hasOwnProperty,Sn=1,qe=2,Ue=3,An=4,Nn=1,ra=2,ie=3,aa=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,ia=/[\x85\u2028\u2029]/,oa=/[,\[\]\{\}]/,Ge=/^(?:!|!!|![a-z\-]+!)$/i,Ke=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function oe(n){return Object.prototype.toString.call(n)}function en(n){return n===10||n===13}function hn(n){return n===9||n===32}function K(n){return n===9||n===32||n===10||n===13}function pn(n){return n===44||n===91||n===93||n===123||n===125}function sa(n){var e;return 48<=n&&n<=57?n-48:(e=n|32,97<=e&&e<=102?e-97+10:-1)}function la(n){return n===120?2:n===117?4:n===85?8:0}function ha(n){return 48<=n&&n<=57?n-48:-1}function se(n){return n===48?"\0":n===97?"\x07":n===98?"\b":n===116||n===9?"	":n===110?`
`:n===118?"\v":n===102?"\f":n===114?"\r":n===101?"\x1B":n===32?" ":n===34?'"':n===47?"/":n===92?"\\":n===78?"":n===95?" ":n===76?"\u2028":n===80?"\u2029":""}function da(n){return n<=65535?String.fromCharCode(n):String.fromCharCode((n-65536>>10)+55296,(n-65536&1023)+56320)}function Ve(n,e,t){e==="__proto__"?Object.defineProperty(n,e,{configurable:!0,enumerable:!0,writable:!0,value:t}):n[e]=t}var Qe=new Array(256),Je=new Array(256);for(var un=0;un<256;un++)Qe[un]=se(un)?1:0,Je[un]=se(un);function ua(n,e){this.input=n,this.filename=e.filename||null,this.schema=e.schema||Vn,this.onWarning=e.onWarning||null,this.legacy=e.legacy||!1,this.json=e.json||!1,this.listener=e.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=n.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function Ze(n,e){var t={name:n.filename,buffer:n.input.slice(0,-1),position:n.position,line:n.line,column:n.position-n.lineStart};return t.snippet=mr(t),new U(e,t)}function z(n,e){throw Ze(n,e)}function Tn(n,e){n.onWarning&&n.onWarning.call(null,Ze(n,e))}var le={YAML:function(e,t,a){var r,i,o;e.version!==null&&z(e,"duplication of %YAML directive"),a.length!==1&&z(e,"YAML directive accepts exactly one argument"),r=/^([0-9]+)\.([0-9]+)$/.exec(a[0]),r===null&&z(e,"ill-formed argument of the YAML directive"),i=parseInt(r[1],10),o=parseInt(r[2],10),i!==1&&z(e,"unacceptable YAML version of the document"),e.version=a[0],e.checkLineBreaks=o<2,o!==1&&o!==2&&Tn(e,"unsupported YAML version of the document")},TAG:function(e,t,a){var r,i;a.length!==2&&z(e,"TAG directive accepts exactly two arguments"),r=a[0],i=a[1],Ge.test(r)||z(e,"ill-formed tag handle (first argument) of the TAG directive"),ln.call(e.tagMap,r)&&z(e,'there is a previously declared suffix for "'+r+'" tag handle'),Ke.test(i)||z(e,"ill-formed tag prefix (second argument) of the TAG directive");try{i=decodeURIComponent(i)}catch{z(e,"tag prefix is malformed: "+i)}e.tagMap[r]=i}};function an(n,e,t,a){var r,i,o,s;if(e<t){if(s=n.input.slice(e,t),a)for(r=0,i=s.length;r<i;r+=1)o=s.charCodeAt(r),o===9||32<=o&&o<=1114111||z(n,"expected valid JSON character");else aa.test(s)&&z(n,"the stream contains non-printable characters");n.result+=s}}function he(n,e,t,a){var r,i,o,s;for(H.isObject(t)||z(n,"cannot merge mappings; the provided source object is unacceptable"),r=Object.keys(t),o=0,s=r.length;o<s;o+=1)i=r[o],ln.call(e,i)||(Ve(e,i,t[i]),a[i]=!0)}function gn(n,e,t,a,r,i,o,s,h){var d,p;if(Array.isArray(r))for(r=Array.prototype.slice.call(r),d=0,p=r.length;d<p;d+=1)Array.isArray(r[d])&&z(n,"nested arrays are not supported inside keys"),typeof r=="object"&&oe(r[d])==="[object Object]"&&(r[d]="[object Object]");if(typeof r=="object"&&oe(r)==="[object Object]"&&(r="[object Object]"),r=String(r),e===null&&(e={}),a==="tag:yaml.org,2002:merge")if(Array.isArray(i))for(d=0,p=i.length;d<p;d+=1)he(n,e,i[d],t);else he(n,e,i,t);else!n.json&&!ln.call(t,r)&&ln.call(e,r)&&(n.line=o||n.line,n.lineStart=s||n.lineStart,n.position=h||n.position,z(n,"duplicated mapping key")),Ve(e,r,i),delete t[r];return e}function Qn(n){var e;e=n.input.charCodeAt(n.position),e===10?n.position++:e===13?(n.position++,n.input.charCodeAt(n.position)===10&&n.position++):z(n,"a line break is expected"),n.line+=1,n.lineStart=n.position,n.firstTabInLine=-1}function F(n,e,t){for(var a=0,r=n.input.charCodeAt(n.position);r!==0;){for(;hn(r);)r===9&&n.firstTabInLine===-1&&(n.firstTabInLine=n.position),r=n.input.charCodeAt(++n.position);if(e&&r===35)do r=n.input.charCodeAt(++n.position);while(r!==10&&r!==13&&r!==0);if(en(r))for(Qn(n),r=n.input.charCodeAt(n.position),a++,n.lineIndent=0;r===32;)n.lineIndent++,r=n.input.charCodeAt(++n.position);else break}return t!==-1&&a!==0&&n.lineIndent<t&&Tn(n,"deficient indentation"),a}function Mn(n){var e=n.position,t;return t=n.input.charCodeAt(e),!!((t===45||t===46)&&t===n.input.charCodeAt(e+1)&&t===n.input.charCodeAt(e+2)&&(e+=3,t=n.input.charCodeAt(e),t===0||K(t)))}function Jn(n,e){e===1?n.result+=" ":e>1&&(n.result+=H.repeat(`
`,e-1))}function ca(n,e,t){var a,r,i,o,s,h,d,p,m=n.kind,u=n.result,f;if(f=n.input.charCodeAt(n.position),K(f)||pn(f)||f===35||f===38||f===42||f===33||f===124||f===62||f===39||f===34||f===37||f===64||f===96||(f===63||f===45)&&(r=n.input.charCodeAt(n.position+1),K(r)||t&&pn(r)))return!1;for(n.kind="scalar",n.result="",i=o=n.position,s=!1;f!==0;){if(f===58){if(r=n.input.charCodeAt(n.position+1),K(r)||t&&pn(r))break}else if(f===35){if(a=n.input.charCodeAt(n.position-1),K(a))break}else{if(n.position===n.lineStart&&Mn(n)||t&&pn(f))break;if(en(f))if(h=n.line,d=n.lineStart,p=n.lineIndent,F(n,!1,-1),n.lineIndent>=e){s=!0,f=n.input.charCodeAt(n.position);continue}else{n.position=o,n.line=h,n.lineStart=d,n.lineIndent=p;break}}s&&(an(n,i,o,!1),Jn(n,n.line-h),i=o=n.position,s=!1),hn(f)||(o=n.position+1),f=n.input.charCodeAt(++n.position)}return an(n,i,o,!1),n.result?!0:(n.kind=m,n.result=u,!1)}function pa(n,e){var t,a,r;if(t=n.input.charCodeAt(n.position),t!==39)return!1;for(n.kind="scalar",n.result="",n.position++,a=r=n.position;(t=n.input.charCodeAt(n.position))!==0;)if(t===39)if(an(n,a,n.position,!0),t=n.input.charCodeAt(++n.position),t===39)a=n.position,n.position++,r=n.position;else return!0;else en(t)?(an(n,a,r,!0),Jn(n,F(n,!1,e)),a=r=n.position):n.position===n.lineStart&&Mn(n)?z(n,"unexpected end of the document within a single quoted scalar"):(n.position++,r=n.position);z(n,"unexpected end of the stream within a single quoted scalar")}function ga(n,e){var t,a,r,i,o,s;if(s=n.input.charCodeAt(n.position),s!==34)return!1;for(n.kind="scalar",n.result="",n.position++,t=a=n.position;(s=n.input.charCodeAt(n.position))!==0;){if(s===34)return an(n,t,n.position,!0),n.position++,!0;if(s===92){if(an(n,t,n.position,!0),s=n.input.charCodeAt(++n.position),en(s))F(n,!1,e);else if(s<256&&Qe[s])n.result+=Je[s],n.position++;else if((o=la(s))>0){for(r=o,i=0;r>0;r--)s=n.input.charCodeAt(++n.position),(o=sa(s))>=0?i=(i<<4)+o:z(n,"expected hexadecimal character");n.result+=da(i),n.position++}else z(n,"unknown escape sequence");t=a=n.position}else en(s)?(an(n,t,a,!0),Jn(n,F(n,!1,e)),t=a=n.position):n.position===n.lineStart&&Mn(n)?z(n,"unexpected end of the document within a double quoted scalar"):(n.position++,a=n.position)}z(n,"unexpected end of the stream within a double quoted scalar")}function ma(n,e){var t=!0,a,r,i,o=n.tag,s,h=n.anchor,d,p,m,u,f,x=Object.create(null),w,I,C,v;if(v=n.input.charCodeAt(n.position),v===91)p=93,f=!1,s=[];else if(v===123)p=125,f=!0,s={};else return!1;for(n.anchor!==null&&(n.anchorMap[n.anchor]=s),v=n.input.charCodeAt(++n.position);v!==0;){if(F(n,!0,e),v=n.input.charCodeAt(n.position),v===p)return n.position++,n.tag=o,n.anchor=h,n.kind=f?"mapping":"sequence",n.result=s,!0;t?v===44&&z(n,"expected the node content, but found ','"):z(n,"missed comma between flow collection entries"),I=w=C=null,m=u=!1,v===63&&(d=n.input.charCodeAt(n.position+1),K(d)&&(m=u=!0,n.position++,F(n,!0,e))),a=n.line,r=n.lineStart,i=n.position,mn(n,e,Sn,!1,!0),I=n.tag,w=n.result,F(n,!0,e),v=n.input.charCodeAt(n.position),(u||n.line===a)&&v===58&&(m=!0,v=n.input.charCodeAt(++n.position),F(n,!0,e),mn(n,e,Sn,!1,!0),C=n.result),f?gn(n,s,x,I,w,C,a,r,i):m?s.push(gn(n,null,x,I,w,C,a,r,i)):s.push(w),F(n,!0,e),v=n.input.charCodeAt(n.position),v===44?(t=!0,v=n.input.charCodeAt(++n.position)):t=!1}z(n,"unexpected end of the stream within a flow collection")}function fa(n,e){var t,a,r=Nn,i=!1,o=!1,s=e,h=0,d=!1,p,m;if(m=n.input.charCodeAt(n.position),m===124)a=!1;else if(m===62)a=!0;else return!1;for(n.kind="scalar",n.result="";m!==0;)if(m=n.input.charCodeAt(++n.position),m===43||m===45)Nn===r?r=m===43?ie:ra:z(n,"repeat of a chomping mode identifier");else if((p=ha(m))>=0)p===0?z(n,"bad explicit indentation width of a block scalar; it cannot be less than one"):o?z(n,"repeat of an indentation width identifier"):(s=e+p-1,o=!0);else break;if(hn(m)){do m=n.input.charCodeAt(++n.position);while(hn(m));if(m===35)do m=n.input.charCodeAt(++n.position);while(!en(m)&&m!==0)}for(;m!==0;){for(Qn(n),n.lineIndent=0,m=n.input.charCodeAt(n.position);(!o||n.lineIndent<s)&&m===32;)n.lineIndent++,m=n.input.charCodeAt(++n.position);if(!o&&n.lineIndent>s&&(s=n.lineIndent),en(m)){h++;continue}if(n.lineIndent<s){r===ie?n.result+=H.repeat(`
`,i?1+h:h):r===Nn&&i&&(n.result+=`
`);break}for(a?hn(m)?(d=!0,n.result+=H.repeat(`
`,i?1+h:h)):d?(d=!1,n.result+=H.repeat(`
`,h+1)):h===0?i&&(n.result+=" "):n.result+=H.repeat(`
`,h):n.result+=H.repeat(`
`,i?1+h:h),i=!0,o=!0,h=0,t=n.position;!en(m)&&m!==0;)m=n.input.charCodeAt(++n.position);an(n,t,n.position,!1)}return!0}function de(n,e){var t,a=n.tag,r=n.anchor,i=[],o,s=!1,h;if(n.firstTabInLine!==-1)return!1;for(n.anchor!==null&&(n.anchorMap[n.anchor]=i),h=n.input.charCodeAt(n.position);h!==0&&(n.firstTabInLine!==-1&&(n.position=n.firstTabInLine,z(n,"tab characters must not be used in indentation")),!(h!==45||(o=n.input.charCodeAt(n.position+1),!K(o))));){if(s=!0,n.position++,F(n,!0,-1)&&n.lineIndent<=e){i.push(null),h=n.input.charCodeAt(n.position);continue}if(t=n.line,mn(n,e,Ue,!1,!0),i.push(n.result),F(n,!0,-1),h=n.input.charCodeAt(n.position),(n.line===t||n.lineIndent>e)&&h!==0)z(n,"bad indentation of a sequence entry");else if(n.lineIndent<e)break}return s?(n.tag=a,n.anchor=r,n.kind="sequence",n.result=i,!0):!1}function ya(n,e,t){var a,r,i,o,s,h,d=n.tag,p=n.anchor,m={},u=Object.create(null),f=null,x=null,w=null,I=!1,C=!1,v;if(n.firstTabInLine!==-1)return!1;for(n.anchor!==null&&(n.anchorMap[n.anchor]=m),v=n.input.charCodeAt(n.position);v!==0;){if(!I&&n.firstTabInLine!==-1&&(n.position=n.firstTabInLine,z(n,"tab characters must not be used in indentation")),a=n.input.charCodeAt(n.position+1),i=n.line,(v===63||v===58)&&K(a))v===63?(I&&(gn(n,m,u,f,x,null,o,s,h),f=x=w=null),C=!0,I=!0,r=!0):I?(I=!1,r=!0):z(n,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),n.position+=1,v=a;else{if(o=n.line,s=n.lineStart,h=n.position,!mn(n,t,qe,!1,!0))break;if(n.line===i){for(v=n.input.charCodeAt(n.position);hn(v);)v=n.input.charCodeAt(++n.position);if(v===58)v=n.input.charCodeAt(++n.position),K(v)||z(n,"a whitespace character is expected after the key-value separator within a block mapping"),I&&(gn(n,m,u,f,x,null,o,s,h),f=x=w=null),C=!0,I=!1,r=!1,f=n.tag,x=n.result;else if(C)z(n,"can not read an implicit mapping pair; a colon is missed");else return n.tag=d,n.anchor=p,!0}else if(C)z(n,"can not read a block mapping entry; a multiline key may not be an implicit key");else return n.tag=d,n.anchor=p,!0}if((n.line===i||n.lineIndent>e)&&(I&&(o=n.line,s=n.lineStart,h=n.position),mn(n,e,An,!0,r)&&(I?x=n.result:w=n.result),I||(gn(n,m,u,f,x,w,o,s,h),f=x=w=null),F(n,!0,-1),v=n.input.charCodeAt(n.position)),(n.line===i||n.lineIndent>e)&&v!==0)z(n,"bad indentation of a mapping entry");else if(n.lineIndent<e)break}return I&&gn(n,m,u,f,x,null,o,s,h),C&&(n.tag=d,n.anchor=p,n.kind="mapping",n.result=m),C}function ja(n){var e,t=!1,a=!1,r,i,o;if(o=n.input.charCodeAt(n.position),o!==33)return!1;if(n.tag!==null&&z(n,"duplication of a tag property"),o=n.input.charCodeAt(++n.position),o===60?(t=!0,o=n.input.charCodeAt(++n.position)):o===33?(a=!0,r="!!",o=n.input.charCodeAt(++n.position)):r="!",e=n.position,t){do o=n.input.charCodeAt(++n.position);while(o!==0&&o!==62);n.position<n.length?(i=n.input.slice(e,n.position),o=n.input.charCodeAt(++n.position)):z(n,"unexpected end of the stream within a verbatim tag")}else{for(;o!==0&&!K(o);)o===33&&(a?z(n,"tag suffix cannot contain exclamation marks"):(r=n.input.slice(e-1,n.position+1),Ge.test(r)||z(n,"named tag handle cannot contain such characters"),a=!0,e=n.position+1)),o=n.input.charCodeAt(++n.position);i=n.input.slice(e,n.position),oa.test(i)&&z(n,"tag suffix cannot contain flow indicator characters")}i&&!Ke.test(i)&&z(n,"tag name cannot contain such characters: "+i);try{i=decodeURIComponent(i)}catch{z(n,"tag name is malformed: "+i)}return t?n.tag=i:ln.call(n.tagMap,r)?n.tag=n.tagMap[r]+i:r==="!"?n.tag="!"+i:r==="!!"?n.tag="tag:yaml.org,2002:"+i:z(n,'undeclared tag handle "'+r+'"'),!0}function xa(n){var e,t;if(t=n.input.charCodeAt(n.position),t!==38)return!1;for(n.anchor!==null&&z(n,"duplication of an anchor property"),t=n.input.charCodeAt(++n.position),e=n.position;t!==0&&!K(t)&&!pn(t);)t=n.input.charCodeAt(++n.position);return n.position===e&&z(n,"name of an anchor node must contain at least one character"),n.anchor=n.input.slice(e,n.position),!0}function za(n){var e,t,a;if(a=n.input.charCodeAt(n.position),a!==42)return!1;for(a=n.input.charCodeAt(++n.position),e=n.position;a!==0&&!K(a)&&!pn(a);)a=n.input.charCodeAt(++n.position);return n.position===e&&z(n,"name of an alias node must contain at least one character"),t=n.input.slice(e,n.position),ln.call(n.anchorMap,t)||z(n,'unidentified alias "'+t+'"'),n.result=n.anchorMap[t],F(n,!0,-1),!0}function mn(n,e,t,a,r){var i,o,s,h=1,d=!1,p=!1,m,u,f,x,w,I;if(n.listener!==null&&n.listener("open",n),n.tag=null,n.anchor=null,n.kind=null,n.result=null,i=o=s=An===t||Ue===t,a&&F(n,!0,-1)&&(d=!0,n.lineIndent>e?h=1:n.lineIndent===e?h=0:n.lineIndent<e&&(h=-1)),h===1)for(;ja(n)||xa(n);)F(n,!0,-1)?(d=!0,s=i,n.lineIndent>e?h=1:n.lineIndent===e?h=0:n.lineIndent<e&&(h=-1)):s=!1;if(s&&(s=d||r),(h===1||An===t)&&(Sn===t||qe===t?w=e:w=e+1,I=n.position-n.lineStart,h===1?s&&(de(n,I)||ya(n,I,w))||ma(n,w)?p=!0:(o&&fa(n,w)||pa(n,w)||ga(n,w)?p=!0:za(n)?(p=!0,(n.tag!==null||n.anchor!==null)&&z(n,"alias node should not have any properties")):ca(n,w,Sn===t)&&(p=!0,n.tag===null&&(n.tag="?")),n.anchor!==null&&(n.anchorMap[n.anchor]=n.result)):h===0&&(p=s&&de(n,I))),n.tag===null)n.anchor!==null&&(n.anchorMap[n.anchor]=n.result);else if(n.tag==="?"){for(n.result!==null&&n.kind!=="scalar"&&z(n,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+n.kind+'"'),m=0,u=n.implicitTypes.length;m<u;m+=1)if(x=n.implicitTypes[m],x.resolve(n.result)){n.result=x.construct(n.result),n.tag=x.tag,n.anchor!==null&&(n.anchorMap[n.anchor]=n.result);break}}else if(n.tag!=="!"){if(ln.call(n.typeMap[n.kind||"fallback"],n.tag))x=n.typeMap[n.kind||"fallback"][n.tag];else for(x=null,f=n.typeMap.multi[n.kind||"fallback"],m=0,u=f.length;m<u;m+=1)if(n.tag.slice(0,f[m].tag.length)===f[m].tag){x=f[m];break}x||z(n,"unknown tag !<"+n.tag+">"),n.result!==null&&x.kind!==n.kind&&z(n,"unacceptable node kind for !<"+n.tag+'> tag; it should be "'+x.kind+'", not "'+n.kind+'"'),x.resolve(n.result,n.tag)?(n.result=x.construct(n.result,n.tag),n.anchor!==null&&(n.anchorMap[n.anchor]=n.result)):z(n,"cannot resolve a node with !<"+n.tag+"> explicit tag")}return n.listener!==null&&n.listener("close",n),n.tag!==null||n.anchor!==null||p}function wa(n){var e=n.position,t,a,r,i=!1,o;for(n.version=null,n.checkLineBreaks=n.legacy,n.tagMap=Object.create(null),n.anchorMap=Object.create(null);(o=n.input.charCodeAt(n.position))!==0&&(F(n,!0,-1),o=n.input.charCodeAt(n.position),!(n.lineIndent>0||o!==37));){for(i=!0,o=n.input.charCodeAt(++n.position),t=n.position;o!==0&&!K(o);)o=n.input.charCodeAt(++n.position);for(a=n.input.slice(t,n.position),r=[],a.length<1&&z(n,"directive name must not be less than one character in length");o!==0;){for(;hn(o);)o=n.input.charCodeAt(++n.position);if(o===35){do o=n.input.charCodeAt(++n.position);while(o!==0&&!en(o));break}if(en(o))break;for(t=n.position;o!==0&&!K(o);)o=n.input.charCodeAt(++n.position);r.push(n.input.slice(t,n.position))}o!==0&&Qn(n),ln.call(le,a)?le[a](n,a,r):Tn(n,'unknown document directive "'+a+'"')}if(F(n,!0,-1),n.lineIndent===0&&n.input.charCodeAt(n.position)===45&&n.input.charCodeAt(n.position+1)===45&&n.input.charCodeAt(n.position+2)===45?(n.position+=3,F(n,!0,-1)):i&&z(n,"directives end mark is expected"),mn(n,n.lineIndent-1,An,!1,!0),F(n,!0,-1),n.checkLineBreaks&&ia.test(n.input.slice(e,n.position))&&Tn(n,"non-ASCII line breaks are interpreted as content"),n.documents.push(n.result),n.position===n.lineStart&&Mn(n)){n.input.charCodeAt(n.position)===46&&(n.position+=3,F(n,!0,-1));return}if(n.position<n.length-1)z(n,"end of the stream or a document separator is expected");else return}function Xe(n,e){n=String(n),e=e||{},n.length!==0&&(n.charCodeAt(n.length-1)!==10&&n.charCodeAt(n.length-1)!==13&&(n+=`
`),n.charCodeAt(0)===65279&&(n=n.slice(1)));var t=new ua(n,e),a=n.indexOf("\0");for(a!==-1&&(t.position=a,z(t,"null byte is not allowed in input")),t.input+="\0";t.input.charCodeAt(t.position)===32;)t.lineIndent+=1,t.position+=1;for(;t.position<t.length-1;)wa(t);return t.documents}function va(n,e,t){e!==null&&typeof e=="object"&&typeof t>"u"&&(t=e,e=null);var a=Xe(n,t);if(typeof e!="function")return a;for(var r=0,i=a.length;r<i;r+=1)e(a[r])}function ba(n,e){var t=Xe(n,e);if(t.length!==0){if(t.length===1)return t[0];throw new U("expected a single document in the stream, but found more")}}var ka=va,Ia=ba,nt={loadAll:ka,load:Ia},et=Object.prototype.toString,tt=Object.prototype.hasOwnProperty,Zn=65279,_a=9,zn=10,Sa=13,Aa=32,Ta=33,Ca=34,Yn=35,Ea=37,Ma=38,Ra=39,Wa=42,rt=44,Da=45,Cn=58,Na=61,Pa=62,Oa=63,Fa=64,at=91,it=93,La=96,ot=123,Ha=124,st=125,$={};$[0]="\\0";$[7]="\\a";$[8]="\\b";$[9]="\\t";$[10]="\\n";$[11]="\\v";$[12]="\\f";$[13]="\\r";$[27]="\\e";$[34]='\\"';$[92]="\\\\";$[133]="\\N";$[160]="\\_";$[8232]="\\L";$[8233]="\\P";var Ya=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],Ba=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function $a(n,e){var t,a,r,i,o,s,h;if(e===null)return{};for(t={},a=Object.keys(e),r=0,i=a.length;r<i;r+=1)o=a[r],s=String(e[o]),o.slice(0,2)==="!!"&&(o="tag:yaml.org,2002:"+o.slice(2)),h=n.compiledTypeMap.fallback[o],h&&tt.call(h.styleAliases,s)&&(s=h.styleAliases[s]),t[o]=s;return t}function qa(n){var e,t,a;if(e=n.toString(16).toUpperCase(),n<=255)t="x",a=2;else if(n<=65535)t="u",a=4;else if(n<=4294967295)t="U",a=8;else throw new U("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+t+H.repeat("0",a-e.length)+e}var Ua=1,wn=2;function Ga(n){this.schema=n.schema||Vn,this.indent=Math.max(1,n.indent||2),this.noArrayIndent=n.noArrayIndent||!1,this.skipInvalid=n.skipInvalid||!1,this.flowLevel=H.isNothing(n.flowLevel)?-1:n.flowLevel,this.styleMap=$a(this.schema,n.styles||null),this.sortKeys=n.sortKeys||!1,this.lineWidth=n.lineWidth||80,this.noRefs=n.noRefs||!1,this.noCompatMode=n.noCompatMode||!1,this.condenseFlow=n.condenseFlow||!1,this.quotingType=n.quotingType==='"'?wn:Ua,this.forceQuotes=n.forceQuotes||!1,this.replacer=typeof n.replacer=="function"?n.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function ue(n,e){for(var t=H.repeat(" ",e),a=0,r=-1,i="",o,s=n.length;a<s;)r=n.indexOf(`
`,a),r===-1?(o=n.slice(a),a=s):(o=n.slice(a,r+1),a=r+1),o.length&&o!==`
`&&(i+=t),i+=o;return i}function Bn(n,e){return`
`+H.repeat(" ",n.indent*e)}function Ka(n,e){var t,a,r;for(t=0,a=n.implicitTypes.length;t<a;t+=1)if(r=n.implicitTypes[t],r.resolve(e))return!0;return!1}function En(n){return n===Aa||n===_a}function vn(n){return 32<=n&&n<=126||161<=n&&n<=55295&&n!==8232&&n!==8233||57344<=n&&n<=65533&&n!==Zn||65536<=n&&n<=1114111}function ce(n){return vn(n)&&n!==Zn&&n!==Sa&&n!==zn}function pe(n,e,t){var a=ce(n),r=a&&!En(n);return(t?a:a&&n!==rt&&n!==at&&n!==it&&n!==ot&&n!==st)&&n!==Yn&&!(e===Cn&&!r)||ce(e)&&!En(e)&&n===Yn||e===Cn&&r}function Va(n){return vn(n)&&n!==Zn&&!En(n)&&n!==Da&&n!==Oa&&n!==Cn&&n!==rt&&n!==at&&n!==it&&n!==ot&&n!==st&&n!==Yn&&n!==Ma&&n!==Wa&&n!==Ta&&n!==Ha&&n!==Na&&n!==Pa&&n!==Ra&&n!==Ca&&n!==Ea&&n!==Fa&&n!==La}function Qa(n){return!En(n)&&n!==Cn}function jn(n,e){var t=n.charCodeAt(e),a;return t>=55296&&t<=56319&&e+1<n.length&&(a=n.charCodeAt(e+1),a>=56320&&a<=57343)?(t-55296)*1024+a-56320+65536:t}function lt(n){var e=/^\n* /;return e.test(n)}var ht=1,$n=2,dt=3,ut=4,cn=5;function Ja(n,e,t,a,r,i,o,s){var h,d=0,p=null,m=!1,u=!1,f=a!==-1,x=-1,w=Va(jn(n,0))&&Qa(jn(n,n.length-1));if(e||o)for(h=0;h<n.length;d>=65536?h+=2:h++){if(d=jn(n,h),!vn(d))return cn;w=w&&pe(d,p,s),p=d}else{for(h=0;h<n.length;d>=65536?h+=2:h++){if(d=jn(n,h),d===zn)m=!0,f&&(u=u||h-x-1>a&&n[x+1]!==" ",x=h);else if(!vn(d))return cn;w=w&&pe(d,p,s),p=d}u=u||f&&h-x-1>a&&n[x+1]!==" "}return!m&&!u?w&&!o&&!r(n)?ht:i===wn?cn:$n:t>9&&lt(n)?cn:o?i===wn?cn:$n:u?ut:dt}function Za(n,e,t,a,r){n.dump=(function(){if(e.length===0)return n.quotingType===wn?'""':"''";if(!n.noCompatMode&&(Ya.indexOf(e)!==-1||Ba.test(e)))return n.quotingType===wn?'"'+e+'"':"'"+e+"'";var i=n.indent*Math.max(1,t),o=n.lineWidth===-1?-1:Math.max(Math.min(n.lineWidth,40),n.lineWidth-i),s=a||n.flowLevel>-1&&t>=n.flowLevel;function h(d){return Ka(n,d)}switch(Ja(e,s,n.indent,o,h,n.quotingType,n.forceQuotes&&!a,r)){case ht:return e;case $n:return"'"+e.replace(/'/g,"''")+"'";case dt:return"|"+ge(e,n.indent)+me(ue(e,i));case ut:return">"+ge(e,n.indent)+me(ue(Xa(e,o),i));case cn:return'"'+ni(e)+'"';default:throw new U("impossible error: invalid scalar style")}})()}function ge(n,e){var t=lt(n)?String(e):"",a=n[n.length-1]===`
`,r=a&&(n[n.length-2]===`
`||n===`
`),i=r?"+":a?"":"-";return t+i+`
`}function me(n){return n[n.length-1]===`
`?n.slice(0,-1):n}function Xa(n,e){for(var t=/(\n+)([^\n]*)/g,a=(function(){var d=n.indexOf(`
`);return d=d!==-1?d:n.length,t.lastIndex=d,fe(n.slice(0,d),e)})(),r=n[0]===`
`||n[0]===" ",i,o;o=t.exec(n);){var s=o[1],h=o[2];i=h[0]===" ",a+=s+(!r&&!i&&h!==""?`
`:"")+fe(h,e),r=i}return a}function fe(n,e){if(n===""||n[0]===" ")return n;for(var t=/ [^ ]/g,a,r=0,i,o=0,s=0,h="";a=t.exec(n);)s=a.index,s-r>e&&(i=o>r?o:s,h+=`
`+n.slice(r,i),r=i+1),o=s;return h+=`
`,n.length-r>e&&o>r?h+=n.slice(r,o)+`
`+n.slice(o+1):h+=n.slice(r),h.slice(1)}function ni(n){for(var e="",t=0,a,r=0;r<n.length;t>=65536?r+=2:r++)t=jn(n,r),a=$[t],!a&&vn(t)?(e+=n[r],t>=65536&&(e+=n[r+1])):e+=a||qa(t);return e}function ei(n,e,t){var a="",r=n.tag,i,o,s;for(i=0,o=t.length;i<o;i+=1)s=t[i],n.replacer&&(s=n.replacer.call(t,String(i),s)),(rn(n,e,s,!1,!1)||typeof s>"u"&&rn(n,e,null,!1,!1))&&(a!==""&&(a+=","+(n.condenseFlow?"":" ")),a+=n.dump);n.tag=r,n.dump="["+a+"]"}function ye(n,e,t,a){var r="",i=n.tag,o,s,h;for(o=0,s=t.length;o<s;o+=1)h=t[o],n.replacer&&(h=n.replacer.call(t,String(o),h)),(rn(n,e+1,h,!0,!0,!1,!0)||typeof h>"u"&&rn(n,e+1,null,!0,!0,!1,!0))&&((!a||r!=="")&&(r+=Bn(n,e)),n.dump&&zn===n.dump.charCodeAt(0)?r+="-":r+="- ",r+=n.dump);n.tag=i,n.dump=r||"[]"}function ti(n,e,t){var a="",r=n.tag,i=Object.keys(t),o,s,h,d,p;for(o=0,s=i.length;o<s;o+=1)p="",a!==""&&(p+=", "),n.condenseFlow&&(p+='"'),h=i[o],d=t[h],n.replacer&&(d=n.replacer.call(t,h,d)),rn(n,e,h,!1,!1)&&(n.dump.length>1024&&(p+="? "),p+=n.dump+(n.condenseFlow?'"':"")+":"+(n.condenseFlow?"":" "),rn(n,e,d,!1,!1)&&(p+=n.dump,a+=p));n.tag=r,n.dump="{"+a+"}"}function ri(n,e,t,a){var r="",i=n.tag,o=Object.keys(t),s,h,d,p,m,u;if(n.sortKeys===!0)o.sort();else if(typeof n.sortKeys=="function")o.sort(n.sortKeys);else if(n.sortKeys)throw new U("sortKeys must be a boolean or a function");for(s=0,h=o.length;s<h;s+=1)u="",(!a||r!=="")&&(u+=Bn(n,e)),d=o[s],p=t[d],n.replacer&&(p=n.replacer.call(t,d,p)),rn(n,e+1,d,!0,!0,!0)&&(m=n.tag!==null&&n.tag!=="?"||n.dump&&n.dump.length>1024,m&&(n.dump&&zn===n.dump.charCodeAt(0)?u+="?":u+="? "),u+=n.dump,m&&(u+=Bn(n,e)),rn(n,e+1,p,!0,m)&&(n.dump&&zn===n.dump.charCodeAt(0)?u+=":":u+=": ",u+=n.dump,r+=u));n.tag=i,n.dump=r||"{}"}function je(n,e,t){var a,r,i,o,s,h;for(r=t?n.explicitTypes:n.implicitTypes,i=0,o=r.length;i<o;i+=1)if(s=r[i],(s.instanceOf||s.predicate)&&(!s.instanceOf||typeof e=="object"&&e instanceof s.instanceOf)&&(!s.predicate||s.predicate(e))){if(t?s.multi&&s.representName?n.tag=s.representName(e):n.tag=s.tag:n.tag="?",s.represent){if(h=n.styleMap[s.tag]||s.defaultStyle,et.call(s.represent)==="[object Function]")a=s.represent(e,h);else if(tt.call(s.represent,h))a=s.represent[h](e,h);else throw new U("!<"+s.tag+'> tag resolver accepts not "'+h+'" style');n.dump=a}return!0}return!1}function rn(n,e,t,a,r,i,o){n.tag=null,n.dump=t,je(n,t,!1)||je(n,t,!0);var s=et.call(n.dump),h=a,d;a&&(a=n.flowLevel<0||n.flowLevel>e);var p=s==="[object Object]"||s==="[object Array]",m,u;if(p&&(m=n.duplicates.indexOf(t),u=m!==-1),(n.tag!==null&&n.tag!=="?"||u||n.indent!==2&&e>0)&&(r=!1),u&&n.usedDuplicates[m])n.dump="*ref_"+m;else{if(p&&u&&!n.usedDuplicates[m]&&(n.usedDuplicates[m]=!0),s==="[object Object]")a&&Object.keys(n.dump).length!==0?(ri(n,e,n.dump,r),u&&(n.dump="&ref_"+m+n.dump)):(ti(n,e,n.dump),u&&(n.dump="&ref_"+m+" "+n.dump));else if(s==="[object Array]")a&&n.dump.length!==0?(n.noArrayIndent&&!o&&e>0?ye(n,e-1,n.dump,r):ye(n,e,n.dump,r),u&&(n.dump="&ref_"+m+n.dump)):(ei(n,e,n.dump),u&&(n.dump="&ref_"+m+" "+n.dump));else if(s==="[object String]")n.tag!=="?"&&Za(n,n.dump,e,i,h);else{if(s==="[object Undefined]")return!1;if(n.skipInvalid)return!1;throw new U("unacceptable kind of an object to dump "+s)}n.tag!==null&&n.tag!=="?"&&(d=encodeURI(n.tag[0]==="!"?n.tag.slice(1):n.tag).replace(/!/g,"%21"),n.tag[0]==="!"?d="!"+d:d.slice(0,18)==="tag:yaml.org,2002:"?d="!!"+d.slice(18):d="!<"+d+">",n.dump=d+" "+n.dump)}return!0}function ai(n,e){var t=[],a=[],r,i;for(qn(n,t,a),r=0,i=a.length;r<i;r+=1)e.duplicates.push(t[a[r]]);e.usedDuplicates=new Array(i)}function qn(n,e,t){var a,r,i;if(n!==null&&typeof n=="object")if(r=e.indexOf(n),r!==-1)t.indexOf(r)===-1&&t.push(r);else if(e.push(n),Array.isArray(n))for(r=0,i=n.length;r<i;r+=1)qn(n[r],e,t);else for(a=Object.keys(n),r=0,i=a.length;r<i;r+=1)qn(n[a[r]],e,t)}function ii(n,e){e=e||{};var t=new Ga(e);t.noRefs||ai(n,t);var a=n;return t.replacer&&(a=t.replacer.call({"":a},"",a)),rn(t,0,a,!0,!0)?t.dump+`
`:""}var oi=ii,si={dump:oi};function Xn(n,e){return function(){throw new Error("Function yaml."+n+" is removed in js-yaml 4. Use yaml."+e+" instead, which is now safe by default.")}}var li=Y,hi=_e,di=Ce,ui=De,ci=Ne,pi=Vn,gi=nt.load,mi=nt.loadAll,fi=si.dump,yi=U,ji={binary:He,float:We,map:Te,null:Ee,pairs:Be,set:$e,timestamp:Fe,bool:Me,int:Re,merge:Le,omap:Ye,seq:Ae,str:Se},xi=Xn("safeLoad","load"),zi=Xn("safeLoadAll","loadAll"),wi=Xn("safeDump","dump"),vi={Type:li,Schema:hi,FAILSAFE_SCHEMA:di,JSON_SCHEMA:ui,CORE_SCHEMA:ci,DEFAULT_SCHEMA:pi,load:gi,loadAll:mi,dump:fi,YAMLException:yi,types:ji,safeLoad:xi,safeLoadAll:zi,safeDump:wi};const bi=Object.assign({"./chapters/en/beginner/city-and-transportation.yml":Ct,"./chapters/en/beginner/clothes-and-shopping.yml":Et,"./chapters/en/beginner/family-and-friends.yml":Mt,"./chapters/en/beginner/food-and-eating.yml":Rt,"./chapters/en/beginner/health-and-body.yml":Wt,"./chapters/en/beginner/hobbies-and-free-time.yml":Dt,"./chapters/en/beginner/home-and-living.yml":Nt,"./chapters/en/beginner/morning-routine.yml":Pt,"./chapters/en/beginner/time-and-schedules.yml":Ot,"./chapters/en/beginner/weather-and-seasons.yml":Ft,"./chapters/en/intermediate/03-future-and-plans.yml":Lt,"./chapters/en/intermediate/04-experiences-and-achievements.yml":Ht,"./chapters/en/intermediate/05-travel-problems.yml":Yt,"./chapters/en/intermediate/06-opinions-and-disagreement.yml":Bt,"./chapters/en/intermediate/07-describing-personality.yml":$t,"./chapters/en/intermediate/08-entertainment-and-reviews.yml":qt,"./chapters/en/intermediate/identity-and-background.yml":Ut,"./chapters/en/intermediate/telling-stories.yml":Gt,"./chapters/ja/beginner/comprehension-check.yml":Kt,"./chapters/ja/beginner/me-and-you.yml":Vt,"./chapters/ja/beginner/me-you-and-professionals.yml":Qt,"./chapters/ja/beginner/mixed-practice-dialogue-flow.yml":Jt,"./chapters/ja/beginner/negative-not-x.yml":Zt,"./chapters/ja/beginner/shadowing-speed-rhythm.yml":Xt,"./chapters/ja/beginner/stating-facts.yml":nr,"./chapters/ja/beginner/yes-no-questions.yml":er,"./chapters/ja/intermediate/discussing-movies.yml":tr});function ki(n){try{return vi.load(n)}catch(e){return console.error("Failed to parse chapter YAML:",e),null}}function Ii(n){const e=n.match(/\.\/chapters\/([a-z]{2})\//);return e?e[1]:null}function _i(n,e,t="en"){return n?.words?n.words.map((a,r)=>{const i=a.word[e]||a.word.en,o=a.word[t]||a.word.en;return{id:`${n.meta.id}_${a.id}`,word:i,nativeWord:o,meaning:a.description[e]||a.description.en,nativeMeaning:a.description[t]||a.description.en,example:a.sentence[e]||a.sentence.en,nativeExample:a.sentence[t]||a.sentence.en,phonetic:e==="en"?a.phonetic:void 0,reading:e==="ja"?a.reading:void 0}}):[]}function Si(){const n={};for(const[e,t]of Object.entries(bi)){const a=Ii(e);if(!a)continue;const r=ki(t);r?.meta&&(r.meta.targetLanguage=a,n[a]||(n[a]=[]),n[a].push(r))}for(const e of Object.keys(n))n[e].sort((t,a)=>(t.meta.order||999)-(a.meta.order||999));return n}let Pn=null;function Ai(){return Pn||(Pn=Si()),Pn}function ct(n="ja"){return Ai()[n]||[]}function Ti(n="ja",e="en"){return ct(n).map(a=>({id:a.meta.id,title:a.meta.title[e]||a.meta.title.en,description:a.meta.description[e]||a.meta.description.en,icon:a.meta.icon,level:a.meta.level,targetLanguage:a.meta.targetLanguage,wordCount:a.words?.length||0,order:a.meta.order}))}function Ci(n="ja",e="beginner",t="en"){return Ti(n,t).filter(a=>a.level===e)}function pt(n,e="ja"){return ct(e).find(a=>a.meta.id===n)}function On(n,e="ja",t="en"){const a=pt(n,e);return a?_i(a,e,t):[]}function Ei(n,e="ja",t="en"){const a=pt(n,e);return a?.chat?.conversations?a.chat.conversations.map(r=>({id:r.id,title:r.title[e]||r.title.en,messages:r.messages.map(i=>({role:i.role,text:i.text[e]||i.text.en,nativeText:i.text[t]||i.text.en}))})):[]}const gt={en:"en-US",ja:"ja-JP",zh:"zh-CN",ko:"ko-KR",es:"es-ES",fr:"fr-FR",de:"de-DE"};function on(){return"speechSynthesis"in window}function Fn(){on()&&window.speechSynthesis.cancel()}const Mi={normal:{rate:.9,label:"Normal"},slow:{rate:.15,label:"Slow"},word:{rate:.5,label:"Word by Word"}};function sn(n,e="en",t="normal",a=null){return new Promise((r,i)=>{if(!on()){i(new Error("Speech synthesis not supported"));return}if(window.speechSynthesis.cancel(),t==="word"){Ri(n,e,a).then(r).catch(i);return}const o=new SpeechSynthesisUtterance(n);o.lang=gt[e]||e,o.rate=Mi[t]?.rate||.9,o.pitch=1,o.onend=()=>r(),o.onerror=s=>i(new Error("Speech synthesis failed")),window.speechSynthesis.speak(o)})}async function Ri(n,e,t=null){const r=["ja","zh","ko"].includes(e)?n.replace(/[。、！？，]/g," ").split("").filter(i=>i.trim()):n.split(/\s+/).filter(i=>i.trim());for(let i=0;i<r.length;i++){const o=r[i];t&&t(i,o,r),await new Promise((s,h)=>{const d=new SpeechSynthesisUtterance(o);d.lang=gt[e]||e,d.rate=.6,d.pitch=1,d.onend=()=>s(),d.onerror=()=>h(new Error("Speech synthesis failed")),window.speechSynthesis.speak(d)}),await new Promise(s=>setTimeout(s,400))}t&&t(-1,null,r)}function bn(n,e="en"){return["ja","zh","ko"].includes(e)?n.split("").filter(a=>a.trim()&&!/[。、！？，]/.test(a)):n.split(/\s+/).filter(a=>a.trim())}const Ln=typeof window<"u"?window.SpeechRecognition||window.webkitSpeechRecognition:null,Wi={en:"en-US",ja:"ja-JP",zh:"zh-TW"};function Di(n,e){const t=n.length,a=e.length,r=Array.from({length:t+1},()=>Array(a+1).fill(0));for(let i=0;i<=t;i++)r[i][0]=i;for(let i=0;i<=a;i++)r[0][i]=i;for(let i=1;i<=t;i++)for(let o=1;o<=a;o++)r[i][o]=n[i-1]===e[o-1]?r[i-1][o-1]:1+Math.min(r[i-1][o],r[i][o-1],r[i-1][o-1]);return r[t][a]}function xe(n){return n.toLowerCase().replace(/[^\w\s\u3000-\u9fff\u30a0-\u30ff\u3040-\u309f]/g,"").trim()}function Ni(){const n=_(!1),e=_(""),t=_(null),a=!!Ln;let r=null;function i(s,h){return new Promise((d,p)=>{if(!Ln){p(new Error("Speech recognition not supported"));return}r&&r.abort(),r=new Ln,r.lang=Wi[h]||"en-US",r.interimResults=!1,r.maxAlternatives=1,r.continuous=!1,n.value=!0,e.value="",t.value=null;let m=!1;r.onresult=u=>{const f=u.results[0][0].transcript;e.value=f;const x=xe(s),w=xe(f),I=Di(x,w),C=Math.max(x.length,w.length,1),v=Math.round((C-I)/C*100);t.value=Math.max(0,Math.min(100,v)),n.value=!1,m=!0,d({transcript:f,score:t.value})},r.onerror=u=>{n.value=!1,!m&&u.error!=="aborted"&&(m=!0,p(new Error(u.error)))},r.onend=()=>{n.value=!1,m||(m=!0,d({transcript:"",score:0}))},r.start()})}function o(){r&&(r.abort(),r=null),n.value=!1}return{isSupported:a,isListening:n,transcript:e,score:t,checkPronunciation:i,stopListening:o}}const Pi={class:"p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"},Oi={class:"flex items-start gap-4"},Fi=["disabled"],Li={class:"material-symbols-outlined text-xl"},Hi={class:"flex-1 min-w-0"},Yi={class:"flex items-baseline gap-2 flex-wrap"},Bi={class:"text-xl font-bold text-text-main dark:text-white"},$i={key:0,class:"text-lg text-primary font-medium"},qi={key:1,class:"text-sm text-text-muted dark:text-slate-400"},Ui={key:2,class:"text-sm text-primary"},Gi={class:"flex items-start gap-2 mt-1"},Ki=["disabled"],Vi={class:"material-symbols-outlined text-sm"},Qi={key:0,class:"text-text-muted dark:text-slate-300"},Ji={key:1,class:"text-text-muted dark:text-slate-300"},Zi={key:2,class:"text-sm text-slate-500 dark:text-slate-400"},Xi={class:"mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-l-4 border-primary"},no={class:"flex items-start gap-2"},eo=["disabled"],to={key:0,class:"text-sm text-text-main dark:text-slate-200 italic"},ro={key:1,class:"text-sm text-text-main dark:text-slate-200 italic"},ao={key:2,class:"text-xs text-slate-500 dark:text-slate-400 mt-1"},io={key:0,class:"mt-3 flex items-center gap-3"},oo={class:"material-symbols-outlined text-sm"},so={key:0,class:"flex items-center gap-1.5"},lo={class:"w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"},ho={key:1,class:"mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1"},uo={__name:"VocabularyCard",props:{word:{type:Object,required:!0},language:{type:String,default:"en"},bilingual:{type:Boolean,default:!0},voiceSpeed:{type:String,default:"normal"}},setup(n){const{t:e}=kn(),{isSupported:t,isListening:a,score:r,checkPronunciation:i,stopListening:o}=Ni(),s=n,h=_(!1),d=_(!1),p=_(!1),m=_(!1),u=_(!1);async function f(){if(a.value){o();return}u.value=!1;try{await i(s.word.word,s.language)}catch{u.value=!0}}const x=_(-1),w=_(-1),I=N(()=>bn(s.word.meaning,s.language)),C=N(()=>bn(s.word.example,s.language));async function v(){if(!h.value){if(!on()){m.value=!0;return}h.value=!0,m.value=!1;try{await sn(s.word.word,s.language,s.voiceSpeed)}catch(S){m.value=!0,console.warn("Audio playback failed:",S)}finally{h.value=!1}}}async function W(){if(!d.value&&on()){d.value=!0,x.value=-1;try{await sn(s.word.meaning,s.language,s.voiceSpeed,S=>{x.value=S})}catch(S){console.warn("Audio playback failed:",S)}finally{d.value=!1,x.value=-1}}}async function P(){if(!p.value&&on()){p.value=!0,w.value=-1;try{await sn(s.word.example,s.language,s.voiceSpeed,S=>{w.value=S})}catch(S){console.warn("Audio playback failed:",S)}finally{p.value=!1,w.value=-1}}}return(S,b)=>(y(),j("div",Pi,[l("div",Oi,[l("button",{onClick:v,disabled:h.value,class:T(["shrink-0 flex items-center justify-center size-12 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors disabled:opacity-50",{"animate-pulse":h.value}])},[l("span",Li,g(h.value?"volume_up":"play_arrow"),1)],10,Fi),l("div",Hi,[l("div",Yi,[l("h3",Bi,g(n.word.word),1),n.bilingual&&n.word.nativeWord?(y(),j("span",$i,"("+g(n.word.nativeWord)+")",1)):D("",!0),n.word.phonetic?(y(),j("span",qi,g(n.word.phonetic),1)):D("",!0),n.word.reading?(y(),j("span",Ui,g(n.word.reading),1)):D("",!0)]),l("div",Gi,[l("button",{onClick:W,disabled:d.value,class:T(["shrink-0 flex items-center justify-center size-6 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-text-muted dark:text-slate-400 transition-colors disabled:opacity-50",{"animate-pulse":d.value}])},[l("span",Vi,g((d.value,"volume_up")),1)],10,Ki),l("div",null,[n.voiceSpeed==="word"&&x.value>=0?(y(),j("p",Qi,[(y(!0),j(G,null,Z(I.value,(A,M)=>(y(),j("span",{key:M,class:T(M===x.value?"bg-primary/30 text-primary font-semibold px-0.5 rounded":"")},g(A)+g(M<I.value.length-1?" ":""),3))),128))])):(y(),j("p",Ji,g(n.word.meaning),1)),n.bilingual&&n.word.nativeMeaning?(y(),j("p",Zi,g(n.word.nativeMeaning),1)):D("",!0)])]),l("div",Xi,[l("div",no,[l("button",{onClick:P,disabled:p.value,class:T(["shrink-0 flex items-center justify-center size-6 rounded-full bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-primary transition-colors disabled:opacity-50 shadow-sm",{"animate-pulse":p.value}])},[...b[0]||(b[0]=[l("span",{class:"material-symbols-outlined text-sm"},"volume_up",-1)])],10,eo),l("div",null,[n.voiceSpeed==="word"&&w.value>=0?(y(),j("p",to,[b[1]||(b[1]=q(' "',-1)),(y(!0),j(G,null,Z(C.value,(A,M)=>(y(),j("span",{key:M,class:T(M===w.value?"bg-primary/30 text-primary font-semibold not-italic px-0.5 rounded":"")},g(A)+g(M<C.value.length-1?" ":""),3))),128)),b[2]||(b[2]=q('" ',-1))])):(y(),j("p",ro,' "'+g(n.word.example)+'" ',1)),n.bilingual&&n.word.nativeExample?(y(),j("p",ao,' "'+g(n.word.nativeExample)+'" ',1)):D("",!0)])])])])]),c(t)?(y(),j("div",io,[l("button",{onClick:f,class:T(["flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",c(a)?"bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse":"bg-slate-100 dark:bg-slate-700 text-text-muted dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"])},[l("span",oo,g(c(a)?"mic":"mic_none"),1),q(" "+g(c(a)?"Listening...":"Try saying it"),1)],2),c(r)!==null?(y(),j("div",so,[l("div",lo,[l("div",{class:T(["h-full rounded-full transition-all",c(r)>=80?"bg-green-400":c(r)>=50?"bg-amber-400":"bg-red-400"]),style:Un({width:`${c(r)}%`})},null,6)]),l("span",{class:T(["text-xs font-bold",c(r)>=80?"text-green-500":c(r)>=50?"text-amber-500":"text-red-500"])},g(c(r))+"% ",3)])):D("",!0)])):D("",!0),m.value||u.value?(y(),j("p",ho,[b[3]||(b[3]=l("span",{class:"material-symbols-outlined text-sm"},"warning",-1)),q(" "+g(c(e)("learning.audioNotAvailable")),1)])):D("",!0)]))}};function _n(n){const e=[...n];for(let t=e.length-1;t>0;t--){const a=Math.floor(Math.random()*(t+1));[e[t],e[a]]=[e[a],e[t]]}return e}function co(){const n=_([]),e=_(0),t=_(!1),a=N(()=>n.value[e.value]),r=N(()=>n.value.length===0?0:(e.value+1)/n.value.length*100),i=N(()=>n.value.length),o=N(()=>e.value===0),s=N(()=>e.value===n.value.length-1);function h(f){n.value=_n(f),e.value=0,t.value=!1}function d(){t.value=!t.value}function p(){e.value<n.value.length-1&&(e.value++,t.value=!1)}function m(){e.value>0&&(e.value--,t.value=!1)}function u(f){h(f)}return{shuffledWords:n,currentIndex:e,isFlipped:t,currentWord:a,progress:r,totalCards:i,isFirstCard:o,isLastCard:s,initCards:h,flipCard:d,nextCard:p,prevCard:m,shuffle:u}}const po={class:"flex flex-col items-center"},go={class:"w-full max-w-lg mb-6"},mo={class:"flex justify-between text-sm text-text-muted dark:text-slate-400 mb-2"},fo={class:"h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"},yo={class:"absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 border-2 border-primary/30 shadow-lg flex flex-col items-center justify-center p-8"},jo={class:"text-4xl sm:text-5xl font-bold text-text-main dark:text-white text-center mb-2"},xo={key:0,class:"text-2xl text-primary font-medium mb-2"},zo={key:1,class:"text-xl text-primary mb-2"},wo={key:2,class:"text-lg text-text-muted dark:text-slate-400"},vo=["disabled"],bo={class:"material-symbols-outlined text-primary"},ko={class:"text-sm font-medium text-text-main dark:text-white"},Io={class:"absolute bottom-4 text-sm text-text-muted dark:text-slate-400"},_o={class:"absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 shadow-lg flex flex-col items-center justify-center p-6"},So={class:"flex items-start gap-2 mb-2"},Ao=["disabled"],To={class:"material-symbols-outlined text-xl text-green-600 dark:text-green-400"},Co={class:"text-center"},Eo={key:0,class:"text-lg sm:text-xl text-text-main dark:text-white"},Mo={key:1,class:"text-lg sm:text-xl text-text-main dark:text-white"},Ro={key:2,class:"text-sm text-slate-600 dark:text-slate-400"},Wo={class:"p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 w-full mt-2"},Do={class:"flex items-start gap-2"},No=["disabled"],Po={class:"material-symbols-outlined text-xl text-green-600 dark:text-green-400"},Oo={key:0,class:"text-text-muted dark:text-slate-300 italic text-sm"},Fo={key:1,class:"text-text-muted dark:text-slate-300 italic text-sm"},Lo={key:2,class:"text-xs text-slate-500 dark:text-slate-400 italic mt-1"},Ho={class:"absolute bottom-4 text-sm text-text-muted dark:text-slate-400"},Yo={class:"flex items-center gap-4 mt-8"},Bo=["disabled"],$o=["disabled"],qo={class:"mt-4 text-xs text-text-muted dark:text-slate-400 hidden sm:block"},Uo={__name:"FlashcardMode",props:{words:{type:Array,required:!0},language:{type:String,default:"en"},bilingual:{type:Boolean,default:!0},voiceSpeed:{type:String,default:"normal"}},setup(n){const{t:e}=kn(),t=n,a=_(!1),r=_(!1),i=_(!1),o=_(-1),s=_(-1),h=N(()=>u.value?.meaning?bn(u.value.meaning,t.language):[]),d=N(()=>u.value?.example?bn(u.value.example,t.language):[]),{currentIndex:p,isFlipped:m,currentWord:u,progress:f,totalCards:x,isFirstCard:w,isLastCard:I,initCards:C,flipCard:v,nextCard:W,prevCard:P,shuffle:S}=co();function b(){v()}function A(){W()}function M(){P()}function tn(){S(t.words)}async function X(){if(!(!u.value?.word||a.value)&&on()){a.value=!0;try{await sn(u.value.word,t.language,t.voiceSpeed)}catch(E){console.warn("Audio playback failed:",E)}finally{a.value=!1}}}async function O(){if(!(!u.value?.meaning||r.value)&&on()){r.value=!0,o.value=-1;try{await sn(u.value.meaning,t.language,t.voiceSpeed,E=>{o.value=E})}catch(E){console.warn("Audio playback failed:",E)}finally{r.value=!1,o.value=-1}}}async function Q(){if(!(!u.value?.example||i.value)&&on()){i.value=!0,s.value=-1;try{await sn(u.value.example,t.language,t.voiceSpeed,E=>{s.value=E})}catch(E){console.warn("Audio playback failed:",E)}finally{i.value=!1,s.value=-1}}}return ze(()=>t.words,E=>C(E),{immediate:!0}),(E,B)=>(y(),j("div",po,[l("div",go,[l("div",mo,[l("span",null,g(c(p)+1)+" / "+g(c(x)),1),l("span",null,g(Math.round(c(f)))+"%",1)]),l("div",fo,[l("div",{class:"h-full bg-gradient-to-r from-primary to-green-400 rounded-full transition-all duration-300",style:Un({width:`${c(f)}%`})},null,4)])]),l("div",{onClick:b,class:"w-full max-w-lg aspect-[4/3] perspective-1000 cursor-pointer"},[l("div",{class:T(["relative w-full h-full transition-transform duration-500 transform-style-3d",{"rotate-y-180":c(m)}])},[l("div",yo,[l("span",jo,g(c(u)?.word),1),n.bilingual&&c(u)?.nativeWord?(y(),j("span",xo," ("+g(c(u).nativeWord)+") ",1)):D("",!0),c(u)?.reading?(y(),j("span",zo,g(c(u).reading),1)):D("",!0),c(u)?.phonetic?(y(),j("span",wo,g(c(u).phonetic),1)):D("",!0),l("button",{onClick:In(X,["stop"]),disabled:a.value,class:T(["mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow",{"animate-pulse":a.value}])},[l("span",bo,g(a.value?"volume_up":"play_arrow"),1),l("span",ko,g(c(e)("learning.listen")),1)],10,vo),l("p",Io,g(c(e)("learning.tapToFlip")),1)]),l("div",_o,[l("div",So,[l("button",{onClick:In(O,["stop"]),disabled:r.value,class:T(["flex-shrink-0 p-1.5 rounded-full hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors",{"animate-pulse text-primary":r.value}])},[l("span",To,g((r.value,"volume_up")),1)],10,Ao),l("div",Co,[n.voiceSpeed==="word"&&o.value>=0?(y(),j("p",Eo,[(y(!0),j(G,null,Z(h.value,(dn,nn)=>(y(),j("span",{key:nn,class:T(nn===o.value?"bg-primary/40 text-primary font-bold px-1 rounded":"")},g(dn)+g(nn<h.value.length-1?" ":""),3))),128))])):(y(),j("p",Mo,g(c(u)?.meaning),1)),n.bilingual&&c(u)?.nativeMeaning?(y(),j("p",Ro,g(c(u).nativeMeaning),1)):D("",!0)])]),l("div",Wo,[l("div",Do,[l("button",{onClick:In(Q,["stop"]),disabled:i.value,class:T(["flex-shrink-0 p-1.5 rounded-full hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors",{"animate-pulse text-primary":i.value}])},[l("span",Po,g((i.value,"volume_up")),1)],10,No),l("div",null,[n.voiceSpeed==="word"&&s.value>=0?(y(),j("p",Oo,[B[0]||(B[0]=q(' "',-1)),(y(!0),j(G,null,Z(d.value,(dn,nn)=>(y(),j("span",{key:nn,class:T(nn===s.value?"bg-primary/40 text-primary font-bold not-italic px-0.5 rounded":"")},g(dn)+g(nn<d.value.length-1?" ":""),3))),128)),B[1]||(B[1]=q('" ',-1))])):(y(),j("p",Fo,' "'+g(c(u)?.example)+'" ',1)),n.bilingual&&c(u)?.nativeExample?(y(),j("p",Lo,' "'+g(c(u).nativeExample)+'" ',1)):D("",!0)])])]),l("p",Ho,g(c(e)("learning.tapToFlip")),1)])],2)]),l("div",Yo,[l("button",{onClick:M,disabled:c(w),class:"flex items-center justify-center size-12 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"},[...B[2]||(B[2]=[l("span",{class:"material-symbols-outlined text-text-main dark:text-white"},"chevron_left",-1)])],8,Bo),l("button",{onClick:tn,class:"flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"},[B[3]||(B[3]=l("span",{class:"material-symbols-outlined"},"replay",-1)),q(" "+g(c(e)("learning.shuffle")),1)]),l("button",{onClick:A,disabled:c(I),class:"flex items-center justify-center size-12 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"},[...B[4]||(B[4]=[l("span",{class:"material-symbols-outlined text-text-main dark:text-white"},"chevron_right",-1)])],8,$o)]),l("p",qo,g(c(e)("learning.keyboardHints")),1)]))}},Go=yt(Uo,[["__scopeId","data-v-750517c5"]]);function Ko(n){const e=_([]),t=_(0),a=_(null),r=_(!1),i=_(0),o=_(!1),s=_([]),h=N(()=>e.value[t.value]),d=N(()=>e.value.length===0?0:t.value/e.value.length*100),p=N(()=>e.value.length===0?0:Math.round(i.value/e.value.length*100)),m=N(()=>e.value.length),u=N(()=>e.value.length===0?0:Math.round(i.value/e.value.length*20));function f(W,P){const S=[W],b=P.filter(M=>M.id!==W.id),A=_n(b);for(let M=0;M<Math.min(3,A.length);M++)S.push(A[M]);return _n(S)}function x(W){const P=_n(W);e.value=P.map(S=>({...S,options:f(S,W)})),t.value=0,a.value=null,r.value=!1,i.value=0,o.value=!1,s.value=[]}function w(W){if(r.value)return null;a.value=W,r.value=!0;const P=W.id===h.value.id;return s.value.push({word:h.value,selected:W,isCorrect:P}),P&&i.value++,P}function I(){return t.value<e.value.length-1?(t.value++,a.value=null,r.value=!1,{completed:!1}):(o.value=!0,{completed:!0,score:i.value,total:e.value.length,accuracy:p.value,xpEarned:u.value})}function C(W){x(W)}function v(W){return h.value?W.id===h.value.id:!1}return{quizWords:e,currentIndex:t,selectedAnswer:a,isAnswered:r,score:i,isCompleted:o,answers:s,currentQuestion:h,progress:d,accuracy:p,totalQuestions:m,xpEarned:u,initQuiz:x,selectAnswer:w,nextQuestion:I,restartQuiz:C,isCorrectOption:v}}const Vo={class:"flex flex-col items-center"},Qo={class:"w-full max-w-lg mb-6"},Jo={class:"flex justify-between text-sm text-text-muted dark:text-slate-400 mb-2"},Zo={class:"flex items-center gap-1"},Xo={class:"h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"},ns={class:"w-full max-w-lg p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 mb-6"},es={class:"text-sm text-text-muted dark:text-slate-400 mb-2"},ts={class:"text-3xl sm:text-4xl font-bold text-text-main dark:text-white text-center"},rs={key:0,class:"text-xl text-primary text-center mt-2"},as={key:1,class:"text-lg text-text-muted dark:text-slate-400 text-center mt-1"},is={class:"w-full max-w-lg space-y-3"},os=["onClick","disabled"],ss={class:"flex items-center gap-3"},ls={class:"flex items-center justify-center size-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold text-text-muted"},hs={class:"text-text-main dark:text-white"},ds={key:0,class:"ml-auto material-symbols-outlined text-green-500"},us={key:1,class:"ml-auto material-symbols-outlined text-red-500"},cs={key:0,class:"w-full max-w-lg mt-6"},ps={class:"flex items-center gap-2 mb-2"},gs={class:"text-sm text-text-muted dark:text-slate-400"},ms={key:1,class:"w-full max-w-lg text-center"},fs={class:"p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 mb-6"},ys={class:"text-6xl mb-4"},js={class:"text-2xl font-bold text-text-main dark:text-white mb-2"},xs={class:"text-text-muted dark:text-slate-400 mb-4"},zs={class:"flex items-center justify-center gap-4"},ws={class:"text-center"},vs={class:"text-4xl font-bold text-primary"},bs={class:"text-2xl text-text-muted dark:text-slate-400"},ks={class:"text-center"},Is={class:"mt-4 text-sm text-amber-600 dark:text-amber-400"},_s={class:"mb-6"},Ss={class:"text-lg font-semibold text-text-main dark:text-white mb-3 text-left"},As={class:"space-y-2"},Ts={class:"font-medium text-text-main dark:text-white"},Cs={class:"text-sm text-text-muted dark:text-slate-400 truncate flex-1"},Es={class:"flex items-center justify-center gap-2"},Ms={__name:"QuizMode",props:{words:{type:Array,required:!0},language:{type:String,default:"en"},chapterId:{type:String,default:null}},emits:["complete"],setup(n,{emit:e}){const{t}=kn(),{markQuizCompleted:a}=Gn(),{recordQuizResults:r}=be(),i=n,o=e,{currentIndex:s,selectedAnswer:h,isAnswered:d,score:p,isCompleted:m,answers:u,currentQuestion:f,progress:x,accuracy:w,totalQuestions:I,xpEarned:C,initQuiz:v,selectAnswer:W,nextQuestion:P,restartQuiz:S,isCorrectOption:b}=Ko();function A(O){W(O)}function M(){const O=P();O.completed&&(i.chapterId&&a(i.chapterId,O.score,O.total),r(u.value),o("complete",{score:O.score,total:O.total,accuracy:O.accuracy,xpEarned:O.xpEarned}))}function tn(){S(i.words)}function X(O){return d.value?b(O)?"border-green-500 bg-green-50 dark:bg-green-900/30":h.value?.id===O.id&&!b(O)?"border-red-500 bg-red-50 dark:bg-red-900/30":"border-slate-200 dark:border-slate-700 opacity-50":"border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary"}return ze(()=>i.words,O=>v(O),{immediate:!0}),(O,Q)=>(y(),j("div",Vo,[c(m)?(y(),j("div",ms,[l("div",fs,[l("div",ys,g(c(w)>=80?"🎉":c(w)>=60?"👍":"💪"),1),l("h2",js,g(c(t)("learning.quizComplete")),1),l("p",xs,g(c(t)("learning.yourScore")),1),l("div",zs,[l("div",ws,[l("span",vs,g(c(p)),1),l("span",bs," / "+g(c(I)),1)]),Q[1]||(Q[1]=l("div",{class:"h-12 w-px bg-slate-300 dark:bg-slate-600"},null,-1)),l("div",ks,[l("span",{class:T(["text-4xl font-bold",c(w)>=80?"text-green-500":c(w)>=60?"text-amber-500":"text-red-500"])},g(c(w))+"%",3)])]),l("p",Is," +"+g(c(C))+" XP "+g(c(t)("learning.earned")),1)]),l("div",_s,[l("h3",Ss,g(c(t)("learning.reviewAnswers")),1),l("div",As,[(y(!0),j(G,null,Z(c(u),(E,B)=>(y(),j("div",{key:B,class:"flex items-center gap-3 p-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700"},[l("span",{class:T(["material-symbols-outlined",E.isCorrect?"text-green-500":"text-red-500"])},g(E.isCorrect?"check_circle":"cancel"),3),l("span",Ts,g(E.word.word),1),Q[2]||(Q[2]=l("span",{class:"text-text-muted dark:text-slate-400"},"-",-1)),l("span",Cs,g(E.word.meaning),1)]))),128))])]),l("button",{onClick:tn,class:"w-full py-4 rounded-xl bg-primary text-[#0d171b] font-bold text-lg hover:bg-primary/90 transition-colors"},[l("span",Es,[Q[3]||(Q[3]=l("span",{class:"material-symbols-outlined"},"replay",-1)),q(" "+g(c(t)("learning.tryAgain")),1)])])])):(y(),j(G,{key:0},[l("div",Qo,[l("div",Jo,[l("span",null,g(c(t)("learning.question"))+" "+g(c(s)+1)+" / "+g(c(I)),1),l("span",Zo,[Q[0]||(Q[0]=l("span",{class:"material-symbols-outlined text-sm text-green-500"},"check_circle",-1)),q(" "+g(c(p)),1)])]),l("div",Xo,[l("div",{class:"h-full bg-gradient-to-r from-primary to-green-400 rounded-full transition-all duration-300",style:Un({width:`${c(x)}%`})},null,4)])]),l("div",ns,[l("p",es,g(c(t)("learning.whatMeans")),1),l("h2",ts,g(c(f)?.word),1),c(f)?.reading?(y(),j("p",rs,g(c(f).reading),1)):D("",!0),c(f)?.phonetic?(y(),j("p",as,g(c(f).phonetic),1)):D("",!0)]),l("div",is,[(y(!0),j(G,null,Z(c(f)?.options,(E,B)=>(y(),j("button",{key:E.id,onClick:dn=>A(E),disabled:c(d),class:T(["w-full p-4 rounded-xl border-2 text-left transition-all",X(E)])},[l("div",ss,[l("span",ls,g(String.fromCharCode(65+B)),1),l("span",hs,g(E.meaning),1),c(d)&&c(b)(E)?(y(),j("span",ds,"check_circle")):D("",!0),c(d)&&c(h)?.id===E.id&&!c(b)(E)?(y(),j("span",us,"cancel")):D("",!0)])],10,os))),128))]),c(d)?(y(),j("div",cs,[l("div",{class:T(["p-4 rounded-xl mb-4",c(h)?.id===c(f)?.id?"bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700":"bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"])},[l("div",ps,[l("span",{class:T(["material-symbols-outlined",c(h)?.id===c(f)?.id?"text-green-600":"text-red-600"])},g(c(h)?.id===c(f)?.id?"celebration":"sentiment_dissatisfied"),3),l("span",{class:T(["font-semibold",c(h)?.id===c(f)?.id?"text-green-700 dark:text-green-300":"text-red-700 dark:text-red-300"])},g(c(h)?.id===c(f)?.id?c(t)("learning.correct"):c(t)("learning.incorrect")),3)]),l("p",gs,g(c(f)?.example),1)],2),l("button",{onClick:M,class:"w-full py-4 rounded-xl bg-primary text-[#0d171b] font-bold text-lg hover:bg-primary/90 transition-colors"},g(c(s)<c(I)-1?c(t)("learning.nextQuestion"):c(t)("learning.finishQuiz")),1)])):D("",!0)],64))]))}},Rs={class:"flex flex-col h-[600px] max-h-[80vh] bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700"},Ws={class:"flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 border-b border-slate-200 dark:border-slate-700"},Ds={class:"flex items-center gap-3"},Ns={class:"font-semibold text-text-main dark:text-white text-sm"},Ps={class:"text-xs text-text-muted dark:text-slate-400"},Os={class:"material-symbols-outlined text-lg"},Fs={class:"text-sm"},Ls={key:0,class:"flex-1 overflow-y-auto p-4"},Hs={key:0,class:"flex flex-col items-center justify-center h-full text-center"},Ys={class:"text-text-muted dark:text-slate-400"},Bs={key:1,class:"space-y-3"},$s=["onClick"],qs={class:"flex items-center justify-between"},Us={class:"flex items-center gap-3"},Gs={class:"font-medium text-text-main dark:text-white group-hover:text-primary transition-colors"},Ks={class:"text-xs text-text-muted dark:text-slate-400"},Vs={key:1,class:"flex-1 overflow-y-auto p-4 space-y-4"},Qs=["onClick","title"],Js={class:"material-symbols-outlined text-xl"},Zs={key:0,class:"text-text-main dark:text-white text-base leading-relaxed"},Xs={key:1,class:"text-text-main dark:text-white text-base leading-relaxed"},nl={key:2,class:"mt-2 text-sm text-text-muted dark:text-slate-400 italic border-t border-slate-200 dark:border-slate-600 pt-2"},el={class:"mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800"},tl={class:"flex items-start gap-3"},rl={class:"font-medium text-amber-800 dark:text-amber-200 text-sm mb-1"},al={class:"text-xs text-amber-700 dark:text-amber-300"},il={__name:"ConversationPractice",props:{conversations:{type:Array,required:!0},language:{type:String,default:"en"},bilingual:{type:Boolean,default:!0},voiceSpeed:{type:String,default:"normal"},chapterId:{type:String,default:null}},emits:["back"],setup(n,{emit:e}){const{t}=kn(),{markConversationCompleted:a}=Gn(),r=n,i=e,o=_(null),s=_(null),h=_(!1),d=_(!1),p=_(-1),m=_(-1),u=N(()=>o.value?r.conversations.find(S=>S.id===o.value):null);function f(S){o.value=S.id}function x(){I(),Fn(),s.value=null,o.value=null}async function w(){if(!u.value?.messages)return;if(h.value){I();return}h.value=!0,d.value=!1;const S=u.value.messages;for(let b=0;b<S.length&&!d.value;b++){s.value=b,m.value=b,p.value=-1;try{await sn(S[b].text,r.language,r.voiceSpeed,A=>{p.value=A})}catch(A){console.error("TTS error:",A)}!d.value&&b<S.length-1&&await new Promise(A=>setTimeout(A,500))}!d.value&&r.chapterId&&a(r.chapterId),s.value=null,m.value=-1,p.value=-1,h.value=!1,d.value=!1}function I(){d.value=!0,h.value=!1,Fn(),s.value=null,m.value=-1,p.value=-1}async function C(S,b){if(h.value&&I(),Fn(),s.value===b){s.value=null,m.value=-1,p.value=-1;return}s.value=b,m.value=b,p.value=-1;try{await sn(S.text,r.language,r.voiceSpeed,A=>{p.value=A})}catch(A){console.error("TTS error:",A)}finally{s.value=null,m.value=-1,p.value=-1}}function v(S){return bn(S,r.language)}function W(S){return t(S==="partner"?"learning.conversation.partner":"learning.conversation.you")}function P(S){return S==="partner"?"bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light":"bg-accent/10 dark:bg-accent/20 text-accent dark:text-accent-light"}return(S,b)=>(y(),j("div",Rs,[l("div",Ws,[l("div",Ds,[l("button",{onClick:b[0]||(b[0]=A=>u.value?x():i("back")),class:"p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"},[...b[1]||(b[1]=[l("span",{class:"material-symbols-outlined text-text-muted dark:text-slate-400"},"arrow_back",-1)])]),l("div",null,[l("h3",Ns,g(u.value?u.value.title:c(t)("learning.conversation.title")),1),l("p",Ps,g(u.value?c(t)("learning.conversation.practiceDialogue"):c(t)("learning.conversation.selectDialogue")),1)])]),u.value?(y(),j("button",{key:0,onClick:w,class:T(["flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",h.value?"bg-red-500 text-white hover:bg-red-600":"bg-primary text-white hover:bg-primary/90"])},[l("span",Os,g(h.value?"stop":"play_arrow"),1),l("span",Fs,g(h.value?c(t)("learning.conversation.stop"):c(t)("learning.conversation.playAll")),1)],2)):D("",!0)]),u.value?(y(),j("div",Vs,[(y(!0),j(G,null,Z(u.value.messages,(A,M)=>(y(),j("div",{key:M,class:T(["flex gap-3",A.role==="user"?"flex-row-reverse":""])},[l("button",{onClick:tn=>C(A,M),class:T(["flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all",[s.value===M?"bg-primary text-white animate-pulse":"bg-slate-100 dark:bg-slate-700 text-text-muted dark:text-slate-400 hover:bg-primary/20 hover:text-primary"]]),title:c(t)("learning.conversation.playAudio")},[l("span",Js,g(s.value===M?"stop":"volume_up"),1)],10,Qs),l("div",{class:T(["flex-1 max-w-[80%] rounded-2xl p-4",A.role==="partner"?"bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700":"bg-primary/10 dark:bg-primary/20"])},[l("span",{class:T(["inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2",P(A.role)])},g(W(A.role)),3),n.voiceSpeed==="word"&&m.value===M&&p.value>=0?(y(),j("p",Zs,[(y(!0),j(G,null,Z(v(A.text),(tn,X)=>(y(),j("span",{key:X,class:T(X===p.value?"bg-primary/40 text-primary font-bold px-0.5 rounded":"")},g(tn)+g(X<v(A.text).length-1?" ":""),3))),128))])):(y(),j("p",Xs,g(A.text),1)),n.bilingual&&A.nativeText&&A.nativeText!==A.text?(y(),j("p",nl,g(A.nativeText),1)):D("",!0)],2)],2))),128)),l("div",el,[l("div",tl,[b[5]||(b[5]=l("span",{class:"text-xl"},"💡",-1)),l("div",null,[l("h4",rl,g(c(t)("learning.conversation.practiceTip")),1),l("p",al,g(c(t)("learning.conversation.practiceTipText")),1)])])])])):(y(),j("div",Ls,[n.conversations.length===0?(y(),j("div",Hs,[b[2]||(b[2]=l("span",{class:"text-4xl mb-3"},"💬",-1)),l("p",Ys,g(c(t)("learning.conversation.noConversations")),1)])):(y(),j("div",Bs,[(y(!0),j(G,null,Z(n.conversations,A=>(y(),j("button",{key:A.id,onClick:M=>f(A),class:"w-full p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-colors text-left group"},[l("div",qs,[l("div",Us,[b[3]||(b[3]=l("span",{class:"text-2xl"},"💬",-1)),l("div",null,[l("h4",Gs,g(A.title),1),l("p",Ks,g(A.messages.length)+" "+g(c(t)("learning.conversation.messages")),1)])]),b[4]||(b[4]=l("span",{class:"material-symbols-outlined text-text-muted dark:text-slate-400 group-hover:text-primary transition-colors"}," chevron_right ",-1))])],8,$s))),128))]))]))]))}},ol={class:"min-h-screen bg-background-light dark:bg-background-dark"},sl={class:"sticky top-0 z-10 bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-700"},ll={class:"max-w-4xl mx-auto px-4 py-3 flex items-center justify-between"},hl={class:"text-sm font-medium"},dl={class:"flex items-center gap-4"},ul={class:"relative"},cl={value:"normal"},pl={value:"slow"},gl={value:"word"},ml={class:"hidden sm:inline"},fl={class:"flex items-center gap-2"},yl={class:"text-2xl"},jl={class:"font-semibold text-text-main dark:text-white"},xl={class:"max-w-4xl mx-auto px-4 py-6"},zl={class:"text-2xl font-bold text-text-main dark:text-white mb-2"},wl={class:"text-text-muted dark:text-slate-400 mb-6"},vl={class:"flex-1 min-w-0"},bl={class:"font-semibold text-text-main dark:text-white text-lg"},kl={class:"text-sm text-text-muted dark:text-slate-400"},Il={class:"flex-shrink-0 px-3 py-1 bg-amber-200 dark:bg-amber-800 rounded-full"},_l={class:"text-sm font-bold text-amber-800 dark:text-amber-200"},Sl={class:"space-y-4"},Al=["onClick"],Tl={key:0,class:"material-symbols-outlined text-2xl text-green-600 dark:text-green-400"},Cl={key:1,class:"text-lg font-bold text-primary"},El={class:"text-4xl"},Ml={class:"flex-1 min-w-0"},Rl={class:"font-semibold text-text-main dark:text-white text-lg"},Wl={class:"text-sm text-text-muted dark:text-slate-400 truncate"},Dl={class:"flex items-center gap-3 mt-1"},Nl={class:"material-symbols-outlined text-sm"},Pl={class:"material-symbols-outlined text-sm"},Ol={key:0,class:"flex-shrink-0 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full"},Fl={class:"text-xs font-bold text-amber-700 dark:text-amber-300"},Ll={class:"flex-shrink-0 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full"},Hl={class:"text-sm font-medium text-text-muted dark:text-slate-400"},Yl={key:1,class:"text-center py-12"},Bl={class:"text-lg font-semibold text-text-main dark:text-white mb-2"},$l={class:"text-text-muted dark:text-slate-400"},ql={class:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"},Ul={class:"flex items-center gap-3"},Gl={class:"text-4xl"},Kl={class:"text-2xl font-bold text-text-main dark:text-white"},Vl={class:"text-sm text-text-muted dark:text-slate-400"},Ql={class:"flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1"},Jl={key:0,class:"space-y-3"},Zl={class:"bg-surface-light dark:bg-surface-dark rounded-2xl p-6 max-w-md w-full shadow-xl"},Xl={class:"text-center"},nh={class:"text-xl font-bold text-text-main dark:text-white mb-2"},eh={class:"text-text-muted dark:text-slate-400 mb-6"},th={class:"flex gap-3"},sh={__name:"LearningScreen",setup(n){const{t:e,locale:t}=kn(),a=jt();bt();const{addXP:r}=kt(),{getChapterCompletionStatus:i}=Gn(),{getDueWords:o,getDueCount:s}=be(),{learningLevel:h,selectedTargetLanguage:d,selectedMotherTongue:p,uiLanguage:m}=It();h.value||a.replace("/");const u={get level(){return h.value||{id:"intermediate"}},get targetLanguage(){return d.value||"en"},get motherTongue(){return p.value||"en"},get uiLanguage(){return m.value||"en"}},f=_(null),x=_("list"),w=_([]),I=_([]),C=_(!1),v=_(!0),W=_("normal"),P=_(!1),S=_([]),b=N(()=>Ci(u.targetLanguage,u.level.id,u.uiLanguage)),A=N(()=>{const L=[];for(const k of b.value)L.push(...On(k.id,u.targetLanguage,u.motherTongue));return L}),M=N(()=>o(A.value)),tn=N(()=>{const L={};for(const k of b.value){const R=On(k.id,u.targetLanguage,u.motherTongue);L[k.id]=s(R)}return L});function X(L){f.value=L,P.value=!1,w.value=On(L.id,u.targetLanguage,u.motherTongue),I.value=Ei(L.id,u.targetLanguage,u.motherTongue),x.value="list"}function O(){S.value=M.value,S.value.length!==0&&(P.value=!0,f.value={id:null,title:e("srs.dailyReview"),icon:"🔄"},w.value=S.value,I.value=[],x.value="quiz")}function Q(){f.value=null,P.value=!1,x.value="list"}function E(L){x.value=L}function B(L){L.xpEarned>0&&r(L.xpEarned,"quiz"),!P.value&&(C.value=!0)}function dn(){C.value=!1,x.value="conversation"}function nn(){C.value=!1}function mt(){x.value="list"}return xt(()=>{b.value.length===1&&X(b.value[0])}),(L,k)=>(y(),j("div",ol,[l("header",sl,[l("div",ll,[l("button",{onClick:k[0]||(k[0]=R=>f.value?Q():c(a).push("/")),class:"flex items-center gap-2 text-text-muted hover:text-text-main dark:text-slate-400 dark:hover:text-white transition-colors"},[k[7]||(k[7]=l("span",{class:"material-symbols-outlined"},"arrow_back",-1)),l("span",hl,g(f.value?c(e)("learning.backToChapters"):c(e)("learning.backToSetup")),1)]),l("div",dl,[l("div",ul,[zt(l("select",{"onUpdate:modelValue":k[1]||(k[1]=R=>W.value=R),class:"appearance-none pl-8 pr-8 py-1.5 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-text-main dark:text-slate-300 border-none cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none"},[l("option",cl,g(c(e)("learning.voiceSpeed.normal")),1),l("option",pl,g(c(e)("learning.voiceSpeed.slow")),1),l("option",gl,g(c(e)("learning.voiceSpeed.word")),1)],512),[[wt,W.value]]),k[8]||(k[8]=l("span",{class:"material-symbols-outlined text-lg absolute left-2 top-1/2 -translate-y-1/2 text-text-muted dark:text-slate-400 pointer-events-none"},"volume_up",-1)),k[9]||(k[9]=l("span",{class:"material-symbols-outlined text-sm absolute right-2 top-1/2 -translate-y-1/2 text-text-muted dark:text-slate-400 pointer-events-none"},"expand_more",-1))]),l("button",{onClick:k[2]||(k[2]=R=>v.value=!v.value),class:T(["flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",v.value?"bg-primary/10 text-primary":"bg-slate-100 dark:bg-slate-800 text-text-muted dark:text-slate-400"])},[k[10]||(k[10]=l("span",{class:"material-symbols-outlined text-lg"},"translate",-1)),l("span",ml,g(c(e)("learning.bilingual")),1)],2),l("div",fl,[l("span",yl,g(u.level.icon),1),l("span",jl,g(c(e)(`levels.${u.level.id}.name`)),1)])])])]),l("main",xl,[f.value?(y(),j(G,{key:1},[l("div",ql,[l("div",Ul,[l("span",Gl,g(f.value.icon),1),l("div",null,[l("h1",Kl,g(f.value.title),1),l("p",Vl,g(w.value.length)+" "+g(c(e)("learning.words")),1)])]),l("div",Ql,[l("button",{onClick:k[3]||(k[3]=R=>E("list")),class:T(["flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",x.value==="list"?"bg-white dark:bg-slate-700 text-primary shadow-sm":"text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white"])},[k[15]||(k[15]=l("span",{class:"material-symbols-outlined text-lg"},"list",-1)),q(" "+g(c(e)("learning.modes.list")),1)],2),l("button",{onClick:k[4]||(k[4]=R=>E("flashcard")),class:T(["flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",x.value==="flashcard"?"bg-white dark:bg-slate-700 text-primary shadow-sm":"text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white"])},[k[16]||(k[16]=l("span",{class:"material-symbols-outlined text-lg"},"style",-1)),q(" "+g(c(e)("learning.modes.flashcard")),1)],2),l("button",{onClick:k[5]||(k[5]=R=>E("quiz")),class:T(["flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",x.value==="quiz"?"bg-white dark:bg-slate-700 text-primary shadow-sm":"text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white"])},[k[17]||(k[17]=l("span",{class:"material-symbols-outlined text-lg"},"quiz",-1)),q(" "+g(c(e)("learning.modes.quiz")),1)],2),P.value?D("",!0):(y(),j("button",{key:0,onClick:k[6]||(k[6]=R=>E("conversation")),class:T(["flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",x.value==="conversation"?"bg-white dark:bg-slate-700 text-primary shadow-sm":"text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white"])},[k[18]||(k[18]=l("span",{class:"material-symbols-outlined text-lg"},"chat",-1)),q(" "+g(c(e)("learning.modes.conversation")),1)],2))])]),x.value==="list"?(y(),j("div",Jl,[(y(!0),j(G,null,Z(w.value,R=>(y(),fn(uo,{key:R.id,word:R,language:L.targetLanguage,bilingual:v.value,"voice-speed":W.value},null,8,["word","language","bilingual","voice-speed"]))),128))])):x.value==="flashcard"?(y(),fn(Go,{key:1,words:w.value,language:L.targetLanguage,bilingual:v.value,"voice-speed":W.value},null,8,["words","language","bilingual","voice-speed"])):x.value==="quiz"?(y(),fn(Ms,{key:2,words:w.value,language:L.targetLanguage,"chapter-id":f.value.id,onComplete:B},null,8,["words","language","chapter-id"])):x.value==="conversation"?(y(),fn(il,{key:3,conversations:I.value,language:L.targetLanguage,bilingual:v.value,"voice-speed":W.value,"chapter-id":f.value.id,onBack:mt},null,8,["conversations","language","bilingual","voice-speed","chapter-id"])):D("",!0)],64)):(y(),j(G,{key:0},[l("h1",zl,g(c(e)("learning.chooseChapter")),1),l("p",wl,g(c(e)("learning.chapterDescription")),1),M.value.length>0?(y(),j("div",{key:0,onClick:O,class:"flex items-center gap-4 p-4 mb-6 rounded-2xl border-2 border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 cursor-pointer transition-all hover:scale-[1.01]"},[k[11]||(k[11]=l("div",{class:"flex-shrink-0 w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"},[l("span",{class:"text-2xl"},"🔄")],-1)),l("div",vl,[l("h3",bl,g(c(e)("srs.dailyReview")),1),l("p",kl,g(c(e)("srs.dailyReviewDescription")),1)]),l("div",Il,[l("span",_l,g(c(e)("srs.wordsToReview",{count:M.value.length})),1)]),k[12]||(k[12]=l("span",{class:"material-symbols-outlined text-amber-600 dark:text-amber-400"},"chevron_right",-1))])):D("",!0),l("div",Sl,[(y(!0),j(G,null,Z(b.value,(R,ft)=>(y(),j("div",{key:R.id,onClick:rh=>X(R),class:T(["flex items-center gap-4 p-4 rounded-2xl border-2 bg-surface-light dark:bg-surface-dark hover:border-primary dark:hover:border-primary cursor-pointer transition-all hover:scale-[1.01]",c(i)(R.id).complete?"border-green-400 dark:border-green-600":"border-slate-200 dark:border-slate-700"])},[l("div",{class:T(["flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",c(i)(R.id).complete?"bg-green-100 dark:bg-green-900/30":"bg-primary/10 dark:bg-primary/20"])},[c(i)(R.id).complete?(y(),j("span",Tl,"check_circle")):(y(),j("span",Cl,g(ft+1),1))],2),l("span",El,g(R.icon),1),l("div",Ml,[l("h3",Rl,g(R.title),1),l("p",Wl,g(R.description),1),l("div",Dl,[l("span",{class:T(["flex items-center gap-1 text-xs",c(i)(R.id).quiz?"text-green-600 dark:text-green-400":"text-text-muted dark:text-slate-500"])},[l("span",Nl,g(c(i)(R.id).quiz?"check_circle":"radio_button_unchecked"),1),q(" "+g(c(e)("learning.progress.quiz")),1)],2),l("span",{class:T(["flex items-center gap-1 text-xs",c(i)(R.id).conversation?"text-green-600 dark:text-green-400":"text-text-muted dark:text-slate-500"])},[l("span",Pl,g(c(i)(R.id).conversation?"check_circle":"radio_button_unchecked"),1),q(" "+g(c(e)("learning.progress.conversation")),1)],2)])]),tn.value[R.id]>0?(y(),j("div",Ol,[l("span",Fl,g(tn.value[R.id])+" "+g(c(e)("srs.dueToday")),1)])):D("",!0),l("div",Ll,[l("span",Hl,g(R.wordCount)+" "+g(c(e)("learning.words")),1)]),k[13]||(k[13]=l("span",{class:"material-symbols-outlined text-text-muted dark:text-slate-400"},"chevron_right",-1))],10,Al))),128))]),b.value.length===0?(y(),j("div",Yl,[k[14]||(k[14]=l("span",{class:"text-6xl block mb-4"},"📚",-1)),l("h3",Bl,g(c(e)("learning.noChapters")),1),l("p",$l,g(c(e)("learning.noChaptersDescription")),1)])):D("",!0)],64))]),(y(),fn(vt,{to:"body"},[C.value?(y(),j("div",{key:0,class:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",onClick:In(nn,["self"])},[l("div",Zl,[l("div",Xl,[k[19]||(k[19]=l("span",{class:"text-5xl block mb-4"},"💬",-1)),l("h3",nh,g(c(e)("learning.conversation.prompt.title")),1),l("p",eh,g(c(e)("learning.conversation.prompt.description")),1),l("div",th,[l("button",{onClick:nn,class:"flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-text-main dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"},g(c(e)("learning.conversation.prompt.skip")),1),l("button",{onClick:dn,class:"flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"},g(c(e)("learning.conversation.prompt.start")),1)])])])])):D("",!0)]))]))}};export{sh as default};
