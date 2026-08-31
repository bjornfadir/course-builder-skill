#!/usr/bin/env bash
#
# install.sh - Install the course-builder skill for Claude Code
#
# Copies the skill into your ~/.claude/skills/ directory. Self-contained:
# no other skill needs to be installed first.
#
# Usage:
#   bash install.sh              # Install (or update) the skill
#   bash install.sh --uninstall  # Remove the skill

set -euo pipefail

SKILL_DIR="$HOME/.claude/skills/course-builder"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

info() { echo -e "${BLUE}[INFO]${NC} $1"; }
ok() { echo -e "${GREEN}[OK]${NC} $1"; }
err() { echo -e "${RED}[ERR]${NC} $1"; }

install_skill() {
    info "Installing course-builder skill to $SKILL_DIR"
    mkdir -p "$SKILL_DIR/assets"
    cp "$SCRIPT_DIR/SKILL.md" "$SKILL_DIR/SKILL.md"
    cp "$SCRIPT_DIR"/*-FORMAT.md "$SKILL_DIR/"
    cp "$SCRIPT_DIR"/assets/*.js "$SKILL_DIR/assets/"
    ok "Skill installed."
    echo ""
    info "Use it by asking Claude Code to build a course, e.g.:"
    info '  "Use the course-builder skill to start a course on <topic> for <person>"'
    info "It treats the current directory as the course workspace — create/cd into one first."
}

uninstall() {
    if [[ -d "$SKILL_DIR" ]]; then
        info "Removing course-builder skill from $SKILL_DIR"
        rm -rf "$SKILL_DIR"
        ok "Removed."
    else
        info "Nothing installed at $SKILL_DIR"
    fi
}

case "${1:-}" in
    --uninstall)
        uninstall
        ;;
    *)
        install_skill
        ;;
esac
