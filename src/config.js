const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const configDir = path.join(process.env.HOME, '.termux-coder-cli');
const configFile = path.join(configDir, 'config.json');

const defaultConfig = {
  tools: {
    codex: 'npm install -g @openai/codex',
    gemini: 'npm install -g @google/gemini-cli',
    claude: process.platform === 'darwin'
      ? 'brew install --cask claude-code'
      : 'curl -fsSL https://claude.ai/install.sh | bash',
    cosine: 'curl -fsSL https://cosine.sh/install | bash',
    opencode: 'npm install -g opencode-ai@latest',
    factory: 'curl -fsSL https://app.factory.ai/cli | sh',
  },
  shortcuts: {
    'start-session': 'ctrl+s',
    'stop-session': 'ctrl+x',
    'switch-session': 'ctrl+t',
  },
  presets: {
    'default-claude': 'session start claude-code default-worktree',
    'default-gemini': 'session start gemini-cli default-worktree',
  },
  hooks: {
    'after-session-start': '',
    'before-session-stop': '',
  }
};

const loadConfig = (configPath) => {
  const finalConfigPath = configPath || configFile;

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (!fs.existsSync(finalConfigPath)) {
    fs.writeFileSync(finalConfigPath, JSON.stringify(defaultConfig, null, 2));
    console.log(chalk.green(`Default config created at ${finalConfigPath}`));
  }

  const configData = fs.readFileSync(finalConfigPath, 'utf8');
  return JSON.parse(configData);
};

const saveConfig = (config, configPath) => {
  const finalConfigPath = configPath || configFile;
  fs.writeFileSync(finalConfigPath, JSON.stringify(config, null, 2));
};

const setConfigValue = (key, value, configPath) => {
  const config = loadConfig(configPath);
  const keys = key.split('.');
  let current = config;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
    if (!current) {
      console.error(chalk.red(`Invalid config key: ${key}`));
      return;
    }
  }
  current[keys[keys.length - 1]] = value;
  saveConfig(config, configPath);
  console.log(chalk.green(`Set ${key} to ${value}`));
};

module.exports = { loadConfig, setConfigValue };
