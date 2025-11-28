import React, { useState } from "react";
import axios from "axios";
import BubbleSort from "./components/BubbleSort";
import SineWave from "./components/SineWave";
import Pythagoras from "./components/Pythagoras";
import Shapes from "./components/Shapes";
import Derivation from "./components/Derivation";
import Vectors from "./components/Vectors";
import Plot from "./components/Plot";
import Algorithm from "./components/Algorithm";
import Diagram from "./components/Diagram";
import Bernoulli from "./components/Bernoulli";
import MatrixExponentiation from "./components/MatrixExponentiation";

export default function App() {
  const [text, setText] = useState("");
  const [scene, setScene] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [busy, setBusy] = useState(false); // NEW: global in-flight guard

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000"; // set to your backend port

  const generate = async () => {
    if (busy || loading) return; // prevent double-clicks
    if (!text) return alert("Type a description (eg: 'bubble sort')");
    setLoading(true);
    setBusy(true);
    try {
      const res = await axios.post(`${API_BASE}/generate`, { description: text });
      setScene(res.data);
    } catch (err) {
      alert("Generate failed: " + (err?.response?.data?.error || err.message));
    } finally {
      setLoading(false);
      setTimeout(() => setBusy(false), 300); // debounce
    }
  };

  const autoExample = (name) => {
    if (busy || loading || exporting) return; // block while busy
    const presets = {
      bubble: "bubble sort demo with 6 bars",
      sine: "sine wave amplitude 80 frequency 0.02",
      pyth: "pythagoras theorem a 140 b 100",
      shapes: "shapes circle rectangle triangle",
      derivation: "derivation formula integral of x^2",
      vectors: "vectors velocity tip-oscillate",
      plot: "plot sine amplitude 80",
      algorithm: "algorithm bfs graph",
      diagram: "diagram lab circuit blocks",
      bernoulli: "Bernoulli's Principle pressure 80 velocity 2",
      matrix: "4x4 matrix exponent n 3"
    };
    setText(presets[name] || "");
  };

  const exportVideo = async () => {
    if (busy || exporting) return; // prevent double-clicks
    if (!scene) return alert("Generate a scene first");
    setExporting(true);
    setBusy(true);
    try {
      const res = await axios({
        url: `${API_BASE}/export`,
        method: "POST",
        responseType: "blob",
        data: { scene, fps: 25, width: 900, height: 360 }
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "animation.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed: " + (err?.response?.data?.error || err.message));
    } finally {
      setExporting(false);
      setTimeout(() => setBusy(false), 300); // debounce
    }
  };

  const downloadPreview = () => {
    if (busy || exporting || loading) return;
    const canvas = document.querySelector(".preview canvas");
    if (!canvas) return alert("No preview canvas found. Generate an animation first.");
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${scene?.type || "preview"}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const disableExamples = busy || loading || exporting;

  return (
    <div className="container">
      <h1>Edu Animation Generator</h1>

      <textarea
        placeholder="Describe what you want (e.g., 'bubble sort with 5 bars')"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div style={{ display: "flex", gap: "8px", marginTop: 10, flexWrap: "wrap" }}>
        <button onClick={generate} disabled={loading || busy} className="btn btn-primary">
          {loading ? "Generating..." : "Generate Animation"}
        </button>

        <button onClick={() => autoExample("bubble")} disabled={disableExamples} className="btn btn-secondary">Example: Bubble Sort</button>
        <button onClick={() => autoExample("sine")} disabled={disableExamples} className="btn btn-secondary">Example: Sine Wave</button>
        <button onClick={() => autoExample("pyth")} disabled={disableExamples} className="btn btn-secondary">Example: Pythagoras</button>
        <button onClick={() => autoExample("bernoulli")} disabled={disableExamples} className="btn btn-secondary">Example: Bernoulli</button>
        <button onClick={() => autoExample("matrix")} disabled={disableExamples} className="btn btn-secondary">Example: Matrix Exp</button>

        {/* Export Video: new accent color */}
        <button onClick={exportVideo} disabled={exporting || busy || !scene} className="btn btn-export">
          {exporting ? "Exporting..." : "Export Video (MP4)"}
        </button>

        {/* Download PNG: new success color */}
        <button onClick={downloadPreview} disabled={!scene || disableExamples} className="btn btn-download">
          Download Preview (PNG)
        </button>
      </div>

      <div className="preview">
        {scene ? (
          <>
            <h2>Preview — {scene.type}</h2>
            {scene.type === "bubble_sort" && <BubbleSort scene={scene} />}
            {scene.type === "sine_wave" && <SineWave scene={scene} />}
            {scene.type === "pythagoras" && <Pythagoras scene={scene} />}
            {scene.type === "shapes" && <Shapes scene={scene} />}
            {scene.type === "derivation" && <Derivation scene={scene} />}
            {scene.type === "vectors" && <Vectors scene={scene} />}
            {scene.type === "plot" && <Plot scene={scene} />}
            {scene.type === "algorithm" && <Algorithm scene={scene} />}
            {scene.type === "diagram" && <Diagram scene={scene} />}
            {scene.type === "bernoulli" && <Bernoulli scene={scene} />}
            {scene.type === "matrix_exp" && <MatrixExponentiation scene={scene} />}
            <h3>Scene JSON</h3>
            <pre style={{ maxHeight: 220, overflow: "auto", textAlign: "left" }}>
              {JSON.stringify(scene, null, 2)}
            </pre>
          </>
        ) : (
          <p>Generate a scene to preview it here.</p>
        )}
      </div>
    </div>
  );
}
