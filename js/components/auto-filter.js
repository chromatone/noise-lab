import sqnob from './sqnob.js'

export default {
  components:{
    sqnob
  },
  template: `
      <div id="autoFilter">
        <button :class="{active:receive}" @click="receive=!receive">AutoFilter</button>

              <sqnob v-model="filter.baseFrequency" unit="" param="FREQ" :step="1" :min="10" :max="1000"></sqnob>
              <sqnob v-model="filter.octaves" unit="" param="OCT" :step="0.01" :min="0.1" :max="7"></sqnob>
              <sqnob v-model="filter.filter.Q.value" unit="" param="Q" :step="0.01" :min="0" :max="10"></sqnob>
              <sqnob v-model="filter.wet.value" unit="" param="WET" :step="0.01" :min="0" :max="1"></sqnob>

              <button :class="{active:filter.filter.type==type}" @click="filter.filter.type=type" :key="type" v-for="type in types">
                {{type}}
              </button>

            <button class="line-button" @click="playing=!playing">Play</button>
            <sqnob v-model="filter.depth.value" unit="" param="DEP" :step="0.01" :min="0.1" :max="1"></sqnob>

            <sqnob v-model="filter.frequency.value" unit="" param="RATE" :step="0.01" :min="0.1" :max="60"></sqnob>

    </div>
  `,
  data() {
    return {
      filter: new Tone.AutoFilter(),
      gain: new Tone.Gain().toMaster(),
      types:['lowpass', 'highpass', 'bandpass'],
      playing:false,
      receive:false,
      options: {
        frequency : 0.5 ,
        type : 'sine' ,
        depth : 0.2 ,
        baseFrequency : 200 ,
        octaves : 5 ,
        filter : {
          type : 'lowpass' ,
          rolloff : -48 ,
          Q : 0
        }
      }

    }
  },
	watch: {
    receive(val) {
      if(val) {
        this.gain.gain.setValueAtTime(1,0.6)
      } else {
        this.gain.gain.setValueAtTime(0,0.6)
      }
    },
    playing(val) {
      if (val) {
        this.filter.start();
      } else {
        this.filter.stop();
      }
    }
	},
  created() {
    this.filter.set(this.options);
    this.filter.receive('filter')
    this.filter.connect(this.gain);
    this.filter.send('panner');
    this.gain.gain.value=0
  },

  beforeDestroy() {

  }
}
