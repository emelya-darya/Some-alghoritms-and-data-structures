import { Graph } from '../../../../DataStructures/Graph/Graph.js'
import { getSCCs } from '../../FindSCC/GetSCCFromSCR/GetSCCFromSCR.js'
import { tarjansAlg } from '../../FindSCC/TarjansAlgorithm/TarjansAlgorithm.js'

const isSCCisolatedVertex = function (SCC) {
   const vertices = Object.keys(SCC)
   if (vertices.length === 1 && !SCC[vertices[0]].length) return { isIsolated: true, vertices }
   return { isIsolated: false, vertices }
}

/**
 * ! ЧТО ДЕЛАТЬ С СОСЕДЯМИ
 * 
 *? В цикле по соседям текущей вершины V (начинается со startVertex, на каждой итерации обновляем индекс для цикла соседей startIndexForNbsCycling): 
 *
 **     a. если сосед nb === startVertex, значит мы нашли цикл и он равен содержимому dfsStack:
 **          - сохраням найденный цикл в outputCycles и 
 **          - записываем какие вершины участвовали в этом цикле в theCyclesFoundIncludeTheVertices
 *
 **     b. если соседа нет в blockedSet, то:
 **          - кладем его в dfsStack 
 **          - кладем в blockedSet, а цикл по соседям прерываем
 **  

 *? После завершения цикла по соседям, если ни разу не сработал пункт b:
 **     c. Если с участием V был найден какой-либо цикл:
 **         - извлекаем V из dfsStack
 **         - удаляем V из blockedSet 
 **         - сбрасываем startIndexForNbsCycling для V на 0
 **         - проходимся по blockedMap и смотрим что еще можно разблокировать
 **     d. Иначе, если не было найдено ни одного цикла с участием V:
 **         - извлекаем V из dfsStack
 **         - получам список всех заблокированных соседей V и в blockedMap делаем записи о том, 
 **               что при разблокировке соседа можно будет разблокировать и V
*/

const findAllCyclesWithVrtx = function (start, SCC) {
   const outputCycles = new Set()

   const dfsStack = []
   const blockedSet = new Set()
   const blockedMap = {}

   const startIndexForNbsCycling = {} // c какого индекса начинать цикл по соседям
   const theCyclesFoundIncludeTheVertices = new Set()

   const unblockVrtx = function (v) {
      let listTmp = new Set(blockedMap[v] || [])
      delete blockedMap[v]
      blockedSet.delete(v)
      delete startIndexForNbsCycling[v]

      while (listTmp.size) {
         const nextListTmp = new Set() // тут дети всех текущих детей
         for (const unblockMe of listTmp) {
            blockedMap[unblockMe]?.forEach(el => nextListTmp.add(el))
            delete blockedMap[unblockMe]
            blockedSet.delete(unblockMe)
            delete startIndexForNbsCycling[unblockMe]
         }
         listTmp = nextListTmp
      }
   }

   dfsStack.push(start)
   blockedSet.add(start)

   while (dfsStack.length) {
      const v = dfsStack[dfsStack.length - 1]
      const nbs = SCC[v]

      let hasUnprocessableNBs = false

      const startFrom = startIndexForNbsCycling[v] || 0

      for (let i = startFrom; i < nbs.length; i++) {
         const nb = String(nbs[i])

         startIndexForNbsCycling[v] = i + 1

         if (nb === start) {
            outputCycles.add(dfsStack.join('-'))
            dfsStack.forEach(vrtx => theCyclesFoundIncludeTheVertices.add(vrtx))
         } else if (!blockedSet.has(nb)) {
            dfsStack.push(nb)
            blockedSet.add(nb)

            hasUnprocessableNBs = true
            break
         }
      }

      if (!hasUnprocessableNBs) {
         if (theCyclesFoundIncludeTheVertices.has(v)) {
            dfsStack.pop()
            unblockVrtx(v)
         } else {
            dfsStack.pop()
            const allBlockedNbs = nbs.filter(n => blockedSet.has(String(n)) && n != start)
            allBlockedNbs.forEach(nb => {
               if (blockedMap[nb]) blockedMap[nb].push(v)
               else blockedMap[nb] = [v]
            })
         }
      }
   }

   return outputCycles
}

export const johnsonsAlg = function (graph) {
   graph = JSON.parse(JSON.stringify(graph))
   const outputCycles = []

   let SCCs = Object.values(getSCCs(graph, tarjansAlg(graph)))

   while (SCCs.length) {
      const currSCC = SCCs.pop() || {}

      const { isIsolated, vertices: currSCCvertices } = isSCCisolatedVertex(currSCC)

      if (isIsolated) {
         // удаление вершины из графа
         delete graph[currSCCvertices[0]]
         for (const v in graph) graph[v] = graph[v].filter(nb => String(nb) !== currSCCvertices[0])

         continue
      }

      console.log(currSCC)

      const startVertex = currSCCvertices[0]
      outputCycles.push(...findAllCyclesWithVrtx(startVertex, currSCC))

      delete graph[startVertex]
      for (const v in graph) graph[v] = graph[v].filter(nb => String(nb) !== startVertex)

      SCCs = Object.values(getSCCs(graph, tarjansAlg(graph)))
   }

   return outputCycles
}

const testGraph2 = new Graph({
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
})

const cyclicTestGraph4 = new Graph({
   1: [8, 2, 5],
   2: [9, 3, 7],
   3: [1, 2, 4, 6],
   4: [5],
   5: [2],
   6: [4],
   8: [9],
   9: [8],
})

console.log(johnsonsAlg(cyclicTestGraph4.getUnweightedGraphForm()))

//const c = johnsonsAlg(testGraph2.getUnweightedGraphForm())
// console.log(c.sort((a,b)=>b.length-a.length))
// console.log(c.length)
// console.log(new Set(c.map(g=>g.join('-'))))

const func = () => Math.min(0, 9, 7, 666)

const testObj = { a: true }

const testSet = new Set(['a'])

// for (let i = 0; i < 100000000; i++) {
//    if (testObj.a) func()
// }

// for (let i = 0; i < 1000000; i++) {
//    if (testSet.has('a')) func()
// }

console.log(8 == '8')

/*



 ** В случае, если у v все соседи содержатся в blockedSet (то есть ни разу не сработал пункт 2), то проходимся по allBlockedNbs и
 ** пополняем список blockedMap и удаляем текущую вершину (v) из dfsStack (но не из blockedSet, потому что в текущем пути,
 ** который лежит в dfsStack нет варианта продолжения пути так, чтобы он включал v и образовывал цикл), НО если мы далее в
 ** процессе работы алгоритма разблокируем кого-то из allBlockedNbs,то можно будет разблокировать и v)
 *
 *
 *
 *
 *
 */

//
/**
 * Если у вершины v обследованы все соседи и мы нашли цикл с участием v - разблокируем v и удалим ее из dfsStack,потому что
 * возможно, что в случае продолжающегося обхода удастся найти другой цикл, идущий через v в startVertex
 * (тк путь из v в startVertex, как выяснилось, есть)
 */

/**
 * потому что в текущем пути DFS, который содержися в dfsStack, мы не сможем найти простой цикл, оканчивающийся в startVertex, НО
 * нужно сделать пометку о том, что если из dfsStack будет удален этот заблокированный сосед(а если от будет удален из dfsStack,
 * то он будет удален и из blockedSet), то нужно разблокировать и текущую v тоже
 */

// если
