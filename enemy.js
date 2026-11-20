
// 敵：作る・入れる・動かす・描く

// ① 作る：敵を1体作って返す関数
function createEnemy(x, vx, type = "normal") {
  return {
    x: x,
    y: floor.y - 32,
    w: 32,
    h: 32,
    vx: vx,
    alive: true,
    type: type,
    hp: type === "hard" ? 2 : 1
  };
}

// ② 入れる：敵をまとめて入れる配列
let enemies = [];

enemies.push(createEnemy(200, 80));
enemies.push(createEnemy(380, -120));
enemies.push(createEnemy(540, 60));

// 硬い敵を追加
enemies.push(createEnemy(580, 100, "hard"));

// ③ 動かす：配列の敵を1体ずつ取り出して動かす
function updateEnemies(dt) {
  for (const enemy of enemies) {

    enemy.x = enemy.x + enemy.vx * dt;

    // 画面の端で跳ね返る
    if (enemy.x < 0) {
      enemy.x = 0;
      enemy.vx = -enemy.vx;
    }

    if (enemy.x + enemy.w > canvas.width) {
      enemy.x = canvas.width - enemy.w;
      enemy.vx = -enemy.vx;
    }
  }
}

// プレイヤーとぶつかったとき
function collideWithEnemies(prevBottom) {
  for (const enemy of enemies) {

    if (
      aabb(player, enemy) &&
      prevBottom <= enemy.y &&
      player.vy > 0
    ) {

      // 硬い敵の場合
      if (enemy.type === "hard") {

        // 体力を1減らす
        enemy.hp--;

        // 体力が0になったら倒す
        if (enemy.hp <= 0) {
          enemy.alive = false;
        }
      }

      // 普通の敵の場合
      else {
        enemy.alive = false;
      }

      // 踏んだ位置を敵の上に合わせる
      player.y = enemy.y - player.h;

      // 踏んだら少し跳ねる
      player.vy = -JUMP_SPEED / 2;
      player.isGrounded = false;
    }
  }

  // 生きている敵だけを残す
  enemies = enemies.filter((enemy) => enemy.alive);
}

// ④ 描く：配列の敵を1体ずつ取り出して描く
function drawEnemies() {

  for (const enemy of enemies) {

    // 普通の敵
    if (enemy.type === "normal") {
      ctx.fillStyle = "#ff6b6b";
    }

    // 硬い敵：体力によって色を変える
    if (enemy.type === "hard") {

      if (enemy.hp === 2) {
        ctx.fillStyle = "#4169e1";
      }
      else {
        ctx.fillStyle = "#9370db";
      }
    }

    ctx.fillRect(
      enemy.x,
      enemy.y,
      enemy.w,
      enemy.h
    );
  }

  ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";
  ctx.fillText("敵 = " + enemies.length, 10, 40);
}