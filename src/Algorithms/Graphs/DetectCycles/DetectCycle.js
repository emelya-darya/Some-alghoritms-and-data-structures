import { Stack } from '../../../DataStructures/Stack/Stack.js'

// export const detectCycle = function (graph, start, countStepsInCycle = 2) {
//    const vStack = new Stack()
//    const visited = {} // пути до вершин из стартовой, сюда надо добавлять вершины, все пути из которой уже рассмотрены
//    const alreadyFindedCycles = {}

//    vStack.put(start)
//    visited[start] = [start]

//    while (!vStack.isEmpty()) {
//       const currV = vStack.extract() || ''
//       const currVertNBs = graph[currV] // соседи рассматриваемой вершины

//       if (Array.isArray(currVertNBs)) {
//          for (let i = 0; i < currVertNBs.length; i++) {
//             const nb = currVertNBs[i]

//             if (nb === start) {
//                const cycle = [...visited[currV], nb]
//                if (cycle.length - 1 === countStepsInCycle) return cycle
//             }

//             // если соседа еще нет в visited, то добавляем его туда и кладем в стек
//             if (!(nb in visited)) {
//                visited[nb] = [...visited[currV], nb]
//                vStack.put(nb)
//                // если сосед уже есть в visited
//             } else {
//                const cycle = [...visited[currV], ...visited[nb].reverse()]
//                if (cycle.length - 1 === countStepsInCycle) return cycle
//             }
//          }
//       }
//    }

//    return null
// }

// серые - вершины. которые dfs начал обрабатывать, но еще не закончил
// черные - уже обработанные
// поход в вершину, обработка которой уже завершилась - не является признаком цикла

// export const detectCycle = function (graph, countSteps) {
//    for (const start in graph) {
//       const vStack = new Stack()
//       const visited = {}

//       vStack.put(start)
//       visited[start] = { color: 'grey', path: [start] }

//       while (!vStack.isEmpty()) {
//          const currVrtx = vStack.watchLast() || ''
//          const currVertNBs = graph[currVrtx]

//          let hasUnprocessableNbs = false // содержит необработанные вершины

//          if (Array.isArray(currVertNBs)) {
//             for (let i = 0; i < currVertNBs.length; i++) {
//                const nb = currVertNBs[i]

//                if (!visited[nb]) {
//                   visited[nb] = { color: 'grey', path: [...visited[currVrtx].path, nb] }
//                   vStack.put(nb)
//                   hasUnprocessableNbs = true
//                   break
//                }
//                if (visited[nb].color === 'grey') {
//                   const p = visited[currVrtx].path
//                   const lastIdx = p.lastIndexOf(nb)
//                   const cycle = [...p.slice(lastIdx), nb]
//                   if (cycle.length - 1 === countSteps) return cycle
//                }
//             }
//          }

//          if (!hasUnprocessableNbs) {
//             vStack.extract()
//             visited[currVrtx].color = 'black'
//          }
//       }
//    }

//    return null
// }

export const detectCycle = function (graph, withVrtx) {
   const vStack = new Stack()
   const visited = {}

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

export const getAnyCycle = function (graph) {
   const output = {}
   for (const start in graph) {
      const result = detectCycle(graph, start)
      if (result) {
         const uniqVrtxs = [...result]
         uniqVrtxs.pop()
         uniqVrtxs.sort()
         output[uniqVrtxs.join('-')] = result
         // output.push(result)
      }
   }
   return output
}

const testGraph = {
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

const testGraph2 = {
   a: ['b'],
   b: ['f'],
   c: ['e', 'a'],
   d: ['c'],
   e: ['f'],
   f: ['g', 'd'],
}

// console.log(detectCycle(testGraph, '4', 13))

console.log(detectCycle(testGraph2, 'c'))

console.log(getAnyCycle(testGraph))
// console.log(detectCycle(testGraph2, 4))
