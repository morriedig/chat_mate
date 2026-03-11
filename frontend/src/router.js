import { createRouter, createWebHashHistory } from 'vue-router'

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
    {
      path: '/articles',
      name: 'articles',
      component: () => import('./components/ArticleScreen.vue'),
    },
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
    {
      path: '/placement-test',
      name: 'placementTest',
      component: () => import('./components/PlacementTestScreen.vue'),
    },
    // Catch-all redirect to setup
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
