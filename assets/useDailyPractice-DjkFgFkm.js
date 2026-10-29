import{u as j}from"./useSRS-OZRGCeTK.js";import{y as S}from"./js-yaml-BccGX7PZ.js";import{f as h,l as H}from"./index-D9g2hrIo.js";const A=`level: advanced
patterns:
  - id: it-could-be-argued
    pack: opinion
    pattern: "It could be argued that ..."
    meaning: "或許可以說……／有人會認為……"
    when: "想提出一個看法但不想說得太死，或要先擺出一個論點再討論時用；語氣比 I think 更客觀、更正式。"
    examples:
      - en: "It could be argued that working from a café is more productive than working at home, at least for people who get distracted easily."
        zh: "或許可以說在咖啡廳工作比在家更有效率，至少對容易分心的人來說是這樣。"
      - en: "It could be argued that the delay actually helped us, since we caught two major bugs before launch."
        zh: "或許可以說這次延期反而幫了我們，因為我們在上線前抓到了兩個重大 bug。"
    choice:
      situation: "在提案會議上，你想提出「縮短會議其實會提高效率」這個看法，但不想聽起來像在下結論。"
      options:
        - "Shorter meetings are better. Everyone knows that."
        - "It could be argued that shorter meetings would actually make us more productive."
        - "It could be argue that shorter meeting is more efficiency."
      answer: 1
      explain: "第一句太武斷，「大家都知道」等於否定別人的看法；第三句 argue 要用過去分詞 argued，meeting 要用複數，efficiency 是名詞，這裡要用形容詞 efficient。"
    task: "用這個句型提出看法：社群媒體讓人更孤單，而不是更有連結。"
    match: ["could be argued"]
    mistake:
      wrong: "It could be argue that ..."
      right: "It could be argued that ..."
      why: "這是被動結構 could be + 過去分詞；中文動詞不變形，很容易漏掉 -ed。"

  - id: inclined-to-think
    pack: opinion
    pattern: "I'm inclined to think ..."
    meaning: "我傾向認為……"
    when: "表達一個經過思考、但仍保留彈性的看法；比 I think 更謹慎，適合正式討論或給建議時。"
    examples:
      - en: "I'm inclined to think we should skip the hotel breakfast and find a local place instead."
        zh: "我傾向認為我們應該跳過飯店早餐，改去找在地的店吃。"
      - en: "I'm inclined to think the drop in sign-ups has more to do with pricing than with the new design."
        zh: "我傾向認為註冊數下滑跟定價的關係比較大，跟新設計比較無關。"
    choice:
      situation: "主管問你產品要不要延後上線，你偏向延後，但想保留討論空間。"
      options:
        - "I'm incline to think delay is better."
        - "We must delay. There is no other choice."
        - "I'm inclined to think a short delay would be safer, but I'm open to other views."
      answer: 2
      explain: "第一句 incline 要用 inclined，而且 delay is better 太籠統；第二句語氣太強硬，把討論空間都關掉了。"
    task: "用這個句型回答：朋友問你下次出國要選日本還是韓國。"
    match: ["inclined to"]
    mistake:
      wrong: "I'm incline to think ..."
      right: "I'm inclined to think ..."
      why: "be inclined to 是固定搭配，inclined 是形容詞，不能用原形動詞 incline。"

  - id: from-where-i-stand
    pack: opinion
    pattern: "From where I stand, ..."
    meaning: "從我的角度／立場來看，……"
    when: "強調這是你自己位置上看到的狀況（例如你的部門、你的經驗），暗示別人的角度可能不同，語氣客氣。"
    examples:
      - en: "From where I stand, moving closer to your office would make your life a lot easier."
        zh: "從我的角度來看，搬到離公司近一點會讓你的生活輕鬆很多。"
      - en: "From where I stand, the support team is already stretched too thin to take on another product."
        zh: "從我的立場來看，客服團隊人力已經很吃緊，沒辦法再多接一個產品。"
    choice:
      situation: "業務部想加快出貨速度，你是倉儲主管，想從你的角度說明現有人力不夠。"
      options:
        - "From where I stand, we'd need at least two more people to keep up with faster shipping."
        - "From my standing, we need more people."
        - "Your idea is impossible because we don't have people."
      answer: 0
      explain: "第二句 from my standing 不是英文慣用說法；第三句直接說 impossible 太衝，也沒說清楚是從誰的角度看。"
    task: "用這個句型回應：同事說「遠端工作對大家都比較好」，但你負責帶新人。"
    match: ["from where i stand"]

  - id: granted-but
    pack: disagree
    pattern: "Granted, ..., but ..."
    meaning: "沒錯，……，但是……"
    when: "先承認對方說得有道理的部分，再提出更重要的反面考量，討論和寫作都常用。"
    examples:
      - en: "Granted, the new place is smaller, but we'd save almost an hour of commuting every day."
        zh: "沒錯，新的地方比較小，但我們每天可以省下將近一小時的通勤。"
      - en: "Granted, the vendor is cheaper, but their support team only works in a different time zone."
        zh: "沒錯，這家廠商比較便宜，但他們的客服只在不同時區上班。"
    choice:
      situation: "會議上同事說新工具太貴，你承認價格高，但想強調它能省很多人力。"
      options:
        - "Although it is expensive, but it can save manpower."
        - "Granted, it's not cheap, but it would save us roughly two days of manual work a week."
        - "You are wrong, it saves time."
      answer: 1
      explain: "第一句 although…but 重複；第三句太直接，像在吵架。"
    task: "用這個句型回應：朋友說「在家煮飯太花時間，不如每天外食」。"
    match: ["granted", "but"]
    mistake:
      wrong: "Although it is expensive, but ..."
      right: "Granted, it's expensive, but ... / Although it's expensive, ..."
      why: "中文「雖然…但是…」成對，英文只能留一個。"

  - id: fair-point-though
    pack: disagree
    pattern: "That's a fair point, though ..."
    meaning: "你說得有道理，不過……"
    when: "先真心肯定對方的觀點，再補上一個你在意的考量；though 放在句中，語氣比 but 更輕。"
    examples:
      - en: "That's a fair point, though a bigger apartment also means higher rent and more cleaning."
        zh: "你說得有道理，不過大一點的公寓也代表房租更高、打掃更累。"
      - en: "That's a fair point, though I'd want to see the numbers before we commit to a second office."
        zh: "你說得有道理，不過在決定開第二間辦公室之前，我想先看到數字。"
    choice:
      situation: "同事建議把客服外包來省錢，你覺得有道理，但擔心服務品質。"
      options:
        - "That's a fair point, but though I worry quality."
        - "Fair point. Bad idea, though."
        - "That's a fair point, though I'd be a bit worried about how it might affect service quality."
      answer: 2
      explain: "第一句 but 和 though 重複，worry 後面也少了 about；第二句先說 fair point 又馬上說 bad idea，聽起來很敷衍。"
    task: "用這個句型回應：朋友說「買電動車比較環保，你應該換一台」。"
    match: ["fair point", "though"]
    mistake:
      wrong: "That's a fair point, but though ..."
      right: "That's a fair point, though ... / That's a fair point, but ..."
      why: "but 和 though 都是轉折；中文「但是不過」可以疊著講，英文只能選一個。"

  - id: while-i-take-your-point
    pack: disagree
    pattern: "While I take your point, ..."
    meaning: "雖然我理解你的意思，……"
    when: "正式場合表示「我聽懂你的論點了」，接著提出不同看法；比 I see what you're saying 更正式。"
    examples:
      - en: "While I take your point about saving money, I'd rather not spend our only vacation sleeping in a hostel."
        zh: "雖然我理解你想省錢，但我不太想把我們唯一的假期花在睡青年旅館。"
      - en: "While I take your point about speed, rushing the audit could cost us far more later."
        zh: "雖然我理解你重視速度，但匆忙做稽核之後可能讓我們付出更大的代價。"
    choice:
      situation: "董事會上有人主張全面刪減行銷預算，你理解他的考量，但想正式地提出反對。"
      options:
        - "While I take your point, but cutting marketing is dangerous."
        - "While I take your point about costs, cutting marketing entirely could slow our growth next year."
        - "I take your point. No."
      answer: 1
      explain: "第一句 while 和 but 重複；第三句太短太硬，在董事會上很失禮。"
    task: "用這個句型回應：家人說「你應該找個穩定的工作，不要創業」。"
    match: ["take your point"]
    mistake:
      wrong: "While I take your point, but ..."
      right: "While I take your point, ..."
      why: "while 已經是「雖然」，後面不能再接 but，跟「雖然…但是…」是同一個陷阱。"

  - id: main-reason-being
    pack: opinion
    pattern: "..., the main reason being ..."
    meaning: "……，主要原因是……"
    when: "先說結論，再用一個片語補上最主要的理由，句子緊湊，口說和書面都適合。"
    examples:
      - en: "We ended up staying in, the main reason being that it was pouring all afternoon."
        zh: "我們最後待在家，主要原因是整個下午都在下大雨。"
      - en: "I'd recommend the second vendor, the main reason being their track record with banks."
        zh: "我會推薦第二家廠商，主要原因是他們和銀行合作的實績。"
    choice:
      situation: "主管問你為什麼選 B 方案，你想先講結論，再補上主要原因是成本比較低。"
      options:
        - "I'd go with Plan B, the main reason being that it costs about thirty percent less."
        - "I'd go with Plan B, the main reason is being cheaper."
        - "Because Plan B is cheaper, so I choose it."
      answer: 0
      explain: "第二句 the main reason is being 文法錯，這個句型是 reason being + 名詞或 that 子句；第三句 because…so 重複。"
    task: "用這個句型說明：你為什麼最近開始早起。"
    match: ["reason being"]
    mistake:
      wrong: "Because it's cheaper, so I chose it."
      right: "I chose it, the main reason being that it's cheaper."
      why: "中文「因為…所以…」成對，英文只能留一個；用 the main reason being 還可以先講結論。"

  - id: given-that
    pack: opinion
    pattern: "Given that ..., ..."
    meaning: "考慮到……／既然……"
    when: "把一個已知事實當作推論的前提，再帶出結論；比 because 更有「理性推論」的味道。"
    examples:
      - en: "Given that it's your first marathon, I'd aim to finish rather than chase a time."
        zh: "考慮到這是你第一次跑全馬，我會以完賽為目標，而不是追求成績。"
      - en: "Given that the client changed the scope twice, the original deadline is no longer realistic."
        zh: "考慮到客戶已經改了兩次範圍，原本的截止日已經不切實際了。"
    choice:
      situation: "團隊預算剛被砍了兩成，你想以此為前提，建議先暫停一個次要專案。"
      options:
        - "Given the budget was cut, so we should pause."
        - "The budget was cut. Pause the project now."
        - "Given that our budget has just been cut by twenty percent, it might make sense to pause the side project."
      answer: 2
      explain: "第一句 given…so 重複，等於中文「既然…所以…」；第二句是命令語氣，對團隊說太硬。"
    task: "用這個句型給建議：朋友下個月要搬家，但工作正忙。"
    match: ["given that"]
    mistake:
      wrong: "Given that the budget was cut, so ..."
      right: "Given that the budget was cut, we should ..."
      why: "given that 已經表示前提，後面不用再加 so。"

  - id: which-is-precisely-why
    pack: opinion
    pattern: "..., which is precisely why ..."
    meaning: "……，這正是為什麼……"
    when: "把對方剛提到的事實（或你剛說的點）直接變成支持你論點的理由，論證力很強。"
    examples:
      - en: "Rents in the city keep going up, which is precisely why we started looking in the suburbs."
        zh: "市區房租一直漲，這正是我們開始往郊區找房子的原因。"
      - en: "Our users are mostly on mobile, which is precisely why the app needs to load in under two seconds."
        zh: "我們的使用者大多用手機，這正是為什麼 app 必須在兩秒內載入。"
    choice:
      situation: "同事說「客戶都很忙，沒時間看長報告」，你想順勢說這正是你主張做一頁摘要的原因。"
      options:
        - "Yes, that's why. So we should make one page."
        - "Exactly, which is precisely why I'm suggesting a one-page summary."
        - "Exactly, which precisely is the reason why I suggest summary."
      answer: 1
      explain: "第一句意思到了但很零碎，沒有把對方的話變成你的論點；第三句語序不自然，summary 前面也少了冠詞。"
    task: "用這個句型回應：朋友說「最近工作壓力好大，週末都在睡覺」。"
    match: ["precisely why"]

  - id: not-to-mention
    pack: opinion
    pattern: "..., not to mention ..."
    meaning: "……，更不用說……"
    when: "列完一個理由後，再補一個更有分量的理由，加強說服力；後面接名詞或 V-ing。"
    examples:
      - en: "Cooking at home is cheaper, not to mention a lot healthier."
        zh: "在家煮比較便宜，更不用說健康多了。"
      - en: "Switching providers would take months, not to mention the cost of retraining everyone."
        zh: "換供應商要花好幾個月，更不用說重新訓練所有人的成本。"
    choice:
      situation: "你想說服主管升級舊系統：它很慢，更不用說還有資安風險。"
      options:
        - "The old system is slow, not to mention the security risks it exposes us to."
        - "The old system is slow, not mention about the security risks."
        - "The old system is slow and bad and dangerous."
      answer: 0
      explain: "第二句少了 to，mention 後面也不加 about；第三句只是堆形容詞，聽起來不專業也沒說服力。"
    task: "用這個句型說服朋友：一起去學游泳。"
    match: ["not to mention"]
    mistake:
      wrong: "not to mention about ..."
      right: "not to mention ..."
      why: "mention 是及物動詞，直接接受詞；中文「提到關於」會讓人多加 about。"

  - id: would-it-be-worth
    pack: suggest
    pattern: "Would it be worth + V-ing ...?"
    meaning: "……會不會值得一試？／要不要考慮……？"
    when: "用問句委婉提議，讓對方覺得是一起評估，而不是你在下指令。"
    examples:
      - en: "Would it be worth booking the tickets now, before the prices go up?"
        zh: "要不要趁漲價前先把票訂起來？"
      - en: "Would it be worth running a small pilot before we roll this out to every branch?"
        zh: "在推到所有分店之前，先做個小規模試行會不會比較值得？"
    choice:
      situation: "你想委婉建議主管：發布前先找幾位真實用戶測試。"
      options:
        - "We have to test with real users first."
        - "Would it be worth to test with users?"
        - "Would it be worth getting a few real users to try it before we launch?"
      answer: 2
      explain: "第一句 have to 聽起來像命令；第二句 worth 後面要接 V-ing，不是 to V。"
    task: "用這個句型向室友提議：換一家網路業者。"
    match: ["would it be worth"]
    mistake:
      wrong: "Would it be worth to test ...?"
      right: "Would it be worth testing ...?"
      why: "worth 後面接名詞或 V-ing；中文「值得去做」會讓人直覺用 to V。"

  - id: i-wonder-if-we-might
    pack: suggest
    pattern: "I wonder if we might ..."
    meaning: "不知道我們是否可以……"
    when: "非常委婉的提議，適合對上級、客戶或敏感話題；把建議包裝成自己的思考。"
    examples:
      - en: "I wonder if we might leave a bit earlier, just in case the traffic is bad."
        zh: "不知道我們是不是可以早一點出發，以防塞車。"
      - en: "I wonder if we might revisit the timeline once we hear back from legal."
        zh: "不知道我們是否可以等法務回覆後，再重新檢視時程。"
    choice:
      situation: "客戶堅持下週上線，你想很客氣地提議分兩階段上線。"
      options:
        - "I wonder if we might consider a two-phase launch, so the core features still go live next week."
        - "I wonder if we might to launch in two phases."
        - "You should launch in two phases, it's better."
      answer: 0
      explain: "第二句 might 後面直接接原形動詞，不加 to；第三句用 you should 對客戶說太直接，像在教對方做事。"
    task: "用這個句型向家人提議：今年過年不回老家，改成出去玩。"
    match: ["wonder if"]
    mistake:
      wrong: "I wonder if we might to ..."
      right: "I wonder if we might ..."
      why: "might 是助動詞，後面直接接原形動詞。"

  - id: what-it-comes-down-to
    pack: clarify
    pattern: "What it comes down to is ..."
    meaning: "說到底，關鍵就是……"
    when: "討論很久之後，把複雜的問題收斂成一個核心，幫大家聚焦。"
    examples:
      - en: "What it comes down to is whether you'd rather have more space or a shorter commute."
        zh: "說到底，關鍵就是你比較想要大一點的空間，還是短一點的通勤。"
      - en: "What it comes down to is trust: if the client doesn't trust our data, nothing else matters."
        zh: "說到底關鍵就是信任：如果客戶不信任我們的數據，其他都不重要。"
    choice:
      situation: "大家討論了一小時要不要換系統，你想把重點收斂成「團隊現在有沒有時間學新工具」。"
      options:
        - "In conclusion, the point is about if team has time."
        - "What it comes down to is whether the team actually has time to learn a new tool right now."
        - "What it comes down is the time."
      answer: 1
      explain: "第一句 in conclusion 太像寫作文，about if 也不對；第三句少了 to，而且太籠統，沒說清楚是什麼時間。"
    task: "用這個句型總結：朋友在兩份工作 offer 之間猶豫不決。"
    match: ["comes down to"]

  - id: the-bottom-line
    pack: clarify
    pattern: "The bottom line is (that) ..."
    meaning: "最重要的結論是……／底線是……"
    when: "直接講出最後的結論或不能讓步的點，常在討論尾聲或需要給明確答覆時用。"
    examples:
      - en: "The bottom line is that we can't afford a new car this year."
        zh: "說到底，我們今年就是買不起新車。"
      - en: "The bottom line is that the project has to stay under budget, even if we cut a few features."
        zh: "底線是專案必須控制在預算內，就算要砍掉一些功能也一樣。"
    choice:
      situation: "團隊在爭論各種細節，你想直接講結論：不管用哪種做法，都必須在月底前交付。"
      options:
        - "The bottom line is that we deliver by the end of the month, whatever approach we take."
        - "The bottom line is, so we must deliver end of month."
        - "The most bottom thing is the deadline."
      answer: 0
      explain: "第二句 is 後面多了 so，end of month 也少了 the；第三句 most bottom thing 不是英文說法。"
    task: "用這個句型跟朋友說：你考慮很久之後的決定（例如先租房、暫時不買房）。"
    match: ["bottom line"]

  - id: to-put-it-another-way
    pack: clarify
    pattern: "To put it another way, ..."
    meaning: "換個方式說，……"
    when: "對方好像沒聽懂，或你想用更具體、更好懂的說法再講一次時用。"
    examples:
      - en: "You're paying for a gym you only use twice a month. To put it another way, each visit costs you about five hundred dollars."
        zh: "你辦了一個一個月只去兩次的健身房。換個方式說，你每去一次大概要花五百塊。"
      - en: "Our churn rate is eight percent. To put it another way, we lose about one customer in twelve every month."
        zh: "我們的流失率是百分之八。換個方式說，我們每個月大約每十二個客戶就流失一個。"
    choice:
      situation: "你剛說「這個 bug 影響 3% 的付款」，但大家沒什麼感覺，你想換個說法讓大家理解嚴重性。"
      options:
        - "Another way to put, it's many people."
        - "In other way, three percent is a lot."
        - "To put it another way, roughly one in every thirty payments is failing."
      answer: 2
      explain: "第一句少了 it，而且說得很模糊；第二句 in other way 是錯誤說法，應該是 in other words，而且沒有讓數字更具體。"
    task: "用這個句型換個說法解釋：你每天滑手機三小時。"
    match: ["put it another way"]
    mistake:
      wrong: "In other way, ..."
      right: "In other words, ... / To put it another way, ..."
      why: "中文「換句話說」直譯會變成 in other way；正確是 in other words（複數），或用 to put it another way。"

  - id: not-so-much-as
    pack: clarify
    pattern: "It's not so much X as Y"
    meaning: "與其說是 X，不如說是 Y"
    when: "修正別人（或自己）對問題的理解，指出真正的重點在哪裡。"
    examples:
      - en: "It's not so much the price that bothers me as the fact that it breaks so easily."
        zh: "讓我不滿的與其說是價格，不如說是它太容易壞。"
      - en: "It's not so much a technical problem as a communication problem between the two teams."
        zh: "與其說這是技術問題，不如說是兩個團隊之間的溝通問題。"
    choice:
      situation: "主管以為專案延誤是因為工程師不夠，你想指出其實是需求一直變動。"
      options:
        - "It's not so much a staffing issue as the fact that the requirements keep changing."
        - "It's not so much staffing, but requirements change."
        - "Not staffing problem. Requirements problem."
      answer: 0
      explain: "第二句 not so much 要配 as，不是 but；第三句太簡略，像在打電報，對主管說不夠完整也不夠禮貌。"
    task: "用這個句型說明：你不常運動的真正原因。"
    match: ["not so much"]
    mistake:
      wrong: "It's not so much X, but Y."
      right: "It's not so much X as Y."
      why: "中文「與其說…不如說…」的「不如」容易被翻成 but；這個句型固定用 as。"

  - id: what-really-matters
    pack: opinion
    pattern: "What really matters is ..."
    meaning: "真正重要的是……"
    when: "把焦點拉回最核心的價值或目標，常用在大家糾結細節的時候。"
    examples:
      - en: "What really matters is that everyone gets home safely, not whether we catch the last train."
        zh: "真正重要的是大家都平安到家，而不是有沒有趕上末班車。"
      - en: "What really matters is whether users can finish checkout without help."
        zh: "真正重要的是使用者能不能不靠協助就完成結帳。"
    choice:
      situation: "團隊在爭論 logo 的顏色，你想把焦點拉回：客戶能不能看懂報價。"
      options:
        - "The really important is the client understand the quote."
        - "Stop talking about colors, it's not important."
        - "What really matters is that the client can understand the quote at a glance."
      answer: 2
      explain: "第一句 the really important 後面缺名詞，understand 也要加 s；第二句等於叫大家閉嘴，太不客氣。"
    task: "用這個句型回應：朋友擔心婚禮場地不夠豪華。"
    match: ["what really matters"]
    mistake:
      wrong: "The really important is ..."
      right: "What really matters is ... / The really important thing is ..."
      why: "中文「真正重要的是」直譯時會漏掉名詞；英文要用 what 子句，或補上 thing。"

  - id: if-i-could-come-in
    pack: meeting
    pattern: "If I could just come in here, ..."
    meaning: "我在這裡插一句……"
    when: "會議中禮貌地插話補充或更正，比 Sorry to interrupt 更從容、更正式。"
    examples:
      - en: "If I could just come in here, the restaurant you're talking about closed last month."
        zh: "我插一句，你們說的那家餐廳上個月已經收了。"
      - en: "If I could just come in here, the figures on that slide are from last quarter, not this one."
        zh: "我插一句，那張投影片上的數字是上一季的，不是這一季。"
    choice:
      situation: "線上會議中同事正在報告，你發現他講的上線日期錯了，想禮貌地插話。"
      options:
        - "Wait, wait, you're wrong."
        - "If I could just come in here, I think the launch date moved to the twelfth."
        - "If I could just come here, the date is wrong."
      answer: 1
      explain: "第一句太衝，當眾說別人錯；第三句少了 in，come here 是「過來這裡」，意思完全不同。"
    task: "用這個句型插話：家庭聚會上大家在討論旅遊行程，你想補充一個資訊。"
    match: ["come in"]

  - id: going-back-to
    pack: meeting
    pattern: "Going back to what X said, ..."
    meaning: "回到剛才 X 說的……"
    when: "討論已經往前走了，你想把話題拉回某人先前的觀點，同時表示你有在聽。"
    examples:
      - en: "Going back to what your sister said, maybe we could just order in and stay home."
        zh: "回到你姊姊剛剛說的，也許我們乾脆叫外送待在家就好。"
      - en: "Going back to what Mei said about onboarding, I think that's where we're losing most new users."
        zh: "回到 Mei 剛剛說的新手引導，我覺得那正是我們流失最多新用戶的地方。"
    choice:
      situation: "會議快結束時，你想把話題拉回同事 Kevin 一開始提到的預算問題。"
      options:
        - "Going back to what Kevin said earlier about the budget, do we have a final number yet?"
        - "Back to Kevin say before, the budget?"
        - "Return to Kevin's topic, budget."
      answer: 0
      explain: "第二句 say 要用過去式 said，而且整句不完整；第三句 return to 在這裡很生硬，也不是完整的句子。"
    task: "用這個句型：朋友聚餐時，把話題拉回某位朋友先前提到的換工作計畫。"
    match: ["going back to"]

  - id: park-that
    pack: meeting
    pattern: "Let's park that for now (and come back to it later)."
    meaning: "這個先放著，之後再討論。"
    when: "會議中出現有價值但離題的議題時，禮貌地先擱置，讓討論回到正題。"
    examples:
      - en: "Let's park that for now and decide on the hotel once we know the dates."
        zh: "這個先放著，等日期確定再決定飯店。"
      - en: "That's a good question, but let's park that for now and come back to it after the demo."
        zh: "這是個好問題，不過我們先把它放著，展示完再回來討論。"
    choice:
      situation: "你主持會議，有人突然提起明年的組織調整，你想先擱置，回到今天的議程。"
      options:
        - "That's off topic. Next."
        - "Let's stop that for now and come back later."
        - "Good point. Let's park that for now and come back to it at the end."
      answer: 2
      explain: "第一句太冷淡，會讓提問的人尷尬；第二句 stop that 聽起來像叫對方停止某個行為，有責備的味道。"
    task: "用這個句型：家人討論晚餐時突然聊到過年要去哪，你想先擱置這個話題。"
    match: ["park"]
`,C=`level: advanced
words:
  - id: nuance
    word: nuance
    pos: n.
    phonetic: "/ˈnuːɑːns/"
    meaning: "細微差別、微妙之處"
    example:
      en: "Machine translation still misses a lot of the nuance in casual Chinese."
      zh: "機器翻譯還是會漏掉口語中文裡很多細微的意思。"
    collocations: ["subtle nuance", "the nuances of", "miss the nuance"]
    note: "形容詞 nuanced 也很常用：a nuanced view（有層次、不非黑即白的看法）。"

  - id: trade-off
    word: trade-off
    pos: n.
    phonetic: "/ˈtreɪd ɔːf/"
    meaning: "取捨、權衡（為了得到一樣而犧牲另一樣）"
    example:
      en: "There's always a trade-off between speed and quality."
      zh: "速度和品質之間總是要有所取捨。"
    collocations: ["a trade-off between A and B", "make a trade-off"]
    note: "常跟 between A and B 一起用。"

  - id: implication
    word: implication
    pos: n.
    phonetic: "/ˌɪmplɪˈkeɪʃən/"
    meaning: "（可能的）影響、後果；言外之意"
    example:
      en: "Have we thought through the legal implications of storing users' voice recordings?"
      zh: "我們有沒有想清楚儲存使用者錄音在法律上可能帶來的影響？"
    collocations: ["have implications for", "the implications of", "serious implications"]
    note: "講「影響」時常用複數 implications，比 effect 更強調「連帶的後果」。"

  - id: rationale
    word: rationale
    pos: n.
    phonetic: "/ˌræʃəˈnæl/"
    meaning: "根本理由、背後的邏輯"
    example:
      en: "Could you walk us through the rationale behind the new pricing?"
      zh: "可以跟我們說明一下新定價背後的理由嗎？"
    collocations: ["the rationale behind", "the rationale for"]
    note: "比 reason 正式，指一個決定背後整套的思考邏輯。"

  - id: caveat
    word: caveat
    pos: n.
    phonetic: "/ˈkæviæt/"
    meaning: "附帶條件、但書、需要注意的地方"
    example:
      en: "The plan works, with one caveat: we'd need the client's data by Friday."
      zh: "這個計畫可行，但有一個前提：我們週五前要拿到客戶的資料。"
    collocations: ["with one caveat", "add a caveat"]

  - id: bottleneck
    word: bottleneck
    pos: n.
    phonetic: "/ˈbɑːtlnek/"
    meaning: "瓶頸（拖慢整體進度的環節）"
    example:
      en: "Design reviews have become the bottleneck, so features are piling up waiting for approval."
      zh: "設計審查變成了瓶頸，所以功能都堆著等核准。"
    collocations: ["become a bottleneck", "remove the bottleneck"]

  - id: leeway
    word: leeway
    pos: n.
    phonetic: "/ˈliːweɪ/"
    meaning: "（行動、決定上的）彈性空間、餘地"
    example:
      en: "My manager gives me a lot of leeway in how I organize my week."
      zh: "主管給我很大的彈性去安排自己一週的工作。"
    collocations: ["give someone leeway", "some leeway", "leeway to do something"]
    note: "不可數名詞，不說 a leeway。"

  - id: consensus
    word: consensus
    pos: n.
    phonetic: "/kənˈsensəs/"
    meaning: "共識"
    example:
      en: "We didn't reach a consensus, so we'll vote on it next week."
      zh: "我們沒有達成共識，所以下週會投票決定。"
    collocations: ["reach a consensus", "a broad consensus", "build consensus"]
    note: "consensus 本身就有「大家的意見」的意思，說 general consensus 可以，但 consensus of opinion 有點重複。"

  - id: premise
    word: premise
    pos: n.
    phonetic: "/ˈpremɪs/"
    meaning: "前提、立論基礎"
    example:
      en: "The whole plan rests on the premise that users will pay for extra storage."
      zh: "整個計畫的前提是使用者願意為額外的儲存空間付費。"
    collocations: ["on the premise that", "the basic premise"]
    note: "注意和 premises（房屋、營業場所）區分。"

  - id: discrepancy
    word: discrepancy
    pos: n.
    phonetic: "/dɪˈskrepənsi/"
    meaning: "（數字、說法之間的）不一致、落差"
    example:
      en: "There's a small discrepancy between the invoice and the order we placed."
      zh: "發票和我們下的訂單之間有一點對不上。"
    collocations: ["a discrepancy between A and B", "notice a discrepancy"]

  - id: incentive
    word: incentive
    pos: n.
    phonetic: "/ɪnˈsentɪv/"
    meaning: "誘因、激勵"
    example:
      en: "Free shipping gives people an incentive to add one more item to their cart."
      zh: "免運費讓人有誘因多放一件商品到購物車。"
    collocations: ["an incentive to do something", "tax incentive", "have no incentive"]

  - id: precedent
    word: precedent
    pos: n.
    phonetic: "/ˈpresɪdənt/"
    meaning: "先例"
    example:
      en: "If we give one client a discount, we set a precedent for everyone else."
      zh: "如果給一個客戶折扣，就等於替其他所有人開了先例。"
    collocations: ["set a precedent", "without precedent"]
    note: "set a precedent 常帶「之後很難收回」的擔憂語氣。"

  - id: leverage
    word: leverage
    pos: v.
    phonetic: "/ˈlevərɪdʒ/"
    meaning: "善用、借助（既有的資源或優勢）"
    example:
      en: "We could leverage our existing user base to test the new feature quickly."
      zh: "我們可以善用現有的用戶群，快速測試新功能。"
    collocations: ["leverage existing resources", "leverage experience"]
    note: "職場常用，但用太多會像在講企業術語；口語可以換成 make use of。"

  - id: mitigate
    word: mitigate
    pos: v.
    phonetic: "/ˈmɪtɪɡeɪt/"
    meaning: "減輕、降低（風險或負面影響）"
    example:
      en: "Daily backups help mitigate the risk of losing customer data."
      zh: "每天備份有助於降低遺失客戶資料的風險。"
    collocations: ["mitigate the risk", "mitigate the impact"]
    note: "受詞是風險或傷害，不是問題本身；「解決問題」用 solve 或 fix。"

  - id: exacerbate
    word: exacerbate
    pos: v.
    phonetic: "/ɪɡˈzæsərbeɪt/"
    meaning: "使（問題、情況）惡化"
    example:
      en: "Adding more people to a late project often exacerbates the delay."
      zh: "在已經延誤的專案裡加人，常常只會讓延誤更嚴重。"
    collocations: ["exacerbate the problem", "exacerbate tensions"]
    note: "比 make worse 正式，受詞通常已經是負面的東西。"

  - id: undermine
    word: undermine
    pos: v.
    phonetic: "/ˌʌndərˈmaɪn/"
    meaning: "逐漸削弱、破壞（信心、權威、努力）"
    example:
      en: "Changing the rules at the last minute undermines people's trust in the process."
      zh: "最後一刻改規則會削弱大家對整個流程的信任。"
    collocations: ["undermine trust", "undermine someone's authority", "undermine confidence"]

  - id: reconcile
    word: reconcile
    pos: v.
    phonetic: "/ˈrekənsaɪl/"
    meaning: "調和（兩個看似衝突的東西）；使和好"
    example:
      en: "It's hard to reconcile a full-time job with a newborn at home."
      zh: "要兼顧全職工作和家裡的新生兒很不容易。"
    collocations: ["reconcile A with B", "reconcile differences"]
    note: "財務上 reconcile the accounts 是「對帳」。"

  - id: streamline
    word: streamline
    pos: v.
    phonetic: "/ˈstriːmlaɪn/"
    meaning: "簡化、精簡（流程），使更有效率"
    example:
      en: "We streamlined the sign-up form from eight fields down to three."
      zh: "我們把註冊表單從八個欄位精簡到三個。"
    collocations: ["streamline the process", "streamline operations"]

  - id: articulate
    word: articulate
    pos: v.
    phonetic: "/ɑːrˈtɪkjəleɪt/"
    meaning: "清楚表達（想法、感受）"
    example:
      en: "She articulated exactly what the rest of us had been struggling to say."
      zh: "她把我們其他人一直說不清楚的想法講得非常清楚。"
    collocations: ["articulate an idea", "articulate a vision"]
    note: "當形容詞時唸 /ɑːrˈtɪkjələt/，意思是「口條好、表達清楚的」。"

  - id: scrutinize
    word: scrutinize
    pos: v.
    phonetic: "/ˈskruːtənaɪz/"
    meaning: "仔細檢查、細細審視"
    example:
      en: "Investors will scrutinize every number in this report, so let's double-check them."
      zh: "投資人會仔細檢查這份報告裡的每個數字，我們再核對一次吧。"
    collocations: ["scrutinize the details", "closely scrutinize"]
    note: "名詞 scrutiny：under scrutiny（受到嚴格檢視）。"

  - id: alleviate
    word: alleviate
    pos: v.
    phonetic: "/əˈliːvieɪt/"
    meaning: "緩解、減輕（痛苦、壓力、問題）"
    example:
      en: "Hiring two temps alleviated some of the pressure during the holiday rush."
      zh: "雇了兩個臨時工，減輕了一些假期旺季的壓力。"
    collocations: ["alleviate pressure", "alleviate symptoms", "alleviate concerns"]

  - id: entail
    word: entail
    pos: v.
    phonetic: "/ɪnˈteɪl/"
    meaning: "必然包含、牽涉到"
    example:
      en: "Can you tell me what the role would entail day to day?"
      zh: "可以說一下這個職位每天實際要做哪些事嗎？"
    collocations: ["what does it entail", "entail risks"]
    note: "面試時問 What does the job entail? 很自然。"

  - id: warrant
    word: warrant
    pos: v.
    phonetic: "/ˈwɔːrənt/"
    meaning: "使有正當理由、值得（採取某行動）"
    example:
      en: "A two-minute delay hardly warrants an emergency meeting."
      zh: "延遲兩分鐘根本不值得開緊急會議。"
    collocations: ["warrant further investigation", "warrant attention"]

  - id: compelling
    word: compelling
    pos: adj.
    phonetic: "/kəmˈpelɪŋ/"
    meaning: "有說服力的；引人入勝的"
    example:
      en: "She made a compelling case for moving the team to a four-day week."
      zh: "她提出了很有說服力的理由，主張團隊改成一週工作四天。"
    collocations: ["a compelling argument", "compelling evidence", "make a compelling case"]

  - id: viable
    word: viable
    pos: adj.
    phonetic: "/ˈvaɪəbəl/"
    meaning: "可行的、能長久運作的"
    example:
      en: "Without a second investor, the project just isn't financially viable."
      zh: "沒有第二個投資人，這個案子在財務上就是不可行。"
    collocations: ["a viable option", "commercially viable", "financially viable"]
    note: "比 possible 更強調「實際運作得下去」。"

  - id: inherent
    word: inherent
    pos: adj.
    phonetic: "/ɪnˈhɪrənt/"
    meaning: "固有的、本身就存在的"
    example:
      en: "There's an inherent risk in any investment, no matter how safe it looks."
      zh: "任何投資本身都有風險，不管看起來多安全。"
    collocations: ["an inherent risk", "inherent in something"]
    note: "常用 be inherent in：Risk is inherent in investing."

  - id: feasible
    word: feasible
    pos: adj.
    phonetic: "/ˈfiːzəbəl/"
    meaning: "（實際上）做得到的、可行的"
    example:
      en: "Is it feasible to finish the redesign before the trade show?"
      zh: "在展覽前完成改版做得到嗎？"
    collocations: ["technically feasible", "a feasible plan"]

  - id: tangible
    word: tangible
    pos: adj.
    phonetic: "/ˈtændʒəbəl/"
    meaning: "具體的、看得到的（成果、好處）"
    example:
      en: "After three months, we're finally seeing tangible results from the new onboarding flow."
      zh: "三個月後，我們終於看到新手引導流程帶來的具體成果。"
    collocations: ["tangible results", "tangible benefits"]

  - id: plausible
    word: plausible
    pos: adj.
    phonetic: "/ˈplɔːzəbəl/"
    meaning: "聽起來合理的、說得通的"
    example:
      en: "His excuse sounded plausible, but nobody could confirm it."
      zh: "他的理由聽起來說得通，但沒有人能證實。"
    collocations: ["a plausible explanation", "sound plausible"]
    note: "只是「聽起來合理」，不代表一定是真的。"

  - id: pragmatic
    word: pragmatic
    pos: adj.
    phonetic: "/præɡˈmætɪk/"
    meaning: "務實的"
    example:
      en: "Let's be pragmatic and fix the biggest issue first instead of rewriting everything."
      zh: "我們務實一點，先修最大的問題，而不是全部重寫。"
    collocations: ["a pragmatic approach", "be pragmatic about"]

  - id: ambiguous
    word: ambiguous
    pos: adj.
    phonetic: "/æmˈbɪɡjuəs/"
    meaning: "模稜兩可的、不明確的"
    example:
      en: "The email was a bit ambiguous, so I called to check what she meant."
      zh: "那封信寫得有點模稜兩可，所以我打電話問她是什麼意思。"
    collocations: ["deliberately ambiguous", "an ambiguous answer"]

  - id: counterproductive
    word: counterproductive
    pos: adj.
    phonetic: "/ˌkaʊntərprəˈdʌktɪv/"
    meaning: "適得其反的"
    example:
      en: "Studying all night before an exam can be counterproductive."
      zh: "考前熬夜讀書可能會適得其反。"
    collocations: ["prove counterproductive", "be counterproductive"]

  - id: contentious
    word: contentious
    pos: adj.
    phonetic: "/kənˈtenʃəs/"
    meaning: "有爭議的、容易引起爭論的"
    example:
      en: "Office seating turned out to be a surprisingly contentious topic."
      zh: "辦公室座位安排竟然是個很有爭議的話題。"
    collocations: ["a contentious issue", "highly contentious"]

  - id: arguably
    word: arguably
    pos: adv.
    phonetic: "/ˈɑːrɡjuəbli/"
    meaning: "可以說、說不定是（提出一個有理由支持的看法）"
    example:
      en: "This is arguably the best ramen shop in the neighborhood."
      zh: "這家說不定是這一帶最好吃的拉麵店。"
    collocations: ["arguably the best", "arguably more important"]
    note: "常被誤解成「有爭議地」；其實是「有理由可以這麼說」，常接最高級。"

  - id: inevitably
    word: inevitably
    pos: adv.
    phonetic: "/ɪnˈevɪtəbli/"
    meaning: "不可避免地、必然"
    example:
      en: "When you launch something new, there will inevitably be a few bugs."
      zh: "推出新東西時，難免會有幾個 bug。"
    collocations: ["inevitably lead to", "almost inevitably"]

  - id: ostensibly
    word: ostensibly
    pos: adv.
    phonetic: "/ɑːˈstensəbli/"
    meaning: "表面上、名義上（暗示實際可能不是這樣）"
    example:
      en: "The meeting was ostensibly about the budget, but it was really about who'd lead the team."
      zh: "那場會議表面上是談預算，其實是在談誰要帶這個團隊。"
    collocations: ["ostensibly to do something", "ostensibly because"]

  - id: predominantly
    word: predominantly
    pos: adv.
    phonetic: "/prɪˈdɑːmɪnəntli/"
    meaning: "主要地、大部分"
    example:
      en: "Our customers are predominantly small businesses with fewer than twenty staff."
      zh: "我們的客戶主要是員工不到二十人的小公司。"
    collocations: ["predominantly female", "predominantly online"]
    note: "比 mainly 正式，報告裡描述組成比例時很好用。"

  - id: conversely
    word: conversely
    pos: adv.
    phonetic: "/ˈkɑːnvɜːrsli/"
    meaning: "反過來說、相反地"
    example:
      en: "Raising prices could cost us customers; conversely, cutting them could hurt our margins."
      zh: "漲價可能會流失客戶；反過來說，降價可能會壓縮利潤。"
    collocations: ["and conversely", "conversely, ..."]

  - id: albeit
    word: albeit
    pos: conj.
    phonetic: "/ɔːlˈbiːɪt/"
    meaning: "雖然、儘管（後面接簡短的讓步補充）"
    example:
      en: "The trip was worth it, albeit a little expensive."
      zh: "這趟旅行很值得，雖然有點貴。"
    collocations: ["albeit briefly", "albeit slowly", "albeit with some changes"]
    note: "後面接形容詞、副詞或片語，不接完整子句；要接完整子句用 although。"

  - id: notwithstanding
    word: notwithstanding
    pos: prep.
    phonetic: "/ˌnɑːtwɪθˈstændɪŋ/"
    meaning: "儘管、雖然有（某事）"
    example:
      en: "Notwithstanding a few delays, the move to the new office went smoothly."
      zh: "儘管有一些延誤，搬到新辦公室的過程還是很順利。"
    collocations: ["notwithstanding the cost", "notwithstanding the fact that"]
    note: "很正式，多用在書面或合約；口語用 despite 就好。"

  - id: take-into-account
    word: take into account
    pos: phr.
    phonetic: "/teɪk ˈɪntuː əˈkaʊnt/"
    meaning: "把……考慮進去"
    example:
      en: "When you compare the two flats, take into account how much you'd spend on transport."
      zh: "比較這兩間公寓時，要把交通費考慮進去。"
    collocations: ["take something into account", "take into account the fact that"]
    note: "受詞短時放中間：take it into account；受詞長時放後面。"

  - id: be-wary-of
    word: be wary of
    pos: phr.
    phonetic: "/bi ˈweri əv/"
    meaning: "對……保持警覺、小心提防"
    example:
      en: "I'd be wary of any deal that promises returns that high."
      zh: "任何承諾那麼高報酬的投資，我都會很小心。"
    collocations: ["be wary of strangers", "be wary of doing something"]

  - id: come-across-as
    word: come across as
    pos: phr.
    phonetic: "/kʌm əˈkrɔːs æz/"
    meaning: "給人……的印象"
    example:
      en: "I didn't want to come across as rude, so I softened the email a bit."
      zh: "我不想給人沒禮貌的印象，所以把信的語氣改得柔和一點。"
    collocations: ["come across as arrogant", "come across as confident"]
    note: "中文常說「我看起來…」，但講個性、態度給人的感覺時，英文用 come across as 更自然。"

  - id: at-the-expense-of
    word: at the expense of
    pos: phr.
    phonetic: "/æt ði ɪkˈspens əv/"
    meaning: "以犧牲……為代價"
    example:
      en: "He hit every target, but at the expense of his health."
      zh: "他每個目標都達成了，但代價是犧牲了健康。"
    collocations: ["at the expense of quality", "at someone's expense"]
    note: "at someone's expense 也可以指「拿某人開玩笑」。"

  - id: in-light-of
    word: in light of
    pos: phr.
    phonetic: "/ɪn ˈlaɪt əv/"
    meaning: "鑑於、考慮到（新的資訊）"
    example:
      en: "In light of the typhoon warning, we've moved the event online."
      zh: "鑑於颱風警報，我們把活動改到線上。"
    collocations: ["in light of recent events", "in light of the new data"]
    note: "通常指「因為出現了新資訊，所以調整」。"

  - id: rule-out
    word: rule out
    pos: phr.
    phonetic: "/ruːl ˈaʊt/"
    meaning: "排除（可能性）"
    example:
      en: "We can't rule out a second round of layoffs this year."
      zh: "我們不能排除今年會有第二波裁員的可能。"
    collocations: ["rule out the possibility", "rule something out"]

  - id: weigh-up
    word: weigh up
    pos: phr.
    phonetic: "/weɪ ˈʌp/"
    meaning: "權衡、仔細比較（利弊）"
    example:
      en: "Take a few days to weigh up the pros and cons before you accept the offer."
      zh: "接受這份 offer 之前，花幾天好好權衡一下利弊。"
    collocations: ["weigh up the pros and cons", "weigh up the options"]
    note: "英式較常用 weigh up；美式常直接說 weigh the options。"

  - id: bring-up
    word: bring up
    pos: phr.
    phonetic: "/brɪŋ ˈʌp/"
    meaning: "提出（話題、問題）"
    example:
      en: "I'll bring up the parking issue at the next residents' meeting."
      zh: "我會在下次住戶大會上提出停車的問題。"
    collocations: ["bring up a topic", "bring something up with someone"]
    note: "另一個意思是「養育」：I was brought up in Tainan."

  - id: stem-from
    word: stem from
    pos: phr.
    phonetic: "/ˈstem frʌm/"
    meaning: "源自、起因於"
    example:
      en: "Most of our support tickets stem from one confusing settings page."
      zh: "我們大部分的客服單都源自一個讓人困惑的設定頁。"
    collocations: ["stem from a misunderstanding", "stem from the fact that"]
    note: "不用被動，不說 be stemmed from。"

  - id: play-down
    word: play down
    pos: phr.
    phonetic: "/pleɪ ˈdaʊn/"
    meaning: "淡化、輕描淡寫（某事的重要性）"
    example:
      en: "The company tried to play down the data leak, but customers were furious."
      zh: "公司想淡化資料外洩的事，但客戶非常憤怒。"
    collocations: ["play down the risk", "play down the importance of"]

  - id: follow-through-on
    word: follow through on
    pos: phr.
    phonetic: "/ˈfɑːloʊ θruː ɑːn/"
    meaning: "（說到）做到、把承諾執行到底"
    example:
      en: "People will only trust the new policy if management follows through on it."
      zh: "只有主管真的貫徹執行，大家才會相信這個新政策。"
    collocations: ["follow through on a promise", "follow through on a plan"]
    note: "和 follow up on（後續追蹤）不同：follow through 是把事情做完。"

  - id: on-the-grounds-that
    word: on the grounds that
    pos: phr.
    phonetic: "/ɑːn ðə ˈɡraʊndz ðæt/"
    meaning: "以……為理由"
    example:
      en: "They rejected the proposal on the grounds that it was too risky."
      zh: "他們以風險太高為由否決了這個提案。"
    collocations: ["on the grounds of", "on what grounds"]
    note: "grounds 一定是複數；接名詞時用 on the grounds of。"

  - id: by-and-large
    word: by and large
    pos: phr.
    phonetic: "/baɪ ən ˈlɑːrdʒ/"
    meaning: "大體上、整體來說"
    example:
      en: "By and large, the feedback on the new menu has been positive."
      zh: "整體來說，大家對新菜單的回饋都很正面。"
    collocations: ["by and large, ..."]

  - id: in-hindsight
    word: in hindsight
    pos: phr.
    phonetic: "/ɪn ˈhaɪndsaɪt/"
    meaning: "事後回想、事後看來"
    example:
      en: "In hindsight, we should have tested the payment flow on older phones."
      zh: "事後回想，我們應該要在舊手機上測試付款流程。"
    collocations: ["in hindsight", "with the benefit of hindsight"]
    note: "常接 should have + 過去分詞，表示事後的檢討。"

  - id: factor-in
    word: factor in
    pos: phr.
    phonetic: "/ˈfæktər ɪn/"
    meaning: "把……算進去、納入考量"
    example:
      en: "Don't forget to factor in tax when you work out the final price."
      zh: "算最後價格時別忘了把稅算進去。"
    collocations: ["factor in the cost", "factor something in"]

  - id: iron-out
    word: iron out
    pos: phr.
    phonetic: "/ˈaɪərn aʊt/"
    meaning: "解決（小問題）、把細節處理好"
    example:
      en: "We still need to iron out a few details before we sign the contract."
      zh: "簽約前我們還需要把幾個細節處理好。"
    collocations: ["iron out the details", "iron out the problems"]

  - id: touch-on
    word: touch on
    pos: phr.
    phonetic: "/ˈtʌtʃ ɑːn/"
    meaning: "簡單提到、稍微談到"
    example:
      en: "The talk only touched on pricing, so I'd like to hear more about it."
      zh: "演講只稍微提到定價，所以我想多聽一點。"
    collocations: ["briefly touch on", "touch on a subject"]

  - id: err-on-the-side-of-caution
    word: err on the side of caution
    pos: phr.
    phonetic: "/ɝː ɑːn ðə saɪd əv ˈkɔːʃən/"
    meaning: "寧可謹慎一點、保守為上"
    example:
      en: "I'd err on the side of caution and bring a jacket; the mountain gets cold at night."
      zh: "我會保守一點帶件外套，山上晚上會變冷。"
    collocations: ["err on the side of caution"]

  - id: hold-off-on
    word: hold off on
    pos: phr.
    phonetic: "/hoʊld ˈɔːf ɑːn/"
    meaning: "暫緩、先不（做某事）"
    example:
      en: "Let's hold off on booking the venue until we have a final headcount."
      zh: "等最後人數確定了再訂場地，先不要訂。"
    collocations: ["hold off on a decision", "hold off on doing something"]
    note: "後面接名詞或 V-ing。"

  - id: get-across
    word: get across
    pos: phr.
    phonetic: "/ɡet əˈkrɔːs/"
    meaning: "把（想法、訊息）傳達清楚、讓人理解"
    example:
      en: "A simple chart got the message across better than ten slides of text."
      zh: "一張簡單的圖表比十張文字投影片更能把重點傳達清楚。"
    collocations: ["get the message across", "get a point across"]
`,M=`level: beginner
patterns:
  - id: like-to
    pack: daily
    pattern: "I'd like ..."
    meaning: "我想要……（比 I want 禮貌）"
    when: "點餐、請求、表達想做的事時用，聽起來比 I want 客氣。後面可接名詞，或 to + 動詞。"
    examples:
      - en: "I'd like a bowl of beef noodles, please."
        zh: "請給我一碗牛肉麵。"
      - en: "I'd like to talk about the project schedule."
        zh: "我想談一下專案的時程。"
    choice:
      situation: "在咖啡店，你想點一杯大杯拿鐵。"
      options:
        - "I'd like a large latte, please."
        - "I want to a large latte."
        - "Give me large latte."
      answer: 0
      explain: "I'd like 後面可以直接接名詞；want to 後面要接動詞。Give me 對店員來說太直接，也少了 a。"
    task: "用這個句型說：週末你想做什麼？"
    match: ["i'd like"]
    mistake:
      wrong: "I want to a coffee."
      right: "I'd like a coffee. / I want a coffee."
      why: "want to 後面要接動詞，接名詞時不用 to。"

  - id: want-to
    pack: daily
    pattern: "I want to ..."
    meaning: "我想（做某事）"
    when: "跟朋友、家人說自己想做什麼時用；對陌生人或店員說 I'd like 比較客氣。"
    examples:
      - en: "I want to sleep in this Saturday."
        zh: "這個星期六我想睡晚一點。"
      - en: "I want to learn more about data analysis."
        zh: "我想多學一點資料分析。"
    choice:
      situation: "朋友問你週末想做什麼，你想去看電影。"
      options:
        - "I want go to see a movie."
        - "I want to watching a movie."
        - "I want to see a movie."
      answer: 2
      explain: "want to 後面接原形動詞：不能省略 to，也不能接 -ing。"
    task: "用這個句型說：今年你最想做的一件事。"
    match: ["want to"]
    mistake:
      wrong: "I want go home."
      right: "I want to go home."
      why: "中文「我想回家」中間沒有字，但英文 want 後面接動詞時一定要有 to。"

  - id: need-to
    pack: daily
    pattern: "I need to ..."
    meaning: "我得……／我必須……"
    when: "說自己有必要做的事時用，比 I must 口語、自然。"
    examples:
      - en: "I need to buy some milk on the way home."
        zh: "我回家路上得買點牛奶。"
      - en: "I need to finish this report by Friday."
        zh: "我得在星期五前完成這份報告。"
    choice:
      situation: "你明天要搭早上七點的高鐵，得早起。"
      options:
        - "I must to get up early tomorrow."
        - "I need to get up early tomorrow."
        - "I need get up early tomorrow."
      answer: 1
      explain: "need to + 原形動詞；must 後面直接接動詞，不加 to。日常對話用 need to 比 must 自然。"
    task: "用這個句型說：今天下班或放學後你得做什麼？"
    match: ["need to"]
    mistake:
      wrong: "I need go to the bank."
      right: "I need to go to the bank."
      why: "need 後面接動詞時要加 to。"

  - id: can-i
    pack: daily
    pattern: "Can I ...?"
    meaning: "我可以……嗎？"
    when: "請求許可時用，例如借東西、坐位子、用設備。"
    examples:
      - en: "Can I sit here?"
        zh: "我可以坐這裡嗎？"
      - en: "Can I leave a little early today?"
        zh: "我今天可以早一點走嗎？"
    choice:
      situation: "在朋友家，你想借用一下廁所。"
      options:
        - "I can use the bathroom?"
        - "Can I use the bathroom is OK?"
        - "Can I use your bathroom?"
      answer: 2
      explain: "問句要把 can 放到句首；中文「可以嗎」的「嗎」已經包含在 Can I 裡，不用再加 is OK。"
    task: "用這個句型在辦公室或教室裡提出一個請求。"
    match: ["can i"]
    mistake:
      wrong: "I can sit here?"
      right: "Can I sit here?"
      why: "直述句加問號在口語中聽起來像驚訝，正式的請求要把 can 移到前面。"

  - id: could-you
    pack: daily
    pattern: "Could you ...?"
    meaning: "可以請你……嗎？（客氣的請求）"
    when: "請別人幫忙時用，比 Can you 更有禮貌，對同事、店員、陌生人都適合。"
    examples:
      - en: "Could you pass me the salt?"
        zh: "可以請你把鹽遞給我嗎？"
      - en: "Could you send me the file again?"
        zh: "可以請你再寄一次檔案給我嗎？"
    choice:
      situation: "同事講太快，你沒聽懂，想請他再說一次。"
      options:
        - "Could you say that again, please?"
        - "Could you repeat again?"
        - "Can you speak again?"
      answer: 0
      explain: "repeat 本身就是「再說一次」，不用再加 again；speak again 是「再發言一次」，意思不對。"
    task: "用這個句型請朋友或同事幫你一個小忙。"
    match: ["could you"]
    mistake:
      wrong: "Could you repeat again?"
      right: "Could you say that again? / Could you repeat that?"
      why: "中文「再重複一次」很自然，但英文 repeat 已經有「再」的意思。"

  - id: do-you
    pack: smalltalk
    pattern: "Do you ...?"
    meaning: "你（平常）……嗎？"
    when: "問對方的習慣、喜好時用，是聊天最常用的開頭。"
    examples:
      - en: "Do you cook at home?"
        zh: "你會在家煮飯嗎？"
      - en: "Do you take the MRT to work?"
        zh: "你搭捷運上班嗎？"
    choice:
      situation: "你想知道新同學喜不喜歡喝咖啡。"
      options:
        - "Are you like coffee?"
        - "Do you like coffee?"
        - "You like coffee or not?"
      answer: 1
      explain: "like 是一般動詞，問句用 Do，不用 Are；「喜不喜歡」不要直翻成 or not，聽起來很不客氣。"
    task: "用這個句型問一個朋友的生活習慣。"
    match: ["do you"]
    mistake:
      wrong: "Are you like spicy food?"
      right: "Do you like spicy food?"
      why: "句子裡已經有動詞 like，就不能再用 be 動詞 are 來問。"

  - id: what-do-you-think-of
    pack: opinion
    pattern: "What do you think of ...?"
    meaning: "你覺得……怎麼樣？"
    when: "問別人對某個東西、地方、想法的看法時用。"
    examples:
      - en: "What do you think of this jacket?"
        zh: "你覺得這件外套怎麼樣？"
      - en: "What do you think of the new teacher?"
        zh: "你覺得新老師怎麼樣？"
    choice:
      situation: "你想問朋友覺得新開的拉麵店怎麼樣。"
      options:
        - "How do you think of the new ramen place?"
        - "What do you feel the new ramen place?"
        - "What do you think of the new ramen place?"
      answer: 2
      explain: "中文「怎麼樣」容易讓人用 how，但英文要說 What do you think of…。也可以說 How do you like…?"
    task: "用這個句型問朋友對一部電影或一家店的看法。"
    match: ["what do you think"]
    mistake:
      wrong: "How do you think about it?"
      right: "What do you think about it?"
      why: "think 問「想法內容」用 what；how 問的是「用什麼方式想」。"

  - id: think-because
    pack: opinion
    pattern: "I think ... because ..."
    meaning: "我覺得……，因為……"
    when: "說出自己的看法並加上理由，讓對話不會只停在一句。"
    examples:
      - en: "I think summer is the best because I love the beach."
        zh: "我覺得夏天最棒，因為我喜歡海邊。"
      - en: "I think we need more time because the task is big."
        zh: "我覺得我們需要更多時間，因為這個工作量很大。"
    choice:
      situation: "朋友問你喜歡夏天還是冬天，你喜歡冬天，因為可以吃火鍋。"
      options:
        - "I think winter is better because I can eat hot pot."
        - "Because I can eat hot pot, so I think winter is better."
        - "I think winter is better, because of I can eat hot pot."
      answer: 0
      explain: "英文 because 和 so 不能同時用；because of 後面接名詞，不接句子。"
    task: "用這個句型說：你比較喜歡在家還是出門？為什麼？"
    match: ["i think", "because"]
    mistake:
      wrong: "Because it's raining, so I stay home."
      right: "Because it's raining, I'm staying home. / It's raining, so I'm staying home."
      why: "中文「因為……所以……」會一起出現，英文只能選一個。"

  - id: going-to
    pack: daily
    pattern: "I'm going to ..."
    meaning: "我要／我打算……（已經決定的事）"
    when: "說已經決定好的計畫時用。"
    examples:
      - en: "I'm going to visit my grandma this weekend."
        zh: "這個週末我要去看奶奶。"
      - en: "I'm going to start the new project on Monday."
        zh: "我星期一要開始新專案。"
    choice:
      situation: "你已經決定今晚要去逛夜市。"
      options:
        - "I will going to the night market tonight."
        - "I'm going to go to the night market tonight."
        - "I'm going to going to the night market tonight."
      answer: 1
      explain: "be going to 後面接原形動詞；will 後面也一定接原形動詞，不能接 -ing。"
    task: "用這個句型說：明天你要做什麼？"
    match: ["going to"]
    mistake:
      wrong: "I going to call her later."
      right: "I'm going to call her later."
      why: "going to 前面要有 be 動詞（am / is / are），中文沒有對應的字所以常被漏掉。"

  - id: planning-to
    pack: daily
    pattern: "I'm planning to ..."
    meaning: "我正在計畫／打算……"
    when: "說還在安排中、還沒完全確定的計畫時用。"
    examples:
      - en: "I'm planning to visit Japan next spring."
        zh: "我打算明年春天去日本玩。"
      - en: "I'm planning to take an English class after work."
        zh: "我打算下班後去上英文課。"
    choice:
      situation: "你打算明年去日本玩，但還沒訂機票。"
      options:
        - "I'm planning go to Japan next year."
        - "I plan going to Japan next year."
        - "I'm planning to visit Japan next year."
      answer: 2
      explain: "plan 後面接動詞要用 to + 原形動詞，不能省略 to，也不接 -ing。"
    task: "用這個句型說：下個假期你打算做什麼？"
    match: ["planning to"]

  - id: never-done
    pack: smalltalk
    pattern: "I've never ..."
    meaning: "我從來沒有……過"
    when: "說自己到現在為止沒有過的經驗。"
    examples:
      - en: "I've never tried durian."
        zh: "我從來沒吃過榴槤。"
      - en: "I've never given a talk in English."
        zh: "我從來沒用英文上台報告過。"
    choice:
      situation: "同事問你有沒有滑過雪，你從來沒滑過。"
      options:
        - "I've never been skiing."
        - "I never ski before."
        - "I haven't never skied."
      answer: 0
      explain: "講「到現在為止的經驗」用 have + 過去分詞；never 已經是否定，不能再加 not。"
    task: "用這個句型說一件你從來沒做過、但想試試的事。"
    match: ["never"]
    mistake:
      wrong: "I never go to Japan before."
      right: "I've never been to Japan."
      why: "「去過／沒去過」是經驗，要用現在完成式 have been to。"

  - id: have-you-ever
    pack: smalltalk
    pattern: "Have you ever ...?"
    meaning: "你有沒有……過？"
    when: "問對方的經驗，很適合用來開啟話題。"
    examples:
      - en: "Have you ever been to Hualien?"
        zh: "你去過花蓮嗎？"
      - en: "Have you ever worked from home?"
        zh: "你有在家工作過嗎？"
    choice:
      situation: "你想問外國朋友有沒有吃過臭豆腐。"
      options:
        - "Did you ever ate stinky tofu?"
        - "Have you ever tried stinky tofu?"
        - "Have you ever try stinky tofu?"
      answer: 1
      explain: "Have you ever 後面接過去分詞（tried、eaten、been），不接原形；did 後面則要接原形。"
    task: "用這個句型問朋友一個經驗。"
    match: ["have you ever"]
    mistake:
      wrong: "Have you ever went to Tainan?"
      right: "Have you ever been to Tainan?"
      why: "went 是過去式，這裡要用過去分詞；說「去過某地」習慣用 been to。"

  - id: usually
    pack: daily
    pattern: "I usually ..."
    meaning: "我通常……"
    when: "說自己的習慣或日常安排。"
    examples:
      - en: "I usually have toast for breakfast."
        zh: "我早餐通常吃吐司。"
      - en: "I usually check my email first at work."
        zh: "我上班通常先看電子郵件。"
    choice:
      situation: "朋友問你平常怎麼上班，你通常搭捷運。"
      options:
        - "I usually am take the MRT to work."
        - "I'm usually take the MRT."
        - "I usually take the MRT to work."
      answer: 2
      explain: "usually 直接放在一般動詞前面，句子裡不需要再加 am。"
    task: "用這個句型說：你週末通常做什麼？"
    match: ["usually"]
    mistake:
      wrong: "I usually am go to bed at 12."
      right: "I usually go to bed at 12."
      why: "一個句子已經有動詞 go，就不用再放 be 動詞。"

  - id: lets
    pack: suggest
    pattern: "Let's ..."
    meaning: "我們來……吧"
    when: "提議大家一起做某件事。"
    examples:
      - en: "Let's grab some bubble tea."
        zh: "我們去買杯珍奶吧。"
      - en: "Let's take a short break."
        zh: "我們休息一下吧。"
    choice:
      situation: "下課了，你想約同學一起去吃午餐。"
      options:
        - "Let's to get lunch together."
        - "Let's get lunch together."
        - "Let's going to lunch."
      answer: 1
      explain: "Let's 後面直接接原形動詞，不加 to，也不接 -ing。"
    task: "用這個句型約朋友這個週末一起做一件事。"
    match: ["let's"]
    mistake:
      wrong: "Let's to go!"
      right: "Let's go!"
      why: "Let's = Let us，let 後面的動詞不加 to。"

  - id: how-about
    pack: suggest
    pattern: "How about ...?"
    meaning: "……怎麼樣？（提出建議）"
    when: "提出一個選項讓對方考慮。後面接名詞或 V-ing。"
    examples:
      - en: "How about pizza for dinner?"
        zh: "晚餐吃披薩怎麼樣？"
      - en: "How about meeting at three o'clock?"
        zh: "三點開會怎麼樣？"
    choice:
      situation: "朋友問今晚吃什麼，你提議吃火鍋。"
      options:
        - "How about hot pot tonight?"
        - "How about eat hot pot tonight?"
        - "How about we eating hot pot?"
      answer: 0
      explain: "How about 後面接名詞或 V-ing（How about having hot pot?），不接原形動詞。"
    task: "用這個句型提議一個週末的活動。"
    match: ["how about"]
    mistake:
      wrong: "How about go to the beach?"
      right: "How about going to the beach?"
      why: "about 是介系詞，後面的動詞要改成 -ing。"

  - id: me-neither
    pack: agree
    pattern: "Me neither. / I don't either."
    meaning: "我也不……（附和否定的說法）"
    when: "對方說了否定句（I don't…、I can't…），你也一樣時用。對方說肯定句才用 Me too。"
    examples:
      - en: "A: I don't like durian. B: Me neither."
        zh: "A：我不喜歡榴槤。B：我也不喜歡。"
      - en: "A: I didn't finish the homework. B: Me neither."
        zh: "A：我作業沒寫完。B：我也沒有。"
    choice:
      situation: "朋友說 I don't like horror movies. 你也不喜歡。"
      options:
        - "Me too."
        - "I don't like too."
        - "Me neither."
      answer: 2
      explain: "附和否定句要用 Me neither 或 I don't either；Me too 用在附和肯定句（口語中偶爾聽得到，但不是標準用法）。"
    task: "朋友說 I can't cook. 用這個句型回應，再多說一句。"
    match: ["neither"]
    mistake:
      wrong: "A: I can't swim. B: Me too."
      right: "Me neither. / I can't either."
      why: "中文不論肯定否定都說「我也是」，英文要跟著對方的句子換說法。"

  - id: dont-think
    pack: disagree
    pattern: "I don't think ..."
    meaning: "我不覺得……／我認為不……"
    when: "委婉表達不同意或否定的看法。英文習慣把 not 放在 think 這邊。"
    examples:
      - en: "I don't think it will rain today."
        zh: "我覺得今天不會下雨。"
      - en: "I don't think we need another meeting."
        zh: "我覺得我們不需要再開一次會。"
    choice:
      situation: "朋友說這部電影很好看，你覺得不怎麼樣，想委婉地說。"
      options:
        - "I think it's not very good."
        - "I don't think it's very good."
        - "I'm not think it's good."
      answer: 1
      explain: "英文習慣說 I don't think…，比 I think it's not… 自然；think 是一般動詞，否定用 don't 不用 I'm not。"
    task: "用這個句型委婉地不同意一個說法。"
    match: ["i don't think"]
    mistake:
      wrong: "I think it's not a good idea."
      right: "I don't think it's a good idea."
      why: "中文說「我覺得不好」，英文習慣把否定提前到 think，聽起來比較委婉。"

  - id: sorry-i
    pack: daily
    pattern: "Sorry, I ..."
    meaning: "抱歉，我……"
    when: "為自己做的事或狀況道歉，後面直接說明原因。"
    examples:
      - en: "Sorry, I forgot to call you back."
        zh: "抱歉，我忘了回你電話。"
      - en: "Sorry, I didn't see your message."
        zh: "抱歉，我沒看到你的訊息。"
    choice:
      situation: "你開會遲到了五分鐘，進會議室時道歉。"
      options:
        - "Sorry, I'm late."
        - "Sorry for late."
        - "Sorry, I late."
      answer: 0
      explain: "late 是形容詞，前面要有 be 動詞：I'm late；也可以說 Sorry for being late。"
    task: "用這個句型為一件小事道歉，並說明原因。"
    match: ["sorry"]
    mistake:
      wrong: "Sorry for late."
      right: "Sorry I'm late. / Sorry for being late."
      why: "for 後面要接名詞或 V-ing，late 是形容詞不能直接放。"

  - id: thanks-for
    pack: daily
    pattern: "Thanks for ..."
    meaning: "謝謝你（做了）……"
    when: "具體說出要謝什麼，比只說 Thank you 更有誠意。後面接名詞或 V-ing。"
    examples:
      - en: "Thanks for the birthday cake!"
        zh: "謝謝你的生日蛋糕！"
      - en: "Thanks for explaining the problem to me."
        zh: "謝謝你跟我解釋這個問題。"
    choice:
      situation: "同事幫你搬了一箱資料，你想謝謝他。"
      options:
        - "Thanks for help me."
        - "Thank you for your helping."
        - "Thanks for helping me."
      answer: 2
      explain: "for 是介系詞，後面接 V-ing（helping）或名詞（your help），不能接原形動詞。"
    task: "用這個句型謝謝最近幫過你的人。"
    match: ["thanks for"]
    mistake:
      wrong: "Thank you for invite me."
      right: "Thank you for inviting me."
      why: "for 後面的動詞要加 -ing。"

  - id: how-was-your
    pack: smalltalk
    pattern: "How was your ...?"
    meaning: "你的……過得怎麼樣？"
    when: "問對方已經結束的事情：週末、假期、旅行、考試。"
    examples:
      - en: "How was your trip to Kenting?"
        zh: "你去墾丁玩得怎麼樣？"
      - en: "How was your job interview?"
        zh: "你的面試順利嗎？"
    choice:
      situation: "星期一早上，你想問同事週末過得怎麼樣。"
      options:
        - "How is your weekend?"
        - "How was your weekend?"
        - "How did your weekend?"
      answer: 1
      explain: "週末已經過去了，要用過去式 was；How did 後面一定要接動詞。"
    task: "用這個句型問朋友最近一件已經結束的事。"
    match: ["how was"]
    mistake:
      wrong: "How is your trip? (旅行已經結束)"
      right: "How was your trip?"
      why: "中文不分時態，英文問已經結束的事要用 was。"
`,V=`level: beginner
words:
  - id: borrow
    word: "borrow"
    pos: "v."
    phonetic: "/ˈbɑːroʊ/"
    meaning: "（向別人）借入"
    example:
      en: "Can I borrow your umbrella?"
      zh: "我可以借你的傘嗎？"
    collocations: ["borrow money", "borrow a book from the library"]
    note: "borrow 是「借入」，lend 是「借出」：Can you lend me your pen?"

  - id: lend
    word: "lend"
    pos: "v."
    phonetic: "/lɛnd/"
    meaning: "借出（給別人）"
    example:
      en: "Could you lend me 100 dollars?"
      zh: "你可以借我一百元嗎？"
    collocations: ["lend someone money", "lend a hand"]
    note: "lend 是「把東西借給別人」，句型是 lend + 人 + 東西；不要說 Can you borrow me…?"

  - id: bring
    word: "bring"
    pos: "v."
    phonetic: "/brɪŋ/"
    meaning: "帶來（往說話者這邊）"
    example:
      en: "Please bring your laptop to the meeting."
      zh: "開會請帶你的筆電來。"
    collocations: ["bring something home", "bring a friend"]
    note: "bring 是帶「過來」，take 是帶「過去」。中文都說「帶」，要看方向。"

  - id: take
    word: "take"
    pos: "v."
    phonetic: "/teɪk/"
    meaning: "帶走；拿去（往別處）；搭乘"
    example:
      en: "Don't forget to take a jacket."
      zh: "別忘了帶件外套。"
    collocations: ["take the bus", "take a photo", "take a break"]
    note: "離開現在的地方帶東西去別處用 take：Take this to your mom."

  - id: tired
    word: "tired"
    pos: "adj."
    phonetic: "/ˈtaɪərd/"
    meaning: "（人）累的"
    example:
      en: "I'm so tired after work today."
      zh: "我今天下班後好累。"
    collocations: ["feel tired", "tired of something"]
    note: "-ed 形容詞描述「人的感覺」：I'm tired。不要說 I'm tiring（意思是「我很累人」）。"

  - id: tiring
    word: "tiring"
    pos: "adj."
    phonetic: "/ˈtaɪərɪŋ/"
    meaning: "令人疲累的"
    example:
      en: "Moving to a new apartment is really tiring."
      zh: "搬新家真的很累人。"
    collocations: ["a tiring day", "a tiring trip"]
    note: "-ing 形容詞描述「事情帶給人的感覺」：The job is tiring. I'm tired."

  - id: bored
    word: "bored"
    pos: "adj."
    phonetic: "/bɔːrd/"
    meaning: "（人）感到無聊的"
    example:
      en: "I was bored, so I called my friend."
      zh: "我很無聊，所以打給朋友。"
    collocations: ["get bored", "bored with something"]
    note: "說自己無聊要說 I'm bored；I'm boring 是「我這個人很無趣」。"

  - id: boring
    word: "boring"
    pos: "adj."
    phonetic: "/ˈbɔːrɪŋ/"
    meaning: "令人無聊的、無趣的"
    example:
      en: "The movie was long and boring."
      zh: "那部電影又長又無聊。"
    collocations: ["a boring class", "boring work"]

  - id: fun
    word: "fun"
    pos: "adj."
    phonetic: "/fʌn/"
    meaning: "好玩的、有趣的（令人開心）"
    example:
      en: "The beach trip was so much fun."
      zh: "這趟海邊之旅超好玩。"
    collocations: ["have fun", "a fun day"]
    note: "fun 是「好玩、開心」，funny 是「好笑」。The party was funny 意思是派對很滑稽。"

  - id: funny
    word: "funny"
    pos: "adj."
    phonetic: "/ˈfʌni/"
    meaning: "好笑的；奇怪的"
    example:
      en: "My brother tells really funny stories."
      zh: "我哥哥講的故事真的很好笑。"
    collocations: ["a funny video", "funny smell"]

  - id: see
    word: "see"
    pos: "v."
    phonetic: "/siː/"
    meaning: "看見；見面"
    example:
      en: "I saw my teacher at the night market."
      zh: "我在夜市看到我的老師。"
    collocations: ["see a doctor", "see a movie", "see you later"]
    note: "see 是「自然看到」；look 是「刻意去看」；watch 是「盯著看會動的東西」。"

  - id: look
    word: "look"
    pos: "v."
    phonetic: "/lʊk/"
    meaning: "（刻意）看；看起來"
    example:
      en: "Look at this photo of my cat."
      zh: "你看這張我家貓的照片。"
    collocations: ["look at", "look for", "look tired"]
    note: "look 後面接東西時要加 at：look at the board，不說 look the board。"

  - id: watch
    word: "watch"
    pos: "v."
    phonetic: "/wɑːtʃ/"
    meaning: "觀看（一段時間、會動的東西）"
    example:
      en: "We watched a baseball game last night."
      zh: "我們昨晚看了一場棒球賽。"
    collocations: ["watch TV", "watch a video", "watch out"]

  - id: say
    word: "say"
    pos: "v."
    phonetic: "/seɪ/"
    meaning: "說（說出某些話）"
    example:
      en: "She said she was busy today."
      zh: "她說她今天很忙。"
    collocations: ["say hello", "say sorry", "say goodbye"]
    note: "say 重點在「說的內容」，後面不直接接人：He said to me…，不說 He said me…。"

  - id: tell
    word: "tell"
    pos: "v."
    phonetic: "/tɛl/"
    meaning: "告訴（某人）"
    example:
      en: "Can you tell me the way to the station?"
      zh: "你可以告訴我去車站怎麼走嗎？"
    collocations: ["tell someone something", "tell a story", "tell the truth"]
    note: "tell 後面通常直接接人：tell me、tell him。"

  - id: speak
    word: "speak"
    pos: "v."
    phonetic: "/spiːk/"
    meaning: "說（某種語言）；發言"
    example:
      en: "I speak a little Japanese."
      zh: "我會說一點日文。"
    collocations: ["speak English", "speak to someone", "speak up"]
    note: "說語言用 speak：speak English，不說 talk English。"

  - id: talk
    word: "talk"
    pos: "v."
    phonetic: "/tɔːk/"
    meaning: "聊天、談話"
    example:
      en: "We talked for hours at the cafe."
      zh: "我們在咖啡店聊了好幾個小時。"
    collocations: ["talk to someone", "talk about something"]
    note: "talk 強調雙方的對話，後面常接 to / about：talk about work。"

  - id: wear
    word: "wear"
    pos: "v."
    phonetic: "/wɛr/"
    meaning: "穿著、戴著（狀態）"
    example:
      en: "She always wears glasses at work."
      zh: "她上班時總是戴眼鏡。"
    collocations: ["wear a mask", "wear a suit"]
    note: "wear 是「穿著的狀態」，put on 是「穿上的動作」。衣服、眼鏡、手錶、口罩都用 wear。"

  - id: put-on
    word: "put on"
    pos: "phr."
    phonetic: "/pʊt ˈɑːn/"
    meaning: "穿上、戴上（動作）"
    example:
      en: "Put on your coat. It's cold outside."
      zh: "穿上外套，外面很冷。"
    collocations: ["put on shoes", "put on sunscreen"]

  - id: ago
    word: "ago"
    pos: "adv."
    phonetic: "/əˈɡoʊ/"
    meaning: "（從現在算起）……以前"
    example:
      en: "I moved to Taipei three years ago."
      zh: "我三年前搬到台北。"
    collocations: ["two days ago", "a long time ago"]
    note: "ago 放在時間後面：three years ago；不說 before three years。"

  - id: before
    word: "before"
    pos: "adv."
    phonetic: "/bɪˈfɔːr/"
    meaning: "以前、之前"
    example:
      en: "Have we met before?"
      zh: "我們以前見過嗎？"
    collocations: ["before lunch", "the day before"]
    note: "單獨用的 before 是「以前（不特定時間）」；有確切時間長度時用 ago。"

  - id: already
    word: "already"
    pos: "adv."
    phonetic: "/ɔːlˈrɛdi/"
    meaning: "已經"
    example:
      en: "I've already eaten, thanks."
      zh: "我已經吃過了，謝謝。"
    collocations: ["already done", "already know"]
    note: "already 多用在肯定句；問「還沒」、「了嗎」通常用 yet。"

  - id: yet
    word: "yet"
    pos: "adv."
    phonetic: "/jɛt/"
    meaning: "（否定句）還沒；（問句）已經……了嗎"
    example:
      en: "I haven't finished my homework yet."
      zh: "我還沒寫完作業。"
    collocations: ["not yet", "Are you ready yet?"]
    note: "yet 放在句尾。回答「還沒」直接說 Not yet。"

  - id: a-few
    word: "a few"
    pos: "phr."
    phonetic: "/ə ˈfjuː/"
    meaning: "幾個、一些（可數）"
    example:
      en: "I have a few questions about the plan."
      zh: "我對這個計畫有幾個問題。"
    collocations: ["a few days", "a few friends"]
    note: "a few 接可數名詞（questions、days）；a little 接不可數名詞（time、money）。"

  - id: a-little
    word: "a little"
    pos: "phr."
    phonetic: "/ə ˈlɪtəl/"
    meaning: "一點點（不可數）；有點"
    example:
      en: "Can I have a little more rice?"
      zh: "我可以再多一點飯嗎？"
    collocations: ["a little time", "a little tired"]

  - id: hear
    word: "hear"
    pos: "v."
    phonetic: "/hɪr/"
    meaning: "聽到"
    example:
      en: "Did you hear the news?"
      zh: "你聽說那個消息了嗎？"
    collocations: ["hear about", "hear from someone"]
    note: "hear 是「自然聽到」，listen 是「專心去聽」，類似 see 和 look 的差別。"

  - id: listen
    word: "listen"
    pos: "v."
    phonetic: "/ˈlɪsən/"
    meaning: "（專心）聽"
    example:
      en: "I listen to podcasts on the bus."
      zh: "我在公車上聽 podcast。"
    collocations: ["listen to music", "listen carefully"]
    note: "listen 後面接東西要加 to：listen to music，不說 listen music。"

  - id: excited
    word: "excited"
    pos: "adj."
    phonetic: "/ɪkˈsaɪtɪd/"
    meaning: "（人）興奮的、期待的"
    example:
      en: "I'm excited about my trip next week."
      zh: "我很期待下週的旅行。"
    collocations: ["excited about", "get excited"]
    note: "I'm excited 是「我很興奮」；I'm exciting 是「我是個令人興奮的人」。"

  - id: interested
    word: "interested"
    pos: "adj."
    phonetic: "/ˈɪntrəstɪd/"
    meaning: "（人）感興趣的"
    example:
      en: "I'm interested in cooking."
      zh: "我對做菜有興趣。"
    collocations: ["interested in", "very interested"]
    note: "對某事有興趣說 I'm interested in…，介系詞用 in，不用 about 或 on。"

  - id: expensive
    word: "expensive"
    pos: "adj."
    phonetic: "/ɪkˈspɛnsɪv/"
    meaning: "昂貴的"
    example:
      en: "Rent in Taipei is really expensive."
      zh: "台北的房租真的很貴。"
    collocations: ["too expensive", "an expensive restaurant"]
    note: "說價格高低用 high / low：The price is high；說東西貴才用 expensive。"

  - id: cheap
    word: "cheap"
    pos: "adj."
    phonetic: "/tʃiːp/"
    meaning: "便宜的；（形容東西）廉價的"
    example:
      en: "This lunch box is cheap and tasty."
      zh: "這個便當便宜又好吃。"
    collocations: ["cheap tickets", "really cheap"]

  - id: busy
    word: "busy"
    pos: "adj."
    phonetic: "/ˈbɪzi/"
    meaning: "忙碌的"
    example:
      en: "I'm busy with a report today."
      zh: "我今天忙著寫報告。"
    collocations: ["busy with", "a busy week"]
    note: "忙著做某事說 busy + V-ing：I'm busy cooking，不說 busy to cook。"

  - id: free
    word: "free"
    pos: "adj."
    phonetic: "/friː/"
    meaning: "有空的；免費的"
    example:
      en: "Are you free on Saturday afternoon?"
      zh: "你星期六下午有空嗎？"
    collocations: ["free time", "free of charge"]
    note: "問人有沒有空說 Are you free?，不說 Do you have empty?"

  - id: spend
    word: "spend"
    pos: "v."
    phonetic: "/spɛnd/"
    meaning: "花（錢、時間）"
    example:
      en: "I spend too much money on snacks."
      zh: "我花太多錢在零食上。"
    collocations: ["spend time", "spend money on"]
    note: "主詞是「人」用 spend；主詞是「東西」用 cost。花時間做某事說 spend time + V-ing。"

  - id: cost
    word: "cost"
    pos: "v."
    phonetic: "/kɔːst/"
    meaning: "（東西）花費、價值多少錢"
    example:
      en: "How much does this shirt cost?"
      zh: "這件襯衫多少錢？"
    collocations: ["cost a lot", "cost money"]

  - id: forget
    word: "forget"
    pos: "v."
    phonetic: "/fərˈɡɛt/"
    meaning: "忘記"
    example:
      en: "I forgot my keys at home again."
      zh: "我又把鑰匙忘在家裡了。"
    collocations: ["forget to do", "forget about"]
    note: "forget to do 是「忘了去做」，forget doing 是「忘了做過」。"

  - id: remember
    word: "remember"
    pos: "v."
    phonetic: "/rɪˈmɛmbər/"
    meaning: "記得"
    example:
      en: "Remember to drink more water."
      zh: "記得多喝水。"
    collocations: ["remember to do", "remember someone's name"]

  - id: lose
    word: "lose"
    pos: "v."
    phonetic: "/luːz/"
    meaning: "遺失；輸掉"
    example:
      en: "I lost my phone on the train."
      zh: "我的手機在火車上掉了。"
    collocations: ["lose weight", "lose a game"]
    note: "lose 是動詞，lost 是過去式；loose /luːs/ 是形容詞「鬆的」，拼法和發音都不同。"

  - id: miss
    word: "miss"
    pos: "v."
    phonetic: "/mɪs/"
    meaning: "想念；錯過"
    example:
      en: "Hurry up, or we'll miss the bus."
      zh: "快點，不然我們會錯過公車。"
    collocations: ["miss the train", "miss someone"]

  - id: arrive
    word: "arrive"
    pos: "v."
    phonetic: "/əˈraɪv/"
    meaning: "抵達"
    example:
      en: "We arrived at the hotel around nine."
      zh: "我們大約九點到飯店。"
    collocations: ["arrive at", "arrive in Taipei"]
    note: "arrive 後面要加 at（小地點）或 in（城市、國家），不能直接接地點；但 arrive home 不加。"

  - id: join
    word: "join"
    pos: "v."
    phonetic: "/dʒɔɪn/"
    meaning: "加入；跟（某人）一起"
    example:
      en: "Do you want to join us for dinner?"
      zh: "你要跟我們一起吃晚餐嗎？"
    collocations: ["join a club", "join a meeting"]

  - id: wait
    word: "wait"
    pos: "v."
    phonetic: "/weɪt/"
    meaning: "等待"
    example:
      en: "Can you wait for me at the door?"
      zh: "你可以在門口等我嗎？"
    collocations: ["wait for someone", "wait in line"]
    note: "等某人要說 wait for me，不說 wait me。"

  - id: invite
    word: "invite"
    pos: "v."
    phonetic: "/ɪnˈvaɪt/"
    meaning: "邀請"
    example:
      en: "She invited me to her wedding."
      zh: "她邀請我參加她的婚禮。"
    collocations: ["invite someone to", "invite friends over"]

  - id: enjoy
    word: "enjoy"
    pos: "v."
    phonetic: "/ɪnˈdʒɔɪ/"
    meaning: "享受、喜歡（做某事）"
    example:
      en: "I really enjoy walking by the river."
      zh: "我很喜歡在河邊散步。"
    collocations: ["enjoy yourself", "enjoy the food"]
    note: "enjoy 後面要接東西或 V-ing，不能單獨用：I enjoyed it，不說 I enjoyed。"

  - id: decide
    word: "decide"
    pos: "v."
    phonetic: "/dɪˈsaɪd/"
    meaning: "決定"
    example:
      en: "We decided to eat at home tonight."
      zh: "我們決定今晚在家吃。"
    collocations: ["decide to do", "decide on something"]

  - id: maybe
    word: "maybe"
    pos: "adv."
    phonetic: "/ˈmeɪbi/"
    meaning: "也許、可能"
    example:
      en: "Maybe we can go hiking next week."
      zh: "也許我們下週可以去爬山。"
    collocations: ["maybe later", "maybe not"]
    note: "maybe 通常放句首；may be（兩個字）是動詞片語：It may be true."

  - id: still
    word: "still"
    pos: "adv."
    phonetic: "/stɪl/"
    meaning: "還、仍然"
    example:
      en: "Are you still at the office?"
      zh: "你還在辦公室嗎？"
    collocations: ["still working", "still hungry"]

  - id: almost
    word: "almost"
    pos: "adv."
    phonetic: "/ˈɔːlmoʊst/"
    meaning: "幾乎、差不多"
    example:
      en: "Dinner is almost ready."
      zh: "晚餐快好了。"
    collocations: ["almost there", "almost every day"]
    note: "「大部分的人」說 most people 或 almost all people，不說 almost people。"

  - id: during
    word: "during"
    pos: "prep."
    phonetic: "/ˈdʊrɪŋ/"
    meaning: "在……期間"
    example:
      en: "I fell asleep during the movie."
      zh: "我看電影時睡著了。"
    collocations: ["during the day", "during lunch"]
    note: "during 後面接名詞（during the meeting）；接句子要用 while：while I was eating。"

  - id: until
    word: "until"
    pos: "prep."
    phonetic: "/ənˈtɪl/"
    meaning: "直到……為止"
    example:
      en: "The store is open until ten."
      zh: "這家店開到十點。"
    collocations: ["until tomorrow", "wait until"]

  - id: weekend
    word: "weekend"
    pos: "n."
    phonetic: "/ˈwiːkɛnd/"
    meaning: "週末"
    example:
      en: "What did you do last weekend?"
      zh: "你上週末做了什麼？"
    collocations: ["on the weekend", "this weekend"]

  - id: homework
    word: "homework"
    pos: "n."
    phonetic: "/ˈhoʊmwɜːrk/"
    meaning: "回家作業"
    example:
      en: "I have a lot of homework tonight."
      zh: "我今晚有很多作業。"
    collocations: ["do homework", "finish homework"]
    note: "homework 是不可數名詞，不說 homeworks；寫作業是 do homework，不說 write homework。"

  - id: advice
    word: "advice"
    pos: "n."
    phonetic: "/ədˈvaɪs/"
    meaning: "建議、忠告"
    example:
      en: "Can you give me some advice?"
      zh: "你可以給我一些建議嗎？"
    collocations: ["give advice", "a piece of advice"]
    note: "advice 不可數，不說 an advice 或 advices；動詞是 advise /ədˈvaɪz/。"

  - id: information
    word: "information"
    pos: "n."
    phonetic: "/ˌɪnfərˈmeɪʃən/"
    meaning: "資訊、資料"
    example:
      en: "I need more information about the class."
      zh: "我需要更多關於這門課的資訊。"
    collocations: ["more information", "personal information"]
    note: "information 不可數，不加 s。"

  - id: trip
    word: "trip"
    pos: "n."
    phonetic: "/trɪp/"
    meaning: "（一趟）旅行、行程"
    example:
      en: "We took a short trip to Tainan."
      zh: "我們去台南玩了一趟。"
    collocations: ["take a trip", "business trip"]

  - id: travel
    word: "travel"
    pos: "v."
    phonetic: "/ˈtrævəl/"
    meaning: "旅行、移動"
    example:
      en: "I love to travel with my family."
      zh: "我喜歡和家人一起旅行。"
    collocations: ["travel abroad", "travel by train"]
    note: "travel 通常當動詞；「一趟旅行」用 a trip，不說 a travel。"

  - id: appointment
    word: "appointment"
    pos: "n."
    phonetic: "/əˈpɔɪntmənt/"
    meaning: "（看醫生、洽公等）預約、約診"
    example:
      en: "I have a dentist appointment at four."
      zh: "我四點要去看牙醫。"
    collocations: ["make an appointment", "doctor's appointment"]
    note: "跟醫生、客戶的正式約定用 appointment；跟朋友出去玩用 plans：I have plans tonight。"

  - id: schedule
    word: "schedule"
    pos: "n."
    phonetic: "/ˈskɛdʒuːl/"
    meaning: "行程表、時間表"
    example:
      en: "My schedule is full this week."
      zh: "我這週的行程排滿了。"
    collocations: ["busy schedule", "on schedule"]

  - id: meeting
    word: "meeting"
    pos: "n."
    phonetic: "/ˈmiːtɪŋ/"
    meaning: "會議"
    example:
      en: "The meeting starts at ten."
      zh: "會議十點開始。"
    collocations: ["have a meeting", "in a meeting"]

  - id: convenient
    word: "convenient"
    pos: "adj."
    phonetic: "/kənˈviːniənt/"
    meaning: "方便的"
    example:
      en: "Is Friday convenient for you?"
      zh: "星期五你方便嗎？"
    collocations: ["convenient location", "convenient for someone"]
    note: "主詞要是時間或事情：Is Friday convenient for you?，不說 Are you convenient?"
`,_=`# Daily sentence patterns - intermediate (CEFR B1-B2)
# Source of pattern list: docs/plans/pattern-practice.md (packs A-G + common-mistake table).
# All example sentences are original. Single connectors (because, since, due to, on top of that,
# what's your take...) live in chapters/en/intermediate/09-giving-reasons.yml and are not repeated here.
level: intermediate
patterns:
  # ---------------------------------------------------------------
  # A. Opinion + reason (6)
  # ---------------------------------------------------------------
  - id: if-you-ask-me
    pack: opinion
    pattern: "If you ask me, ..."
    meaning: "要我說的話，……"
    when: "別人問你意見時用來帶出自己的看法，口氣輕鬆，也表示這只是個人觀點。"
    examples:
      - en: "If you ask me, the new café is nice but way overpriced."
        zh: "要我說的話，那間新咖啡廳不錯，但真的太貴了。"
      - en: "If you ask me, we should hire one senior engineer instead of two juniors."
        zh: "要我說的話，我們應該請一個資深工程師，而不是兩個新手。"
    choice:
      situation: "同事問你：新的開放式座位安排怎麼樣？你想輕鬆地說出自己的看法。"
      options:
        - "If you ask me, the open seating is a bit too noisy for focused work."
        - "According to me, the open seating is too noisy."
        - "In my opinion, I think the open seating is too noisy."
      answer: 0
      explain: "According to me 不是自然的英文（according to 用來引述別人或資料）；第三句 In my opinion 和 I think 意思重複，留一個就好。"
    task: "用這個句型說說你對「週末加班、平日補休」的看法。"
    match: ["if you ask me"]
    mistake:
      wrong: "According to me, ..."
      right: "If you ask me, ... / In my opinion, ..."
      why: "中文「依我看」容易直翻成 according to me，但 according to 是引述別人或資料來源用的，不用在自己身上。"

  - id: id-say-because
    pack: opinion
    pattern: "I'd say ..., because ..."
    meaning: "我會說……，因為……"
    when: "回答「你覺得哪個比較好」這類問題時，先給答案再補理由，是最常用的「看法＋理由」骨架。"
    examples:
      - en: "I'd say the train is better than driving, because you don't have to worry about parking."
        zh: "我會說搭火車比開車好，因為不用煩惱停車。"
      - en: "I'd say we're about 80% done, because only the payment page is left."
        zh: "我會說我們大概完成八成了，因為只剩付款頁面。"
    choice:
      situation: "朋友問你：台北和台中哪裡比較適合住？你想給答案並說明理由。"
      options:
        - "Taichung, due to it is less crowded."
        - "Because Taichung is less crowded, so I'd say Taichung."
        - "I'd say Taichung, because it's less crowded and the rent is cheaper."
      answer: 2
      explain: "第一句 due to 後面不能接句子；第二句 because 和 so 重複了，中文「因為…所以…」英文只能留一個。"
    task: "用這個句型回答：「在家工作和進辦公室，你覺得哪個效率比較高？」"
    match: ["d say", "because"]
    mistake:
      wrong: "Because it's cheaper, so I'd say ..."
      right: "I'd say ..., because it's cheaper. / It's cheaper, so I'd say ..."
      why: "中文「因為…所以…」成對出現，英文 because 和 so 只能用一個。"

  - id: could-be-wrong
    pack: opinion
    pattern: "I could be wrong, but ..."
    meaning: "我可能說錯，但……"
    when: "不太確定、或怕說得太武斷時，先替自己留餘地再說看法，聽起來謙虛又不失立場。"
    examples:
      - en: "I could be wrong, but I think the museum is closed on Mondays."
        zh: "我可能記錯，但我記得博物館週一休館。"
      - en: "I could be wrong, but I don't think the client has signed the contract yet."
        zh: "我可能說錯，但我不認為客戶已經簽約了。"
    choice:
      situation: "開會時大家以為報告週五交，但你印象中是週四，想提醒又不想太武斷。"
      options:
        - "You are wrong. The deadline is Thursday."
        - "I could be wrong, but I think the report is due on Thursday."
        - "I could be wrong, but the deadline is on Thursday, isn't it right?"
      answer: 1
      explain: "第一句直接說對方錯，太衝；第三句 isn't it right 是中文「對不對」直翻，英文說 isn't it? 或 right? 就好。"
    task: "用這個句型提出看法：你覺得公司聚餐的餐廳好像要先訂位。"
    match: ["could be wrong"]

  - id: to-be-honest
    pack: opinion
    pattern: "To be honest, ..."
    meaning: "老實說，……"
    when: "要說出真實但可能不太中聽的想法時，先用這句提醒對方，接下來是真心話。"
    examples:
      - en: "To be honest, I didn't enjoy the movie as much as everyone said I would."
        zh: "老實說，那部電影我沒有像大家說的那麼喜歡。"
      - en: "To be honest, I'm not confident we can finish the redesign by March."
        zh: "老實說，我沒什麼把握我們能在三月前完成改版。"
    choice:
      situation: "朋友問你他新剪的髮型好不好看，你覺得普通，想誠實但委婉地說。"
      options:
        - "Honest speaking, it's not very good."
        - "To be honest, it is ugly."
        - "To be honest, I liked the longer style better on you."
      answer: 2
      explain: "第一句 honest speaking 是中文「說實話」直翻，英文沒有這種說法；第二句句型對了，但直接說 ugly 太傷人。"
    task: "用這個句型說出你對某個流行事物（例如手搖飲、某部劇）的真實看法。"
    match: ["to be honest"]
    mistake:
      wrong: "Honest speaking, ..."
      right: "To be honest, ... / Honestly, ..."
      why: "「說實話」容易直翻成 honest speaking，但英文只說 to be honest 或 honestly。"

  - id: one-downside
    pack: opinion
    pattern: "One downside of ... is that ..."
    meaning: "……的一個缺點是……"
    when: "評估一個選項時具體點出缺點，比只說「不好」更有說服力；講好處就換成 One advantage of ... is that ...。"
    examples:
      - en: "One downside of living downtown is that the noise never really stops."
        zh: "住在市中心的一個缺點是噪音從來沒真正停過。"
      - en: "One downside of this tool is that it doesn't work offline."
        zh: "這個工具的一個缺點是不能離線使用。"
    choice:
      situation: "團隊在討論要不要改用新的專案管理軟體，你想具體指出一個缺點。"
      options:
        - "One downside of the new software is that everyone would need training first."
        - "One downside of the new software is everyone need training."
        - "The new software has one bad point, it is training."
      answer: 0
      explain: "第二句 everyone 後面的動詞要加 s（needs），少了 that 也比較生硬；第三句 bad point 不是自然說法，英文說 downside 或 disadvantage。"
    task: "用這個句型說出「養寵物」的一個缺點，可以再用 One advantage of ... 補一個優點。"
    match: ["downside of", "is that"]

  - id: based-on-experience
    pack: opinion
    pattern: "Based on my experience, ..."
    meaning: "根據我的經驗，……"
    when: "用自己的經歷支持看法，讓意見有根據，又不會像在下定論。"
    examples:
      - en: "Based on my experience, booking flights on a Tuesday is usually cheaper."
        zh: "根據我的經驗，週二訂機票通常比較便宜。"
      - en: "Based on my experience, clients reply faster when an email ends with a clear question."
        zh: "根據我的經驗，信的結尾有明確的問題時，客戶回得比較快。"
    choice:
      situation: "新同事問你：跟這個客戶開會要準備什麼？你想用自己的經驗回答。"
      options:
        - "According to my experience, you must prepare numbers."
        - "Based on my experience, it helps to bring the latest sales numbers."
        - "On my experience, you should to prepare the numbers."
      answer: 1
      explain: "according to my experience 不自然，要說 based on 或 in my experience，must 也太強硬；第三句介系詞錯（in 不是 on），而且 should 後面直接接原形動詞，不加 to。"
    task: "用這個句型給朋友一個建議，例如怎麼準備面試或怎麼挑租屋。"
    match: ["based on my experience"]
    mistake:
      wrong: "According to my experience, ..."
      right: "Based on my experience, ... / In my experience, ..."
      why: "「根據」直覺翻成 according to，但它多用來引述別人或資料；講自己的經驗用 based on 或 in。"

  # ---------------------------------------------------------------
  # B. Polite disagreement (7)
  # ---------------------------------------------------------------
  - id: acknowledge-but
    pack: disagree
    pattern: "I see what you're saying, but ..."
    meaning: "我懂你的意思，但是……"
    when: "想不同意時先承認對方的觀點，語氣比直接說 No 柔和很多。"
    examples:
      - en: "I see what you're saying, but I think the cheaper hotel is too far from everything."
        zh: "我懂你的意思，但我覺得便宜的那間飯店離什麼都太遠了。"
      - en: "I see what you're saying, but moving the launch would affect three other teams."
        zh: "我懂你的意思，但延後上線會影響另外三個團隊。"
    choice:
      situation: "主管提議把會議改到週五晚上，你不太同意，想委婉地說。"
      options:
        - "No, Friday night is bad."
        - "I see what you're saying, but Friday evening might be hard for people with kids."
        - "Although I understand you, but Friday night is not good."
      answer: 1
      explain: "第一句太直接；第三句 although…but 重複了，英文只能留一個。"
    task: "用這個句型委婉地不同意：朋友說「出國玩一定要跟團比較省事」。"
    match: ["see what you"]
    mistake:
      wrong: "Although I agree, but ..."
      right: "Although I agree, ... / I agree, but ..."
      why: "中文「雖然…但是…」成對，英文只能留一個。"

  - id: where-youre-coming-from
    pack: disagree
    pattern: "I understand where you're coming from, but ..."
    meaning: "我理解你為什麼這樣想，但……"
    when: "對方的想法有他的道理時，先表示你懂他的出發點，再說不同的意見；比 I see what you're saying 更強調同理。"
    examples:
      - en: "I understand where you're coming from, but I'd rather not lend money to friends."
        zh: "我理解你為什麼這樣想，但我不太想借錢給朋友。"
      - en: "I understand where you're coming from, but cutting the testing phase could cause bigger problems later."
        zh: "我理解你的考量，但砍掉測試階段可能會在之後造成更大的問題。"
    choice:
      situation: "同事擔心預算，提議取消年度員工旅遊。你理解他的考量，但不同意。"
      options:
        - "I'm not agree. The trip is important."
        - "I understand you, but the trip is important."
        - "I understand where you're coming from, but the trip really helps the team bond."
      answer: 2
      explain: "第一句文法錯（應說 I don't agree），語氣也太直接；第二句 I understand you 聽起來像「我聽得懂你說的話」，不是理解對方的立場。"
    task: "用這個句型回應：家人說「找工作一定要選大公司比較穩」。"
    match: ["where you", "coming from"]
    mistake:
      wrong: "I'm not agree."
      right: "I don't agree. / I disagree."
      why: "agree 是動詞，不是形容詞，不能放在 be 動詞後面；中文「我不同意」容易套成 I'm not agree。"

  - id: not-sure-best-option
    pack: disagree
    pattern: "I'm not sure that's the best option."
    meaning: "我不確定那是最好的選擇。"
    when: "想否決一個提議，又不想說 No 或 That's a bad idea 時，用「不確定」把否定變軟。"
    examples:
      - en: "I'm not sure that's the best option, since the restaurant is usually packed on Fridays."
        zh: "我不確定那是最好的選擇，因為那間餐廳週五通常爆滿。"
      - en: "I'm not sure that's the best option for a small team like ours."
        zh: "我不確定對我們這種小團隊來說，那是最好的選擇。"
    choice:
      situation: "同事建議所有文件都改回紙本簽核，你覺得不太好，想委婉表達。"
      options:
        - "I'm not sure that's the best option. Paper copies might slow down approvals."
        - "That's a bad idea. Paper is too slow."
        - "I'm not sure is it the best option."
      answer: 0
      explain: "第二句太直接，可能讓對方難堪；第三句把問句語序放進了直述句，應該是 I'm not sure (that) it's ...。"
    task: "用這個句型委婉否決：朋友提議跨年夜開車去市區看煙火。"
    match: ["not sure", "best"]
    mistake:
      wrong: "I'm not sure is it the best option."
      right: "I'm not sure (that) it's the best option."
      why: "中文「我不確定是不是」沒有語序變化；英文 not sure 後面接直述句，不用問句倒裝。"

  - id: afraid-dont-agree
    pack: disagree
    pattern: "I'm afraid I don't quite agree."
    meaning: "恐怕我不太同意。"
    when: "正式場合需要明確表達反對時使用；I'm afraid 帶有遺憾的口氣，quite 讓語氣稍微緩和。"
    examples:
      - en: "I'm afraid I don't quite agree. I think the book was better than the movie."
        zh: "恐怕我不太同意，我覺得書比電影好看。"
      - en: "I'm afraid I don't quite agree with the new pricing. It may push away our regular customers."
        zh: "恐怕我不太同意新的定價，這可能會讓老客戶流失。"
    choice:
      situation: "客戶會議上，對方主張把交期縮短一半，你必須明確但有禮貌地反對。"
      options:
        - "I'm scared I don't agree with you."
        - "I'm afraid I not quite agree."
        - "I'm afraid I don't quite agree. Cutting the timeline in half would put quality at risk."
      answer: 2
      explain: "第一句 scared 是真的害怕，這裡要用 I'm afraid 表示「恐怕、遺憾」；第二句少了助動詞，應是 I don't quite agree。"
    task: "用這個句型正式地反對：有人提議會議一律改成早上八點開始。"
    match: ["afraid", "agree"]

  - id: main-concern
    pack: disagree
    pattern: "My main concern is ..."
    meaning: "我主要的顧慮是……"
    when: "不直接反對，而是說出具體的擔心，讓對方針對問題回應，討論會比較有建設性。"
    examples:
      - en: "My main concern is the price. Everything else about the apartment is great."
        zh: "我主要的顧慮是價錢，公寓其他部分都很好。"
      - en: "My main concern is that we don't have enough people to support the launch."
        zh: "我主要的顧慮是我們沒有足夠的人力支援上線。"
    choice:
      situation: "主管想下週就讓新系統上線，你擔心使用者還沒受過訓練。"
      options:
        - "My main concern is about users haven't trained."
        - "My main concern is that users haven't been trained yet."
        - "I'm very worry that users don't train."
      answer: 1
      explain: "第一句 about 後面不能直接接句子，要用 is that + 句子；第三句 worry 是動詞，應說 I'm worried，而且使用者是「被訓練」，要用被動。"
    task: "用這個句型說出你對「公司改成一週上班四天」的一個顧慮。"
    match: ["concern is"]
    mistake:
      wrong: "My concern is about users haven't trained."
      right: "My concern is that users haven't been trained."
      why: "介系詞後面要接名詞，要接句子就用 that；中文「關於…」後面什麼都能接。"

  - id: have-reservations
    pack: disagree
    pattern: "I have some reservations about ..."
    meaning: "我對……有些保留。"
    when: "比 concern 更正式，常用在會議或書面，表示「還沒被說服」，不等於完全反對。"
    examples:
      - en: "I have some reservations about moving in with a roommate I've never met."
        zh: "要跟一個從沒見過的室友同住，我有些保留。"
      - en: "I have some reservations about outsourcing customer support."
        zh: "我對把客服外包有些保留。"
    choice:
      situation: "會議上討論要不要跟一家新的供應商合作，你還沒被說服，想正式地表達。"
      options:
        - "I have some reservations about working with a supplier we haven't tested."
        - "I have some reservation to work with this supplier."
        - "I keep my opinion about this supplier."
      answer: 0
      explain: "第二句這個意思的 reservations 要用複數，後面接 about + V-ing；第三句是中文「保留意見」直翻，英文不這樣說。"
    task: "用這個句型表達保留：朋友想把全部存款拿去買單一支股票。"
    match: ["reservations about"]
    mistake:
      wrong: "I keep my opinion."
      right: "I have some reservations about ..."
      why: "中文「我保留意見」直翻成 keep my opinion，英文母語者聽不懂；要說 I have some reservations。"

  - id: not-saying
    pack: disagree
    pattern: "I'm not saying ...; what I'm saying is ..."
    meaning: "我不是說……，我是說……"
    when: "對方誤會你的意思、以為你在反對或批評時，用來澄清真正的重點。"
    examples:
      - en: "I'm not saying we shouldn't travel; what I'm saying is we should go in the off-season."
        zh: "我不是說我們不該去旅行，我是說我們應該淡季去。"
      - en: "I'm not saying the design is bad; what I'm saying is it needs one more round of user testing."
        zh: "我不是說設計不好，我是說它還需要再一輪使用者測試。"
    choice:
      situation: "你說報告的數字可能有誤，同事以為你在怪他。你想澄清你的重點。"
      options:
        - "I don't mean that. I mean the numbers wrong."
        - "You misunderstand me. Your numbers are wrong."
        - "I'm not saying it's your fault; what I'm saying is we should double-check the numbers."
      answer: 2
      explain: "第一句 the numbers wrong 少了動詞 are；第二句說對方誤會、又直接說他錯，只會讓氣氛更僵。"
    task: "用這個句型澄清：你建議室友少叫外送，他以為你嫌他亂花錢。"
    match: ["not saying", "what i"]

  # ---------------------------------------------------------------
  # C. Suggesting (4)
  # ---------------------------------------------------------------
  - id: what-if-we
    pack: suggest
    pattern: "What if we ...?"
    meaning: "如果我們……呢？"
    when: "提出建議或替代方案時，用問句邀對方一起想，比 We have to ... 柔和很多。"
    examples:
      - en: "What if we left a bit earlier to avoid the traffic?"
        zh: "我們早一點出發避開車潮如何？"
      - en: "What if we split the project into two smaller releases?"
        zh: "如果我們把專案拆成兩次比較小的上線呢？"
    choice:
      situation: "團隊一直趕不上進度，你想提議每天早上開個十分鐘的站立會議。"
      options:
        - "We have to do a daily meeting."
        - "What if we had a quick ten-minute check-in every morning?"
        - "How about we must have a daily meeting?"
      answer: 1
      explain: "第一句 have to 語氣太強，聽起來像命令；第三句 how about 是在提建議，後面再加 must 互相矛盾。"
    task: "用這個句型向家人提議：今年過年不回老家，改成全家出國。"
    match: ["what if we"]
    mistake:
      wrong: "We have to change the plan.（其實只是建議）"
      right: "What if we changed the plan? / We could change the plan."
      why: "中文「我們要…」常常只是建議，直翻成 have to 聽起來像命令。"

  - id: how-about-ing
    pack: suggest
    pattern: "How about + V-ing ...?"
    meaning: "……怎麼樣？"
    when: "輕鬆地提出建議，生活和工作都常用；後面接動名詞（V-ing）或名詞。"
    examples:
      - en: "How about grabbing dinner after the movie?"
        zh: "看完電影一起吃個晚餐怎麼樣？"
      - en: "How about sending the client a short demo video first?"
        zh: "先寄一支簡短的展示影片給客戶怎麼樣？"
    choice:
      situation: "朋友說週末不知道要做什麼，你想提議去爬山。"
      options:
        - "How about going hiking this Saturday?"
        - "How about to go hiking this Saturday?"
        - "How about go to hiking this Saturday?"
      answer: 0
      explain: "how about 後面接 V-ing 或名詞，不接 to + 原形動詞；第三句 go hiking 中間也不加 to。"
    task: "用這個句型提議一個週五下班後的活動。"
    match: ["how about"]
    mistake:
      wrong: "How about to go ...?"
      right: "How about going ...?"
      why: "中文「去…怎麼樣」動詞不變形；英文 about 是介系詞，後面要接 V-ing。"

  - id: one-option
    pack: suggest
    pattern: "One option would be to ..."
    meaning: "其中一個做法是……"
    when: "提出幾個可能方案中的一個，語氣中立、不強迫，適合正式討論。"
    examples:
      - en: "One option would be to take the night bus and save on a hotel."
        zh: "其中一個做法是搭夜車，省下一晚住宿。"
      - en: "One option would be to hire a freelancer for the busy season."
        zh: "其中一個做法是旺季時找接案的人幫忙。"
    choice:
      situation: "會議上大家在想怎麼處理客服信件爆量，你想提出一個可能的方案。"
      options:
        - "You should hire more people."
        - "One option would be hire part-time staff."
        - "One option would be to set up an FAQ page so customers can find answers themselves."
      answer: 2
      explain: "第一句 you should 把事情丟給別人，在會議上聽起來像在指揮；第二句 would be 後面要接 to + 原形動詞。"
    task: "用這個句型給一個建議：朋友想學英文，但說自己沒時間。"
    match: ["one option"]

  - id: been-thinking
    pack: suggest
    pattern: "Here's what I've been thinking: ..."
    meaning: "我一直在想的是……"
    when: "要提出一個想了一陣子的點子時，先預告，讓大家注意聽；開會或家庭討論都適用。"
    examples:
      - en: "Here's what I've been thinking: we could rent a bigger place together and share the costs."
        zh: "我一直在想：我們可以一起租大一點的地方，分攤費用。"
      - en: "Here's what I've been thinking: we could move the weekly report to a shared dashboard."
        zh: "我一直在想的是，我們可以把週報改成共用的儀表板。"
    choice:
      situation: "會議快結束時，你想提出一個醞釀很久的流程改善點子。"
      options:
        - "I have an idea. You all listen."
        - "Here's what I've been thinking: we could automate the monthly invoices."
        - "I always think that we can automatic the invoices."
      answer: 1
      explain: "第一句 you all listen 像在下命令；第三句 always think 是「一直都這樣認為」，而且 automatic 是形容詞，動詞是 automate。"
    task: "用這個句型向朋友提出一個你最近在想的計畫（例如一起報名課程）。"
    match: ["been thinking"]

  # ---------------------------------------------------------------
  # D. Agreeing / building on (3)
  # ---------------------------------------------------------------
  - id: fair-point
    pack: agree
    pattern: "That's a fair point."
    meaning: "你說得有道理。"
    when: "承認對方說得對，即使不完全同意也可以用；後面常接 and 補充，或接 but 再提自己的看法。"
    examples:
      - en: "That's a fair point. A smaller apartment would be easier to clean."
        zh: "你說得有道理，小一點的公寓比較好打掃。"
      - en: "That's a fair point, but we still need the client's approval first."
        zh: "你說得有道理，但我們還是要先拿到客戶的同意。"
    choice:
      situation: "同事指出你的報價沒算到運費，你覺得他說得對。"
      options:
        - "That's a fair point. I'll add shipping costs to the estimate."
        - "You are right point."
        - "Your saying is reasonable."
      answer: 0
      explain: "第二句把 You're right 和 good point 混在一起了；第三句是中文「你的說法很合理」直翻，英文不會說 your saying。"
    task: "用這個句型回應：朋友說「買房不如租房，因為比較有彈性」。"
    match: ["fair point"]

  - id: that-could-work
    pack: agree
    pattern: "That could work, as long as ..."
    meaning: "那應該可行，只要……"
    when: "同意一個提議時順便加上條件，表示你有認真考慮，而不是隨便附和。"
    examples:
      - en: "That could work, as long as we book the tickets this week."
        zh: "那應該可行，只要我們這週把票訂好。"
      - en: "That could work, as long as legal reviews the contract first."
        zh: "那應該行得通，只要法務先看過合約。"
    choice:
      situation: "主管提議你下個月開始每週遠端工作兩天，你同意，但希望網路費能報帳。"
      options:
        - "OK, can. But the internet fee you pay."
        - "That can work if the internet fee will be covered."
        - "That could work, as long as the company covers the internet costs."
      answer: 2
      explain: "第一句是中文「可以啊」直翻，叫主管付錢也太直接；第二句 if 子句不用 will，應說 if the fee is covered。"
    task: "用這個句型有條件地同意：朋友提議下次旅行住民宿。"
    match: ["could work"]
    mistake:
      wrong: "If the fee will be covered, ..."
      right: "If the fee is covered, ..."
      why: "中文「如果之後會…」容易直翻成 if…will，但英文條件句用現在式表示未來。"

  - id: building-on
    pack: agree
    pattern: "I liked ...'s point about ..., because ..."
    meaning: "我很認同某某提到的……，因為……"
    when: "開會時接別人的話：先點名肯定對方的觀點再延伸，讓討論連貫，也讓同事覺得被聽見。"
    examples:
      - en: "I liked Amy's point about eating out less, because we'd also eat healthier."
        zh: "我很認同 Amy 說要少外食，因為這樣我們也會吃得比較健康。"
      - en: "I liked Kevin's point about simplifying the sign-up form, because that's where most users drop off."
        zh: "我很認同 Kevin 說要簡化註冊表單，因為大部分使用者就是在那裡流失的。"
    choice:
      situation: "會議上 Lisa 提議把客戶問卷縮短，你想接她的話並補充理由。"
      options:
        - "Lisa said it. I also same."
        - "I liked Lisa's point about shortening the survey, because long surveys get fewer responses."
        - "I agree Lisa's point, because long surveys is bad."
      answer: 1
      explain: "第一句是中文「我也一樣」直翻；第三句 agree 後面要加 with，而且 surveys 是複數，動詞要用 are。"
    task: "用這個句型接話：朋友剛說「旅行時行程少排一點比較好玩」，你同意並補充理由。"
    match: ["point about"]
    mistake:
      wrong: "I agree Lisa's point."
      right: "I agree with Lisa's point."
      why: "中文「同意某人」不需要介系詞，英文 agree 後面要接 with + 人或觀點。"

  # ---------------------------------------------------------------
  # E. Clarifying (4)
  # ---------------------------------------------------------------
  - id: what-i-mean-is
    pack: clarify
    pattern: "What I mean is ..."
    meaning: "我的意思是……"
    when: "發現對方沒聽懂、或自己說得不夠清楚時，用來重新說明重點。"
    examples:
      - en: "What I mean is, I'm happy to cook, but I need someone else to do the dishes."
        zh: "我的意思是，我很樂意煮飯，但需要別人來洗碗。"
      - en: "What I mean is, the feature works, but it's too slow for daily use."
        zh: "我的意思是，功能可以用，但太慢了，沒辦法每天用。"
    choice:
      situation: "你說「這個方案有點問題」，同事以為你要整個推翻。你想說清楚只是要改一小部分。"
      options:
        - "What I mean is, we only need to change the pricing part."
        - "My meaning is we change only the price part."
        - "I mean is we only change the price."
      answer: 0
      explain: "第二句 my meaning is 是中文「我的意思是」直翻，不自然；第三句把 I mean 和 What I mean is 混在一起了。"
    task: "用這個句型澄清：你說「我不太想去聚餐」，朋友以為你討厭大家，其實你只是太累。"
    match: ["what i mean"]
    mistake:
      wrong: "My meaning is ..."
      right: "What I mean is ... / I mean, ..."
      why: "中文「我的意思是」直翻成 my meaning is，英文母語者不這樣說。"

  - id: in-other-words
    pack: clarify
    pattern: "In other words, ..."
    meaning: "換句話說，……"
    when: "把剛剛說的內容換個更簡單或更直接的方式講，常用來下結論或幫對方抓重點。"
    examples:
      - en: "The store opens at ten and the drive takes an hour. In other words, we can sleep in."
        zh: "店十點才開，開車一小時。換句話說，我們可以睡晚一點。"
      - en: "Sales went up, but costs went up even more. In other words, we lost money this quarter."
        zh: "業績有成長，但成本漲得更多。換句話說，我們這一季虧錢了。"
    choice:
      situation: "你剛解釋了一長串新的請假規定，想用一句話幫大家總結。"
      options:
        - "In another word, you must apply three days early."
        - "Other words, you need to apply three days early."
        - "In other words, you need to request time off at least three days ahead."
      answer: 2
      explain: "固定說法是 in other words：要有 in，words 也要加 s。"
    task: "先說兩句關於你通勤的事實，再用 In other words 總結。"
    match: ["in other words"]

  - id: put-it-this-way
    pack: clarify
    pattern: "Let me put it this way: ..."
    meaning: "我換個方式說：……"
    when: "直接解釋說不清楚時，改用比喻、例子或更直白的說法；也常用來委婉帶出真話。"
    examples:
      - en: "Let me put it this way: if the hotel room were any smaller, we'd be sleeping in the hallway."
        zh: "我換個方式說：那間飯店房間要是再小一點，我們就要睡走廊了。"
      - en: "Let me put it this way: if this bug reaches users, we'll get a lot of angry emails."
        zh: "我換個方式說：要是這個 bug 被使用者遇到，我們會收到一堆生氣的信。"
    choice:
      situation: "你解釋為什麼要先備份資料，主管似乎覺得不重要。你想換個更直白的說法。"
      options:
        - "I say again: backup is important."
        - "Let me put it this way: if the server crashes tonight, we lose a month of work."
        - "Let me say by another way: backup is important."
      answer: 1
      explain: "第一句只是重複一次，沒有換方式說明；第三句 say by another way 是中文「換個方式說」直翻，英文說 put it another way 或 put it this way。"
    task: "用這個句型向朋友解釋你為什麼不想養貓。"
    match: ["put it this way"]

  - id: so-youre-saying
    pack: clarify
    pattern: "So what you're saying is ..., right?"
    meaning: "所以你的意思是……，對嗎？"
    when: "用自己的話重述對方的意思來確認理解，避免誤會，開會時特別好用。"
    examples:
      - en: "So what you're saying is the party is at your place, not the restaurant, right?"
        zh: "所以你的意思是派對在你家，不是在餐廳，對嗎？"
      - en: "So what you're saying is we need the final files by Wednesday, right?"
        zh: "所以你的意思是我們週三前要交最終檔案，對嗎？"
    choice:
      situation: "客戶講了很久，你理解的重點是他想延後兩週付款，你想確認。"
      options:
        - "You mean delay two weeks, yes or no?"
        - "So you are saying is you want to pay later?"
        - "So what you're saying is you'd like to delay the payment by two weeks, right?"
      answer: 2
      explain: "第一句 yes or no 像在逼問，對客戶不禮貌；第二句 you are saying 和 is 重複了，要嘛說 So you're saying ...，要嘛說 So what you're saying is ...。"
    task: "用這個句型確認：朋友說他下個月可能要搬到高雄，但還沒決定。"
    match: ["so what you", "saying"]

  # ---------------------------------------------------------------
  # F. Meetings (3)
  # ---------------------------------------------------------------
  - id: sorry-to-interrupt
    pack: meeting
    pattern: "Sorry to interrupt, but ..."
    meaning: "不好意思打斷一下，……"
    when: "別人正在說話，但你有急事或重要資訊必須插進來時使用：先道歉，再說重點。"
    examples:
      - en: "Sorry to interrupt, but your phone has been ringing for a while."
        zh: "不好意思打斷一下，你的手機響一陣子了。"
      - en: "Sorry to interrupt, but the client just joined the call."
        zh: "不好意思打斷一下，客戶剛剛加入通話了。"
    choice:
      situation: "同事正在報告，你發現他投影的是舊版數字，必須馬上提醒。"
      options:
        - "Sorry to interrupt, but I think those are last month's numbers."
        - "Wait wait, wrong numbers!"
        - "Excuse me to interrupt, the numbers are old."
      answer: 0
      explain: "第二句太急躁，在會議上很失禮；第三句 excuse me to interrupt 不是英文說法，要說 sorry to interrupt 或 excuse me for interrupting。"
    task: "用這個句型打斷：家人正在聊天，你要提醒大家計程車已經到了。"
    match: ["sorry to interrupt"]

  - id: jump-in
    pack: meeting
    pattern: "Can I jump in here?"
    meaning: "我可以插個話嗎？"
    when: "討論熱烈時想加入發言，用這句徵求同意；比直接插話有禮貌，又比 Sorry to interrupt 輕鬆。"
    examples:
      - en: "Can I jump in here? I actually went to that beach last summer."
        zh: "我可以插個話嗎？我去年夏天剛好去過那個海灘。"
      - en: "Can I jump in here? We tried a similar campaign last year, and the results were mixed."
        zh: "我可以插個話嗎？我們去年試過類似的活動，結果好壞參半。"
    choice:
      situation: "大家在討論要不要換廠商，你剛好跟其中一家合作過，想加入討論。"
      options:
        - "Let me say! I worked with them before."
        - "Can I jump in here? I've worked with that vendor before."
        - "Can I insert a word? I have worked with them last year."
      answer: 1
      explain: "第一句太突兀；第三句 insert a word 是中文「插話」直翻，而且有 last year 這種明確的過去時間，要用過去式 worked，不用 have worked。"
    task: "用這個句型加入討論：朋友在聊日本自由行，你想分享你的訂房經驗。"
    match: ["jump in"]
    mistake:
      wrong: "I have worked with them last year."
      right: "I worked with them last year."
      why: "中文「有…過」容易對應到現在完成式；但句子裡有明確的過去時間（last year）就要用過去式。"

  - id: status-update
    pack: meeting
    pattern: "So far we've ... The next step is ..."
    meaning: "目前我們已經……，下一步是……"
    when: "報告進度時先說已完成的、再說接下來要做的，聽的人很快就能掌握狀況；有落後的話，開頭先講結論（We're on track / We're a week behind because ...）。"
    examples:
      - en: "So far we've booked the flights and the hotel. The next step is planning what to do each day."
        zh: "目前我們已經訂好機票和飯店，下一步是排每天的行程。"
      - en: "So far we've finished the design and half of the coding. The next step is internal testing."
        zh: "目前設計已經完成，程式也寫了一半，下一步是內部測試。"
    choice:
      situation: "週會上主管問你負責的網站改版進度如何。"
      options:
        - "Now we have done design. Next we will do testing maybe."
        - "We are a week behind due to the vendor was late."
        - "We're on track. So far we've finished the design, and the next step is user testing."
      answer: 2
      explain: "第一句 now we have done 不自然，結尾的 maybe 也讓進度聽起來很不確定；第二句 due to 後面不能接句子，要說 because the vendor was late 或 due to the vendor's delay。"
    task: "用這個句型報告一件你正在進行的事的進度（工作、搬家、準備考試都可以）。"
    match: ["so far", "next step"]
    mistake:
      wrong: "We're behind due to the vendor was late."
      right: "We're behind because the vendor was late. / ... due to the vendor's delay."
      why: "中文「因為」後面什麼都能接，但英文 due to 後面只能接名詞。"

  # ---------------------------------------------------------------
  # G. Small talk (3)
  # ---------------------------------------------------------------
  - id: been-up-to
    pack: smalltalk
    pattern: "What have you been up to lately?"
    meaning: "你最近在忙什麼？"
    when: "跟一陣子沒見的朋友或同事開啟閒聊；開放式問題讓對方好接話，比 How are you? 更容易聊下去。"
    examples:
      - en: "Hey, it's been ages! What have you been up to lately?"
        zh: "嘿，好久不見！你最近在忙什麼？"
      - en: "What have you been up to since you moved to the marketing team?"
        zh: "你調到行銷部之後都在忙些什麼？"
    choice:
      situation: "在電梯遇到很久沒聊的前同事，你想自然地開啟話題。"
      options:
        - "Hey! What have you been up to lately?"
        - "Hey! Are you busy recently?"
        - "Hey! What are you busy recently?"
      answer: 0
      explain: "第二句是中文「最近忙嗎」直翻，只能回答 yes 或 no，很難聊下去；第三句文法錯，應是 What have you been busy with?。"
    task: "用這個句型開啟閒聊，再追問一個細節（例如 What made you decide to ...?）。"
    match: ["been up to"]

  - id: got-you-into
    pack: smalltalk
    pattern: "What got you into ...?"
    meaning: "你是怎麼開始接觸……的？"
    when: "對方提到興趣或工作時，用這句追問來龍去脈，讓對方多說一點，閒聊就會自然延伸。"
    examples:
      - en: "What got you into rock climbing?"
        zh: "你是怎麼開始玩攀岩的？"
      - en: "What got you into product design in the first place?"
        zh: "你一開始是怎麼走上產品設計這條路的？"
    choice:
      situation: "新同事說他週末都在練衝浪，你想表示興趣並請他多分享。"
      options:
        - "Surfing? Why you like surfing?"
        - "Oh, nice! What got you into surfing?"
        - "Surfing is dangerous, isn't it?"
      answer: 1
      explain: "第一句少了助動詞，應是 Why do you like ...，而且用 why 開頭有點像質問；第三句直接下負面評論，話題容易卡住。"
    task: "用這個句型追問：朋友說他最近開始學手沖咖啡。"
    match: ["got you into"]

  - id: last-time-you-mentioned
    pack: smalltalk
    pattern: "Last time you mentioned ... How did it go?"
    meaning: "上次你提到……，後來怎麼樣了？"
    when: "記得對方之前說過的事並主動追問，會讓人覺得你有在聽，是拉近關係最有效的閒聊句型。"
    examples:
      - en: "Last time you mentioned your sister's wedding. How did it go?"
        zh: "上次你提到你姊姊的婚禮，後來辦得怎麼樣？"
      - en: "Last time you mentioned the job interview. How did it go?"
        zh: "上次你提到那個面試，結果怎麼樣？"
    choice:
      situation: "上週同事說他要去面試新工作，今天在茶水間碰到他。"
      options:
        - "Last time you said you will go to an interview. Is it success?"
        - "Did you pass the interview or not?"
        - "Last time you mentioned an interview. How did it go?"
      answer: 2
      explain: "第一句轉述過去說的話要用 would（you said you would），is it success 也不是英文；第二句 or not 聽起來像在逼問，太直接。"
    task: "用這個句型追問一個朋友之前提過的計畫（旅行、搬家、考試都可以）。"
    match: ["last time you mentioned", "how did"]
    mistake:
      wrong: "Last time you said you will go ..."
      right: "Last time you said you would go ..."
      why: "中文轉述別人的話不用改時態；英文轉述過去說的話時，will 通常要改成 would。"
`,L=`# Daily vocabulary - intermediate (CEFR B1-B2)
# High-utility words for work and everyday adult conversation, chosen for what
# Mandarin speakers tend to misuse or lack. All example sentences are original.
level: intermediate
words:
  # ---------------------------------------------------------------
  # Phrasal verbs & fixed phrases (20)
  # ---------------------------------------------------------------
  - id: follow-up-on
    word: "follow up on"
    pos: "phr."
    phonetic: "/ˈfɑːloʊ ʌp ɑːn/"
    meaning: "追蹤、後續處理（某件事）"
    example:
      en: "I'll follow up on the invoice with the client tomorrow."
      zh: "我明天會跟客戶追一下發票的事。"
    collocations: ["follow up with someone", "a follow-up email"]
    note: "follow up on + 事情；follow up with + 人。名詞 follow-up 中間有連字號。"

  - id: look-into
    word: "look into"
    pos: "phr."
    phonetic: "/lʊk ˈɪntuː/"
    meaning: "調查、研究一下"
    example:
      en: "I'll look into why the order hasn't shipped yet."
      zh: "我會查一下為什麼訂單還沒出貨。"
    collocations: ["look into a problem", "I'll look into it"]
    note: "look into = 調查（還不知道答案）；look at = 看一眼；look for = 找。"

  - id: run-into
    word: "run into"
    pos: "phr."
    phonetic: "/rʌn ˈɪntuː/"
    meaning: "遇到（問題）；巧遇（某人）"
    example:
      en: "We ran into a few problems while moving the data to the new server."
      zh: "我們把資料搬到新伺服器時遇到了一些問題。"
    collocations: ["run into trouble", "run into an old friend"]
    note: "遇到困難說 run into problems，比 meet problems 自然；meet 通常只用在人。"

  - id: push-back
    word: "push back"
    pos: "phr."
    phonetic: "/pʊʃ ˈbæk/"
    meaning: "反對、抗拒；把時間往後延"
    example:
      en: "Several managers pushed back on the new dress code."
      zh: "好幾位主管對新的服裝規定提出反對。"
    collocations: ["push back on something", "push the meeting back", "get pushback"]
    note: "push back on + 事情 = 提出反對；push + 事情 + back = 延後（push the deadline back）。"

  - id: get-back-to
    word: "get back to"
    pos: "phr."
    phonetic: "/ɡɛt ˈbæk tuː/"
    meaning: "之後再回覆（某人）"
    example:
      en: "Let me check my calendar and get back to you by Friday."
      zh: "我查一下行事曆，週五前回覆你。"
    collocations: ["get back to someone", "get back to you on that"]
    note: "中文「我再回覆你」不要說 reply you later（reply 要加 to）；get back to you 最自然。"

  - id: figure-out
    word: "figure out"
    pos: "phr."
    phonetic: "/ˈfɪɡjər aʊt/"
    meaning: "想出、搞懂"
    example:
      en: "I finally figured out how to change the language settings."
      zh: "我終於搞懂怎麼改語言設定了。"
    collocations: ["figure out how to", "figure it out", "figure out what happened"]
    note: "代名詞要放中間：figure it out，不說 figure out it。"

  - id: end-up
    word: "end up"
    pos: "phr."
    phonetic: "/ɛnd ˈʌp/"
    meaning: "最後（結果）……"
    example:
      en: "We planned to cook, but we ended up ordering pizza."
      zh: "我們本來打算自己煮，結果最後叫了披薩。"
    collocations: ["end up + V-ing", "end up in a place"]
    note: "end up 後面接 V-ing：ended up ordering，不是 ended up to order。"

  - id: deal-with
    word: "deal with"
    pos: "phr."
    phonetic: "/ˈdiːl wɪð/"
    meaning: "處理、應付"
    example:
      en: "She deals with customer complaints almost every day."
      zh: "她幾乎每天都要處理客訴。"
    collocations: ["deal with a problem", "hard to deal with"]
    note: "一定要有 with：deal with a problem，不說 deal a problem。"

  - id: come-up-with
    word: "come up with"
    pos: "phr."
    phonetic: "/kʌm ˈʌp wɪð/"
    meaning: "想出（點子、方案）"
    example:
      en: "Can you come up with a better name for the newsletter?"
      zh: "你能想一個更好的電子報名稱嗎？"
    collocations: ["come up with an idea", "come up with a plan"]
    note: "come up with 是「自己想出來」；think of 偏向「想到、記起」。"

  - id: bring-up
    word: "bring up"
    pos: "phr."
    phonetic: "/brɪŋ ˈʌp/"
    meaning: "提起（話題）"
    example:
      en: "I'll bring up the parking issue at the next team meeting."
      zh: "我會在下次團隊會議提出停車的問題。"
    collocations: ["bring up a topic", "bring it up"]
    note: "bring up 也有「養育」的意思（I was brought up in Tainan.），要看上下文判斷。"

  - id: set-up
    word: "set up"
    pos: "phr."
    phonetic: "/sɛt ˈʌp/"
    meaning: "安排、設定、建立"
    example:
      en: "Could you set up a call with the design team next week?"
      zh: "下週可以幫我跟設計團隊約一個通話嗎？"
    collocations: ["set up a meeting", "set up an account"]
    note: "動詞 set up 是兩個字；名詞 setup 是一個字（The setup only takes five minutes.）。"

  - id: catch-up
    word: "catch up"
    pos: "phr."
    phonetic: "/kætʃ ˈʌp/"
    meaning: "敘舊；跟上進度"
    example:
      en: "Let's grab coffee and catch up sometime next week."
      zh: "下週找時間喝個咖啡聊聊近況吧。"
    collocations: ["catch up with someone", "catch up on work"]
    note: "catch up with + 人 = 跟上或敘舊；catch up on + 事 = 補做落後的事。"

  - id: sort-out
    word: "sort out"
    pos: "phr."
    phonetic: "/sɔːrt ˈaʊt/"
    meaning: "解決、處理好"
    example:
      en: "Don't worry about the hotel booking. I'll sort it out tonight."
      zh: "飯店訂房的事別擔心，我今晚會處理好。"
    collocations: ["sort out a problem", "sort things out"]

  - id: take-care-of
    word: "take care of"
    pos: "phr."
    phonetic: "/teɪk ˈkɛr əv/"
    meaning: "照顧；負責處理"
    example:
      en: "Can you take care of the slides while I write the summary?"
      zh: "我寫摘要的時候，你可以負責投影片嗎？"
    collocations: ["take care of a child", "I'll take care of it"]
    note: "除了「照顧」，職場上常用來表示「這件事交給我」：I'll take care of it."

  - id: put-off
    word: "put off"
    pos: "phr."
    phonetic: "/pʊt ˈɔːf/"
    meaning: "拖延、延後"
    example:
      en: "I keep putting off my dentist appointment."
      zh: "我一直拖著不去看牙醫。"
    collocations: ["put off + V-ing", "put it off"]
    note: "後面接 V-ing：put off calling her；代名詞放中間：put it off。"

  - id: call-off
    word: "call off"
    pos: "phr."
    phonetic: "/kɔːl ˈɔːf/"
    meaning: "取消（活動、計畫）"
    example:
      en: "They called off the outdoor concert because of the typhoon."
      zh: "因為颱風，他們取消了戶外演唱會。"
    collocations: ["call off a meeting", "call off the search"]
    note: "call off = cancel，口語常用；不要和 call on（拜訪、點名）搞混。"

  - id: go-over
    word: "go over"
    pos: "phr."
    phonetic: "/ɡoʊ ˈoʊvər/"
    meaning: "檢查、仔細看過一遍"
    example:
      en: "Let's go over the budget one more time before we send it."
      zh: "寄出去之前，我們再把預算看一次。"
    collocations: ["go over the details", "go over a report"]

  - id: in-charge-of
    word: "in charge of"
    pos: "phr."
    phonetic: "/ɪn ˈtʃɑːrdʒ əv/"
    meaning: "負責、主管（某事）"
    example:
      en: "Who's in charge of the year-end party this year?"
      zh: "今年尾牙誰負責？"
    collocations: ["be in charge of", "put someone in charge"]
    note: "be in charge of + 事，意思接近 be responsible for。"

  - id: make-sense
    word: "make sense"
    pos: "phr."
    phonetic: "/meɪk ˈsɛns/"
    meaning: "合理、說得通"
    example:
      en: "Your plan makes sense, but it might cost too much."
      zh: "你的計畫合理，但可能花費太高。"
    collocations: ["Does that make sense?", "it makes sense to + V", "make sense of something"]
    note: "想說「我懂了」可以說 That makes sense；I make sense 是「我說的有道理」，意思不同。"

  - id: in-advance
    word: "in advance"
    pos: "phr."
    phonetic: "/ɪn ədˈvæns/"
    meaning: "事先、提前"
    example:
      en: "Please let me know in advance if you can't make it."
      zh: "如果你不能來，請事先告訴我。"
    collocations: ["book in advance", "thanks in advance", "three days in advance"]
    note: "不要說 in advance before（意思重複）；「提前三天」說 three days in advance。"

  # ---------------------------------------------------------------
  # Nouns (10)
  # ---------------------------------------------------------------
  - id: concern
    word: "concern"
    pos: "n."
    phonetic: "/kənˈsɝːn/"
    meaning: "擔心、顧慮"
    example:
      en: "Her main concern is whether the apartment gets enough sunlight."
      zh: "她主要擔心的是公寓採光夠不夠。"
    collocations: ["raise a concern", "main concern", "concerns about"]
    note: "用名詞委婉說「我擔心……」：I have a concern about ...，比 I'm worried 更適合職場。"

  - id: priority
    word: "priority"
    pos: "n."
    phonetic: "/praɪˈɔːrəti/"
    meaning: "優先事項"
    example:
      en: "Fixing the login bug is our top priority this week."
      zh: "修好登入的 bug 是我們這週的第一優先。"
    collocations: ["top priority", "set priorities", "prioritize something"]

  - id: deadline
    word: "deadline"
    pos: "n."
    phonetic: "/ˈdɛdlaɪn/"
    meaning: "截止期限"
    example:
      en: "The deadline for applications is next Monday at noon."
      zh: "申請截止時間是下週一中午。"
    collocations: ["meet a deadline", "miss a deadline", "a tight deadline"]
    note: "趕上期限說 meet a deadline，不是 catch a deadline。"

  - id: effect
    word: "effect"
    pos: "n."
    phonetic: "/ɪˈfɛkt/"
    meaning: "影響、效果"
    example:
      en: "The new policy had a big effect on how people commute."
      zh: "新政策對大家通勤的方式影響很大。"
    collocations: ["have an effect on", "side effect", "take effect"]
    note: "effect 是名詞，affect 是動詞：A affects B = A has an effect on B。"

  - id: feedback
    word: "feedback"
    pos: "n."
    phonetic: "/ˈfiːdbæk/"
    meaning: "意見回饋"
    example:
      en: "Thanks for the feedback. I'll update the slides tonight."
      zh: "謝謝你的回饋，我今晚會更新投影片。"
    collocations: ["give feedback", "get feedback on", "positive feedback"]
    note: "不可數名詞，不加 s，也不說 a feedback；要數就說 a piece of feedback。"

  - id: advice
    word: "advice"
    pos: "n."
    phonetic: "/ədˈvaɪs/"
    meaning: "建議、忠告"
    example:
      en: "My aunt gave me some really useful advice about renting."
      zh: "我阿姨給了我一些很實用的租屋建議。"
    collocations: ["give advice", "a piece of advice", "ask for advice"]
    note: "不可數名詞，不說 advices 或 an advice；動詞是 advise /ədˈvaɪz/。"

  - id: option
    word: "option"
    pos: "n."
    phonetic: "/ˈɑːpʃən/"
    meaning: "選擇、選項"
    example:
      en: "We have two options: repair the old laptop or buy a new one."
      zh: "我們有兩個選擇：修舊筆電，或買一台新的。"
    collocations: ["have no option but to", "a good option", "keep your options open"]

  - id: budget
    word: "budget"
    pos: "n."
    phonetic: "/ˈbʌdʒɪt/"
    meaning: "預算"
    example:
      en: "We're already over budget, and the trip has only just started."
      zh: "旅行才剛開始，我們就已經超出預算了。"
    collocations: ["over budget", "on a tight budget", "budget for something"]
    note: "「預算有限」說 on a tight budget；「超支」說 over budget。"

  - id: opportunity
    word: "opportunity"
    pos: "n."
    phonetic: "/ˌɑːpərˈtuːnəti/"
    meaning: "機會"
    example:
      en: "This project is a great opportunity to learn new skills."
      zh: "這個專案是學習新技能的好機會。"
    collocations: ["an opportunity to + V", "take the opportunity", "job opportunity"]
    note: "比 chance 正式，多指好的機會；後面接 to + V 或 for + 名詞。"

  - id: colleague
    word: "colleague"
    pos: "n."
    phonetic: "/ˈkɑːliːɡ/"
    meaning: "同事"
    example:
      en: "One of my colleagues recommended this noodle shop."
      zh: "這間麵店是我一個同事推薦的。"
    collocations: ["a former colleague", "work colleagues"]
    note: "比 coworker 稍正式；重音在第一音節 COL-league。"

  # ---------------------------------------------------------------
  # Verbs (12)
  # ---------------------------------------------------------------
  - id: affect
    word: "affect"
    pos: "v."
    phonetic: "/əˈfɛkt/"
    meaning: "影響"
    example:
      en: "The heavy rain affected flights all over the island."
      zh: "豪雨影響了全台各地的班機。"
    collocations: ["be affected by", "directly affect"]
    note: "affect 是動詞，後面直接接受詞，不加 on：affect sales，不說 affect on sales。"

  - id: suggest
    word: "suggest"
    pos: "v."
    phonetic: "/səɡˈdʒɛst/"
    meaning: "建議"
    example:
      en: "I suggest taking the earlier train, just in case."
      zh: "我建議搭早一點的火車，以防萬一。"
    collocations: ["suggest + V-ing", "suggest (that) someone do", "suggest something to someone"]
    note: "不說 suggest someone to do：✗ I suggest you to go → ✓ I suggest (that) you go / I suggest going。"

  - id: discuss
    word: "discuss"
    pos: "v."
    phonetic: "/dɪˈskʌs/"
    meaning: "討論"
    example:
      en: "We discussed the new schedule for almost two hours."
      zh: "我們討論新的排班表討論了快兩小時。"
    collocations: ["discuss a plan", "discuss something with someone", "a discussion about"]
    note: "discuss 後面直接接受詞，不加 about；名詞 discussion 才接 about。"

  - id: mention
    word: "mention"
    pos: "v."
    phonetic: "/ˈmɛnʃən/"
    meaning: "提到"
    example:
      en: "She mentioned that she's moving to Tainan next month."
      zh: "她提到她下個月要搬去台南。"
    collocations: ["mention something to someone", "as I mentioned", "not to mention"]
    note: "後面直接接受詞或 that 子句，不說 mention about。"

  - id: remind
    word: "remind"
    pos: "v."
    phonetic: "/rɪˈmaɪnd/"
    meaning: "提醒"
    example:
      en: "Can you remind me to call the landlord tonight?"
      zh: "你可以提醒我今晚打給房東嗎？"
    collocations: ["remind someone to + V", "remind someone of", "a reminder"]
    note: "「提醒我」是 remind me，不是 remember me（remember = 記得）。"

  - id: recommend
    word: "recommend"
    pos: "v."
    phonetic: "/ˌrɛkəˈmɛnd/"
    meaning: "推薦、建議"
    example:
      en: "Can you recommend a good dentist near the office?"
      zh: "你可以推薦公司附近一間好的牙醫嗎？"
    collocations: ["recommend something to someone", "highly recommend", "recommend + V-ing"]
    note: "跟 suggest 一樣不說 recommend someone to do；說 I recommend (that) you ... 或 I recommend + V-ing。"

  - id: attend
    word: "attend"
    pos: "v."
    phonetic: "/əˈtɛnd/"
    meaning: "參加、出席"
    example:
      en: "About fifty people attended the workshop on Saturday."
      zh: "大約五十人參加了週六的工作坊。"
    collocations: ["attend a meeting", "attend a wedding", "attend school"]
    note: "attend 直接接受詞，不加 to；口語也常說 go to 或 join。"

  - id: arrange
    word: "arrange"
    pos: "v."
    phonetic: "/əˈreɪndʒ/"
    meaning: "安排"
    example:
      en: "I've arranged a taxi to pick you up at the airport."
      zh: "我已經安排計程車去機場接你了。"
    collocations: ["arrange a meeting", "arrange for someone to + V"]

  - id: apologize
    word: "apologize"
    pos: "v."
    phonetic: "/əˈpɑːlədʒaɪz/"
    meaning: "道歉"
    example:
      en: "I apologize for the late reply. It's been a hectic week."
      zh: "抱歉這麼晚回覆，這週實在太忙了。"
    collocations: ["apologize to someone", "apologize for something"]
    note: "apologize to + 人 + for + 事：I apologized to her for being late；不說 apologize her。"

  - id: explain
    word: "explain"
    pos: "v."
    phonetic: "/ɪkˈspleɪn/"
    meaning: "解釋、說明"
    example:
      en: "Could you explain the new process to me one more time?"
      zh: "你可以再跟我解釋一次新流程嗎？"
    collocations: ["explain something to someone", "explain why", "explain how"]
    note: "不說 explain me；要說 explain it to me。"

  - id: consider
    word: "consider"
    pos: "v."
    phonetic: "/kənˈsɪdər/"
    meaning: "考慮"
    example:
      en: "We're considering moving the office closer to the MRT."
      zh: "我們正在考慮把辦公室搬到離捷運近一點的地方。"
    collocations: ["consider + V-ing", "seriously consider", "take something into consideration"]
    note: "後面接 V-ing，不接 to + V：considering moving，不是 considering to move。"

  - id: prefer
    word: "prefer"
    pos: "v."
    phonetic: "/prɪˈfɝː/"
    meaning: "比較喜歡、偏好"
    example:
      en: "I prefer working early in the morning to staying up late."
      zh: "比起熬夜，我比較喜歡一大早工作。"
    collocations: ["prefer A to B", "prefer to + V", "would prefer"]
    note: "比較兩者說 prefer A to B，不說 prefer A than B。"

  # ---------------------------------------------------------------
  # Adjectives (10)
  # ---------------------------------------------------------------
  - id: flexible
    word: "flexible"
    pos: "adj."
    phonetic: "/ˈflɛksəbəl/"
    meaning: "有彈性的、可以配合的"
    example:
      en: "My schedule is pretty flexible next week, so any day works."
      zh: "我下週時間蠻有彈性的，哪天都可以。"
    collocations: ["flexible hours", "flexible about something"]
    note: "I'm flexible. 就是「我都可以配合」，比 I'm OK with anything 自然。"

  - id: efficient
    word: "efficient"
    pos: "adj."
    phonetic: "/ɪˈfɪʃənt/"
    meaning: "有效率的"
    example:
      en: "The new system is much more efficient than our old spreadsheet."
      zh: "新系統比我們舊的試算表有效率多了。"
    collocations: ["energy-efficient", "an efficient way to + V"]
    note: "efficient 是不浪費時間和資源；effective 是「有效、達到效果」，兩者不同。"

  - id: reasonable
    word: "reasonable"
    pos: "adj."
    phonetic: "/ˈriːzənəbəl/"
    meaning: "合理的；（價格）公道的"
    example:
      en: "The rent is reasonable for such a central location."
      zh: "在這麼市中心的地段，這個房租算公道。"
    collocations: ["a reasonable price", "a reasonable request"]

  - id: convenient
    word: "convenient"
    pos: "adj."
    phonetic: "/kənˈviːniənt/"
    meaning: "（時間、地點）方便的"
    example:
      en: "Is Thursday afternoon convenient for you?"
      zh: "週四下午你方便嗎？"
    collocations: ["convenient for someone", "a convenient location"]
    note: "形容時間或地點，不形容人：✗ Are you convenient? → ✓ Is it convenient for you? / Are you free?"

  - id: available
    word: "available"
    pos: "adj."
    phonetic: "/əˈveɪləbəl/"
    meaning: "有空的；可取得的"
    example:
      en: "Are you available for a quick call this afternoon?"
      zh: "你今天下午有空簡短通個電話嗎？"
    collocations: ["available for", "available on Monday", "not available"]
    note: "問人有沒有空用 available 或 free，不用 convenient。"

  - id: responsible
    word: "responsible"
    pos: "adj."
    phonetic: "/rɪˈspɑːnsəbəl/"
    meaning: "負責的；有責任感的"
    example:
      en: "Who is responsible for ordering office supplies?"
      zh: "誰負責訂辦公用品？"
    collocations: ["be responsible for", "a responsible person"]
    note: "介系詞用 for：responsible for + 事 / V-ing。"

  - id: familiar
    word: "familiar"
    pos: "adj."
    phonetic: "/fəˈmɪljər/"
    meaning: "熟悉的"
    example:
      en: "Are you familiar with this part of the city?"
      zh: "你熟悉城市的這一區嗎？"
    collocations: ["familiar with", "look familiar"]
    note: "人熟悉某事：be familiar with；某事讓人覺得熟悉：be familiar to someone。"

  - id: complicated
    word: "complicated"
    pos: "adj."
    phonetic: "/ˈkɑːmplɪkeɪtɪd/"
    meaning: "複雜的"
    example:
      en: "The refund process is more complicated than it needs to be."
      zh: "退款流程比實際需要的還複雜。"
    collocations: ["a complicated situation", "it's complicated"]

  - id: confident
    word: "confident"
    pos: "adj."
    phonetic: "/ˈkɑːnfɪdənt/"
    meaning: "有自信的；有把握的"
    example:
      en: "I'm confident we can finish everything before the holiday."
      zh: "我有把握我們能在連假前把事情做完。"
    collocations: ["confident about", "feel confident"]
    note: "confident 是形容詞，名詞是 confidence：improve my confidence，不是 improve my confident。"

  - id: worth
    word: "worth"
    pos: "adj."
    phonetic: "/wɝːθ/"
    meaning: "值得（……的）"
    example:
      en: "The night market is definitely worth visiting."
      zh: "那個夜市絕對值得去逛逛。"
    collocations: ["worth + V-ing", "worth it", "worth the money"]
    note: "後面接 V-ing 或名詞：worth visiting，不說 worth to visit。"

  # ---------------------------------------------------------------
  # Adverbs (6)
  # ---------------------------------------------------------------
  - id: actually
    word: "actually"
    pos: "adv."
    phonetic: "/ˈæktʃuəli/"
    meaning: "其實、事實上"
    example:
      en: "I thought the exam would be hard, but it was actually pretty easy."
      zh: "我以為考試會很難，結果其實蠻簡單的。"
    collocations: ["Actually, ...", "I actually ..."]
    note: "actually 帶有「跟你以為的不一樣」的意味，常用來更正或轉折，不要每句都加。"

  - id: especially
    word: "especially"
    pos: "adv."
    phonetic: "/ɪˈspɛʃəli/"
    meaning: "尤其、特別是"
    example:
      en: "I love Tainan, especially the street food."
      zh: "我很愛台南，尤其是那裡的小吃。"
    collocations: ["especially when", "especially for"]
    note: "一般不放句首當開頭（✗ Especially, I like ...）；specially 是「特地」。"

  - id: eventually
    word: "eventually"
    pos: "adv."
    phonetic: "/ɪˈvɛntʃuəli/"
    meaning: "最後、終究"
    example:
      en: "It took twenty minutes, but we eventually found a parking spot."
      zh: "花了二十分鐘，但我們最後終於找到車位了。"
    collocations: ["eventually decide", "will eventually"]
    note: "強調「經過一段時間後終於」；不要和 occasionally（偶爾）搞混。"

  - id: basically
    word: "basically"
    pos: "adv."
    phonetic: "/ˈbeɪsɪkli/"
    meaning: "基本上、簡單說"
    example:
      en: "Basically, we need either more people or more time."
      zh: "簡單說，我們不是需要更多人，就是需要更多時間。"
    collocations: ["Basically, ...", "basically the same"]
    note: "用來把複雜的事講成重點；口語常用，但寫信時別用太多。"

  - id: otherwise
    word: "otherwise"
    pos: "adv."
    phonetic: "/ˈʌðərwaɪz/"
    meaning: "否則、不然"
    example:
      en: "Bring an umbrella; otherwise, you'll get soaked."
      zh: "帶把傘，不然你會淋濕。"
    collocations: ["otherwise, ...", "unless otherwise noted"]
    note: "otherwise 是副詞，連接兩個句子時前面要用句號或分號，不能只用逗號。"

  - id: approximately
    word: "approximately"
    pos: "adv."
    phonetic: "/əˈprɑːksɪmətli/"
    meaning: "大約"
    example:
      en: "The flight to Tokyo takes approximately three hours."
      zh: "飛東京大約三個小時。"
    collocations: ["approximately + 數字"]
    note: "比 about 正式，常用在報告和信件裡。"

  # ---------------------------------------------------------------
  # Prepositions (2)
  # ---------------------------------------------------------------
  - id: despite
    word: "despite"
    pos: "prep."
    phonetic: "/dɪˈspaɪt/"
    meaning: "儘管"
    example:
      en: "Despite the rain, the night market was packed."
      zh: "儘管下雨，夜市還是擠滿了人。"
    collocations: ["despite + 名詞 / V-ing", "despite the fact that"]
    note: "介系詞，後面接名詞或 V-ing，不加 of、也不直接接句子：✗ despite of / ✗ despite it rained。"

  - id: instead-of
    word: "instead of"
    pos: "prep."
    phonetic: "/ɪnˈstɛd əv/"
    meaning: "而不是、代替"
    example:
      en: "Let's take the MRT instead of driving. Parking downtown is a nightmare."
      zh: "我們搭捷運，不要開車了，市區停車太痛苦。"
    collocations: ["instead of + V-ing", "instead of + 名詞", "... instead（放句尾）"]
    note: "instead of 後面接名詞或 V-ing：instead of driving，不說 instead of drive。"
`,B=Object.assign({"./daily/en/advanced/patterns.yml":A,"./daily/en/advanced/vocab.yml":C,"./daily/en/beginner/patterns.yml":M,"./daily/en/beginner/vocab.yml":V,"./daily/en/intermediate/patterns.yml":_,"./daily/en/intermediate/vocab.yml":L});function D(n){try{return S.load(n)}catch(e){return console.error("Failed to parse daily practice YAML:",e),null}}function k(n,e,a){const i=B[`./daily/${n}/${e}/${a}.yml`];if(!i)return[];const d=D(i),c=(a==="patterns"?d?.patterns:d?.words)||[],o=a==="patterns"?"pattern":"word";return c.map(s=>({...s,id:`${o}:${e}:${s.id}`,level:e}))}function O(n,e="en"){return k(e,n,"patterns")}function q(n,e="en"){return k(e,n,"vocab")}const v="chatmate_daily_practice",m=["beginner","intermediate","advanced"],R=14,Y=3,E=1,P=5,F=2;function b(n=new Date){const e=n.getFullYear(),a=String(n.getMonth()+1).padStart(2,"0"),i=String(n.getDate()).padStart(2,"0");return`${e}-${a}-${i}`}function G(){try{const n=JSON.parse(localStorage.getItem("chatmate_placement_result")||"null");if(m.includes(n?.level))return n.level}catch{}return"intermediate"}function N(){try{const n=JSON.parse(localStorage.getItem(v)||"null");if(n&&m.includes(n.level)&&n.plans)return n}catch{}return{level:G(),plans:{}}}const l=H(N());function g(){const n=Object.keys(l.value.plans).sort();for(const e of n.slice(0,Math.max(0,n.length-R)))delete l.value.plans[e];try{localStorage.setItem(v,JSON.stringify(l.value))}catch{}}function f(n,e,a,i){const d=i.getDueWords(n),c=n.filter(p=>!i.getWordSRS(p.id)),o=e-Math.min(a,c.length),s=d.slice(0,o);for(const p of c){if(s.length>=e)break;s.push(p)}return s.map(p=>p.id)}function X(){const n=j(),e=h(()=>l.value.level),a=h(()=>O(e.value)),i=h(()=>q(e.value));function d(){return{level:e.value,patternIds:f(a.value,Y,E,n),wordIds:f(i.value,P,F,n),done:{}}}function c(){const t=b(),r=l.value.plans[t];r&&r.level===e.value||(l.value.plans[t]=d(),g())}c();const o=h(()=>l.value.plans[b()]||{level:e.value,patternIds:[],wordIds:[],done:{}}),s=h(()=>o.value.patternIds.map(t=>a.value.find(r=>r.id===t)).filter(Boolean)),p=h(()=>o.value.wordIds.map(t=>i.value.find(r=>r.id===t)).filter(Boolean)),u=h(()=>s.value.length+p.value.length),w=h(()=>[...o.value.patternIds,...o.value.wordIds].filter(t=>o.value.done[t]).length),I=h(()=>u.value>0&&w.value>=u.value);function x(t){return!n.getWordSRS(t)}function z(t,{correct:r,confidence:y}){const W=r?y:Math.min(y,2);n.recordReview(t,r,W),o.value.done[t]=!0,g()}function T(t){!m.includes(t)||t===l.value.level||(l.value.level=t,g(),c())}return{levels:m,level:e,todayPatterns:s,todayWords:p,totalCount:u,doneCount:w,isDoneToday:I,isDone:t=>!!o.value.done[t],isNew:x,completeItem:z,setLevel:T,ensureTodayPlan:c}}export{q as g,X as u};
