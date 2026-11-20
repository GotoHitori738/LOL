// プレイヤー：決まった数・今の値・キー・動き・描き方

const GRAVITY = 2000;
const JUMP_SPEED = 700;
const MOVE_SPEED = 240;
const MAX_JUMPS = 2;
const FALL_GRAVITY_RATE = 2;

const player = {
  x: 80,
  y: 20,
  w: 32,
  h: 32,
  vx: 0,
  vy: 0,
  isGrounded: false,
  jumpsLeft: MAX_JUMPS,
  state: "idle",
  frameIndex: 0,
  frameTimer: 0,
  facing: 1
};

// コマを並べた画像（1コマ 32×32）
const playerImg = new Image();
playerImg.src = "7-3_bird.png";

const FRAME_SIZE = 32;
const FRAME_TIME = 0.12;

// 状態ごとの画像の段とコマ数
const ANIMS = {
  idle: { row: 0, count: 2 },
  run:  { row: 1, count: 4 },
  jump: { row: 2, count: 2 },
  fall: { row: 3, count: 2 }
};

const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;

  if (e.code === "Space") {
    e.preventDefault();

    if (player.jumpsLeft > 0) {
      player.vy = -JUMP_SPEED;
      player.jumpsLeft--;
      player.isGrounded = false;
    }
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// 床との衝突判定
function collideWithFloor() {
  if (player.y + player.h > floor.y) {
    player.y = floor.y - player.h;
    player.vy = 0;
    player.isGrounded = true;
    player.jumpsLeft = MAX_JUMPS;
  } else {
    player.isGrounded = false;
  }
}

// プレイヤーの状態を決める関数
function decideState() {
  if (!player.isGrounded) {
    if (player.vy < 0) {
      return "jump";
    } else {
      return "fall";
    }
  }

  if (player.vx !== 0) {
    return "run";
  }

  return "idle";
}

// プレイヤーを動かす
function updatePlayer(dt) {

  // 横の速さをキーで決める
  player.vx = 0;

  if (keys["ArrowRight"]) {
    player.vx = MOVE_SPEED;
  }

  if (keys["ArrowLeft"]) {
    player.vx = -MOVE_SPEED;
  }

  player.x = player.x + player.vx * dt;

  // 向きを決める
  if (player.vx > 0) {
    player.facing = 1;
  }

  if (player.vx < 0) {
    player.facing = -1;
  }

  // 重力
  const g = player.vy > 0
    ? GRAVITY * FALL_GRAVITY_RATE
    : GRAVITY;

  player.vy = player.vy + g * dt;
  player.y = player.y + player.vy * dt;

  collideWithFloor();

  // 現在の状態を決める
  const newState = decideState();

  if (newState !== player.state) {
    player.state = newState;
    player.frameIndex = 0;
    player.frameTimer = 0;
  }

  // コマ送り
  player.frameTimer = player.frameTimer + dt;

  if (player.frameTimer >= FRAME_TIME) {
    player.frameIndex =
      (player.frameIndex + 1) % ANIMS[player.state].count;

    player.frameTimer = 0;
  }
}

// プレイヤーを描く
function drawPlayer() {

  const sx = player.frameIndex * FRAME_SIZE;
  const sy = ANIMS[player.state].row * FRAME_SIZE;

  ctx.save();

  ctx.translate(
    player.x + player.w / 2,
    player.y + player.h / 2
  );

  ctx.scale(player.facing, 1);

  // 画像が読み込まれている場合は画像を描く
  if (playerImg.complete && playerImg.naturalWidth > 0) {
    ctx.drawImage(
      playerImg,
      sx, sy,
      FRAME_SIZE, FRAME_SIZE,
      -player.w / 2,
      -player.h / 2,
      player.w,
      player.h
    );
  } else {
    // 画像がない場合は四角で表示する
    ctx.fillStyle = "#66ccff";
    ctx.fillRect(
      -player.w / 2,
      -player.h / 2,
      player.w,
      player.h
    );
  }

  ctx.restore();

  ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";

  ctx.fillText(
    "vy = " + player.vy.toFixed(0) +
    " jumpsLeft = " + player.jumpsLeft +
    " state = " + player.state +
    " frameIndex = " + player.frameIndex,
    10, 20
  );
}