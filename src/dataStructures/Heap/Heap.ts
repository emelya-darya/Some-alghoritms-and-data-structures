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
   constructor(protected readonly heapContainer: Array<ElementType> = []) {}

   protected getLeftChildIndex = (parentIndex: number) => 2 * parentIndex + 1

   protected getRightChildIndex = (parentIndex: number) => 2 * parentIndex + 2

   protected getParentIndex = (childIndex: number) => Math.floor((childIndex - 1) / 2)

   protected hasParent = (childIndex: number) => this.getParentIndex(childIndex) >= 0

   protected hasLeftChild = (parentIndex: number) => this.getLeftChildIndex(parentIndex) < this.heapContainer.length

   protected hasRightChild = (parentIndex: number) => this.getRightChildIndex(parentIndex) < this.heapContainer.length

   protected leftChild = (parentIndex: number) => this.heapContainer[this.getLeftChildIndex(parentIndex)]

   protected rightChild = (parentIndex: number) => this.heapContainer[this.getRightChildIndex(parentIndex)]

   protected parent = (childIndex: number) => this.heapContainer[this.getParentIndex(childIndex)]

   protected removeLastAndReturn() {
      //   const lng = this.heapContainer.length
      //   if (lng) {
      const lastItem = this.heapContainer[this.heapContainer.length - 1]
      this.heapContainer.pop()
      return lastItem
      //   }
      //   return null
   }

   // Swap 2 elements
   protected swap(indexOne: number, indexTwo: number) {
      const secEl = this.heapContainer[indexTwo]
      this.heapContainer[indexTwo] = this.heapContainer[indexOne]
      this.heapContainer[indexOne] = secEl
   }

   // Search element - O(N)
   protected findFirst(item: ValueToSearchType) {
      for (let itemIndex = 0; itemIndex < this.heapContainer.length; itemIndex++) {
         if (this.isEqual(item, this.heapContainer[itemIndex])) return itemIndex
      }

      return null
   }

   // Pushing up - O(logN)
   protected resortFromEndToStart(customStartIndex: number) {
      let currentIndex = customStartIndex

      while (this.hasParent(currentIndex) && !this.pairIsInCorrectOrder(this.parent(currentIndex), this.heapContainer[currentIndex])) {
         this.swap(currentIndex, this.getParentIndex(currentIndex))
         currentIndex = this.getParentIndex(currentIndex)
      }
   }

   // Pushing down - O(logN)
   protected resortFromStartToEnd(customStartIndex = 0) {
      let currentIndex = customStartIndex
      let nextIndex: number | null = null

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

   protected pairIsInCorrectOrder(firstElement: ElementType, secondElement: ElementType): boolean {
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

   protected isEqual(valueToSearch: ValueToSearchType, heapContainerElement: ElementType): boolean {
      throw new Error(`
       You should implement equal check method:
 
       Example, if type of elements of heapContainer is HeapItemType:
 
       type HeapItemType = { priority: number, value: string }
 
       isEqual(valueToSearchType: string, heapContainerElement: HeapItemType): boolean { 
          return valueToSearchType === heapContainerElement.value
       }
     `)
   }

   getHeapContainer = () => this.heapContainer

   isEmpty = () => !this.heapContainer.length

   // Get root element - 0(1)
   getRoot = () => (this.heapContainer.length > 0 ? this.heapContainer[0] : null)

   // Extracting root element - O(logN)
   extractingRoot() {
      if (this.heapContainer.length === 0) return null
      if (this.heapContainer.length === 1) return this.heapContainer[0]

      const rootItem = this.heapContainer[0]
      this.heapContainer[0] = this.removeLastAndReturn()
      this.resortFromStartToEnd()

      return rootItem
   }

   // Add item - O(logN)
   add(item: ElementType) {
      this.heapContainer.push(item)
      this.resortFromEndToStart(this.heapContainer.length - 1)
   }

   // Remove items - for each equal item in heapContainer - O(N)
   remove(item: ValueToSearchType) {
      let itemIdxToRemove = this.findFirst(item)

      while (itemIdxToRemove !== null) {
         if (itemIdxToRemove === this.heapContainer.length - 1) {
            this.removeLastAndReturn()
            break
         } else {
            // Move last element in heap to the vacant (removed) position.
            this.heapContainer[itemIdxToRemove] = this.removeLastAndReturn()

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
   protected pairIsInCorrectOrder(firstElement: number, secondElement: number) {
      return firstElement >= secondElement
   }

   protected isEqual(valueToSearch: number, heapContainerElement: number) {
      return valueToSearch === heapContainerElement
   }
}

const maxHeap = new MaxHeapExample()

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

type MinHeapExampleElementType = { priority: number; value: string }

class MinHeapExample extends Heap<MinHeapExampleElementType, string> {
   protected pairIsInCorrectOrder(firstElement: MinHeapExampleElementType, secondElement: MinHeapExampleElementType): boolean {
      return firstElement.priority <= secondElement.priority
   }

   protected isEqual(valueToSearch: string, heapContainerElement: MinHeapExampleElementType) {
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
   Result
   [
      { priority: 0, value: 'Element with priority 0' },
      { priority: 3, value: 'Element with priority 3' },
      { priority: 1, value: 'Element with priority 1' },
      { priority: 100, value: 'Element with priority 100' },
      { priority: 7, value: 'Element with priority 7' }
   ]
*/ 


