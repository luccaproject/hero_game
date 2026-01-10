const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let fomesText;
let fome = 100;

function preload() {
    // Criando o jogador (quadrado azul)
    const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    playerGraphics.fillStyle(0x3498db); // Azul
    playerGraphics.fillRect(0, 0, 32, 32);
    playerGraphics.generateTexture('playerTex', 32, 32);

    // Criando a comida (círculo verde)
    const foodGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    foodGraphics.fillStyle(0x2ecc71); // Verde
    foodGraphics.fillCircle(8, 8, 8);
    foodGraphics.generateTexture('foodTex', 16, 16);
}

function create() {
    // Jogador
    player = this.physics.add.sprite(400, 300, 'playerTex');
    player.setCollideWorldBounds(true);

    // Itens de comida
    const alimentos = this.physics.add.group({
        key: 'itemTex',
        repeat: 5,
        setXY: { x: 100, y: 100, stepX: 120 }
    });

    // Teclado
    cursors = this.input.keyboard.createCursorKeys();

    // Texto de Status
    fomesText = this.add.text(16, 16, 'Fome: 100', { fontSize: '24px', fill: '#fff' });

    // Coleta de comida
    this.physics.add.overlap(player, alimentos, (p, alimento) => {
        alimento.disableBody(true, true);
        fome = Math.min(fome + 20, 100);
    }, null, this);

    // Evento de tempo: Fome diminui a cada 2 segundos
    this.time.addEvent({
        delay: 2000,
        callback: () => { if(fome > 0) fome -= 5; },
        loop: true
    });
}

function update() {
    const speed = 200;
    player.setVelocity(0);

    // Movimentação 8 direções (Soul Knight)
    if (cursors.left.isDown) player.setVelocityX(-speed);
    else if (cursors.right.isDown) player.setVelocityX(speed);
    
    if (cursors.up.isDown) player.setVelocityY(-speed);
    else if (cursors.down.isDown) player.setVelocityY(speed);

    // Normaliza velocidade diagonal
    player.body.velocity.normalize().scale(speed);

    // Atualiza texto e checa derrota
    fomesText.setText('Fome: ' + fome);
    if (fome <= 0) {
        this.physics.pause();
        fomesText.setText('VOCÊ MORREU DE FOME!');
    }
}