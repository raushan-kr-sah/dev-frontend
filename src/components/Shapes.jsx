import React, { useEffect, useRef } from "react";

export default function Shapes({ scene }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 600; canvas.height = 300;

    let t = 0;
    function draw() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      (scene.shapes || []).forEach((s, i) => {
        ctx.save();
        if (s.kind === "circle") {
          ctx.beginPath();
          const r = (s.r || 40) + 6 * Math.sin(t / 20 + i);
          ctx.arc(s.x || 140, s.y || 120, r, 0, Math.PI * 2);
          ctx.fillStyle = s.color || "#4f8ef7";
          ctx.fill();
        } else if (s.kind === "rect") {
          ctx.fillStyle = s.color || "#f76e4f";
          const h = (s.h || 80) + 6 * Math.sin(t / 18 + i);
          ctx.fillRect(s.x || 240, s.y || 60, s.w || 120, h);
        } else if (s.kind === "triangle" && s.points?.length === 3) {
          const [p1, p2, p3] = s.points;
          ctx.beginPath();
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
          ctx.lineTo(p3[0], p3[1]);
          ctx.closePath();
          ctx.fillStyle = s.color || "#2ecc71";
          ctx.fill();
        }
        ctx.restore();
      });
      t++;
      requestAnimationFrame(draw);
    }
    draw();
  }, [scene]);

  return <canvas ref={ref} width={600} height={300} style={{ border: "1px solid #eee", borderRadius: 8, background: "#fff" }} />;
}