import { readFileSync, writeFile } from 'fs';

const readCompressedText = (
  fileName: string,
): { prefixes: { [key: string]: string }; text: string } => {
  const data = readFileSync(fileName);

  const prefixLengthBytes = data.slice(0, 4);
  const prefixLength = prefixLengthBytes.readUInt32BE();

  const prefixesPart = data.slice(4, 4 + prefixLength);
  const prefixesString = prefixesPart.toString('utf8');
  const prefixes = JSON.parse(prefixesString);

  const textPart = data.slice(4 + prefixLength);
  const padding = textPart[0];
  const bytesWithoutPadding = textPart.slice(1);

  let text = Array.from(bytesWithoutPadding, (byte) =>
    byte.toString(2).padStart(8, '0'),
  );
  return {
    prefixes,
    text: text.join('').slice(0, -padding),
  };
};

const decodeHuffman = (
  prefixes: { [key: string]: string },
  text: string,
  outputPath: string,
) => {
  const reversePrefixes: { [key: string]: string } = {};

  for (const key in prefixes) {
    reversePrefixes[prefixes[key]] = key;
  }

  let decodedText = '';
  let currentCode = '';

  for (const bit of text) {
    currentCode += bit;
    if (currentCode in reversePrefixes) {
      decodedText += reversePrefixes[currentCode];
      currentCode = '';
    }
  }
  writeFile(outputPath, decodedText, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
  return decodedText;
};

export const handleDecompression = (inputPath: string, outputPath: string) => {
  try {
    const compressedHuffman = readCompressedText(inputPath);
    decodeHuffman(
      compressedHuffman.prefixes,
      compressedHuffman.text,
      outputPath,
    );
    return 'Successfully decompressed!';
  } catch (error) {
    console.log('Something went wrong while decompressing files');
    throw new Error(error);
  }
};
