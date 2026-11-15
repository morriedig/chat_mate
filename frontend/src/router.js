import { createRouter, createWebHashHistory } from 'vue-router'
import { isFeatureEnabled } from './edition'

// Pages for features this edition hides (see edition.js) send people back to the home screen
function featureRoute(feature, route) {
  return isFeatureEnabled(feature) ? route : { path: route.path, redirect: '/' }
}

// Use hash mode for GitHub Pages compatibility
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'setup',
      component: () => import('./components/SetupScreen.vue'),
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('./components/ChatScreen.vue'),
    },
    featureRoute('articles', {
      path: '/articles',
      name: 'articles',
      component: () => import('./components/ArticleScreen.vue'),
    }),
    {
      path: '/learning',
      name: 'learning',
      component: () => import('./components/LearningScreen.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./components/SettingsScreen.vue'),
    },
    featureRoute('placementTest', {
      path: '/placement-test',
      name: 'placementTest',
      component: () => import('./components/PlacementTestScreen.vue'),
    }),
    {
      path: '/daily-practice',
      name: 'dailyPractice',
      component: () => import('./components/DailyPracticeScreen.vue'),
    },
    featureRoute('diary', {
      path: '/diary',
      name: 'diary',
      component: () => import('./components/DiaryScreen.vue'),
    }),
    featureRoute('dailyOpinion', {
      path: '/daily-opinion',
      name: 'dailyOpinion',
      component: () => import('./components/DailyOpinionScreen.vue'),
    }),
    featureRoute('retell', {
      path: '/retell',
      name: 'retell',
      component: () => import('./components/RetellScreen.vue'),
    }),
    // Catch-all redirect to setup
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
