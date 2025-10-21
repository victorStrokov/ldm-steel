Write-Output "🔍 Проверяю состояние репозитория..."

# Проверка на незакоммиченные изменения
$changes = git status --porcelain
if ($changes) {
    Write-Output "⚠️ Найдены незакоммиченные изменения!"
    Write-Output "Сначала закоммить или stash, потом запускай update."
    exit 1
}

# Проверка на различия между локальной и удалённой веткой
# Проверка на различия между локальной и удалённой веткой
$local  = git rev-parse "@"
$remote = git rev-parse "@{u}"
$base   = git merge-base "@" "@{u}"

if ($local -ne $remote) {
    if ($local -eq $base) {
        Write-Output "⬇️ Есть новые коммиты на GitHub → подтягиваю..."
        git pull origin main
    } elseif ($remote -eq $base) {
        Write-Output "⬆️ У тебя есть локальные коммиты, которые ещё не запушены."
        Write-Output "Выполняю git push..."
        git push origin main
    } else {
        Write-Output "⚠️ Ветка разошлась: есть и локальные, и удалённые коммиты."
        Write-Output "Реши вручную: git pull --rebase или git merge"
        exit 1
    }
} else {
    Write-Output "✅ Локальная ветка синхронизирована с GitHub."
}

Write-Output "Готово!"