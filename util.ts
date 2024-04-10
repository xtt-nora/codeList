export const Stack = (function () {
  const _items = new WeakMap();
  return class {
    constructor() {
      _items.set(this, []);
    }

    push(el: any) {
      _items.get(this).push(el);
    }

    pop() {
      return _items.get(this).pop();
    }
    peek() {
      return _items.get(this)[_items.get(this).length - 1];
    }
    // 清空栈
    clear() {
      _items.set(this, []);
    }
    // 栈的大小
    size() {
      return _items.get(this).length;
    }
    // 栈是否为空
    isEmpty() {
      return _items.get(this).length === 0;
    }
  };
})();

export class History {
  currentStack: any;
  undoStack: any;
  constructor() {
    this.currentStack = new Stack();
    this.undoStack = new Stack();
  }
  doAction(data: any) {
    this.currentStack.push(data); //Stack栈压数据
    // this.undoStack.push(this.currentStack.pop()); //(前提：stack做出pop操作)stack栈数据抛出的，压到另一个栈里
  }
  next() {
    if (!this.undoStack.isEmpty()) {
      this.currentStack.push(this.undoStack.pop());
    } else {
      console.log("无数据");
    }
  }

  pre() {
    if (!this.currentStack.isEmpty()) {
      this.undoStack.push(this.currentStack.pop());
    } else {
      console.log("无数据");
    }
  }
  isEmpty() {
    return this.currentStack.isEmpty();
  }
  getCurrentData() {
    return this.currentStack.peek();
  }
}
