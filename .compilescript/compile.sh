#!/usr/bin/env bash

function check_neccesary_packages() {
  if ! command -v docker &>/dev/null || ! command -v docker-compose &>/dev/null || ! command -v npm &>/dev/null || ! command -v node &>/dev/null; then
    install_packages docker.io docker-compose npm
  fi
}

function install_packages() {
    echo "[Bootstrap] Installing package(s) '$*'."

    # Currently always uses sudo, this can be optimized to always use the proper sudo/no sudo.
    sudo apt install $*
}

function export_variables() {
    export NODE_ENV=development
}

function run() {
    npm run dev:ssr --prefix $pathToClickFrontend
}

function find_path_to_frontend() {
    pathToClickFrontend=find -path \*/arsnova-click-v2-frontend 2>&1 | grep -v "Permission denied"
}

check_neccesary_packages

export_variables

run