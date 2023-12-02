import { PriorityQueue } from '../../DataStructures/PriorityQueue/PriorityQueue.ts'

type GraphType = { [key: string]: { [key: string]: number } }

type VertexInPriorityQueueType = { vrtxName: string; cost: number }

// Sorted ASC by costs fields
class VertexesPriorityQueue extends PriorityQueue<VertexInPriorityQueueType, string> {
   protected pairIsInCorrectOrder(firstElement: VertexInPriorityQueueType, secondElement: VertexInPriorityQueueType): boolean {
      return firstElement.cost <= secondElement.cost
   }

   protected isEqual(valueToSearch: string, heapContainerElement: VertexInPriorityQueueType) {
      return valueToSearch === heapContainerElement.vrtxName
   }

   protected getUniqueItemField(item: VertexInPriorityQueueType) {
      return item.vrtxName
   }
}

export const dijkstrasAlg = function (graph: GraphType, start: string, end: string) {
   if (!graph[start] || !graph[end]) return 'Invalid start or end vertex name.'

   const costs = { [start]: 0 }
   const shortestPaths = { [start]: [start] }

   const notVisititedButReachable = new VertexesPriorityQueue()

   const visited = { [start]: true }

   for (const vrtxName in graph) {
      if (vrtxName !== start) {
         const startNeighbourCost = graph[start][vrtxName]
         const costValue = startNeighbourCost !== undefined ? startNeighbourCost : Infinity

         costs[vrtxName] = costValue

         if (startNeighbourCost !== undefined) {
            notVisititedButReachable.add({ vrtxName, cost: startNeighbourCost })
            shortestPaths[vrtxName] = [start, vrtxName]
         }
      }
   }

   let node = notVisititedButReachable.extractingRoot() // the name of the vertex with lowest cost

   while (node && !visited[node.vrtxName]) {
      const nodeCost = costs[node.vrtxName]
      const neighbours = graph[node.vrtxName]

      for (const neighbourName in neighbours) {
         const neighbourCostNow = neighbours[neighbourName]
         const newNeighbourCost = nodeCost + neighbourCostNow

         if (newNeighbourCost < costs[neighbourName]) {
            costs[neighbourName] = newNeighbourCost
            shortestPaths[neighbourName] = [...shortestPaths[node.vrtxName], neighbourName]
            if (!visited[node.vrtxName]) notVisititedButReachable.add({ vrtxName: neighbourName, cost: newNeighbourCost })
         }
      }

      visited[node.vrtxName] = true
      node = notVisititedButReachable.extractingRoot()
   }

   return { cost: costs[end], path: shortestPaths[end] || [] }
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

const smallTestGraph = {
   a: { e: 14, c: 9, b: 7 },
   b: { a: 7, c: 10, d: 15 },
   c: { e: 2, a: 9, b: 10, d: 11 },
   d: { f: 6, c: 11, b: 15 },
   e: { f: 9, c: 2, a: 14 },
   f: { e: 9, d: 6 },
}

/*
   console.log(dijkstrasAlg(smallTestGraph, 'a', 'f'))
   *Result
   { cost: 20, path: [ 'a', 'c', 'e', 'f' ] }


   console.log(dijkstrasAlg(smallTestGraph, 'a', 'a'))
   *Result
   { cost: 0, path: [ 'a' ] }


   console.log(dijkstrasAlg(smallTestGraph, 'a', 'k'))
   *Result
   'Invalid start or end vertex name.'


   import { largeGraph } from './assets/largeGraphForTest.ts'
   console.log(dijkstrasAlg(largeGraph, '0-0', '99-99'))
   *Result
   {
      cost: 263,
      path: [
               '0-0',   '1-0',   '1-1',   '2-1',   '3-1',   '4-1',   '4-2',
               '5-2',   '5-3',   '5-4',   '6-4',   '6-5',   '6-6',   '6-7',
               '6-8',   '6-9',   '6-10',  '7-10',  '8-10',  '9-10',  '10-10',
               '11-10', '11-11', '11-12', '12-12', '13-12', '13-13', '13-14',
               '14-14', '15-14', '16-14', '16-15', '16-16', '16-17', '16-18',
               '17-18', '17-19', '17-20', '17-21', '17-22', ..., '99-99'
            ]
   }
*/
