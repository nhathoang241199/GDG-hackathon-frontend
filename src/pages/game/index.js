import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import { useSnackbar } from "notistack";
import BigNumber from "big-number";

import { connect } from "../../redux/blockchain/blockchainActions";

function Game() {
  const dispatch = useDispatch();
  const gameRef = useRef(null);
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const { point = 0, balanceOffChain = "0" } = data || {};
  const [initialize, setInitialize] = useState(true);

  const { enqueueSnackbar } = useSnackbar();

  const handleNotify = (mess, type) => {
    enqueueSnackbar(mess, { variant: type });
  };

  if (blockchain.errorMsg) {
    handleNotify(blockchain.errorMsg, "error");
  }

  let platform;
  let player;
  let cursors;
  let score = 0;
  let scoreText;
  let coin;
  let anims;
  let water;
  let gameOverImage;
  let yesImage;
  let noImage;
  let clearImage;

  async function collectCoin(player, coin) {
    coin.disableBody(true, true);
    score += 10;
    if (score === 100) {
      const data = {
        balance: new BigNumber(score * 10 ** 18)
          .plus(new BigNumber(balanceOffChain))
          .toString(),
        point: score + point,
      };

      await fetch(
        `https://learned-vehicle-330115.df.r.appspot.com/user/${blockchain?.account}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
    }
  }

  function createCoin(coin) {
    coin.play(anims);
  }

  function createPlatform(thus) {
    platform = thus.physics.add.staticGroup();
    platform.create(57, 129, "ground1");
    platform.create(170, 410, "ground2");
    platform.create(398, 440, "ground3");
    platform.create(830, 440, "ground4");
    platform.create(830, 280, "ground5");
    platform.create(557, 280, "ground6");
    platform.create(638, 131, "ground7");
    platform.create(344, 199, "ground8");
  }

  function createPlayer(thus) {
    player = thus.physics.add.sprite(100, 295, "character");
    player.setCollideWorldBounds(true);
    thus.physics.add.collider(player, platform);

    // Handle move
    cursors = thus.input.keyboard.createCursorKeys();

    // Animation for character
    thus.anims.create({
      key: "left",
      frames: thus.anims.generateFrameNumbers("character", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    thus.anims.create({
      key: "turn",
      frames: [{ key: "character", frame: 3 }],
      frameRate: 20,
    });
    thus.anims.create({
      key: "right",
      frames: thus.anims.generateFrameNumbers("character", {
        start: 4,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  function createCoins(thus) {
    coin = thus.physics.add.staticGroup();
    thus.anims.create({
      key: "rotate",
      frames: thus.anims.generateFrameNames("coin", {
        prefix: "coin_",
        end: 5,
        zeroPad: 4,
      }),
      repeat: -1,
    });
    anims = "rotate";
    coin.create(60, 45, "coin");
    coin.create(320, 150, "coin");
    coin.create(620, 80, "coin");
    coin.create(880, 100, "coin");
    coin.create(850, 200, "coin");
    coin.create(580, 220, "coin");
    coin.create(410, 350, "coin");
    coin.create(300, 300, "coin");
    coin.create(900, 350, "coin");
    coin.create(200, 15, "coin");
    coin.children.iterate(createCoin, thus);
    thus.physics.add.collider(coin, platform);
    thus.physics.add.overlap(player, coin, collectCoin, null, thus);
  }

  function setGamerWinner(thus) {
    thus.physics.pause();
    clearImage.visible = true;
    yesImage.visible = true;
    noImage.visible = true;
    // scoreTextOver.visible = true;
  }

  async function setGameOver(player, water) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOverImage.visible = true;
    yesImage.visible = true;
    noImage.visible = true;
    // scoreTextOver.visible = true;

    const data = {
      balance: new BigNumber(balanceOffChain)
        .minus(new BigNumber(10 * 10 ** 18))
        .toString(),
      point: score + point,
    };

    await fetch(
      `https://learned-vehicle-330115.df.r.appspot.com/user/${blockchain?.account}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  }

  function createWater(thus) {
    water = thus.physics.add.staticGroup();
    water.create(558, 457, "water");
    thus.physics.add.collider(player, water, setGameOver, null, thus);
  }

  function hideGameOver() {
    gameOverImage.visible = false;
    clearImage.visible = false;
    yesImage.visible = false;
    noImage.visible = false;
    // scoreTextOver.visible = false;
  }

  function restartGame(thus) {
    thus.registry.destroy();
    thus.events.off();
    thus.scene.restart();
    score = 0;
    hideGameOver();
  }

  function createGameOver(thus) {
    gameOverImage = thus.add.image(500, 200, "gameover");
    clearImage = thus.add.image(500, 180, "youWin");
    yesImage = thus.add.image(420, 360, "yes");
    noImage = thus.add.image(590, 360, "no");
    // scoreTextOver = thus.add.text(420, 200, "SCORE: 0", {
    //   fontSize: "32px",
    //   fill: "#fff",
    // });
    yesImage.setInteractive();
    yesImage.on("pointerdown", () => restartGame(thus));
    noImage.setInteractive();
    noImage.on("pointerdown", () => hideGameOver());

    gameOverImage.visible = false;
    clearImage.visible = false;
    yesImage.visible = false;
    noImage.visible = false;
    // scoreTextOver.visible = false;
  }

  function createSignIn(thus) {
    // logoGameText = thus.add.image(500, 200, "logo");
    // signInGameButton = thus.add.image(500, 300, "signIn");
  }

  const game = {
    width: 1000,
    height: 496,
    type: Phaser.AUTO,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 300 },
        debug: false,
      },
    },
    scene: {
      preload: function () {
        this.load.image("background", "assets/BG/BG1.jpg");
        this.load.image("ground1", "assets/Object/ground1.png");
        this.load.image("ground2", "assets/Object/ground2.png");
        this.load.image("ground3", "assets/Object/ground3.png");
        this.load.image("ground4", "assets/Object/ground4.png");
        this.load.image("ground5", "assets/Object/ground5.png");
        this.load.image("ground6", "assets/Object/ground6.png");
        this.load.image("ground7", "assets/Object/ground7.png");
        this.load.image("ground8", "assets/Object/ground8.png");
        this.load.image("stone", "assets/Object/Stone.png");
        this.load.image("water", "assets/Object/water.png");
        this.load.spritesheet("character", "assets/Object/character.png", {
          frameWidth: 27,
          frameHeight: 32,
        });
        this.load.atlas(
          "coin",
          "assets/Object/coin.png",
          "assets/Object/coin.json"
        );
        this.load.image("gameover", "assets/Object/game-over.png");
        this.load.image("tryagain", "assets/Object/tryagain.png");
        this.load.image("yes", "assets/Object/yes.png");
        this.load.image("no", "assets/Object/no.png");
        this.load.image("youWin", "assets/Object/you-win.png");
      },
      create: function () {
        this.add.image(500, 248, "background");
        // createModals();
        // reg.modal = new gameModal(game);

        createPlatform(this);
        createPlayer(this);
        createWater(this);
        createCoins(this);
        createGameOver(this);
        createSignIn(this);

        // Score text
        scoreText = this.add.text(850, 20, "SCORE: 0", {
          fontSize: "24px",
          fill: "#fff",
        });
      },
      update: function () {
        if (cursors.left.isDown) {
          player.setVelocityX(-160);
          player.anims.play("left", true);
        } else if (cursors.right.isDown) {
          player.setVelocityX(160);
          player.anims.play("right", true);
        } else {
          player.setVelocityX(0);
          player.anims.play("turn");
        }

        if (cursors.up.isDown && player.body.touching.down) {
          player.setVelocityY(-300);
        }
        this.physics.add.collider(player, coin, setGameOver, null, this);

        scoreText.setText("SCORE: " + score);
        // scoreTextOver.setText("SCORE: " + score);

        if (score === 100) {
          setGamerWinner(this);
        }
      },
    },
  };

  useEffect(() => {
    if (blockchain?.account) {
      if (gameRef.current) {
        gameRef.current.destroy();
      }
      setInitialize(true);
    }
  }, [blockchain?.account]);

  const onConnectWallet = async () => {
    dispatch(connect());
  };

  return (
    <div className="game-container">
      <div className="ion-phaser">
        {!blockchain?.account ? (
          <div className="game-bg">
            <img
              src="assets/BG/game-bg.png"
              alt="sign in"
              className="game-img-bg"
            />
            <img
              src="assets/BG/logo-game.png"
              alt="logo game"
              style={{ position: "relative" }}
            />
            <img
              src="assets/BG/connect-wallet.png"
              alt="sign in"
              style={{
                position: "relative",
                marginTop: 50,
                cursor: "pointer",
              }}
              onClick={onConnectWallet}
            />
          </div>
        ) : (
          <IonPhaser ref={gameRef} game={game} initialize={initialize} />
        )}
      </div>
    </div>
  );
}

export default Game;
