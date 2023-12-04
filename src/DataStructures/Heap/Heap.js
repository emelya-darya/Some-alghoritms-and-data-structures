export class Heap {
   constructor() {
      this._heapContainer = []
   }

   _getLeftChildIndex = parentIndex => 2 * parentIndex + 1

   _getRightChildIndex = parentIndex => 2 * parentIndex + 2

   _getParentIndex = childIndex => Math.floor((childIndex - 1) / 2)

   _hasParent = childIndex => this._getParentIndex(childIndex) >= 0

   _hasLeftChild = parentIndex => this._getLeftChildIndex(parentIndex) < this._heapContainer.length

   _hasRightChild = parentIndex => this._getRightChildIndex(parentIndex) < this._heapContainer.length

   _leftChild = parentIndex => this._heapContainer[this._getLeftChildIndex(parentIndex)]

   _rightChild = parentIndex => this._heapContainer[this._getRightChildIndex(parentIndex)]

   _parent = childIndex => this._heapContainer[this._getParentIndex(childIndex)]

   // Swap 2 elements
   _swap(indexOne, indexTwo) {
      const secEl = this._heapContainer[indexTwo]
      this._heapContainer[indexTwo] = this._heapContainer[indexOne]
      this._heapContainer[indexOne] = secEl
   }

   // Search element - O(N)
   _findFirst(item) {
      for (let itemIndex = 0; itemIndex < this._heapContainer.length; itemIndex++) {
         if (this._isEqual(item, this._heapContainer[itemIndex])) return itemIndex
      }

      return null
   }

   // Pushing up - O(logN)
   _resortFromEndToStart(customStartIndex) {
      let currentIndex = customStartIndex || this._heapContainer.length - 1

      while (this._hasParent(currentIndex) && !this._pairIsInCorrectOrder(this._parent(currentIndex), this._heapContainer[currentIndex])) {
         this._swap(currentIndex, this._getParentIndex(currentIndex))
         currentIndex = this._getParentIndex(currentIndex)
      }
   }

   // Pushing down - O(logN)
   _resortFromStartToEnd(customStartIndex) {
      let currentIndex = customStartIndex || 0
      let nextIndex = null

      // left child имеет меньший индекс, чем rightchild, поэтому выбран он
      while (this._hasLeftChild(currentIndex)) {
         if (
            this._hasRightChild(currentIndex) &&
            this._pairIsInCorrectOrder(this._rightChild(currentIndex), this._leftChild(currentIndex))
         ) {
            nextIndex = this._getRightChildIndex(currentIndex)
         } else {
            nextIndex = this._getLeftChildIndex(currentIndex)
         }

         if (this._pairIsInCorrectOrder(this._heapContainer[currentIndex], this._heapContainer[nextIndex])) break

         this._swap(currentIndex, nextIndex)
         currentIndex = nextIndex
      }
   }

   _pairIsInCorrectOrder(firstElement, secondElement) {
      throw new Error(`
      You should implement heap pair comparision method:
      
      For MinHeap the first element must be always smaller or equal,
      for MaxHeapExample the first element must be always bigger or equal.

      Example:
      _pairIsInCorrectOrder(firstElement: any, secondElement: any): boolean { 
         return firstElement <= secondElement
      }
    `)
   }

   _isEqual(valueToSearch, heapContainerElement) {
      throw new Error(`
      You should implement equal check method:

      Example, if type of elements of heapContainer is HeapItemType:

      type HeapItemType = { priority: number, value: string }

      _isEqual(valueToSearch: string, heapContainerElement: HeapItemType): boolean { 
         return valueToSearch === heapContainerElement.value
      }
    `)
   }

   getHeapContainer = () => this._heapContainer

   isEmpty = () => !this._heapContainer.length

   // Get root element - 0(1)
   getRoot = () => (this._heapContainer.length > 0 ? this._heapContainer[0] : null)

   // Extracting root element - O(logN)
   extractingRoot() {
      if (this._heapContainer.length === 0) return null

      if (this._heapContainer.length === 1) return this._heapContainer.pop()

      const item = this._heapContainer[0]

      this._heapContainer[0] = this._heapContainer.pop()
      this._resortFromStartToEnd()

      return item
   }

   // Add item - O(logN)
   add(item) {
      this._heapContainer.push(item)
      this._resortFromEndToStart()
   }

   // Remove items - for each equal item in heapContainer - O(N)
   remove(item) {
      let itemIdxToRemove = this._findFirst(item)

      while (itemIdxToRemove !== null) {
         if (itemIdxToRemove === this._heapContainer.length - 1) {
            this._heapContainer.pop()
            break
         } else {
            // Move last element in heap to the vacant (removed) position.
            this._heapContainer[itemIdxToRemove] = this._heapContainer.pop()

            // Get parent of replaced element
            const parentItem = this._parent(itemIdxToRemove)

            // If there is no parent or parent is in correct order with the node
            // we're going to delete then heapify down. Otherwise heapify up.
            if (
               (parentItem === undefined || this._pairIsInCorrectOrder(parentItem, this._heapContainer[itemIdxToRemove])) &&
               this._hasLeftChild(itemIdxToRemove)
            ) {
               this._resortFromStartToEnd(itemIdxToRemove)
            } else {
               this._resortFromEndToStart(itemIdxToRemove)
            }

            itemIdxToRemove = this._findFirst(item)
         }
      }
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

// ! ************************************************** MAX HEAP ************************************************************

class MaxHeapExample extends Heap {
   _pairIsInCorrectOrder(firstElement, secondElement) {
      return firstElement >= secondElement
   }

   _isEqual(valueToSearch, heapContainerElement) {
      return valueToSearch === heapContainerElement
   }
}

const maxHeapExample = new MaxHeapExample()

/*
   maxHeapExample.add(4)
   maxHeapExample.add(455)
   maxHeapExample.add(1)
   maxHeapExample.add(3)
   maxHeapExample.add(4)

   maxHeapExample.remove(3)

   console.log(maxHeapExample.getHeapContainer())
   *Result [ 455, 4, 1, 4 ]
*/

// ! ************************************************** MIN HEAP ************************************************************

class MinHeapExample extends Heap {
   _pairIsInCorrectOrder(firstElement, secondElement) {
      return firstElement.priority <= secondElement.priority
   }

   _isEqual(valueToSearch, heapContainerElement) {
      return valueToSearch === heapContainerElement.value
   }
}

const minHeapExample = new MinHeapExample()

/*
   minHeapExample.add({ priority: 7, value: 'Element with priority 7' })
   minHeapExample.add({ priority: 3, value: 'Element with priority 3' })
   minHeapExample.add({ priority: 1, value: 'Element with priority 1' })
   minHeapExample.add({ priority: 100, value: 'Element with priority 100' })
   minHeapExample.add({ priority: 2, value: 'Element with priority 2' })
   minHeapExample.add({ priority: 2, value: 'Element with priority 2' })
   minHeapExample.add({ priority: 0, value: 'Element with priority 0' })

   minHeapExample.remove('Element with priority 2')

   console.log(minHeapExample.getHeapContainer())
   *Result
   [
      { priority: 0, value: 'Element with priority 0' },
      { priority: 3, value: 'Element with priority 3' },
      { priority: 1, value: 'Element with priority 1' },
      { priority: 100, value: 'Element with priority 100' },
      { priority: 7, value: 'Element with priority 7' }
   ]
   
   !=============================================================================================

   console.log(minHeapExample.extractingRoot())
   *Result  { priority: 0, value: 'Element with priority 0' }
*/

