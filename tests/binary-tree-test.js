import { expect } from 'chai';
import Tree from '../lib/binary-tree';
import fs from 'fs';

describe('TREE', () => {
  let tree;

  beforeEach(() => {
    tree = new Tree();
  });

  it('should be a constructor function', () => {
    expect(tree).to.be.an.instanceof(Tree);
  });

  it('should start with zero elements', () => {
    expect(tree.count).to.eq(0);
  });

  it('should set its default head to null', () => {
    expect(tree.root.data).to.eq(null);
  });

  describe('INSERT', () => {
    it('should insert a word split into its letters into the tree', () => {
      let string = 'pizza';

      tree.insert(string);
      expect(tree.root.children.p.data).to.eq('p');
      expect(tree.root.children.
        p.children.
        i.data).to.eq('i');
      expect(tree.root.children.
        p.children.
        i.children.
        z.data).to.eq('z');
      expect(tree.root.children.
        p.children.
        i.children.
        z.children.
        z.data).to.eq('z');
      expect(tree.root.children.
        p.children.
        i.children.
        z.children.
        z.children.
        a.data).to.eq('a');
    });

    it('should increase the count of the tree', () => {
      tree.insert('pizza');
      tree.insert('pizzeria');
      expect(tree.count).to.eq(2);
    });
  });

  describe('POPULATE', () => {
    it('should populate with a dictionary', () => {
      const text = "/usr/share/dict/words";
      const dictionary = fs.readFileSync(text).toString().trim().split('\n');

      tree.populate(dictionary);
      let wordCount = tree.getCount();

      expect(wordCount).to.eq(235886);
    });
  });

  describe('SUGGEST + SELECT', () => {
    it('should suggest words based on the string input', () => {
      tree.insert('pizza');
      tree.insert('pizzeria');
      let suggestArray = tree.suggest('piz');

      expect(suggestArray).to.deep.eq(['pizza', 'pizzeria']);
    });

    it('should take a selection and place it in the front of your suggestions', () => {
      const text = "/usr/share/dict/words";
      const dictionary = fs.readFileSync(text).toString().trim().split('\n');

      tree.populate(dictionary);
      let suggestArray = tree.suggest('piz');

      expect(suggestArray).to.deep.eq([ 
        'pize', 
        'pizza', 
        'pizzeria', 
        'pizzicato', 
        'pizzle' ]);
      tree.select('pizzeria');
      tree.select('pize');
      suggestArray = tree.suggest('piz');

      expect(suggestArray).to.deep.eq([
        'pizzeria', 
        'pize', 
        'pizza', 
        'pizzicato', 
        'pizzle' ]);
    });
  });

  describe('DELETE', () => {
    it('should take a string input and delete it from the suggestion array', () => {
      const text = "/usr/share/dict/words";
      const dictionary = fs.readFileSync(text).toString().trim().split('\n');

      tree.populate(dictionary);
      let suggestArray = tree.suggest('piz');

      expect(suggestArray).to.deep.eq([ 
        'pize', 
        'pizza', 
        'pizzeria', 
        'pizzicato', 
        'pizzle' ]);
      tree.delete('pizzle');
      expect(tree.root.children.
        p.children.
        i.children.
        z.children.
        z.children.l).to.eq(undefined);
      suggestArray = tree.suggest('piz');

      expect(suggestArray).to.deep.eq([ 
        'pize', 
        'pizza', 
        'pizzeria', 
        'pizzicato']);
    });

    it('should decrement the count when deleting words', () => {
      const text = "/usr/share/dict/words";
      const dictionary = fs.readFileSync(text).toString().trim().split('\n');

      tree.populate(dictionary);

      let suggestArray = tree.suggest('piz');
      let wordCount = tree.getCount();

      expect(wordCount).to.eq(235886);

      tree.delete('pizzle');
      tree.delete('pizzeria');

      wordCount = tree.getCount();
      expect(wordCount).to.eq(235884);
    });
  });
});