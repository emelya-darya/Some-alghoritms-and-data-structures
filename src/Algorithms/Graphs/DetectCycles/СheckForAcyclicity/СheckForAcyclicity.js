import { Stack } from '../../../../DataStructures/Stack/Stack.js'
import { dfs } from '../../DFS/DepthFirstSearch.js'

const checkPathsFromOneVrtx = function (graph, start) {
   const vStack = new Stack()
   const visited = {}

   vStack.put(start)
   visited[start] = 'grey'

   const output = {
      processedVs: new Set([start]),
      isTheCycleFound: false,
   }

   while (!vStack.isEmpty()) {
      const currVrtx = vStack.watchLast() || ''
      const currVertNBs = graph[currVrtx]

      let hasUnprocessableNBs = false

      for (let i = 0; i < currVertNBs.length; i++) {
         const nb = currVertNBs[i]

         if (!visited[nb]) {
            visited[nb] = 'grey'
            output.processedVs.add(nb)
            vStack.put(nb)
            hasUnprocessableNBs = true
            break
         } else if (visited[nb] === 'grey') {
            output.isTheCycleFound = true
            return output
         }
      }

      if (!hasUnprocessableNBs) {
         vStack.extract()
         visited[currVrtx] = 'black'
      }
   }

   return output
}

export const isTheGraphAcyclic = function (graph) {
   let verticesToCheck = dfs(graph)

   while (verticesToCheck.length) {
      const { isTheCycleFound, processedVs } = checkPathsFromOneVrtx(graph, verticesToCheck[0])
      if (isTheCycleFound) return false

      verticesToCheck = verticesToCheck.filter(v => !processedVs.has(v))
   }

   return true
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

const cyclicTestGraph = {
   A: ['B', 'E'],
   B: ['C'],
   C: ['D'],
   D: [],
   E: ['C'],
   F: ['G'],
   G: ['H'],
   H: ['D', 'F'],
}

const acyclicTestGraph = {
   A: ['B', 'E'],
   B: ['C'],
   C: ['D'],
   D: [],
   E: ['C'],
   F: [],
   G: ['H'],
   H: ['D', 'F'],
}

/*
     console.log(isTheGraphAcyclic(cyclicTestGraph))
     *Result 
     false
  
     !=============================================================================================
  
     console.log(isTheGraphAcyclic(acyclicTestGraph))
     *Result  
     true
*/

