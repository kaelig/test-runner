import { getParsedCliOptions } from './getParsedCliOptions';
import type { BrowserType } from 'jest-playwright-preset';

type CliOptions = {
  runnerOptions: {
    storiesJson?: boolean;
    configDir?: string;
    eject?: boolean;
    browsers?: BrowserType | BrowserType[];
  };
  jestOptions: string[];
};

type StorybookRunnerCommand = keyof CliOptions['runnerOptions'];

const STORYBOOK_RUNNER_COMMANDS: StorybookRunnerCommand[] = [
  'storiesJson',
  'configDir',
  'browsers',
  'eject',
];

export const getCliOptions = () => {
  const { options: allOptions, extraArgs } = getParsedCliOptions();

  const defaultOptions: CliOptions = {
    runnerOptions: {},
    jestOptions: process.argv.splice(0, 2),
  };

  const finalOptions = Object.keys(allOptions).reduce((acc, key: any) => {
    if (STORYBOOK_RUNNER_COMMANDS.includes(key)) {
      //@ts-ignore
      acc.runnerOptions[key] = allOptions[key];
    } else {
      if (allOptions[key] === true) {
        acc.jestOptions.push(`--${key}`);
      } else if (allOptions[key] === false) {
        acc.jestOptions.push(`--no-${key}`);
      } else {
        acc.jestOptions.push(`--${key}`, allOptions[key]);
      }
    }

    return acc;
  }, defaultOptions);

  if (extraArgs.length) {
    finalOptions.jestOptions.push(...extraArgs);
  }

  return finalOptions;
};