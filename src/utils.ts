import { readFileSync } from 'fs';

export const readFileWithFileName = (fileName: string) => {
  try {
    const inputFile = readFileSync(fileName, 'utf-8');
    return inputFile;
  } catch (error) {
    console.error(error.message);
    throw new Error('File is probably missing!');
  }
};
export const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
