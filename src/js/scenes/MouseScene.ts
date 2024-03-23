//Variáveis da estrutura
let listOfConnections = {};
let initial;
let objective;
let le = [];
let lne = [];
let bss = [];
let ec;
let ecChilds = [];
var listOfAllLe = [];

//Variáveis de plotagem na tela
let map = {
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3,
    "E": 4,
    "F": 5,
    "G": 6,
    "H": 7,
    "I": 8,
    "J": 9
}
var listOfPositions = [
    new Phaser.Math.Vector2(400, 60),
    new Phaser.Math.Vector2(150, 200),
    new Phaser.Math.Vector2(430, 200),
    new Phaser.Math.Vector2(630, 200),
    new Phaser.Math.Vector2(100, 360),
    new Phaser.Math.Vector2(330, 360),
    new Phaser.Math.Vector2(530, 360),
    new Phaser.Math.Vector2(100, 520),
    new Phaser.Math.Vector2(230, 520),
    new Phaser.Math.Vector2(430, 520)
]
var listOfLines = [];


export default class MouseScene extends Phaser.Scene {

    private mouse;
    private cheese;
     
    public preload() {

        //Carregando imagens
        this.load.image('rato', '../../assets/images/zrato.png');
        this.load.image('queijo', '../../assets/images/zqueijo.png');
        this.load.image('A', '../../assets/images/zA.png');
        this.load.image('B', '../../assets/images/zB.png');
        this.load.image('C', '../../assets/images/zC.png');
        this.load.image('D', '../../assets/images/zD.png');
        this.load.image('E', '../../assets/images/zE.png');
        this.load.image('F', '../../assets/images/zF.png');
        this.load.image('G', '../../assets/images/zG.png');
        this.load.image('H', '../../assets/images/zH.png');
        this.load.image('I', '../../assets/images/zI.png');
        this.load.image('J', '../../assets/images/zJ.png');

    }

    public create() {

        //Adicionando images na tel
        this.add.image(listOfPositions[0].x, listOfPositions[0].y, 'A').setScale(0.1).setDepth(1);
        this.add.image(listOfPositions[1].x, listOfPositions[1].y, 'B').setScale(0.1).setDepth(1);
        this.add.image(listOfPositions[2].x, listOfPositions[2].y, 'C').setScale(0.1).setDepth(1);
        this.add.image(listOfPositions[3].x, listOfPositions[3].y, 'D').setScale(0.1).setDepth(1);
        this.add.image(listOfPositions[4].x, listOfPositions[4].y, 'E').setScale(0.1).setDepth(1);
        this.add.image(listOfPositions[5].x, listOfPositions[5].y, 'F').setScale(0.1).setDepth(1);
        this.add.image(listOfPositions[6].x, listOfPositions[6].y, 'G').setScale(0.1).setDepth(1);
        this.add.image(listOfPositions[7].x, listOfPositions[7].y, 'H').setScale(0.1).setDepth(1);
        this.add.image(listOfPositions[8].x, listOfPositions[8].y, 'I').setScale(0.1).setDepth(1);
        this.add.image(listOfPositions[9].x, listOfPositions[9].y, 'J').setScale(0.1).setDepth(1);

        this.cheese = this.add.image(530, 360, 'queijo').setScale(0.2).setDepth(1);
        this.mouse = this.add.image(listOfPositions[0].x, listOfPositions[0].y, 'rato').setScale(0.2).setDepth(1);


        this.setInitial("A");
        this.setObjective("G");

        this.addEdge("A", "D");
        this.addEdge("A", "C");
        this.addEdge("A", "B");
        this.addEdge("B", "F");
        this.addEdge("B", "E");
        this.addEdge("E", "I");
        this.addEdge("E", "H");
        this.addEdge("F", "J");
        this.addEdge("C", "G");
        this.addEdge("C", "F");

        this.findPath();

        this.time.addEvent({ delay: 2000, callback: this.startGame, callbackScope: this, loop: false });

    }


    //Movimentação do rato
    startGame() {
        let delay = 0; 
        
        for (let i = 0; i <= listOfAllLe.length - 1; i++) {
            let currentle = listOfAllLe[i];
            let mouseIndex = map[currentle[currentle.length - 1]];
    
            
            this.tweens.add({
                targets: [this.mouse],
                props: {
                    x: { value: listOfPositions[mouseIndex].x, duration: 1000, ease: 'Linear' },
                    y: { value: listOfPositions[mouseIndex].y, duration: 1000, ease: 'Linear' }
                },
                delay: delay, 
                
            });
            delay += 1000; 
        }
    }
    

    addEdge(origin, destiny) {
        if (!listOfConnections[origin]) {
            listOfConnections[origin] = [];
        }
        listOfConnections[origin].push(destiny);

        //chamar função de criar linha na tela
        let originIndex = map[origin];
        let destinyIndex = map[destiny]
        listOfLines.push(this.drawLine(listOfPositions[originIndex], listOfPositions[destinyIndex], 0xFFFFFF))
        return;
    }

    //desenhar linhas das conexões na tela
    drawLine(this, point1, point2, color) {
        
        var graphics = this.add.graphics();

        
        graphics.lineStyle(12, color);

        
        graphics.beginPath();
        graphics.moveTo(point1.x, point1.y);
        graphics.lineTo(point2.x, point2.y);
        graphics.strokePath();

        return graphics;
    }


    setInitial(value) {
        initial = value;
        
        //setar o rato na posição definida como initial na tela
        this.mouse.x = listOfPositions[map[initial]].x
        this.mouse.y = listOfPositions[map[initial]].y
        return;
    }

    setObjective(value) {
        objective = value

        //setar o queijo na posição definida como objective na tela
        this.cheese.x = listOfPositions[map[objective]].x
        this.cheese.y = listOfPositions[map[objective]].y
        return;
    }

    getChilds(vertex) {
        return listOfConnections[vertex];
    }

    excludeChildsIsInLNE(childs) {
        return childs.filter(function (e) {
            return !lne.includes(e)
        });
    }

    excludeChildsIsInLE(childs) {
        return childs.filter(function (e) {
            return !le.includes(e)
        });
    }

    excludeChildsIsInBSS(childs) {
        return childs.filter(function (e) {
            return !bss.includes(e)
        });
    }


    findPath() {
        le.push(initial);
        lne.push(initial);
        ec = initial;
        while (lne.length > 0) {
            if (ec == objective) {
                return le;
            }
            ecChilds = this.getChilds(ec);

            if (ecChilds) {
                ecChilds = this.excludeChildsIsInLNE(ecChilds) || [];
                ecChilds = this.excludeChildsIsInLE(ecChilds) || [];
                ecChilds = this.excludeChildsIsInBSS(ecChilds) || [];
            } else {
                ecChilds = [];
            }

            if (ecChilds.length == 0) {
                while (le.length > 0 && ec == le[le.length - 1]) {
                    bss.push(ec);
                    le.pop();
                    lne.pop();
                    ec = lne[lne.length - 1];
                    listOfAllLe.push([...le]);
                }
                le.push(ec);
                listOfAllLe.push([...le]);
            } else {
                lne.push(...ecChilds);
                ec = lne[lne.length - 1];
                le.push(ec);
                listOfAllLe.push([...le]);
            }

        }
        return this.scene.pause();
    }

}