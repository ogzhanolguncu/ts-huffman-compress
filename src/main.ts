import chalkAnimation from 'chalk-animation';
import inquirer from 'inquirer';
import { sleep } from './utils.js';
import { compress } from './compression/write.js';
import { decompress } from './compression/read.js';

type CLIInputs = {
  inputFilePath: string;
  variant: 'compress' | 'decompress';
  outputFilePath: string;
};

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow('...Tinyfier...');
  await sleep();
  rainbowTitle.stop();
}

async function handleInputs(): Promise<CLIInputs> {
  const inputs = await inquirer.prompt([
    {
      type: 'list',
      name: 'variant',
      message: 'Pick one of the commands:',
      choices: ['compress', 'decompress'],
    },
    {
      type: 'input',
      name: 'inputFilePath',
      message: 'Enter the input file path:',
      validate: (input) => {
        if (!Boolean(input)) return 'Input path cannot be empty';
        return true;
      },
    },
    {
      type: 'input',
      name: 'outputFilePath',
      message: 'Enter the output file path:',
      validate: (input) => {
        if (!Boolean(input)) return 'Input path cannot be empty';
        return true;
      },
    },
  ]);

  return inputs;
}

function handleTinyfier(inputs: CLIInputs) {
  if (inputs.variant === 'compress')
    return compress(inputs.inputFilePath, inputs.outputFilePath);
  return decompress(inputs.inputFilePath, inputs.outputFilePath);
}

await welcome();
const answers = await handleInputs();
handleTinyfier(answers);
