const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const configDir = path.join(process.env.HOME, '.termux-coder-cli');
const configFile = path.join(configDir, 'config.json');

const defaultConfig = {
  tools: {
    codex: 'npm install -g @openai/codex',
    gemini: 'npm install -g @google/gemini-cli',
    claude: 'npm install -g @anthropic-ai/claude-code',
    cosine: 'curl -fsSL https://cosine.sh/install | bash',
    opencode: 'npm install -g opencode-ai@latest',
    factory: 'curl -fsSL https://app.factory.ai/cli | sh',
  },
};

const loadConfig = (configPath) => {
  if (configPath) {
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    } else {
      console.error(chalk.red(`Config file not found: ${configPath}`));
      process.exit(1);
    }
  } else {
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir);
    }
    if (!fs.existsSync(configFile)) {
      fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
    }
    const configData = fs.readFileSync(configFile, 'utf8');
    return JSON.parse(configData);
  }
};

module.exports = { loadConfig };
