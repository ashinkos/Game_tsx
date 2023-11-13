import React, { useEffect, useRef } from 'react';

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const paddleSpeed = 10; // Adjust the speed according to your preference
  const keysPressed: { [key: string]: boolean } = {};
  // const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    contextRef.current = context;

    const updateCanvasSize = () => {
      if (canvas) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Set canvas dimensions as a percentage of the window size
        const canvasWidth = windowWidth * 0.8; // 80% of window width
        const canvasHeight = windowHeight * 0.6; // 60% of window height

        // Set canvas size
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }
    };

    // Set initial paddle and ball positions
    let paddle1Y = canvas.height / 2 - 60;
    let paddle2Y = canvas.height / 2 - 60;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 5;
    let paddle1Score = 0;
    let paddle2Score = 0;

    const drawPaddle = (x: number, y: number) => {
      contextRef.current?.fillRect(x, y, 10, 120);
    };

    // const drawPaddle_hard = (x: number, y: number) => {
    //   contextRef.current?.fillRect(x, y, 10, 80);
    // };

    const drawBall = (x: number, y: number) => {
      contextRef.current?.beginPath();
      contextRef.current?.arc(x, y, 10, 0, Math.PI * 2);
      contextRef.current?.fill();
      contextRef.current?.closePath();
    };
    const drawnet = () => {
      contextRef.current?.beginPath();
      contextRef.current?.moveTo(canvas.width / 2, 0);
      contextRef.current?.lineTo(canvas.width / 2, canvas.height);
      contextRef.current?.stroke();
    }
    const drawScore = () => {
      contextRef.current.fillStyle = '#000000';
      contextRef.current.font = '30px Arial';
      contextRef.current?.fillText(paddle1Score.toString(), canvas.width / 2 - 50, 50);
      contextRef.current?.fillText(paddle2Score.toString(), canvas.width / 2 + 50, 50);
    }

    const draw = () => {
      // Clear the canvas
      contextRef.current?.clearRect(0, 0, canvas.width, canvas.height);

      // Set background color
      // contextRef.current?.fillStyle = '#f0f0f0'; // light grey
      // contextRef.current?.fillRect(0, 0, canvas.width, canvas.height);

      // Draw paddles
      drawPaddle(10, paddle1Y);
      drawPaddle(canvas.width - 20, paddle2Y);
      drawnet();
      drawScore();

      // Draw the ball
      drawBall(ballX, ballY);

      // Move the ball
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Bounce off the top and bottom walls
      if (ballY < 0 || ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
      }

      // Reset ball position if it hits left or right boundaries
      if (ballX < 0 || ballX > canvas.width) {
        if (ballX < 0) {
          paddle2Score++;
        } else {
          paddle1Score++;
        }
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
      }

      // Bounce off paddles
      if (
        (ballX < 20 + 5 && ballY > paddle1Y && ballY < paddle1Y + 120) ||
        (ballX > canvas.width - 30 && ballY > paddle2Y && ballY < paddle2Y + 120)
      ) {
        ballSpeedX = -ballSpeedX;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed[event.key] = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed[event.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const movePaddles = () => {
      if (keysPressed['ArrowUp']) {
        paddle2Y = Math.max(0, paddle2Y - paddleSpeed);
      }
      if (keysPressed['ArrowDown']) {
        paddle2Y = Math.min(canvas.height - 120, paddle2Y + paddleSpeed);
      }
      if (keysPressed['w']) {
        paddle1Y = Math.max(0, paddle1Y - paddleSpeed);
      }
      if (keysPressed['s']) {
        paddle1Y = Math.min(canvas.height - 120, paddle1Y + paddleSpeed);
      }
    };

    // Initial setup
    updateCanvasSize();

    // Event listener for window resize
    window.addEventListener('resize', updateCanvasSize);

    const animate = () => {
      movePaddles();
      draw();
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return <canvas ref={canvasRef}  style={{ border: '5px solid black' }} />;
};

export default PongGame;
