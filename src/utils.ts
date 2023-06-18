import { readFileSync } from 'fs';

export const convertBytesToBits = (numbers: Uint8Array) => {
  const bits: string[] = [];

  for (const num of numbers) {
    const binary = num.toString(2).padStart(8, '0');
    bits.push(binary);
  }
  return bits;
};

export const readFileWithFileName = (fileName: string) => {
  try {
    const inputFile = readFileSync(fileName, 'utf-8');
    return inputFile;
  } catch (error) {
    console.error(error.message);
    throw new Error('File is probably missing!');
  }
};
