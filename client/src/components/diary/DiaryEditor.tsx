import "./DiaryEditor.css";

function DiaryEditor() {
  return (
    <main className="diary-editor">

      <button className="floating-back">← back</button>

      <button className="floating-save">save ♡</button>

      <section className="editor-stage">

        <div className="editor-tools">
          <button>T</button>
          <button>▧</button>
          <button>✿</button>
          <button>〰</button>
        </div>

        <div className="diary-paper">

          <div className="paper-tape" />

          <div className="paper-top">
            <span>28 september 2026 ♡</span>
            <span className="paper-flower">✿</span>
          </div>

          <div className="paper-content">
            <p className="dear">dear diary,</p>

            <p className="placeholder">
              start writing something...
            </p>
          </div>

          <span className="paper-heart">♡</span>

        </div>

      </section>

    </main>
  );
}

export default DiaryEditor;