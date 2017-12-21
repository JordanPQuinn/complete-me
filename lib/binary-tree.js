import Node from '../lib/Node';

export default class Tree {
  constructor() {
    this.root = new Node(null);
    this.count = 0;
  }

  insert(data) {
    this.insertHelper(this.root, data);
  }

  insertHelper(node, string) {
    if (!node.children[string[0]]) {
      node.children[string[0]] = new Node(string[0]);

      if (string.length === 1) {
        node.children[ string[0] ].endWord = 1;
        this.count++;
      }
    }

    if (string.length > 1) {
      this.insertHelper(node.children[string[0]], string.slice(1));
    }
  }

  traverseTree(string) {
    let currNode = this.root.children[string[0]];
    let stringArray = [...string];

    for (let i = 1; i < stringArray.length; i++) {
      if (currNode.data !== stringArray[i - 1]) {
        return;
      }
      currNode = currNode.children[stringArray[i]];
    }
    return currNode;
  }

  suggest(string) {
    let currNode = this.traverseTree(string);
    const allWords = [];

    this.getWord(currNode, string, allWords);
    return allWords;
  }

  getWord(node, string, allWords) {
    if (node.selected) {
      allWords.unshift(string);
    }
    if (node.endWord === 1 && !node.selected) {
      allWords.push(string);
      return;
    }
    const otherBranches = Object.keys(node.children);

    otherBranches.forEach( (branch) => {
      const newString = string + branch;

      this.getWord(node.children[branch], newString, allWords);
    });
  }

  populate(dictionary) {
    dictionary.forEach( word => {
      this.insert(word);
    });
  }

  getCount() {
    return this.count;
  }

  select(string) {
    let currNode = this.traverseTree(string);

    currNode.selected = true;
  }

  delete(string) {
    let currNode = this.traverseTree(string);

    currNode.endWord = null;
    this.deleteHelper(string);
  }

  deleteHelper(string) {
    let prevNode = this.traverseTree(string.slice(0, -1));
    let currNode = this.traverseTree(string);

    if (!string.length) {
      this.count--;
      return;
    }
    if (Object.keys(currNode.children).length === 0) {
      delete (prevNode.children[string[string.length - 1]]);
    }

    let newString = string.slice(0, -1);

    this.deleteHelper(newString);
  }
}