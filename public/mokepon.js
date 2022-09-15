//First screen, the characters are shown and selected here.
const petSection = document.getElementById("select-pet");
const cardContainer = document.getElementById("cards-container");
const petButtonPlayer = document.getElementById("button-pet");
// Second screen, defining the map, drawing the characters and cheking for collision.
const sectionShowMap = document.getElementById("show-map");
const map = document.getElementById("map");
let canvas = map.getContext("2d");
let backgroundMap = new Image();
const buttonUp = document.getElementById("buttonUp");
const buttonLeft = document.getElementById("buttonLeft");
const buttonDown = document.getElementById("buttonDown");
const buttonRight = document.getElementById("buttonRight");
// third screen, here goes the attack buttons, players selected and their scores.
const attackSection = document.getElementById("select-attack");
const attacksContainer = document.getElementById("attacks-container");
const messageSecction = document.getElementById("message");
const restartButton = document.getElementById("button-restart");

const playersLife = document.getElementById("player-lifes");
const enemysLife = document.getElementById("enemy-lifes");

const spanPlayersPet = document.getElementById("player-pet");
const spanEnemysPet = document.getElementById("enemy-pet");

const playerAttackMessage = document.getElementById("player-attack");
const enemyAttackMessage = document.getElementById("enemy-attack");
// Defining the dimensions of the map proportionally to the window.
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const mapWidth = screenWidth * 0.7;
const mapHeight = screenHeight * 0.6;
map.width = mapWidth;
map.height = mapHeight;
let interval;

let mokeponListOption; // Variable used to add the mokepon cards to the first screen in my html.
let inputPets = []; // Array of inputs used by the user to choose a pet.
let playerId = null; // Id, obtained from the backend.
let mokeponList = [];
let myPet; // Here I deposit the object of my mokepons list after being selected by the user.
let enemyId = null;
let mokeponListEnemys = []; 
let petEnemy;

let fireButton;
let waterButton;
let earthButton;
let attackOptions;
let buttons = [];

let attackCounter = []; // Here goes the attack sequence.
let enemyAttackCounter = [];
let combatCounter = 0;
let victoryCounter = 0;
let lossCounter = 0;
let result;
// Declaring the characters and their respective class.
class Mokepon {
  constructor(
    name,
    picture,
    life,
    type,
    MapPicture,
    x = 20,
    y = 20,
    id = null
  ) {
    this.id = id;
    this.name = name;
    this.picture = picture;
    this.life = life;
    this.type = type;
    this.attack = [];
    this.x = x;
    this.y = y;
    this.width = map.width * 0.1;
    this.height = map.height * 0.1;
    this.pictureMap = new Image();
    this.pictureMap.src = MapPicture;
    this.speedX = 0;
    this.speedY = 0;
  }

  drawMokepon() {
    canvas.drawImage(this.pictureMap, this.x, this.y, this.width, this.height);
  }
}

let hipodoge = new Mokepon(
  "Hipodoge",
  "./imagenes/hipodoge.png",
  5,
  "Water",
  "./imagenes/hipodoge-cabeza.png"
);

let capipepo = new Mokepon(
  "Capipepo",
  "./imagenes/capipepo.png",
  5,
  "Earth",
  "./imagenes/capipepo-cabeza.png"
);

let ratigueya = new Mokepon(
  "Ratigueya",
  "./imagenes/ratigueya.png",
  5,
  "Fire",
  "./imagenes/ratigueya-cabeza.png"
);

let tucapalma = new Mokepon(
  "Tucapalma",
  "./imagenes/tucapalma.png",
  5,
  "Water",
  "./imagenes/tucapalma.png"
);

let pydos = new Mokepon(
  "Pydos",
  "./imagenes/pydos.png",
  5,
  "Earth",
  "./imagenes/pydos.png"
);

