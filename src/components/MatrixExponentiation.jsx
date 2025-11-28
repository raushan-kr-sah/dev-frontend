import React, { useEffect, useRef } from "react";

export default function MatrixExponentiation({ scene }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 900; canvas.height = 360;

    const A = scene.A || [
      [1,1,0,0],
      [0,1,1,0],
      [0,0,1,1],
      [0,0,0,1],
    ];
    const n = Math.max(1, Math.min(8, Math.floor(scene.n || 3)));
    const durationMs = (scene.duration || 7) * 1000;

    function mul(X, Y) {
      const R = Array.from({length:4},()=>Array(4).fill(0));
      for (let i=0;i<4;i++) for (let j=0;j<4;j++) for (let k=0;k<4;k++) {
        R[i][j] += X[i][k]*Y[k][j];
      }
      return R;
    }
    function pow(base, e) {
      let R = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
      let B = base.map(r=>r.slice());
      while (e > 0) {
        if (e & 1) R = mul(R, B);
        e >>= 1;
        if (e) B = mul(B, B);
      }
      return R;
    }

    function drawMatrix(m, ox, oy, color) {
      const cell = 40;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let r=0;r<4;r++) {
        for (let c=0;c<4;c++) {
          ctx.fillStyle = "#f5f7ff";
          ctx.strokeStyle = color || "#4f8ef7";
          ctx.lineWidth = 2;
          ctx.fillRect(ox + c*cell, oy + r*cell, cell, cell);
          ctx.strokeRect(ox + c*cell, oy + r*cell, cell, cell);
          ctx.fillStyle = "#111";
          ctx.font = "14px Arial";
          ctx.fillText(String(m[r][c]), ox + c*cell + cell/2, oy + r*cell + cell/2);
        }
      }
    }

    let start = performance.now();
    function loop(now) {
      const t = now - start;
      const p = Math.min(1, t / durationMs);
      const k = Math.max(1, Math.floor(p * n));
      const R = pow(A, k);

      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = "#111";
      ctx.font = "16px Arial";
      ctx.fillText(`A^${k} (target n=${n})`, 60, 40);

      drawMatrix(A, 60, 60, "#4f8ef7");
      drawMatrix(R, 360, 60, "#f76e4f");

      if (p < 1) requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }, [scene]);

  return (
    <div>
      <h2>4x4 Matrix Exponentiation</h2>
      <canvas ref={ref} width={900} height={360} style={{ border: "1px solid #eee", borderRadius: 8, background: "#fff" }} />
    </div>
  );
}