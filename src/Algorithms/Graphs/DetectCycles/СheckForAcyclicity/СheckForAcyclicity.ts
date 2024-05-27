import { Stack } from '../../../../DataStructures/Stack/Stack'
import { dfs } from '../../DFS/DepthFirstSearch'
import { Graph, UnweightedGraphType } from '../../../../DataStructures/Graph/Graph'

type VisitedVrtxsType = Record<string, 'grey' | 'black'>

const checkPathsFromOneVrtx = function (graph: UnweightedGraphType, start: string) {
   const vStack = new Stack<string, any>()
   const visited: VisitedVrtxsType = {}

   vStack.put(start)
   visited[start] = 'grey'

   const output = {
      processedVs: new Set<string>([start]),
      isTheCycleFound: false,
   }

   while (!vStack.isEmpty()) {
      const currVrtx = vStack.watchLast() || ''
      const currVertNBs = graph[currVrtx] || []

      let hasUnprocessableNBs = false

      for (let i = 0; i < currVertNBs.length; i++) {
         const nb = currVertNBs[i]

         if (!visited[nb]) {
            visited[nb] = 'grey'
            output.processedVs.add(String(nb))
            vStack.put(String(nb))
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

export const isTheGraphAcyclic = function (graph: UnweightedGraphType) {
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

const cyclicTestGraph = new Graph({
   A: ['B', 'E'],
   B: ['C'],
   C: ['D'],
   D: [],
   E: ['C'],
   F: ['G'],
   G: ['H'],
   H: ['D', 'F'],
}).getUnweightedGraphForm()

const acyclicTestGraph = new Graph({
   A: ['B', 'E'],
   B: ['C'],
   C: ['D'],
   D: [],
   E: ['C'],
   F: [],
   G: ['H'],
   H: ['D', 'F'],
}).getUnweightedGraphForm()

/*
     console.log(isTheGraphAcyclic(cyclicTestGraph))
     *Result 
     false
  
     !=============================================================================================
  
     console.log(isTheGraphAcyclic(acyclicTestGraph))
     *Result  
     true
*/
