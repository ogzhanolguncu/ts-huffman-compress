import { writeFile } from 'fs';
import {
  HuffmanNode,
  HuffmanLeafNode,
  HuffmanInternalNode,
} from '../huffman.js';
import { PriorityQueue } from '../priority-queue.js';
import { readFileWithFileName } from '../utils.js';

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
  const prefixesString = JSON.stringify(prefixes);
  const prefixLength = Buffer.byteLength(prefixesString, 'utf8');
  const prefixLengthBytes = Buffer.alloc(4); // Using 4 bytes to store the length (assuming max length is within Uint32 range)
  prefixLengthBytes.writeUInt32BE(prefixLength);

  const mergedBuffer = Buffer.concat([
    prefixLengthBytes,
    Buffer.from(prefixesString, 'utf8'),
    text,
  ]);

  writeFile(fileName, mergedBuffer, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
};

const inputFile = readFileWithFileName('./les-miserables.txt');
const frequencyMap = prepareAFrequencyMap(inputFile);
const huffmanTree = constructAHuffmanTree(frequencyMap);
const huffmanTreeWithPrefix = generateHuffmanCodesWithPrefixes(huffmanTree);
const compressedText = compressText(huffmanTreeWithPrefix, inputFile);
writeCompressedTextToFile(
  huffmanTreeWithPrefix,
  compressedText,
  'compressed-hello.txt',
);
