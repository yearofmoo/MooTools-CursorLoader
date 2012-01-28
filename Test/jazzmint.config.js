JazzMint.defineConfig({

  specDir : './Spec',
  sourceDir : '../Source'

});

JazzMint.defineTestSuite('all',{

  quitWhenLoadFailure : true,

  queryString : {
    specFiles : 'random',
    sourceFiles : 'random'
  },

  specFiles : 'CursorLoader_spec.js',
  sourceFiles : 'CursorLoader.js'

});
