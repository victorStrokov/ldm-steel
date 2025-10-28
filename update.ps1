Write-Output "🔍 Проверяю состояние репозитория..."

# Сохраняем имя текущей ветки
$branch = git rev-parse --abbrev-ref HEAD

# Если есть незакоммиченные изменения — складываем их в stash
$changes = git status --porcelain
if ($changes) {
    Write-Output "💾 Сохраняю локальные изменения во временный stash..."
    git stash push -m "auto-stash before update"
}

# Жёсткая синхронизация с GitHub
Write-Output "⬇️ Подтягиваю последние изменения из GitHub..."
git fetch --all
git reset --hard origin/$branch
git clean -fd

# Если stash был создан — пробуем вернуть изменения
$stashList = git stash list
if ($stashList) {
    Write-Output "♻️ Возвращаю сохранённые изменения из stash..."
    git stash pop
}

Write-Output "✅ Локальная ветка полностью синхронизирована с GitHub."
Write-Output "Готово!"