window.onload = function() {
  var canvas = document.getElementById('gameCanvas');
  var ctx = canvas.getContext('2d');

  var gameWidth = canvas.width = window.innerWidth;
  var gameHeight = canvas.height = window.innerHeight;

  var base = { x: gameWidth / 2, y: gameHeight, size: 30 };
  var cannon = { x: base.x, y: base.y - 30, width: 5, height: 20 };
  var cannonBullets = [];
  var asteroids = [];
  var score = 0;
  var gameOver = false;
  var lastTime = 0;
  var asteroidSpawnRate = 2000;
  var lastAsteroidTime = 0;
  var asteroidSpeed = 1;

  function spawnAsteroid() {
    var size = Math.random() * 20 + 10;
    var x = Math.random() * (gameWidth - size);
    var y = -size;
    asteroids.push({ x: x, y: y, size: size });
  }

  function checkCollision(obj1, obj2) {
    var dx = obj1.x - obj2.x;
    var dy = obj1.y - obj2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance < obj1.size / 2 + obj2.size / 2;
  }

  canvas.addEventListener('mousemove', function(event) {
    cannon.x = event.clientX;
  });

  canvas.addEventListener('click', function() {
    cannonBullets.push({ x: cannon.x, y: cannon.y - cannon.height, speed: 5, size: 2 });
  });

  function update(deltaTime) {
    if (Date.now() - lastAsteroidTime > asteroidSpawnRate) {
      spawnAsteroid();
      lastAsteroidTime = Date.now();
    }

    for (var i = asteroids.length - 1; i >= 0; i--) {
      var asteroid = asteroids[i];
      asteroid.y += asteroidSpeed;

      if (checkCollision(asteroid, base)) {
        gameOver = true;
        break;
      }

      if (asteroid.y > gameHeight + asteroid.size) {
        asteroids.splice(i, 1);
      }
    }

    for (var i = cannonBullets.length - 1; i >= 0; i--) {
      var bullet = cannonBullets[i];
      bullet.y -= bullet.speed;

      if (bullet.y < -bullet.size) {
        cannonBullets.splice(i, 1);
        continue;
      }

      for (var j = asteroids.length - 1; j >= 0; j--) {
        var asteroid = asteroids[j];
        if (checkCollision(bullet, asteroid)) {
          score += 1;
          asteroids.splice(j, 1);
          cannonBullets.splice(i, 1);
          break;
        }
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);

    ctx.fillStyle = 'green';
    ctx.fillRect(cannon.x - cannon.width / 2, cannon.y - cannon.height, cannon.width, cannon.height);

    ctx.fillStyle = 'yellow';
    cannonBullets.forEach(function(bullet) {
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = 'gray';
    asteroids.forEach(function(asteroid) {
      ctx.beginPath();
      ctx.arc(asteroid.x, asteroid.y, asteroid.size / 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    if (gameOver) {
      ctx.fillStyle = 'red';
      ctx.font = '40px Arial';
      ctx.fillText('Game Over!', gameWidth / 2 - 100, gameHeight / 2);
    }
  }

  function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    var deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if (!gameOver) {
      update(deltaTime);
      render();
    }
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

