import { Graph } from '../../../DataStructures/Graph/Graph.js'
import { Stack } from '../../../DataStructures/Stack/Stack.js'

export const topologicalSort = function (graph, allGraphVertices) {
   let haveNoIncomingEdges = new Set(allGraphVertices)

   // remove vertices that have incoming edges
   for (const v in graph) {
      for (let i = 0; i < graph[v].length; i++) {
         const nb = String(graph[v][i])
         if (nb === v) return null // if we encounter a loop
         haveNoIncomingEdges.delete(nb)
      }
   }
   haveNoIncomingEdges = Array.from(haveNoIncomingEdges)

   if (!haveNoIncomingEdges.length) return null // if there are no such vertices, then the graph is cyclic and topological sorting is impossible for it

   const outputStack = []

   // run dfs for each vertex that has no input edges
   while (haveNoIncomingEdges.length) {
      const start = haveNoIncomingEdges.pop() || ''

      const vStack = new Stack()
      const visited = {}

      vStack.put(start)
      visited[start] = 'grey'

      for (let i = 0; i < outputStack.length; i++) visited[outputStack[i]] = 'black'

      while (!vStack.isEmpty()) {
         const currVrtx = vStack.watchLast() || ''
         const currVertNBs = graph[currVrtx]

         let hasUnprocessableNBs = false

         for (let i = 0; i < currVertNBs.length; i++) {
            const nb = currVertNBs[i]

            // if the neighbor is not yet in visited, then put it in visited under the gray color + add it to the stack for dfs + turn the hasUnprocessableNBs flag to true
            if (!visited[nb]) {
               visited[nb] = 'grey'
               vStack.put(String(nb))
               hasUnprocessableNBs = true
               break
            } else if (visited[nb] === 'grey') {
               // if we come across a cycle, there is no topological sorting for the graph
               return null
            }
         }

         // if the current vertex has no neighbors left, then remove it from the dfs stack, mark it black in visited and add it to the output stack
         if (!hasUnprocessableNBs) {
            vStack.extract()
            visited[currVrtx] = 'black'
            outputStack.push(currVrtx)
         }
      }
   }

   // if we launched dfs for all vertices that do not have incoming edges and not all vertices of the graph were considered -
   // means there is a cycle in the graph
   if (outputStack.length !== allGraphVertices.length) return null

   return outputStack.reverse()
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
   console.log(topologicalSort(cyclicTestGraph.getUnweightedGraphForm(), cyclicTestGraph.getListOfVertices()))
   *Result 
   null
  
   !=============================================================================================
  
   console.log(topologicalSort(acyclicTestGraph.getUnweightedGraphForm(), acyclicTestGraph.getListOfVertices()))
   *Result  
   [ 'A', 'E', 'B', 'C', 'G', 'H', 'F', 'D' ]
*/
