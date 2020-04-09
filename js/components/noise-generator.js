import autoPanner from './auto-panner.js'
import autoFilter from './auto-filter.js'
import sqnob from './sqnob.js'

export default {
  template: `
  <div id="noise-generator">

          <div :class="{'is-primary': active}"
            class="button line-button"
            @mousedown="playNoise()"
            @touchstart.stop.prevent="playNoise()"
            @touchend.stop.prevent="stopNoise()"
            @touchcancel.stop.prevent="stopNoise()" @mouseup="stopNoise()">NOISE</div>


            <button :class="{active:synth.noise.type==type}" @click="synth.noise.type=type" :key="type" v-for="type in types">
      				{{type}}
      			</button>


    	   <sqnob v-model="noiseOptions.volume" unit=" dB" param="VOL" :step="1" :min="-32" :max="0"></sqnob>
          <sqnob v-model="gain.gain.value" unit="" param="DRY" :step="0.005" :min="0" :max="1"></sqnob>


       <sqnob v-model="synth.envelope.attack" unit="" param="ATT" :step="0.01" :min="0.005" :max="4"></sqnob>
       <sqnob v-model="synth.envelope.decay" unit="" param="DEC" :step="0.01" :min="0.001" :max="6"></sqnob>
       <sqnob v-model="synth.envelope.sustain" unit="" param="SUS" :step="0.01" :min="0.001" :max="1"></sqnob>
       <sqnob v-model="synth.envelope.release" unit="" param="REL" :step="0.01" :min="0.001" :max="12"></sqnob>

           <sqnob v-model="synth.noise.playbackRate" unit="" param="SPEED" :step="0.005" :min="0.1" :max="4"></sqnob>


<autoFilter></autoFilter>
<autoPanner></autoPanner>
</div>

  `,
  components:{
    autoFilter,
    autoPanner,
    sqnob
  },
  data() {
    return {
      noiseOptions: {
        noise : {
          type : 'brown'
        },
        envelope : {
          attack : 0.005 ,
          decay : 0.1 ,
          sustain : 0.9,
          release: 1
        },
        volume:-10
      },
      types:['brown','pink','white'],
      active:false,
      synth: new Tone.NoiseSynth(),
      gain: new Tone.Gain().toMaster(),
      send:{},
      toMaster:true
    }
  },
  filters: {
    trim(val) {
      let short = val.slice(0,3)
      return short.toUpperCase()
    }
  },
  methods: {
    playNoise() {
      if(Tone.context.state=='suspended') {
        Tone.context.resume()
      };
      this.synth.triggerAttack();
      this.active=true;

    },
    stopNoise() {
      this.synth.triggerRelease();
      this.active=false;
    }
	},
	watch: {
    toMaster(val) {
      if(val) {
        this.filter.toMaster();
      } else {
        this.filter.disconnect();
      }
    },
    'active'(val) {
      if(val) {
        this.synth.triggerAttack();
      } else {
        this.synth.triggerRelease()
      }
    },
    'noiseOptions.volume'(val) {
      this.synth.volume.setValueAtTime(val)
    }
	},
  created() {
    this.send=this.synth.send('filter')
  },
	mounted() {
    this.synth.set(this.noiseOptions)
    this.synth.envelope.attackCurve='sine';
    this.synth.connect(this.gain)

	},
  beforeDestroy() {
    this.synth.triggerRelease();
  }
}
