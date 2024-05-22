import { Graph } from "../../../DataStructures/Graph/Graph.js"

export const findSCC = function (graph) {
   const tmpInvertedForm = {}

   for (const v in graph) {
      for (let i = 0; i < graph[v].length; i++) {
         const nb = String(graph[v][i])
         if (tmpInvertedForm[nb]) tmpInvertedForm[nb].add(v)
         else tmpInvertedForm[nb] = new Set([v])
      }
   }

   const invertedForm = {}
   for (const v in tmpInvertedForm) invertedForm[v] = Array.from(tmpInvertedForm[v])

   console.log(invertedForm)
}


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

findSCC(acyclicTestGraph.getUnweightedGraphForm())