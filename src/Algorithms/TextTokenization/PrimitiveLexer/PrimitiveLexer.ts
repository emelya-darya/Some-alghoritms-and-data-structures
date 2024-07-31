export const primitiveLexer = function (input: string, vocabulary: Set<string>) {
   if (vocabulary.has('')) throw new Error('The vocabulary should not contain strings with zero length')
   if (!input.length) return []

   const output: Array<Array<string>> = []
   const partitionOpts: Set<{ strRest: string; lexemes: Array<string> }> = new Set([{ strRest: input, lexemes: [] }])

   while (partitionOpts.size) {
      partitionOpts.forEach(currPO => {
         const { strRest, lexemes } = currPO

         if (!strRest.length) {
            partitionOpts.delete(currPO)
            output.push(lexemes)
            return
         }

         const branchesForTheCurrentSplit: Array<string> = []
         for (const lex of vocabulary) if (strRest.startsWith(lex)) branchesForTheCurrentSplit.push(lex)

         if (!branchesForTheCurrentSplit.length) partitionOpts.delete(currPO)
         else {
            partitionOpts.delete(currPO)

            for (let i = 0; i < branchesForTheCurrentSplit.length; i++) {
               const overlap = branchesForTheCurrentSplit[i]

               const newStrRest = strRest.slice(overlap.length)
               const newLexemes = [...lexemes, overlap]

               partitionOpts.add({ strRest: newStrRest, lexemes: newLexemes })
            }
         }
      })
   }

   return output
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

const vocabularyExample = new Set(['s', 'sat', 'f', 'a', 'b', 'k', 't', 'atf'])

/*
    console.log(primitiveLexer('satfb', vocabularyExample))
    *Result  
    [
       [ 's', 'atf', 'b' ],
       [ 'sat', 'f', 'b' ],
       [ 's', 'a', 't', 'f', 'b' ]
    ]
 
    !=============================================================================================
 
    console.log(primitiveLexer('sabkfb', vocabularyExample))
    *Result 
    [ 
       [ 's', 'a', 'b', 'k', 'f', 'b' ] 
    ]
   
    !=============================================================================================
 
    console.log(primitiveLexer('ap', vocabularyExample))
    *Result 
    [ ]
 
    !=============================================================================================
 
    console.log(primitiveLexer('', vocabularyExample))
    *Result 
    [ ]
 
    !=============================================================================================
 
    console.log(primitiveLexer('satfb', new Set([])))
    *Result 
    [ ]
 */
