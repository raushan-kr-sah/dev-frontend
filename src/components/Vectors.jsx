import React, { useEffect, useRef } from "react";

export default function Vectors({ scene }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 600; canvas.height = 300;

    let t = 0;
    function draw() {
      ctx.clearRect(0,0,600,300);
      ctx.strokeStyle = "#ddd"; ctx.beginPath();
      ctx.moveTo(40,260); ctx.lineTo(560,260); ctx.moveTo(40,260); ctx.lineTo(40,40); ctx.stroke();

      (scene.vectors || []).forEach((v, i) => {
        const [x1,y1] = v.from;
        const [x2,y2] = v.to;
        const tipX = x2 + (scene.animate === "tip-oscillate" ? Math.sin(t/15 + i)*6 : 0);
        const tipY = y2 + (scene.animate === "tip-oscillate" ? Math.cos(t/15 + i)*6 : 0);

        // line
        ctx.strokeStyle = v.color || "#333";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1,y1); ctx.lineTo(tipX,tipY); ctx.stroke();

        // arrowhead
        const ang = Math.atan2(tipY - y1, tipX - x1);
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX - 10*Math.cos(ang - Math.PI/6), tipY - 10*Math.sin(ang - Math.PI/6));
        ctx.lineTo(tipX - 10*Math.cos(ang + Math.PI/6), tipY - 10*Math.sin(ang + Math.PI/6));
        ctx.closePath(); ctx.fillStyle = v.color || "#333"; ctx.fill();

        // label
        ctx.fillStyle = "#111";
        ctx.fillText(v.label || "", x1 + 6, y1 - 6);
      });

      t++;
      requestAnimationFrame(draw);
    }
    draw();
  }, [scene]);

  return <canvas ref={ref} width={600} height={300} style={{ border: "1px solid #eee", borderRadius: 8 }} />;
}