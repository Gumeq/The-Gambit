// components/PlinkoGame.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const PlinkoGame: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const worldRef = useRef<Matter.World | null>(null);

  const [balls, setBalls] = useState<Matter.Body[]>([]);
  const ballsRef = useRef<Matter.Body[]>([]);
  const [multipliers, setMultipliers] = useState<number[]>([]);

  const width = 800;
  const height = 600;

  useEffect(() => {
    const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Runner = Matter.Runner,
      Events = Matter.Events;

    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;
    worldRef.current = world;

    const render = Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "#0f0f13",
      },
    });

    // Walls
    const ground = Bodies.rectangle(width / 2, height + 25, width, 50, {
      isStatic: true,
      render: { fillStyle: "#060a19" },
    });

    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, {
      isStatic: true,
      render: { fillStyle: "#060a19" },
    });

    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, {
      isStatic: true,
      render: { fillStyle: "#060a19" },
    });

    World.add(world, [ground, leftWall, rightWall]);

    // Pegs
    const pegRadius = 5;
    const totalRows = 10;
    const pegs: Matter.Body[] = [];
    const pegSpacingY = (height - 100) / (totalRows + 1); // Adjusted for platforms

    const maxPegsInRow = totalRows * 2 - 1; // Maximum pegs in bottom row (odd number)
    const spacingX = width / (maxPegsInRow + 1); // Consistent horizontal spacing

    for (let row = 2; row < totalRows; row++) {
      const pegsInRow = row * 2 + 1; // 1, 3, 5, 7, etc.
      const y = (row + 1) * pegSpacingY; // Vertical position

      // Calculate horizontal offset to center the row
      const offsetX = ((maxPegsInRow - pegsInRow) / 2) * spacingX;

      for (let col = 0; col < pegsInRow; col++) {
        const x = (col + 1) * spacingX + offsetX;

        const peg = Bodies.circle(x, y, pegRadius, {
          isStatic: true,
          render: { fillStyle: "#ffffff" },
        });
        pegs.push(peg);
      }
    }

    World.add(world, pegs);

    // Platforms
    const platformCount = maxPegsInRow;
    const platformWidth = width / platformCount;

    const platforms: Matter.Body[] = [];
    const platformMultipliers: number[] = [];

    for (let i = 0; i < platformCount; i++) {
      const platformX = i * platformWidth + platformWidth / 2;
      const platform = Bodies.rectangle(
        platformX,
        height - 25,
        platformWidth,
        50,
        {
          isStatic: true,
          isSensor: true,
          label: `platform-${i}`,
          render: {
            fillStyle: "#333",
          },
        },
      );

      // Assign a semi-random multiplier between 1x and 5x
      const multiplier = Math.floor(Math.random() * 5) + 1;
      platformMultipliers.push(multiplier);

      platforms.push(platform);
    }

    setMultipliers(platformMultipliers);
    World.add(world, platforms);

    // Collision detection
    const handleCollision = (event: Matter.IEventCollision<Matter.Engine>) => {
      const pairs = event.pairs;
      console.log(balls);

      pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        ballsRef.current.forEach((ball) => {
          platforms.forEach((platform, index) => {
            if (
              (bodyA === ball && bodyB === platform) ||
              (bodyB === ball && bodyA === platform)
            ) {
              const multiplier = platformMultipliers[index];
              console.log(
                `Ball hit platform ${index} with multiplier ${multiplier}x`,
              );

              // Remove the ball from the world and state
              if (worldRef.current) {
                Matter.World.remove(worldRef.current, ball);
              }
              setBalls((prevBalls) => {
                const newBalls = prevBalls.filter((b) => b !== ball);
                ballsRef.current = newBalls;
                return newBalls;
              });

              // Display the result to the user
              alert(`You won ${multiplier}x your bet!`);
            }
          });
        });
      });
    };

    Events.on(engine, "collisionStart", handleCollision);

    // Run the engine and renderer
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Cleanup
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};

      // Remove collision event listener
      Events.off(engine, "collisionStart", handleCollision);
    };
  }, []);

  // Function to spawn a new ball
  const spawnBall = () => {
    const { Bodies, World } = Matter;

    // Slight random offset, e.g., between -20 and +20 pixels
    const randomOffset = (Math.random() - 0.5) * 40;

    const ball = Bodies.circle(width / 2 + randomOffset, 0, 10, {
      restitution: 0.5,
      render: { fillStyle: "#ff0000" },
    });

    setBalls((prevBalls) => {
      const newBalls = [...prevBalls, ball];
      ballsRef.current = newBalls;
      return newBalls;
    });

    if (worldRef.current) {
      World.add(worldRef.current, ball);
    }
  };

  // CSS styles for platform labels
  const platformLabelStyle: React.CSSProperties = {
    position: "absolute",
    color: "white",
    textAlign: "center",
    pointerEvents: "none",
    fontSize: "16px",
  };

  const platformWidth = width / multipliers.length;

  return (
    <div style={{ position: "relative" }}>
      <button onClick={spawnBall}>Drop Ball</button>
      <div ref={sceneRef} />
      {multipliers.map((multiplier, index) => (
        <div
          key={index}
          style={{
            ...platformLabelStyle,
            left: index * platformWidth,
            top: height - 50,
            width: platformWidth,
          }}
        >
          {multiplier}x
        </div>
      ))}
    </div>
  );
};

export default PlinkoGame;
