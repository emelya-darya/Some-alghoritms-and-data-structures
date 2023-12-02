interface ListNodeInterface<NodeValueType> {
   getValue(): NodeValueType
   getNext(): ListNodeInterface<NodeValueType> | null
   addNext(newNode: ListNodeInterface<NodeValueType>): ListNodeInterface<NodeValueType>
   deleteNext(): null

   getPrev(): ListNodeInterface<NodeValueType> | null
   addPrev(newNode: ListNodeInterface<NodeValueType>): ListNodeInterface<NodeValueType>
   deletePrev(): null
}

interface DoubleLinkedListInterface<NodeValueType, SearchNodeFieldType> {
   push(newNode: NodeValueType): NodeValueType
   pop(): NodeValueType | null

   unshift(newNode: NodeValueType): NodeValueType
   shift(): NodeValueType | null

   getSize(): number

   deleteOneFirst(
      searchNodeField: SearchNodeFieldType,
      startSearchFrom?: ListNodeInterface<NodeValueType> | null,
   ): DoubleLinkedListInterface<NodeValueType, SearchNodeFieldType>

   deleteOneLast(
      searchNodeField: SearchNodeFieldType,
      startSearchFrom?: ListNodeInterface<NodeValueType> | null,
   ): DoubleLinkedListInterface<NodeValueType, SearchNodeFieldType>

   deleteMany(searchNodeField: SearchNodeFieldType): DoubleLinkedListInterface<NodeValueType, SearchNodeFieldType>
   reverse(): DoubleLinkedListInterface<NodeValueType, SearchNodeFieldType>
   printList(): string
}

class ListNode<NodeValueType> implements ListNodeInterface<NodeValueType> {
   protected readonly _value: NodeValueType
   protected _prev = null as ListNode<NodeValueType> | null
   protected _next = null as ListNode<NodeValueType> | null

   constructor(value: NodeValueType) {
      this._value = value
   }

   getValue = () => this._value

   getNext = () => this._next
   addNext = (newNode: ListNode<NodeValueType>) => (this._next = newNode)
   deleteNext = () => (this._next = null)

   getPrev = () => this._prev
   addPrev = (newNode: ListNode<NodeValueType>) => (this._prev = newNode)
   deletePrev = () => (this._prev = null)
}

export class DoubleLinkedList<NodeValueType, SearchNodeFieldType> implements DoubleLinkedListInterface<NodeValueType, SearchNodeFieldType> {
   protected _size = 0
   protected _head = null as ListNode<NodeValueType> | null
   protected _tail = null as ListNode<NodeValueType> | null

   protected _isEqual(searchNodeField: SearchNodeFieldType, nodeValue: NodeValueType): boolean {
      throw new Error(`
       You should implement equal check method:
 
       Example, if type of list element is DoubleLinkedListItemType:
 
       type DoubleLinkedListItemType = { title: string; description: string }
 
       isEqual(searchNodeField: string, nodeValue: DoubleLinkedListItemType): boolean { 
          return searchNodeField === nodeValue.title
       }
     `)
   }

   getSize = () => this._size

   // O(1)
   push(newNodeValue: NodeValueType) {
      const newNode = new ListNode<NodeValueType>(newNodeValue)

      this._size++

      // if list is empty
      if (!this._tail) this._head = this._tail = newNode
      // if not empty
      else {
         newNode.addPrev(this._tail)
         this._tail.addNext(newNode)
         this._tail = newNode
      }

      return newNodeValue
   }

   // O(1)
   pop() {
      if (!this._tail) return this._tail

      const tailTmp = this._tail

      if (this.getSize() === 1) {
         this._head = this._tail = null
         this._size--
         return tailTmp.getValue()
      }

      // если список не пуст и его длина больше 1
      const prevTail = this._tail.getPrev()
      if (prevTail) {
         prevTail.deleteNext()
         this._tail = prevTail
         this._size--
      }

      return tailTmp.getValue()
   }

   // O(1)
   unshift(newNodeValue: NodeValueType) {
      const newNode = new ListNode<NodeValueType>(newNodeValue)

      this._size++

      // если список пуст
      if (!this._head) this._head = this._tail = newNode
      // если не пуст
      else {
         newNode.addNext(this._head)
         this._head.addPrev(newNode)
         this._head = newNode
      }

      return newNodeValue
   }

   // O(1)
   shift() {
      if (!this._head) return this._head

      const headTmp = this._head

      if (this.getSize() === 1) {
         this._head = this._tail = null
         this._size--
         return headTmp.getValue()
      }

      // если список не пуст и его длина больше 1
      const secondNode = this._head.getNext()
      if (secondNode) {
         secondNode.deletePrev()
         this._head = secondNode
         this._size--
      }

      return headTmp.getValue()
   }

