import { Stack } from '../../../../DataStructures/Stack/Stack'
import { dfs } from '../../DFS/DepthFirstSearch'

type GraphType = { [key: string]: Array<string> }
type VisitedVrtxsType = { [key: string]: 'grey' | 'black' }

const checkPathsFromOneVrtx = function (graph: GraphType, start: string) {
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

export const isTheGraphAcyclic = function (graph: GraphType) {
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
