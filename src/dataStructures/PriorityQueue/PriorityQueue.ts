import { Heap } from '../Heap/Heap'
import { HeapInterface } from '../Heap/Heap'

interface PriorityQueueInterface<ElementType, UniqueItemFieldType> extends HeapInterface<ElementType, UniqueItemFieldType> {
   hasItem(uniqueItemField: UniqueItemFieldType): boolean
   getPrioritiesMap(): Map<UniqueItemFieldType, number>
   getItemPriority(uniqueItemField: UniqueItemFieldType): number | null
}

export class PriorityQueue<ElementType, UniqItemFieldType>
   extends Heap<ElementType, UniqItemFieldType>
   implements PriorityQueueInterface<ElementType, UniqItemFieldType>
{
   constructor(protected readonly priorities: Map<UniqItemFieldType, number> = new Map()) {
      super()
   }

   protected getUniqueItemField(item: ElementType): UniqItemFieldType {
      throw new Error(`
       You should implement getUniqueItemField method:
 
       Example, if type of elements of PriorityQueue is PriorityQueueItemType:
 
       type PriorityQueueItemType = { priority: number, uniqField: string }
 
       getUniqueItemField(item: PriorityQueueItemType) { 
          return item.uniqField
       }`)
   }

   // Changing the priority of an element that is already in the queue  -  O(N)
   protected changePriority(item: ElementType, newPriority: number) {
      const uniqueItemField = this.getUniqueItemField(item)
      this.remove(uniqueItemField)
      this.add(item, newPriority)
   }

   // Add item - O(N)
   add(item: ElementType, priority = 0) {
      const uniqueItemField = this.getUniqueItemField(item)

      this.priorities.set(uniqueItemField, priority)

      if (this.hasItem(uniqueItemField)) this.changePriority(item, priority)
      else super.add(item)
   }

   // Remove items - O(N)
   remove(uniqueItemField: UniqItemFieldType) {
      if (this.hasItem(uniqueItemField)) {
         super.remove(uniqueItemField)
         this.priorities.delete(uniqueItemField)
      }
   }

   extractingRoot() {
      const root = super.extractingRoot()
      if (root !== null) this.priorities.delete(this.getUniqueItemField(root))
      return root
   }

   // O(1)
   hasItem(uniqueItemField: UniqItemFieldType) {
      return this.priorities.has(uniqueItemField)
   }

   // O(1)
   getItemPriority(uniqueItemField: UniqItemFieldType) {
      const priority = this.priorities.get(uniqueItemField)
      return priority !== undefined ? priority : null
   }

   getPrioritiesMap() {
      return this.priorities
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

type ElementTypeExample = { priority: number; value: string }

class PriorityQueueExample extends PriorityQueue<ElementTypeExample, string> {
   protected pairIsInCorrectOrder(firstElement: ElementTypeExample, secondElement: ElementTypeExample): boolean {
      return firstElement.priority <= secondElement.priority
   }

   protected isEqual(valueToSearch: string, heapContainerElement: ElementTypeExample) {
      return valueToSearch === heapContainerElement.value
   }

   protected getUniqueItemField(item: ElementTypeExample) {
      return item.value
   }
}

const priorityQueueExample = new PriorityQueueExample()

/*
   priorityQueueExample.add({ priority: 3, value: 'Element with priority 3' }, 3)
   priorityQueueExample.add({ priority: 1, value: 'Element with priority 1' }, 1)
   priorityQueueExample.add({ priority: 100, value: 'Element with priority 100' }, 100)
   priorityQueueExample.add({ priority: 2, value: 'Element with priority 2' }, 2)
   priorityQueueExample.add({ priority: 2, value: 'Element with priority 2' }, 2) // Duplicate will not be added
   priorityQueueExample.add({ priority: 0, value: 'Element with priority 0' }, 0)

   priorityQueueExample.remove('Element with priority 3')


   console.log(priorityQueueExample.getHeapContainer())
   Result
   [
      { priority: 0, value: 'Element with priority 0' },
      { priority: 1, value: 'Element with priority 1' },
      { priority: 100, value: 'Element with priority 100' },
      { priority: 2, value: 'Element with priority 2' }
   ]


   console.log(priorityQueueExample.getPrioritiesMap())
   Result
   Map(4) {
   'Element with priority 1' => 1,
   'Element with priority 100' => 100,
   'Element with priority 2' => 2,
   'Element with priority 0' => 0
   }


   console.log(priorityQueueExample.extractingRoot())
   Result { priority: 0, value: 'Element with priority 0' }

   
   console.log(priorityQueueExample.extractingRoot())
   Result { priority: 1, value: 'Element with priority 1' }


   console.log(priorityQueueExample.extractingRoot())
   Result { priority: 2, value: 'Element with priority 2' }


   console.log(priorityQueueExample.hasItem('Element with priority 2'))
   Result false


   console.log(priorityQueueExample.hasItem('Element with priority 100'))
   Result true
*/
