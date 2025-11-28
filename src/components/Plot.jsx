import React, { useEffect, useRef } from "react";

export default function Plot({ scene }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 600; canvas.height = 300;

    function f(x) {
      if (scene.fn === "linear") return scene.slope * x;
      if (scene.fn === "quadratic") return 0.01 * x * x - 50;
      return (scene.amplitude || 80) * Math.sin(0.02 * x);
    }

    function draw() {
      ctx.clearRect(0,0,600,300);
      // axes
      ctx.strokeStyle = "#999";
      ctx.beginPath();
      ctx.moveTo(30,150); ctx.lineTo(570,150);
      ctx.moveTo(30,280); ctx.lineTo(30,30);
      ctx.stroke();

      ctx.strokeStyle = "#4f8ef7";
      ctx.beginPath();
      ctx.moveTo(30,150 - f(0));
      for (let x=0; x<=540; x++) {
        const y = 150 - f(x);
        ctx.lineTo(30 + x, y);
      }
      ctx.stroke();
      requestAnimationFrame(draw);
    }
    draw();
  }, [scene]);

  return <canvas ref={ref} width={600} height={300} style={{ border: "1px solid #eee", borderRadius: 8 }} />;
}