/**
 * The landing page sits one folder above the app in both editions:
 * /chat_mate/app/ → /chat_mate/, /chat_mate/zh/app/ → /chat_mate/zh/.
 */
export function landingPageUrl(href) {
  return new URL('..', href.split('#')[0]).href
}
