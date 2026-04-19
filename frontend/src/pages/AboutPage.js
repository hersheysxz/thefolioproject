import ArtQuiz from "../components/ArtQuiz";
import art9 from "../assets/art9.jpg";
import art7 from "../assets/art7.jpg";
import art2 from "../assets/art2.jpg";
import "../styles/AboutPage.css";

function AboutPage() {
  return (
    <div className="about-page">
      <main className="about-shell">
        <section className="about-hero">
          <div className="about-hero-inner">
            <div className="about-hero-copy">
              <span className="about-kicker">About the Project</span>
              <h1>Where unease, memory, and visual storytelling meet.</h1>
              <p>
                <strong>Almost Real</strong> grew out of a fascination with the
                uncanny point where something familiar starts to feel strange.
                The work explores how contrast, distortion, and atmosphere can
                communicate emotions that are difficult to say directly.
              </p>
              <div className="about-hero-stats">
                <div className="about-stat">
                  <strong>2021</strong>
                  <span>Started building the foundation in traditional media</span>
                </div>
                <div className="about-stat">
                  <strong>Digital</strong>
                  <span>Developed a texture-first visual workflow</span>
                </div>
                <div className="about-stat">
                  <strong>Surreal</strong>
                  <span>Driven by Van Gogh and Junji Ito influences</span>
                </div>
              </div>
            </div>

            <div className="about-hero-visual">
              <img src={art9} alt="Artistic study of light and shadow" />
            </div>
          </div>
        </section>

        <div className="about-grid">
          <section className="about-card wide">
            <h2>My Creative Journey</h2>
            <div className="about-journey-grid">
              <div>
                <p>
                  My connection to this theme comes from a long interest in how
                  visual contrast can reflect internal emotions. I am drawn to
                  images that feel emotionally true even when they are visually
                  impossible.
                </p>
                <p>
                  I draw heavily from the surrealism of Van Gogh and the
                  narrative dread of Junji Ito, combining those influences into a
                  digital-first workflow that emphasizes texture, mood, and
                  tension over realism.
                </p>
              </div>
              <img src={art7} alt="Surrealism study" />
            </div>
          </section>

          <section className="about-card">
            <h2>Evolution of Style</h2>
            <ol className="timeline-list">
              <li>
                <strong>The Foundation (2021):</strong> Mastered traditional
                charcoal and fine-liner techniques.
              </li>
              <li>
                <strong>Digital Transition (2022):</strong> Shifted to tablets,
                focusing on high-contrast grayscale compositions.
              </li>
              <li>
                <strong>Project Inception (2023):</strong> Launched the Almost
                Real series to explore horror-tinged surrealism.
              </li>
              <li>
                <strong>Refinement (2024):</strong> Started blending 3D textures
                into 2D manga-inspired illustration.
              </li>
            </ol>
          </section>

          <section className="about-card">
            <h2>What Inspires the Work</h2>
            <p>
              I am captivated by the way art can bridge the gap between dreams
              and waking life. The goal is to create pieces that feel like
              memories of things that never quite happened.
            </p>
            <div className="about-image-row">
              <div className="art-frame">
                <img src={art7} alt="Surrealism study" />
              </div>
              <div className="art-frame">
                <img src={art2} alt="Texture study" />
              </div>
            </div>
            <blockquote className="neutral-quote">
              "I would rather die of passion than of boredom." - Vincent Van Gogh
            </blockquote>
          </section>
        </div>

        <section className="about-quiz">
          <h2 className="section-heading">Art Knowledge Challenge</h2>
          <div className="heading-line"></div>
          <div className="quiz-box">
            <ArtQuiz />
          </div>
        </section>
      </main>

      <footer className="footer about-footer">
        <p>Contact: rachelregacho645@gmail.com | Instagram: @almostreal</p>
        <p>Copyright 2026 Almost Real Portfolio</p>
      </footer>
    </div>
  );
}

export default AboutPage;
