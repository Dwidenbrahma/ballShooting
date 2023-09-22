
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');

        const cannon = {
            x: 50,
            y: canvas.height / 2,
            width: 20,
            height: 20,
            angle: 0,
        };

        const balls = [];
        const targets = [];
        let score = 0; // Initialize score

        function drawCannon() {
            ctx.save();
            ctx.translate(cannon.x, cannon.y);
            ctx.rotate(cannon.angle);
            ctx.fillStyle = 'blue';
            ctx.fillRect(-cannon.width / 2, -cannon.height / 2, cannon.width, cannon.height);
            ctx.restore();
        }

        function drawBalls() {
            for (let i = 0; i < balls.length; i++) {
                const ball = balls[i];
                ctx.fillStyle = 'red';
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
            }
        }

        function drawTargets() {
            for (let i = 0; i < targets.length; i++) {
                const target = targets[i];
                ctx.fillStyle = 'green';
                ctx.fillRect(target.x, target.y, target.width, target.height);
            }
        }

        function drawScore() {
            ctx.font = '20px Arial';
            ctx.fillStyle = 'black';
            ctx.fillText('Score: ' + score, 10, 20);
        }

        function update() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawCannon();
            drawBalls();
            drawTargets();
            drawScore();

            for (let i = balls.length - 1; i >= 0; i--) {
                const ball = balls[i];
                ball.x += Math.cos(ball.angle) * ball.speed;
                ball.y += Math.sin(ball.angle) * ball.speed;

                if (ball.x < 0 || ball.x > canvas.width || ball.y < 0 || ball.y > canvas.height) {
                    balls.splice(i, 1);
                } else {
                    for (let j = targets.length - 1; j >= 0; j--) {
                        const target = targets[j];
                        if (
                            ball.x + ball.radius > target.x &&
                            ball.x - ball.radius < target.x + target.width &&
                            ball.y + ball.radius > target.y &&
                            ball.y - ball.radius < target.y + target.height
                        ) {
                            targets.splice(j, 1);
                            balls.splice(i, 1);
                            score++; // Increase score on target hit
                        }
                    }
                }
            }
        }

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const dx = mouseX - cannon.x;
            const dy = mouseY - cannon.y;
            cannon.angle = Math.atan2(dy, dx);
        });

        canvas.addEventListener('click', () => {
            const ball = {
                x: cannon.x,
                y: cannon.y,
                radius: 5,
                angle: cannon.angle,
                speed: 5,
            };
            balls.push(ball);
        });

        function createRandomTarget() {
            const target = {
                x: canvas.width - 30,
                y: Math.random() * (canvas.height - 30),
                width: 20,
                height: 20,
            };
            targets.push(target);
        }

        // Create some initial targets
        for (let i = 0; i < 5; i++) {
            createRandomTarget();
        }

        setInterval(update, 1000 / 60);

        // Create new targets periodically
        setInterval(createRandomTarget, 2000); // Adjust the time interval as needed
  