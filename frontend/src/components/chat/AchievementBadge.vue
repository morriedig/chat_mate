<template>
  <div
    class="achievement-badge"
    :class="{ unlocked: isUnlocked, locked: !isUnlocked }"
    :title="isUnlocked ? '' : $t(`achievements.${achievement.id}.hint`)"
  >
    <div class="badge-icon">
      <span v-if="isUnlocked">{{ achievement.icon }}</span>
      <span v-else class="locked-icon">🔒</span>
    </div>
    <div class="badge-info">
      <span class="badge-title">{{ $t(`achievements.${achievement.id}.title`) }}</span>
      <span class="badge-desc">{{ $t(`achievements.${achievement.id}.description`) }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  achievement: {
    type: Object,
    required: true
  },
  isUnlocked: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.achievement-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.achievement-badge.unlocked {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #f59e0b;
}

.dark .achievement-badge.unlocked {
  background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
  border-color: #f59e0b;
}

.achievement-badge.locked {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  opacity: 0.6;
}

.dark .achievement-badge.locked {
  background: #1f2937;
  border-color: #374151;
}

.badge-icon {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .badge-icon {
  background: #374151;
}

.locked-icon {
  opacity: 0.5;
}

.badge-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.badge-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1f2937;
}

.dark .badge-title {
  color: #f3f4f6;
}

.badge-desc {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .badge-desc {
  color: #9ca3af;
}
</style>
