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

//inputText est la fenêtre de dialogue readline qui permet au joueur de deviner un mot
const inputText = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Life nous permet de choisir un nombre d'essai maximum
// On décrémentera ce nombre d'essai avec remainingLives
const life = process.argv[2];
let remainingLives = life;

// fonction sleep qui quand elle est appelée ajoute un délai (elle sert principalement pour délair chaque tour de boucle au moment de vérifier les lettres )
const sleep = (milliseconds) => {
  const start = new Date().getTime();
  for (let i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
};

// guessWord est le mot de base que l'on veut deviner et mot est celui que le joueur entre dans la fenêtre de dialogue.
// la fonction isSame vérifie d'abord si la longueur de guessWord et mot sont les mêmme. Ensuite elle boucle sur chaque lettres pour vérifier si elle sont pareils
// Elle affiche en rouge les lettres bien placés, en jaunes les lettres mal placés, un X si la lettre n'est pas dans guessWord
// Petite précision : au départ cette fonction était tout en bas du code mais je l'ai replacé en haut pour plus facilement l'appeler ensuite.
const isSame = (a, b) => {
  // Ici j'ai créé une variable qui m'aide à définir des conditions ensuite.
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

// Ici on filtre le tableau de donnée pour n'afficher que des mots de moins de 6 lettres.
datafilter = data.filter((item) => item.label.length <= 5);
const TabData = datafilter[Math.floor(Math.random() * datafilter.length)];
const guessWord = TabData.label;

// cette fonction cache les lettres du mot à deviner sauf le premier, j'en ai profiter pour ajouter de la decoration
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

// la fonction playMotus permet au joueur de deviner un mot, elle s'appelle elle à chaque éssai. j'utilise la fonction sleep pour que les étapes du jeu soient plus claires
const playMotus = (mot) => {
  sleep(2000, console.log("\nvous avez essayé le mot : " + mot));

  if (guessWord.length === mot.length) {
    isSame(guessWord, mot);
  } else {
    inputText.close();
  }

  // la fonction guess peremet de savoir si le le joueur a déviner le mot, elle décrémente le nombre d'essai en cas d'échec.
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
      if (remainingLives === 0)
        return (
          console.log("\nC'est perdu ! 1 =("),
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
