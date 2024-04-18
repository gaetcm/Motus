// Pour faire fonctionner le jeu, initlialisez npm et  installez les packages nécessaires :
// npm install
// npm install play-sound colors readline
// Pour déclencher le jeu entrez node motus.js et le nombre d'essai que vous voulez. Par exemple :
// node motus.js 5
// Les lettres rouges sont celles qui sont dans le mot et au bon endroit.
// Les lettres jaunes sont celles qui sont dans le mot mais pas au bon endroit.
// Un "X" est une lettre qui n'est pas dans le mot.

// N'oubliez pas d'activer le son de votre device et amusez-vous bien !

const readline = require("readline");
const data = require("./bibliotheque.json");
const colors = require("colors");
const player = require("play-sound")();

const sleep = (milliseconds) => {
  const start = new Date().getTime();
  for (let i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
};
const isSame = (a, b) => {
  let isCharSame = true;
  for (let i = 0; i < a.length; i++) {
    sleep(6000);
    if (a[i] !== b[i]) {
      isCharSame = false;
    } else {
      isCharSame = true;
    }
    if (isCharSame === true) {
      process.stdout.write(colors.red(a[i]));
      player.play("./assets/sounds/valid.wav", (err) => {
        if (err) {
          console.error("Impossible de jouer le son:", err);
        }
      });
    } else if (a.includes(b[i])) {
      process.stdout.write(colors.yellow(b[i]));
      player.play("./assets/sounds/misplaced.wav", (err) => {
        if (err) {
          console.error("Impossible de jouer le son:", err);
        }
      });
    } else {
      process.stdout.write("X");
      player.play("./assets/sounds/wrong.wav", (err) => {
        if (err) {
          console.error("Impossible de jouer le son:", err);
        }
      });
    }
  }
};

datafilter = data.filter((item) => item.label.length <= 5);
const TabData = datafilter[Math.floor(Math.random() * datafilter.length)];
const guessWord = TabData.label;

function hideLetters(guessWord) {
  let hideWord = guessWord[0];
  for (let i = 1; i < guessWord.length; i++) {
    hideWord += "*";
  }
  return (
    console.log(`
     _           _    _  _  _  _   _  _  _  _  _  _            _    _  _  _  _     
    (_) _     _ (_) _(_)(_)(_)(_)_(_)(_)(_)(_)(_)(_)          (_) _(_)(_)(_)(_)_   
    (_)(_)   (_)(_)(_)          (_)     (_)      (_)          (_)(_)          (_)  
    (_) (_)_(_) (_)(_)          (_)     (_)      (_)          (_)(_)_  _  _  _     
    (_)   (_)   (_)(_)          (_)     (_)      (_)          (_)  (_)(_)(_)(_)_   
    (_)         (_)(_)          (_)     (_)      (_)          (_) _           (_)  
    (_)         (_)(_)_  _  _  _(_)     (_)      (_)_  _  _  _(_)(_)_  _  _  _(_)  
    (_)         (_)  (_)(_)(_)(_)       (_)        (_)(_)(_)(_)    (_)(_)(_)(_)    
                                                                                   
                                                                                  `),
    "\n\nMot mystère : " + hideWord + "\n"
  );
}
console.log(hideLetters(guessWord));

const inputText = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const life = process.argv[2];
let remainingLives = life;

const playMotus = (mot) => {
  console.log("\nvous avez essayé le mot : " + mot);

  isSame(guessWord, mot);

  const guess = () => {
    if (guessWord === mot) {
      console.log(`
      \nBravo ! Vous avez deviné le mot ${mot} `);
      player.play("./assets/sounds/victorycut.mp4", (err) => {
        if (err) {
          console.error("Impossible de jouer le son:", err);
        }
      });
      inputText.close(sleep(2000));
    } else {
      if (remainingLives != 0) {
        remainingLives--;
        console.log(`
        \nRaté ! Il vous reste ${remainingLives} essais`);
      }
      if (remainingLives === 0 || guessWord.length !== mot.length)
        return (
          console.log("\nC'est perdu ! =("),
          player.play("./assets/sounds/lose.wav", (err) => {
            if (err) {
              console.error("Impossible de jouer le son:", err);
            }
          }),
          inputText.close()
        );
    }
  };

  guess();

  if (remainingLives != 0) {
    inputText.question(
      `\nveuillez entrer un mot de ${guessWord.length} lettres : ` + "\n",
      playMotus,
      sleep(1000)
    );
  }
};
if (remainingLives != 0) {
  inputText.question(
    `\nveuillez entrer un mot de ${guessWord.length} lettres : `,
    playMotus
  );
}
