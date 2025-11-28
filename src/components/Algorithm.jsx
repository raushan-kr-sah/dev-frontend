import React, { useEffect, useRef } from "react";

export default function Algorithm({ scene }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 600; canvas.height = 300;

    const pos = {};
    const nodes = scene.nodes || [];
    nodes.forEach((n, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      pos[n.id] = [300 + 120*Math.cos(angle), 150 + 90*Math.sin(angle)];
    });

    let step = 0;
    function draw() {
      ctx.clearRect(0,0,600,300);

      // edges
      ctx.strokeStyle = "#bbb";
      (scene.edges || []).forEach(([a,b]) => {
        const [x1,y1] = pos[a]; const [x2,y2] = pos[b];
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      });

      // nodes
      nodes.forEach(n => {
        const [x,y] = pos[n.id];
        const active = scene.order?.slice(0, step).includes(n.id);
        ctx.beginPath(); ctx.arc(x,y,20,0,Math.PI*2);
        ctx.fillStyle = active ? "#2ecc71" : "#4f8ef7"; ctx.fill();
        ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(n.id, x, y+4);
      });

      step = Math.min(step + 0.02, (scene.order?.length || 1));
      requestAnimationFrame(draw);
    }
    draw();
  }, [scene]);

  return <canvas ref={ref} width={600} height={300} style={{ border: "1px solid #eee", borderRadius: 8 }} />;
}