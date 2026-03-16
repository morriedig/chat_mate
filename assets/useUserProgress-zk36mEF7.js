import{C as tt,k as E,c as R,p as it}from"./index-DxPOscS7.js";const M=E(!1);function kr(){function n(){M.value?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark");const i=document.querySelector('meta[name="theme-color"]');i&&i.setAttribute("content",M.value?"#101c22":"#2badee")}function e(){M.value=!M.value,localStorage.setItem("chatmate_darkMode",M.value?"dark":"light"),n()}function t(){const i=localStorage.getItem("chatmate_darkMode");i?M.value=i==="dark":M.value=window.matchMedia("(prefers-color-scheme: dark)").matches,n()}return tt(()=>{t()}),{isDark:M,toggle:e,init:t}}const K=[{level:1,title:"Novice",minXP:0,icon:"🌱"},{level:2,title:"Beginner",minXP:100,icon:"🌿"},{level:3,title:"Learner",minXP:300,icon:"🌳"},{level:4,title:"Speaker",minXP:600,icon:"💬"},{level:5,title:"Conversationalist",minXP:1e3,icon:"🗣️"},{level:6,title:"Fluent",minXP:1500,icon:"📚"},{level:7,title:"Advanced",minXP:2200,icon:"🎓"},{level:8,title:"Expert",minXP:3e3,icon:"⭐"},{level:9,title:"Master",minXP:4e3,icon:"🏆"},{level:10,title:"Legend",minXP:5500,icon:"👑"}],Z={userMessage:5,systemMessage:2,dailyStreak:10,firstMessageOfDay:5},wn=E(null),xn=E(!1),vn=E(null);let cn=null;function at(n,e){const t=R(()=>{const d=n.value.totalXP;let l=K[0];for(const c of K)if(d>=c.minXP)l=c;else break;return l}),i=R(()=>{const d=t.value.level;return K.find(l=>l.level===d+1)||null}),a=R(()=>i.value?i.value.minXP-n.value.totalXP:0),o=R(()=>{if(!i.value)return 100;const d=t.value,l=i.value,c=n.value.totalXP-d.minXP,p=l.minXP-d.minXP;return Math.min(100,Math.round(c/p*100))});function r(d,l="action"){const c=t.value.level;return n.value.totalXP+=d,wn.value={amount:d,reason:l},t.value.level>c&&(vn.value=t.value,xn.value=!0),e(),cn&&clearTimeout(cn),cn=setTimeout(()=>{wn.value=null},2e3),d}function s(){xn.value=!1,vn.value=null}function h(){return K}return{currentRank:t,nextRank:i,xpToNextRank:a,progressToNextRank:o,addXP:r,dismissLevelUp:s,getAllRanks:h}}const he=[{days:3,bonus:15,icon:"🔥"},{days:7,bonus:35,icon:"⚡"},{days:14,bonus:70,icon:"💪"},{days:30,bonus:150,icon:"🌟"},{days:60,bonus:300,icon:"💎"},{days:100,bonus:500,icon:"🏆"},{days:365,bonus:1825,icon:"👑"}],kn=E(!1),bn=E(null);function rt(n,e,t,i){function a(d){for(const l of he)if(d===l.days&&!n.value.claimedMilestones.includes(l.days))return n.value.claimedMilestones.push(l.days),t(l.bonus,"streakMilestone"),bn.value=l,kn.value=!0,!0;return!1}function o(){const d=new Date,l=n.value.lastFreezeReplenish;if(!l){n.value.streakFreezes=Math.min((n.value.streakFreezes||0)+1,2),n.value.lastFreezeReplenish=d.toDateString();return}const c=new Date(l);Math.round((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(c.getFullYear(),c.getMonth(),c.getDate()))/864e5)>=7&&(n.value.streakFreezes=Math.min((n.value.streakFreezes||0)+1,2),n.value.lastFreezeReplenish=d.toDateString())}function r(){return(n.value.streakFreezes||0)>0?(n.value.streakFreezes-=1,!0):!1}function s(){const d=new Date().toDateString(),l=n.value.lastActiveDate;if(o(),l!==d){const c=new Date;if(c.setDate(c.getDate()-1),l===c.toDateString())n.value.currentStreak+=1,n.value.currentStreak>n.value.longestStreak&&(n.value.longestStreak=n.value.currentStreak),t(i.dailyStreak,"streak"),a(n.value.currentStreak);else if(l){const p=new Date(d),u=new Date(l);Math.round((Date.UTC(p.getFullYear(),p.getMonth(),p.getDate())-Date.UTC(u.getFullYear(),u.getMonth(),u.getDate()))/864e5)===2&&r()?(n.value.currentStreak+=1,n.value.currentStreak>n.value.longestStreak&&(n.value.longestStreak=n.value.currentStreak)):n.value.currentStreak=1}else n.value.currentStreak=1;t(i.firstMessageOfDay,"firstOfDay"),n.value.lastActiveDate=d,e()}}function h(){kn.value=!1,bn.value=null}return{updateStreak:s,dismissStreakMilestone:h}}const tn=[{id:"first_chat",category:"first_steps",icon:"💬",condition:n=>n.messagesSent>=1},{id:"ice_breaker",category:"first_steps",icon:"🧊",condition:n=>n.messagesSent>=10},{id:"chatterbox",category:"first_steps",icon:"🗣️",condition:n=>n.messagesSent>=100},{id:"streak_3",category:"consistency",icon:"🔥",condition:n=>n.longestStreak>=3},{id:"streak_7",category:"consistency",icon:"⚡",condition:n=>n.longestStreak>=7},{id:"streak_30",category:"consistency",icon:"🌟",condition:n=>n.longestStreak>=30},{id:"word_collector",category:"learning",icon:"📝",condition:n=>n.wordsLearned.length>=10},{id:"bookworm",category:"learning",icon:"📚",condition:n=>n.articlesCompleted.length>=5},{id:"polyglot",category:"learning",icon:"🌍",condition:n=>Object.keys(n.characterStats).length>=3},{id:"diary_first",category:"writing",icon:"📓",condition:n=>n.diaryEntries>=1},{id:"diary_week",category:"writing",icon:"📖",condition:n=>n.diaryEntries>=7},{id:"diary_month",category:"writing",icon:"📘",condition:n=>n.diaryEntries>=30},{id:"diary_vocab_5",category:"writing",icon:"🧵",condition:n=>n.diaryVocabUsed>=5},{id:"diary_vocab_25",category:"writing",icon:"📕",condition:n=>n.diaryVocabUsed>=25},{id:"diary_streak_7",category:"writing",icon:"🖋️",condition:n=>n.longestDiaryStreak>=7},{id:"diary_long",category:"writing",icon:"💭",condition:n=>n.hasWrittenLongEntry===!0},{id:"diary_100",category:"writing",icon:"🏛️",condition:n=>n.diaryEntries>=100},{id:"first_character",category:"learning",icon:"あ",condition:n=>n.preLessonStats?.totalCharactersLearned>=1},{id:"hiragana_10",category:"learning",icon:"📖",condition:n=>n.preLessonStats?.totalCharactersLearned>=10},{id:"hiragana_master",category:"mastery",icon:"🏆",condition:n=>n.preLessonStats?.totalCharactersLearned>=46},{id:"script_scholar",category:"mastery",icon:"📜",condition:n=>n.preLessonStats?.totalPreLessonsCompleted>=5},{id:"level_beginner",category:"mastery",icon:"🌿",condition:n=>n.totalXP>=100},{id:"level_speaker",category:"mastery",icon:"💬",condition:n=>n.totalXP>=600},{id:"level_legend",category:"mastery",icon:"👑",condition:n=>n.totalXP>=5500}],In=E(!1),_n=E(null);function ot(n,e){const t=R(()=>tn.filter(r=>n.value.unlockedAchievements.includes(r.id))),i=R(()=>tn.filter(r=>!n.value.unlockedAchievements.includes(r.id)));function a(){for(const r of tn)if(!n.value.unlockedAchievements.includes(r.id)&&r.condition(n.value))return n.value.unlockedAchievements.push(r.id),_n.value=r,In.value=!0,e(),!0;return!1}function o(){In.value=!1,_n.value=null,setTimeout(()=>a(),300)}return{unlockedAchievements:t,lockedAchievements:i,checkAchievements:a,dismissAchievementUnlock:o}}const st=`# Chapter: Week 7 - City & Transportation
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
`,ht=`# Chapter: Week 5 - Clothes & Shopping
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
`,dt=`# Chapter: Week 4 - Family & Friends
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
`,lt=`# Chapter: Week 2 - Food & Eating
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
`,ct=`# Chapter: Week 10 - Health & Body
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
`,ut=`# Chapter: Week 8 - Hobbies & Free Time
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
`,pt=`# Chapter: Week 3 - Home & Living
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
`,gt=`# Chapter: Week 1 - The Morning Routine
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
`,mt=`# Chapter: Week 6 - Time & Schedules
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
`,zt=`# Chapter: Week 9 - Weather & Seasons
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
`,ft=`# Chapter: Week 3 - Future & Plans
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
`,jt=`# Chapter: Week 4 - Experiences & Achievements
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
`,yt=`# Chapter: Week 5 - Travel Problems & Complaints
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
`,wt=`# Chapter: Week 6 - Opinions & Disagreement
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
`,xt=`# Chapter: Week 7 - Describing Personality
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
`,vt=`# Chapter: Week 8 - Entertainment & Reviews
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
`,kt=`# Chapter: Week 1 - Identity & Background
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
`,bt=`# Chapter: Week 2 - Telling Stories
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
`,It=`# Chapter: Comprehension Check
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
  xpReward: 20`,_t=`# Chapter: Me and You
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
`,At=`# Chapter: Me, You, and Professionals
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
`,St=`# Chapter: Mixed Practice (Dialogue Flow)
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
  xpReward: 20`,Tt=`# Chapter: The Negative (Not X)
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
  xpReward: 20`,Ct=`# Chapter: Shadowing (Speed & Rhythm)
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
  xpReward: 20`,Et=`# Chapter: Stating Facts
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
  xpReward: 20`,Lt=`# Chapter: Yes / No Questions
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
  xpReward: 20`,Pt=`# Pre-Lesson: Hiragana Vowels & K-row
meta:
  id: hiragana-01-vowels-k
  title:
    en: "Hiragana: Vowels & K-row"
    ja: "ひらがな：母音とか行"
    zh: "平假名：母音與ka行"
  description:
    en: "Learn the 5 vowels and the ka-row"
    ja: "5つの母音とか行を学びましょう"
    zh: "學習5個母音和ka行"
  icon: "あ"
  order: 0.1
  level: foundation
  type: pre-lesson
  group:
    en: "Hiragana"
    ja: "ひらがな"
    zh: "平假名"
  estimatedMinutes: 15
  prerequisite: null

characters:
  - id: a
    char: "あ"
    reading: "a"
    romaji: "a"
    audio_hint: "ah, as in 'father'"
    mnemonic:
      en: "A person crossing a street, saying 'Ahh!'"
      zh: "一個人過馬路，說「啊！」"
    stroke_count: 3
    row: "vowel"
    examples:
      - word: "あめ"
        reading: "ame"
        meaning: { en: "rain", zh: "雨" }
      - word: "あさ"
        reading: "asa"
        meaning: { en: "morning", zh: "早上" }

  - id: i
    char: "い"
    reading: "i"
    romaji: "i"
    audio_hint: "ee, as in 'eat'"
    mnemonic:
      en: "Two eels swimming side by side — 'eee!'"
      zh: "兩條鰻魚並排游——「咦！」"
    stroke_count: 2
    row: "vowel"
    examples:
      - word: "いぬ"
        reading: "inu"
        meaning: { en: "dog", zh: "狗" }
      - word: "いえ"
        reading: "ie"
        meaning: { en: "house", zh: "房子" }

  - id: u
    char: "う"
    reading: "u"
    romaji: "u"
    audio_hint: "oo, as in 'food'"
    mnemonic:
      en: "A wiggling worm poking up — 'ooo!'"
      zh: "一條蟲子冒出來——「嗚！」"
    stroke_count: 2
    row: "vowel"
    examples:
      - word: "うみ"
        reading: "umi"
        meaning: { en: "sea", zh: "海" }
      - word: "うえ"
        reading: "ue"
        meaning: { en: "above", zh: "上面" }

  - id: e
    char: "え"
    reading: "e"
    romaji: "e"
    audio_hint: "eh, as in 'pet'"
    mnemonic:
      en: "An energetic dancer with arms out — 'eh?'"
      zh: "一個精力充沛的舞者張開雙臂——「欸？」"
    stroke_count: 2
    row: "vowel"
    examples:
      - word: "えき"
        reading: "eki"
        meaning: { en: "station", zh: "車站" }
      - word: "えん"
        reading: "en"
        meaning: { en: "yen / circle", zh: "日圓／圓" }

  - id: o
    char: "お"
    reading: "o"
    romaji: "o"
    audio_hint: "oh, as in 'go'"
    mnemonic:
      en: "A golf ball on a tee — 'Oh, nice shot!'"
      zh: "高爾夫球在球座上——「噢，好球！」"
    stroke_count: 3
    row: "vowel"
    examples:
      - word: "おか"
        reading: "oka"
        meaning: { en: "hill", zh: "小山丘" }
      - word: "おと"
        reading: "oto"
        meaning: { en: "sound", zh: "聲音" }

  - id: ka
    char: "か"
    reading: "ka"
    romaji: "ka"
    audio_hint: "ka, as in 'car'"
    mnemonic:
      en: "A knife cutting — 'KA-chop!'"
      zh: "刀子切東西——「咔嚓！」"
    stroke_count: 3
    row: "k"
    examples:
      - word: "かさ"
        reading: "kasa"
        meaning: { en: "umbrella", zh: "傘" }
      - word: "かお"
        reading: "kao"
        meaning: { en: "face", zh: "臉" }

  - id: ki
    char: "き"
    reading: "ki"
    romaji: "ki"
    audio_hint: "kee, as in 'key'"
    mnemonic:
      en: "A key hanging on a hook — 'KEY!'"
      zh: "一把鑰匙掛在鉤子上——「KEY！」"
    stroke_count: 4
    row: "k"
    examples:
      - word: "きく"
        reading: "kiku"
        meaning: { en: "to listen", zh: "聽" }
      - word: "きた"
        reading: "kita"
        meaning: { en: "north", zh: "北" }

  - id: ku
    char: "く"
    reading: "ku"
    romaji: "ku"
    audio_hint: "koo, as in 'cool'"
    mnemonic:
      en: "A beak of a cuckoo bird — 'KOO-koo!'"
      zh: "布穀鳥的嘴——「咕咕！」"
    stroke_count: 1
    row: "k"
    examples:
      - word: "くち"
        reading: "kuchi"
        meaning: { en: "mouth", zh: "嘴巴" }
      - word: "くも"
        reading: "kumo"
        meaning: { en: "cloud / spider", zh: "雲／蜘蛛" }

  - id: ke
    char: "け"
    reading: "ke"
    romaji: "ke"
    audio_hint: "keh, as in 'kept'"
    mnemonic:
      en: "A gate swinging open — 'KE-reak!'"
      zh: "一扇門打開——「嘎！」"
    stroke_count: 3
    row: "k"
    examples:
      - word: "けす"
        reading: "kesu"
        meaning: { en: "to erase", zh: "擦掉" }
      - word: "けいたい"
        reading: "keitai"
        meaning: { en: "mobile phone", zh: "手機" }

  - id: ko
    char: "こ"
    reading: "ko"
    romaji: "ko"
    audio_hint: "koh, as in 'coat'"
    mnemonic:
      en: "Two worms on the ground — a KOuple of worms!"
      zh: "地上兩條蟲——一對蟲子！"
    stroke_count: 2
    row: "k"
    examples:
      - word: "こえ"
        reading: "koe"
        meaning: { en: "voice", zh: "聲音" }
      - word: "ここ"
        reading: "koko"
        meaning: { en: "here", zh: "這裡" }

words: []

grid:
  columns: 5
  groupBy: "row"

matching:
  pairs: 5
  modes:
    - "char_to_reading"
    - "audio_to_char"

quiz:
  questionsPerRound: 10
  xpReward: 15
  questionTypes:
    - "char_to_reading"
    - "reading_to_char"
    - "audio_to_char"
`,Dt=`# Pre-Lesson: Hiragana S-row & T-row
meta:
  id: hiragana-02-s-t
  title:
    en: "Hiragana: S-row & T-row"
    ja: "ひらがな：さ行とた行"
    zh: "平假名：sa行與ta行"
  description:
    en: "Learn the sa-row and ta-row characters"
    ja: "さ行とた行の文字を学びましょう"
    zh: "學習sa行和ta行的文字"
  icon: "さ"
  order: 0.2
  level: foundation
  type: pre-lesson
  group:
    en: "Hiragana"
    ja: "ひらがな"
    zh: "平假名"
  estimatedMinutes: 15
  prerequisite: hiragana-01-vowels-k

characters:
  - id: sa
    char: "さ"
    reading: "sa"
    romaji: "sa"
    audio_hint: "sa, as in 'saw'"
    mnemonic:
      en: "A person sitting on a SAd bench"
      zh: "一個人坐在憂傷的長椅上"
    stroke_count: 3
    row: "s"
    examples:
      - word: "さくら"
        reading: "sakura"
        meaning: { en: "cherry blossom", zh: "櫻花" }
      - word: "さかな"
        reading: "sakana"
        meaning: { en: "fish", zh: "魚" }

  - id: shi
    char: "し"
    reading: "shi"
    romaji: "shi"
    audio_hint: "shee, as in 'she'"
    mnemonic:
      en: "A fishing hook — 'SHE caught a fish!'"
      zh: "一個魚鉤——「她釣到魚了！」"
    stroke_count: 1
    row: "s"
    examples:
      - word: "しお"
        reading: "shio"
        meaning: { en: "salt", zh: "鹽" }
      - word: "しま"
        reading: "shima"
        meaning: { en: "island", zh: "島" }

  - id: su
    char: "す"
    reading: "su"
    romaji: "su"
    audio_hint: "soo, as in 'suit'"
    mnemonic:
      en: "A swirling noodle on a chopstick — slurp the SOOp!"
      zh: "筷子上轉圈的麵條——喝湯！"
    stroke_count: 2
    row: "s"
    examples:
      - word: "すし"
        reading: "sushi"
        meaning: { en: "sushi", zh: "壽司" }
      - word: "すき"
        reading: "suki"
        meaning: { en: "like / fond of", zh: "喜歡" }

  - id: se
    char: "せ"
    reading: "se"
    romaji: "se"
    audio_hint: "seh, as in 'set'"
    mnemonic:
      en: "A mouth open wide, ready to SAY something"
      zh: "嘴巴張大，準備「說」什麼"
    stroke_count: 3
    row: "s"
    examples:
      - word: "せかい"
        reading: "sekai"
        meaning: { en: "world", zh: "世界" }
      - word: "せんせい"
        reading: "sensei"
        meaning: { en: "teacher", zh: "老師" }

  - id: so
    char: "そ"
    reading: "so"
    romaji: "so"
    audio_hint: "soh, as in 'so'"
    mnemonic:
      en: "A zigzag lightning bolt — 'SO shocking!'"
      zh: "一道閃電——「好震驚！」"
    stroke_count: 1
    row: "s"
    examples:
      - word: "そと"
        reading: "soto"
        meaning: { en: "outside", zh: "外面" }
      - word: "そら"
        reading: "sora"
        meaning: { en: "sky", zh: "天空" }

  - id: ta
    char: "た"
    reading: "ta"
    romaji: "ta"
    audio_hint: "ta, as in 'taco'"
    mnemonic:
      en: "A person crossing their legs — 'TA-da!'"
      zh: "一個人翹著腳——「噠噠！」"
    stroke_count: 4
    row: "t"
    examples:
      - word: "たべる"
        reading: "taberu"
        meaning: { en: "to eat", zh: "吃" }
      - word: "たかい"
        reading: "takai"
        meaning: { en: "tall / expensive", zh: "高／貴" }

  - id: chi
    char: "ち"
    reading: "chi"
    romaji: "chi"
    audio_hint: "chee, as in 'cheese'"
    mnemonic:
      en: "A cheerleader kicking — 'CHEEr!'"
      zh: "啦啦隊員踢腿——「加油！」"
    stroke_count: 2
    row: "t"
    examples:
      - word: "ちかい"
        reading: "chikai"
        meaning: { en: "near / close", zh: "近" }
      - word: "ちず"
        reading: "chizu"
        meaning: { en: "map", zh: "地圖" }

  - id: tsu
    char: "つ"
    reading: "tsu"
    romaji: "tsu"
    audio_hint: "tsoo, as in 'tsunami'"
    mnemonic:
      en: "A TSUnami wave curling over!"
      zh: "一道海嘯捲起的浪！"
    stroke_count: 1
    row: "t"
    examples:
      - word: "つき"
        reading: "tsuki"
        meaning: { en: "moon", zh: "月亮" }
      - word: "つくえ"
        reading: "tsukue"
        meaning: { en: "desk", zh: "書桌" }

  - id: te
    char: "て"
    reading: "te"
    romaji: "te"
    audio_hint: "teh, as in 'ten'"
    mnemonic:
      en: "A hand reaching out — 'te' means hand!"
      zh: "一隻手伸出來——「te」就是手！"
    stroke_count: 1
    row: "t"
    examples:
      - word: "てがみ"
        reading: "tegami"
        meaning: { en: "letter", zh: "信" }
      - word: "てんき"
        reading: "tenki"
        meaning: { en: "weather", zh: "天氣" }

  - id: to
    char: "と"
    reading: "to"
    romaji: "to"
    audio_hint: "toh, as in 'toe'"
    mnemonic:
      en: "A TOEnail with a dot — ouch, stubbed my TOE!"
      zh: "一個腳趾甲加一點——啊，撞到腳趾了！"
    stroke_count: 2
    row: "t"
    examples:
      - word: "とり"
        reading: "tori"
        meaning: { en: "bird", zh: "鳥" }
      - word: "ともだち"
        reading: "tomodachi"
        meaning: { en: "friend", zh: "朋友" }

words: []

grid:
  columns: 5
  groupBy: "row"

matching:
  pairs: 5
  modes:
    - "char_to_reading"
    - "audio_to_char"

quiz:
  questionsPerRound: 10
  xpReward: 15
  questionTypes:
    - "char_to_reading"
    - "reading_to_char"
    - "audio_to_char"
`,Mt=`# Pre-Lesson: Hiragana N-row & H-row
meta:
  id: hiragana-03-n-h
  title:
    en: "Hiragana: N-row & H-row"
    ja: "ひらがな：な行とは行"
    zh: "平假名：na行與ha行"
  description:
    en: "Learn the na-row and ha-row characters"
    ja: "な行とは行の文字を学びましょう"
    zh: "學習na行和ha行的文字"
  icon: "な"
  order: 0.3
  level: foundation
  type: pre-lesson
  group:
    en: "Hiragana"
    ja: "ひらがな"
    zh: "平假名"
  estimatedMinutes: 15
  prerequisite: hiragana-02-s-t

characters:
  - id: na
    char: "な"
    reading: "na"
    romaji: "na"
    audio_hint: "na, as in 'nacho'"
    mnemonic:
      en: "A kNOT tied in a rope — 'NA-t!'"
      zh: "繩子打了個結——「哪！」"
    stroke_count: 4
    row: "n"
    examples:
      - word: "なつ"
        reading: "natsu"
        meaning: { en: "summer", zh: "夏天" }
      - word: "なまえ"
        reading: "namae"
        meaning: { en: "name", zh: "名字" }

  - id: ni
    char: "に"
    reading: "ni"
    romaji: "ni"
    audio_hint: "nee, as in 'knee'"
    mnemonic:
      en: "A pair of kNEEs side by side — 'NEE!'"
      zh: "兩個膝蓋並排——「尼！」"
    stroke_count: 3
    row: "n"
    examples:
      - word: "にく"
        reading: "niku"
        meaning: { en: "meat", zh: "肉" }
      - word: "にほん"
        reading: "nihon"
        meaning: { en: "Japan", zh: "日本" }

  - id: nu
    char: "ぬ"
    reading: "nu"
    romaji: "nu"
    audio_hint: "noo, as in 'noodle'"
    mnemonic:
      en: "NOOdles tangled together in a bowl"
      zh: "一碗纏在一起的麵條"
    stroke_count: 2
    row: "n"
    examples:
      - word: "ぬの"
        reading: "nuno"
        meaning: { en: "cloth", zh: "布" }
      - word: "いぬ"
        reading: "inu"
        meaning: { en: "dog", zh: "狗" }

  - id: ne
    char: "ね"
    reading: "ne"
    romaji: "ne"
    audio_hint: "neh, as in 'net'"
    mnemonic:
      en: "A cat curled up with its tail — 'NEko!'"
      zh: "貓咪蜷起尾巴——「猫！」"
    stroke_count: 2
    row: "n"
    examples:
      - word: "ねこ"
        reading: "neko"
        meaning: { en: "cat", zh: "貓" }
      - word: "ねる"
        reading: "neru"
        meaning: { en: "to sleep", zh: "睡覺" }

  - id: "no"
    char: "の"
    reading: "no"
    romaji: "no"
    audio_hint: "noh, as in 'no'"
    mnemonic:
      en: "A 'NO entry' sign — a circle with a line!"
      zh: "一個「禁止進入」的標誌——圈加一條線！"
    stroke_count: 1
    row: "n"
    examples:
      - word: "のむ"
        reading: "nomu"
        meaning: { en: "to drink", zh: "喝" }
      - word: "もの"
        reading: "mono"
        meaning: { en: "thing", zh: "東西" }

  - id: ha
    char: "は"
    reading: "ha"
    romaji: "ha"
    audio_hint: "ha, as in 'ha-ha'"
    mnemonic:
      en: "A person laughing — 'HA HA HA!'"
      zh: "一個人在大笑——「哈哈哈！」"
    stroke_count: 3
    row: "h"
    examples:
      - word: "はな"
        reading: "hana"
        meaning: { en: "flower / nose", zh: "花／鼻子" }
      - word: "はし"
        reading: "hashi"
        meaning: { en: "chopsticks / bridge", zh: "筷子／橋" }

  - id: hi
    char: "ひ"
    reading: "hi"
    romaji: "hi"
    audio_hint: "hee, as in 'he'"
    mnemonic:
      en: "A smiling mouth — 'HEE hee!'"
      zh: "一張微笑的嘴——「嘻嘻！」"
    stroke_count: 1
    row: "h"
    examples:
      - word: "ひと"
        reading: "hito"
        meaning: { en: "person", zh: "人" }
      - word: "ひかり"
        reading: "hikari"
        meaning: { en: "light", zh: "光" }

  - id: fu
    char: "ふ"
    reading: "fu"
    romaji: "fu"
    audio_hint: "foo, between 'foo' and 'hoo'"
    mnemonic:
      en: "Mount FUji with a cloud on top"
      zh: "富士山頂上有朵雲"
    stroke_count: 4
    row: "h"
    examples:
      - word: "ふね"
        reading: "fune"
        meaning: { en: "ship", zh: "船" }
      - word: "ふゆ"
        reading: "fuyu"
        meaning: { en: "winter", zh: "冬天" }

  - id: he
    char: "へ"
    reading: "he"
    romaji: "he"
    audio_hint: "heh, as in 'help'"
    mnemonic:
      en: "A mountain peak — let's HEad to the top!"
      zh: "一座山峰——往山頂走！"
    stroke_count: 1
    row: "h"
    examples:
      - word: "へや"
        reading: "heya"
        meaning: { en: "room", zh: "房間" }
      - word: "へた"
        reading: "heta"
        meaning: { en: "unskillful", zh: "不擅長" }

  - id: ho
    char: "ほ"
    reading: "ho"
    romaji: "ho"
    audio_hint: "hoh, as in 'hope'"
    mnemonic:
      en: "A flag on a pole — 'HO-ist the flag!'"
      zh: "旗桿上的旗——「升旗！」"
    stroke_count: 4
    row: "h"
    examples:
      - word: "ほし"
        reading: "hoshi"
        meaning: { en: "star", zh: "星星" }
      - word: "ほん"
        reading: "hon"
        meaning: { en: "book", zh: "書" }

words: []

grid:
  columns: 5
  groupBy: "row"

matching:
  pairs: 5
  modes:
    - "char_to_reading"
    - "audio_to_char"

quiz:
  questionsPerRound: 10
  xpReward: 15
  questionTypes:
    - "char_to_reading"
    - "reading_to_char"
    - "audio_to_char"
`,Rt=`# Pre-Lesson: Hiragana M-row, Y-row, R-row, W-row & N
meta:
  id: hiragana-04-m-y-r-w
  title:
    en: "Hiragana: M, Y, R, W-rows & N"
    ja: "ひらがな：ま行・や行・ら行・わ行・ん"
    zh: "平假名：ma行・ya行・ra行・wa行・ん"
  description:
    en: "Learn the remaining basic hiragana characters"
    ja: "残りの基本ひらがなを学びましょう"
    zh: "學習剩餘的基本平假名"
  icon: "ま"
  order: 0.4
  level: foundation
  type: pre-lesson
  group:
    en: "Hiragana"
    ja: "ひらがな"
    zh: "平假名"
  estimatedMinutes: 15
  prerequisite: hiragana-03-n-h

characters:
  - id: ma
    char: "ま"
    reading: "ma"
    romaji: "ma"
    audio_hint: "ma, as in 'mama'"
    mnemonic:
      en: "A MAma with her arms open wide"
      zh: "媽媽張開雙臂——「媽！」"
    stroke_count: 3
    row: "m"
    examples:
      - word: "まち"
        reading: "machi"
        meaning: { en: "town", zh: "城鎮" }
      - word: "まど"
        reading: "mado"
        meaning: { en: "window", zh: "窗戶" }

  - id: mi
    char: "み"
    reading: "mi"
    romaji: "mi"
    audio_hint: "mee, as in 'me'"
    mnemonic:
      en: "Two streams MEeting together"
      zh: "兩條溪流匯合在一起"
    stroke_count: 2
    row: "m"
    examples:
      - word: "みず"
        reading: "mizu"
        meaning: { en: "water", zh: "水" }
      - word: "みみ"
        reading: "mimi"
        meaning: { en: "ear", zh: "耳朵" }

  - id: mu
    char: "む"
    reading: "mu"
    romaji: "mu"
    audio_hint: "moo, as in 'moo'"
    mnemonic:
      en: "A cow says 'MOO!' — see the horns?"
      zh: "牛叫「哞！」——看到牛角了嗎？"
    stroke_count: 3
    row: "m"
    examples:
      - word: "むし"
        reading: "mushi"
        meaning: { en: "insect", zh: "蟲子" }
      - word: "むら"
        reading: "mura"
        meaning: { en: "village", zh: "村莊" }

  - id: me
    char: "め"
    reading: "me"
    romaji: "me"
    audio_hint: "meh, as in 'met'"
    mnemonic:
      en: "An eye with eyelashes — 'me' means eye!"
      zh: "一隻帶睫毛的眼睛——「目」就是眼睛！"
    stroke_count: 2
    row: "m"
    examples:
      - word: "め"
        reading: "me"
        meaning: { en: "eye", zh: "眼睛" }
      - word: "あめ"
        reading: "ame"
        meaning: { en: "rain / candy", zh: "雨／糖果" }

  - id: mo
    char: "も"
    reading: "mo"
    romaji: "mo"
    audio_hint: "moh, as in 'more'"
    mnemonic:
      en: "A fishhook catching MORE fish!"
      zh: "魚鉤釣到更多的魚！"
    stroke_count: 3
    row: "m"
    examples:
      - word: "もの"
        reading: "mono"
        meaning: { en: "thing", zh: "東西" }
      - word: "もり"
        reading: "mori"
        meaning: { en: "forest", zh: "森林" }

  - id: ya
    char: "や"
    reading: "ya"
    romaji: "ya"
    audio_hint: "ya, as in 'yard'"
    mnemonic:
      en: "A YAk with big horns"
      zh: "一頭有大角的犛牛"
    stroke_count: 3
    row: "y"
    examples:
      - word: "やま"
        reading: "yama"
        meaning: { en: "mountain", zh: "山" }
      - word: "やすい"
        reading: "yasui"
        meaning: { en: "cheap", zh: "便宜" }

  - id: yu
    char: "ゆ"
    reading: "yu"
    romaji: "yu"
    audio_hint: "yoo, as in 'you'"
    mnemonic:
      en: "A fish swimming — 'YOUr fish is getting away!'"
      zh: "一條魚在游——「你的魚跑了！」"
    stroke_count: 2
    row: "y"
    examples:
      - word: "ゆき"
        reading: "yuki"
        meaning: { en: "snow", zh: "雪" }
      - word: "ゆめ"
        reading: "yume"
        meaning: { en: "dream", zh: "夢" }

  - id: yo
    char: "よ"
    reading: "yo"
    romaji: "yo"
    audio_hint: "yoh, as in 'yoga'"
    mnemonic:
      en: "A person doing YOga — standing on one leg"
      zh: "一個人在做瑜伽——單腳站立"
    stroke_count: 2
    row: "y"
    examples:
      - word: "よる"
        reading: "yoru"
        meaning: { en: "night", zh: "夜晚" }
      - word: "よむ"
        reading: "yomu"
        meaning: { en: "to read", zh: "閱讀" }

  - id: ra
    char: "ら"
    reading: "ra"
    romaji: "ra"
    audio_hint: "ra, between 'ra' and 'la'"
    mnemonic:
      en: "A RAmp going up — 'RA-ce up the ramp!'"
      zh: "一條斜坡往上——「跑上去！」"
    stroke_count: 2
    row: "r"
    examples:
      - word: "らいねん"
        reading: "rainen"
        meaning: { en: "next year", zh: "明年" }

  - id: ri
    char: "り"
    reading: "ri"
    romaji: "ri"
    audio_hint: "ree, between 'ree' and 'lee'"
    mnemonic:
      en: "Two REEds swaying in the wind"
      zh: "兩根蘆葦在風中搖擺"
    stroke_count: 2
    row: "r"
    examples:
      - word: "りんご"
        reading: "ringo"
        meaning: { en: "apple", zh: "蘋果" }

  - id: ru
    char: "る"
    reading: "ru"
    romaji: "ru"
    audio_hint: "roo, between 'roo' and 'loo'"
    mnemonic:
      en: "A ROOt growing into the ground with a loop"
      zh: "一條根長進地裡打了個圈"
    stroke_count: 1
    row: "r"
    examples:
      - word: "みる"
        reading: "miru"
        meaning: { en: "to see", zh: "看" }
      - word: "たべる"
        reading: "taberu"
        meaning: { en: "to eat", zh: "吃" }

  - id: re
    char: "れ"
    reading: "re"
    romaji: "re"
    audio_hint: "reh, between 'reh' and 'leh'"
    mnemonic:
      en: "A person REaching out to the side"
      zh: "一個人向旁邊伸手"
    stroke_count: 2
    row: "r"
    examples:
      - word: "れきし"
        reading: "rekishi"
        meaning: { en: "history", zh: "歷史" }

  - id: ro
    char: "ろ"
    reading: "ro"
    romaji: "ro"
    audio_hint: "roh, between 'roh' and 'loh'"
    mnemonic:
      en: "A ROad winding along — follow the road!"
      zh: "一條蜿蜒的路——沿著走！"
    stroke_count: 1
    row: "r"
    examples:
      - word: "ろく"
        reading: "roku"
        meaning: { en: "six", zh: "六" }

  - id: wa
    char: "わ"
    reading: "wa"
    romaji: "wa"
    audio_hint: "wa, as in 'wand'"
    mnemonic:
      en: "A person saying 'WA!' in surprise"
      zh: "一個人驚訝地說「哇！」"
    stroke_count: 2
    row: "w"
    examples:
      - word: "わたし"
        reading: "watashi"
        meaning: { en: "I / me", zh: "我" }

  - id: wo
    char: "を"
    reading: "wo"
    romaji: "wo"
    audio_hint: "oh (used as particle 'o')"
    mnemonic:
      en: "A WOrker balancing — this is the object marker particle!"
      zh: "一個工人在保持平衡——這是助詞！"
    stroke_count: 3
    row: "w"
    examples:
      - word: "みずをのむ"
        reading: "mizu wo nomu"
        meaning: { en: "to drink water", zh: "喝水" }

  - id: "n"
    char: "ん"
    reading: "n"
    romaji: "n"
    audio_hint: "n, a nasal sound like 'hmm'"
    mnemonic:
      en: "A person humming — 'Nn...' The only consonant without a vowel!"
      zh: "一個人在哼歌——「嗯……」唯一沒有母音的子音！"
    stroke_count: 1
    row: "special"
    examples:
      - word: "にほん"
        reading: "nihon"
        meaning: { en: "Japan", zh: "日本" }
      - word: "せんせい"
        reading: "sensei"
        meaning: { en: "teacher", zh: "老師" }

words: []

grid:
  columns: 5
  groupBy: "row"

matching:
  pairs: 5
  modes:
    - "char_to_reading"
    - "audio_to_char"

quiz:
  questionsPerRound: 10
  xpReward: 15
  questionTypes:
    - "char_to_reading"
    - "reading_to_char"
    - "audio_to_char"
`,Ot=`# Pre-Lesson: Hiragana Dakuten & Handakuten
meta:
  id: hiragana-05-dakuten
  title:
    en: "Hiragana: Dakuten & Handakuten"
    ja: "ひらがな：濁音と半濁音"
    zh: "平假名：濁音與半濁音"
  description:
    en: "Learn voiced and semi-voiced hiragana characters"
    ja: "濁音と半濁音の文字を学びましょう"
    zh: "學習濁音和半濁音的文字"
  icon: "が"
  order: 0.5
  level: foundation
  type: pre-lesson
  group:
    en: "Hiragana"
    ja: "ひらがな"
    zh: "平假名"
  estimatedMinutes: 15
  prerequisite: hiragana-04-m-y-r-w

characters:
  # ga-row (か → が)
  - id: ga
    char: "が"
    reading: "ga"
    romaji: "ga"
    audio_hint: "ga, as in 'garden'"
    mnemonic:
      en: "が is か with dakuten marks — the voice becomes heavier, like GArdening in heavy boots"
      zh: "が是か加上濁點——聲音變重了，像穿重靴子在花園裡"
    stroke_count: 5
    row: "g"
    examples:
      - word: "がっこう"
        reading: "gakkou"
        meaning: { en: "school", zh: "學校" }
      - word: "がいこく"
        reading: "gaikoku"
        meaning: { en: "foreign country", zh: "外國" }

  - id: gi
    char: "ぎ"
    reading: "gi"
    romaji: "gi"
    audio_hint: "gee, as in 'geese'"
    mnemonic:
      en: "ぎ is き with dakuten — the key now buzzes with energy"
      zh: "ぎ是き加上濁點——鑰匙現在嗡嗡作響"
    stroke_count: 6
    row: "g"
    examples:
      - word: "ぎんこう"
        reading: "ginkou"
        meaning: { en: "bank", zh: "銀行" }

  - id: gu
    char: "ぐ"
    reading: "gu"
    romaji: "gu"
    audio_hint: "goo, as in 'goose'"
    mnemonic:
      en: "ぐ is く with dakuten — the beak now GOOs louder"
      zh: "ぐ是く加上濁點——鳥嘴叫得更大聲了"
    stroke_count: 3
    row: "g"
    examples:
      - word: "ぐうぜん"
        reading: "guuzen"
        meaning: { en: "by chance", zh: "偶然" }

  - id: ge
    char: "げ"
    reading: "ge"
    romaji: "ge"
    audio_hint: "geh, as in 'get'"
    mnemonic:
      en: "げ is け with dakuten — the gate now creaks with a heavy GET"
      zh: "げ是け加上濁點——門現在發出沉重的嘎吱聲"
    stroke_count: 5
    row: "g"
    examples:
      - word: "げんき"
        reading: "genki"
        meaning: { en: "healthy / energetic", zh: "精神好" }

  - id: go
    char: "ご"
    reading: "go"
    romaji: "go"
    audio_hint: "goh, as in 'go'"
    mnemonic:
      en: "ご is こ with dakuten — the worms are ready to GO"
      zh: "ご是こ加上濁點——蟲子準備出發了"
    stroke_count: 4
    row: "g"
    examples:
      - word: "ごご"
        reading: "gogo"
        meaning: { en: "afternoon", zh: "下午" }

  # za-row (さ → ざ)
  - id: za
    char: "ざ"
    reading: "za"
    romaji: "za"
    audio_hint: "za, as in 'pizza'"
    mnemonic:
      en: "ざ is さ with dakuten — the sad bench now buzZes"
      zh: "ざ是さ加上濁點——長椅現在嗡嗡響"
    stroke_count: 5
    row: "z"
    examples:
      - word: "ざっし"
        reading: "zasshi"
        meaning: { en: "magazine", zh: "雜誌" }

  - id: ji
    char: "じ"
    reading: "ji"
    romaji: "ji"
    audio_hint: "jee, as in 'jeep'"
    mnemonic:
      en: "じ is し with dakuten — the hook now JIngles"
      zh: "じ是し加上濁點——魚鉤現在叮噹響"
    stroke_count: 3
    row: "z"
    examples:
      - word: "じかん"
        reading: "jikan"
        meaning: { en: "time", zh: "時間" }
      - word: "じてんしゃ"
        reading: "jitensha"
        meaning: { en: "bicycle", zh: "自行車" }

  - id: zu
    char: "ず"
    reading: "zu"
    romaji: "zu"
    audio_hint: "zoo, as in 'zoo'"
    mnemonic:
      en: "ず is す with dakuten — the noodle swirls around the ZOO"
      zh: "ず是す加上濁點——麵條在動物園裡轉圈"
    stroke_count: 4
    row: "z"
    examples:
      - word: "みず"
        reading: "mizu"
        meaning: { en: "water", zh: "水" }

  - id: ze
    char: "ぜ"
    reading: "ze"
    romaji: "ze"
    audio_hint: "zeh, as in 'zest'"
    mnemonic:
      en: "ぜ is せ with dakuten — the mouth now speaks with ZEst"
      zh: "ぜ是せ加上濁點——嘴巴現在充滿熱情地說話"
    stroke_count: 5
    row: "z"
    examples:
      - word: "ぜんぶ"
        reading: "zenbu"
        meaning: { en: "all / everything", zh: "全部" }

  - id: zo
    char: "ぞ"
    reading: "zo"
    romaji: "zo"
    audio_hint: "zoh, as in 'zone'"
    mnemonic:
      en: "ぞ is そ with dakuten — the lightning enters the ZOne"
      zh: "ぞ是そ加上濁點——閃電進入了區域"
    stroke_count: 3
    row: "z"
    examples:
      - word: "ぞう"
        reading: "zou"
        meaning: { en: "elephant", zh: "大象" }

  # da-row (た → だ)
  - id: da
    char: "だ"
    reading: "da"
    romaji: "da"
    audio_hint: "da, as in 'dad'"
    mnemonic:
      en: "だ is た with dakuten — 'TA-da!' becomes 'DA-da!'"
      zh: "だ是た加上濁點——「噠噠」變成「大大」"
    stroke_count: 6
    row: "d"
    examples:
      - word: "だれ"
        reading: "dare"
        meaning: { en: "who", zh: "誰" }
      - word: "だいがく"
        reading: "daigaku"
        meaning: { en: "university", zh: "大學" }

  - id: di
    char: "ぢ"
    reading: "ji"
    romaji: "ji"
    audio_hint: "jee (same sound as じ)"
    mnemonic:
      en: "ぢ is ち with dakuten — rarely used, sounds like じ"
      zh: "ぢ是ち加上濁點——很少使用，發音同じ"
    stroke_count: 4
    row: "d"
    examples:
      - word: "はなぢ"
        reading: "hanadi"
        meaning: { en: "nosebleed", zh: "流鼻血" }

  - id: du
    char: "づ"
    reading: "zu"
    romaji: "zu"
    audio_hint: "zoo (same sound as ず)"
    mnemonic:
      en: "づ is つ with dakuten — rarely used, sounds like ず"
      zh: "づ是つ加上濁點——很少使用，發音同ず"
    stroke_count: 3
    row: "d"
    examples:
      - word: "つづく"
        reading: "tsuduku"
        meaning: { en: "to continue", zh: "繼續" }

  - id: de
    char: "で"
    reading: "de"
    romaji: "de"
    audio_hint: "deh, as in 'desk'"
    mnemonic:
      en: "で is て with dakuten — the hand now pounds the DEsk"
      zh: "で是て加上濁點——手現在拍打桌子"
    stroke_count: 3
    row: "d"
    examples:
      - word: "でんわ"
        reading: "denwa"
        meaning: { en: "telephone", zh: "電話" }
      - word: "でる"
        reading: "deru"
        meaning: { en: "to go out", zh: "出去" }

  - id: do
    char: "ど"
    reading: "do"
    romaji: "do"
    audio_hint: "doh, as in 'door'"
    mnemonic:
      en: "ど is と with dakuten — the toe now kicks the DOor"
      zh: "ど是と加上濁點——腳趾現在踢門了"
    stroke_count: 4
    row: "d"
    examples:
      - word: "どこ"
        reading: "doko"
        meaning: { en: "where", zh: "哪裡" }
      - word: "どうぶつ"
        reading: "doubutsu"
        meaning: { en: "animal", zh: "動物" }

  # ba-row (は → ば)
  - id: ba
    char: "ば"
    reading: "ba"
    romaji: "ba"
    audio_hint: "ba, as in 'bar'"
    mnemonic:
      en: "ば is は with dakuten — the laughter turns into BAA like a sheep"
      zh: "ば是は加上濁點——笑聲變成了綿羊的「咩」"
    stroke_count: 5
    row: "b"
    examples:
      - word: "ばしょ"
        reading: "basho"
        meaning: { en: "place", zh: "地方" }

  - id: bi
    char: "び"
    reading: "bi"
    romaji: "bi"
    audio_hint: "bee, as in 'bee'"
    mnemonic:
      en: "び is ひ with dakuten — the smile now BEEs with energy"
      zh: "び是ひ加上濁點——微笑現在充滿活力"
    stroke_count: 3
    row: "b"
    examples:
      - word: "びじゅつ"
        reading: "bijutsu"
        meaning: { en: "art", zh: "美術" }

  - id: bu
    char: "ぶ"
    reading: "bu"
    romaji: "bu"
    audio_hint: "boo, as in 'boot'"
    mnemonic:
      en: "ぶ is ふ with dakuten — Mount Fuji goes BOOm"
      zh: "ぶ是ふ加上濁點——富士山轟隆作響"
    stroke_count: 6
    row: "b"
    examples:
      - word: "ぶたにく"
        reading: "butaniku"
        meaning: { en: "pork", zh: "豬肉" }

  - id: be
    char: "べ"
    reading: "be"
    romaji: "be"
    audio_hint: "beh, as in 'bed'"
    mnemonic:
      en: "べ is へ with dakuten — the mountain peak is now a BEd"
      zh: "べ是へ加上濁點——山峰現在變成了床"
    stroke_count: 3
    row: "b"
    examples:
      - word: "べんきょう"
        reading: "benkyou"
        meaning: { en: "study", zh: "學習" }

  - id: bo
    char: "ぼ"
    reading: "bo"
    romaji: "bo"
    audio_hint: "boh, as in 'boat'"
    mnemonic:
      en: "ぼ is ほ with dakuten — the flag is on a BOat"
      zh: "ぼ是ほ加上濁點——旗子在船上"
    stroke_count: 6
    row: "b"
    examples:
      - word: "ぼうし"
        reading: "boushi"
        meaning: { en: "hat", zh: "帽子" }

  # pa-row (は → ぱ) handakuten
  - id: pa
    char: "ぱ"
    reading: "pa"
    romaji: "pa"
    audio_hint: "pa, as in 'papa'"
    mnemonic:
      en: "ぱ is は with a handakuten circle — a POP sound, like PAPA clapping"
      zh: "ぱ是は加上半濁點圓圈——啪的一聲，像爸爸拍手"
    stroke_count: 4
    row: "p"
    examples:
      - word: "ぱん"
        reading: "pan"
        meaning: { en: "bread", zh: "麵包" }

  - id: pi
    char: "ぴ"
    reading: "pi"
    romaji: "pi"
    audio_hint: "pee, as in 'peace'"
    mnemonic:
      en: "ぴ is ひ with a handakuten circle — a PIng sound"
      zh: "ぴ是ひ加上半濁點——叮的一聲"
    stroke_count: 2
    row: "p"
    examples:
      - word: "ぴかぴか"
        reading: "pikapika"
        meaning: { en: "sparkling", zh: "閃亮亮" }

  - id: pu
    char: "ぷ"
    reading: "pu"
    romaji: "pu"
    audio_hint: "poo, as in 'pool'"
    mnemonic:
      en: "ぷ is ふ with a handakuten circle — a PUff of air"
      zh: "ぷ是ふ加上半濁點——噗的一口氣"
    stroke_count: 5
    row: "p"
    examples:
      - word: "てんぷら"
        reading: "tenpura"
        meaning: { en: "tempura", zh: "天婦羅" }

  - id: pe
    char: "ぺ"
    reading: "pe"
    romaji: "pe"
    audio_hint: "peh, as in 'pen'"
    mnemonic:
      en: "ぺ is へ with a handakuten circle — flat like a PEbble"
      zh: "ぺ是へ加上半濁點——扁扁的像鵝卵石"
    stroke_count: 2
    row: "p"
    examples:
      - word: "ぺん"
        reading: "pen"
        meaning: { en: "pen", zh: "筆" }

  - id: po
    char: "ぽ"
    reading: "po"
    romaji: "po"
    audio_hint: "poh, as in 'post'"
    mnemonic:
      en: "ぽ is ほ with a handakuten circle — POP goes the flag!"
      zh: "ぽ是ほ加上半濁點——旗子啪地彈開！"
    stroke_count: 5
    row: "p"
    examples:
      - word: "たんぽぽ"
        reading: "tanpopo"
        meaning: { en: "dandelion", zh: "蒲公英" }

words: []

grid:
  columns: 5
  groupBy: "row"

matching:
  pairs: 5
  modes:
    - "char_to_reading"
    - "audio_to_char"

quiz:
  questionsPerRound: 10
  xpReward: 15
  questionTypes:
    - "char_to_reading"
    - "reading_to_char"
    - "audio_to_char"
`,Nt=`# Chapter: Discussing Movies

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
`,Ht=`# Pre-Lesson: Chinese Tones
meta:
  id: pinyin-01-tones
  title:
    en: "The Four Tones"
    ja: "四声"
    zh: "四聲"
  description:
    en: "Learn the four tones and neutral tone of Mandarin Chinese"
    ja: "中国語の四声と軽声を学びましょう"
    zh: "學習中文的四聲和輕聲"
  icon: "声"
  order: 0.1
  level: foundation
  type: pre-lesson
  group:
    en: "Pinyin"
    ja: "ピンイン"
    zh: "拼音"
  estimatedMinutes: 15
  prerequisite: null

characters:
  - id: tone1
    char: "ā"
    reading: "First tone (high flat)"
    romaji: "ā"
    tone: 1
    tone_description:
      en: "High and level, like singing a sustained note"
      ja: "高くて平らな音、持続する音符のように"
    audio_hint: "High flat pitch, like 'maaaah'"
    examples:
      - word: "妈"
        reading: "mā"
        meaning: { en: "mother", ja: "お母さん", zh: "媽媽" }
      - word: "他"
        reading: "tā"
        meaning: { en: "he/him", ja: "彼", zh: "他" }

  - id: tone2
    char: "á"
    reading: "Second tone (rising)"
    romaji: "á"
    tone: 2
    tone_description:
      en: "Rising pitch, like asking 'huh?' in surprise"
      ja: "上昇する音、驚いて「え？」と言うように"
    audio_hint: "Rising pitch, like a surprised 'what?'"
    examples:
      - word: "麻"
        reading: "má"
        meaning: { en: "hemp / numb", ja: "麻 / しびれ", zh: "麻" }
      - word: "人"
        reading: "rén"
        meaning: { en: "person", ja: "人", zh: "人" }

  - id: tone3
    char: "ǎ"
    reading: "Third tone (dipping)"
    romaji: "ǎ"
    tone: 3
    tone_description:
      en: "Dips low then rises, like a drawn-out 'well...'"
      ja: "低く下がってから上がる音、「えーと…」のように"
    audio_hint: "Low dipping pitch, like a thoughtful 'hmm'"
    examples:
      - word: "马"
        reading: "mǎ"
        meaning: { en: "horse", ja: "馬", zh: "馬" }
      - word: "你"
        reading: "nǐ"
        meaning: { en: "you", ja: "あなた", zh: "你" }

  - id: tone4
    char: "à"
    reading: "Fourth tone (falling)"
    romaji: "à"
    tone: 4
    tone_description:
      en: "Sharp falling pitch, like a firm command 'Stop!'"
      ja: "鋭く下降する音、「やめろ！」のような命令口調"
    audio_hint: "Sharp falling pitch, like an angry 'no!'"
    examples:
      - word: "骂"
        reading: "mà"
        meaning: { en: "to scold", ja: "叱る", zh: "罵" }
      - word: "大"
        reading: "dà"
        meaning: { en: "big", ja: "大きい", zh: "大" }

  - id: tone0
    char: "a"
    reading: "Neutral tone (light)"
    romaji: "a"
    tone: 0
    tone_description:
      en: "Light and short, unstressed — like a quick afterthought"
      ja: "軽くて短い、アクセントのない音"
    audio_hint: "Light and quick, no strong pitch"
    examples:
      - word: "吗"
        reading: "ma"
        meaning: { en: "question particle", ja: "疑問の助詞", zh: "嗎（疑問助詞）" }
      - word: "的"
        reading: "de"
        meaning: { en: "possessive particle", ja: "の（所有格）", zh: "的（助詞）" }

words: []

grid:
  columns: 5
  groupBy: "tone"

matching:
  pairs: 5
  modes:
    - "char_to_reading"
    - "audio_to_char"

quiz:
  questionsPerRound: 10
  xpReward: 15
  questionTypes:
    - "char_to_reading"
    - "reading_to_char"
    - "audio_to_char"
    - "tone_id"
`,Wt=`# Pre-Lesson: Pinyin Initials (Group 1)
meta:
  id: pinyin-02-initials
  title:
    en: "Pinyin Initials: b, p, m, f, d, t, n, l"
    ja: "ピンイン声母：b, p, m, f, d, t, n, l"
    zh: "拼音聲母：b, p, m, f, d, t, n, l"
  description:
    en: "Learn the 8 most common pinyin initials"
    ja: "最も一般的な8つのピンイン声母を学びましょう"
    zh: "學習8個最常見的拼音聲母"
  icon: "b"
  order: 0.2
  level: foundation
  type: pre-lesson
  group:
    en: "Pinyin"
    ja: "ピンイン"
    zh: "拼音"
  estimatedMinutes: 15
  prerequisite: pinyin-01-tones

characters:
  - id: b
    char: "b"
    reading: "b as in 'boy'"
    romaji: "b"
    audio_hint: "Like English 'b' in 'boy', but unaspirated"
    examples:
      - word: "爸"
        reading: "bà"
        meaning: { en: "father", ja: "お父さん", zh: "爸爸" }
      - word: "不"
        reading: "bù"
        meaning: { en: "not / no", ja: "〜ない", zh: "不" }

  - id: p
    char: "p"
    reading: "p as in 'park'"
    romaji: "p"
    audio_hint: "Like English 'p' in 'park', with a puff of air"
    examples:
      - word: "朋"
        reading: "péng"
        meaning: { en: "friend", ja: "友", zh: "朋（友）" }
      - word: "跑"
        reading: "pǎo"
        meaning: { en: "to run", ja: "走る", zh: "跑" }

  - id: m
    char: "m"
    reading: "m as in 'mother'"
    romaji: "m"
    audio_hint: "Like English 'm' in 'mother'"
    examples:
      - word: "妈"
        reading: "mā"
        meaning: { en: "mother", ja: "お母さん", zh: "媽媽" }
      - word: "猫"
        reading: "māo"
        meaning: { en: "cat", ja: "猫", zh: "貓" }

  - id: f
    char: "f"
    reading: "f as in 'fun'"
    romaji: "f"
    audio_hint: "Like English 'f' in 'fun'"
    examples:
      - word: "飞"
        reading: "fēi"
        meaning: { en: "to fly", ja: "飛ぶ", zh: "飛" }
      - word: "饭"
        reading: "fàn"
        meaning: { en: "rice / meal", ja: "ご飯", zh: "飯" }

  - id: d
    char: "d"
    reading: "d as in 'do'"
    romaji: "d"
    audio_hint: "Like English 'd' in 'do', but unaspirated"
    examples:
      - word: "大"
        reading: "dà"
        meaning: { en: "big", ja: "大きい", zh: "大" }
      - word: "的"
        reading: "de"
        meaning: { en: "possessive particle", ja: "の（所有格）", zh: "的" }

  - id: t
    char: "t"
    reading: "t as in 'top'"
    romaji: "t"
    audio_hint: "Like English 't' in 'top', with a puff of air"
    examples:
      - word: "他"
        reading: "tā"
        meaning: { en: "he / him", ja: "彼", zh: "他" }
      - word: "天"
        reading: "tiān"
        meaning: { en: "sky / day", ja: "空／日", zh: "天" }

  - id: "n"
    char: "n"
    reading: "n as in 'no'"
    romaji: "n"
    audio_hint: "Like English 'n' in 'no'"
    examples:
      - word: "你"
        reading: "nǐ"
        meaning: { en: "you", ja: "あなた", zh: "你" }
      - word: "女"
        reading: "nǚ"
        meaning: { en: "woman / female", ja: "女", zh: "女" }

  - id: l
    char: "l"
    reading: "l as in 'love'"
    romaji: "l"
    audio_hint: "Like English 'l' in 'love'"
    examples:
      - word: "老"
        reading: "lǎo"
        meaning: { en: "old", ja: "古い／老いた", zh: "老" }
      - word: "六"
        reading: "liù"
        meaning: { en: "six", ja: "六", zh: "六" }

words: []

grid:
  columns: 4
  groupBy: "row"

matching:
  pairs: 5
  modes:
    - "char_to_reading"
    - "audio_to_char"

quiz:
  questionsPerRound: 8
  xpReward: 15
  questionTypes:
    - "char_to_reading"
    - "reading_to_char"
    - "audio_to_char"
`,Ft=`# Pre-Lesson: Pinyin Finals (Common)
meta:
  id: pinyin-03-finals
  title:
    en: "Pinyin Finals: a, o, e, i, u, ü, ai, ei"
    ja: "ピンイン韻母：a, o, e, i, u, ü, ai, ei"
    zh: "拼音韻母：a, o, e, i, u, ü, ai, ei"
  description:
    en: "Learn the 8 most common pinyin finals"
    ja: "最も一般的な8つのピンイン韻母を学びましょう"
    zh: "學習8個最常見的拼音韻母"
  icon: "a"
  order: 0.3
  level: foundation
  type: pre-lesson
  group:
    en: "Pinyin"
    ja: "ピンイン"
    zh: "拼音"
  estimatedMinutes: 15
  prerequisite: pinyin-02-initials

characters:
  - id: final-a
    char: "a"
    reading: "a as in 'father'"
    romaji: "a"
    audio_hint: "Open mouth wide, like 'ah' at the doctor"
    examples:
      - word: "大"
        reading: "dà"
        meaning: { en: "big", ja: "大きい", zh: "大" }
      - word: "他"
        reading: "tā"
        meaning: { en: "he / him", ja: "彼", zh: "他" }

  - id: final-o
    char: "o"
    reading: "o as in 'more'"
    romaji: "o"
    audio_hint: "Rounded lips, like 'aw' in 'law'"
    examples:
      - word: "多"
        reading: "duō"
        meaning: { en: "many / much", ja: "多い", zh: "多" }
      - word: "我"
        reading: "wǒ"
        meaning: { en: "I / me", ja: "私", zh: "我" }

  - id: final-e
    char: "e"
    reading: "e as in 'duh'"
    romaji: "e"
    audio_hint: "Unrounded, like the 'u' in 'but' — not like English 'e'"
    examples:
      - word: "喝"
        reading: "hē"
        meaning: { en: "to drink", ja: "飲む", zh: "喝" }
      - word: "的"
        reading: "de"
        meaning: { en: "possessive particle", ja: "の（所有格）", zh: "的" }

  - id: final-i
    char: "i"
    reading: "i as in 'see'"
    romaji: "i"
    audio_hint: "Like 'ee' in 'see' — stretch your lips wide"
    examples:
      - word: "你"
        reading: "nǐ"
        meaning: { en: "you", ja: "あなた", zh: "你" }
      - word: "一"
        reading: "yī"
        meaning: { en: "one", ja: "一", zh: "一" }

  - id: final-u
    char: "u"
    reading: "u as in 'food'"
    romaji: "u"
    audio_hint: "Like 'oo' in 'food' — round your lips"
    examples:
      - word: "不"
        reading: "bù"
        meaning: { en: "not / no", ja: "〜ない", zh: "不" }
      - word: "五"
        reading: "wǔ"
        meaning: { en: "five", ja: "五", zh: "五" }

  - id: final-v
    char: "ü"
    reading: "ü as in French 'tu'"
    romaji: "ü"
    audio_hint: "Say 'ee' but round your lips like 'oo' — unique to Chinese"
    examples:
      - word: "女"
        reading: "nǚ"
        meaning: { en: "woman / female", ja: "女", zh: "女" }
      - word: "绿"
        reading: "lǜ"
        meaning: { en: "green", ja: "緑", zh: "綠" }

  - id: final-ai
    char: "ai"
    reading: "ai as in 'eye'"
    romaji: "ai"
    audio_hint: "Like the English word 'eye' — a + i glide"
    examples:
      - word: "爱"
        reading: "ài"
        meaning: { en: "love", ja: "愛", zh: "愛" }
      - word: "太"
        reading: "tài"
        meaning: { en: "too (much)", ja: "〜すぎる", zh: "太" }

  - id: final-ei
    char: "ei"
    reading: "ei as in 'hey'"
    romaji: "ei"
    audio_hint: "Like 'ay' in 'hey' — e + i glide"
    examples:
      - word: "谁"
        reading: "shéi"
        meaning: { en: "who", ja: "誰", zh: "誰" }
      - word: "北"
        reading: "běi"
        meaning: { en: "north", ja: "北", zh: "北" }

words: []

grid:
  columns: 4
  groupBy: "row"

matching:
  pairs: 5
  modes:
    - "char_to_reading"
    - "audio_to_char"

quiz:
  questionsPerRound: 8
  xpReward: 15
  questionTypes:
    - "char_to_reading"
    - "reading_to_char"
    - "audio_to_char"
`;function de(n){return typeof n>"u"||n===null}function Yt(n){return typeof n=="object"&&n!==null}function qt(n){return Array.isArray(n)?n:de(n)?[]:[n]}function Bt(n,e){var t,i,a,o;if(e)for(o=Object.keys(e),t=0,i=o.length;t<i;t+=1)a=o[t],n[a]=e[a];return n}function Ut(n,e){var t="",i;for(i=0;i<e;i+=1)t+=n;return t}function Gt(n){return n===0&&Number.NEGATIVE_INFINITY===1/n}var Kt=de,Vt=Yt,Jt=qt,Xt=Ut,Qt=Gt,$t=Bt,v={isNothing:Kt,isObject:Vt,toArray:Jt,repeat:Xt,isNegativeZero:Qt,extend:$t};function le(n,e){var t="",i=n.reason||"(unknown reason)";return n.mark?(n.mark.name&&(t+='in "'+n.mark.name+'" '),t+="("+(n.mark.line+1)+":"+(n.mark.column+1)+")",!e&&n.mark.snippet&&(t+=`

`+n.mark.snippet),i+" "+t):i}function J(n,e){Error.call(this),this.name="YAMLException",this.reason=n,this.mark=e,this.message=le(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}J.prototype=Object.create(Error.prototype);J.prototype.constructor=J;J.prototype.toString=function(e){return this.name+": "+le(this,e)};var A=J;function un(n,e,t,i,a){var o="",r="",s=Math.floor(a/2)-1;return i-e>s&&(o=" ... ",e=i-s+o.length),t-i>s&&(r=" ...",t=i+s-r.length),{str:o+n.slice(e,t).replace(/\t/g,"→")+r,pos:i-e+o.length}}function pn(n,e){return v.repeat(" ",e-n.length)+n}function Zt(n,e){if(e=Object.create(e||null),!n.buffer)return null;e.maxLength||(e.maxLength=79),typeof e.indent!="number"&&(e.indent=1),typeof e.linesBefore!="number"&&(e.linesBefore=3),typeof e.linesAfter!="number"&&(e.linesAfter=2);for(var t=/\r?\n|\r|\0/g,i=[0],a=[],o,r=-1;o=t.exec(n.buffer);)a.push(o.index),i.push(o.index+o[0].length),n.position<=o.index&&r<0&&(r=i.length-2);r<0&&(r=i.length-1);var s="",h,d,l=Math.min(n.line+e.linesAfter,a.length).toString().length,c=e.maxLength-(e.indent+l+3);for(h=1;h<=e.linesBefore&&!(r-h<0);h++)d=un(n.buffer,i[r-h],a[r-h],n.position-(i[r]-i[r-h]),c),s=v.repeat(" ",e.indent)+pn((n.line-h+1).toString(),l)+" | "+d.str+`
`+s;for(d=un(n.buffer,i[r],a[r],n.position,c),s+=v.repeat(" ",e.indent)+pn((n.line+1).toString(),l)+" | "+d.str+`
`,s+=v.repeat("-",e.indent+l+3+d.pos)+`^
`,h=1;h<=e.linesAfter&&!(r+h>=a.length);h++)d=un(n.buffer,i[r+h],a[r+h],n.position-(i[r]-i[r+h]),c),s+=v.repeat(" ",e.indent)+pn((n.line+h+1).toString(),l)+" | "+d.str+`
`;return s.replace(/\n$/,"")}var ni=Zt,ei=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],ti=["scalar","sequence","mapping"];function ii(n){var e={};return n!==null&&Object.keys(n).forEach(function(t){n[t].forEach(function(i){e[String(i)]=t})}),e}function ai(n,e){if(e=e||{},Object.keys(e).forEach(function(t){if(ei.indexOf(t)===-1)throw new A('Unknown option "'+t+'" is met in definition of "'+n+'" YAML type.')}),this.options=e,this.tag=n,this.kind=e.kind||null,this.resolve=e.resolve||function(){return!0},this.construct=e.construct||function(t){return t},this.instanceOf=e.instanceOf||null,this.predicate=e.predicate||null,this.represent=e.represent||null,this.representName=e.representName||null,this.defaultStyle=e.defaultStyle||null,this.multi=e.multi||!1,this.styleAliases=ii(e.styleAliases||null),ti.indexOf(this.kind)===-1)throw new A('Unknown kind "'+this.kind+'" is specified for "'+n+'" YAML type.')}var b=ai;function qn(n,e){var t=[];return n[e].forEach(function(i){var a=t.length;t.forEach(function(o,r){o.tag===i.tag&&o.kind===i.kind&&o.multi===i.multi&&(a=r)}),t[a]=i}),t}function ri(){var n={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},e,t;function i(a){a.multi?(n.multi[a.kind].push(a),n.multi.fallback.push(a)):n[a.kind][a.tag]=n.fallback[a.tag]=a}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(i);return n}function An(n){return this.extend(n)}An.prototype.extend=function(e){var t=[],i=[];if(e instanceof b)i.push(e);else if(Array.isArray(e))i=i.concat(e);else if(e&&(Array.isArray(e.implicit)||Array.isArray(e.explicit)))e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(i=i.concat(e.explicit));else throw new A("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");t.forEach(function(o){if(!(o instanceof b))throw new A("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(o.loadKind&&o.loadKind!=="scalar")throw new A("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(o.multi)throw new A("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),i.forEach(function(o){if(!(o instanceof b))throw new A("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var a=Object.create(An.prototype);return a.implicit=(this.implicit||[]).concat(t),a.explicit=(this.explicit||[]).concat(i),a.compiledImplicit=qn(a,"implicit"),a.compiledExplicit=qn(a,"explicit"),a.compiledTypeMap=ri(a.compiledImplicit,a.compiledExplicit),a};var ce=An,ue=new b("tag:yaml.org,2002:str",{kind:"scalar",construct:function(n){return n!==null?n:""}}),pe=new b("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(n){return n!==null?n:[]}}),ge=new b("tag:yaml.org,2002:map",{kind:"mapping",construct:function(n){return n!==null?n:{}}}),me=new ce({explicit:[ue,pe,ge]});function oi(n){if(n===null)return!0;var e=n.length;return e===1&&n==="~"||e===4&&(n==="null"||n==="Null"||n==="NULL")}function si(){return null}function hi(n){return n===null}var ze=new b("tag:yaml.org,2002:null",{kind:"scalar",resolve:oi,construct:si,predicate:hi,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function di(n){if(n===null)return!1;var e=n.length;return e===4&&(n==="true"||n==="True"||n==="TRUE")||e===5&&(n==="false"||n==="False"||n==="FALSE")}function li(n){return n==="true"||n==="True"||n==="TRUE"}function ci(n){return Object.prototype.toString.call(n)==="[object Boolean]"}var fe=new b("tag:yaml.org,2002:bool",{kind:"scalar",resolve:di,construct:li,predicate:ci,represent:{lowercase:function(n){return n?"true":"false"},uppercase:function(n){return n?"TRUE":"FALSE"},camelcase:function(n){return n?"True":"False"}},defaultStyle:"lowercase"});function ui(n){return 48<=n&&n<=57||65<=n&&n<=70||97<=n&&n<=102}function pi(n){return 48<=n&&n<=55}function gi(n){return 48<=n&&n<=57}function mi(n){if(n===null)return!1;var e=n.length,t=0,i=!1,a;if(!e)return!1;if(a=n[t],(a==="-"||a==="+")&&(a=n[++t]),a==="0"){if(t+1===e)return!0;if(a=n[++t],a==="b"){for(t++;t<e;t++)if(a=n[t],a!=="_"){if(a!=="0"&&a!=="1")return!1;i=!0}return i&&a!=="_"}if(a==="x"){for(t++;t<e;t++)if(a=n[t],a!=="_"){if(!ui(n.charCodeAt(t)))return!1;i=!0}return i&&a!=="_"}if(a==="o"){for(t++;t<e;t++)if(a=n[t],a!=="_"){if(!pi(n.charCodeAt(t)))return!1;i=!0}return i&&a!=="_"}}if(a==="_")return!1;for(;t<e;t++)if(a=n[t],a!=="_"){if(!gi(n.charCodeAt(t)))return!1;i=!0}return!(!i||a==="_")}function zi(n){var e=n,t=1,i;if(e.indexOf("_")!==-1&&(e=e.replace(/_/g,"")),i=e[0],(i==="-"||i==="+")&&(i==="-"&&(t=-1),e=e.slice(1),i=e[0]),e==="0")return 0;if(i==="0"){if(e[1]==="b")return t*parseInt(e.slice(2),2);if(e[1]==="x")return t*parseInt(e.slice(2),16);if(e[1]==="o")return t*parseInt(e.slice(2),8)}return t*parseInt(e,10)}function fi(n){return Object.prototype.toString.call(n)==="[object Number]"&&n%1===0&&!v.isNegativeZero(n)}var je=new b("tag:yaml.org,2002:int",{kind:"scalar",resolve:mi,construct:zi,predicate:fi,represent:{binary:function(n){return n>=0?"0b"+n.toString(2):"-0b"+n.toString(2).slice(1)},octal:function(n){return n>=0?"0o"+n.toString(8):"-0o"+n.toString(8).slice(1)},decimal:function(n){return n.toString(10)},hexadecimal:function(n){return n>=0?"0x"+n.toString(16).toUpperCase():"-0x"+n.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),ji=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function yi(n){return!(n===null||!ji.test(n)||n[n.length-1]==="_")}function wi(n){var e,t;return e=n.replace(/_/g,"").toLowerCase(),t=e[0]==="-"?-1:1,"+-".indexOf(e[0])>=0&&(e=e.slice(1)),e===".inf"?t===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:e===".nan"?NaN:t*parseFloat(e,10)}var xi=/^[-+]?[0-9]+e/;function vi(n,e){var t;if(isNaN(n))switch(e){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===n)switch(e){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===n)switch(e){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(v.isNegativeZero(n))return"-0.0";return t=n.toString(10),xi.test(t)?t.replace("e",".e"):t}function ki(n){return Object.prototype.toString.call(n)==="[object Number]"&&(n%1!==0||v.isNegativeZero(n))}var ye=new b("tag:yaml.org,2002:float",{kind:"scalar",resolve:yi,construct:wi,predicate:ki,represent:vi,defaultStyle:"lowercase"}),we=me.extend({implicit:[ze,fe,je,ye]}),xe=we,ve=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),ke=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function bi(n){return n===null?!1:ve.exec(n)!==null||ke.exec(n)!==null}function Ii(n){var e,t,i,a,o,r,s,h=0,d=null,l,c,p;if(e=ve.exec(n),e===null&&(e=ke.exec(n)),e===null)throw new Error("Date resolve error");if(t=+e[1],i=+e[2]-1,a=+e[3],!e[4])return new Date(Date.UTC(t,i,a));if(o=+e[4],r=+e[5],s=+e[6],e[7]){for(h=e[7].slice(0,3);h.length<3;)h+="0";h=+h}return e[9]&&(l=+e[10],c=+(e[11]||0),d=(l*60+c)*6e4,e[9]==="-"&&(d=-d)),p=new Date(Date.UTC(t,i,a,o,r,s,h)),d&&p.setTime(p.getTime()-d),p}function _i(n){return n.toISOString()}var be=new b("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:bi,construct:Ii,instanceOf:Date,represent:_i});function Ai(n){return n==="<<"||n===null}var Ie=new b("tag:yaml.org,2002:merge",{kind:"scalar",resolve:Ai}),Pn=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function Si(n){if(n===null)return!1;var e,t,i=0,a=n.length,o=Pn;for(t=0;t<a;t++)if(e=o.indexOf(n.charAt(t)),!(e>64)){if(e<0)return!1;i+=6}return i%8===0}function Ti(n){var e,t,i=n.replace(/[\r\n=]/g,""),a=i.length,o=Pn,r=0,s=[];for(e=0;e<a;e++)e%4===0&&e&&(s.push(r>>16&255),s.push(r>>8&255),s.push(r&255)),r=r<<6|o.indexOf(i.charAt(e));return t=a%4*6,t===0?(s.push(r>>16&255),s.push(r>>8&255),s.push(r&255)):t===18?(s.push(r>>10&255),s.push(r>>2&255)):t===12&&s.push(r>>4&255),new Uint8Array(s)}function Ci(n){var e="",t=0,i,a,o=n.length,r=Pn;for(i=0;i<o;i++)i%3===0&&i&&(e+=r[t>>18&63],e+=r[t>>12&63],e+=r[t>>6&63],e+=r[t&63]),t=(t<<8)+n[i];return a=o%3,a===0?(e+=r[t>>18&63],e+=r[t>>12&63],e+=r[t>>6&63],e+=r[t&63]):a===2?(e+=r[t>>10&63],e+=r[t>>4&63],e+=r[t<<2&63],e+=r[64]):a===1&&(e+=r[t>>2&63],e+=r[t<<4&63],e+=r[64],e+=r[64]),e}function Ei(n){return Object.prototype.toString.call(n)==="[object Uint8Array]"}var _e=new b("tag:yaml.org,2002:binary",{kind:"scalar",resolve:Si,construct:Ti,predicate:Ei,represent:Ci}),Li=Object.prototype.hasOwnProperty,Pi=Object.prototype.toString;function Di(n){if(n===null)return!0;var e=[],t,i,a,o,r,s=n;for(t=0,i=s.length;t<i;t+=1){if(a=s[t],r=!1,Pi.call(a)!=="[object Object]")return!1;for(o in a)if(Li.call(a,o))if(!r)r=!0;else return!1;if(!r)return!1;if(e.indexOf(o)===-1)e.push(o);else return!1}return!0}function Mi(n){return n!==null?n:[]}var Ae=new b("tag:yaml.org,2002:omap",{kind:"sequence",resolve:Di,construct:Mi}),Ri=Object.prototype.toString;function Oi(n){if(n===null)return!0;var e,t,i,a,o,r=n;for(o=new Array(r.length),e=0,t=r.length;e<t;e+=1){if(i=r[e],Ri.call(i)!=="[object Object]"||(a=Object.keys(i),a.length!==1))return!1;o[e]=[a[0],i[a[0]]]}return!0}function Ni(n){if(n===null)return[];var e,t,i,a,o,r=n;for(o=new Array(r.length),e=0,t=r.length;e<t;e+=1)i=r[e],a=Object.keys(i),o[e]=[a[0],i[a[0]]];return o}var Se=new b("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:Oi,construct:Ni}),Hi=Object.prototype.hasOwnProperty;function Wi(n){if(n===null)return!0;var e,t=n;for(e in t)if(Hi.call(t,e)&&t[e]!==null)return!1;return!0}function Fi(n){return n!==null?n:{}}var Te=new b("tag:yaml.org,2002:set",{kind:"mapping",resolve:Wi,construct:Fi}),Dn=xe.extend({implicit:[be,Ie],explicit:[_e,Ae,Se,Te]}),N=Object.prototype.hasOwnProperty,an=1,Ce=2,Ee=3,rn=4,gn=1,Yi=2,Bn=3,qi=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Bi=/[\x85\u2028\u2029]/,Ui=/[,\[\]\{\}]/,Le=/^(?:!|!!|![a-z\-]+!)$/i,Pe=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Un(n){return Object.prototype.toString.call(n)}function L(n){return n===10||n===13}function W(n){return n===9||n===32}function S(n){return n===9||n===32||n===10||n===13}function q(n){return n===44||n===91||n===93||n===123||n===125}function Gi(n){var e;return 48<=n&&n<=57?n-48:(e=n|32,97<=e&&e<=102?e-97+10:-1)}function Ki(n){return n===120?2:n===117?4:n===85?8:0}function Vi(n){return 48<=n&&n<=57?n-48:-1}function Gn(n){return n===48?"\0":n===97?"\x07":n===98?"\b":n===116||n===9?"	":n===110?`
`:n===118?"\v":n===102?"\f":n===114?"\r":n===101?"\x1B":n===32?" ":n===34?'"':n===47?"/":n===92?"\\":n===78?"":n===95?" ":n===76?"\u2028":n===80?"\u2029":""}function Ji(n){return n<=65535?String.fromCharCode(n):String.fromCharCode((n-65536>>10)+55296,(n-65536&1023)+56320)}function De(n,e,t){e==="__proto__"?Object.defineProperty(n,e,{configurable:!0,enumerable:!0,writable:!0,value:t}):n[e]=t}var Me=new Array(256),Re=new Array(256);for(var F=0;F<256;F++)Me[F]=Gn(F)?1:0,Re[F]=Gn(F);function Xi(n,e){this.input=n,this.filename=e.filename||null,this.schema=e.schema||Dn,this.onWarning=e.onWarning||null,this.legacy=e.legacy||!1,this.json=e.json||!1,this.listener=e.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=n.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function Oe(n,e){var t={name:n.filename,buffer:n.input.slice(0,-1),position:n.position,line:n.line,column:n.position-n.lineStart};return t.snippet=ni(t),new A(e,t)}function g(n,e){throw Oe(n,e)}function on(n,e){n.onWarning&&n.onWarning.call(null,Oe(n,e))}var Kn={YAML:function(e,t,i){var a,o,r;e.version!==null&&g(e,"duplication of %YAML directive"),i.length!==1&&g(e,"YAML directive accepts exactly one argument"),a=/^([0-9]+)\.([0-9]+)$/.exec(i[0]),a===null&&g(e,"ill-formed argument of the YAML directive"),o=parseInt(a[1],10),r=parseInt(a[2],10),o!==1&&g(e,"unacceptable YAML version of the document"),e.version=i[0],e.checkLineBreaks=r<2,r!==1&&r!==2&&on(e,"unsupported YAML version of the document")},TAG:function(e,t,i){var a,o;i.length!==2&&g(e,"TAG directive accepts exactly two arguments"),a=i[0],o=i[1],Le.test(a)||g(e,"ill-formed tag handle (first argument) of the TAG directive"),N.call(e.tagMap,a)&&g(e,'there is a previously declared suffix for "'+a+'" tag handle'),Pe.test(o)||g(e,"ill-formed tag prefix (second argument) of the TAG directive");try{o=decodeURIComponent(o)}catch{g(e,"tag prefix is malformed: "+o)}e.tagMap[a]=o}};function O(n,e,t,i){var a,o,r,s;if(e<t){if(s=n.input.slice(e,t),i)for(a=0,o=s.length;a<o;a+=1)r=s.charCodeAt(a),r===9||32<=r&&r<=1114111||g(n,"expected valid JSON character");else qi.test(s)&&g(n,"the stream contains non-printable characters");n.result+=s}}function Vn(n,e,t,i){var a,o,r,s;for(v.isObject(t)||g(n,"cannot merge mappings; the provided source object is unacceptable"),a=Object.keys(t),r=0,s=a.length;r<s;r+=1)o=a[r],N.call(e,o)||(De(e,o,t[o]),i[o]=!0)}function B(n,e,t,i,a,o,r,s,h){var d,l;if(Array.isArray(a))for(a=Array.prototype.slice.call(a),d=0,l=a.length;d<l;d+=1)Array.isArray(a[d])&&g(n,"nested arrays are not supported inside keys"),typeof a=="object"&&Un(a[d])==="[object Object]"&&(a[d]="[object Object]");if(typeof a=="object"&&Un(a)==="[object Object]"&&(a="[object Object]"),a=String(a),e===null&&(e={}),i==="tag:yaml.org,2002:merge")if(Array.isArray(o))for(d=0,l=o.length;d<l;d+=1)Vn(n,e,o[d],t);else Vn(n,e,o,t);else!n.json&&!N.call(t,a)&&N.call(e,a)&&(n.line=r||n.line,n.lineStart=s||n.lineStart,n.position=h||n.position,g(n,"duplicated mapping key")),De(e,a,o),delete t[a];return e}function Mn(n){var e;e=n.input.charCodeAt(n.position),e===10?n.position++:e===13?(n.position++,n.input.charCodeAt(n.position)===10&&n.position++):g(n,"a line break is expected"),n.line+=1,n.lineStart=n.position,n.firstTabInLine=-1}function x(n,e,t){for(var i=0,a=n.input.charCodeAt(n.position);a!==0;){for(;W(a);)a===9&&n.firstTabInLine===-1&&(n.firstTabInLine=n.position),a=n.input.charCodeAt(++n.position);if(e&&a===35)do a=n.input.charCodeAt(++n.position);while(a!==10&&a!==13&&a!==0);if(L(a))for(Mn(n),a=n.input.charCodeAt(n.position),i++,n.lineIndent=0;a===32;)n.lineIndent++,a=n.input.charCodeAt(++n.position);else break}return t!==-1&&i!==0&&n.lineIndent<t&&on(n,"deficient indentation"),i}function dn(n){var e=n.position,t;return t=n.input.charCodeAt(e),!!((t===45||t===46)&&t===n.input.charCodeAt(e+1)&&t===n.input.charCodeAt(e+2)&&(e+=3,t=n.input.charCodeAt(e),t===0||S(t)))}function Rn(n,e){e===1?n.result+=" ":e>1&&(n.result+=v.repeat(`
`,e-1))}function Qi(n,e,t){var i,a,o,r,s,h,d,l,c=n.kind,p=n.result,u;if(u=n.input.charCodeAt(n.position),S(u)||q(u)||u===35||u===38||u===42||u===33||u===124||u===62||u===39||u===34||u===37||u===64||u===96||(u===63||u===45)&&(a=n.input.charCodeAt(n.position+1),S(a)||t&&q(a)))return!1;for(n.kind="scalar",n.result="",o=r=n.position,s=!1;u!==0;){if(u===58){if(a=n.input.charCodeAt(n.position+1),S(a)||t&&q(a))break}else if(u===35){if(i=n.input.charCodeAt(n.position-1),S(i))break}else{if(n.position===n.lineStart&&dn(n)||t&&q(u))break;if(L(u))if(h=n.line,d=n.lineStart,l=n.lineIndent,x(n,!1,-1),n.lineIndent>=e){s=!0,u=n.input.charCodeAt(n.position);continue}else{n.position=r,n.line=h,n.lineStart=d,n.lineIndent=l;break}}s&&(O(n,o,r,!1),Rn(n,n.line-h),o=r=n.position,s=!1),W(u)||(r=n.position+1),u=n.input.charCodeAt(++n.position)}return O(n,o,r,!1),n.result?!0:(n.kind=c,n.result=p,!1)}function $i(n,e){var t,i,a;if(t=n.input.charCodeAt(n.position),t!==39)return!1;for(n.kind="scalar",n.result="",n.position++,i=a=n.position;(t=n.input.charCodeAt(n.position))!==0;)if(t===39)if(O(n,i,n.position,!0),t=n.input.charCodeAt(++n.position),t===39)i=n.position,n.position++,a=n.position;else return!0;else L(t)?(O(n,i,a,!0),Rn(n,x(n,!1,e)),i=a=n.position):n.position===n.lineStart&&dn(n)?g(n,"unexpected end of the document within a single quoted scalar"):(n.position++,a=n.position);g(n,"unexpected end of the stream within a single quoted scalar")}function Zi(n,e){var t,i,a,o,r,s;if(s=n.input.charCodeAt(n.position),s!==34)return!1;for(n.kind="scalar",n.result="",n.position++,t=i=n.position;(s=n.input.charCodeAt(n.position))!==0;){if(s===34)return O(n,t,n.position,!0),n.position++,!0;if(s===92){if(O(n,t,n.position,!0),s=n.input.charCodeAt(++n.position),L(s))x(n,!1,e);else if(s<256&&Me[s])n.result+=Re[s],n.position++;else if((r=Ki(s))>0){for(a=r,o=0;a>0;a--)s=n.input.charCodeAt(++n.position),(r=Gi(s))>=0?o=(o<<4)+r:g(n,"expected hexadecimal character");n.result+=Ji(o),n.position++}else g(n,"unknown escape sequence");t=i=n.position}else L(s)?(O(n,t,i,!0),Rn(n,x(n,!1,e)),t=i=n.position):n.position===n.lineStart&&dn(n)?g(n,"unexpected end of the document within a double quoted scalar"):(n.position++,i=n.position)}g(n,"unexpected end of the stream within a double quoted scalar")}function na(n,e){var t=!0,i,a,o,r=n.tag,s,h=n.anchor,d,l,c,p,u,j=Object.create(null),y,m,z,f;if(f=n.input.charCodeAt(n.position),f===91)l=93,u=!1,s=[];else if(f===123)l=125,u=!0,s={};else return!1;for(n.anchor!==null&&(n.anchorMap[n.anchor]=s),f=n.input.charCodeAt(++n.position);f!==0;){if(x(n,!0,e),f=n.input.charCodeAt(n.position),f===l)return n.position++,n.tag=r,n.anchor=h,n.kind=u?"mapping":"sequence",n.result=s,!0;t?f===44&&g(n,"expected the node content, but found ','"):g(n,"missed comma between flow collection entries"),m=y=z=null,c=p=!1,f===63&&(d=n.input.charCodeAt(n.position+1),S(d)&&(c=p=!0,n.position++,x(n,!0,e))),i=n.line,a=n.lineStart,o=n.position,U(n,e,an,!1,!0),m=n.tag,y=n.result,x(n,!0,e),f=n.input.charCodeAt(n.position),(p||n.line===i)&&f===58&&(c=!0,f=n.input.charCodeAt(++n.position),x(n,!0,e),U(n,e,an,!1,!0),z=n.result),u?B(n,s,j,m,y,z,i,a,o):c?s.push(B(n,null,j,m,y,z,i,a,o)):s.push(y),x(n,!0,e),f=n.input.charCodeAt(n.position),f===44?(t=!0,f=n.input.charCodeAt(++n.position)):t=!1}g(n,"unexpected end of the stream within a flow collection")}function ea(n,e){var t,i,a=gn,o=!1,r=!1,s=e,h=0,d=!1,l,c;if(c=n.input.charCodeAt(n.position),c===124)i=!1;else if(c===62)i=!0;else return!1;for(n.kind="scalar",n.result="";c!==0;)if(c=n.input.charCodeAt(++n.position),c===43||c===45)gn===a?a=c===43?Bn:Yi:g(n,"repeat of a chomping mode identifier");else if((l=Vi(c))>=0)l===0?g(n,"bad explicit indentation width of a block scalar; it cannot be less than one"):r?g(n,"repeat of an indentation width identifier"):(s=e+l-1,r=!0);else break;if(W(c)){do c=n.input.charCodeAt(++n.position);while(W(c));if(c===35)do c=n.input.charCodeAt(++n.position);while(!L(c)&&c!==0)}for(;c!==0;){for(Mn(n),n.lineIndent=0,c=n.input.charCodeAt(n.position);(!r||n.lineIndent<s)&&c===32;)n.lineIndent++,c=n.input.charCodeAt(++n.position);if(!r&&n.lineIndent>s&&(s=n.lineIndent),L(c)){h++;continue}if(n.lineIndent<s){a===Bn?n.result+=v.repeat(`
`,o?1+h:h):a===gn&&o&&(n.result+=`
`);break}for(i?W(c)?(d=!0,n.result+=v.repeat(`
`,o?1+h:h)):d?(d=!1,n.result+=v.repeat(`
`,h+1)):h===0?o&&(n.result+=" "):n.result+=v.repeat(`
`,h):n.result+=v.repeat(`
`,o?1+h:h),o=!0,r=!0,h=0,t=n.position;!L(c)&&c!==0;)c=n.input.charCodeAt(++n.position);O(n,t,n.position,!1)}return!0}function Jn(n,e){var t,i=n.tag,a=n.anchor,o=[],r,s=!1,h;if(n.firstTabInLine!==-1)return!1;for(n.anchor!==null&&(n.anchorMap[n.anchor]=o),h=n.input.charCodeAt(n.position);h!==0&&(n.firstTabInLine!==-1&&(n.position=n.firstTabInLine,g(n,"tab characters must not be used in indentation")),!(h!==45||(r=n.input.charCodeAt(n.position+1),!S(r))));){if(s=!0,n.position++,x(n,!0,-1)&&n.lineIndent<=e){o.push(null),h=n.input.charCodeAt(n.position);continue}if(t=n.line,U(n,e,Ee,!1,!0),o.push(n.result),x(n,!0,-1),h=n.input.charCodeAt(n.position),(n.line===t||n.lineIndent>e)&&h!==0)g(n,"bad indentation of a sequence entry");else if(n.lineIndent<e)break}return s?(n.tag=i,n.anchor=a,n.kind="sequence",n.result=o,!0):!1}function ta(n,e,t){var i,a,o,r,s,h,d=n.tag,l=n.anchor,c={},p=Object.create(null),u=null,j=null,y=null,m=!1,z=!1,f;if(n.firstTabInLine!==-1)return!1;for(n.anchor!==null&&(n.anchorMap[n.anchor]=c),f=n.input.charCodeAt(n.position);f!==0;){if(!m&&n.firstTabInLine!==-1&&(n.position=n.firstTabInLine,g(n,"tab characters must not be used in indentation")),i=n.input.charCodeAt(n.position+1),o=n.line,(f===63||f===58)&&S(i))f===63?(m&&(B(n,c,p,u,j,null,r,s,h),u=j=y=null),z=!0,m=!0,a=!0):m?(m=!1,a=!0):g(n,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),n.position+=1,f=i;else{if(r=n.line,s=n.lineStart,h=n.position,!U(n,t,Ce,!1,!0))break;if(n.line===o){for(f=n.input.charCodeAt(n.position);W(f);)f=n.input.charCodeAt(++n.position);if(f===58)f=n.input.charCodeAt(++n.position),S(f)||g(n,"a whitespace character is expected after the key-value separator within a block mapping"),m&&(B(n,c,p,u,j,null,r,s,h),u=j=y=null),z=!0,m=!1,a=!1,u=n.tag,j=n.result;else if(z)g(n,"can not read an implicit mapping pair; a colon is missed");else return n.tag=d,n.anchor=l,!0}else if(z)g(n,"can not read a block mapping entry; a multiline key may not be an implicit key");else return n.tag=d,n.anchor=l,!0}if((n.line===o||n.lineIndent>e)&&(m&&(r=n.line,s=n.lineStart,h=n.position),U(n,e,rn,!0,a)&&(m?j=n.result:y=n.result),m||(B(n,c,p,u,j,y,r,s,h),u=j=y=null),x(n,!0,-1),f=n.input.charCodeAt(n.position)),(n.line===o||n.lineIndent>e)&&f!==0)g(n,"bad indentation of a mapping entry");else if(n.lineIndent<e)break}return m&&B(n,c,p,u,j,null,r,s,h),z&&(n.tag=d,n.anchor=l,n.kind="mapping",n.result=c),z}function ia(n){var e,t=!1,i=!1,a,o,r;if(r=n.input.charCodeAt(n.position),r!==33)return!1;if(n.tag!==null&&g(n,"duplication of a tag property"),r=n.input.charCodeAt(++n.position),r===60?(t=!0,r=n.input.charCodeAt(++n.position)):r===33?(i=!0,a="!!",r=n.input.charCodeAt(++n.position)):a="!",e=n.position,t){do r=n.input.charCodeAt(++n.position);while(r!==0&&r!==62);n.position<n.length?(o=n.input.slice(e,n.position),r=n.input.charCodeAt(++n.position)):g(n,"unexpected end of the stream within a verbatim tag")}else{for(;r!==0&&!S(r);)r===33&&(i?g(n,"tag suffix cannot contain exclamation marks"):(a=n.input.slice(e-1,n.position+1),Le.test(a)||g(n,"named tag handle cannot contain such characters"),i=!0,e=n.position+1)),r=n.input.charCodeAt(++n.position);o=n.input.slice(e,n.position),Ui.test(o)&&g(n,"tag suffix cannot contain flow indicator characters")}o&&!Pe.test(o)&&g(n,"tag name cannot contain such characters: "+o);try{o=decodeURIComponent(o)}catch{g(n,"tag name is malformed: "+o)}return t?n.tag=o:N.call(n.tagMap,a)?n.tag=n.tagMap[a]+o:a==="!"?n.tag="!"+o:a==="!!"?n.tag="tag:yaml.org,2002:"+o:g(n,'undeclared tag handle "'+a+'"'),!0}function aa(n){var e,t;if(t=n.input.charCodeAt(n.position),t!==38)return!1;for(n.anchor!==null&&g(n,"duplication of an anchor property"),t=n.input.charCodeAt(++n.position),e=n.position;t!==0&&!S(t)&&!q(t);)t=n.input.charCodeAt(++n.position);return n.position===e&&g(n,"name of an anchor node must contain at least one character"),n.anchor=n.input.slice(e,n.position),!0}function ra(n){var e,t,i;if(i=n.input.charCodeAt(n.position),i!==42)return!1;for(i=n.input.charCodeAt(++n.position),e=n.position;i!==0&&!S(i)&&!q(i);)i=n.input.charCodeAt(++n.position);return n.position===e&&g(n,"name of an alias node must contain at least one character"),t=n.input.slice(e,n.position),N.call(n.anchorMap,t)||g(n,'unidentified alias "'+t+'"'),n.result=n.anchorMap[t],x(n,!0,-1),!0}function U(n,e,t,i,a){var o,r,s,h=1,d=!1,l=!1,c,p,u,j,y,m;if(n.listener!==null&&n.listener("open",n),n.tag=null,n.anchor=null,n.kind=null,n.result=null,o=r=s=rn===t||Ee===t,i&&x(n,!0,-1)&&(d=!0,n.lineIndent>e?h=1:n.lineIndent===e?h=0:n.lineIndent<e&&(h=-1)),h===1)for(;ia(n)||aa(n);)x(n,!0,-1)?(d=!0,s=o,n.lineIndent>e?h=1:n.lineIndent===e?h=0:n.lineIndent<e&&(h=-1)):s=!1;if(s&&(s=d||a),(h===1||rn===t)&&(an===t||Ce===t?y=e:y=e+1,m=n.position-n.lineStart,h===1?s&&(Jn(n,m)||ta(n,m,y))||na(n,y)?l=!0:(r&&ea(n,y)||$i(n,y)||Zi(n,y)?l=!0:ra(n)?(l=!0,(n.tag!==null||n.anchor!==null)&&g(n,"alias node should not have any properties")):Qi(n,y,an===t)&&(l=!0,n.tag===null&&(n.tag="?")),n.anchor!==null&&(n.anchorMap[n.anchor]=n.result)):h===0&&(l=s&&Jn(n,m))),n.tag===null)n.anchor!==null&&(n.anchorMap[n.anchor]=n.result);else if(n.tag==="?"){for(n.result!==null&&n.kind!=="scalar"&&g(n,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+n.kind+'"'),c=0,p=n.implicitTypes.length;c<p;c+=1)if(j=n.implicitTypes[c],j.resolve(n.result)){n.result=j.construct(n.result),n.tag=j.tag,n.anchor!==null&&(n.anchorMap[n.anchor]=n.result);break}}else if(n.tag!=="!"){if(N.call(n.typeMap[n.kind||"fallback"],n.tag))j=n.typeMap[n.kind||"fallback"][n.tag];else for(j=null,u=n.typeMap.multi[n.kind||"fallback"],c=0,p=u.length;c<p;c+=1)if(n.tag.slice(0,u[c].tag.length)===u[c].tag){j=u[c];break}j||g(n,"unknown tag !<"+n.tag+">"),n.result!==null&&j.kind!==n.kind&&g(n,"unacceptable node kind for !<"+n.tag+'> tag; it should be "'+j.kind+'", not "'+n.kind+'"'),j.resolve(n.result,n.tag)?(n.result=j.construct(n.result,n.tag),n.anchor!==null&&(n.anchorMap[n.anchor]=n.result)):g(n,"cannot resolve a node with !<"+n.tag+"> explicit tag")}return n.listener!==null&&n.listener("close",n),n.tag!==null||n.anchor!==null||l}function oa(n){var e=n.position,t,i,a,o=!1,r;for(n.version=null,n.checkLineBreaks=n.legacy,n.tagMap=Object.create(null),n.anchorMap=Object.create(null);(r=n.input.charCodeAt(n.position))!==0&&(x(n,!0,-1),r=n.input.charCodeAt(n.position),!(n.lineIndent>0||r!==37));){for(o=!0,r=n.input.charCodeAt(++n.position),t=n.position;r!==0&&!S(r);)r=n.input.charCodeAt(++n.position);for(i=n.input.slice(t,n.position),a=[],i.length<1&&g(n,"directive name must not be less than one character in length");r!==0;){for(;W(r);)r=n.input.charCodeAt(++n.position);if(r===35){do r=n.input.charCodeAt(++n.position);while(r!==0&&!L(r));break}if(L(r))break;for(t=n.position;r!==0&&!S(r);)r=n.input.charCodeAt(++n.position);a.push(n.input.slice(t,n.position))}r!==0&&Mn(n),N.call(Kn,i)?Kn[i](n,i,a):on(n,'unknown document directive "'+i+'"')}if(x(n,!0,-1),n.lineIndent===0&&n.input.charCodeAt(n.position)===45&&n.input.charCodeAt(n.position+1)===45&&n.input.charCodeAt(n.position+2)===45?(n.position+=3,x(n,!0,-1)):o&&g(n,"directives end mark is expected"),U(n,n.lineIndent-1,rn,!1,!0),x(n,!0,-1),n.checkLineBreaks&&Bi.test(n.input.slice(e,n.position))&&on(n,"non-ASCII line breaks are interpreted as content"),n.documents.push(n.result),n.position===n.lineStart&&dn(n)){n.input.charCodeAt(n.position)===46&&(n.position+=3,x(n,!0,-1));return}if(n.position<n.length-1)g(n,"end of the stream or a document separator is expected");else return}function Ne(n,e){n=String(n),e=e||{},n.length!==0&&(n.charCodeAt(n.length-1)!==10&&n.charCodeAt(n.length-1)!==13&&(n+=`
`),n.charCodeAt(0)===65279&&(n=n.slice(1)));var t=new Xi(n,e),i=n.indexOf("\0");for(i!==-1&&(t.position=i,g(t,"null byte is not allowed in input")),t.input+="\0";t.input.charCodeAt(t.position)===32;)t.lineIndent+=1,t.position+=1;for(;t.position<t.length-1;)oa(t);return t.documents}function sa(n,e,t){e!==null&&typeof e=="object"&&typeof t>"u"&&(t=e,e=null);var i=Ne(n,t);if(typeof e!="function")return i;for(var a=0,o=i.length;a<o;a+=1)e(i[a])}function ha(n,e){var t=Ne(n,e);if(t.length!==0){if(t.length===1)return t[0];throw new A("expected a single document in the stream, but found more")}}var da=sa,la=ha,He={loadAll:da,load:la},We=Object.prototype.toString,Fe=Object.prototype.hasOwnProperty,On=65279,ca=9,X=10,ua=13,pa=32,ga=33,ma=34,Sn=35,za=37,fa=38,ja=39,ya=42,Ye=44,wa=45,sn=58,xa=61,va=62,ka=63,ba=64,qe=91,Be=93,Ia=96,Ue=123,_a=124,Ge=125,_={};_[0]="\\0";_[7]="\\a";_[8]="\\b";_[9]="\\t";_[10]="\\n";_[11]="\\v";_[12]="\\f";_[13]="\\r";_[27]="\\e";_[34]='\\"';_[92]="\\\\";_[133]="\\N";_[160]="\\_";_[8232]="\\L";_[8233]="\\P";var Aa=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],Sa=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function Ta(n,e){var t,i,a,o,r,s,h;if(e===null)return{};for(t={},i=Object.keys(e),a=0,o=i.length;a<o;a+=1)r=i[a],s=String(e[r]),r.slice(0,2)==="!!"&&(r="tag:yaml.org,2002:"+r.slice(2)),h=n.compiledTypeMap.fallback[r],h&&Fe.call(h.styleAliases,s)&&(s=h.styleAliases[s]),t[r]=s;return t}function Ca(n){var e,t,i;if(e=n.toString(16).toUpperCase(),n<=255)t="x",i=2;else if(n<=65535)t="u",i=4;else if(n<=4294967295)t="U",i=8;else throw new A("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+t+v.repeat("0",i-e.length)+e}var Ea=1,Q=2;function La(n){this.schema=n.schema||Dn,this.indent=Math.max(1,n.indent||2),this.noArrayIndent=n.noArrayIndent||!1,this.skipInvalid=n.skipInvalid||!1,this.flowLevel=v.isNothing(n.flowLevel)?-1:n.flowLevel,this.styleMap=Ta(this.schema,n.styles||null),this.sortKeys=n.sortKeys||!1,this.lineWidth=n.lineWidth||80,this.noRefs=n.noRefs||!1,this.noCompatMode=n.noCompatMode||!1,this.condenseFlow=n.condenseFlow||!1,this.quotingType=n.quotingType==='"'?Q:Ea,this.forceQuotes=n.forceQuotes||!1,this.replacer=typeof n.replacer=="function"?n.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Xn(n,e){for(var t=v.repeat(" ",e),i=0,a=-1,o="",r,s=n.length;i<s;)a=n.indexOf(`
`,i),a===-1?(r=n.slice(i),i=s):(r=n.slice(i,a+1),i=a+1),r.length&&r!==`
`&&(o+=t),o+=r;return o}function Tn(n,e){return`
`+v.repeat(" ",n.indent*e)}function Pa(n,e){var t,i,a;for(t=0,i=n.implicitTypes.length;t<i;t+=1)if(a=n.implicitTypes[t],a.resolve(e))return!0;return!1}function hn(n){return n===pa||n===ca}function $(n){return 32<=n&&n<=126||161<=n&&n<=55295&&n!==8232&&n!==8233||57344<=n&&n<=65533&&n!==On||65536<=n&&n<=1114111}function Qn(n){return $(n)&&n!==On&&n!==ua&&n!==X}function $n(n,e,t){var i=Qn(n),a=i&&!hn(n);return(t?i:i&&n!==Ye&&n!==qe&&n!==Be&&n!==Ue&&n!==Ge)&&n!==Sn&&!(e===sn&&!a)||Qn(e)&&!hn(e)&&n===Sn||e===sn&&a}function Da(n){return $(n)&&n!==On&&!hn(n)&&n!==wa&&n!==ka&&n!==sn&&n!==Ye&&n!==qe&&n!==Be&&n!==Ue&&n!==Ge&&n!==Sn&&n!==fa&&n!==ya&&n!==ga&&n!==_a&&n!==xa&&n!==va&&n!==ja&&n!==ma&&n!==za&&n!==ba&&n!==Ia}function Ma(n){return!hn(n)&&n!==sn}function V(n,e){var t=n.charCodeAt(e),i;return t>=55296&&t<=56319&&e+1<n.length&&(i=n.charCodeAt(e+1),i>=56320&&i<=57343)?(t-55296)*1024+i-56320+65536:t}function Ke(n){var e=/^\n* /;return e.test(n)}var Ve=1,Cn=2,Je=3,Xe=4,Y=5;function Ra(n,e,t,i,a,o,r,s){var h,d=0,l=null,c=!1,p=!1,u=i!==-1,j=-1,y=Da(V(n,0))&&Ma(V(n,n.length-1));if(e||r)for(h=0;h<n.length;d>=65536?h+=2:h++){if(d=V(n,h),!$(d))return Y;y=y&&$n(d,l,s),l=d}else{for(h=0;h<n.length;d>=65536?h+=2:h++){if(d=V(n,h),d===X)c=!0,u&&(p=p||h-j-1>i&&n[j+1]!==" ",j=h);else if(!$(d))return Y;y=y&&$n(d,l,s),l=d}p=p||u&&h-j-1>i&&n[j+1]!==" "}return!c&&!p?y&&!r&&!a(n)?Ve:o===Q?Y:Cn:t>9&&Ke(n)?Y:r?o===Q?Y:Cn:p?Xe:Je}function Oa(n,e,t,i,a){n.dump=(function(){if(e.length===0)return n.quotingType===Q?'""':"''";if(!n.noCompatMode&&(Aa.indexOf(e)!==-1||Sa.test(e)))return n.quotingType===Q?'"'+e+'"':"'"+e+"'";var o=n.indent*Math.max(1,t),r=n.lineWidth===-1?-1:Math.max(Math.min(n.lineWidth,40),n.lineWidth-o),s=i||n.flowLevel>-1&&t>=n.flowLevel;function h(d){return Pa(n,d)}switch(Ra(e,s,n.indent,r,h,n.quotingType,n.forceQuotes&&!i,a)){case Ve:return e;case Cn:return"'"+e.replace(/'/g,"''")+"'";case Je:return"|"+Zn(e,n.indent)+ne(Xn(e,o));case Xe:return">"+Zn(e,n.indent)+ne(Xn(Na(e,r),o));case Y:return'"'+Ha(e)+'"';default:throw new A("impossible error: invalid scalar style")}})()}function Zn(n,e){var t=Ke(n)?String(e):"",i=n[n.length-1]===`
`,a=i&&(n[n.length-2]===`
`||n===`
`),o=a?"+":i?"":"-";return t+o+`
`}function ne(n){return n[n.length-1]===`
`?n.slice(0,-1):n}function Na(n,e){for(var t=/(\n+)([^\n]*)/g,i=(function(){var d=n.indexOf(`
`);return d=d!==-1?d:n.length,t.lastIndex=d,ee(n.slice(0,d),e)})(),a=n[0]===`
`||n[0]===" ",o,r;r=t.exec(n);){var s=r[1],h=r[2];o=h[0]===" ",i+=s+(!a&&!o&&h!==""?`
`:"")+ee(h,e),a=o}return i}function ee(n,e){if(n===""||n[0]===" ")return n;for(var t=/ [^ ]/g,i,a=0,o,r=0,s=0,h="";i=t.exec(n);)s=i.index,s-a>e&&(o=r>a?r:s,h+=`
`+n.slice(a,o),a=o+1),r=s;return h+=`
`,n.length-a>e&&r>a?h+=n.slice(a,r)+`
`+n.slice(r+1):h+=n.slice(a),h.slice(1)}function Ha(n){for(var e="",t=0,i,a=0;a<n.length;t>=65536?a+=2:a++)t=V(n,a),i=_[t],!i&&$(t)?(e+=n[a],t>=65536&&(e+=n[a+1])):e+=i||Ca(t);return e}function Wa(n,e,t){var i="",a=n.tag,o,r,s;for(o=0,r=t.length;o<r;o+=1)s=t[o],n.replacer&&(s=n.replacer.call(t,String(o),s)),(P(n,e,s,!1,!1)||typeof s>"u"&&P(n,e,null,!1,!1))&&(i!==""&&(i+=","+(n.condenseFlow?"":" ")),i+=n.dump);n.tag=a,n.dump="["+i+"]"}function te(n,e,t,i){var a="",o=n.tag,r,s,h;for(r=0,s=t.length;r<s;r+=1)h=t[r],n.replacer&&(h=n.replacer.call(t,String(r),h)),(P(n,e+1,h,!0,!0,!1,!0)||typeof h>"u"&&P(n,e+1,null,!0,!0,!1,!0))&&((!i||a!=="")&&(a+=Tn(n,e)),n.dump&&X===n.dump.charCodeAt(0)?a+="-":a+="- ",a+=n.dump);n.tag=o,n.dump=a||"[]"}function Fa(n,e,t){var i="",a=n.tag,o=Object.keys(t),r,s,h,d,l;for(r=0,s=o.length;r<s;r+=1)l="",i!==""&&(l+=", "),n.condenseFlow&&(l+='"'),h=o[r],d=t[h],n.replacer&&(d=n.replacer.call(t,h,d)),P(n,e,h,!1,!1)&&(n.dump.length>1024&&(l+="? "),l+=n.dump+(n.condenseFlow?'"':"")+":"+(n.condenseFlow?"":" "),P(n,e,d,!1,!1)&&(l+=n.dump,i+=l));n.tag=a,n.dump="{"+i+"}"}function Ya(n,e,t,i){var a="",o=n.tag,r=Object.keys(t),s,h,d,l,c,p;if(n.sortKeys===!0)r.sort();else if(typeof n.sortKeys=="function")r.sort(n.sortKeys);else if(n.sortKeys)throw new A("sortKeys must be a boolean or a function");for(s=0,h=r.length;s<h;s+=1)p="",(!i||a!=="")&&(p+=Tn(n,e)),d=r[s],l=t[d],n.replacer&&(l=n.replacer.call(t,d,l)),P(n,e+1,d,!0,!0,!0)&&(c=n.tag!==null&&n.tag!=="?"||n.dump&&n.dump.length>1024,c&&(n.dump&&X===n.dump.charCodeAt(0)?p+="?":p+="? "),p+=n.dump,c&&(p+=Tn(n,e)),P(n,e+1,l,!0,c)&&(n.dump&&X===n.dump.charCodeAt(0)?p+=":":p+=": ",p+=n.dump,a+=p));n.tag=o,n.dump=a||"{}"}function ie(n,e,t){var i,a,o,r,s,h;for(a=t?n.explicitTypes:n.implicitTypes,o=0,r=a.length;o<r;o+=1)if(s=a[o],(s.instanceOf||s.predicate)&&(!s.instanceOf||typeof e=="object"&&e instanceof s.instanceOf)&&(!s.predicate||s.predicate(e))){if(t?s.multi&&s.representName?n.tag=s.representName(e):n.tag=s.tag:n.tag="?",s.represent){if(h=n.styleMap[s.tag]||s.defaultStyle,We.call(s.represent)==="[object Function]")i=s.represent(e,h);else if(Fe.call(s.represent,h))i=s.represent[h](e,h);else throw new A("!<"+s.tag+'> tag resolver accepts not "'+h+'" style');n.dump=i}return!0}return!1}function P(n,e,t,i,a,o,r){n.tag=null,n.dump=t,ie(n,t,!1)||ie(n,t,!0);var s=We.call(n.dump),h=i,d;i&&(i=n.flowLevel<0||n.flowLevel>e);var l=s==="[object Object]"||s==="[object Array]",c,p;if(l&&(c=n.duplicates.indexOf(t),p=c!==-1),(n.tag!==null&&n.tag!=="?"||p||n.indent!==2&&e>0)&&(a=!1),p&&n.usedDuplicates[c])n.dump="*ref_"+c;else{if(l&&p&&!n.usedDuplicates[c]&&(n.usedDuplicates[c]=!0),s==="[object Object]")i&&Object.keys(n.dump).length!==0?(Ya(n,e,n.dump,a),p&&(n.dump="&ref_"+c+n.dump)):(Fa(n,e,n.dump),p&&(n.dump="&ref_"+c+" "+n.dump));else if(s==="[object Array]")i&&n.dump.length!==0?(n.noArrayIndent&&!r&&e>0?te(n,e-1,n.dump,a):te(n,e,n.dump,a),p&&(n.dump="&ref_"+c+n.dump)):(Wa(n,e,n.dump),p&&(n.dump="&ref_"+c+" "+n.dump));else if(s==="[object String]")n.tag!=="?"&&Oa(n,n.dump,e,o,h);else{if(s==="[object Undefined]")return!1;if(n.skipInvalid)return!1;throw new A("unacceptable kind of an object to dump "+s)}n.tag!==null&&n.tag!=="?"&&(d=encodeURI(n.tag[0]==="!"?n.tag.slice(1):n.tag).replace(/!/g,"%21"),n.tag[0]==="!"?d="!"+d:d.slice(0,18)==="tag:yaml.org,2002:"?d="!!"+d.slice(18):d="!<"+d+">",n.dump=d+" "+n.dump)}return!0}function qa(n,e){var t=[],i=[],a,o;for(En(n,t,i),a=0,o=i.length;a<o;a+=1)e.duplicates.push(t[i[a]]);e.usedDuplicates=new Array(o)}function En(n,e,t){var i,a,o;if(n!==null&&typeof n=="object")if(a=e.indexOf(n),a!==-1)t.indexOf(a)===-1&&t.push(a);else if(e.push(n),Array.isArray(n))for(a=0,o=n.length;a<o;a+=1)En(n[a],e,t);else for(i=Object.keys(n),a=0,o=i.length;a<o;a+=1)En(n[i[a]],e,t)}function Ba(n,e){e=e||{};var t=new La(e);t.noRefs||qa(n,t);var i=n;return t.replacer&&(i=t.replacer.call({"":i},"",i)),P(t,0,i,!0,!0)?t.dump+`
`:""}var Ua=Ba,Ga={dump:Ua};function Nn(n,e){return function(){throw new Error("Function yaml."+n+" is removed in js-yaml 4. Use yaml."+e+" instead, which is now safe by default.")}}var Ka=b,Va=ce,Ja=me,Xa=we,Qa=xe,$a=Dn,Za=He.load,nr=He.loadAll,er=Ga.dump,tr=A,ir={binary:_e,float:ye,map:ge,null:ze,pairs:Se,set:Te,timestamp:be,bool:fe,int:je,merge:Ie,omap:Ae,seq:pe,str:ue},ar=Nn("safeLoad","load"),rr=Nn("safeLoadAll","loadAll"),or=Nn("safeDump","dump"),sr={Type:Ka,Schema:Va,FAILSAFE_SCHEMA:Ja,JSON_SCHEMA:Xa,CORE_SCHEMA:Qa,DEFAULT_SCHEMA:$a,load:Za,loadAll:nr,dump:er,YAMLException:tr,types:ir,safeLoad:ar,safeLoadAll:rr,safeDump:or};const hr=Object.assign({"./chapters/en/beginner/city-and-transportation.yml":st,"./chapters/en/beginner/clothes-and-shopping.yml":ht,"./chapters/en/beginner/family-and-friends.yml":dt,"./chapters/en/beginner/food-and-eating.yml":lt,"./chapters/en/beginner/health-and-body.yml":ct,"./chapters/en/beginner/hobbies-and-free-time.yml":ut,"./chapters/en/beginner/home-and-living.yml":pt,"./chapters/en/beginner/morning-routine.yml":gt,"./chapters/en/beginner/time-and-schedules.yml":mt,"./chapters/en/beginner/weather-and-seasons.yml":zt,"./chapters/en/intermediate/03-future-and-plans.yml":ft,"./chapters/en/intermediate/04-experiences-and-achievements.yml":jt,"./chapters/en/intermediate/05-travel-problems.yml":yt,"./chapters/en/intermediate/06-opinions-and-disagreement.yml":wt,"./chapters/en/intermediate/07-describing-personality.yml":xt,"./chapters/en/intermediate/08-entertainment-and-reviews.yml":vt,"./chapters/en/intermediate/identity-and-background.yml":kt,"./chapters/en/intermediate/telling-stories.yml":bt,"./chapters/ja/beginner/comprehension-check.yml":It,"./chapters/ja/beginner/me-and-you.yml":_t,"./chapters/ja/beginner/me-you-and-professionals.yml":At,"./chapters/ja/beginner/mixed-practice-dialogue-flow.yml":St,"./chapters/ja/beginner/negative-not-x.yml":Tt,"./chapters/ja/beginner/shadowing-speed-rhythm.yml":Ct,"./chapters/ja/beginner/stating-facts.yml":Et,"./chapters/ja/beginner/yes-no-questions.yml":Lt,"./chapters/ja/foundation/hiragana-01-vowels-k.yml":Pt,"./chapters/ja/foundation/hiragana-02-s-t.yml":Dt,"./chapters/ja/foundation/hiragana-03-n-h.yml":Mt,"./chapters/ja/foundation/hiragana-04-m-y-r-w.yml":Rt,"./chapters/ja/foundation/hiragana-05-dakuten.yml":Ot,"./chapters/ja/intermediate/discussing-movies.yml":Nt,"./chapters/zh/foundation/pinyin-01-tones.yml":Ht,"./chapters/zh/foundation/pinyin-02-initials.yml":Wt,"./chapters/zh/foundation/pinyin-03-finals.yml":Ft});function dr(n){try{return sr.load(n)}catch(e){return console.error("Failed to parse chapter YAML:",e),null}}function lr(n){const e=n.match(/\.\/chapters\/([a-z]{2})\//);return e?e[1]:null}function cr(n,e,t="en"){return n?.words?n.words.map((i,a)=>{const o=i.word[e]||i.word.en,r=i.word[t]||i.word.en;return{id:`${n.meta.id}_${i.id}`,word:o,nativeWord:r,meaning:i.description[e]||i.description.en,nativeMeaning:i.description[t]||i.description.en,example:i.sentence[e]||i.sentence.en,nativeExample:i.sentence[t]||i.sentence.en,phonetic:e==="en"?i.phonetic:void 0,reading:e==="ja"?i.reading:void 0}}):[]}function ur(){const n={};for(const[e,t]of Object.entries(hr)){const i=lr(e);if(!i)continue;const a=dr(t);a?.meta&&(a.meta.targetLanguage=i,n[i]||(n[i]=[]),n[i].push(a))}for(const e of Object.keys(n))n[e].sort((t,i)=>(t.meta.order||999)-(i.meta.order||999));return n}let mn=null;function pr(){return mn||(mn=ur()),mn}function Qe(n="ja"){return pr()[n]||[]}function $e(n="ja",e="en"){return Qe(n).map(i=>({id:i.meta.id,title:i.meta.title[e]||i.meta.title.en,description:i.meta.description[e]||i.meta.description.en,icon:i.meta.icon,level:i.meta.level,type:i.meta.type||"chapter",targetLanguage:i.meta.targetLanguage,wordCount:i.words?.length||0,characterCount:i.characters?.length||0,order:i.meta.order}))}function gr(n="ja",e="beginner",t="en"){return $e(n,t).filter(i=>i.level===e)}function Hn(n,e="ja"){return Qe(e).find(i=>i.meta.id===n)}function br(n,e="ja",t="en"){const i=Hn(n,e);return i?cr(i,e,t):[]}function Ir(n,e="ja",t="en"){const i=Hn(n,e);return i?.chat?.conversations?i.chat.conversations.map(a=>({id:a.id,title:a.title[e]||a.title.en,messages:a.messages.map(o=>({role:o.role,text:o.text[e]||o.text.en,nativeText:o.text[t]||o.text.en}))})):[]}function ae(n="ja",e="en"){return $e(n,e).filter(t=>t.level==="foundation")}function _r(n,e="ja",t="en"){const i=Hn(n,e);return i?.characters?i.characters.map(a=>({id:`${i.meta.id}_${a.id}`,char:a.char,reading:a.reading,romaji:a.romaji,strokeCount:a.stroke_count,mnemonic:a.mnemonic?.[t]||a.mnemonic?.en,audioHint:a.audio_hint,tone:a.tone,toneDescription:a.tone_description?.[t]||a.tone_description?.en,row:a.row,examples:(a.examples||[]).map(o=>({word:o.word,reading:o.reading,meaning:o.meaning[t]||o.meaning.en}))})):[]}const Ze="chatmate_learningProgress",re={chapters:{},stats:{totalQuizzesPassed:0,totalConversationsCompleted:0}};function mr(){try{const n=localStorage.getItem(Ze);return n?JSON.parse(n):{...re}}catch(n){return console.error("Failed to load learning progress:",n),{...re}}}function zr(n){try{localStorage.setItem(Ze,JSON.stringify(n))}catch(e){console.error("Failed to save learning progress:",e)}}const T=E(mr());function oe(n){return T.value.chapters[n]||(T.value.chapters[n]={quizCompleted:!1,quizScore:0,quizBestScore:0,conversationCompleted:!1}),T.value.chapters[n]}function zn(){zr(T.value)}function fr(){function n(d,l,c){const p=oe(d),u=Math.round(l/c*100);return u>p.quizBestScore&&(p.quizBestScore=u),p.quizScore=u,u>=60&&!p.quizCompleted&&(p.quizCompleted=!0,T.value.stats.totalQuizzesPassed++),zn(),{percentage:u,passed:u>=60}}function e(d){return T.value.chapters[d]?.quizCompleted||!1}function t(d){return T.value.chapters[d]?.quizBestScore||0}function i(d){const l=oe(d);l.conversationCompleted||(l.conversationCompleted=!0,T.value.stats.totalConversationsCompleted++,zn())}function a(d){return T.value.chapters[d]?.conversationCompleted||!1}function o(d){const l=T.value.chapters[d];return l?l.quizCompleted&&l.conversationCompleted:!1}function r(d){const l=T.value.chapters[d];return l?{quiz:l.quizCompleted,conversation:l.conversationCompleted,complete:l.quizCompleted&&l.conversationCompleted,quizBestScore:l.quizBestScore||0}:{quiz:!1,conversation:!1,complete:!1,quizBestScore:0}}const s=R(()=>T.value.stats);function h(){T.value={chapters:{},stats:{totalQuizzesPassed:0,totalConversationsCompleted:0}},zn()}return{markQuizCompleted:n,isQuizCompleted:e,getQuizBestScore:t,markConversationCompleted:i,isConversationCompleted:a,isChapterCompleted:o,getChapterCompletionStatus:r,stats:s,resetProgress:h}}const nt="chatmate_preLessonProgress",nn={lessons:{},stats:{totalCharactersLearned:0,totalPreLessonsCompleted:0}};function jr(){try{const n=localStorage.getItem(nt);return n?JSON.parse(n):{...nn,stats:{...nn.stats},lessons:{}}}catch(n){return console.error("Failed to load pre-lesson progress:",n),{...nn,stats:{...nn.stats},lessons:{}}}}function yr(n){try{localStorage.setItem(nt,JSON.stringify(n))}catch(e){console.error("Failed to save pre-lesson progress:",e)}}const I=E(jr());let fn=null;function jn(n){return I.value.lessons[n]||(I.value.lessons[n]={charactersLearned:[],quizCompleted:!1,quizBestScore:0,matchingCompleted:!1}),I.value.lessons[n]}function en(){yr(I.value)}function wr(){function n(m,z){const f=jn(m);f.charactersLearned.includes(z)||(f.charactersLearned.push(z),I.value.stats.totalCharactersLearned++,en(),fn&&fn(m,z))}function e(m,z){return I.value.lessons[m]?.charactersLearned?.includes(z)||!1}function t(m){return I.value.lessons[m]?.charactersLearned||[]}function i(m,z,f){if(f===0)return{percentage:0,passed:!1};const H=jn(m),D=Math.round(z/f*100);if(D>H.quizBestScore&&(H.quizBestScore=D),D>=70){const G=!H.quizCompleted;H.quizCompleted=!0,G&&d()}return en(),{percentage:D,passed:D>=70}}function a(m){return I.value.lessons[m]?.quizCompleted||!1}function o(m){return I.value.lessons[m]?.quizBestScore||0}function r(m){const z=jn(m);z.matchingCompleted||(z.matchingCompleted=!0,en())}function s(m){return I.value.lessons[m]?.matchingCompleted||!1}function h(m){const z=I.value.lessons[m];return z?z.quizCompleted:!1}function d(){const m=Object.values(I.value.lessons).filter(z=>z.quizCompleted).length;I.value.stats.totalPreLessonsCompleted=m}function l(m="ja"){const z=ae(m);return z.length===0?!0:z.every(f=>h(f.id))}function c(m="ja"){const{getChapterCompletionStatus:z}=fr();return gr(m,"beginner").some(G=>{const k=z(G.id);return k.quiz||k.conversation})||ae(m).length===0?!1:!l(m)}function p(m){const z=I.value.lessons[m];return z?{charactersLearned:z.charactersLearned.length,quizCompleted:z.quizCompleted,quizBestScore:z.quizBestScore,matchingCompleted:z.matchingCompleted,complete:z.quizCompleted}:{charactersLearned:0,quizCompleted:!1,quizBestScore:0,matchingCompleted:!1,complete:!1}}const u=R(()=>I.value.stats);function j(){I.value={lessons:{},stats:{totalCharactersLearned:0,totalPreLessonsCompleted:0}},en()}function y(m){fn=m}return{markCharacterLearned:n,isCharacterLearned:e,getLearnedCharacters:t,markQuizCompleted:i,isQuizCompleted:a,getQuizBestScore:o,markMatchingCompleted:r,isMatchingCompleted:s,isPreLessonCompleted:h,arePreLessonsComplete:l,areChaptersLocked:c,getLessonStatus:p,stats:u,setOnCharacterLearnedCallback:y,resetProgress:j}}const et="chatmate_userProgress";function Ln(){return{totalXP:0,messagesSent:0,messagesReceived:0,articlesStarted:[],articlesCompleted:[],currentStreak:0,longestStreak:0,lastActiveDate:null,totalSessionMinutes:0,wordsLearned:[],characterStats:{},claimedMilestones:[],unlockedAchievements:[],diaryEntries:0,diaryStreak:0,longestDiaryStreak:0,diaryVocabUsed:0,hasWrittenLongEntry:!1,lastDiaryDate:null}}function xr(){try{const n=localStorage.getItem(et);if(n)return{...Ln(),...JSON.parse(n)}}catch{}return Ln()}const w=E(xr());let yn=!1;function C(){yn||(yn=!0,queueMicrotask(()=>{localStorage.setItem(et,JSON.stringify(w.value)),yn=!1}))}let se=!1;function Ar(){const{stats:n,setOnCharacterLearnedCallback:e}=wr();w.value.preLessonStats=n.value,se||(se=!0,it(n,k=>{w.value.preLessonStats=k},{deep:!0}));const{currentRank:t,nextRank:i,xpToNextRank:a,progressToNextRank:o,addXP:r,dismissLevelUp:s,getAllRanks:h}=at(w,C),{updateStreak:d,dismissStreakMilestone:l}=rt(w,C,r,Z),{unlockedAchievements:c,lockedAchievements:p,checkAchievements:u,dismissAchievementUnlock:j}=ot(w,C);e(()=>{r(2,"characterLearned"),w.value.preLessonStats=n.value,C(),u()});function y(){d(),w.value.messagesSent+=1,r(Z.userMessage,"userMessage"),C(),u()}function m(){w.value.messagesReceived+=1,r(Z.systemMessage,"systemMessage"),C(),u()}function z(k){w.value.articlesStarted.includes(k)||(w.value.articlesStarted.push(k),C())}function f(k){w.value.wordsLearned.includes(k)||(w.value.wordsLearned.push(k),C())}function H(k){w.value.characterStats[k]||(w.value.characterStats[k]={messages:0}),w.value.characterStats[k].messages+=1,C()}function D({wordCount:k=0,vocabWordsUsed:Wn=0}={}){const Fn=new Date().toDateString(),Yn=w.value.lastDiaryDate;if(Yn===Fn){k>=200&&(w.value.hasWrittenLongEntry=!0),C(),u();return}w.value.diaryEntries+=1;{const ln=new Date;ln.setDate(ln.getDate()-1),Yn===ln.toDateString()?w.value.diaryStreak+=1:w.value.diaryStreak=1,w.value.lastDiaryDate=Fn}w.value.diaryStreak>w.value.longestDiaryStreak&&(w.value.longestDiaryStreak=w.value.diaryStreak),Wn>0&&(w.value.diaryVocabUsed+=Wn),k>=200&&(w.value.hasWrittenLongEntry=!0),C(),u()}function G(){w.value=Ln(),C()}return{progress:w,recentXPGain:wn,showLevelUp:xn,newRank:vn,showStreakMilestone:kn,currentMilestone:bn,showAchievementUnlock:In,newAchievement:_n,currentRank:t,nextRank:i,xpToNextRank:a,progressToNextRank:o,unlockedAchievements:c,lockedAchievements:p,addXP:r,onMessageSent:y,onMessageReceived:m,onArticleStarted:z,onWordLearned:f,trackCharacterInteraction:H,onDiarySubmitted:D,dismissLevelUp:s,dismissStreakMilestone:l,dismissAchievementUnlock:j,checkAchievements:u,getAllRanks:h,resetProgress:G,RANKS:K,XP_REWARDS:Z,STREAK_MILESTONES:he,ACHIEVEMENTS:tn}}export{kr as a,fr as b,wr as c,gr as d,br as e,_r as f,ae as g,Ir as h,Ar as u};
