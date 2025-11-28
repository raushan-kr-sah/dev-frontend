import React, { useEffect, useState } from "react";

export default function BubbleSort({ scene }) {
  const [bars, setBars] = useState(scene.objects || []);

  useEffect(() => {
    setBars(scene.objects || []);
    if (!scene?.animations?.length) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i >= scene.animations.length) {
        clearInterval(interval);
        return;
      }

      const anim = scene.animations[i];
      const aIndex = bars.findIndex(b => b.id === anim.a);
      const bIndex = bars.findIndex(b => b.id === anim.b);
      if (aIndex === -1 || bIndex === -1) {
        i++;
        return;
      }

      const newBars = [...bars];
      const temp = newBars[aIndex];
      newBars[aIndex] = newBars[bIndex];
      newBars[bIndex] = temp;

      setBars(newBars);
      i++;
    }, 1000);

    return () => clearInterval(interval);
  }, [scene, bars]);

  return (
    <div>
      <h2>Bubble Sort Animation</h2>
      <div style={{ display: "flex", alignItems: "end", gap: "10px" }}>
        {bars.map((bar) => (
          <div
            key={bar.id}
            style={{
              width: "40px",
              height: `${bar.value}px`,
              background: "tomato",
              transition: "transform 0.6s ease, height 0.6s ease",
            }}
            title={`${bar.id}: ${bar.value}`}
          />
        ))}
      </div>
    </div>
  );
}
