import type { 
  FullConfig,
  FullResult, 
  Reporter, 
  TestCase, 
  TestResult, 
  TestStep 
} from '@playwright/test/reporter';
import chalk from 'chalk';

class WorkerReporter implements Reporter {
  private startTime: number = 0;

  onBegin(config: FullConfig, suite: any) {
    this.startTime = Date.now();
    const totalTests = suite.allTests().length;
    const totalWorker = config.workers;
    console.log(chalk.bold.magenta(`\n🚀 Start test`));
    console.log(chalk.white(`Worker total: `) + chalk.bold.cyan(totalWorker));
    console.log(chalk.white(`Test Case total: `) + chalk.bold.cyan(totalTests));
    console.log(chalk.gray(`--------------------------------------------------\n`));
  }

  onStdOut(chunk: string | Buffer, test?: TestCase, result?: TestResult) {
    const text = chunk.toString().trim();
    if (text) {
      console.log(
        chalk.blue(`[Worker-${result?.workerIndex ? result.workerIndex + 1 : '?'}]`) +
        ' ' +
        chalk.white(`LOG: ${text}`)
      );
    }
  }

  onStdErr(chunk: string | Buffer, test?: TestCase, result?: TestResult) {
    const text = chunk.toString().trim();
    if (text) {
      console.error(
        chalk.blue(`[Worker-${result?.workerIndex ? result.workerIndex + 1 : '?'}]`) +
        ' ' +
        chalk.red(`STDERR: ${text}`)
      );
    }
  }

  onTestBegin(test: TestCase, result: TestResult) {
    console.log(
      chalk.blue(`[Worker-${result.workerIndex + 1}]`) +
      ' ' +
      chalk.yellow(`START: ${test.title}`)
    );
  }

  onStepBegin(test: TestCase, result: TestResult, step: TestStep) {
    if (step.category === 'test.step') {
      console.log(
        chalk.blue(`[Worker-${result.workerIndex + 1}]`) +
        ' ' +
        chalk.cyan(`STEP: ${step.title}`)
      );
    }
  }

  onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
    if (step.category === 'test.step') {
      const statusColor = step.error ? chalk.red : chalk.green;
      console.log(
        chalk.blue(`[Worker-${result.workerIndex + 1}]`) +
        ' ' +        statusColor(`STEP END: ${step.title} ${step.error ? '→ failed' : '→ passed'}`)
      );
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const statusColor =
      result.status === 'passed'
        ? chalk.green
        : result.status === 'failed'
        ? chalk.red
        : chalk.gray;

    console.log(
      chalk.blue(`[Worker-${result.workerIndex + 1}]`) +
      ' ' +
      statusColor(`END: ${test.title} → ${result.status}`)
    );
  }

  onEnd(result: FullResult) {
    const duration = Date.now() - this.startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(2);

    const statusColor = result.status === 'passed' ? chalk.bold.green : chalk.bold.red;

    console.log(chalk.gray(`\n--------------------------------------------------`));
    console.log(
      chalk.bold.white(`All test finished in: `) + 
      chalk.bold.yellow(`${minutes}m ${seconds}s`)
    );
    console.log(
      chalk.white(`Final status: `) + 
      statusColor(result.status.toUpperCase())
    );
    console.log(chalk.gray(`--------------------------------------------------\n`));
  }
}

export default WorkerReporter;