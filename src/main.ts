import { readFileSync } from 'fs';

interface HuffmanLeafNode {
  type: 'leaf';
  char: string;
  frequency: number;
}

interface HuffmanInternalNode {
  type: 'internal';
  frequency: number;
  left: HuffmanNode;
  right: HuffmanNode;
}

type HuffmanNode = HuffmanLeafNode | HuffmanInternalNode;

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
  const sortedFrequencyList: HuffmanNode[] = frequencyList
    .sort((a, b) => a[1] - b[1])
    .map(([char, frequency]) => ({ type: 'leaf', char, frequency }));

  while (sortedFrequencyList.length > 1) {
    const leastTwo = sortedFrequencyList.splice(0, 2);
    const combinedNode: HuffmanInternalNode = {
      type: 'internal',
      frequency: leastTwo[0].frequency + leastTwo[1].frequency,
      left: leastTwo[0],
      right: leastTwo[1],
    };
    const index = sortedFrequencyList.findIndex(
      (node) => node.frequency > combinedNode.frequency,
    );
    if (index === -1) {
      sortedFrequencyList.push(combinedNode);
    } else {
      sortedFrequencyList[index] = combinedNode;
    }
  }
  return sortedFrequencyList[0].right;
};

console.log(
  constructAHuffmanTree(prepareAFrequencyMap(readFile('./hello-world.txt'))),
);