let langostelvis = new Mokepon(
  "Langostelvis",
  "./imagenes/langostelvis.png",
  5,
  "Fire",
  "./imagenes/langostelvis.png"
);
// Adding the characters to a list and assigning their powers according to their type.
mokeponList.push(hipodoge, capipepo, ratigueya, tucapalma, pydos, langostelvis);
mokeponList.forEach((mokepon) => {
  if (mokepon.type === "Water") {
    mokepon.attack.push(
      { name: "🌊", id: "button-water" },
      { name: "🌊", id: "button-water" },
      { name: "🌊", id: "button-water" },
      { name: "🔥", id: "button-fire" },
      { name: "🔥", id: "button-fire" },
      { name: "🌱", id: "button-earth" },
      { name: "🌱", id: "button-earth" }
    );
  } else if (mokepon.type === "Earth") {
    mokepon.attack.push(
      { name: "🌱", id: "button-earth" },
      { name: "🌱", id: "button-earth" },
      { name: "🌱", id: "button-earth" },
      { name: "🌊", id: "button-water" },
      { name: "🌊", id: "button-water" },
      { name: "🔥", id: "button-fire" },
      { name: "🔥", id: "button-fire" }
    );
  } else if (mokepon.type === "Fire") {
    mokepon.attack.push(
      { name: "🔥", id: "button-fire" },
      { name: "🔥", id: "button-fire" },
      { name: "🔥", id: "button-fire" },
      { name: "🌊", id: "button-water" },
      { name: "🌊", id: "button-water" },
      { name: "🌱", id: "button-earth" },
      { name: "🌱", id: "button-earth" }
    );
  }
});
// This function is called once the screen is already loaded.
function startGame() {
  sectionShowMap.style.display = "none";
  attackSection.style.display = "none";
  restartButton.style.display = "none";
  // Adding the mokepon cards to the first screen in my html.
  mokeponList.forEach((mokepon) => {
    mokeponListOption = `
    <label class="mokepon-card" for=${mokepon.name}>
          <p>${mokepon.name}<br/>${mokepon.type}-Type.</p>
          <img src=${mokepon.picture} alt=${mokepon.name} />
          <input type="radio" name="pet" id=${mokepon.name} />
    </label>
    `;
    cardContainer.innerHTML += mokeponListOption;
  });
  // Filling the array of inputs to be used later.
  mokeponList.forEach((mokepon) => {
    inputPets.push(document.getElementById(mokepon.name));
  });
  // I add the event listeners here because the page is already loaded.
  petButtonPlayer.addEventListener("click", selectPlayerPet);
  buttonUp.addEventListener("mousedown", moveUp);
  buttonUp.addEventListener("touchstart", moveUp);
  buttonUp.addEventListener("mouseup", stop);
  buttonUp.addEventListener("touchend", stop);
  buttonLeft.addEventListener("mousedown", moveLeft);
  buttonLeft.addEventListener("touchstart", moveLeft);
  buttonLeft.addEventListener("mouseup", stop);
  buttonLeft.addEventListener("touchend", stop);
  buttonDown.addEventListener("mousedown", moveDown);
  buttonDown.addEventListener("touchstart", moveDown);
  buttonDown.addEventListener("mouseup", stop);
  buttonDown.addEventListener("touchend", stop);
  buttonRight.addEventListener("mousedown", moveRight);
  buttonRight.addEventListener("touchstart", moveRight);
  buttonRight.addEventListener("mouseup", stop);
  buttonRight.addEventListener("touchend", stop);
  restartButton.addEventListener("click", restart);
  backgroundMap.src = `./imagenes/map${randomNumber(1, 7)}.png`;

  joinGame();
}
// Getting the unique id from my index.js (backend)
function joinGame() {
  fetch("192.168.0.5:8080/join").then(function (res) {
    if (res.ok) {
      res.text().then(function (response) {
        playerId = response;
      });
    }
  });
}
// Selection in the first screen.
function selectPlayerPet() {
  for (let ind in inputPets) {
    if (inputPets[ind].checked === true) {
      // Matching the input selected in the mokepon list and assigning it to my pet.
      mokeponList.forEach((mokepon) => {
        if (mokepon.name === inputPets[ind].id) {
          myPet = mokepon;
        };
      });

      spanPlayersPet.innerHTML = myPet.name;
      spanPlayersPet.innerHTML += `<img src=${myPet.picture} alt=${myPet.name} />`;
      startMap();
      setButtons(myPet.attack);

      petSection.style.display = "none";
      sectionShowMap.style.display = "flex";
      restartButton.style.display = "flex";

      myPet.x = randomNumber(0, map.width - myPet.width);
      myPet.y = randomNumber(0, map.height - myPet.height);

      window.onresize = function () {
        resizeCanvas();
      };
    } 
  }

  selectPlayersMokepon(myPet.name);

};
// Send the name to the backend
function selectPlayersMokepon(name) {
  fetch(`192.168.0.5:8080/mokepon/${playerId}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mokepon: name,
    }),
  });
}
// Drawing the canvas and the characters on the second screen.
function drawCanvas() {
  myPet.x = myPet.x + myPet.speedX;
  myPet.y = myPet.y + myPet.speedY;
  canvas.clearRect(0, 0, map.width, map.height);
  canvas.drawImage(backgroundMap, 0, 0, map.width, map.height);

  sendPosition(myPet.x, myPet.y);

  myPet.drawMokepon();

  mokeponListEnemys.forEach((mokepon) => {
    mokepon.drawMokepon();
    if(myPet.speedX !==0 || myPet.speedY !==0){
    checkCollision(mokepon);
    }
  });
};

const moveUp = () => {
  myPet.speedY = -10;
};

const moveLeft = () => {
  myPet.speedX = -10;
};

const moveDown = () => {
  myPet.speedY = 10;
};

const moveRight = () => {
  myPet.speedX = 10;
};

const stop = () => {
  myPet.speedX = 0;
  myPet.speedY = 0;
};

function keyPressed(event) {
  switch (event.key) {
    case "ArrowUp":
      moveUp();
      break;
      case "ArrowDown":
        moveDown();
        break;
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
      default:
        break;
  }
}

const startMap = () => {
  interval = setInterval(drawCanvas, 50);
  window.addEventListener("keydown", keyPressed);
  window.addEventListener("keyup", stop);
};
//After a collision we show the final screen for combat.
function checkCollision(enemy) {
  console.log('colision', enemy)
  const upPetEnemy = enemy.y;
  const downPetEnemy = enemy.y + enemy.height / 2;
  const leftPetEnemy = enemy.x;
  const rightPetEnemy = enemy.x + enemy.width / 2;
  
  const upPet = myPet.y;
  const downPet = myPet.y + myPet.height / 2;
  const leftPet = myPet.x;
  const rightPet = myPet.x + myPet.width / 2;

  if (
    downPet < upPetEnemy ||
    upPet > downPetEnemy ||
    rightPet < leftPetEnemy ||
    leftPet > rightPetEnemy
    ) {
      return;
    }
    stop();
    clearInterval(interval);
    enemyId = enemy.id
  sectionShowMap.style.display = "none";
  attackSection.style.display = "flex";
}
//Sending the position and assigning the character of the enemy.
function sendPosition(x, y) {
  fetch(`192.168.0.5:8080/mokepon/${playerId}/position`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      x,
      y,
    }),
  }).then(function (res) {
    //console.log(res);
    if (res.ok) {
      res.json().then(function ({ enemys }) {
        //here I assign the pet to my enemy to match the backend information
        let mokeponEnemy = null;
        mokeponListEnemys = enemys.map(function (enemy) {
          //console.log("elemento de enemys", enemy);
          mokeponList.forEach((a) => {
            if (a.name === enemy.mokepon.name) {
              mokeponEnemy = a;
            }
          });
          mokeponEnemy.x = enemy.x;
          mokeponEnemy.y = enemy.y;
          mokeponEnemy.id = enemy.id;
          console.log("mokeponEnemy", mokeponEnemy);
          return mokeponEnemy;
        });
        selectEnemyPet(mokeponListEnemys);
      });
    }
  });
}
//Setting the buttons according to the character's attacks and adding them to the html in the attack section.(third screen)
function setButtons(attack) {
  attack.forEach((element) => {
    attackOptions = `
    <button id=${element.id} class="attack-button">${element.name}</button>
    `;
    attacksContainer.innerHTML += attackOptions;
  });

  fireButton = document.getElementById("button-fire");
  waterButton = document.getElementById("button-water");
  earthButton = document.getElementById("button-earth");

  buttons = document.querySelectorAll(".attack-button");

  attackSequence();
}
//Filling an array with the attacks selected by the user.
function attackSequence() {
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (e.target.textContent === "🔥") {
        attackCounter.push("Fire");
        button.style.display = "none";
      } else if (e.target.textContent === "🌊") {
        attackCounter.push("Water");
        button.style.display = "none";
      } else {
        attackCounter.push("Earth");
        button.style.display = "none";
      }
      sendAttacks();
      //setEnemyAttack();
    });
  });
}
//Sending the selected attacks to the backend
function sendAttacks() {
  fetch(`192.168.0.5:8080/mokepon/${playerId}/attacks`, {
      method: "post",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
        attacks: attackCounter 
      }),   
  })

  interval = setInterval(getAttacks, 50)
}
// Getting the enemy attacks from the backend
function getAttacks() {
  fetch(`192.168.0.5:8080/mokepon/${enemyId}/attacks`)
    .then(function (res) {
      console.log('res', res)
        if(res.ok) {
          res.json()
            .then(function ({attacks}){
              enemyAttackCounter = attacks
              if (enemyAttackCounter.length > combatCounter){
                combate()
              }
              console.log('enemyAttackCounter',enemyAttackCounter)
            })
        }
    })
}
// Choosing a random pet for the enemy.(this was before i had my index.js file)
function selectEnemyPet(mokeponListEnemys) {
  console.log('mokeponListEnemys',mokeponListEnemys)
  mokeponListEnemys.forEach((mokepon) => {
    console.log('mokepon',mokepon)
    if(mokepon.id === enemyId){
      petEnemy = mokepon;
    }
  })
  spanEnemysPet.innerHTML = petEnemy.name;
  spanEnemysPet.innerHTML += `<img src=${petEnemy.picture} alt=${petEnemy.name} />`;
};

//Let the battle begin.
function combate() {
  clearInterval(interval);
  if (attackCounter[combatCounter] == enemyAttackCounter[combatCounter]) {
    result = "Empate";
  } else if (
    attackCounter[combatCounter] == "Fire" &&
    enemyAttackCounter[combatCounter] == "Earth"
  ) {
    result = "Ganaste 🎉";
    victoryCounter++;
  } else if (
    attackCounter[combatCounter] == "Water" &&
    enemyAttackCounter[combatCounter] == "Fire"
  ) {
    result = "Ganaste 🎉";
    victoryCounter++;
  } else if (
    attackCounter[combatCounter] == "Earth" &&
    enemyAttackCounter[combatCounter] == "Water"
  ) {
    result = "Ganaste 🎉";
    victoryCounter++;
  } else {
    result = "Perdiste 😢";
    lossCounter++;
  }
  createMessage();
  endGame();
  enemysLife.innerHTML = lossCounter;
  playersLife.innerHTML = victoryCounter;
  combatCounter++;
  console.log(`contador de batallas ${combatCounter}`);
}
function endGame() {
  if (enemyAttackCounter.length === myPet.attack.length ) {
    if (victoryCounter > lossCounter) {
    messageSecction.innerHTML = "🎉🎊YOU WON🎊🎉";
  } else {
    messageSecction.innerHTML = "😵🤷‍♀️YOU LOSE🤷‍♂️😵";
  }
}
}
function createMessage() {
  let newPlayerAttack = document.createElement("p");
  let newEnemyAttack = document.createElement("p");

  messageSecction.innerHTML = result;
  newPlayerAttack.innerHTML = attackCounter[combatCounter];
  newEnemyAttack.innerHTML = enemyAttackCounter[combatCounter];

  playerAttackMessage.appendChild(newPlayerAttack);
  enemyAttackMessage.appendChild(newEnemyAttack);
}
// here I try to make the app responsive.
function resizeCanvas() {
  let newScreenWidth = window.innerWidth;
  let newScreenHeight = window.innerHeight;
  map.width = newScreenWidth * 0.7;
  map.height = newScreenHeight * 0.6;
  
  myPet.width = map.width * 0.1;
  myPet.height = map.height * 0.1;
  
  petEnemy.width = myPet.width;
  petEnemy.height = myPet.height;
}
const restart = () => {
  document.location.reload();
};

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

window.addEventListener("load", startGame);

// Choosing a random attack sequence for my enemy without repeating.(this was before i had my index.js file)
/*let enemysAttack;
function setEnemyAttack() {
  let randomInd = randomNumber(0, newArray.length - 1);
  let randomAttack;

  if (newArray.length <= 1) {
    randomAttack = newArray[0];
  } else if (newArray.length > 1) {
    randomAttack = newArray[randomInd];
  }
  console.log(randomAttack);

  if (enemysAttack[randomAttack].name === "🔥") {
    enemyAttackCounter.push("Fire");
  } else if (enemysAttack[randomAttack].name === "🌊") {
    enemyAttackCounter.push("Water");
  } else if (enemysAttack[randomAttack].name === "🌱") {
    enemyAttackCounter.push("Earth");
  }
  newArray.splice(randomInd, 1);
  console.log(
    `ataques de jonathan ${attackCounter}`,
    `ataques del enemy ${enemyAttackCounter}`
  );
  combate();
};
*/