import './About.css'

function About() {
  return (
    <div className="about">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-title">
            About <span className="title-highlight-green">Lemur</span>{' '}
            <span className="title-highlight-yellow">Store</span>
          </h1>
        </div>
      </div>
      <div className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            At Lemur Store, we're passionate about connecting lemur enthusiasts with
            the perfect companions. We've been serving the lemur community for over
            a decade, providing high-quality lemurs to loving homes.
          </p>
        </div>
        <div className="about-section">
          <h2>Why Choose Us?</h2>
          <ul>
            <li>Wide selection of premium lemur breeds</li>
            <li>Expert care and health guarantees</li>
            <li>Comprehensive support and resources</li>
            <li>Ethical sourcing and breeding practices</li>
          </ul>
        </div>
        <div className="about-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2013, Lemur Store began as a small family business dedicated
            to the care and preservation of these magnificent creatures. Today, we're
            proud to be one of the most trusted lemur retailers, with thousands of
            satisfied customers worldwide.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About

