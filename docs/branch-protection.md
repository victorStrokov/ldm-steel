# Branch Protection for main

Repository: https://github.com/victorStrokov/ldm-steel
Target branch: main

## Required checks

Enable these required status checks for pull requests to main:

1. CI / Lint, Unit/Integration, Build
2. CI / E2E Smoke

Note: exact check names appear only after at least one successful run on GitHub Actions.

## Recommended GitHub settings

1. Require a pull request before merging
2. Require approvals: 1
3. Dismiss stale pull request approvals when new commits are pushed
4. Require status checks to pass before merging
5. Require branches to be up to date before merging
6. Include administrators
7. Restrict force pushes
8. Restrict deletions

## How to apply in GitHub UI

1. Open repository settings
2. Go to Branches
3. Add branch protection rule for main
4. Enable the settings above
5. Select required status checks from the latest CI run

## Release process

Manual full validation before release:

1. Actions -> Release Gate
2. Run workflow
3. Confirm success for lint, coverage, build, and e2e smoke
