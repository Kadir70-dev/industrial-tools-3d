'use client';
import dynamic from 'next/dynamic';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, CircleHelp, Mail, MapPin, Menu, MessageCircle, Navigation, Pause, Phone, Play, RotateCcw, Search, X, ZoomIn } from 'lucide-react';
import { categories, products, type Product } from '@/lib/products';
import ToolVisual from './ToolVisual';
import type { Hotspot } from './DrillModel';
import { siteConfig } from '@/lib/site';

const DrillModel = dynamic(() => import('./DrillModel').then(m => m.DrillModel), {
  ssr: false,
  loading: () => <div className="model-loading"><span className="loader-ring" /> Building the model</div>,
});

const solutions = [
  { n: '01', problem: 'The wrong tool slows the right crew.', solution: 'Start with the task, material and working conditions.', benefit: 'A more considered shortlist for the job at hand.' },
  { n: '02', problem: 'Specifications are hard to compare.', solution: 'See the details that matter side by side.', benefit: 'Make choices with clearer product information.' },
  { n: '03', problem: 'Sourcing feels scattered.', solution: 'Bring equipment and compatible essentials together.', benefit: 'A simpler route from selection to quote.' },
];
const method = [
  { label: 'FIND THE FIT', title: 'Selection starts with your application.', copy: 'Browse by category and share the job you need to get done.', href: '#collection' },
  { label: 'SEE THE DETAILS', title: 'Product information, made clearer.', copy: 'Review the specifications and product information available on each tool.', href: '#collection' },
  { label: 'MOVE WITH CLARITY', title: 'A simpler path to a quotation.', copy: 'Add products to your enquiry and tell us what you need to evaluate.', href: '#contact' },
];
const process = [
  ['01', 'Understand', 'We learn about the application, material and working environment.'],
  ['02', 'Select', 'Explore equipment and accessories against the stated requirements.'],
  ['03', 'Quote', 'Share a request with the products you want to evaluate.'],
  ['04', 'Support', 'Continue the conversation through your preferred contact channel.'],
];
const impact = [
  ['Clearer product choices', 'A focused collection helps you get to relevant equipment faster.'],
  ['Better specification visibility', 'See the product details available before you ask for a quote.'],
  ['Easier comparison', 'Explore options across key tool categories in one place.'],
  ['Simpler quote requests', 'Share products and application details in one enquiry.'],
  ['More organized procurement', 'Keep equipment and related accessories together as you plan.'],
];
const sorts = ['Featured', 'Name A–Z'];

const brand = siteConfig.brand;
const pad = (n: number) => String(n).padStart(2, '0');
const partNo = (p: Product) => `${brand.code}-${p.id.toUpperCase()}`;
const featured = products.find(p => p.id === siteConfig.featuredProductId) ?? products[0];
const featuredSpec = featured.spec.split(' · ');
const hotspots: Hotspot[] = [
  { id: 'motor', index: '01', label: 'Motor housing detail', detail: 'Durable housing', position: [-.45, .74, .43] },
  { id: 'battery', index: '02', label: 'Battery detail', detail: '18V battery platform', position: [.1, -.98, .41] },
  { id: 'chuck', index: '03', label: 'Chuck detail', detail: 'Metal keyless chuck', position: [1.09, .42, .26] },
];
const OfficeMap = dynamic(() => import('./OfficeMap'), { ssr: false, loading: () => <div className="office-map is-idle"><div className="office-map-skeleton" /></div> });
const { contact, office } = siteConfig;
const digits = (v: string) => v.replace(/\D/g, '');
const whatsappHref = contact.whatsapp ? `https://wa.me/${digits(contact.whatsapp)}?text=${encodeURIComponent(`Hello ${siteConfig.brand.name}, I'd like to ask about your tools.`)}` : '';
const directionsHref = office.exact ? `https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}` : '';
const galleryProducts = [products[0], products[1], products[2], products[4], products[6], products[3], products[7], products[5]];
const countFor = (c: string) => (c === 'All tools' ? products.length : products.filter(p => p.category === c).length);

