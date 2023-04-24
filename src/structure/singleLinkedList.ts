interface ListStructure<T> {
  data: T;
  next: string;
}

class SingleLinkedList {
  linkedList: Record<string, ListStructure<any>>;
  constructor() {}
}
