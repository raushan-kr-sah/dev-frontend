import React, { useEffect, useRef } from "react";

export default function Derivation({ scene }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    el.innerHTML = "";
    const steps = scene.steps || [];
    let i = 0;

    function renderStep() {
      const step = steps[i];
      if (!step) return;
      const row = document.createElement("div");
      row.style.margin = "8px 0";
      row.style.display = "flex";
      row.style.gap = "10px";

      const formula = document.createElement("span");
      // Render formula as plain text; frontend doesn’t bundle KaTeX
      formula.textContent = step.latex;

      const note = document.createElement("small");
      note.style.color = "#555";
      note.textContent = step.note;

      row.appendChild(formula);
      row.appendChild(note);
      el.appendChild(row);

      i++;
      if (i < steps.length) setTimeout(renderStep, 800);
    }
    renderStep();
  }, [scene]);

  return (
    <div>
      <h2>{scene.title || "Derivation"}</h2>
      <div ref={ref} />
    </div>
  );
}