class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    addToHead(node) {
        if (this.head === null) {
            this.head = this.tail = node;
        } else {
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        }
    }

    removeNode(node) {
        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }

        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }

        node.prev = node.next = null;
    }

    moveToHead(node) {
        this.removeNode(node);
        this.addToHead(node);
    }

    removeTail() {
        const tailNode = this.tail;
        this.removeNode(tailNode);
        return tailNode;
    }
}

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();
        this.list = new DoublyLinkedList();
    }

    get(key) {
        if (this.map.has(key)) {
            const node = this.map.get(key);
            this.list.moveToHead(node);
            return node.value; // cache hit
        }
        return -1; // cache miss
    }

    put(key, value) {
        if (this.map.has(key)) {
            const node = this.map.get(key);
            node.value = value;
            this.list.moveToHead(node);
        } else {
            const newNode = new Node(key, value);
            this.map.set(key, newNode);
            this.list.addToHead(newNode);

            if (this.map.size > this.capacity) {
                const tailNode = this.list.removeTail();
                this.map.delete(tailNode.key);
            }
        }
    }
}

module.exports = LRUCache;