function Tape({ children }: { children: React.ReactNode }) {
  return <em className="tape">{children}</em>;
}
function SectionTag({ n, children }: { n: string; children: React.ReactNode }) {
  return <div className="section-tag"><b>{n}</b><span>{children}</span></div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState('All tools');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('Featured');
  const [selected, setSelected] = useState<Product | null>(null);
  const [viewer, setViewer] = useState(false);
  const [viewerKey, setViewerKey] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState('');
  const [hoverPaused, setHoverPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'ready'>('idle');
  const paused = hoverPaused || userPaused;

  // Product dialog: focus the close button, trap Tab, close on Escape and return focus to the opener.
  useEffect(() => {
    if (!selected) return;
    const opener = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLElement>('.product-modal');
    dialog?.querySelector<HTMLElement>('.modal-close')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSelected(null); return; }
      if (e.key !== 'Tab' || !dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>('button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'));
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); opener?.focus?.({ preventScroll: true }); };
  }, [selected]);

  useEffect(() => {
    if (formState !== 'ready') return;
    const t = setTimeout(() => setFormState('idle'), 5500);
    return () => clearTimeout(t);
  }, [formState]);

  // Scroll reveals and hero intro; skipped entirely for reduced motion.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ctx: { revert: () => void } | undefined;
    import('gsap').then(({ gsap }) => import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.reveal').forEach(el => gsap.fromTo(el, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
        gsap.fromTo('.hero-copy > *', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .08, ease: 'power3.out', delay: .1 });
        gsap.fromTo('.leader', { strokeDashoffset: 240 }, { strokeDashoffset: 0, duration: 1.1, stagger: .15, ease: 'power2.inOut', delay: .6 });
      }, document.body);
    }));
    return () => ctx?.revert();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const items = products.filter(p => (category === 'All tools' || p.category === category) && `${p.name} ${p.category} ${p.spec}`.toLowerCase().includes(q));
    return sort === 'Name A–Z' ? [...items].sort((a, b) => a.name.localeCompare(b.name)) : items;
  }, [category, query, sort]);

  const addToQuote = (p: Product) => {
    setSelected(null);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('#quote-message');
      if (input) input.value = `I'd like to request a quote for ${p.name}.`;
    }, 500);
  };
  const browseCategory = (c: string) => {
    setCategory(c);
    setQuery('');
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setFormState('ready');
    form.reset();
  }
  const navLinks: [string, string, string][] = [['#collection', 'Tools', '01'], ['#approach', 'Our approach', '02'], ['#impact', `Why ${brand.name}`, '03'], ['#contact', 'Contact', '04']];

  return <main>
    <a className="skip-link" href="#collection">Skip to the catalogue</a>
    <div className="spec-strip" aria-hidden="true"><span>{brand.name.toUpperCase()} {brand.division.toUpperCase()}</span><span>PROFESSIONAL HARDWARE CATALOGUE</span><span>CATALOGUE DATA IS ILLUSTRATIVE</span></div>
    <header className="site-header">
      <a className="brand" href="#top" aria-label={`${brand.name} ${brand.division} home`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="brand-mark-img" src={brand.logo.markInk} alt="" width={145} height={160} />
        <span className="brand-text">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-word-img" src={brand.logo.wordInk} alt={brand.name} width={345} height={96} />
          <span className="brand-sub">{brand.division}</span>
        </span>
      </a>
      <nav className={menuOpen ? 'nav nav--open' : 'nav'} aria-label="Main navigation">
        {navLinks.map(([href, label, n]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}><span className="nav-index">{n}</span>{label}</a>)}
      </nav>
      <a className="header-cta" href="#contact"><span><span className="cta-long">Request a </span>quote</span> <ArrowUpRight size={16} aria-hidden="true" /></a>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <section id="top" className="hero">
      <div className="sheet">
        <div className="ruler ruler--x" aria-hidden="true">{['A', 'B', 'C', 'D', 'E', 'F'].map(l => <span key={l}>{l}</span>)}</div>
        <div className="ruler ruler--y" aria-hidden="true">{['1', '2', '3', '4'].map(l => <span key={l}>{l}</span>)}</div>
        <div className="hero-copy">
          <p className="kicker">Built around the work</p>
          <h1>Engineered for every <Tape>challenge.</Tape></h1>
          <p className="hero-intro">Professional tools, considered down to the last detail. Find the equipment that fits your work.</p>
          <div className="hero-actions">
            <a className="btn btn--signal" href="#collection">Explore tools <ArrowRight size={18} aria-hidden="true" /></a>
            <a className="btn btn--ghost" href="#contact">Request a quote <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="hero-stage">
          <div className="hero-drill"><DrillModel /></div>
          <svg className="leaders" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className="leader" d="M44 30 L30 14 L8 14" /><path className="leader" d="M70 44 L84 30 L97 30" /><path className="leader" d="M52 76 L38 90 L10 90" />
          </svg>
          {[[44, 30], [70, 44], [52, 76]].map(([x, y]) => <span key={x} className="leader-dot" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true" />)}
          <span className="callout callout--a"><b>A</b>Compact motor housing</span>
          <span className="callout callout--b"><b>B</b>Keyless chuck</span>
          <span className="callout callout--c"><b>C</b>Interchangeable battery</span>
          <a href="#problems" className="scroll-cue">Scroll <ArrowDown size={14} aria-hidden="true" /></a>
        </div>
        <dl className="title-block">
          <div className="tb-wide"><dt>Part</dt><dd>{featured.name}</dd></div>
          <div><dt>Class</dt><dd>{featured.category}</dd></div>
          {featuredSpec.map((s, i) => <div key={s}><dt>{['Platform', 'Torque', 'Gearbox'][i] ?? 'Spec'}</dt><dd>{s}</dd></div>)}
          <div><dt>Sheet</dt><dd>01 / {pad(products.length)}</dd></div>
        </dl>
      </div>
    </section>

    <nav className="category-strip" aria-label="Browse by category">
      {categories.slice(1).map(c => <button key={c} onClick={() => browseCategory(c)}>{c}<span>{pad(countFor(c))}</span></button>)}
    </nav>

    <section id="problems" className="faults">
      <div className="wrap">
        <div className="block-head reveal">
          <SectionTag n="01">The reality on site</SectionTag>
          <h2>Good work starts with <Tape>good choices.</Tape></h2>
          <p>When tools, specs and sourcing live in different places, even a straightforward job takes more effort than it should.</p>
        </div>
        <div className="ledger" role="table" aria-label="Common sourcing problems and expected benefits">
          <div className="ledger-row ledger-row--head" role="row"><span role="columnheader">Ref.</span><span role="columnheader">Problem</span><span role="columnheader">Response</span><span role="columnheader">Expected benefit</span></div>
          {solutions.map(s => <div className="ledger-row reveal" role="row" key={s.n}>
            <span role="cell" className="ledger-ref">F-{s.n}</span>
            <h3 role="cell">{s.problem}</h3>
            <p role="cell">{s.solution}</p>
            <p role="cell" className="ledger-benefit">{s.benefit}</p>
          </div>)}
        </div>
      </div>
    </section>

    <section id="approach" className="method">
      <div className="wrap">
        <div className="block-head block-head--dark reveal">
          <SectionTag n="02">A clearer way forward</SectionTag>
          <h2>From the first question <Tape>to the last fix.</Tape></h2>
          <p>We make it easier to explore your options, understand product details and ask for the right conversation.</p>
        </div>
        <div className="plates">
          {method.map((m, i) => <article className="plate reveal" key={m.label}>
            <span className="plate-num" aria-hidden="true">{pad(i + 1)}</span>
            <span className="plate-label">{m.label}</span>
            <h3>{m.title}</h3>
            <p>{m.copy}</p>
            <a href={m.href} className="plate-link">{i === 2 ? 'Start an enquiry' : 'Open the catalogue'} <ArrowUpRight size={16} aria-hidden="true" /></a>
          </article>)}
        </div>
      </div>
    </section>

    <section id="collection" className="collection">
      <div className="wrap">
        <div className="block-head reveal">
          <SectionTag n="03">The tool room</SectionTag>
          <h2>Tools for <Tape>the whole job.</Tape></h2>
          <p>Explore power tools, essentials and accessories. Product data shown is editable demonstration content.</p>
        </div>
        <div className="catalog">
          <aside className="catalog-index">
            <span className="index-title">Categories</span>
            <div className="category-tabs" role="tablist" aria-label="Filter tools by category">
              {categories.map(c => <button key={c} role="tab" aria-selected={category === c} className={category === c ? 'category-tab is-active' : 'category-tab'} onClick={() => setCategory(c)}>
                <span>{c}</span><b>{pad(countFor(c))}</b>
              </button>)}
            </div>
          </aside>
          <div className="catalog-main">
            <div className="catalog-bar">
              <label className="catalog-search"><Search size={18} aria-hidden="true" /><input aria-label="Search tools" placeholder="Search by name or spec" value={query} onChange={e => setQuery(e.target.value)} /></label>
              <label className="catalog-sort"><span>Sort</span><span className="select-wrap"><select aria-label="Sort products" value={sort} onChange={e => setSort(e.target.value)}>{sorts.map(s => <option key={s}>{s}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></span></label>
              <span className="catalog-count" aria-live="polite">{pad(filtered.length)} results</span>
            </div>
            <div className="product-grid">
              {filtered.map(p => <article key={p.id} className="product-card reveal">
                <button className="product-hitarea" onClick={() => setSelected(p)} aria-label={`View ${p.name} details`}>
                  <span className="tag-head"><span className="tag-hole" aria-hidden="true" /><span className="product-index">{partNo(p)}</span><span className="product-category">{p.category}</span></span>
                  <span className="product-art-wrap"><ToolVisual product={p} /></span>
                  <span className="product-info">
                    <h3>{p.name}</h3>
                    <span className="product-desc">{p.descriptor}</span>
                    <span className="spec-rows">{p.spec.split(' · ').map(s => <span key={s}>{s}</span>)}</span>
                  </span>
                  <span className="tag-foot">View details <ArrowUpRight size={15} aria-hidden="true" /></span>
                </button>
              </article>)}
            </div>
            {filtered.length === 0 && <div className="empty-state" role="status"><Search aria-hidden="true" /><h3>No tools found</h3><p>Try a different name or category.</p><button className="btn btn--ghost" onClick={() => { setQuery(''); setCategory('All tools'); }}>Clear filters <ArrowRight size={16} aria-hidden="true" /></button></div>}
          </div>
        </div>
      </div>
    </section>

    <section className="featured" aria-labelledby="featured-title">
      <div className="wrap featured-grid">
        <div className="featured-model">
          <div className="bay-head"><span>Inspection bay / {featured.name}</span><span>360° product view</span></div>
          <div className="viewer-stage">
            <span className="bracket bracket--tl" aria-hidden="true" /><span className="bracket bracket--tr" aria-hidden="true" /><span className="bracket bracket--bl" aria-hidden="true" /><span className="bracket bracket--br" aria-hidden="true" />
            <div className="viewer-model"><DrillModel key={viewerKey} interactive scale={viewer ? 1.18 : 1} hotspots={hotspots} activeHotspot={activeHotspot} onHotspot={id => setActiveHotspot(a => (a === id ? '' : id))} /></div>
            <div className="viewer-controls">
              <button aria-label="Reset viewer" onClick={() => { setActiveHotspot(''); setViewer(false); setViewerKey(k => k + 1); }}><RotateCcw size={17} /></button>
              <button aria-label="Zoom product" aria-pressed={viewer} onClick={() => setViewer(!viewer)}><ZoomIn size={17} /></button>
            </div>
            <div className="drag-hint">Drag to rotate · tap a marker</div>
          </div>
        </div>
        <div className="featured-side reveal">
          <SectionTag n="04">Made to move with you</SectionTag>
          <h2 id="featured-title">Control in <Tape>your hands.</Tape></h2>
          <p>A balanced 18V drill concept with a keyless chuck, ergonomic grip and a swappable battery. Explore the form from every angle.</p>
          <dl className="spec-sheet">
            <div><dt>Part no.</dt><dd>{partNo(featured)}</dd></div>
            {featuredSpec.map((s, i) => <div key={s}><dt>{['Platform', 'Torque', 'Gearbox'][i] ?? 'Spec'}</dt><dd>{s}</dd></div>)}
            <div><dt>Use</dt><dd>{featured.descriptor}</dd></div>
          </dl>
          <div className="featured-actions">
            <button className="btn btn--signal" onClick={() => addToQuote(featured)}>Request details <ArrowRight size={18} aria-hidden="true" /></button>
            <button className="btn btn--ghost-dark" onClick={() => { document.querySelector('.featured-model')?.scrollIntoView({ behavior: 'smooth' }); setViewer(true); }}>Zoom the drill</button>
          </div>
        </div>
      </div>
    </section>

    <section id="delivery" className="process">
      <div className="wrap">
        <div className="block-head reveal">
          <SectionTag n="05">From need to next step</SectionTag>
          <h2>Four steps. <Tape>One clear path.</Tape></h2>
          <p>Every project begins with a conversation about what the work requires.</p>
        </div>
        <ol className="stations">
          {process.map(([n, title, copy]) => <li className="station reveal" key={n}>
            <span className="station-num">{n}</span>
            <span className="station-label">Stage {n}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </li>)}
        </ol>
      </div>
    </section>

    <section id="impact" className="impact">
      <div className="wrap impact-grid">
        <div className="block-head block-head--dark reveal">
          <SectionTag n="06">What better looks like</SectionTag>
          <h2>Make the <Tape>work flow.</Tape></h2>
          <p>A procurement experience built around clarity. Practical improvements to support better informed next steps — no claims, just a clearer process.</p>
        </div>
        <ul className="checklist">
          {impact.map(([title, copy], i) => <li className="check-item reveal" key={title}>
            <span className="check-box" aria-hidden="true"><Check size={18} /></span>
            <span className="check-num">{pad(i + 1)}</span>
            <div><h3>{title}</h3><p>{copy}</p></div>
          </li>)}
        </ul>
      </div>
    </section>

    <section className="gallery-section" aria-label="Product gallery" onMouseEnter={() => setHoverPaused(true)} onMouseLeave={() => setHoverPaused(false)} onFocus={() => setHoverPaused(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHoverPaused(false); }}>
      <div className="gallery-head">
        <span>The {brand.name} tool room / {pad(galleryProducts.length)} items</span>
        <button onClick={() => setUserPaused(!userPaused)} aria-pressed={userPaused} aria-label={userPaused ? 'Play product gallery' : 'Pause product gallery'}>{userPaused ? <Play size={15} /> : <Pause size={15} />}<span>{userPaused ? 'Play' : 'Pause'}</span></button>
      </div>
      <div className={`gallery-track ${paused ? 'is-paused' : ''}`}>
        {[0, 1].map(copy => <div className="gallery-set" key={copy} aria-hidden={copy === 1}>
          {galleryProducts.map(p => <button className="gallery-item" key={`${copy}-${p.id}`} onClick={() => setSelected(p)} aria-label={`View ${p.name}`} tabIndex={copy === 1 ? -1 : 0}>
            <span className="gallery-visual"><ToolVisual product={p} /></span>
            <span className="gallery-caption"><span>{partNo(p)}</span><span>{p.name}</span></span>
          </button>)}
        </div>)}
      </div>
      <div className="conveyor" aria-hidden="true" />
    </section>

    <section className="contact" id="contact">
      <div className="wrap contact-grid">
        <div className="contact-left reveal">
          <SectionTag n="07">Let’s talk about the work</SectionTag>
          <h2>The right tool is <Tape>a good start.</Tape></h2>
          <p>Tell us what you’re working on. We’ll use the details you share to start a conversation about relevant products.</p>
          <ol className="contact-steps"><li>Fill in the work order</li><li>Name the tools or the task</li><li>We follow up on the details</li></ol>
          <a className="plate-link" href="#collection">Browse the tool room <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <form className="quote-form reveal" onSubmit={submit}>
          <div className="form-heading"><span>Work order · quotation request</span><span>Draft</span></div>
          <div className="form-row">
            <label>Your name<input required name="name" autoComplete="name" placeholder="Name" /></label>
            <label>Work email<input required name="email" type="email" autoComplete="email" placeholder="you@company.com" /></label>
          </div>
          <div className="form-row">
            <label>Company <small>Optional</small><input name="company" autoComplete="organization" placeholder="Company name" /></label>
            <label>Phone <small>Optional</small><input name="phone" type="tel" autoComplete="tel" placeholder="+971 00 000 0000" /></label>
          </div>
          <label>What are you looking for?<span className="select-wrap"><select required name="interest" defaultValue=""><option value="" disabled>Select a product category</option>{categories.slice(1).map(c => <option key={c}>{c}</option>)}<option>Multiple categories</option><option>Help with selection</option></select><ChevronDown size={16} aria-hidden="true" /></span></label>
          <label>Tell us about the application<input id="quote-message" required name="message" placeholder="Material, task, quantity or specification…" /></label>
          <label className="consent"><input type="checkbox" required /><span>I agree to be contacted about this enquiry.</span></label>
          <button className="btn btn--signal form-submit" type="submit">Prepare enquiry <ArrowRight size={18} aria-hidden="true" /></button>
          <p className="form-disclaimer">This frontend demo does not send or store your information. Submit validation is local only; connect a delivery endpoint before collecting real enquiries.</p>
          {formState === 'ready' && <div className="form-success" role="status"><Check size={18} aria-hidden="true" /><span>Your details passed local validation. No enquiry was sent; this demo has no delivery endpoint.</span></div>}
        </form>
      </div>
    </section>

    <section className="office" id="office" aria-labelledby="office-title">
      <div className="wrap office-grid">
        <div className="office-card reveal">
          <SectionTag n="08">Visit the office</SectionTag>
          <h2 id="office-title">Come and see <Tape>the tools.</Tape></h2>
          <dl className="spec-sheet spec-sheet--light office-details">
            <div><dt><MapPin size={14} aria-hidden="true" /> Address</dt><dd>{contact.address || <>{office.city}<span className="office-pending">Full address coming soon</span></>}</dd></div>
            {contact.phone && <div><dt><Phone size={14} aria-hidden="true" /> Phone</dt><dd><a href={`tel:+${digits(contact.phone)}`}>{contact.phone}</a></dd></div>}
            {contact.whatsapp && <div><dt><MessageCircle size={14} aria-hidden="true" /> WhatsApp</dt><dd><a href={whatsappHref} target="_blank" rel="noopener noreferrer">{contact.whatsapp}</a></dd></div>}
            {contact.email && <div><dt><Mail size={14} aria-hidden="true" /> Email</dt><dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>}
          </dl>
          <div className="featured-actions">
            {directionsHref && <a className="btn btn--signal" href={directionsHref} target="_blank" rel="noopener noreferrer">Get directions <Navigation size={18} aria-hidden="true" /></a>}
            {whatsappHref && <a className="btn btn--ghost" href={whatsappHref} target="_blank" rel="noopener noreferrer">Chat on WhatsApp <MessageCircle size={18} aria-hidden="true" /></a>}
            <a className="btn btn--ghost" href="#contact">Send an enquiry <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="office-frame reveal">
          <div className="bay-head bay-head--light"><span>Location / {office.exact ? 'Office' : office.city}</span><span>{office.exact ? `${office.lat.toFixed(4)}°N ${office.lng.toFixed(4)}°E` : 'Pin pending'}</span></div>
          <OfficeMap />
        </div>
      </div>
    </section>

    <footer className="footer">
      <div className="wrap footer-top">
        <div className="footer-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="footer-logo" src={brand.logo.lockupWhite} alt={`${brand.name} ${brand.division}`} width={570} height={200} loading="lazy" />
          <p>Professional hardware.<br />A more considered way to choose.</p>
        </div>
        <div className="footer-links"><a href="#collection">Tools</a><a href="#approach">Approach</a><a href="#impact">Why {brand.name}</a><a href="#contact">Contact</a><a href="#office">Office</a><a href="#top">Back to top ↑</a></div>
      </div>
      <div className="wordmark" data-word={brand.name.toUpperCase()} aria-hidden="true" />
      <div className="wrap footer-base"><span>© 2026 {brand.name} {brand.division}</span><span>Built around the work.</span></div>
    </footer>

    {whatsappHref && <a className="wa-float" href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label={`Chat with ${brand.name} on WhatsApp`}><MessageCircle size={26} aria-hidden="true" /></a>}

    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null); }}>
      <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close details"><X /></button>
        <div className="modal-art"><span className="product-index">{partNo(selected)}</span><ToolVisual product={selected} large /></div>
        <div className="modal-info">
          <span className="kicker">{selected.category}</span>
          <h2 id="modal-title">{selected.name}</h2>
          <p>{selected.descriptor}</p>
          <dl className="spec-sheet spec-sheet--light">{selected.spec.split(' · ').map((s, i) => <div key={s}><dt>Spec {pad(i + 1)}</dt><dd>{s}</dd></div>)}<div><dt>Pricing</dt><dd>{selected.priceNote}</dd></div></dl>
          <div className="modal-note"><CircleHelp size={16} aria-hidden="true" /><span>Specifications are demonstration content. Confirm exact product details during quotation.</span></div>
          <button className="btn btn--signal" onClick={() => addToQuote(selected)}>Ask about this tool <ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </section>
    </div>}
  </main>;
}
