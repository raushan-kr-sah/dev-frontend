import React, { useEffect, useRef } from "react";

export default function Bernoulli({ scene }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 900; canvas.height = 360;

    const inlet = scene.inlet || { pressure: 80, velocity: 2 };
    const outlet = scene.outlet || { pressure: Math.max(20, inlet.pressure - 40), velocity: Math.max(3, inlet.velocity + 3) };

    // Geometry
    const wideStart = 60, wideEnd = 360, narrowEnd = 560, midY = 180;
    const pipeWideH = 60, pipeNarrowH = 30;

    // Flow dots
    const dotCount = 28;
    const spacing = 26;
    const travelLen = narrowEnd - wideStart;
    const dots = Array.from({ length: dotCount }).map((_, i) => ({
      x: wideStart + (i * spacing) % travelLen,
      y: midY,
      base: i * spacing
    }));

    // Speeds
    const speedWide = Math.max(25, Number(inlet.velocity) * 35);
    const speedNarrow = Math.max(speedWide + 10, Number(outlet.velocity) * 55);

    let start = performance.now();

    function drawGauge(x, y, label, value, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(-40, -20, 80, 40);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#111";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${label}: ${Math.round(value)}`, 0, 4);
      ctx.restore();
    }

    function drawArrow(x1, y1, x2, y2, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      const ang = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 10 * Math.cos(ang - Math.PI / 6), y2 - 10 * Math.sin(ang - Math.PI / 6));
      ctx.lineTo(x2 - 10 * Math.cos(ang + Math.PI / 6), y2 - 10 * Math.sin(ang + Math.PI / 6));
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    function loop(now) {
      const t = now - start;
      const p = Math.min(1, t / ((scene.duration || 6) * 1000));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Title
      ctx.fillStyle = "#111";
      ctx.font = "16px Arial";
      ctx.fillText("Bernoulli's Principle: velocity increases, pressure decreases in constriction", wideStart, 80);

      // Pipe
      ctx.fillStyle = "#bcd6ff";
      ctx.fillRect(wideStart, midY - pipeWideH / 2, wideEnd - wideStart, pipeWideH);
      ctx.fillStyle = "#9ec4ff";
      ctx.fillRect(wideEnd, midY - pipeNarrowH / 2, narrowEnd - wideEnd, pipeNarrowH);

      // Pressure gauges
      drawGauge(wideStart + 100, midY - 70, "P1", inlet.pressure, "#4f8ef7");
      drawGauge(wideEnd + 100, midY - 70, "P2", outlet.pressure, "#f76e4f");

      // Velocity arrows
      drawArrow(wideStart + 40, midY + 50, wideStart + 140, midY + 50, "#4f8ef7");
      drawArrow(wideEnd + 40, midY + 50, wideEnd + 200, midY + 50, "#f76e4f");
      ctx.fillStyle = "#111";
      ctx.font = "12px Arial";
      ctx.fillText(`v1=${inlet.velocity}`, wideStart + 140 + 10, midY + 54);
      ctx.fillText(`v2=${outlet.velocity}`, wideEnd + 200 + 10, midY + 54);

      // Flow dots: blue in wide section, orange in narrow section
      dots.forEach((d) => {
        const inWide = d.x < wideEnd;
        const speed = inWide ? speedWide : speedNarrow;
        d.x = wideStart + ((d.base + (t / 1000) * speed) % travelLen);
        ctx.beginPath();
        ctx.arc(d.x, midY, 4, 0, Math.PI * 2);
        ctx.fillStyle = inWide ? "#1c66ff" : "#f76e4f";
        ctx.fill();
      });

      // Pressure indicator bars
      ctx.fillStyle = "#4f8ef7";
      ctx.fillRect(wideStart - 20, midY - 20, 10, Math.max(6, inlet.pressure / 2));
      ctx.fillStyle = "#f76e4f";
      ctx.fillRect(narrowEnd + 10, midY - 20, 10, Math.max(6, outlet.pressure / 2));

      if (p < 1) requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }, [scene]);

  return (
    <div>
      <h2>Bernoulli's Principle</h2>
      <canvas ref={ref} width={900} height={360} style={{ border: "1px solid #eee", borderRadius: 8, background: "#fff" }} />
    </div>
  );
}