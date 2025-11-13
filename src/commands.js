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

module.exports = { install, run };
