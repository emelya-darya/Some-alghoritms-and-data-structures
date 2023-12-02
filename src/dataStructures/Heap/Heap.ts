// public methods that must be implemented in the class
export interface HeapInterface<ElementType, ValueToSearchType> {
   getHeapContainer(): Array<ElementType>
   isEmpty(): boolean
   getRoot(): ElementType | null
   extractingRoot(): ElementType | null
   add(item: ElementType): void
   remove(item: ValueToSearchType): void
}

export class Heap<ElementType, ValueToSearchType> implements HeapInterface<ElementType, ValueToSearchType> {
   constructor(protected readonly _heapContainer: Array<ElementType> = []) {}

   protected _getLeftChildIndex = (parentIndex: number) => 2 * parentIndex + 1

   protected _getRightChildIndex = (parentIndex: number) => 2 * parentIndex + 2

   protected _getParentIndex = (childIndex: number) => Math.floor((childIndex - 1) / 2)

   protected _hasParent = (childIndex: number) => this._getParentIndex(childIndex) >= 0

   protected _hasLeftChild = (parentIndex: number) => this._getLeftChildIndex(parentIndex) < this._heapContainer.length

   protected _hasRightChild = (parentIndex: number) => this._getRightChildIndex(parentIndex) < this._heapContainer.length

   protected _leftChild = (parentIndex: number) => this._heapContainer[this._getLeftChildIndex(parentIndex)]

   protected _rightChild = (parentIndex: number) => this._heapContainer[this._getRightChildIndex(parentIndex)]

   protected _parent = (childIndex: number) => this._heapContainer[this._getParentIndex(childIndex)]

   protected _removeLastAndReturn() {
      //   const lng = this._heapContainer.length
      //   if (lng) {
      const lastItem = this._heapContainer[this._heapContainer.length - 1]
      this._heapContainer.pop()
      return lastItem
      //   }
      //   return null
   }

   // Swap 2 elements
   protected _swap(indexOne: number, indexTwo: number) {
      const secEl = this._heapContainer[indexTwo]
      this._heapContainer[indexTwo] = this._heapContainer[indexOne]
      this._heapContainer[indexOne] = secEl
   }

   // Search element - O(N)
   protected _findFirst(item: ValueToSearchType) {
      for (let itemIndex = 0; itemIndex < this._heapContainer.length; itemIndex++) {
         if (this._isEqual(item, this._heapContainer[itemIndex])) return itemIndex
      }

      return null
   }

   // Pushing up - O(logN)
   protected _resortFromEndToStart(customStartIndex: number) {
      let currentIndex = customStartIndex

      while (this._hasParent(currentIndex) && !this._pairIsInCorrectOrder(this._parent(currentIndex), this._heapContainer[currentIndex])) {
         this._swap(currentIndex, this._getParentIndex(currentIndex))
         currentIndex = this._getParentIndex(currentIndex)
      }
   }

   // Pushing down - O(logN)
   protected _resortFromStartToEnd(customStartIndex = 0) {
      let currentIndex = customStartIndex
      let nextIndex: number | null = null

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

   protected _pairIsInCorrectOrder(firstElement: ElementType, secondElement: ElementType): boolean {
      throw new Error(`
       You should implement heap pair comparision method:
       
       For MinHeap the first element must be always smaller or equal,
       for MaxHeap the first element must be always bigger or equal.
 
       Example:
       _pairIsInCorrectOrder(firstElement: any, secondElement: any): boolean { 
          return firstElement <= secondElement
       }
     `)
   }

   protected _isEqual(valueToSearch: ValueToSearchType, heapContainerElement: ElementType): boolean {
      throw new Error(`
       You should implement equal check method:
 
       Example, if type of elements of heapContainer is HeapItemType:
 
       type HeapItemType = { priority: number, value: string }
 
       _isEqual(valueToSearchType: string, heapContainerElement: HeapItemType): boolean { 
          return valueToSearchType === heapContainerElement.value
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
      if (this._heapContainer.length === 1) return this._heapContainer[0]

      const rootItem = this._heapContainer[0]
      this._heapContainer[0] = this._removeLastAndReturn()
      this._resortFromStartToEnd()

      return rootItem
   }

   // Add item - O(logN)
   add(item: ElementType) {
      this._heapContainer.push(item)
      this._resortFromEndToStart(this._heapContainer.length - 1)
   }

   // Remove items - for each equal item in heapContainer - O(N)
   remove(item: ValueToSearchType) {
      let itemIdxToRemove = this._findFirst(item)

      while (itemIdxToRemove !== null) {
         if (itemIdxToRemove === this._heapContainer.length - 1) {
            this._removeLastAndReturn()
            break
         } else {
            // Move last element in heap to the vacant (removed) position.
            this._heapContainer[itemIdxToRemove] = this._removeLastAndReturn()

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

class MaxHeapExample extends Heap<number, number> {
   protected _pairIsInCorrectOrder(firstElement: number, secondElement: number) {
      return firstElement >= secondElement
   }

   protected _isEqual(valueToSearch: number, heapContainerElement: number) {
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

type MinHeapExampleElementType = { priority: number; value: string }

class MinHeapExample extends Heap<MinHeapExampleElementType, string> {
   protected _pairIsInCorrectOrder(firstElement: MinHeapExampleElementType, secondElement: MinHeapExampleElementType): boolean {
      return firstElement.priority <= secondElement.priority
   }

   protected _isEqual(valueToSearch: string, heapContainerElement: MinHeapExampleElementType) {
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
