import { Graph } from '../../../../../DataStructures/Graph/Graph.js'

export const getAllCyclesWithVrtx = function (withVertex, SCC) {
   withVertex = String(withVertex)

   const outputCycles = []

   const dfsStack = []
   const blockedSet = new Set()
   const blockedMap = {}

   const startIndexForNbsCycling = {}
   const partsOfTheCycles = new Set()

   dfsStack.push(withVertex)
   blockedSet.add(withVertex)

   while (dfsStack.length) {
      const v = dfsStack[dfsStack.length - 1]
      const nbs = SCC[v] || []

      let hasUnprocessableNBs = false

      const startFrom = startIndexForNbsCycling[v] || 0

      for (let i = startFrom; i < nbs.length; i++) {
         const nb = String(nbs[i])

         startIndexForNbsCycling[v] = i + 1

         if (nb === withVertex) {
            outputCycles.push(dfsStack.join('-'))
            dfsStack.forEach(vrtx => partsOfTheCycles.add(vrtx))
         } else if (!blockedSet.has(nb)) {
            dfsStack.push(nb)
            blockedSet.add(nb)
            hasUnprocessableNBs = true
            break
         }
      }

      if (!hasUnprocessableNBs) {
         dfsStack.pop()
         delete startIndexForNbsCycling[v]

         if (partsOfTheCycles.has(v)) {
            let listTmp = new Set(blockedMap[v] || [])
            delete blockedMap[v]
            blockedSet.delete(v)

            while (listTmp.size) {
               const nextListTmp = new Set()
               for (const unblockMe of listTmp) {
                  blockedMap[unblockMe]?.forEach(el => nextListTmp.add(el))
                  delete blockedMap[unblockMe]
                  blockedSet.delete(unblockMe)
               }
               listTmp = nextListTmp
            }
         } else {
            nbs.forEach(nb => {
               nb = String(nb)
               if (blockedSet.has(nb) && nb !== withVertex) {
                  if (blockedMap[nb]) blockedMap[nb].push(v)
                  else blockedMap[nb] = [v]
               }
            })
         }
      }
   }

   return outputCycles
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

const testSCC = new Graph({
   1: [2, 5],
   2: [3],
   3: [1, 2, 4, 6],
   4: [5],
   5: [2],
   6: [4],
})

/*
   console.log(getAllCyclesWithVrtx(1, testSCC.getUnweightedGraphForm()))
   *Result  
   [ '1-2-3', '1-5-2-3' ]

   !=============================================================================================

   console.log(getAllCyclesWithVrtx(2, testSCC.getUnweightedGraphForm()))
   *Result 
   [ '2-3-1', '2-3-1-5', '2-3', '2-3-4-5', '2-3-6-4-5' ]
  
   !=============================================================================================

   console.log(getAllCyclesWithVrtx('H', cyclicTestGraph.getUnweightedGraphForm()))
   *Result 
   [ 'H-F-G' ]
*/
