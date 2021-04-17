#!/usr/bin/env bash

# check for changes
UNCOMMITED_CHANGES=`git status --porcelain=v1 2>/dev/null | wc -l`
COMMIT_MESSAGE="[PackageRemove] $@"

if [ $UNCOMMITED_CHANGES -gt 0 ]; then
  echo "There are uncommited changes in your code."
  echo "Stashing changes..."
  git stash
fi

yarn remove $@

SCHEMA_CHANGES=`git status --porcelain=v1 2>/dev/null | wc -l`

if [ $SCHEMA_CHANGES -gt 0 ]; then
  echo "There are changes in package.json and yarn.lock, committing the changes as '${COMMIT_MESSAGE}'..."
  git commit -a -m "${COMMIT_MESSAGE}"
fi

if [ $UNCOMMITED_CHANGES -gt 0 ]; then
  echo "Reverting previously uncommited changes to your code with git stash."
  git stash pop
fi
