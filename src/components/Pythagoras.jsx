import React, { useEffect, useRef } from "react";

export default function Pythagoras({ scene }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const a = scene.a || 140;
    const b = scene.b || 100;
    const c = Math.sqrt(a*a + b*b);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 420;
    canvas.height = 300;
    let progress = 0;
    const duration = (scene.duration || 5) * 1000;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const originX = 80, originY = 220;
      // triangle
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + a, originY);
      ctx.lineTo(originX + a, originY - b);
      ctx.closePath();
      ctx.strokeStyle = "#4f8ef7";
      ctx.lineWidth = 3;
      ctx.stroke();

      // grow squares by progress
      const t = Math.min(1, progress/duration);
      // square A
      ctx.fillStyle = "#a7e37e";
      ctx.fillRect(originX, originY + 6, a * t, a * t);
      // square B
      ctx.fillStyle = "#f7d66a";
      ctx.fillRect(originX + a + 6, originY - b, b * t, b * t);
      // square C (approx) - we draw bounding box rotated (visual)
      ctx.save();
      const angle = -Math.atan2(b, a);
      ctx.translate(originX + a, originY - b);
      ctx.rotate(angle);
      ctx.fillStyle = "#f6a6c1";
      ctx.fillRect(-c, -c, c * t, c * t);
      ctx.restore();

      progress += 16;
      if (progress < duration) requestAnimationFrame(draw);
    }
    draw();
  }, [scene]);

  return <canvas ref={canvasRef} style={{ borderRadius: 8, background: "#fff" }} />;
}
