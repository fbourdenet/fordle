module.exports = {
    initLetters: (length) => {
        let letters = []

        for (let i = 0; i < length; i++) {
            letters.push('');
        }

        return letters;
    },

    getWordToGuess: (words) => {
        return words[Math.floor(Math.random() * words.length)];
    },

    getWordLength: (word) => {
        return word.length;
    },

    checkUserWord: (word, wordToGuess) => {
        let letters = module.exports.initLetters(wordToGuess.length);
        let remaining = wordToGuess;

        for (let i = 0; i < word.length; i++) {
            if (word[i] === remaining[i]) {
                letters.splice(i, 1, word[i]);
            } else if (remaining.includes(word[i])) {
                letters.splice(i, 1, "MISPLACED");
            } else {
                letters.splice(i, 1,"FALSE");
            }

            remaining = remaining.replace(word[i], "_");
        }

        return {
            found: word === wordToGuess,
            letters: letters,
        }
    }
}