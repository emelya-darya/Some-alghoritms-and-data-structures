import { Graph } from '../../../../DataStructures/Graph/Graph.js'
import { Stack } from '../../../../DataStructures/Stack/Stack.js'

export const tarjansAlg = function (graph) {
   const allVertices = {}

   for (const v in graph) {
      allVertices[v] = { index: null, lowlink: null }
      for (let i = 0; i < graph[v].length; i++) allVertices[graph[v][i]] = { index: null, lowlink: null }
   }

   let time = 0

   const verticesStack = new Stack()
   const isInVerticesStack = {}

   for (const start in allVertices) {
      if (allVertices[start].index === null) {
         const dfsStack = new Stack()

         dfsStack.put(start)
         verticesStack.put(start)
         isInVerticesStack[start] = true

         allVertices[start].index = allVertices[start].lowlink = time
         time++

         while (!dfsStack.isEmpty()) {
            const currVrtx = dfsStack.watchLast() || ''
            const currVertNBs = graph[currVrtx] || []

            let hasUnvisitedNBs = false

            for (let i = 0; i < currVertNBs.length; i++) {
               const nb = currVertNBs[i]

               if (allVertices[nb].index === null) {
                  dfsStack.put(String(nb))
                  verticesStack.put(String(nb))
                  isInVerticesStack[nb] = true

                  allVertices[nb].index = allVertices[nb].lowlink = time
                  time++

                  hasUnvisitedNBs = true
                  break
               } else if (isInVerticesStack[nb]) {
                  allVertices[currVrtx].lowlink = Math.min(allVertices[currVrtx].lowlink || 0, allVertices[nb].lowlink || 0)
               }
            }

            if (!hasUnvisitedNBs) {
               dfsStack.extract()

               if (allVertices[currVrtx].lowlink === allVertices[currVrtx].index) {
                  while (verticesStack.watchLast() !== currVrtx) {
                     const last = verticesStack.extract() || ''
                     delete isInVerticesStack[last]
                     allVertices[last].lowlink = allVertices[currVrtx].lowlink
                  }
                  verticesStack.extract()
                  delete isInVerticesStack[currVrtx]
               }
            }
         }
      }
   }

   const SCCs = {}
   for (const v in allVertices) {
      const vLowlink = allVertices[v].lowlink || ''
      if (SCCs[vLowlink]) SCCs[vLowlink].push(v)
      else SCCs[vLowlink] = [v]
   }

   const output = {}
   Object.values(SCCs).forEach((scc, i) => (output[i + 1] = scc))
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

const cyclicTestGraph4 = new Graph({
   1: [8, 2, 5],
   2: [9, 3, 7],
   3: [1, 2, 4, 6],
   4: [5],
   5: [2],
   6: [4],
   8: [9],
   9: [8],
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
   console.log(tarjansAlg(cyclicTestGraph.getUnweightedGraphForm()))
   *Result  
   {
      '1': [ 'B' ],
      '2': [ 'J', 'C', 'E' ],
      '3': [ 'K', 'D', 'I', 'F' ],
      '4': [ 'L' ],
      '5': [ 'A', 'H', 'G' ]
   }

   !=============================================================================================

   console.log(tarjansAlg(cyclicTestGraph2.getUnweightedGraphForm()))
   *Result 
   { 
      '1': [ 'c', 'd', 'h' ], 
      '2': [ 'f', 'g' ], 
      '3': [ 'a', 'b', 'e' ] 
   }
  
   !=============================================================================================

   console.log(tarjansAlg(cyclicTestGraph3.getUnweightedGraphForm()))
   *Result 
   {
      '1': [ 'B' ],
      '2': [ 'C' ],
      '3': [ 'D' ],
      '4': [ 'E' ],
      '5': [ 'F', 'G', 'H' ],
      '6': [ 'A' ]
   }

   !=============================================================================================

   console.log(tarjansAlg(cyclicTestGraph4.getUnweightedGraphForm()))
   *Result 
   {
      '1': [ '7' ],
      '2': [ '8', '9' ],
      '3': [ '1', '2', '3', '4', '5', '6' ]
   }

   !=============================================================================================

   console.log(tarjansAlg(acyclicTestGraph.getUnweightedGraphForm()))
   *Result 
   {
      '1': [ 'B' ],
      '2': [ 'C' ],
      '3': [ 'D' ],
      '4': [ 'E' ],
      '5': [ 'F' ],
      '6': [ 'G' ],
      '7': [ 'H' ],
      '8': [ 'A' ]
   }
*/
