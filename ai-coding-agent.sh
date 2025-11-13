#!/bin/bash

# =============================
# AI Coding Agent Installer/Launcher
# Supports: Codex CLI, Gemini CLI, Claude Code
# =============================

# Colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
NC="\033[0m"

# Check command existence
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# OS detection
OS="$(uname)"
echo -e "${YELLOW}Detected OS: $OS${NC}"

# Ensure npm is installed
if ! command_exists npm; then
    echo -e "${RED}npm is required but not installed. Aborting.${NC}"
    exit 1
fi

# Ensure python for gemini-cli
if ! command_exists python3 && ! command_exists python; then
    echo -e "${RED}Python is required for some tools. Please install Python 2.6+ or 3.x.${NC}"
fi

# Install functions
install_codex() {
    if command_exists codex; then
        echo -e "${GREEN}Codex CLI is already installed.${NC}"
    else
        echo -e "${YELLOW}Installing Codex CLI...${NC}"
        npm install -g @openai/codex
    fi
}

install_gemini() {
    if command_exists gemini; then
        echo -e "${GREEN}Gemini CLI is already installed.${NC}"
    else
        echo -e "${YELLOW}Installing Gemini CLI...${NC}"
        npm install -g @google/gemini-cli
    fi
}

install_claude() {
    if command_exists claude; then
        echo -e "${GREEN}Claude Code is already installed.${NC}"
    else
        echo -e "${YELLOW}Installing Claude Code...${NC}"
        if [[ "$OS" == "Darwin" ]]; then
            brew install --cask claude-code
        else
            curl -fsSL https://claude.ai/install.sh | bash
        fi
    fi
}

install_cosine() {
    if command_exists cosine; then
        echo -e "${GREEN}Cosine is already installed.${NC}"
    else
        echo -e "${YELLOW}Installing Cosine...${NC}"
        curl -fsSL https://cosine.sh/install | bash
    fi
}

# Menu
echo -e "${YELLOW}Select an option:${NC}"
echo "1) Install all AI agents"
echo "2) Install Codex CLI only"
echo "3) Install Gemini CLI only"
echo "4) Install Claude Code only"
echo "5) Install Cosine only"
echo "6) Run a tool"
read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        install_codex
        install_gemini
        install_claude
        install_cosine
        ;;
    2) install_codex ;;
    3) install_gemini ;;
    4) install_claude ;;
    5) install_cosine ;;
    6)
        echo "Available tools:"
        echo "1) codex"
        echo "2) gemini"
        echo "3) claude"
        echo "4) cosine"
        read -p "Enter tool number to run: " tool
        case $tool in
            1) codex ;;
            2) gemini ;;
            3) claude ;;
            4) cosine ;;
            *) echo "Invalid option" ;;
        esac
        ;;
    *) echo "Invalid option" ;;
esac
