export abstract class HuffmanNode {
  frequency: number;

  constructor(frequency: number) {
    this.frequency = frequency;
  }

  abstract isLeaf(): boolean;
}

export class HuffmanLeafNode extends HuffmanNode {
  char: string;

  constructor(char: string, frequency: number) {
    super(frequency);
    this.char = char;
  }

  isLeaf(): boolean {
    return true;
  }
}

export class HuffmanInternalNode extends HuffmanNode {
  left: HuffmanNode;
  right: HuffmanNode;

  constructor(left: HuffmanNode, right: HuffmanNode) {
    super(left.frequency + right.frequency);
    this.left = left;
    this.right = right;
  }

  isLeaf(): boolean {
    return false;
  }
}
