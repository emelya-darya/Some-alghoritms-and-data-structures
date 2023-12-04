import { DoubleLinkedList } from './../DoubleLinkedList/DoubleLinkedList'

interface QueueInterface<NodeValueType> {
   enqueue(newNodeValue: NodeValueType): NodeValueType
   dequeue(): NodeValueType | null
   isEmpty(): boolean
   watchFirst(): NodeValueType | null
   watchLast(): NodeValueType | null
}

export class Queue<NodeValueType, SearchNodeFieldType>
   extends DoubleLinkedList<NodeValueType, SearchNodeFieldType>
   implements QueueInterface<NodeValueType>
{
   enqueue = (newNodeValue: NodeValueType) => this.push(newNodeValue)
   dequeue = () => this.shift()
   isEmpty = () => this.getSize() === 0
   watchFirst = () => this._head?.getValue() || null
   watchLast = () => this._tail?.getValue() || null
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

type QueueElementType = { title: string; description: string }

const queueExample = new Queue<QueueElementType, any>()

/*
    queueExample.enqueue({ title: '1', description: '1' })
    queueExample.enqueue({ title: '2', description: '2' })
    queueExample.enqueue({ title: '3', description: '3' })
    queueExample.enqueue({ title: '4', description: '4' })
    queueExample.enqueue({ title: '5', description: '5' })

    queueExample.dequeue()
    queueExample.dequeue()

    queueExample.print()

   *Result 
   ----------------------------------------------------------
   List elements: 
   {"title":"3","description":"3"}
   {"title":"4","description":"4"}
   {"title":"5","description":"5"}
   ----------------------------------------------------------

   !=============================================================================================

   console.log(queueExample.watchFirst())
   *Result  { title: '3', description: '3' }

   !=============================================================================================
   
   console.log(queueExample.watchLast())
   *Result  { title: '5', description: '5' }

   !=============================================================================================

   console.log(queueExample.isEmpty())
   *Result  false

   !=============================================================================================

   console.log(queueExample.getSize())
   *Result  3
*/
