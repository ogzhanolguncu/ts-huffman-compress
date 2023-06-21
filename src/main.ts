import { readFileSync, writeFile } from 'fs';
import {
  HuffmanInternalNode,
  HuffmanLeafNode,
  HuffmanNode,
} from './huffman.js';
import { PriorityQueue } from './priority-queue.js';
import { convertBytesToBits, readFileWithFileName } from './utils.js';

const prepareAFrequencyMap = (text: string) => {
  const frequencyMap = new Map<string, number>();

  for (const char of text) {
    frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
  }
  return Array.from(frequencyMap);
};

const constructAHuffmanTree = (frequencyList: [string, number][]) => {
  const nodes = new PriorityQueue<HuffmanNode>();

  for (const [char, frequency] of frequencyList) {
    nodes.enqueue({
      priority: frequency,
      value: new HuffmanLeafNode(char, frequency),
    });
  }

  while (nodes.items.length > 1) {
    const node1 = nodes.dequeue();
    const node2 = nodes.dequeue();
    const leftNode = node1.priority < node2.priority ? node1 : node2;
    const rightNode = node1.priority < node2.priority ? node2 : node1;
    nodes.enqueue({
      priority: leftNode.priority + rightNode.priority,
      value: new HuffmanInternalNode(leftNode.value, rightNode.value),
    });
  }

  return nodes;
};

const generateHuffmanCodesWithPrefixes = (
  huffmanTree: PriorityQueue<HuffmanNode>,
) => {
  const huffmanCodes: { [key: string]: string } = {};
  function generateHuffmanCodes(node: HuffmanNode, code: string) {
    if (node.isLeaf()) {
      huffmanCodes[(node as HuffmanLeafNode).char] = code;
    } else {
      generateHuffmanCodes((node as HuffmanInternalNode).left, code + '0');
      generateHuffmanCodes((node as HuffmanInternalNode).right, code + '1');
    }
  }
  generateHuffmanCodes(huffmanTree.peek().value, '');

  return huffmanCodes;
};

const compressText = (prefixes: { [key: string]: string }, text: string) => {
  const arrayOfCodes: string[] = [];
  for (const char of text) {
    const code = prefixes[char];
    if (code) {
      arrayOfCodes.push(code);
    }
  }
  let bitPacks = arrayOfCodes.join('');
  // Calculate the padding needed for the last byte
  const padding = 8 - (bitPacks.length % 8);
  bitPacks = bitPacks.padEnd(bitPacks.length + padding, '0');

  const byteArray = [padding]; // Store padding as the first byte
  for (let i = 0; i < bitPacks.length; i += 8) {
    const byteString = bitPacks.substr(i, 8);
    const byte = parseInt(byteString, 2);
    byteArray.push(byte);
  }
  return Uint8Array.from(byteArray);
};

const writeCompressedTextToFile = (
  prefixes: { [key: string]: string },
  text: Uint8Array,
  fileName: string,
) => {
  var encoder = new TextEncoder();
  const header = encoder.encode(`${JSON.stringify(prefixes)}#`);
  var mergedArray = new Uint8Array(header.length + text.length);
  mergedArray.set(header);
  mergedArray.set(text, header.length);

  writeFile(fileName, Buffer.from(mergedArray), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
};

const readCompressedText = (
  fileName: string,
): { prefixes: { [key: string]: string }; text: string } => {
  const data = readFileSync(fileName);
  console.log({ data });
  //   // Finding the index of '#' character
  const hashIndex = data.indexOf('#'.charCodeAt(0));

  // Decoding the JSON part
  const prefixesPart = data.slice(0, hashIndex);
  const prefixes = JSON.parse(prefixesPart.toString());

  // Getting the compressed binary part
  const textPart = data.slice(hashIndex + 1);

  // Get the padding from the first byte
  const padding = textPart[0];
  const bytesWithoutPadding = textPart.slice(1);

  // Convert each byte to bits
  let text = Array.from(bytesWithoutPadding, (byte) =>
    byte.toString(2).padStart(8, '0'),
  );
  return {
    prefixes,
    text: text.join('').slice(0, -padding),
  };
};

const decodeHuffman = (prefixes: { [key: string]: string }, text: string) => {
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
  return decodedText;
};

// const inputFile = readFileWithFileName('./hello-world.txt');
// const frequencyMap = prepareAFrequencyMap(inputFile);
// const huffmanTree = constructAHuffmanTree(frequencyMap);
// const huffmanTreeWithPrefix = generateHuffmanCodesWithPrefixes(huffmanTree);
// const compressedText = compressText(huffmanTreeWithPrefix, inputFile);
// writeCompressedTextToFile(
//   huffmanTreeWithPrefix,
//   compressedText,
//   'compressed-hello.txt',
// );

const compressedHuffman = readCompressedText('./compressed-hello.txt');
console.log(decodeHuffman(compressedHuffman.prefixes, compressedHuffman.text));