   protected _deleteNode(node: ListNode<NodeValueType>) {
      const currNodePrev = node.getPrev()
      const currNodeNext = node.getNext()

      if (!currNodePrev) {
         this.shift()
         return this._head
      } else if (!currNodeNext) {
         this.pop()
         return this._tail
      } else {
         currNodePrev.addNext(currNodeNext)
         currNodeNext.addPrev(currNodePrev)

         this._size--

         return currNodeNext
      }
   }

   // O(N)
   deleteOneFirst(searchNodeField: SearchNodeFieldType, startSearchFrom = this._head) {
      let currNode = startSearchFrom

      while (currNode) {
         if (this._isEqual(searchNodeField, currNode.getValue())) {
            this._deleteNode(currNode)
            return this
         } else currNode = currNode.getNext()
      }

      return this
   }

   // O(N)
   deleteOneLast(searchNodeField: SearchNodeFieldType, startSearchFrom = this._tail) {
      let currNode = startSearchFrom

      while (currNode) {
         if (this._isEqual(searchNodeField, currNode.getValue())) {
            this._deleteNode(currNode)
            return this
         } else currNode = currNode.getPrev()
      }

      return this
   }

   // O(N)
   deleteMany(searchNodeField: SearchNodeFieldType) {
      let currNode = this._head

      while (currNode) {
         if (this._isEqual(searchNodeField, currNode.getValue())) {
            currNode = this._deleteNode(currNode)
         } else currNode = currNode.getNext()
      }

      return this
   }

   // O(N)
   reverse() {
      if (this._size < 2) return this

      const headTmp = this._head
      const tailTmp = this._tail

      let currNode = this._tail

      while (currNode) {
         const currNodePrev = currNode.getPrev()
         const currNodeNext = currNode.getNext()

         if (currNodePrev) currNode.addNext(currNodePrev)
         else currNode.deleteNext()

         if (currNodeNext) currNode.addPrev(currNodeNext)
         else currNode.deletePrev()

         currNode = currNode.getNext()
      }

      this._head = tailTmp
      this._tail = headTmp

      return this
   }

   printList() {
      let output = `----------------------------------------------------------\nList elements: \n`

      let currNode = this._head
      while (currNode) {
         output += JSON.stringify(currNode.getValue()) + '\n'
         currNode = currNode.getNext()
      }

      output += '----------------------------------------------------------'

      console.log(output)
      return output
   }
}

/*
 ? **************************************************************************************************************************
 ? **************************************************************************************************************************
 ? **************************************************************************************************************************
 ? ************************************************* Usage examples *********************************************************
 ? **************************************************************************************************************************
 ? **************************************************************************************************************************
 ? **************************************************************************************************************************
 ? **************************************************************************************************************************
 */

type DDLElementType = { title: string; description: string }

class DDLExample extends DoubleLinkedList<DDLElementType, string> {
   protected _isEqual(searchNodeField: string, nodeValue: DDLElementType): boolean {
      return searchNodeField === nodeValue.title
   }
}

const ddlExample = new DDLExample()

/*
   ddlExample.push({ title: 'title1', description: 'description1' })
   ddlExample.push({ title: 'title2', description: 'description2' })
   ddlExample.push({ title: 'title3', description: 'description3' })
   ddlExample.push({ title: 'title4', description: 'description4' })
   ddlExample.push({ title: 'title4', description: 'description4' })
   ddlExample.push({ title: 'title5', description: 'description5' })
   ddlExample.unshift({ title: 'title0', description: 'description0' })
   ddlExample.unshift({ title: 'title-1', description: 'description-1' })

   ddlExample.printList()

   *Result 
   ----------------------------------------------------------
   List elements: 
   {"title":"title-1","description":"description-1"}
   {"title":"title0","description":"description0"}
   {"title":"title1","description":"description1"}
   {"title":"title2","description":"description2"}
   {"title":"title3","description":"description3"}
   {"title":"title4","description":"description4"}
   {"title":"title4","description":"description4"}
   {"title":"title5","description":"description5"}
   ----------------------------------------------------------

   !=============================================================================================

   ddlExample.deleteMany('title4').deleteOneFirst('title3').deleteOneFirst('title5')
   ddlExample.printList()

   *Result 
   ----------------------------------------------------------
   List elements: 
   {"title":"title-1","description":"description-1"}
   {"title":"title0","description":"description0"}
   {"title":"title1","description":"description1"}
   {"title":"title2","description":"description2"}
   ----------------------------------------------------------

   !=============================================================================================
   
   ddlExample.reverse()
   ddlExample.printList()

   *Result 
   ----------------------------------------------------------
   List elements: 
   {"title":"title2","description":"description2"}
   {"title":"title1","description":"description1"}
   {"title":"title0","description":"description0"}
   {"title":"title-1","description":"description-1"}
   ----------------------------------------------------------

   !=============================================================================================

   console.log(ddlExample.shift())
   *Result  { title: 'title2', description: 'description2' }

   !=============================================================================================

   console.log(ddlExample.pop())
   *Result  { title: 'title-1', description: 'description-1' }

   !=============================================================================================

   console.log(ddlExample.getSize())
   *Result  2
*/
