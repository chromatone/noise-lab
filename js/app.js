import noiseGenerator from './components/noise-generator.js'

const ct = new Vue({
  el:"#noise-app",
  components:{
    noiseGenerator,
  },
  data: {
    channels:{},
    params:{
      oscType:'sawtooth',
      tuning:'equal',
      rootFreq:440,
      filterFreq: 350,
      vol:0.5,
    },
  },
  methods: {

  }
})
