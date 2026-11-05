// Material Symbols stand in for the emoji in achievement data (DESIGN.md "Icons": no emoji)
const CATEGORY_ICONS = {
  first_steps: 'flag',
  consistency: 'event_repeat',
  learning: 'menu_book',
  mastery: 'school',
  writing: 'edit_note',
}

export function achievementIcon(achievement) {
  return CATEGORY_ICONS[achievement?.category] || 'military_tech'
}
