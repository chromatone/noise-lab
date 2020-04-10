import * as components from './components/all.js'


const ct = new Vue({
  el:"#noise-app",
  components: {...components},
  data: {
    channels:[],
    params:{
      oscType:'sawtooth',
      tuning:'equal',
      rootFreq:440,
      filterFreq: 350,
      vol:0.5,
    },
  },
  methods: {
    resume() {
      if (Tone.context.state == "suspended") {
        Tone.context.resume();
      }
    }
  }
})
