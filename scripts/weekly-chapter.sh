#!/bin/zsh
# Weekly job (launchd: ~/Library/LaunchAgents/com.morrie.chatmate.weekly-chapter.plist).
# Adds the next intermediate English chapter by following docs/plans/weekly-chapter.md,
# in a throwaway worktree of origin/master, and pushes to master when tests and build pass.
set -euo pipefail
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
REPO=/Users/huangyudi/projects/chat_mate
WT="$HOME/.cache/chatmate-weekly-chapter"

notify() { osascript -e "display notification \"$1\" with title \"Chat Mate 每週課程\"" || true; }
trap 'notify "失敗了，看 ~/Library/Logs/chatmate-weekly-chapter.log"' ERR

echo "=== $(date '+%F %T') start"
cd "$REPO"
git fetch -q origin
git worktree remove --force "$WT" 2>/dev/null || rm -rf "$WT"
git worktree prune
git worktree add -q --detach "$WT" origin/master
cd "$WT/frontend" && npm ci --silent --no-audit --no-fund
cd "$WT"
BEFORE=$(git rev-parse HEAD)

claude -p --model claude-sonnet-5-5 --dangerously-skip-permissions \
  "Follow docs/plans/weekly-chapter.md exactly to add the next intermediate English chapter. You are in a detached git worktree of origin/master. When tests and build pass, commit and run: git push origin HEAD:master (only master). If anything fails and you can't fix it, do not push. End with one line: the week number and topic, or the reason it failed."

cd "$REPO"
git fetch -q origin
AFTER=$(git rev-parse origin/master)
git worktree remove --force "$WT" || true
if [ "$AFTER" != "$BEFORE" ]; then
  notify "新的一章已上線"
else
  notify "這週沒有推上新章節，看 ~/Library/Logs/chatmate-weekly-chapter.log"
fi
echo "=== $(date '+%F %T') done ($BEFORE -> $AFTER)"
