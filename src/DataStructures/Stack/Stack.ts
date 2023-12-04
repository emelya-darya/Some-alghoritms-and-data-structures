import { DoubleLinkedList } from './../DoubleLinkedList/DoubleLinkedList'

interface StackInterface<NodeValueType> {
   put(newNodeValue: NodeValueType): NodeValueType
   extract(): NodeValueType | null
   isEmpty(): boolean
   watchFirst(): NodeValueType | null
   watchLast(): NodeValueType | null
}

export class Stack<NodeValueType, SearchNodeFieldType>
   extends DoubleLinkedList<NodeValueType, SearchNodeFieldType>
   implements StackInterface<NodeValueType>
{
   put = (newNodeValue: NodeValueType) => this.push(newNodeValue)
   extract = () => this.pop()
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

type StackElementType = { title: string; description: string }

const stackExample = new Stack<StackElementType, any>()

/*
   stackExample.put({ title: '1', description: '1' })
   stackExample.put({ title: '2', description: '2' })
   stackExample.put({ title: '3', description: '3' })
   stackExample.put({ title: '4', description: '4' })
   stackExample.put({ title: '5', description: '5' })

   stackExample.extract()
   stackExample.extract()

   stackExample.print()

   *Result 
   ----------------------------------------------------------
   List elements: 
   {"title":"1","description":"1"}
   {"title":"2","description":"2"}
   {"title":"3","description":"3"}
   ----------------------------------------------------------

   !=============================================================================================

   console.log(stackExample.watchFirst())
   *Result  { title: '1', description: '1' }

   !=============================================================================================
   
   console.log(stackExample.watchLast())
   *Result  { title: '3', description: '3' }

   !=============================================================================================

   console.log(stackExample.isEmpty())
   *Result  false

   !=============================================================================================

   console.log(stackExample.getSize())
   *Result  3
*/
