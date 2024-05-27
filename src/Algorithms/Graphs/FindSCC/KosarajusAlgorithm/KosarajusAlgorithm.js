import { Graph } from '../../../../DataStructures/Graph/Graph.js'
import { Stack } from '../../../../DataStructures/Stack/Stack.js'
import { getTopologicalSort } from '../../TopologicalSort/TopologicalSort.js'

export const kosarajusAlg = function (graph) {
   const invertedForm = {}

   for (const v in graph) {
      for (let i = 0; i < graph[v].length; i++) {
         const nb = String(graph[v][i])
         if (invertedForm[nb]) invertedForm[nb].push(v)
         else invertedForm[nb] = [v]
      }
   }

   const reversedTopSort = (getTopologicalSort(invertedForm, true) || []).reverse()

   const graphColoring = {}
   let color = 1

   while (reversedTopSort.length) {
      const start = reversedTopSort.pop() || ''

      if (graphColoring[start]) continue

      const vStack = new Stack()
      const inTheCurrPath = {}

      vStack.put(start)
      inTheCurrPath[start] = true

      while (!vStack.isEmpty()) {
         const currVrtx = vStack.watchLast() || ''
         const currVertNBs = graph[currVrtx] || []

         let hasUnprocessableNBs = false

         for (let i = 0; i < currVertNBs.length; i++) {
            const nb = currVertNBs[i]

            if (!graphColoring[nb] && !inTheCurrPath[nb]) {
               inTheCurrPath[nb] = true
               vStack.put(String(nb))
               hasUnprocessableNBs = true
               break
            }
         }

         if (!hasUnprocessableNBs) {
            vStack.extract()
            delete inTheCurrPath[currVrtx]
            graphColoring[currVrtx] = color
         }
      }

      color++
   }

   const output = {}
   for (const v in graphColoring) {
      const idx = graphColoring[v] || 0
      if (!output[idx]) output[idx] = [v]
      else output[idx].push(v)
   }

   return output
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

const cyclicTestGraph = new Graph({
   A: ['H'],
   B: ['J'],
   C: ['J', 'K'],
   D: ['I'],
   E: ['C'],
   F: ['D', 'K'],
   G: ['A', 'B', 'E'],
   H: ['B', 'G'],
   I: ['F'],
   J: ['E'],
   K: ['I'],
   L: ['C', 'F', 'J'],
})

const cyclicTestGraph2 = new Graph({
   a: ['b'],
   b: ['c', 'e', 'f'],
   c: ['d', 'g'],
   d: ['c', 'h'],
   e: ['a', 'f'],
   f: ['g'],
   g: ['f'],
   h: ['d', 'g'],
})

const cyclicTestGraph3 = new Graph({
   A: ['B', 'E'],
   B: ['C'],
   C: ['D'],
   D: [],
   E: ['C'],
   F: ['G'],
   G: ['H'],
   H: ['D', 'F'],
})

const acyclicTestGraph = new Graph({
   A: ['B', 'E'],
   B: ['C'],
   C: ['D'],
   D: [],
   E: ['C'],
   F: [],
   G: ['H'],
   H: ['D', 'F'],
})

/*
   console.log(kosarajusAlg(cyclicTestGraph.getUnweightedGraphForm()))
   *Result  
   {
      '1': [ 'K', 'F', 'I', 'D' ],
      '2': [ 'J', 'C', 'E' ],
      '3': [ 'L' ],
      '4': [ 'B' ],
      '5': [ 'H', 'A', 'G' ]
   }

   !=============================================================================================

   console.log(kosarajusAlg(cyclicTestGraph2.getUnweightedGraphForm()))
   *Result 
   { 
      '1': [ 'f', 'g' ], 
      '2': [ 'c', 'd', 'h' ], 
      '3': [ 'a', 'e', 'b' ] 
   }
  
   !=============================================================================================

   console.log(kosarajusAlg(cyclicTestGraph3.getUnweightedGraphForm()))
   *Result 
   {
      '1': [ 'D' ],
      '2': [ 'G', 'F', 'H' ],
      '3': [ 'C' ],
      '4': [ 'E' ],
      '5': [ 'B' ],
      '6': [ 'A' ]
   }

   !=============================================================================================

   console.log(kosarajusAlg(acyclicTestGraph.getUnweightedGraphForm()))
   *Result 
   {
      '1': [ 'D' ],
      '2': [ 'C' ],
      '3': [ 'E' ],
      '4': [ 'B' ],
      '5': [ 'A' ],
      '6': [ 'F' ],
      '7': [ 'H' ],
      '8': [ 'G' ]
   }
*/
