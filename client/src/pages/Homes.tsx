import { Link } from "react-router-dom";

function Home() {
  return (
   <main className="home">

      <p className="top-note">
        a little place for little things ♡
      </p>

      <header className="header">
        <h1>Dear Diary</h1>
        <div className="title-doodle">✿ ✿</div>
      </header>

       <Link to="/diary/new" className="new-entry">
  <span>＋</span>
  new diary entry
  <span>♡</span>
</Link>

      <section className="scrapbook">

        {/* Decorative pieces */}
        <span className="decor flower-one">✿</span>
        <span className="decor star-one">✦</span>
        <span className="decor heart-one">♡</span>


        {/* DIARY */}
        <article className="scrap diary-scrap">

          <div className="tape"></div>

          <p className="scribble pink">
            your little corner
          </p>

          <h2>My Diary</h2>

          <p className="description">
            write, draw,
            <br />
            collect little memories ♡
          </p>

         <Link to="/diary/new" className="scrap-button">
  open diary →
</Link>

          <span className="card-flower">✿</span>
          <span className="card-heart">♡</span>

        </article>


        {/* MESSAGE */}
        <article className="scrap message-scrap">

          <span className="message-sticker">♡</span>

          <p className="scribble pink">
            just because
          </p>

          <h2>
            Send a Little
            <br />
            Message
          </h2>

          <p className="description">
            write something sweet
            <br />
            for someone you love
          </p>

          <button className="scrap-link">
            write a message →
          </button>

          <span className="message-flower">✿</span>

        </article>


        {/* BOUQUET */}
        <article className="scrap bouquet-scrap">

          <div className="bouquet-copy">

            <p className="scribble pink">
              a little something
            </p>

            <h2>
              Make a Little Bouquet
            </h2>

            <p className="description">
              pick some flowers,
              <br />
              add a little note ♡
            </p>

            <button className="scrap-link">
              make a bouquet →
            </button>

          </div>

          <div className="bouquet-drawing">
            <span>🌷</span>
            <span>🌸</span>
            <span>🌼</span>
            <span>🌷</span>
          </div>

        </article>


        {/* Tiny decorations */}
        <span className="decor flower-two">✿</span>
        <span className="decor star-two">✧</span>

      </section>

    </main>
  );
}

export default Home;