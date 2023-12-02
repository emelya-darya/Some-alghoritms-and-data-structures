export const bfs = function (graph, start) {
   const pointsQueue = [start]

   const distances = { [start]: 0 }
   const paths = { [start]: [start] }

   while (pointsQueue.length) {
      const currPoint = pointsQueue[0]
      pointsQueue.shift()

      const neighbours = graph[currPoint] || []

      neighbours.forEach(neighbour => {
         if (distances[neighbour] === undefined) {
            distances[neighbour] = distances[currPoint] + 1
            paths[neighbour] = [...paths[currPoint], neighbour]
            pointsQueue.push(neighbour)
         }
      })
   }

   const output = {}

   for (const key in distances) {
      output[key] = {
         distance: distances[key],
         path: paths[key],
      }
   }

   return output
}

const testGraph = {
   a: ['b', 'c'],
   b: ['f'],
   c: ['d', 'e'],
   d: ['f'],
   e: ['f'],
   f: ['g'],
}

console.log(bfs(testGraph, 'a'))
