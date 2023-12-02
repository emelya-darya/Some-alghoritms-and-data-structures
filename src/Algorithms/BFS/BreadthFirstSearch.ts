type GraphType = { [key: string]: Array<string> }

export const bfs = function (graph: GraphType, start: string) {
   const pointsQueue = [start]

   const distances: { [key: string]: number } = { [start]: 0 }

   while (pointsQueue.length) {
      const currPoint = pointsQueue[0]
      pointsQueue.shift()

      const neighbours = graph[currPoint] || []

      neighbours.forEach(neighbour => {
         if (distances[neighbour] === undefined) {
            distances[neighbour] = distances[currPoint] + 1
            pointsQueue.push(neighbour)
        }
      })
   }

   return distances
}
