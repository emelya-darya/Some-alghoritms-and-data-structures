export class Heap {
   constructor() {
      this.heapContainer = []
   }

   getHeapContainer = () => this.heapContainer

   getLeftChildIndex = parentIndex => 2 * parentIndex + 1

   getRightChildIndex = parentIndex => 2 * parentIndex + 2

   getParentIndex = childIndex => Math.floor((childIndex - 1) / 2)

   hasParent = childIndex => this.getParentIndex(childIndex) >= 0

   hasLeftChild = parentIndex => this.getLeftChildIndex(parentIndex) < this.heapContainer.length

   hasRightChild = parentIndex => this.getRightChildIndex(parentIndex) < this.heapContainer.length

   leftChild = parentIndex => this.heapContainer[this.getLeftChildIndex(parentIndex)]

   rightChild = parentIndex => this.heapContainer[this.getRightChildIndex(parentIndex)]

   parent = childIndex => this.heapContainer[this.getParentIndex(childIndex)]

   isEmpty = () => !this.heapContainer.length

   // Get root element - 0(1)
   getRoot = () => (this.heapContainer.length > 0 ? this.heapContainer[0] : null)

   // Extracting root element - O(logN)
   extractingRoot() {
      if (this.heapContainer.length === 0) return null

      if (this.heapContainer.length === 1) return this.heapContainer.pop()

      const item = this.heapContainer[0]

      this.heapContainer[0] = this.heapContainer.pop()
      this.resortFromStartToEnd()

      return item
   }

   // Swap 2 elements
   swap(indexOne, indexTwo) {
      const secEl = this.heapContainer[indexTwo]
      this.heapContainer[indexTwo] = this.heapContainer[indexOne]
      this.heapContainer[indexOne] = secEl
   }

   // Add item - O(logN)
   add(item) {
      this.heapContainer.push(item)
      this.resortFromEndToStart()
   }

   // Remove items - for each equal item in heapContainer - O(N)
   remove(item) {
      let itemIdxToRemove = this.findFirst(item)

      while (itemIdxToRemove !== null) {
         if (itemIdxToRemove === this.heapContainer.length - 1) {
            this.heapContainer.pop()
            break
         } else {
            // Move last element in heap to the vacant (removed) position.
            this.heapContainer[itemIdxToRemove] = this.heapContainer.pop()

            // Get parent of replaced element
            const parentItem = this.parent(itemIdxToRemove)

            // If there is no parent or parent is in correct order with the node
            // we're going to delete then heapify down. Otherwise heapify up.
            if (
               (parentItem === undefined || this.pairIsInCorrectOrder(parentItem, this.heapContainer[itemIdxToRemove])) &&
               this.hasLeftChild(itemIdxToRemove)
            ) {
               this.resortFromStartToEnd(itemIdxToRemove)
            } else {
               this.resortFromEndToStart(itemIdxToRemove)
            }

            itemIdxToRemove = this.findFirst(item)
         }
      }
   }

   // Search element - O(N)
   findFirst(item) {
      for (let itemIndex = 0; itemIndex < this.heapContainer.length; itemIndex++) {
         if (this.isEqual(item, this.heapContainer[itemIndex])) return itemIndex
      }

      return null
   }

   // Pushing up - O(logN)
   resortFromEndToStart(customStartIndex) {
      let currentIndex = customStartIndex || this.heapContainer.length - 1

      while (this.hasParent(currentIndex) && !this.pairIsInCorrectOrder(this.parent(currentIndex), this.heapContainer[currentIndex])) {
         this.swap(currentIndex, this.getParentIndex(currentIndex))
         currentIndex = this.getParentIndex(currentIndex)
      }
   }

   // Pushing down - O(logN)
   resortFromStartToEnd(customStartIndex) {
      let currentIndex = customStartIndex || 0
      let nextIndex = null

      // left child имеет меньший индекс, чем rightchild, поэтому выбран он
      while (this.hasLeftChild(currentIndex)) {
         if (this.hasRightChild(currentIndex) && this.pairIsInCorrectOrder(this.rightChild(currentIndex), this.leftChild(currentIndex))) {
            nextIndex = this.getRightChildIndex(currentIndex)
         } else {
            nextIndex = this.getLeftChildIndex(currentIndex)
         }

         if (this.pairIsInCorrectOrder(this.heapContainer[currentIndex], this.heapContainer[nextIndex])) break

         this.swap(currentIndex, nextIndex)
         currentIndex = nextIndex
      }
   }

   pairIsInCorrectOrder(firstElement, secondElement) {
      throw new Error(`
      You should implement heap pair comparision method:
      
      For MinHeap the first element must be always smaller or equal,
      for MaxHeap the first element must be always bigger or equal.

      Example:
      pairIsInCorrectOrder(firstElement: any, secondElement: any): boolean { 
         return firstElement <= secondElement
      }
    `)
   }

   isEqual(valueToSearch, heapContainerElement) {
      throw new Error(`
      You should implement equal check method:

      Example, if type of elements of heapContainer is HeapItemType:

      type HeapItemType = { priority: number, value: string }

      isEqual(valueToSearch: string, heapContainerElement: HeapItemType): boolean { 
         return valueToSearch === heapContainerElement.value
      }
    `)
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

class MaxHeap extends Heap {
   pairIsInCorrectOrder(firstElement, secondElement) {
      return firstElement >= secondElement
   }

   isEqual(valueToSearch, heapContainerElement) {
      return valueToSearch === heapContainerElement
   }
}

const maxHeap = new MaxHeap()

/*
   maxHeap.add(4)
   maxHeap.add(455)
   maxHeap.add(1)
   maxHeap.add(3)
   maxHeap.add(4)

   maxHeap.remove(3)


   console.log(maxHeap.getHeapContainer())
   Result [ 455, 4, 1, 4 ]
*/

// ! ************************************************** MIN HEAP ************************************************************

class MinHeap extends Heap {
   pairIsInCorrectOrder(firstElement, secondElement) {
      return firstElement.priority <= secondElement.priority
   }

   isEqual(valueToSearch, heapContainerElement) {
      return valueToSearch === heapContainerElement.value
   }
}

const minHeap = new MinHeap()

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
   Result
   [
      { priority: 0, value: 'Element with priority 0' },
      { priority: 3, value: 'Element with priority 3' },
      { priority: 1, value: 'Element with priority 1' },
      { priority: 100, value: 'Element with priority 100' },
      { priority: 7, value: 'Element with priority 7' }
   ]
*/ 
