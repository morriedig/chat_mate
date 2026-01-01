/**
 * Vocabulary data for Learning Mode
 * Organized by language > level > category
 * Audio files should be placed in public/audio/{language}/{word}.mp3
 */

export const categories = [
  { id: 'travel', icon: '✈️' },
  { id: 'food', icon: '🍜' },
  { id: 'work', icon: '💼' },
  { id: 'daily', icon: '🏠' },
  { id: 'shopping', icon: '🛒' }
]

export const vocabulary = {
  en: {
    beginner: {
      travel: [
        {
          id: 'en_travel_001',
          word: 'airport',
          phonetic: '/ˈer.pɔːrt/',
          meaning: 'A place where planes take off and land',
          example: 'I need to go to the airport.',
          audio: '/audio/en/airport.mp3'
        },
        {
          id: 'en_travel_002',
          word: 'ticket',
          phonetic: '/ˈtɪk.ɪt/',
          meaning: 'A piece of paper that shows you paid for travel',
          example: 'Do you have your train ticket?',
          audio: '/audio/en/ticket.mp3'
        },
        {
          id: 'en_travel_003',
          word: 'hotel',
          phonetic: '/hoʊˈtel/',
          meaning: 'A building where you pay to stay',
          example: 'The hotel is near the beach.',
          audio: '/audio/en/hotel.mp3'
        },
        {
          id: 'en_travel_004',
          word: 'passport',
          phonetic: '/ˈpæs.pɔːrt/',
          meaning: 'Official document for traveling to other countries',
          example: 'Don\'t forget your passport!',
          audio: '/audio/en/passport.mp3'
        },
        {
          id: 'en_travel_005',
          word: 'map',
          phonetic: '/mæp/',
          meaning: 'A picture that shows where places are',
          example: 'Can you show me on the map?',
          audio: '/audio/en/map.mp3'
        }
      ],
      food: [
        {
          id: 'en_food_001',
          word: 'breakfast',
          phonetic: '/ˈbrek.fəst/',
          meaning: 'The first meal of the day',
          example: 'What do you eat for breakfast?',
          audio: '/audio/en/breakfast.mp3'
        },
        {
          id: 'en_food_002',
          word: 'delicious',
          phonetic: '/dɪˈlɪʃ.əs/',
          meaning: 'Very tasty, very good to eat',
          example: 'This pizza is delicious!',
          audio: '/audio/en/delicious.mp3'
        },
        {
          id: 'en_food_003',
          word: 'hungry',
          phonetic: '/ˈhʌŋ.ɡri/',
          meaning: 'Wanting to eat food',
          example: 'I\'m so hungry right now.',
          audio: '/audio/en/hungry.mp3'
        },
        {
          id: 'en_food_004',
          word: 'restaurant',
          phonetic: '/ˈres.tə.rɑːnt/',
          meaning: 'A place where you buy and eat meals',
          example: 'Let\'s go to a restaurant tonight.',
          audio: '/audio/en/restaurant.mp3'
        },
        {
          id: 'en_food_005',
          word: 'menu',
          phonetic: '/ˈmen.juː/',
          meaning: 'A list of food you can order',
          example: 'Can I see the menu, please?',
          audio: '/audio/en/menu.mp3'
        }
      ],
      work: [
        {
          id: 'en_work_001',
          word: 'office',
          phonetic: '/ˈɑː.fɪs/',
          meaning: 'A place where people work at desks',
          example: 'I work in an office downtown.',
          audio: '/audio/en/office.mp3'
        },
        {
          id: 'en_work_002',
          word: 'meeting',
          phonetic: '/ˈmiː.tɪŋ/',
          meaning: 'When people come together to talk about work',
          example: 'I have a meeting at 3 PM.',
          audio: '/audio/en/meeting.mp3'
        },
        {
          id: 'en_work_003',
          word: 'colleague',
          phonetic: '/ˈkɑː.liːɡ/',
          meaning: 'A person you work with',
          example: 'My colleague helped me with the project.',
          audio: '/audio/en/colleague.mp3'
        },
        {
          id: 'en_work_004',
          word: 'email',
          phonetic: '/ˈiː.meɪl/',
          meaning: 'A message sent by computer',
          example: 'I\'ll send you an email later.',
          audio: '/audio/en/email.mp3'
        },
        {
          id: 'en_work_005',
          word: 'schedule',
          phonetic: '/ˈskedʒ.uːl/',
          meaning: 'A plan that shows when things happen',
          example: 'What\'s your schedule tomorrow?',
          audio: '/audio/en/schedule.mp3'
        }
      ],
      daily: [
        {
          id: 'en_daily_001',
          word: 'morning',
          phonetic: '/ˈmɔːr.nɪŋ/',
          meaning: 'The early part of the day',
          example: 'Good morning! How are you?',
          audio: '/audio/en/morning.mp3'
        },
        {
          id: 'en_daily_002',
          word: 'weather',
          phonetic: '/ˈweð.ər/',
          meaning: 'Rain, sun, wind, etc.',
          example: 'The weather is nice today.',
          audio: '/audio/en/weather.mp3'
        },
        {
          id: 'en_daily_003',
          word: 'friend',
          phonetic: '/frend/',
          meaning: 'A person you like and trust',
          example: 'She is my best friend.',
          audio: '/audio/en/friend.mp3'
        },
        {
          id: 'en_daily_004',
          word: 'weekend',
          phonetic: '/ˈwiːk.end/',
          meaning: 'Saturday and Sunday',
          example: 'What are you doing this weekend?',
          audio: '/audio/en/weekend.mp3'
        },
        {
          id: 'en_daily_005',
          word: 'tired',
          phonetic: '/taɪərd/',
          meaning: 'Needing rest or sleep',
          example: 'I\'m tired after work.',
          audio: '/audio/en/tired.mp3'
        }
      ],
      shopping: [
        {
          id: 'en_shop_001',
          word: 'price',
          phonetic: '/praɪs/',
          meaning: 'How much money something costs',
          example: 'What\'s the price of this shirt?',
          audio: '/audio/en/price.mp3'
        },
        {
          id: 'en_shop_002',
          word: 'cheap',
          phonetic: '/tʃiːp/',
          meaning: 'Not expensive, low price',
          example: 'This store is very cheap.',
          audio: '/audio/en/cheap.mp3'
        },
        {
          id: 'en_shop_003',
          word: 'size',
          phonetic: '/saɪz/',
          meaning: 'How big or small something is',
          example: 'What size do you wear?',
          audio: '/audio/en/size.mp3'
        },
        {
          id: 'en_shop_004',
          word: 'cash',
          phonetic: '/kæʃ/',
          meaning: 'Money in coins or paper',
          example: 'Do you accept cash?',
          audio: '/audio/en/cash.mp3'
        },
        {
          id: 'en_shop_005',
          word: 'receipt',
          phonetic: '/rɪˈsiːt/',
          meaning: 'Paper that shows what you bought',
          example: 'Can I have a receipt, please?',
          audio: '/audio/en/receipt.mp3'
        }
      ]
    },
    intermediate: {
      travel: [
        {
          id: 'en_travel_101',
          word: 'itinerary',
          phonetic: '/aɪˈtɪn.ə.rer.i/',
          meaning: 'A detailed plan for a journey',
          example: 'Our itinerary includes three cities.',
          audio: '/audio/en/itinerary.mp3'
        },
        {
          id: 'en_travel_102',
          word: 'accommodation',
          phonetic: '/əˌkɑː.məˈdeɪ.ʃən/',
          meaning: 'A place to stay while traveling',
          example: 'We need to book accommodation for the trip.',
          audio: '/audio/en/accommodation.mp3'
        },
        {
          id: 'en_travel_103',
          word: 'destination',
          phonetic: '/ˌdes.tɪˈneɪ.ʃən/',
          meaning: 'The place you are traveling to',
          example: 'Tokyo is our final destination.',
          audio: '/audio/en/destination.mp3'
        },
        {
          id: 'en_travel_104',
          word: 'currency',
          phonetic: '/ˈkɝː.ən.si/',
          meaning: 'The money system of a country',
          example: 'What currency do they use in Japan?',
          audio: '/audio/en/currency.mp3'
        },
        {
          id: 'en_travel_105',
          word: 'layover',
          phonetic: '/ˈleɪ.oʊ.vɚ/',
          meaning: 'A stop between flights',
          example: 'We have a 3-hour layover in Singapore.',
          audio: '/audio/en/layover.mp3'
        }
      ],
      food: [
        {
          id: 'en_food_101',
          word: 'appetizer',
          phonetic: '/ˈæp.ɪ.taɪ.zɚ/',
          meaning: 'A small dish before the main meal',
          example: 'Would you like to order an appetizer?',
          audio: '/audio/en/appetizer.mp3'
        },
        {
          id: 'en_food_102',
          word: 'cuisine',
          phonetic: '/kwɪˈziːn/',
          meaning: 'A style of cooking from a region',
          example: 'I love Italian cuisine.',
          audio: '/audio/en/cuisine.mp3'
        },
        {
          id: 'en_food_103',
          word: 'ingredient',
          phonetic: '/ɪnˈɡriː.di.ənt/',
          meaning: 'One of the things used to make food',
          example: 'What ingredients do we need?',
          audio: '/audio/en/ingredient.mp3'
        },
        {
          id: 'en_food_104',
          word: 'reservation',
          phonetic: '/ˌrez.ɚˈveɪ.ʃən/',
          meaning: 'Booking a table in advance',
          example: 'I made a reservation for 7 PM.',
          audio: '/audio/en/reservation.mp3'
        },
        {
          id: 'en_food_105',
          word: 'portion',
          phonetic: '/ˈpɔːr.ʃən/',
          meaning: 'The amount of food served',
          example: 'The portions here are very generous.',
          audio: '/audio/en/portion.mp3'
        }
      ],
      work: [
        {
          id: 'en_work_101',
          word: 'deadline',
          phonetic: '/ˈded.laɪn/',
          meaning: 'The latest time something must be done',
          example: 'The deadline for this project is Friday.',
          audio: '/audio/en/deadline.mp3'
        },
        {
          id: 'en_work_102',
          word: 'presentation',
          phonetic: '/ˌprez.ənˈteɪ.ʃən/',
          meaning: 'A talk explaining something to people',
          example: 'I\'m preparing a presentation for the client.',
          audio: '/audio/en/presentation.mp3'
        },
        {
          id: 'en_work_103',
          word: 'negotiate',
          phonetic: '/nɪˈɡoʊ.ʃi.eɪt/',
          meaning: 'To discuss and try to reach agreement',
          example: 'We need to negotiate the contract terms.',
          audio: '/audio/en/negotiate.mp3'
        },
        {
          id: 'en_work_104',
          word: 'promote',
          phonetic: '/prəˈmoʊt/',
          meaning: 'To give someone a higher position',
          example: 'She was promoted to manager.',
          audio: '/audio/en/promote.mp3'
        },
        {
          id: 'en_work_105',
          word: 'collaborate',
          phonetic: '/kəˈlæb.ə.reɪt/',
          meaning: 'To work together with others',
          example: 'Let\'s collaborate on this project.',
          audio: '/audio/en/collaborate.mp3'
        }
      ],
      daily: [
        {
          id: 'en_daily_101',
          word: 'routine',
          phonetic: '/ruːˈtiːn/',
          meaning: 'Regular activities you do every day',
          example: 'Exercise is part of my morning routine.',
          audio: '/audio/en/routine.mp3'
        },
        {
          id: 'en_daily_102',
          word: 'appointment',
          phonetic: '/əˈpɔɪnt.mənt/',
          meaning: 'A planned meeting at a specific time',
          example: 'I have a doctor\'s appointment tomorrow.',
          audio: '/audio/en/appointment.mp3'
        },
        {
          id: 'en_daily_103',
          word: 'commute',
          phonetic: '/kəˈmjuːt/',
          meaning: 'Regular travel between home and work',
          example: 'My commute takes about 40 minutes.',
          audio: '/audio/en/commute.mp3'
        },
        {
          id: 'en_daily_104',
          word: 'convenient',
          phonetic: '/kənˈviː.ni.ənt/',
          meaning: 'Easy to use or helpful',
          example: 'This location is very convenient.',
          audio: '/audio/en/convenient.mp3'
        },
        {
          id: 'en_daily_105',
          word: 'overwhelmed',
          phonetic: '/ˌoʊ.vɚˈwelmd/',
          meaning: 'Having too much to deal with',
          example: 'I feel overwhelmed with all this work.',
          audio: '/audio/en/overwhelmed.mp3'
        }
      ],
      shopping: [
        {
          id: 'en_shop_101',
          word: 'discount',
          phonetic: '/ˈdɪs.kaʊnt/',
          meaning: 'A reduction in price',
          example: 'Is there a student discount?',
          audio: '/audio/en/discount.mp3'
        },
        {
          id: 'en_shop_102',
          word: 'refund',
          phonetic: '/ˈriː.fʌnd/',
          meaning: 'Money returned for a returned item',
          example: 'Can I get a refund for this?',
          audio: '/audio/en/refund.mp3'
        },
        {
          id: 'en_shop_103',
          word: 'warranty',
          phonetic: '/ˈwɔːr.ən.t̬i/',
          meaning: 'A promise to fix something if it breaks',
          example: 'This laptop comes with a 2-year warranty.',
          audio: '/audio/en/warranty.mp3'
        },
        {
          id: 'en_shop_104',
          word: 'comparison',
          phonetic: '/kəmˈpær.ɪ.sən/',
          meaning: 'Looking at things to see differences',
          example: 'I did a price comparison online.',
          audio: '/audio/en/comparison.mp3'
        },
        {
          id: 'en_shop_105',
          word: 'transaction',
          phonetic: '/trænˈzæk.ʃən/',
          meaning: 'An exchange of money for goods',
          example: 'The transaction was successful.',
          audio: '/audio/en/transaction.mp3'
        }
      ]
    },
    advanced: {
      travel: [
        {
          id: 'en_travel_201',
          word: 'jet lag',
          phonetic: '/ˈdʒet læɡ/',
          meaning: 'Tiredness from traveling across time zones',
          example: 'I\'m still recovering from jet lag.',
          audio: '/audio/en/jetlag.mp3'
        },
        {
          id: 'en_travel_202',
          word: 'customs',
          phonetic: '/ˈkʌs.təmz/',
          meaning: 'Government control at borders',
          example: 'We have to go through customs first.',
          audio: '/audio/en/customs.mp3'
        },
        {
          id: 'en_travel_203',
          word: 'sustainable',
          phonetic: '/səˈsteɪ.nə.bəl/',
          meaning: 'Not harmful to the environment',
          example: 'I prefer sustainable tourism options.',
          audio: '/audio/en/sustainable.mp3'
        },
        {
          id: 'en_travel_204',
          word: 'immerse',
          phonetic: '/ɪˈmɝːs/',
          meaning: 'To become deeply involved in something',
          example: 'I want to immerse myself in the local culture.',
          audio: '/audio/en/immerse.mp3'
        },
        {
          id: 'en_travel_205',
          word: 'off the beaten path',
          phonetic: '/ɒf ðə ˈbiːtən pæθ/',
          meaning: 'Places not visited by many tourists',
          example: 'We found a café off the beaten path.',
          audio: '/audio/en/offthebeatenpath.mp3'
        }
      ],
      food: [
        {
          id: 'en_food_201',
          word: 'culinary',
          phonetic: '/ˈkʌl.ɪ.ner.i/',
          meaning: 'Related to cooking or kitchens',
          example: 'She went to culinary school in Paris.',
          audio: '/audio/en/culinary.mp3'
        },
        {
          id: 'en_food_202',
          word: 'gastronomy',
          phonetic: '/ɡæsˈtrɑː.nə.mi/',
          meaning: 'The art of good eating',
          example: 'Japan is famous for its gastronomy.',
          audio: '/audio/en/gastronomy.mp3'
        },
        {
          id: 'en_food_203',
          word: 'savory',
          phonetic: '/ˈseɪ.vɚ.i/',
          meaning: 'Salty or spicy, not sweet',
          example: 'I prefer savory snacks over sweet ones.',
          audio: '/audio/en/savory.mp3'
        },
        {
          id: 'en_food_204',
          word: 'exquisite',
          phonetic: '/ɪkˈskwɪz.ɪt/',
          meaning: 'Extremely beautiful or delicate',
          example: 'The presentation was exquisite.',
          audio: '/audio/en/exquisite.mp3'
        },
        {
          id: 'en_food_205',
          word: 'palate',
          phonetic: '/ˈpæl.ət/',
          meaning: 'The sense of taste',
          example: 'This wine has a complex palate.',
          audio: '/audio/en/palate.mp3'
        }
      ],
      work: [
        {
          id: 'en_work_201',
          word: 'synergy',
          phonetic: '/ˈsɪn.ɚ.dʒi/',
          meaning: 'Combined effort producing greater results',
          example: 'There\'s great synergy between our teams.',
          audio: '/audio/en/synergy.mp3'
        },
        {
          id: 'en_work_202',
          word: 'leverage',
          phonetic: '/ˈlev.ɚ.ɪdʒ/',
          meaning: 'To use something to maximum advantage',
          example: 'We can leverage this technology.',
          audio: '/audio/en/leverage.mp3'
        },
        {
          id: 'en_work_203',
          word: 'stakeholder',
          phonetic: '/ˈsteɪkˌhoʊl.dɚ/',
          meaning: 'Person with interest in a business',
          example: 'We need to update all stakeholders.',
          audio: '/audio/en/stakeholder.mp3'
        },
        {
          id: 'en_work_204',
          word: 'scalable',
          phonetic: '/ˈskeɪ.lə.bəl/',
          meaning: 'Able to grow or increase in size',
          example: 'Is this solution scalable?',
          audio: '/audio/en/scalable.mp3'
        },
        {
          id: 'en_work_205',
          word: 'streamline',
          phonetic: '/ˈstriːm.laɪn/',
          meaning: 'To make a process more efficient',
          example: 'We need to streamline our workflow.',
          audio: '/audio/en/streamline.mp3'
        }
      ],
      daily: [
        {
          id: 'en_daily_201',
          word: 'procrastinate',
          phonetic: '/proʊˈkræs.tə.neɪt/',
          meaning: 'To delay doing something',
          example: 'I tend to procrastinate on difficult tasks.',
          audio: '/audio/en/procrastinate.mp3'
        },
        {
          id: 'en_daily_202',
          word: 'mindfulness',
          phonetic: '/ˈmaɪnd.fəl.nəs/',
          meaning: 'Being fully present and aware',
          example: 'I practice mindfulness every morning.',
          audio: '/audio/en/mindfulness.mp3'
        },
        {
          id: 'en_daily_203',
          word: 'resilience',
          phonetic: '/rɪˈzɪl.jəns/',
          meaning: 'Ability to recover from difficulties',
          example: 'Building resilience takes time.',
          audio: '/audio/en/resilience.mp3'
        },
        {
          id: 'en_daily_204',
          word: 'prioritize',
          phonetic: '/praɪˈɔːr.ə.taɪz/',
          meaning: 'To decide what is most important',
          example: 'You need to prioritize your health.',
          audio: '/audio/en/prioritize.mp3'
        },
        {
          id: 'en_daily_205',
          word: 'spontaneous',
          phonetic: '/spɑːnˈteɪ.ni.əs/',
          meaning: 'Done without planning',
          example: 'Let\'s be spontaneous this weekend!',
          audio: '/audio/en/spontaneous.mp3'
        }
      ],
      shopping: [
        {
          id: 'en_shop_201',
          word: 'bargain',
          phonetic: '/ˈbɑːr.ɡən/',
          meaning: 'To negotiate price; also a good deal',
          example: 'I managed to bargain for a lower price.',
          audio: '/audio/en/bargain.mp3'
        },
        {
          id: 'en_shop_202',
          word: 'counterfeit',
          phonetic: '/ˈkaʊn.t̬ɚ.fɪt/',
          meaning: 'Fake, not genuine',
          example: 'Be careful of counterfeit products.',
          audio: '/audio/en/counterfeit.mp3'
        },
        {
          id: 'en_shop_203',
          word: 'splurge',
          phonetic: '/splɜːrdʒ/',
          meaning: 'To spend a lot of money on something',
          example: 'I decided to splurge on a nice watch.',
          audio: '/audio/en/splurge.mp3'
        },
        {
          id: 'en_shop_204',
          word: 'impulse purchase',
          phonetic: '/ˈɪm.pʌls ˈpɝː.tʃəs/',
          meaning: 'Buying without planning',
          example: 'That was an impulse purchase.',
          audio: '/audio/en/impulsepurchase.mp3'
        },
        {
          id: 'en_shop_205',
          word: 'conscientious consumer',
          phonetic: '/ˌkɑːn.ʃiˈen.ʃəs kənˈsuː.mɚ/',
          meaning: 'A buyer who thinks carefully about purchases',
          example: 'As a conscientious consumer, I research before buying.',
          audio: '/audio/en/conscientiousconsumer.mp3'
        }
      ]
    }
  },
  ja: {
    beginner: {
      travel: [
        {
          id: 'ja_travel_001',
          word: '空港',
          reading: 'くうこう',
          meaning: 'Airport - where planes arrive and depart',
          example: '空港まで行きたいです。',
          audio: '/audio/ja/kuukou.mp3'
        },
        {
          id: 'ja_travel_002',
          word: '切符',
          reading: 'きっぷ',
          meaning: 'Ticket for transportation',
          example: '切符を買いました。',
          audio: '/audio/ja/kippu.mp3'
        },
        {
          id: 'ja_travel_003',
          word: 'ホテル',
          reading: 'ホテル',
          meaning: 'Hotel - place to stay',
          example: 'ホテルはどこですか？',
          audio: '/audio/ja/hoteru.mp3'
        },
        {
          id: 'ja_travel_004',
          word: '駅',
          reading: 'えき',
          meaning: 'Train station',
          example: '駅はここから近いです。',
          audio: '/audio/ja/eki.mp3'
        },
        {
          id: 'ja_travel_005',
          word: '地図',
          reading: 'ちず',
          meaning: 'Map',
          example: '地図を見せてください。',
          audio: '/audio/ja/chizu.mp3'
        }
      ],
      food: [
        {
          id: 'ja_food_001',
          word: '朝ごはん',
          reading: 'あさごはん',
          meaning: 'Breakfast',
          example: '朝ごはんを食べましたか？',
          audio: '/audio/ja/asagohan.mp3'
        },
        {
          id: 'ja_food_002',
          word: 'おいしい',
          reading: 'おいしい',
          meaning: 'Delicious',
          example: 'このラーメンはおいしいです！',
          audio: '/audio/ja/oishii.mp3'
        },
        {
          id: 'ja_food_003',
          word: 'お腹が空いた',
          reading: 'おなかがすいた',
          meaning: 'I\'m hungry',
          example: 'お腹が空きました。',
          audio: '/audio/ja/onakagasuita.mp3'
        },
        {
          id: 'ja_food_004',
          word: 'レストラン',
          reading: 'レストラン',
          meaning: 'Restaurant',
          example: 'レストランに行きましょう。',
          audio: '/audio/ja/resutoran.mp3'
        },
        {
          id: 'ja_food_005',
          word: 'メニュー',
          reading: 'メニュー',
          meaning: 'Menu',
          example: 'メニューをください。',
          audio: '/audio/ja/menyuu.mp3'
        }
      ],
      work: [
        {
          id: 'ja_work_001',
          word: '会社',
          reading: 'かいしゃ',
          meaning: 'Company/Office',
          example: '会社に行きます。',
          audio: '/audio/ja/kaisha.mp3'
        },
        {
          id: 'ja_work_002',
          word: '会議',
          reading: 'かいぎ',
          meaning: 'Meeting',
          example: '会議は3時からです。',
          audio: '/audio/ja/kaigi.mp3'
        },
        {
          id: 'ja_work_003',
          word: '同僚',
          reading: 'どうりょう',
          meaning: 'Colleague',
          example: '同僚と昼ごはんを食べました。',
          audio: '/audio/ja/douryou.mp3'
        },
        {
          id: 'ja_work_004',
          word: '仕事',
          reading: 'しごと',
          meaning: 'Work/Job',
          example: '仕事は楽しいです。',
          audio: '/audio/ja/shigoto.mp3'
        },
        {
          id: 'ja_work_005',
          word: '電話',
          reading: 'でんわ',
          meaning: 'Telephone',
          example: '電話してください。',
          audio: '/audio/ja/denwa.mp3'
        }
      ],
      daily: [
        {
          id: 'ja_daily_001',
          word: '今日',
          reading: 'きょう',
          meaning: 'Today',
          example: '今日は暑いですね。',
          audio: '/audio/ja/kyou.mp3'
        },
        {
          id: 'ja_daily_002',
          word: '天気',
          reading: 'てんき',
          meaning: 'Weather',
          example: '今日の天気はいいです。',
          audio: '/audio/ja/tenki.mp3'
        },
        {
          id: 'ja_daily_003',
          word: '友達',
          reading: 'ともだち',
          meaning: 'Friend',
          example: '友達と映画を見ました。',
          audio: '/audio/ja/tomodachi.mp3'
        },
        {
          id: 'ja_daily_004',
          word: '週末',
          reading: 'しゅうまつ',
          meaning: 'Weekend',
          example: '週末は何をしますか？',
          audio: '/audio/ja/shuumatsu.mp3'
        },
        {
          id: 'ja_daily_005',
          word: '疲れた',
          reading: 'つかれた',
          meaning: 'Tired',
          example: '今日は疲れました。',
          audio: '/audio/ja/tsukareta.mp3'
        }
      ],
      shopping: [
        {
          id: 'ja_shop_001',
          word: '値段',
          reading: 'ねだん',
          meaning: 'Price',
          example: 'この値段はいくらですか？',
          audio: '/audio/ja/nedan.mp3'
        },
        {
          id: 'ja_shop_002',
          word: '安い',
          reading: 'やすい',
          meaning: 'Cheap/Inexpensive',
          example: 'このお店は安いです。',
          audio: '/audio/ja/yasui.mp3'
        },
        {
          id: 'ja_shop_003',
          word: 'サイズ',
          reading: 'サイズ',
          meaning: 'Size',
          example: 'Mサイズはありますか？',
          audio: '/audio/ja/saizu.mp3'
        },
        {
          id: 'ja_shop_004',
          word: '現金',
          reading: 'げんきん',
          meaning: 'Cash',
          example: '現金で払います。',
          audio: '/audio/ja/genkin.mp3'
        },
        {
          id: 'ja_shop_005',
          word: 'レシート',
          reading: 'レシート',
          meaning: 'Receipt',
          example: 'レシートをお願いします。',
          audio: '/audio/ja/reshiito.mp3'
        }
      ]
    },
    intermediate: {
      travel: [
        {
          id: 'ja_travel_101',
          word: '旅程',
          reading: 'りょてい',
          meaning: 'Itinerary',
          example: '旅程を確認しましょう。',
          audio: '/audio/ja/ryotei.mp3'
        },
        {
          id: 'ja_travel_102',
          word: '宿泊',
          reading: 'しゅくはく',
          meaning: 'Accommodation/Lodging',
          example: '宿泊先を予約しました。',
          audio: '/audio/ja/shukuhaku.mp3'
        },
        {
          id: 'ja_travel_103',
          word: '目的地',
          reading: 'もくてきち',
          meaning: 'Destination',
          example: '目的地まであと1時間です。',
          audio: '/audio/ja/mokutekichi.mp3'
        },
        {
          id: 'ja_travel_104',
          word: '両替',
          reading: 'りょうがえ',
          meaning: 'Currency exchange',
          example: '両替所はどこですか？',
          audio: '/audio/ja/ryougae.mp3'
        },
        {
          id: 'ja_travel_105',
          word: '乗り換え',
          reading: 'のりかえ',
          meaning: 'Transfer (trains, buses)',
          example: '次の駅で乗り換えです。',
          audio: '/audio/ja/norikae.mp3'
        }
      ],
      food: [
        {
          id: 'ja_food_101',
          word: '前菜',
          reading: 'ぜんさい',
          meaning: 'Appetizer',
          example: '前菜から注文しましょうか。',
          audio: '/audio/ja/zensai.mp3'
        },
        {
          id: 'ja_food_102',
          word: '料理',
          reading: 'りょうり',
          meaning: 'Cuisine/Cooking',
          example: '日本料理が好きです。',
          audio: '/audio/ja/ryouri.mp3'
        },
        {
          id: 'ja_food_103',
          word: '材料',
          reading: 'ざいりょう',
          meaning: 'Ingredients',
          example: '材料は全部揃いました。',
          audio: '/audio/ja/zairyou.mp3'
        },
        {
          id: 'ja_food_104',
          word: '予約',
          reading: 'よやく',
          meaning: 'Reservation',
          example: '予約したいのですが。',
          audio: '/audio/ja/yoyaku.mp3'
        },
        {
          id: 'ja_food_105',
          word: '量',
          reading: 'りょう',
          meaning: 'Portion/Amount',
          example: '量が多いですね。',
          audio: '/audio/ja/ryou.mp3'
        }
      ],
      work: [
        {
          id: 'ja_work_101',
          word: '締め切り',
          reading: 'しめきり',
          meaning: 'Deadline',
          example: '締め切りは金曜日です。',
          audio: '/audio/ja/shimekiri.mp3'
        },
        {
          id: 'ja_work_102',
          word: 'プレゼン',
          reading: 'プレゼン',
          meaning: 'Presentation',
          example: 'プレゼンの準備をしています。',
          audio: '/audio/ja/purezen.mp3'
        },
        {
          id: 'ja_work_103',
          word: '交渉',
          reading: 'こうしょう',
          meaning: 'Negotiation',
          example: '交渉は難しかったです。',
          audio: '/audio/ja/koushou.mp3'
        },
        {
          id: 'ja_work_104',
          word: '昇進',
          reading: 'しょうしん',
          meaning: 'Promotion',
          example: '昇進おめでとうございます！',
          audio: '/audio/ja/shoushin.mp3'
        },
        {
          id: 'ja_work_105',
          word: '協力',
          reading: 'きょうりょく',
          meaning: 'Cooperation/Collaboration',
          example: 'ご協力ありがとうございます。',
          audio: '/audio/ja/kyouryoku.mp3'
        }
      ],
      daily: [
        {
          id: 'ja_daily_101',
          word: '習慣',
          reading: 'しゅうかん',
          meaning: 'Habit/Routine',
          example: '早起きは良い習慣です。',
          audio: '/audio/ja/shuukan.mp3'
        },
        {
          id: 'ja_daily_102',
          word: '約束',
          reading: 'やくそく',
          meaning: 'Appointment/Promise',
          example: '明日、約束があります。',
          audio: '/audio/ja/yakusoku.mp3'
        },
        {
          id: 'ja_daily_103',
          word: '通勤',
          reading: 'つうきん',
          meaning: 'Commute',
          example: '通勤に1時間かかります。',
          audio: '/audio/ja/tsuukin.mp3'
        },
        {
          id: 'ja_daily_104',
          word: '便利',
          reading: 'べんり',
          meaning: 'Convenient',
          example: 'この場所は便利です。',
          audio: '/audio/ja/benri.mp3'
        },
        {
          id: 'ja_daily_105',
          word: '大変',
          reading: 'たいへん',
          meaning: 'Difficult/Tough',
          example: '仕事が大変です。',
          audio: '/audio/ja/taihen.mp3'
        }
      ],
      shopping: [
        {
          id: 'ja_shop_101',
          word: '割引',
          reading: 'わりびき',
          meaning: 'Discount',
          example: '学生割引はありますか？',
          audio: '/audio/ja/waribiki.mp3'
        },
        {
          id: 'ja_shop_102',
          word: '返金',
          reading: 'へんきん',
          meaning: 'Refund',
          example: '返金してもらえますか？',
          audio: '/audio/ja/henkin.mp3'
        },
        {
          id: 'ja_shop_103',
          word: '保証',
          reading: 'ほしょう',
          meaning: 'Warranty/Guarantee',
          example: '保証期間は1年です。',
          audio: '/audio/ja/hoshou.mp3'
        },
        {
          id: 'ja_shop_104',
          word: '比較',
          reading: 'ひかく',
          meaning: 'Comparison',
          example: '価格を比較しました。',
          audio: '/audio/ja/hikaku.mp3'
        },
        {
          id: 'ja_shop_105',
          word: '支払い',
          reading: 'しはらい',
          meaning: 'Payment',
          example: '支払いは現金でお願いします。',
          audio: '/audio/ja/shiharai.mp3'
        }
      ]
    },
    advanced: {
      travel: [
        {
          id: 'ja_travel_201',
          word: '時差ぼけ',
          reading: 'じさぼけ',
          meaning: 'Jet lag',
          example: 'まだ時差ぼけが治りません。',
          audio: '/audio/ja/jisaboke.mp3'
        },
        {
          id: 'ja_travel_202',
          word: '税関',
          reading: 'ぜいかん',
          meaning: 'Customs',
          example: '税関で荷物をチェックされました。',
          audio: '/audio/ja/zeikan.mp3'
        },
        {
          id: 'ja_travel_203',
          word: '持続可能',
          reading: 'じぞくかのう',
          meaning: 'Sustainable',
          example: '持続可能な観光を推進しています。',
          audio: '/audio/ja/jizokukanou.mp3'
        },
        {
          id: 'ja_travel_204',
          word: '没頭する',
          reading: 'ぼっとうする',
          meaning: 'To immerse oneself',
          example: '現地の文化に没頭したい。',
          audio: '/audio/ja/bottousuru.mp3'
        },
        {
          id: 'ja_travel_205',
          word: '穴場',
          reading: 'あなば',
          meaning: 'Hidden gem/Off the beaten path',
          example: 'この穴場のカフェは最高です。',
          audio: '/audio/ja/anaba.mp3'
        }
      ],
      food: [
        {
          id: 'ja_food_201',
          word: '美食',
          reading: 'びしょく',
          meaning: 'Gastronomy/Fine dining',
          example: '京都は美食の街です。',
          audio: '/audio/ja/bishoku.mp3'
        },
        {
          id: 'ja_food_202',
          word: '調理法',
          reading: 'ちょうりほう',
          meaning: 'Cooking method',
          example: '調理法によって味が変わります。',
          audio: '/audio/ja/chourihou.mp3'
        },
        {
          id: 'ja_food_203',
          word: '旨味',
          reading: 'うまみ',
          meaning: 'Umami (savory taste)',
          example: '出汁の旨味が効いています。',
          audio: '/audio/ja/umami.mp3'
        },
        {
          id: 'ja_food_204',
          word: '絶品',
          reading: 'ぜっぴん',
          meaning: 'Exquisite/Superb',
          example: 'この寿司は絶品です。',
          audio: '/audio/ja/zeppin.mp3'
        },
        {
          id: 'ja_food_205',
          word: '味覚',
          reading: 'みかく',
          meaning: 'Sense of taste/Palate',
          example: '味覚が鋭いですね。',
          audio: '/audio/ja/mikaku.mp3'
        }
      ],
      work: [
        {
          id: 'ja_work_201',
          word: '相乗効果',
          reading: 'そうじょうこうか',
          meaning: 'Synergy',
          example: '両社の相乗効果が期待できます。',
          audio: '/audio/ja/soujoukoka.mp3'
        },
        {
          id: 'ja_work_202',
          word: '活用する',
          reading: 'かつようする',
          meaning: 'To leverage/utilize',
          example: 'このデータを活用しましょう。',
          audio: '/audio/ja/katsuyousuru.mp3'
        },
        {
          id: 'ja_work_203',
          word: '利害関係者',
          reading: 'りがいかんけいしゃ',
          meaning: 'Stakeholder',
          example: '利害関係者全員に報告します。',
          audio: '/audio/ja/rigaikankeisha.mp3'
        },
        {
          id: 'ja_work_204',
          word: '拡張性',
          reading: 'かくちょうせい',
          meaning: 'Scalability',
          example: 'システムの拡張性が重要です。',
          audio: '/audio/ja/kakuchousei.mp3'
        },
        {
          id: 'ja_work_205',
          word: '効率化',
          reading: 'こうりつか',
          meaning: 'Streamline/Optimization',
          example: '業務の効率化を進めています。',
          audio: '/audio/ja/kouritsuka.mp3'
        }
      ],
      daily: [
        {
          id: 'ja_daily_201',
          word: '先延ばし',
          reading: 'さきのばし',
          meaning: 'Procrastination',
          example: '先延ばしは良くないです。',
          audio: '/audio/ja/sakinobashi.mp3'
        },
        {
          id: 'ja_daily_202',
          word: 'マインドフルネス',
          reading: 'マインドフルネス',
          meaning: 'Mindfulness',
          example: 'マインドフルネスを実践しています。',
          audio: '/audio/ja/maindofurunesu.mp3'
        },
        {
          id: 'ja_daily_203',
          word: '回復力',
          reading: 'かいふくりょく',
          meaning: 'Resilience',
          example: '回復力を身につけたい。',
          audio: '/audio/ja/kaifukuryoku.mp3'
        },
        {
          id: 'ja_daily_204',
          word: '優先順位',
          reading: 'ゆうせんじゅんい',
          meaning: 'Priority',
          example: '優先順位をつけましょう。',
          audio: '/audio/ja/yuusenjuni.mp3'
        },
        {
          id: 'ja_daily_205',
          word: '自発的',
          reading: 'じはつてき',
          meaning: 'Spontaneous',
          example: '自発的に行動することが大切です。',
          audio: '/audio/ja/jihatsuteki.mp3'
        }
      ],
      shopping: [
        {
          id: 'ja_shop_201',
          word: '値切る',
          reading: 'ねぎる',
          meaning: 'To bargain/haggle',
          example: '市場で値切りました。',
          audio: '/audio/ja/negiru.mp3'
        },
        {
          id: 'ja_shop_202',
          word: '偽物',
          reading: 'にせもの',
          meaning: 'Counterfeit/Fake',
          example: '偽物に注意してください。',
          audio: '/audio/ja/nisemono.mp3'
        },
        {
          id: 'ja_shop_203',
          word: '奮発する',
          reading: 'ふんぱつする',
          meaning: 'To splurge',
          example: '誕生日なので奮発しました。',
          audio: '/audio/ja/funpatsusuru.mp3'
        },
        {
          id: 'ja_shop_204',
          word: '衝動買い',
          reading: 'しょうどうがい',
          meaning: 'Impulse purchase',
          example: 'また衝動買いしてしまった。',
          audio: '/audio/ja/shoudougai.mp3'
        },
        {
          id: 'ja_shop_205',
          word: '賢い消費者',
          reading: 'かしこいしょうひしゃ',
          meaning: 'Conscientious consumer',
          example: '賢い消費者になりたいです。',
          audio: '/audio/ja/kashikoishouhisha.mp3'
        }
      ]
    }
  }
}

/**
 * Get vocabulary for a specific language, level, and category
 */
export function getVocabulary(language, level, category) {
  return vocabulary[language]?.[level]?.[category] || []
}

/**
 * Get all vocabulary for a specific language and level
 */
export function getVocabularyByLevel(language, level) {
  const levelVocab = vocabulary[language]?.[level]
  if (!levelVocab) return []

  return Object.entries(levelVocab).flatMap(([category, words]) =>
    words.map(word => ({ ...word, category }))
  )
}

/**
 * Get available categories for a language and level
 */
export function getAvailableCategories(language, level) {
  const levelVocab = vocabulary[language]?.[level]
  if (!levelVocab) return []

  return categories.filter(cat => levelVocab[cat.id]?.length > 0)
}
