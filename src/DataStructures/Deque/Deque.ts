import { DoubleLinkedList } from './../DoubleLinkedList/DoubleLinkedList'

interface DequeInterface<NodeValueType> {
   pushBack(newNodeValue: NodeValueType): NodeValueType // операция вставки нового элемента в конец
   popBack(): NodeValueType | null // операция удаления конечного элемента
   pushFront(newNodeValue: NodeValueType): NodeValueType // операция вставки нового элемента в начало
   popFront(): NodeValueType | null // операция удаления начального элемента

   isEmpty(): boolean
   watchFirst(): NodeValueType | null
   watchLast(): NodeValueType | null
}

export class Deque<NodeValueType, SearchNodeFieldType>
   extends DoubleLinkedList<NodeValueType, SearchNodeFieldType>
   implements DequeInterface<NodeValueType>
{
   pushBack = (newNodeValue: NodeValueType) => this.push(newNodeValue)
   popBack = () => this.pop()
   pushFront = (newNodeValue: NodeValueType) => this.unshift(newNodeValue)
   popFront = () => this.shift()

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

type DequeElementType = { title: string; description: string }

const dequeExample = new Deque<DequeElementType, any>()

/*
    dequeExample.pushBack({ title: '1', description: '1' })
    dequeExample.pushBack({ title: '2', description: '2' })
    dequeExample.pushBack({ title: '3', description: '3' })

    dequeExample.pushFront({ title: '4', description: '4' })
    dequeExample.pushFront({ title: '5', description: '5' })

    dequeExample.print()

   *Result 
   ----------------------------------------------------------
   List elements: 
   {"title":"5","description":"5"}
   {"title":"4","description":"4"}
   {"title":"1","description":"1"}
   {"title":"2","description":"2"}
   {"title":"3","description":"3"}
   ----------------------------------------------------------

   !=============================================================================================

   console.log(dequeExample.popFront())
   *Result  { title: '5', description: '5' }

   !=============================================================================================
   
   console.log(dequeExample.popBack())
   *Result  { title: '3', description: '3' }

   !=============================================================================================

   console.log(dequeExample.watchFirst())
   *Result  { title: '4', description: '4' }

   !=============================================================================================

   console.log(dequeExample.isEmpty())
   *Result  false

   !=============================================================================================

   console.log(dequeExample.getSize())
   *Result  3
*/
