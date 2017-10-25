interface IBinaryTree<T> {
  isEmpty(): boolean;
  createNode(value: T): void;
  Value: T; //???
  Left: IBinaryTree<T>;
  Right: IBinaryTree<T>;
}

interface IBinaryTreeNode<T> {
  value: T;
  left: IBinaryTree<T>;
  right: IBinaryTree<T>;
}

class BinaryTree<T> implements IBinaryTree<T> {
  private root: IBinaryTreeNode<T> = null;
  constructor(value?: T) {
    if (value) {
      this.createNode(value);
    }
  }

  isEmpty(): boolean {
    return this.root === null;
  }

  createNode(value: T): void {
    this.root = {
      value,
      left: new BinaryTree<T>(),
      right: new BinaryTree<T>()
    };
  }

  get Value(): T {
    return this.root.value;
  }

  set Value(value: T) {
    this.root.value = value;
  }

  get Left(): IBinaryTree<T> {
    return this.root.left;
  }

  set Left(value: IBinaryTree<T>) {
    this.root.left = value;
  }

  get Right(): IBinaryTree<T> {
    return this.root.right;
  }

  set Right(value: IBinaryTree<T>) {
    this.root.right = value;
  }
}

type BinFa = BinaryTree<number>;

let f1: BinFa, f2: BinFa, f3: BinFa;

f1 = new BinaryTree();
f1.createNode(3);

f2 = new BinaryTree(5);
f3 = new BinaryTree(10);

f1.Left = f2;
f1.Right = f3;

console.log(f1.Value, f1.Left.Value, f1.Right.Value);
console.log(f1.Left.Left.isEmpty());