const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const chalk = require('chalk');

const sessionDir = path.join(process.env.HOME, '.termux-coder-cli', 'sessions');

if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir, { recursive: true });
}

const getSessionFile = (worktree) => {
  const worktreeName = path.basename(worktree);
  return path.join(sessionDir, `${worktreeName}.json`);
};

const startSession = (tool, worktree) => {
  const sessionFile = getSessionFile(worktree);
  if (fs.existsSync(sessionFile)) {
    const existingSession = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
    if (existingSession.status === 'running') {
      console.error(chalk.red(`Session already running in ${worktree}. Stop it first.`));
      return;
    }
  }

  const logFile = path.join(sessionDir, `${path.basename(worktree)}.log`);
  const out = fs.openSync(logFile, 'a');
  const err = fs.openSync(logFile, 'a');

  const child = spawn(tool, [], {
    detached: true,
    stdio: ['ignore', out, err],
    cwd: worktree
  });

  child.unref();

  const sessionData = {
    tool,
    worktree,
    pid: child.pid,
    logFile,
    status: 'running'
  };

  fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2));
  console.log(chalk.green(`Session started for ${tool} in ${worktree} (PID: ${child.pid})`));
};

const stopSession = (worktree) => {
  const sessionFile = getSessionFile(worktree);
  if (!fs.existsSync(sessionFile)) {
    console.error(chalk.red(`No session found for ${worktree}`));
    return;
  }

  const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));

  if (sessionData.status === 'running') {
    try {
      process.kill(sessionData.pid, 'SIGTERM');
    } catch (err) {
      if (err.code !== 'ESRCH') { // Ignore "No such process" error
        console.error(chalk.red(`Error stopping process ${sessionData.pid}: ${err.message}`));
      }
    }
    sessionData.status = 'stopped';
    fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2));
    console.log(chalk.green(`Session stopped for ${worktree}`));
  } else {
    console.log(chalk.yellow(`Session for ${worktree} is already stopped.`));
  }
};

const switchSession = (worktree) => {
  console.log(chalk.yellow(`Switching to session in ${worktree}...`));
  // This is a placeholder. In a real terminal app, this would involve
  // attaching to the process or managing terminal multiplexers.
  console.log(chalk.green(`Switched to ${worktree}.`));
};

const sessionStatus = () => {
  const sessions = fs.readdirSync(sessionDir).filter(f => f.endsWith('.json'));
  if (sessions.length === 0) {
    console.log(chalk.yellow('No active sessions.'));
    return;
  }

  console.log(chalk.bold.underline('Active Sessions:'));
  sessions.forEach(sessionFile => {
    const sessionData = JSON.parse(fs.readFileSync(path.join(sessionDir, sessionFile), 'utf8'));
    let statusColored;
    switch (sessionData.status) {
      case 'running':
        statusColored = chalk.green(sessionData.status);
        break;
      case 'stopped':
        statusColored = chalk.red(sessionData.status);
        break;
      case 'idle':
        statusColored = chalk.yellow(sessionData.status);
        break;
      default:
        statusColored = sessionData.status;
    }
    console.log(
      `- Worktree: ${chalk.cyan(sessionData.worktree)}, Tool: ${chalk.magenta(sessionData.tool)}, PID: ${chalk.blue(sessionData.pid || 'N/A')}, Status: ${statusColored}`
    );
  });
};

const cleanSessions = () => {
  const sessions = fs.readdirSync(sessionDir).filter(f => f.endsWith('.json'));
  sessions.forEach(sessionFile => {
    const sessionData = JSON.parse(fs.readFileSync(path.join(sessionDir, sessionFile), 'utf8'));
    if (sessionData.status === 'stopped') {
      fs.unlinkSync(path.join(sessionDir, sessionFile));
      console.log(chalk.green(`Removed stopped session for ${sessionData.worktree}`));
    }
  });
};

module.exports = {
  startSession,
  stopSession,
  switchSession,
  sessionStatus,
  cleanSessions
};
