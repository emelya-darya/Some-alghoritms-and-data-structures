import { getAllCyclesWithVrtx } from './GetAllCyclesWithAGivenVertex/GetAllCyclesWithVrtx'
import { UnweightedGraphType } from '../../../../DataStructures/Graph/Graph'
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

const testGraph2 = {
   0: ['1', '2', '7'],
   1: ['0', '2', '3'],
   2: ['0', '1', '6'],
   3: ['1', '4', '5'],
   4: ['3', '5', '20'],
   5: ['3', '4', '6'],
   6: ['2', '5', '10'],
   7: ['0', '8', '9'],
   8: ['7', '9', '12'],
   9: ['7', '8', '10'],
   10: ['6', '9', '11', '12'],
   11: ['10', '13', '14'],
   12: ['8', '10', '13'],
   13: ['11', '12', '15'],
   14: ['11', '16', '20'],
   15: ['13', '16', '17'],
   16: ['14', '15', '17', '18', '19'],
   17: ['15', '16', '18'],
   18: ['16', '17', '19'],
   19: ['16', '18', '20'],
   20: ['4', '14', '19'],
}
