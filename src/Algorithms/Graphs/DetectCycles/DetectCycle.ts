import { Stack } from '../../../DataStructures/Stack/Stack'

type GraphType = { [key: string]: Array<string> }
type VisitedType = { [key: string]: { color: 'grey' | 'black'; path: Array<string> } }

export const detectCycle = function (graph: GraphType, withVrtx: string) {
   const vStack = new Stack<string, any>()
   const visited: VisitedType = {}

   vStack.put(withVrtx)
   visited[withVrtx] = { color: 'grey', path: [withVrtx] }

   while (visited[withVrtx].color === 'grey') {
      const currVrtx = vStack.watchLast() || ''
      const currVertNBs = graph[currVrtx]

      let hasUnprocessableNBs = false // содержит необработанные вершины

      if (Array.isArray(currVertNBs)) {
         for (let i = 0; i < currVertNBs.length; i++) {
            const nb = currVertNBs[i]

            if (!visited[nb]) {
               visited[nb] = { color: 'grey', path: [...visited[currVrtx].path, nb] }
               vStack.put(nb)
               hasUnprocessableNBs = true
               break
            }

            if (nb === withVrtx) {
               const p = visited[currVrtx].path
               const lastIdx = p.lastIndexOf(nb)
               return [...p.slice(lastIdx), nb]
            }
            // if (visited[nb].color === 'grey') {
            //    const p = visited[currVrtx].path
            //    const lastIdx = p.lastIndexOf(nb)
            //    const cycle = [...p.slice(lastIdx), nb]
            //    if (cycle.length - 1 === countSteps || countSteps === 'any') return cycle
            // }
         }
      }

      if (!hasUnprocessableNBs) {
         vStack.extract()
         visited[currVrtx].color = 'black'
      }
   }

   return null
}

export const getAnyCycle = function (graph: GraphType) {
   for (const start in graph) {
      const result = detectCycle(graph, start)
      if (result) return result
   }
}

const testGraph = {
   '0': ['1', '2', '7'],
   '1': ['0', '2', '3'],
   '2': ['0', '1', '6'],
   '3': ['1', '4', '5'],
   '4': ['3', '5', '20'],
   '5': ['3', '4', '6'],
   '6': ['2', '5', '10'],
   '7': ['0', '8', '9'],
   '8': ['7', '9', '12'],
   '9': ['7', '8', '10'],
   '10': ['6', '9', '11', '12'],
   '11': ['10', '13', '14'],
   '12': ['8', '10', '13'],
   '13': ['11', '12', '15'],
   '14': ['11', '16', '20'],
   '15': ['13', '16', '17'],
   '16': ['14', '15', '17', '18', '19'],
   '17': ['15', '16', '18'],
   '18': ['16', '17', '19'],
   '19': ['16', '18', '20'],
   '20': ['4', '14', '19'],
}

// console.log(detectCycle(testGraph, '0'))
