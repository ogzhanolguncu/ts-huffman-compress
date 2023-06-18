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
    const leftNode = nodes.dequeue();
    const rightNode = nodes.dequeue();
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
  const bitPacks = arrayOfCodes
    .join('')
    .match(/.{1,8}/g)
    .map((x) => x.padEnd(8, '0'))
    .join('');

  const byteArray = [];
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
): {
  prefixes: { [key: string]: string };
  text: string[];
} => {
  const sd = readFileSync(fileName);
  let byteArray = Uint8Array.from(sd);

  let str = String.fromCharCode.apply(null, byteArray);

  return {
    prefixes: JSON.parse(str.split('#')[0]),
    text: convertBytesToBits(new Uint8Array(Buffer.from(str.split('#')[1]))),
  };
};

const decodeHuffman = (prefixes: { [key: string]: string }, text: string[]) => {
  const reversePrefixes: { [key: string]: string } = {};

  for (const key in prefixes) {
    reversePrefixes[prefixes[key]] = key;
  }

  let decodedText = '';
  const mergedBits = text.join('');
  let currentCode = '';

  for (const bit of mergedBits) {
    currentCode += bit;
    if (currentCode in reversePrefixes) {
      decodedText += reversePrefixes[currentCode];
      currentCode = '';
    }
  }
  return decodedText;
};

const inputFile = readFileWithFileName('./hello-world.txt');
const frequencyMap = prepareAFrequencyMap(inputFile);
const huffmanTree = constructAHuffmanTree(frequencyMap);
const huffmanTreeWithPrefix = generateHuffmanCodesWithPrefixes(huffmanTree);
const compressedText = compressText(huffmanTreeWithPrefix, inputFile);
console.log({ huffmanTreeWithPrefix, compressText });
writeCompressedTextToFile(
  huffmanTreeWithPrefix,
  compressedText,
  'compressed-hello.txt',
);

// const compressedHuffman = readCompressedText('./compressed-hello.txt');
// console.log(decodeHuffman(compressedHuffman.prefixes, compressedHuffman.text));
