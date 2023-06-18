import { readFileSync } from 'fs';
import { PriorityQueue } from './priority-queue.js';
import {
  HuffmanInternalNode,
  HuffmanLeafNode,
  HuffmanNode,
} from './huffman.js';

const readFile = (fileName: string) => {
  try {
    const inputFile = readFileSync(fileName, 'utf-8');
    return inputFile;
  } catch (error) {
    console.error(error.message);
    throw new Error('File is probably missing!');
  }
};

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

function generateHuffmanCodes(node: HuffmanNode, code: string) {
  if (node.isLeaf()) {
    huffmanCodes[(node as HuffmanLeafNode).char] = code;
  } else {
    generateHuffmanCodes((node as HuffmanInternalNode).left, code + '0');
    generateHuffmanCodes((node as HuffmanInternalNode).right, code + '1');
  }
}

function decodeHuffmanCodes(node: HuffmanNode, code: string) {
  if (node.isLeaf()) {
    huffmanCodes[(node as HuffmanLeafNode).char] = code;
  } else {
    generateHuffmanCodes((node as HuffmanInternalNode).left, code + '0');
    generateHuffmanCodes((node as HuffmanInternalNode).right, code + '1');
  }
}

const huffmanCodes: { [key: string]: string } = {};
const huffmanTree = constructAHuffmanTree(
  prepareAFrequencyMap(readFile('./hello-world.txt')),
);
generateHuffmanCodes(huffmanTree.peek().value, '');
console.log(huffmanCodes);
