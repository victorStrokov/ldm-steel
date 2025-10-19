Write-Output "🔍 Проверяю состояние репозитория..."
git status

Write-Output "⬇️ Подтягиваю свежие изменения..."
git fetch origin

Write-Output "🔄 Обновляю текущую ветку..."
$branch = git rev-parse --abbrev-ref HEAD
git pull origin $branch

Write-Output "✅ Готово! Текущая ветка обновлена."