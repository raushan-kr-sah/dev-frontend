import React, { useEffect } from "react";

export default function SineWave({ scene }) {
  useEffect(() => {
    const canvas = document.getElementById("sineCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let x = 0;
    function draw() {
      ctx.clearRect(0, 0, 400, 200);

      ctx.beginPath();
      ctx.moveTo(0, 100);
      for (let i = 0; i < 400; i++) {
        const y = 100 + (scene?.amplitude || 80) * Math.sin(i * (scene?.frequency || 0.02));
        ctx.lineTo(i, y);
      }
      ctx.strokeStyle = "#007aff";
      ctx.lineWidth = 2;
      ctx.stroke();

      const px = x;
      const py = 100 + (scene?.amplitude || 80) * Math.sin(x * (scene?.frequency || 0.02));
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();

      x += 2;
      if (x > 400) x = 0;

      requestAnimationFrame(draw);
    }

    draw();
  }, [scene]);

  return (
    <div>
      <h2>Sine Wave Animation</h2>
      <canvas id="sineCanvas" width={400} height={200} style={{ border: "1px solid black" }} />
    </div>
  );
}
