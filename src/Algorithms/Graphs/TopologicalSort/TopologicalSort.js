import { Graph } from '../../../DataStructures/Graph/Graph.js'
import { Stack } from '../../../DataStructures/Stack/Stack.js'

export const getTopologicalSort = function (graph, ignoreСyclicity = false) {
   let allGraphVertices = new Set()
   for (const v in graph) {
      allGraphVertices.add(v)
      for (let i = 0; i < graph[v].length; i++) allGraphVertices.add(String(graph[v][i]))
   }
   allGraphVertices = Array.from(allGraphVertices)

   let haveNoIncomingEdges = new Set(allGraphVertices)
   for (const v in graph) {
      for (let i = 0; i < graph[v].length; i++) {
         const nb = String(graph[v][i])
         if (!ignoreСyclicity && nb === v) return null // if we encounter a loop
         haveNoIncomingEdges.delete(nb)
      }
   }
   haveNoIncomingEdges = Array.from(haveNoIncomingEdges)

   if (!ignoreСyclicity && !haveNoIncomingEdges.length) return null // if there are no such vertices, then the graph is cyclic and topological sorting is impossible for it

   const topologicalSort = {}
   let time = 1

   const shouldBeConsidered = [...allGraphVertices.filter(v => !haveNoIncomingEdges.includes(v)), ...haveNoIncomingEdges]

   while (shouldBeConsidered.length) {
      const start = shouldBeConsidered.pop() || ''

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

            if (!inTheCurrPath[nb] && !topologicalSort[nb]) {
               inTheCurrPath[nb] = true
               vStack.put(String(nb))
               hasUnprocessableNBs = true
               break
            } else if (!ignoreСyclicity && inTheCurrPath[nb]) return null // if we come across a cycle, there is no correct topological sorting for the graph
         }

         if (!hasUnprocessableNBs) {
            vStack.extract()
            delete inTheCurrPath[currVrtx]
            topologicalSort[currVrtx] = time
            time++

            const idx = shouldBeConsidered.indexOf(currVrtx)
            if (idx !== -1) shouldBeConsidered.splice(idx, 1)
         }
      }
   }

   return Object.entries(topologicalSort)
      .sort((v1, v2) => v2[1] - v1[1])
      .map(v => v[0])
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
   console.log(getTopologicalSort(acyclicTestGraph.getUnweightedGraphForm()))
   *Result  
   [ 'A', 'E', 'B', 'C', 'G', 'H', 'F', 'D' ]

   !=============================================================================================

   console.log(getTopologicalSort(cyclicTestGraph.getUnweightedGraphForm()))
   *Result 
   null
  
   !=============================================================================================

   console.log(getTopologicalSort(cyclicTestGraph.getUnweightedGraphForm(), true))
   *Result 
   [ 'H', 'F', 'G', 'A', 'E', 'B', 'C', 'D' ]
*/
