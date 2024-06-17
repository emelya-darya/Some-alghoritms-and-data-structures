import { getAllCyclesWithVrtx } from './GetAllCyclesWithAGivenVertex/GetAllCyclesWithVrtx'
import { Graph, UnweightedGraphType } from '../../../../DataStructures/Graph/Graph'
import { getSCCs } from '../../FindSCC/GetSCCFromSCR/GetSCCFromSCR'
import { tarjansAlg } from '../../FindSCC/TarjansAlgorithm/TarjansAlgorithm'

const isSCCisolatedVertex = function (SCC: UnweightedGraphType) {
   const vertices = Object.keys(SCC)
   if (vertices.length === 1 && !SCC[vertices[0]].length) return { isIsolated: true, vertices }
   return { isIsolated: false, vertices }
}

export const johnsonsAlg = function (graph: UnweightedGraphType) {
   graph = JSON.parse(JSON.stringify(graph))
   const outputCycles: Array<string> = []

   let SCCs = Object.values(getSCCs(graph, tarjansAlg(graph)))

   while (SCCs.length) {
      const currSCC = SCCs.pop() || {}

      const { isIsolated, vertices: currSCCvertices } = isSCCisolatedVertex(currSCC)

      if (isIsolated) {
         delete graph[currSCCvertices[0]]
         for (const v in graph) graph[v] = graph[v].filter(nb => String(nb) !== currSCCvertices[0])
         continue
      }

      const startVertex = currSCCvertices[0]
      outputCycles.push(...getAllCyclesWithVrtx(startVertex, currSCC))

      delete graph[startVertex]
      for (const v in graph) graph[v] = graph[v].filter(nb => String(nb) !== startVertex)

      SCCs = Object.values(getSCCs(graph, tarjansAlg(graph)))
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
   1: [8, 2, 5],
   2: [9, 3, 7],
   3: [1, 2, 4, 6],
   4: [5],
   5: [2],
   6: [4],
   7: [],
   8: [9],
   9: [8],
})
const cyclicTestGraph2 = new Graph({
   A: ['B', 'E'],
   B: ['C'],
   C: ['D'],
   D: [],
   E: ['C'],
   F: ['G'],
   G: ['H'],
   H: ['D', 'F'],
})

/*
   console.log(johnsonsAlg(cyclicTestGraph.getUnweightedGraphForm()))
   *Result  
   [ '1-2-3', '1-5-2-3', '2-3', '2-3-4-5', '2-3-6-4-5', '8-9' ]

   !=============================================================================================

   console.log(johnsonsAlg(cyclicTestGraph2.getUnweightedGraphForm()))
   *Result 
   [ 'F-G-H' ]
*/
