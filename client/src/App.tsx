function App() {
  return (
    <main className="home">

      {/* Header */}
     <header className="header">
  <p>a little place for little things ♡</p>

  <h1>Dear Diary</h1>

  <div className="header-decoration">
    <span>✿</span>
    <i></i>
    <span>✿</span>
  </div>
</header>


      {/* New diary */}
<button className="new-entry">
  <span className="plus">＋</span>
  <span>new diary entry</span>
  <span className="button-heart">♡</span>
</button>


      {/* Main scrapbook */}
      <section className="home-board">

        {/* Diary */}
        <article className="feature diary-feature">

          <div className="tape"></div>

          <div className="feature-content">
            <span className="feature-icon">📖</span>

            <p className="small-label">
              your little corner
            </p>

            <h2>My Diary</h2>

            <p className="handwritten">
              write, draw,
              <br />
              collect little memories ♡
            </p>

            <button className="scrap-button">
              open diary →
            </button>
          </div>

          <span className="flower-decoration">✿</span>
          <span className="heart-decoration">♡</span>

        </article>


        {/* Message */}
        <article className="feature message-feature">

          <div className="message-decoration">
            ♡
          </div>

          <div className="feature-content">

            <span className="feature-icon">💌</span>

            <p className="small-label">
              just because
            </p>

            <h2>Send a Little Message</h2>

            <p className="handwritten">
              write something sweet
              <br />
              for someone you love
            </p>

            <button className="scrap-button">
              write a message →
            </button>

          </div>

        </article>


        {/* Bouquet */}
        <article className="feature bouquet-feature">

          <div className="feature-content">

            <span className="feature-icon">💐</span>

            <p className="small-label">
              a little something
            </p>

            <h2>Make a Little Bouquet</h2>

            <p className="handwritten">
              pick some flowers,
              <br />
              add a little note ♡
            </p>

            <button className="scrap-button">
              make a bouquet →
            </button>

          </div>

          <div className="flower-row">
            🌷 🌸 🌼 🌷
          </div>

        </article>


        {/* Tiny scrapbook pieces */}
        <div className="sticker sticker-one">✿</div>
        <div className="sticker sticker-two">♡</div>
        <div className="sticker sticker-three">✧</div>

        <div className="tiny-note">
          keep the little things ♡
        </div>

      </section>

    </main>
  );
}

export default App;