# RPG
class Character {
    constructor(name, charClass) {
        this.name = name;
        this.charClass = charClass;
        this.level = 1;
        this.hp = 100;
        this.mp = 50;
        this.attack = 10;
        this.defense = 5;
        this.xp = 0;
        this.gold = 0;
        this.inventory = [];
    }

    levelUp() {
        this.level++;
        this.hp += 20;
        this.mp += 10;
        this.attack += 5;
        this.defense += 3;
        this.xp = 0;
        console.log(`Você subiu de nível! Você agora está no nível ${this.level}.`);
    }
}

class Enemy {
    constructor(name, hp, attack, defense, xpReward, goldReward) {
        this.name = name;
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.xpReward = xpReward;
        this.goldReward = goldReward;
    }
}

let classes = ["Guerreiro", "Mago", "Ladino"];
let enemies = [
    new Enemy("Goblin", 30, 10, 2, 10, 5),
    new Enemy("Orc", 50, 15, 4, 20, 10),
    new Enemy("Troll", 80, 20, 6, 30, 15),
    new Enemy("Dragão", 200, 50, 10, 50, 25),
];
let shopItems = [
    { name: "Poção de Saúde", price: 10, effect: (player) => player.hp = Math.min(player.hp + 50, 100) },
    { name: "Poção de Mana", price: 15, effect: (player) => player.mp = Math.min(player.mp + 30, 50) },
];
let finalBoss = new Enemy("Dark Lord", 500, 60, 20, 100, 50);

function createCharacter() {
    let name = prompt("Digite o nome do seu personagem:");
    let charClass = prompt(`Escolha uma classe: ${classes.join(", ")}`);
    while (!classes.includes(charClass)) {
        charClass = prompt(`Classe inválida. Escolha uma classe: ${classes.join(", ")}`);
    }
    return new Character(name, charClass);
}

function explore() {
    let encounter = Math.random() > 0.5 ? "enemy" : "nothing";
    if (encounter === "enemy") {
        console.log("Você encontrou um inimigo!");
        battle();
    } else {
        console.log("Você não encontrou nada.");
    }
}

function rest() {
    player.hp = 100;
    player.mp = 50;
    console.log("Você descansa e recupera sua saúde e mana.");
}

function showInventory() {
    console.log("Seu inventário:", player.inventory.map(item => item.name).join(", "));
    let action = prompt("Você quer usar um item? (sim/não)");
    if (action === "sim") {
        let itemName = prompt("Digite o nome do item:");
        let item = player.inventory.find(item => item.name === itemName);
        if (item) {
            item.effect(player);
            player.inventory = player.inventory.filter(i => i !== item);
            console.log(`Você usou uma ${itemName}.`);
        } else {
            console.log("Item não encontrado no inventário.");
        }
    }
}

function shop() {
    let itemList = shopItems.map(item => `${item.name} - ${item.price} ouro`).join("\n");
    let purchase = prompt(`Bem-vindo à loja! O que você gostaria de comprar?\n${itemList}`);
    let item = shopItems.find(item => item.name === purchase);
    if (item) {
        if (player.gold >= item.price) {
            player.gold -= item.price;
            player.inventory.push(item);
            console.log(`Você comprou uma ${item.name}.`);
        } else {
            console.log("Você não tem ouro suficiente.");
        }
    } else {
        console.log("Item não encontrado.");
    }
}

function showAttributes() {
    console.log(`Nome: ${player.name}`);
    console.log(`Classe: ${player.charClass}`);
    console.log(`Level: ${player.level}`);
    console.log(`HP: ${player.hp}`);
    console.log(`MP: ${player.mp}`);
    console.log(`Ataque: ${player.attack}`);
    console.log(`Defesa: ${player.defense}`);
    console.log(`XP: ${player.xp}`);
    console.log(`Ouro: ${player.gold}`);
    console.log("Inventário:", player.inventory.map(item => item.name).join(", "));
}

function gainXP(amount) {
    player.xp += amount;
    if (player.xp >= player.level * 20) {
        player.levelUp();
    }
}

function battle() {
    let enemy = enemies[Math.floor(Math.random() * enemies.length)];
    console.log(`Você está lutando contra um ${enemy.name}.`);
    while (enemy.hp > 0 && player.hp > 0) {
        let action = prompt("Escolha uma ação: atacar, correr");
        if (action === "atacar") {
            let playerDamage = Math.max(player.attack - enemy.defense, 1);
            enemy.hp -= playerDamage;
            console.log(`Você causou ${playerDamage} de dano ao ${enemy.name}.`);
            if (enemy.hp > 0) {
                let enemyDamage = Math.max(enemy.attack - player.defense, 1);
                player.hp -= enemyDamage;
                console.log(`O ${enemy.name} causou ${enemyDamage} de dano a você.`);
            }
        } else if (action === "correr") {
            console.log("Você fugiu.");
            return;
        }
    }
    if (player.hp <= 0) {
        console.log("Você morreu.");
    } else if (enemy.hp <= 0) {
        console.log(`Você derrotou ${enemy.name}.`);
        gainXP(enemy.xpReward);
        player.gold += enemy.goldReward;
        console.log(`Você ganhou ${enemy.xpReward} XP e ${enemy.goldReward} ouro.`);
    }
}

function canBattleFinalBoss() {
    return player.level >= 5;
}

function battleFinalBoss() {
    if (!canBattleFinalBoss()) {
        console.log("Você não é forte o suficiente para enfrentar o chefe final. Suba de nível mais para ter uma chance.");
        return;
    }

    console.log("Você está enfrentando o chefe final, o Dark Lord!");
    while (finalBoss.hp > 0 && player.hp > 0) {
        let action = prompt("Escolha uma ação: atacar, correr");
        if (action === "atacar") {
            let playerDamage = Math.max(player.attack - finalBoss.defense, 1);
            finalBoss.hp -= playerDamage;
            console.log(`Você causou ${playerDamage} de dano ao Dark Lord.`);
            if (finalBoss.hp > 0) {
                let enemyDamage = Math.max(finalBoss.attack - player.defense, 1);
                player.hp -= enemyDamage;
                console.log(`O Dark Lord causou ${enemyDamage} de dano a você.`);
            }
        } else if (action === "correr") {
            console.log("Você não pode fugir do chefe final!");
        }
    }
    if (player.hp <= 0) {
        console.log("Você morreu. O Dark Lord venceu.");
    } else if (finalBoss.hp <= 0) {
        console.log("Você derrotou o Dark Lord! Você é vitorioso!");
    }
}

function mainMenu() {
    let action = prompt("Escolha uma ação: explorar, descansar, inventário, atributos, loja, chefe final, sair");
    while (action !== "sair") {
        switch (action) {
            case "explorar":
                explore();
                break;
            case "descansar":
                rest();
                break;
            case "inventário":
                showInventory();
                break;
            case "atributos":
                showAttributes();
                break;
            case "loja":
                shop();
                break;
            case "chefe final":
                battleFinalBoss();
                break;
            default:
                console.log("Ação inválida.");
        }
        action = prompt("Escolha uma ação: explorar, descansar, inventário, atributos, loja, chefe final, sair");
    }
}

let player = createCharacter();
mainMenu();
