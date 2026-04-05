#!/bin/sh
set -eu

cd /app

exec ./node_modules/.bin/openclaw gateway run "$@"
