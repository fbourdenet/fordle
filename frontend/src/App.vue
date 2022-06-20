<template>
  <div class="app">
    <h1>Fordle</h1>
    <Board :tries="6" :length="wordLength" v-if="wordLength !== 0"/>
    <div class="socials">
      <div class="social">
        <a href="https://github.com/fbourdenet/"><i class="devicon-github-original"></i></a>
      </div>
      <div class="social">
        <a href="https://www.linkedin.com/in/florianbourdenet/"><i class="devicon-linkedin-plain"></i></a>
      </div>
    </div>
  </div>
</template>

<script>
import Board from './components/Board.vue'

export default {
  name: 'App',
  data() {
    return {
      wordLength: 0,
    }
  },
  components: {
    Board
  },
  methods: {
    getWordLength() {
      this.$socket.emit("get-word-length");
      this.$socket.on("get-word-length", (res) => {
        this.wordLength = res;
      });
    }
  },
  mounted() {
    this.getWordLength();
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=PT+Sans:wght@700&display=swap');

  html, body {
    background-color: #2c3e50;
    margin: 0 !important;
    padding: 0 !important;
    font-family: 'PT Sans', sans-serif;
    color: white;
  }

  .app {
    width: 100vw;
    height: 100vh;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    outline: none;
  }

  .app h1 {
    font-size: 3em;
  }

  .socials {
    display: flex;
    position: absolute;
    bottom: 0;
    right: 0;
    padding-right: 10px;
    padding-bottom: 20px;
  }

  .social {
    padding-right: 10px;
  }

  .social a {
    text-decoration: none;
    color: white;
  }

  .social i {
    font-size: 2em;
  }
</style>
