import BookCall from '../BookCall';
import { EMAIL, MAILTO } from '../../lib/site';

export default function Closing() {
  return (
    <section id="book" data-scene="closing">
      <div className="stk col" data-sticky>
        <h2 className="close-h">
          <span className="ln"><span className="w" data-cw>We</span><span className="w" data-cw>make</span></span>
          <span className="ln"><span className="w" data-cw>your</span><span className="w" data-cw>systems</span></span>
          <span className="ln"><span className="w" data-cw>think.</span></span>
        </h2>
        <div className="cta" data-cc>
          <BookCall className="btn">Book a scoping call</BookCall>
          <a className="mono mail" href={MAILTO}>{EMAIL}</a>
        </div>
      </div>
    </section>
  );
}
