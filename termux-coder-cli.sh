#!/bin/bash

# =============================
# Termux Coder CLI Installer/Launcher
# Version: 1.0.0
# Supports: Codex CLI, Gemini CLI, Claude Code, Cosine, OpenCode AI, Factory AI
# =============================

VERSION="1.0.0"

show_help() {
    echo "Termux Coder CLI v$VERSION"
    echo "Usage: ./termux-coder-cli.sh [command]"
    echo ""
    echo "Commands:"
    echo "  --help, -h    Show this help message"
    echo ""
    echo "Description:"
    echo "  A script to install and manage various AI coding assistant CLIs."
    echo "  Running the script without arguments will open an interactive menu."
}

# Colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
NC="\033[0m"

# Check command existence
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Environment and Dependency Check
check_and_install_dependencies() {
    echo -e "${YELLOW}Checking environment and dependencies...${NC}"
    IS_TERMUX=false
    if [[ -n "$TERMUX_VERSION" ]]; then
        IS_TERMUX=true
        echo -e "${GREEN}Termux environment detected.${NC}"
    else
        echo -e "${YELLOW}Non-Termux environment detected (${OS}).${NC}"
    fi

    dependencies=("git" "curl" "python" "nodejs")
    for dep in "${dependencies[@]}"; do
        if ! command_exists "$dep"; then
            echo -e "${YELLOW}Dependency '$dep' not found.${NC}"
            if $IS_TERMUX; then
                echo -e "${YELLOW}Attempting to install '$dep' with pkg...${NC}"
                pkg install -y "$dep"
                if ! command_exists "$dep"; then
                    echo -e "${RED}Failed to install '$dep'. Please install it manually.${NC}"
                    exit 1
                fi
                echo -e "${GREEN}'$dep' installed successfully.${NC}"
            else
                echo -e "${RED}Please install '$dep' using your system's package manager (e.g., apt, brew, yum).${NC}"
                exit 1
            fi
        else
            echo -e "${GREEN}Dependency '$dep' is already installed.${NC}"
        fi
    done

    if ! command_exists npm; then
        echo -e "${RED}npm is required but not found. It should have been installed with nodejs. Aborting.${NC}"
        exit 1
    fi
}

# Argument handling
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    show_help
    exit 0
fi

# OS detection
OS="$(uname)"
check_and_install_dependencies

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

install_opencode() {
    if command_exists opencode; then
        echo -e "${GREEN}OpenCode AI is already installed.${NC}"
    else
        echo -e "${YELLOW}Installing OpenCode AI...${NC}"
        npm install -g opencode-ai@latest
    fi
}

install_factoryai() {
    if command_exists factory; then
        echo -e "${GREEN}Factory AI is already installed.${NC}"
    else
        echo -e "${YELLOW}Installing Factory AI...${NC}"
        curl -fsSL https://app.factory.ai/cli | sh
    fi
}

# Menu
echo -e "${YELLOW}Select an option:${NC}"
echo "1) Install all AI agents"
echo "2) Install Codex CLI only"
echo "3) Install Gemini CLI only"
echo "4) Install Claude Code only"
echo "5) Install Cosine only"
echo "6) Install OpenCode AI only"
echo "7) Install Factory AI only"
echo "8) Run a tool"
read -p "Enter choice [1-8]: " choice

case $choice in
    1)
        install_codex
        install_gemini
        install_claude
        install_cosine
        install_opencode
        install_factoryai
        ;;
    2) install_codex ;;
    3) install_gemini ;;
    4) install_claude ;;
    5) install_cosine ;;
    6) install_opencode ;;
    7) install_factoryai ;;
    8)
        echo "Available tools:"
        echo "1) codex"
        echo "2) gemini"
        echo "3) claude"
        echo "4) cosine"
        echo "5) opencode"
        echo "6) factory"
        read -p "Enter tool number to run: " tool
        case $tool in
            1) codex ;;
            2) gemini ;;
            3) claude ;;
            4) cosine ;;
            5) opencode ;;
            6) factory ;;
            *) echo "Invalid option" ;;
        esac
        ;;
    *) echo "Invalid option" ;;
esac
