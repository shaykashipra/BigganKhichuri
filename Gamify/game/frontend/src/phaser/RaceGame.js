// import Phaser from 'phaser';

// export default class RaceGame extends Phaser.Scene {
//   constructor() {
//     super({ key: 'RaceGame' });
//     this.car = null;
//     this.path = null;
//     this.t = 0; // progress from 0.0 to 1.0
//     this.baseSpeed = 0.0005;
//     this.boostSpeed = 0.0025;
//     this.slowSpeed = 0.0002;
//     this.currentSpeed = 0;
//     this.countdownText = null;
//     this.countdown = 3;
//     this.started = false;

//     this.cpuCars = [];        // Array to hold CPU car objects
//     this.cpuProgress = [];    // Progress t (0 to 1) for each CPU
//     this.cpuSpeeds = [];  
//   }

//   preload() {
//      this.load.image('track', 'assets/track.png');
//   //  this.load.image('road', 'assets/road.png');
//     this.load.image('car', 'assets/car.png');
//      // optional background
//   }

//   create() {
//     // background
//     // this.add.image(400, 300, 'track').setScale(1).setDepth(-1);
//     this.add.image(0, 0, 'track').setOrigin(0).setScrollFactor(1);

//       // ✅ Add road background first
//     this.roadBG = this.add.tileSprite(0, 400, 3000, 200, 'road')
//         .setOrigin(0)
//         .setScrollFactor(1); 


//     this.path = new Phaser.Curves.Path(60, 360);
// this.path.splineTo([
//   new Phaser.Math.Vector2(130, 340),
//   new Phaser.Math.Vector2(160, 420),
//   new Phaser.Math.Vector2(200, 500),
//   new Phaser.Math.Vector2(260, 420),
//   new Phaser.Math.Vector2(340, 360),
//   new Phaser.Math.Vector2(420, 400),
//   new Phaser.Math.Vector2(500, 480),
//   new Phaser.Math.Vector2(580, 400),
//   new Phaser.Math.Vector2(660, 340),
//   new Phaser.Math.Vector2(740, 380),
//   new Phaser.Math.Vector2(820, 460),
//   new Phaser.Math.Vector2(900, 400),
//   new Phaser.Math.Vector2(980, 340),
//   new Phaser.Math.Vector2(1060, 380),
// ]);
 
//     // debug line
//     this.graphics = this.add.graphics();
//     this.graphics.lineStyle(2, 0xffffff, 1);
//     this.path.draw(this.graphics);

//     // car
//    // this.car = this.add.follower(this.path, 100, 500, 'car').setScale(0.2);
//     this.car = this.add.follower(this.path, 0, 400, 'car').setScale(0.2);


//     this.t = 0;

//     this.time.addEvent({
//     delay: 16, // roughly 60 FPS
//     loop: true,
//     callback: () => {
//         this.t += 1 / (60 * 60); // progress over ~60 seconds
//         if (this.t > 1) this.t = 1;

//         const point = this.path.getPoint(this.t);
//         const tangent = this.path.getTangent(this.t);
//         this.car.setPosition(point.x, point.y);
//         this.car.rotation = tangent.angle();
//     }
//     });


//     this.cameras.main.startFollow(this.car);
//     this.cameras.main.setLerp(0.1, 0.1);
//     this.cameras.main.setBounds(0, 0, 1200, 768); // Adjust to your full map size


//     // ✅ Add CPU cars just below the player car
//     for (let i = 0; i < 3; i++) {
//     const color = i === 0 ? 0xff0000 : i === 1 ? 0xffff00 : 0x00ffff;
//     const car = this.add.follower(this.path, 100, 500, 'car').setScale(0.2);
//     car.setTint(color); // give CPU cars unique colors
//     car.y += (i + 1) * 40; // stagger CPU cars vertically

//     this.cpuCars.push(car);
//     this.cpuProgress.push(0);
//     this.cpuSpeeds.push(this.baseSpeed * Phaser.Math.FloatBetween(0.9, 1.1));
//     }

//     // countdown
//     this.countdownText = this.add.text(400, 250, '', {
//       fontSize: '80px',
//       fill: '#ffffff',
//     }).setOrigin(0.5);

//     // start countdown
//     this.startCountdown();
//   }

//   startCountdown() {
//     this.countdownText.setText(this.countdown);
//     this.time.addEvent({
//       delay: 1000,
//       repeat: 3,
//       callback: () => {
//         this.countdown--;
//         if (this.countdown > 0) {
//           this.countdownText.setText(this.countdown);
//         } else {
//           this.countdownText.setText('Go!');
//           this.started = true;
//           this.currentSpeed = this.baseSpeed;
//           this.time.delayedCall(500, () => this.countdownText.setText(''), []);
//         }
//       },
//     });
//   }

