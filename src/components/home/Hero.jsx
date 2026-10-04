import BookCall from '../BookCall';

export default function Hero() {
  return (
    <section id="hero" data-scene="hero">
      <div className="a-in col">
        <div className="kick mono land">AI ENGINEERING LAB</div>
        <h1>
          <span className="ln land">We engineer</span>
          <span className="ln land">AI into how</span>
          <span className="ln land">your company</span>
          <span className="ln land">works.</span>
        </h1>
        <p className="lede land">
          We design, build and run production AI systems inside your product and operations: agents,
          models and the data plumbing underneath. Then we hand them to a team that knows how to own them.
        </p>
        <div className="cta land">
          <BookCall className="btn">Book a scoping call</BookCall>
          <a className="lnk" href="#process">See how we work</a>
        </div>
      </div>
    </section>
  );
}
