import React, { useEffect, useRef } from "react";

export default function Diagram({ scene }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 600; canvas.height = 300;

    let t = 0;
    function draw() {
      ctx.clearRect(0,0,600,300);
      (scene.items || []).forEach(item => {
        if (item.kind === "box") {
          ctx.fillStyle = "#f5f7ff";
          ctx.strokeStyle = "#4f8ef7";
          ctx.lineWidth = 2;
          ctx.fillRect(item.x, item.y, item.w, item.h);
          ctx.strokeRect(item.x, item.y, item.w, item.h);
          ctx.fillStyle = "#111";
          ctx.fillText(item.label || "", item.x + 8, item.y + item.h/2 + 4);
        } else if (item.kind === "arrow") {
          const [x1,y1] = item.from, [x2,y2] = item.to;
          const osc = Math.sin(t/20) * 6;
          ctx.strokeStyle = "#f76e4f"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2 + osc,y2); ctx.stroke();
          const ang = Math.atan2((y2 + osc) - y1, (x2 + osc) - x1);
          ctx.beginPath();
          ctx.moveTo(x2 + osc, y2);
          ctx.lineTo(x2 + osc - 10*Math.cos(ang - Math.PI/6), y2 - 10*Math.sin(ang - Math.PI/6));
          ctx.lineTo(x2 + osc - 10*Math.cos(ang + Math.PI/6), y2 - 10*Math.sin(ang + Math.PI/6));
          ctx.closePath(); ctx.fillStyle = "#f76e4f"; ctx.fill();
        }
      });
      t++;
      requestAnimationFrame(draw);
    }
    draw();
  }, [scene]);

  return <canvas ref={ref} width={600} height={300} style={{ border: "1px solid #eee", borderRadius: 8 }} />;
}