// update() {
//   if (!this.started) return;

//   // 🚗 Player movement
//   this.t = Math.min(this.t + this.currentSpeed, 1);
//   const playerPoint = this.path.getPoint(this.t);
//   const playerTangent = this.path.getTangent(this.t);
//   if (playerPoint) {
//     this.car.setPosition(playerPoint.x, playerPoint.y);
//     this.car.rotation = playerTangent.angle();
//   }

//   // 🤖 CPU car movement
//   for (let i = 0; i < this.cpuCars.length; i++) {
//     this.cpuProgress[i] = Math.min(this.cpuProgress[i] + this.cpuSpeeds[i], 1);
//     const point = this.path.getPoint(this.cpuProgress[i]);
//     const tangent = this.path.getTangent(this.cpuProgress[i]);

//     if (point) {
//       this.cpuCars[i].setPosition(point.x, point.y + (i + 1) * 40); // offset CPU vertically
//       this.cpuCars[i].rotation = tangent.angle();
//     }
//   }
// }


//   // 🔥 Call this from outside on correct answer
//   boost() {
//     this.currentSpeed = this.boostSpeed;
//     this.time.delayedCall(800, () => {
//       this.currentSpeed = this.baseSpeed;
//     });
//   }

//   // ❌ Call this on wrong answer
//   slowDown() {
//     this.currentSpeed = this.slowSpeed;
//     this.time.delayedCall(800, () => {
//       this.currentSpeed = this.baseSpeed;
//     });
//   }
// }
import Phaser from 'phaser';

export default class RaceGame extends Phaser.Scene {
  constructor() {
    super({ key: 'RaceGame' });
    this.car = null;
    this.path = null;
    this.t = 0;
    this.baseSpeed = 0.0005;
    this.boostSpeed = 0.0005;
    this.slowSpeed = 0.0002;
    this.currentSpeed = 0;
    this.countdownText = null;
    this.countdown = 3;
    this.started = false;

    this.cpuCars = [];
    this.cpuProgress = [];
    this.cpuSpeeds = [];
    this.finishedCars = [];
    this.finishTimes = {};
    this.timer = 0;
    this.finishT = 0.90; // near end of path, tweak as needed
    this.finishedCars = [];


  }

  preload() {
    this.load.image('bg', 'assets/bg_grass.png');
    this.load.image('car', 'assets/car.png');
    this.load.image('lineBanner', 'assets/finish.png');
  }

  create() {
    // 🏞️ Grassy Background
    this.add.tileSprite(0, 0, 3000, 800, 'bg').setOrigin(0).setScrollFactor(0);

    // 🛣️ Define Path
    this.path = new Phaser.Curves.Path(100, 300);
    this.path.splineTo([
      new Phaser.Math.Vector2(300, 300),
      new Phaser.Math.Vector2(400, 250),
      new Phaser.Math.Vector2(600, 200),
      new Phaser.Math.Vector2(800, 300),
      new Phaser.Math.Vector2(1000, 250),
      new Phaser.Math.Vector2(1200, 300),
      new Phaser.Math.Vector2(1400, 350),
      new Phaser.Math.Vector2(1600, 300),
      new Phaser.Math.Vector2(1800, 300),
    ]);

    // 🏁 Start/Finish Banners
    const startPoint = this.path.getPoint(0);
    const endPoint = this.path.getPoint(1);

    this.add.image(startPoint.x, startPoint.y, 'lineBanner')
      .setOrigin(0.5)
      .setAngle(90)
      .setDisplaySize(200, 30)
      .setDepth(10); // under car

    this.add.image(endPoint.x, endPoint.y, 'lineBanner')
      .setOrigin(0.5)
      .setAngle(90)
      .setDisplaySize(200, 30)
      .setDepth(10);

    // 🧱 Draw road
    const road = this.add.graphics();
    road.lineStyle(200, 0x555555, 1);
    this.path.draw(road, 64);

    // 🟡 Center dashed line
    const dashed = this.add.graphics();
    dashed.lineStyle(10, 0xffffff, 1);
    this.path.draw(dashed, 64);

    // 🚗 Player Car
    this.car = this.add.follower(this.path, 0, 0, 'car')
      .setScale(0.18)
      .setTint(0xff0000)
      .setDepth(11); // 🟢 Car above banner
    this.car.laneOffset = -90;

    // 🤖 CPU Cars
    const cpuLaneOffsets = [-30, 30, 90];
    const cpuTints = [0x00ff00, 0x0000ff, 0xffff00];

    for (let i = 0; i < 3; i++) {
      const cpu = this.add.follower(this.path, 0, 0, 'car')
        .setScale(0.18)
        .setTint(cpuTints[i])
        .setDepth(11); // 🟢 Set same depth as player
      cpu.laneOffset = cpuLaneOffsets[i];
      this.cpuCars.push(cpu);
      this.cpuProgress.push(0);
      this.cpuSpeeds.push(this.baseSpeed * Phaser.Math.FloatBetween(0.7, 1.1));
    }

    // 🎥 Camera Follow
    this.cameras.main.startFollow(this.car);
    this.cameras.main.setLerp(0.1, 0.1);
    this.cameras.main.setZoom(1.5);
    this.cameras.main.setBounds(0, 0, 2000, 600);

    // ⏱️ Countdown
    this.countdownText = this.add.text(400, 250, '', {
      fontSize: '80px',
      fill: '#ffffff',
    }).setScrollFactor(0).setOrigin(0.5);

    this.startCountdown();
  }

