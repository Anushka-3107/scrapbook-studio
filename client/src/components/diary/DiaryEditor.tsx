
import React, { useRef, useState } from "react";
import "./DiaryEditor.css";
import { useNavigate } from "react-router-dom";

type ElementType = "text" | "image" | "sticker";

type PageElement = {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string;
  src?: string;
};

type Stroke = {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  size: number;
};

const stickers = ["♡", "✿", "✦", "🎀", "🌸", "⭐", "☁", "🦋", "🌷", "🍓"];

const paperOptions = [
  { name: "Cream", color: "#fffdf5", pattern: "plain" },
  { name: "Pink", color: "#fff0f3", pattern: "plain" },
  { name: "Mint", color: "#effaf2", pattern: "plain" },
  { name: "Lined", color: "#fffdf5", pattern: "lined" },
  { name: "Dots", color: "#fffdf5", pattern: "dots" },
  { name: "Grid", color: "#fffdf5", pattern: "grid" },
];

function DiaryEditor() {
  const navigate = useNavigate();
  const paperRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const drawingRef = useRef(false);

  const [elements, setElements] = useState<PageElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<"select" | "text" | "draw" | "sticker">("select");
  const [showStickers, setShowStickers] = useState(false);
  const [showPaperOptions, setShowPaperOptions] = useState(false);
  const [paperColor, setPaperColor] = useState("#fffdf5");
  const [paperPattern, setPaperPattern] = useState("plain");
  const [brushColor, setBrushColor] = useState("#3155b8");
  const [brushSize, setBrushSize] = useState(3);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [activeStroke, setActiveStroke] = useState<Stroke | null>(null);

  const selectedElement = elements.find((element) => element.id === selectedId);

  const updateElement = (id: string, changes: Partial<PageElement>) => {
    setElements((previous) =>
      previous.map((element) =>
        element.id === id ? { ...element, ...changes } : element
      )
    );
  };

  const getPaperPoint = (event: React.PointerEvent) => {
    const rect = paperRef.current!.getBoundingClientRect();

    // Account for the paper's slight visual rotation.
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const addText = () => {
    const element: PageElement = {
      id: crypto.randomUUID(),
      type: "text",
      x: 120,
      y: 180,
      width: 220,
      height: 80,
      rotation: 0,
      content: "write something lovely ♡",
    };

    setElements((previous) => [...previous, element]);
    setSelectedId(element.id);
    setMode("select");
  };

  const addSticker = (sticker: string) => {
    const element: PageElement = {
      id: crypto.randomUUID(),
      type: "sticker",
      x: 180,
      y: 220,
      width: 70,
      height: 70,
      rotation: 0,
      content: sticker,
    };

    setElements((previous) => [...previous, element]);
    setSelectedId(element.id);
    setShowStickers(false);
    setMode("select");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    imageFiles.forEach((file, index) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== "string") return;

        const element: PageElement = {
          id: crypto.randomUUID(),
          type: "image",
          x: 100 + index * 25,
          y: 180 + index * 25,
          width: 220,
          height: 160,
          rotation: 0,
          content: "",
          src: reader.result,
        };

        setElements((previous) => [...previous, element]);
        setSelectedId(element.id);
      };

      reader.readAsDataURL(file);
    });

    event.target.value = "";
    setMode("select");
  };

  const handlePaperPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== "draw" || !paperRef.current) {
      if (event.target === paperRef.current) setSelectedId(null);
      return;
    }

    if (event.target !== paperRef.current) return;

    event.preventDefault();
    drawingRef.current = true;

    const point = getPaperPoint(event);

    setActiveStroke({
      id: crypto.randomUUID(),
      points: [point],
      color: brushColor,
      size: brushSize,
    });

    paperRef.current.setPointerCapture(event.pointerId);
  };

  const handlePaperPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drawingRef.current || !activeStroke) return;

    const point = getPaperPoint(event);

    setActiveStroke((previous) =>
      previous ? { ...previous, points: [...previous.points, point] } : null
    );
  };

  const finishDrawing = () => {
    if (activeStroke) {
      setStrokes((previous) => [...previous, activeStroke]);
    }

    setActiveStroke(null);
    drawingRef.current = false;
  };

  const startTransform = (
    event: React.PointerEvent,
    element: PageElement,
    action: "move" | "resize" | "rotate"
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedId(element.id);

    const startX = event.clientX;
    const startY = event.clientY;
    const initial = { ...element };

    const centerX = initial.x + initial.width / 2;
    const centerY = initial.y + initial.height / 2;
    const startAngle =
      Math.atan2(startY - centerY, startX - centerX) * (180 / Math.PI);

    const handleMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (action === "move") {
        updateElement(element.id, {
          x: initial.x + dx,
          y: initial.y + dy,
        });
      } else if (action === "resize") {
        updateElement(element.id, {
          width: Math.max(40, initial.width + dx),
          height: Math.max(35, initial.height + dy),
        });
      } else {
        const angle =
          Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) *
          (180 / Math.PI);

        updateElement(element.id, {
          rotation: initial.rotation + angle - startAngle,
        });
      }
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const deleteSelected = () => {
    setElements((previous) => previous.filter((element) => element.id !== selectedId));
    setSelectedId(null);
  };

  const bringForward = () => {
    if (!selectedId) return;

    setElements((previous) => {
      const index = previous.findIndex((element) => element.id === selectedId);
      if (index < 0 || index === previous.length - 1) return previous;

      const next = [...previous];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const toPath = (points: Stroke["points"]) =>
    points.map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    ).join(" ");

  return (
    <main className="diary-editor">
      <button className="floating-back" onClick={() => navigate("/")}>
        ← back
      </button>

      <button className="floating-save" onClick={() => window.alert("Saving will be connected to the backend later.")}>
        save ♡
      </button>

      <section className="editor-stage">
        <div className="editor-tools">
          <button className={`editor-tool ${mode === "text" ? "active-tool" : ""}`} onClick={() => { setMode("text"); addText(); }}>
            <span className="tool-icon">T</span><span className="tool-name">Text</span>
          </button>

          <button className="editor-tool" onClick={() => imageInputRef.current?.click()}>
            <span className="tool-icon">▧</span><span className="tool-name">Photo</span>
          </button>

          <input ref={imageInputRef} type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />

          <button className="editor-tool" onClick={() => setShowStickers((value) => !value)}>
            <span className="tool-icon">✿</span><span className="tool-name">Sticker</span>
          </button>

          <button className={`editor-tool ${mode === "draw" ? "active-tool" : ""}`} onClick={() => setMode((value) => value === "draw" ? "select" : "draw")}>
            <span className="tool-icon">〰</span><span className="tool-name">Draw</span>
          </button>

          <button className="editor-tool" onClick={() => setShowPaperOptions((value) => !value)}>
            <span className="tool-icon">▤</span><span className="tool-name">Paper</span>
          </button>
        </div>

        <div className="editor-workspace">
          {showStickers && (
            <div className="editor-popover sticker-picker">
              <strong>little stickers ♡</strong>
              <div className="sticker-grid">
                {stickers.map((sticker) => (
                  <button key={sticker} onClick={() => addSticker(sticker)}>{sticker}</button>
                ))}
              </div>
            </div>
          )}

          {showPaperOptions && (
            <div className="editor-popover paper-picker">
              <strong>choose your paper</strong>
              {paperOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => {
                    setPaperColor(option.color);
                    setPaperPattern(option.pattern);
                    setShowPaperOptions(false);
                  }}
                >
                  {option.name}
                </button>
              ))}
            </div>
          )}

          {mode === "draw" && (
            <div className="drawing-controls">
              <label>Ink
                <input type="color" value={brushColor} onChange={(event) => setBrushColor(event.target.value)} />
              </label>
              <label>Brush
                <input type="range" min="1" max="12" value={brushSize} onChange={(event) => setBrushSize(Number(event.target.value))} />
              </label>
              <button onClick={() => setStrokes([])}>Clear drawings</button>
            </div>
          )}

          <div
            ref={paperRef}
            className={`diary-paper paper-${paperPattern}`}
            style={{ backgroundColor: paperColor, touchAction: mode === "draw" ? "none" : "auto" }}
            onPointerDown={handlePaperPointerDown}
            onPointerMove={handlePaperPointerMove}
            onPointerUp={finishDrawing}
            onPointerCancel={finishDrawing}
            onClick={(event) => {
              if (event.target === paperRef.current) setSelectedId(null);
            }}
          >
            <div className="paper-tape" />

            <div className="paper-top">
              <span>10 october 2026 ♡</span>
              <span className="paper-flower">✿</span>
            </div>

            <div className="paper-content">
              <p className="dear">dear diary,</p>
              {elements.length === 0 && (
                <p className="placeholder">add words, photos and little memories...</p>
              )}
            </div>

            <svg className="drawing-layer" aria-hidden="true">
              {[...strokes, ...(activeStroke ? [activeStroke] : [])].map((stroke) => (
                <path
                  key={stroke.id}
                  d={toPath(stroke.points)}
                  fill="none"
                  stroke={stroke.color}
                  strokeWidth={stroke.size}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </svg>

            {elements.map((element, index) => (
              <div
                key={element.id}
                className={`page-element ${selectedId === element.id ? "element-selected" : ""}`}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  transform: `rotate(${element.rotation}deg)`,
                  zIndex: index + 5,
                }}
                onPointerDown={(event) => {
                  if (event.target === event.currentTarget) {
                    startTransform(event, element, "move");
                  }
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedId(element.id);
                }}
              >
                {element.type === "text" && (
                  <textarea
                    className="element-text"
                    value={element.content}
                    placeholder="write something lovely..."
                    onChange={(event) => updateElement(element.id, { content: event.target.value })}
                    onPointerDown={(event) => event.stopPropagation()}
                    spellCheck
                  />
                )}

                {element.type === "image" && (
                  <img
                    className="element-image"
                    src={element.src}
                    alt="Diary memory"
                    draggable={false}
                    onPointerDown={(event) => startTransform(event, element, "move")}
                  />
                )}

                {element.type === "sticker" && (
                  <div
                    className="element-sticker"
                    onPointerDown={(event) => startTransform(event, element, "move")}
                  >
                    {element.content}
                  </div>
                )}

                {selectedId === element.id && (
                  <>
                    <button className="element-delete" title="Delete" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); deleteSelected(); }}>×</button>
                    <button className="element-front" title="Bring forward" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); bringForward(); }}>↑</button>
                    <button className="element-resize" title="Resize" onPointerDown={(event) => startTransform(event, element, "resize")}>↘</button>
                    <button className="element-rotate" title="Rotate" onPointerDown={(event) => startTransform(event, element, "rotate")}>↻</button>
                    <button className="element-move" title="Move" onPointerDown={(event) => startTransform(event, element, "move")}>✥</button>
                  </>
                )}
              </div>
            ))}

            <span className="paper-heart">♡</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DiaryEditor;
