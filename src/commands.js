const { exec } = require('child_process');
const chalk = require('chalk');
const { loadConfig } = require('./config');

const install = (tool, options) => {
  const config = loadConfig(options.config);
  const tools = config.tools;

  if (tool) {
    if (tools[tool]) {
      console.log(chalk.yellow(`Installing ${tool}...`));
      exec(tools[tool], (error, stdout, stderr) => {
        if (error) {
          console.error(chalk.red(`Error installing ${tool}: ${error.message}`));
          return;
        }
        if (stderr) {
          console.error(chalk.red(`Error installing ${tool}: ${stderr}`));
          return;
        }
        console.log(chalk.green(`${tool} installed successfully!`));
        if (options.verbose) {
          console.log(stdout);
        }
      });
    } else {
      console.error(chalk.red(`Unknown tool: ${tool}`));
    }
  } else {
    console.log(chalk.yellow('Installing all tools...'));
    Object.keys(tools).forEach((toolName) => {
      install(toolName, options);
    });
  }
};

const run = (tool) => {
  if (tool) {
    console.log(chalk.yellow(`Running ${tool}...`));
    exec(tool, (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red(`Error running ${tool}: ${error.message}`));
        return;
      }
      if (stderr) {
        console.error(chalk.red(`Error running ${tool}: ${stderr}`));
        return;
      }
      console.log(stdout);
    });
  } else {
    console.error(chalk.red('Please specify a tool to run.'));
  }
};

const createWorktree = (path, branch) => {
  const command = branch ? `git worktree add ${path} ${branch}` : `git worktree add ${path}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(chalk.red(`Error creating worktree: ${error.message}`));
      return;
    }
    if (stderr) {
      console.error(chalk.red(`Error creating worktree: ${stderr}`));
      return;
    }
    console.log(chalk.green(`Worktree created at ${path}`));
    console.log(stdout);
  });
};

const listWorktrees = () => {
  exec('git worktree list', (error, stdout, stderr) => {
    if (error) {
      console.error(chalk.red(`Error listing worktrees: ${error.message}`));
      return;
    }
    if (stderr) {
      console.error(chalk.red(`Error listing worktrees: ${stderr}`));
      return;
    }
    console.log(chalk.green('Available worktrees:'));
    console.log(stdout);
  });
};

const removeWorktree = (path) => {
  exec(`git worktree remove ${path}`, (error, stdout, stderr) => {
    if (error) {
      console.error(chalk.red(`Error removing worktree: ${error.message}`));
      return;
    }
    if (stderr) {
      console.error(chalk.red(`Error removing worktree: ${stderr}`));
      return;
    }
    console.log(chalk.green(`Worktree at ${path} removed.`));
    console.log(stdout);
  });
};

module.exports = {
  install,
  run,
  createWorktree,
  listWorktrees,
  removeWorktree,
  startSession,
  stopSession,
  switchSession,
  sessionStatus,
  cleanSessions,
  setConfigValue
};
