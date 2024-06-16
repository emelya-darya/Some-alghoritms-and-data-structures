import { Graph, UnweightedGraphType } from '../../../../DataStructures/Graph/Graph'
import { kosarajusAlg } from '../KosarajusAlgorithm/KosarajusAlgorithm'

export const getSCCs = function (graph: UnweightedGraphType, SCRs: Record<string, Array<string>>) {
   const SCCs:Record<string, UnweightedGraphType> = {}

   for (const scr in SCRs) {
      const allVerticesInCurrSCR: Record<string, true> = {}
      for (let i = 0; i < SCRs[scr].length; i++) allVerticesInCurrSCR[SCRs[scr][i]] = true

      const currSCC: UnweightedGraphType = {}
      for (const v in allVerticesInCurrSCR) {
         const nbs = graph[v] || []
         currSCC[v] = nbs.filter(nb => allVerticesInCurrSCR[nb])
      }

      SCCs[scr] = currSCC
   }

   return SCCs
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
    A: ['H'],
    B: ['J'],
    C: ['J', 'K'],
    D: ['I'],
    E: ['C'],
    F: ['D', 'K'],
    G: ['A', 'B', 'E'],
    H: ['B', 'G'],
    I: ['F'],
    J: ['E'],
    K: ['I'],
    L: ['C', 'F', 'J'],
 }).getUnweightedGraphForm()
 
 const cyclicTestGraph2 = new Graph({
    a: ['b'],
    b: ['c', 'e', 'f'],
    c: ['d', 'g'],
    d: ['c', 'h'],
    e: ['a', 'f'],
    f: ['g'],
    g: ['f'],
    h: ['d', 'g'],
 }).getUnweightedGraphForm()
 
 /*
    console.log(getSCCs(cyclicTestGraph, kosarajusAlg(cyclicTestGraph)))
    *Result  
    {
       '1': { K: [ 'I' ], F: [ 'D', 'K' ], I: [ 'F' ], D: [ 'I' ] },
       '2': { J: [ 'E' ], C: [ 'J' ], E: [ 'C' ] },
       '3': { L: [] },
       '4': { B: [] },
       '5': { H: [ 'G' ], A: [ 'H' ], G: [ 'A' ] }
    }
 
    !=============================================================================================
 
    console.log(getSCCs(cyclicTestGraph2, kosarajusAlg(cyclicTestGraph2)))
    *Result 
    {
       '1': { f: [ 'g' ], g: [ 'f' ] },
       '2': { c: [ 'd' ], d: [ 'c', 'h' ], h: [ 'd' ] },
       '3': { a: [ 'b' ], e: [ 'a' ], b: [ 'e' ] }
    }
*/
