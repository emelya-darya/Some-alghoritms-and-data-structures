import { DoubleLinkedList } from './../DoubleLinkedList/DoubleLinkedList.js'

export class Deque extends DoubleLinkedList {
   pushBack = newNodeValue => this.push(newNodeValue)
   popBack = () => this.pop()
   pushFront = newNodeValue => this.unshift(newNodeValue)
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

const dequeExample = new Deque()

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