  startCountdown() {
    this.countdownText.setText(this.countdown);
    this.time.addEvent({
      delay: 1000,
      repeat: 3,
      callback: () => {
        this.countdown--;
        if (this.countdown > 0) {
          this.countdownText.setText(this.countdown);
        } else {
          this.countdownText.setText('Go!');
          this.started = true;
          this.timer = 0; // ⏱ Start the race timer
          this.currentSpeed = this.baseSpeed;
          this.time.delayedCall(500, () => this.countdownText.setText(''), []);
        }
      },
    });
  }

    checkRaceOver() {
    if (this.finishedCars.length === this.cpuCars.length + 1) {
        console.log('🎉 All cars finished!');
        // TODO: call your result screen logic here
        // this.scene.start('ResultScene');
    }
    }

  update() {
    if (!this.started) return;
    this.timer += this.game.loop.delta; // ⏱ Add delta time in ms


    // 🚘 Player Car Movement
    this.t = Math.min(this.t + this.currentSpeed, 1);
    const point = this.path.getPoint(this.t);
    const tangent = this.path.getTangent(this.t);
    if (point && tangent) {
      const normal = new Phaser.Math.Vector2(-tangent.y, tangent.x).normalize();
      this.car.setPosition(point.x + normal.x * this.car.laneOffset, point.y + normal.y * this.car.laneOffset);
      this.car.rotation = tangent.angle();
    }
    if (this.t >= this.finishT && !this.finishedCars.includes('player')) {
    this.finishedCars.push('player');
    console.log('Player finished!');
    this.checkRaceOver();
    }


    // 🤖 CPU Car Movement
    for (let i = 0; i < this.cpuCars.length; i++) {
    if (this.cpuProgress[i] < 1) {
    this.cpuProgress[i] = Math.min(this.cpuProgress[i] + this.cpuSpeeds[i], 1);
    const p = this.path.getPoint(this.cpuProgress[i]);
    const t = this.path.getTangent(this.cpuProgress[i]);
    if (p && t) {
        const normal = new Phaser.Math.Vector2(-t.y, t.x).normalize();
        const car = this.cpuCars[i];
        car.setPosition(p.x + normal.x * car.laneOffset, p.y + normal.y * car.laneOffset);
        car.rotation = t.angle();
    }
        if (this.cpuProgress[i] >= this.finishT && !this.finishedCars.includes(`cpu${i}`)) {
        this.finishedCars.push(`cpu${i}`);
        console.log(`CPU ${i + 1} finished!`);
        this.checkRaceOver();
        }

    const name = `CPU${i + 1}`;
    if (this.cpuProgress[i] >= 1 && !this.finishedCars.includes(name)) {
        this.finishedCars.push(name);
        this.finishTimes[name] = this.timer;
        this.showResultIfAllFinished();
    }
    }

    }
  }

  showResultIfAllFinished() {
  if (this.finishedCars.length === 4) {
    this.started = false;

    const sorted = [...this.finishedCars].sort((a, b) => this.finishTimes[a] - this.finishTimes[b]);

    const text = sorted.map((name, i) => {
      const timeSec = (this.finishTimes[name] / 1000).toFixed(2);
      return `${i + 1}. ${name} - ${timeSec} sec`;
    }).join('\n');

    this.add.rectangle(400, 300, 500, 300, 0x000000, 0.8).setScrollFactor(0).setOrigin(0.5);
    this.add.text(400, 220, '🏁 Race Results 🏁', { fontSize: '32px', fill: '#ffffff' })
      .setScrollFactor(0).setOrigin(0.5);
    this.add.text(400, 300, text, { fontSize: '28px', fill: '#ffffff', align: 'center' })
      .setScrollFactor(0).setOrigin(0.5);
  }
}


  boost() {
    this.currentSpeed = this.boostSpeed;
    this.time.delayedCall(800, () => {
      this.currentSpeed = this.baseSpeed;
    });
  }

  slowDown() {
    this.currentSpeed = this.slowSpeed;
    this.time.delayedCall(800, () => {
      this.currentSpeed = this.baseSpeed;
    });
  }
}
