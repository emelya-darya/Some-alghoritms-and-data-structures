export class Graph {
   _weightedGraphForm = {}
   _vrtxList = new Set()
   _edgesList = new Set()

   constructor(list = {}) {
      if (Array.isArray(list)) {
         for (let i = 0; i < list.length; i++) {
            const edge = list[i].split('-')
            if (edge.length !== 2)
               throw new Error(
                  'The edge name in the list of edges is incorrect (the vertices that the edge connects are separated by a “-” sign + the “-” sign in vertex names is not allowed, example edge name: “a-b”).',
               )

            this.addEdge(edge[0], edge[1])
         }
      } else {
         this._checkAdjListOnValid(list)
         for (const v in list) this.addVrtx(v, list[v])
      }
   }

   _isObject(arg) {
      return arg !== null && !Array.isArray(arg) && typeof arg === 'object'
   }

   // will throw an error if there is a "-" symbol in the vertex names
   _checkVerticesNamesOnValid(...args) {
      for (let i = 0; i < args.length; i++) {
         if (String(args[i]).includes('-')) throw new Error('Vertex names must not contain the “-” character')
      }
   }

   // first we check that we have received an object
   // then we check that all the values ​​in this object are either arrays or also objects and the names of the root keys do not contain the symbol "-"
   // if arrays - check that the vertex names are strings or numbers and they do not contain the "-" character
   // if objects - check that the keys do not contain the symbol "-", and the values ​​contain numbers greater than 0
   _checkAdjListOnValid(adjList) {
      if (!this._isObject(adjList)) throw new Error('Incorrect structure of the passed adjacency list.') //! ----- 1

      let graphType = 'unknown'

      for (const v in adjList) {
         if (Array.isArray(adjList[v])) graphType = 'unweighted'
         else if (this._isObject(adjList[v])) graphType = 'weighted'
         else throw new Error('Incorrect structure of the passed adjacency list.')
         break
      }

      if (graphType === 'unknown') return true

      for (const v in adjList) {
         const subList = adjList[v]

         if (graphType === 'unweighted') {
            if (!Array.isArray(subList)) throw new Error('Incorrect structure of the passed adjacency list.')
            for (let i = 0; i < subList.length; i++) {
               if (typeof subList[i] !== 'string' && typeof subList[i] !== 'number')
                  throw new Error('Incorrect structure of the passed adjacency list.')
            }
            this._checkVerticesNamesOnValid(v, ...subList)
         } else if (graphType === 'weighted') {
            if (!this._isObject(subList)) throw new Error('Incorrect structure of the passed adjacency list.')
            for (const nb in subList) {
               if (typeof subList[nb] !== 'number' || subList[nb] <= 0)
                  throw new Error('The weight of the graph edges must be represented by numbers greater than 0.')
            }
            this._checkVerticesNamesOnValid(v, ...Object.keys(subList))
         }
      }
   }

   _addVrtxInList(vrtx) {
      this._vrtxList.add(String(vrtx))
   }

   _rmVrtxFromList(vrtx) {
      this._vrtxList.delete(String(vrtx))
   }

   _addEdgeInList(start, end) {
      this._edgesList.add(`${start}-${end}`)
   }

   _rmEdgeFromList(start, end) {
      this._edgesList.delete(`${start}-${end}`)
   }

   addVrtx(vrtx, nbs) {
      this._checkAdjListOnValid({ [vrtx]: nbs })

      if (Array.isArray(nbs)) {
         const newNbsObj = {}
         for (let i = 0; i < nbs.length; i++) newNbsObj[nbs[i]] = 1
         nbs = newNbsObj
      }

      this._addVrtxInList(vrtx)

      // if the graph does not yet have such a vertex, then create an empty list of neighbors for it
      if (!this._weightedGraphForm[vrtx]) this._weightedGraphForm[vrtx] = {}

      // go through the list of new neighbors and add them to the old one/overwrite the weight if such a neighbor already exists
      for (const newNb in nbs) {
         this._weightedGraphForm[vrtx][newNb] = nbs[newNb]
         this._addVrtxInList(newNb)
         this._addEdgeInList(vrtx, newNb)
      }

      return true
   }

   // returns "true" if such a vertex existed and was deleted, "false" - if it did not exist
   deleteVrtx(vrtx) {
      vrtx = String(vrtx)
      if (!this._vrtxList.has(vrtx)) return false

      delete this._weightedGraphForm[vrtx]
      for (const v in this._weightedGraphForm) delete this._weightedGraphForm[v][vrtx]

      this._rmVrtxFromList(vrtx)

      for (const edge of this._edgesList) {
         const [start, end] = edge.split('-')
         if (start === vrtx || end === vrtx) this._rmEdgeFromList(start, end)
      }

      return true
   }

   addEdge(start, end, weight = 1) {
      if (!this._vrtxList.has(String(start)) || !this._vrtxList.has(String(end)))
         throw new Error('There is no such starting or ending vertex in the current graph.')
      return this.addVrtx(start, { [end]: weight })
   }

   // returns "true" if such an edge existed and was removed, "false" - if it did not exist
   deleteEdge(start, end) {
      if (!this._edgesList.has(`${start}-${end}`)) return false

      delete this._weightedGraphForm[start][end]
      this._rmEdgeFromList(start, end)
      return true
   }

   // A vertex is said to be isolated if it is not the end of any edge. (there is no path into it from anywhere and it is impossible to get anywhere from it)
   // method returns a list of removed isolated vertices
   clearIsolatedVertices() {
      const isolVrtcs = new Set()

      for (const v in this._weightedGraphForm) {
         const nbsOfV = Object.keys(this._weightedGraphForm[v])
         // if the vertex has no neighbors or there is a path from it only to itself(loop)
         if (nbsOfV.length === 0 || (nbsOfV.length === 1 && v === nbsOfV[0])) isolVrtcs.add(v)
      }

      for (const v in this._weightedGraphForm) {
         if (isolVrtcs.has(v)) continue
         for (const nb in this._weightedGraphForm[v]) isolVrtcs.delete(nb)
      }

      for (const v of isolVrtcs) {
         if (this._weightedGraphForm[v][v]) this._rmEdgeFromList(v, v) // if an isolated vertex has a loop, remove it from the list of edges
         delete this._weightedGraphForm[v]
         this._rmVrtxFromList(v)
      }

      return Array.from(isolVrtcs)
   }

   getLoops() {
      const loops = new Set()

      for (const edge of this._edgesList) {
         const [start, end] = edge.split('-')
         if (start === end) loops.add(edge)
      }

      return Array.from(loops)
   }

   deleteAllLoops() {
      const loops = this.getLoops()
      for (let i = 0; i < loops.length; i++) {
         const v = loops[i].split('-')[0]
         this.deleteEdge(v, v)
      }
      return loops
   }

   // a graph is unweighted if all edges have the same weight
   isGraphWeighted() {
      const edgesWeights = new Set()
      const graph = this._weightedGraphForm

      for (const vrtx in graph) {
         for (const nb in graph[vrtx]) edgesWeights.add(graph[vrtx][nb])
      }

      return edgesWeights.size !== 1
   }

   // a graph is undirected if between all pairs of vertices there is a “there” edge and a “back” edge and they are of the same weight
   isGraphOriented() {
      const edgesListArray = Array.from(this._edgesList)

      for (let i = 0; i < edgesListArray.length; i++) {
         const currEdge = edgesListArray[i].split('-')
         const start = currEdge[0]
         const end = currEdge[1]

         // check if the edge is “symmetrical”
         if (!edgesListArray.includes(`${end}-${start}`)) return false

         const fromStartToEndWeight = this._weightedGraphForm[start]?.[end]
         const fromEndToStartWeight = this._weightedGraphForm[end]?.[start]

         // checking “symmetrical” ribs for equal weight
         if (fromStartToEndWeight !== fromEndToStartWeight) return false
      }
      return true
   }

   getWeightedGraphForm() {
      return JSON.parse(JSON.stringify(this._weightedGraphForm))
   }

   getUnweightedGraphForm() {
      const output = {}
      for (const v in this._weightedGraphForm) output[v] = Object.keys(this._weightedGraphForm[v])
      return output
   }

   getTheAdjacencySetOfAVertex(vertex) {
      vertex = String(vertex)
      const output = new Set()

      for (const edge of this._edgesList) {
         const [start, end] = edge.split('-')
         if (start === vertex) output.add(end)
         else if (end === vertex) output.add(start)
      }

      output.delete(vertex)

      return Array.from(output)
   }

   // vertical - where the path is from, horizontal - where to
   getAdjacencyMatrix() {
      const matrix = {}
      const plug = {}

      for (const v of this._vrtxList) plug[v] = 0
      for (const v of this._vrtxList) matrix[v] = { ...plug }

      for (const edge of this._edgesList) {
         const [from, to] = edge.split('-')
         matrix[from][to] = 1
      }
      return matrix
   }

   getListOfEdges() {
      return Array.from(this._edgesList)
   }

   getListOfVertices() {
      return Array.from(this._vrtxList)
   }

   clearGraph() {
      this._vrtxList.clear()
      this._edgesList.clear()
      this._weightedGraphForm = {}
   }
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

const graphExample = new Graph({
   a: { e: 14, c: 9, b: 8 },
   b: { a: 7 },
   c: { b: 10 },
   d: {},
   e: { f: 9, c: 2, a: 14 },
   g: { g: 4 },
})

/*
    graphExample.addVrtx('f', { g: 9 })
    graphExample.addVrtx('h', { a: 3, b: 20 })
    console.log(graphExample.getWeightedGraphForm())
  
    *Result 
    {
        a: { e: 14, c: 9, b: 8 },
        b: { a: 7 },
        c: { b: 10 },
        d: {},
        e: { f: 9, c: 2, a: 14 },
        g: { g: 4 },
        f: { g: 9 },
        h: { a: 3, b: 20 }
    }
  
    !=============================================================================================
  
    graphExample.deleteVrtx('h')
    console.log(graphExample.getWeightedGraphForm())
  
    *Result 
    {
        a: { e: 14, c: 9, b: 8 },
        b: { a: 7 },
        c: { b: 10 },
        d: {},
        e: { f: 9, c: 2, a: 14 },
        g: { g: 4 },
        f: { g: 9 }
    }
  
    !=============================================================================================
     
    graphExample.addEdge('a', 'f', 8)
    console.log(graphExample.getWeightedGraphForm())
  
    *Result 
    {
        a: { e: 14, c: 9, b: 8, f: 8 },
        b: { a: 7 },
        c: { b: 10 },
        d: {},
        e: { f: 9, c: 2, a: 14 },
        g: { g: 4 },
        f: { g: 9 }
    }
  
    !=============================================================================================
  
    graphExample.deleteEdge('a', 'b')
    console.log(graphExample.getWeightedGraphForm())

    *Result  
    {
        a: { e: 14, c: 9, f: 8 },
        b: { a: 7 },
        c: { b: 10 },
        d: {},
        e: { f: 9, c: 2, a: 14 },
        g: { g: 4 },
        f: { }
    }
  
    !=============================================================================================
  
    console.log(graphExample.clearIsolatedVertices())
    *Result  [ 'd' ]

    console.log(graphExample.getWeightedGraphForm())
    *Result  
    {
        a: { e: 14, c: 9, f: 8 },
        b: { a: 7 },
        c: { b: 10 },
        e: { f: 9, c: 2, a: 14 },
        g: { g: 4 },
        f: { g: 9 }
    }
  
    !=============================================================================================
  
    console.log(graphExample.deleteAllLoops())
    *Result  [ 'g-g' ]

    console.log(graphExample.getWeightedGraphForm())
    *Result  
    {
        a: { e: 14, c: 9, f: 8 },
        b: { a: 7 },
        c: { b: 10 },
        e: { f: 9, c: 2, a: 14 },
        g: {},
        f: { g: 9 }
    }

    !=============================================================================================

    console.log(graphExample.isGraphWeighted())
    *Result   true

    !=============================================================================================

    console.log(graphExample.isGraphOriented())
    *Result   false

    !=============================================================================================

    console.log(graphExample.getUnweightedGraphForm())
    *Result
    {
        a: [ 'e', 'c', 'f' ],
        b: [ 'a' ],
        c: [ 'b' ],
        e: [ 'f', 'c', 'a' ],
        g: [],
        f: [ 'g' ]
    }

    !=============================================================================================
    
    console.log(graphExample.getTheAdjacencySetOfAVertex('a'))
    *Result  [ 'e', 'c', 'b', 'f' ]

    !=============================================================================================

    console.log(graphExample.getAdjacencyMatrix())
    *Result
    {
        a: { a: 0, e: 1, c: 1, b: 0, f: 1, g: 0 },
        e: { a: 1, e: 0, c: 1, b: 0, f: 1, g: 0 },
        c: { a: 0, e: 0, c: 0, b: 1, f: 0, g: 0 },
        b: { a: 1, e: 0, c: 0, b: 0, f: 0, g: 0 },
        f: { a: 0, e: 0, c: 0, b: 0, f: 0, g: 1 },
        g: { a: 0, e: 0, c: 0, b: 0, f: 0, g: 0 }
    }

    !=============================================================================================

    console.log(graphExample.getListOfEdges())
    *Result   [ 'a-e', 'a-c', 'b-a', 'c-b', 'e-f', 'e-c', 'e-a', 'f-g', 'a-f' ]

    !=============================================================================================

    console.log(graphExample.getListOfVertices())
    *Result   [ 'a', 'e', 'c', 'b', 'f', 'g' ]

    !=============================================================================================

    graphExample.clearGraph()
    console.log(graphExample.getWeightedGraphForm())
    *Result  { }

*/
