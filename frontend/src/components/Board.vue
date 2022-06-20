<template>
    <p v-show="isGameFinishedAndWordNotFound" class="subtitle">Tu as perdu !</p>
    <p v-show="isGameFinishedAndWordFound" class="subtitle">Tu as trouvé le mot !</p>
    <p v-show="!isGameFinishedAndWordFound && !isGameFinishedAndWordNotFound" class="subtitle">Trouve le mot !</p>
    <div class="board" @keydown="handleInput($event)" tabindex="1">
      <div class="cell" v-for="(n, i) in this.totalCells" :key="n" :class="{next: isCellNext(i, n, this.length)}">
        <p :ref="getRef(i, n, this.length)"></p>
      </div>
    </div>

    <button class="play-again" :class="{visible: isGameFinishedAndWordFound || isGameFinishedAndWordNotFound}" @click="restartGame">
      Rejouer !
    </button>
</template>

<script>
export default {
  name: "Board",
  data() {
    return {
      board: [],
      totalCells: this.tries * this.length,
      currentLineIndex: 0,
      currentCellIndex: 0,
      found: false,
      finished: false,
    }
  },
  props: {
    tries: Number,
    length: Number,
  },
  computed: {
    isEndOfLine() {
      return this.currentCellIndex === this.length;
    },
    isLastCellOfGame() {
      return (this.currentCellIndex === this.length) && (this.currentLineIndex === this.tries - 1)
    },
    isGameFinished() {
      return this.finished;
    },
    isGameFinishedAndWordNotFound() {
      return this.finished && !this.found;
    },
    isGameFinishedAndWordFound() {
      return this.finished && this.found;
    }
  },
  methods: {
    getRef(i, n, length) {
      return 'row' + this.setRowId(n, length) + '-cell' + this.setCellId(i, length);
    },
    isCellNext(i, n, length) {
      return this.getRef(i, n, length) === "row" + this.currentLineIndex + "-cell" + this.currentCellIndex;
    },
    setCellId(n, length) {
      return n % length;
    },
    setRowId(n, length) {
      return Math.ceil(n / length) - 1;
    },
    restartGame() {
      this.$socket.emit("get-word-to-guess");
      this.currentCellIndex = 0;
      this.currentLineIndex = 0;
      this.finished = false;
      this.found = false;

      for (let i = 0; i < this.tries; i++) {
        for (let j = 0; j < this.length; j++) {
          this.$refs["row" + i + "-cell" + j][0].innerText = "";
          this.$refs["row" + i + "-cell" + j][0].parentNode.classList = "cell";
        }
      }
    },
    initBoard() {
      for (let i = 0; i < this.totalCells; i++) {
        this.board.push(['']);
      }
    },
    initSockets() {
      this.$socket.on("check-user-word", (res) => {
        this.found = res.found;

        for (let i = 0; i < this.length; i++) {
          if (res.letters[i] === "FALSE") {
            this.$refs["row" + this.currentLineIndex + "-cell" + i][0].parentNode.classList.add('false');
            continue;
          }

          if (res.letters[i] === "MISPLACED") {
            this.$refs["row" + this.currentLineIndex + "-cell" + i][0].parentNode.classList.add('misplaced');
            continue;
          }

          this.$refs["row" + this.currentLineIndex + "-cell" + i][0].parentNode.classList.add('right');
        }

        if (this.isLastCellOfGame) {
          this.finished = true;
          return;
        }

        if (this.found) {
          this.finished = true;
          return;
        }

        this.currentCellIndex = 0;
        this.currentLineIndex++;
      });
    },
    handleInput(event) {
      let key = event.key;

      if (this.isGameFinished) {
        return;
      }

      if (key === "Backspace") {
        this.deleteInput();
        return;
      }

      if (key === "Enter" && this.isEndOfLine) {
        this.checkInput();
        return;
      }

      if (!this.keyIsValid(key)) {
        return;
      }

      this.writeInput(key.toUpperCase());
    },
    keyIsValid(key) {
      return key.length <= 1 && /^[A-Za-z]+$/.test(key);
    },
    writeInput(key) {
      let currentCell = this.$refs["row" + this.currentLineIndex + "-cell" + this.currentCellIndex];

      // row is completed
      if (currentCell == null) {
        return
      }

      currentCell[0].innerText = key;
      this.currentCellIndex++;
    },
    deleteInput() {
      let previousCell = this.$refs["row" + this.currentLineIndex + "-cell" + (this.currentCellIndex - 1)];

      // no letter to delete
      if (previousCell == null) {
        return
      }

      previousCell[0].innerText = "";
      this.currentCellIndex--;
    },
    getUserWord() {
      let word = "";
      for (let i = 0; i < this.length; i++) {
        word += this.$refs["row" + this.currentLineIndex + "-cell" + i][0].innerText;
      }

      return word;
    },
    checkInput() {
      let word = this.getUserWord();
      this.$socket.emit("check-user-word", word);
    }
  },
  created() {
    this.initBoard();
    this.initSockets();
  }
}
</script>

<style scoped>
.board {
  background-color: transparent;
  max-width: 320px;
  display: flex;
  flex-wrap: wrap;
  outline: none;
  justify-content: center;
  align-items: center;
}

.cell {
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3px;
  border: #688AAC solid 2px;
  flex-basis: 20%;
  font-size: 1.3em;
  min-width: 50px;
  max-width: 50px;
  min-height: 50px;
  max-height: 50px;
}

.cell p {
  margin: 0;
  padding: 0;
}

.next {
  border: 2px solid white;
}

.right {
  transition: background-color 250ms ease-in-out;
  background-color: limegreen;
}

.false {
  transition: background-color 250ms ease-in-out;
  background-color: #5a5a5a;
}

.misplaced {
  transition: background-color 250ms ease-in-out;
  background-color: #FFAE42;
}

.modal {
  position: fixed;
  z-index: 999;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 400px;
  margin-left: -400px;
  margin-top: -200px;
  background-color: #688AAC;
  border-radius: 10px;
}

.play-again {
  visibility: hidden;
  border: solid 2px #688AAC;
  background-color: transparent;
  padding: 10px;
  border-radius: 10px;
  color: white;
  font-family: 'PT Sans', sans-serif;
  margin-top: 40px;
  cursor: pointer;
  transition: border 250ms ease-in-out;
}

.play-again:hover {
  border: solid 2px white;
}

.visible {
  visibility: visible;
}

</style>