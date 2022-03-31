#!/bin/bash

set -euo pipefail

for code in puzzles/*.cpp; do
  name="${code#puzzles/}"
  name="${name%.cpp}"
  jq -rn --arg x "$(cat "$code")" '$x|@uri' | base64 >"public/targetCode/$name.txt"
  echo "$code"
done

for html in puzzles/*.html; do
  name="${html#puzzles/}"
  name="${name%.html}"
  jq -rn --arg x "$(cat "$html")" '$x|@uri' | base64 >"public/statement/$name.txt"
  echo "$html"
done
