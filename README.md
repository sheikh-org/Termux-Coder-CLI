# Termux Coder CLI

A command-line tool for installing and running various AI coding assistants in Termux.

## Installation

```bash
npm install -g termux-coder-cli
```

## Usage

### Install a tool

To install a specific tool, use the `install` command:

```bash
termux-coder-cli install <tool-name>
```

For example, to install Codex:

```bash
termux-coder-cli install codex
```

To install all tools, run:

```bash
termux-coder-cli install
```

### Run a tool

To run a specific tool, use the `run` command:

```bash
termux-coder-cli run <tool-name>
```

For example, to run Codex:

```bash
termux-coder-cli run codex
```

### Configuration

The configuration file is located at `~/.termux-coder-cli/config.json`. You can customize the tools and their installation commands in this file.
