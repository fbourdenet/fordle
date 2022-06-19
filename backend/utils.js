module.exports = {
    getWordToGuess: (words) => {
        return words[Math.floor(Math.random() * words.length)];
    },

    getWordLength: (word) => {
        return word.length;
    },

    checkUserWord: (socket, word, wordToGuess) => {
        let letters = [];
        let remaningLetters = wordToGuess;

        for (let i = 0; i < word.length; i++) {
            if (word[i] === wordToGuess[i]) {
                letters.push(word[i]);
            } else if (remaningLetters.includes(word[i])) {
                letters.push("MISPLACED");
            } else {
                letters.push("FALSE");
            }

            remaningLetters = remaningLetters.replaceAll(word[i], "");
        }

        return {
            found: letters.filter((letter) => letter.trim() !== "FALSE" && letter.trim() !== "MISPLACED").length === word.length,
            letters: letters,
        }
    }
}