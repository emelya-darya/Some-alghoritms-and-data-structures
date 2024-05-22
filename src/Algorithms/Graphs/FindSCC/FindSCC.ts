import { UnweightedGraphType } from '../../../DataStructures/Graph/Graph'

export const findSCC = function (graph: UnweightedGraphType) {
   const tmpInvertedForm: Record<string, Set<string>> = {}

   for (const v in graph) {
      for (let i = 0; i < graph[v].length; i++) {
         const nb = String(graph[v][i])
         if (tmpInvertedForm[nb]) tmpInvertedForm[nb].add(v)
         else tmpInvertedForm[nb] = new Set([v])
      }
   }

   const invertedForm: Record<string, Array<string>> = {}
   for (const v in tmpInvertedForm) invertedForm[v] = Array.from(tmpInvertedForm[v])
}
