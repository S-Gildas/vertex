import { Badge, Button as SampleButton, Icon, ProgressBar, VertexLogo } from "@/components/vertex-ui";

const primary = [["Primary 500", "#F97316"], ["Primary 400", "#FB923C"], ["Primary 300", "#FDBA74"], ["Primary 200", "#FED7AA"], ["Primary 100", "#FFF7ED"]];
const neutral = [["Neutral 900", "#0F172A"], ["Neutral 700", "#334155"], ["Neutral 500", "#64748B"], ["Neutral 300", "#CBD5E1"], ["Neutral 200", "#E2E8F0"], ["Neutral 100", "#F1F5F9"], ["Neutral 50", "#FAFAFC"], ["White", "#FFFFFF"]];
const typeScale = [
  ["Display 1", "Playfair Display", "48 / 56", "Bold", "Page titles"],
  ["Display 2", "Playfair Display", "36 / 44", "Bold", "Section titles"],
  ["Heading 1", "Inter", "28 / 36", "Semi Bold", "Card titles"],
  ["Heading 2", "Inter", "22 / 30", "Semi Bold", "Sub section"],
  ["Heading 3", "Inter", "18 / 26", "Medium", "Small titles"],
  ["Body Large", "Inter", "16 / 24", "Regular", "Body copy"],
  ["Body", "Inter", "14 / 20", "Regular", "Supporting text"],
  ["Small", "Inter", "12 / 16", "Regular", "Captions, meta"],
];
const iconNames = ["bell", "search", "play", "document", "bookmark", "signal", "clock", "user", "chevron"] as const;

function SectionTitle({ number, children }: { number: string; children: React.ReactNode }) {
  return <h2 className="section-title"><span>{number}</span>{children}</h2>;
}

function ColorSample({ name, hex }: { name: string; hex: string }) {
  return <div className="color-sample"><div className="color-chip" style={{ backgroundColor: hex }} /><span>{name}</span><span>{hex}</span></div>;
}

export default function Home() {
  return <main className="design-system">
    <section className="panel hero-panel" aria-label="Vertex design system introduction and colors">
      <div className="hero-intro"><VertexLogo size="large" /><h1>Design System</h1><p>A unified design language for Vertex learning platform. Clean, modern and focused on clarity, consistency and intuitive learning experiences.</p><div className="version">VERSION 1.0 <span>·</span> MAY 2025</div></div>
      <div className="hero-colors"><SectionTitle number="01">Colors</SectionTitle><h3 className="color-group-title">Primary</h3><div className="color-row primary-row">{primary.map(([name, hex]) => <ColorSample key={name} name={name} hex={hex} />)}</div><h3 className="color-group-title neutral-title">Neutral</h3><div className="color-row neutral-row">{neutral.map(([name, hex]) => <ColorSample key={name} name={name} hex={hex} />)}</div></div>
    </section>

    <div className="layout-row type-row">
      <section className="panel typography-panel"><SectionTitle number="02">Typography</SectionTitle><div className="font-example"><div className="font-glyph display-font">Ag</div><div><h3 className="display-font">Playfair Display</h3><p>Elegant <b>·</b> Readable <b>·</b> Timeless</p></div></div><div className="font-example"><div className="font-glyph">Ag</div><div><h3>Inter</h3><p>Clean <b>·</b> Modern <b>·</b> Highly legible</p></div></div></section>
      <section className="panel type-scale-panel"><SectionTitle number="03">Type Scale</SectionTitle><div className="table-scroll"><table className="type-table"><thead><tr><th>Style</th><th>Font</th><th>Size / Line Height</th><th>Weight</th><th>Use</th></tr></thead><tbody>{typeScale.map(([style, font, size, weight, use]) => <tr key={style}><td>{style}</td><td>{font}</td><td>{size}</td><td>{weight}</td><td>{use}</td></tr>)}</tbody></table></div></section>
    </div>

    <div className="layout-row spacing-row">
      <section className="panel spacing-panel"><SectionTitle number="04">Spacing System</SectionTitle><h3 className="mini-heading">Base unit: 4px</h3><div className="spacing-scale">{[4, 8, 12, 16, 24, 32, 40, 48, 64].map((value) => <div className="space-item" key={value}><span className="space-bar" style={{ width: Math.max(value * .55, 6), height: Math.max(value * .55, 6) }} /><span>{value}</span><small>({value / 16}rem)</small></div>)}</div></section>
      <section className="panel radius-panel"><SectionTitle number="05">Radius &amp; Shadows</SectionTitle><h3 className="mini-heading">Radius</h3><div className="radius-scale">{[["4px", "(xs)", "4px"], ["8px", "(sm)", "8px"], ["12px", "(md)", "12px"], ["16px", "(lg)", "16px"], ["24px", "(xl)", "24px"], ["Full", "(circle)", "999px"]].map(([label, meta, value]) => <div className="radius-item" key={label}><span className="radius-shape" style={{ borderRadius: value }} /><span>{label}</span><small>{meta}</small></div>)}</div><h3 className="mini-heading shadow-heading">Shadows</h3><div className="shadow-scale">{["Sm", "Md", "Lg", "Xl"].map((name) => <div className={`shadow-card shadow-${name.toLowerCase()}`} key={name}><strong>{name}</strong><small>0 {name === "Xl" ? "20px 40px -8px" : name === "Lg" ? "12px 24px -4px" : name === "Md" ? "4px 12px -2px" : "1px 2px 0"}<br />rgba(15, 23, 42, 0.08)</small></div>)}</div></section>
    </div>

    <div className="layout-row controls-row">
      <section className="panel icons-panel"><SectionTitle number="06">Icons</SectionTitle><h3 className="mini-heading">Outline Style</h3><div className="icon-strip">{iconNames.map((name) => <Icon key={name} name={name} size={16} />)}</div><h3 className="mini-heading filled-heading">Filled Style</h3><div className="icon-strip filled-icons">{iconNames.map((name) => <Icon key={name} name={name} size={16} />)}</div><h3 className="mini-heading icon-spec-heading">Icon Specs</h3><ul className="spec-list"><li>24×24px grid</li><li>2px stroke width (outline)</li><li>Rounded line caps</li><li>Consistent optical balance</li></ul></section>
      <section className="panel buttons-panel"><SectionTitle number="07">Buttons</SectionTitle><div className="button-grid"><span />{["Primary", "Secondary", "Tertiary", "Text"].map((name) => <span className="button-heading" key={name}>{name}</span>)}<span className="button-row-label">Default</span><SampleButton variant="primary">Get Started</SampleButton><SampleButton variant="secondary">Explore Courses</SampleButton><SampleButton variant="tertiary" icon="external">View Lesson</SampleButton><SampleButton variant="text" icon="play">Watch Video</SampleButton><span className="button-row-label">Hover</span><SampleButton variant="primary" hover>Get Started</SampleButton><SampleButton variant="secondary" hover>Explore Courses</SampleButton><SampleButton variant="tertiary" hover icon="external">View Lesson</SampleButton><SampleButton variant="text" hover icon="play">Watch Video</SampleButton><span className="button-row-label">Disabled</span><SampleButton variant="primary" disabled>Get Started</SampleButton><SampleButton variant="secondary" disabled>Explore Courses</SampleButton><SampleButton variant="tertiary" disabled icon="external">View Lesson</SampleButton><SampleButton variant="text" disabled icon="play">Watch Video</SampleButton></div><h3 className="mini-heading button-spec-heading">Button Specs</h3><ul className="spec-list"><li>Height: 44px (default)</li><li>Padding: 0 16px (lg), 0 12px (md)</li><li>Radius: 12px</li><li>Font: Inter Medium (14–16px)</li></ul></section>
      <section className="panel inputs-panel"><SectionTitle number="08">Inputs</SectionTitle><label className="field-label" htmlFor="design-search">Search / Text Input</label><div className="search-field"><Icon name="search" size={16} /><input id="design-search" type="search" placeholder="Search anything..." /><kbd>⌘ K</kbd></div><label className="field-label select-label" htmlFor="design-sort">Select</label><div className="select-field"><select id="design-sort" defaultValue="Most Relevant"><option>Most Relevant</option><option>Newest</option><option>Oldest</option></select><Icon name="chevron-down" size={14} /></div><h3 className="mini-heading field-spec-heading">Field Specs</h3><ul className="spec-list"><li>Height: 44px</li><li>Radius: 12px</li><li>Border: 1px solid #E2E8F0</li><li>Padding: 0 16px</li><li>Focus: Border color #FB923C</li></ul></section>
    </div>

    <div className="layout-row micro-row">
      <section className="panel badges-panel"><SectionTitle number="09">Badges / Tags</SectionTitle><div className="badge-examples"><div><span>Video</span><Badge kind="video">VIDEO</Badge></div><div><span>Lesson</span><Badge kind="lesson">LESSON</Badge></div><div><span>Popular</span><Badge kind="popular">POPULAR</Badge></div></div></section>
      <section className="panel status-panel"><SectionTitle number="10">Status / Indicators</SectionTitle><div className="statuses"><span><i className="status-progress" />In Progress</span><span><Icon name="check-circle" size={15} />Completed</span><span><Icon name="play-filled" size={15} />Now Playing</span><span><Icon name="lock" size={15} />Locked</span></div></section>
      <section className="panel progress-panel"><SectionTitle number="11">Progress Bar</SectionTitle><div className="progress-demo"><ProgressBar value={35} /><span>35% <em>complete</em></span></div></section>
    </div>

    <section className="panel cards-panel"><SectionTitle number="12">Cards</SectionTitle><div className="card-grid">
      <div className="card-column"><h3>Course Card</h3><article className="sample-card course-card"><div className="course-card-top"><div className="course-icon">N</div><div><strong>Next.js for Production</strong><p>Build scalable, high-performance web applications with Next.js.</p></div></div><div className="course-meta"><span><Icon name="signal" size={13} />Intermediate</span><span><Icon name="clock" size={13} />18h 24m</span><span><Icon name="folder" size={13} />12 modules</span></div></article></div>
      <div className="card-column"><h3>Lesson Card (Video)</h3><article className="sample-card lesson-card"><Badge kind="video">VIDEO</Badge><strong>Data Fetching in Server Components</strong><p>Learn how to fetch data on the server using async/await and Next.js best practices.</p><div className="card-bottom"><span>Lesson 5.1 <b>·</b> 12:45</span><span className="orange-action"><Icon name="play" size={13} />Watch from 12:45</span></div></article></div>
      <div className="card-column"><h3>Lesson Card (Lesson)</h3><article className="sample-card lesson-card"><Badge kind="lesson">LESSON</Badge><strong>Data Fetching &amp; Caching</strong><p>Explore different data fetching methods in Next.js and how to cache and revalidate for optimal performance.</p><div className="card-bottom"><span>Module 5</span><span className="orange-action">View lesson <Icon name="external" size={13} /></span></div></article></div>
      <div className="card-column"><h3>Resource Card</h3><article className="sample-card resource-card"><div className="resource-top"><Icon name="document" size={25} /><div><strong>Caching and Revalidation Guide</strong><p>Deep dive into Next.js caching strategies.</p></div></div><div className="card-bottom"><span>PDF <b>·</b> 1.2 MB</span><Icon name="external" size={13} className="orange-icon" /></div></article></div>
    </div></section>

    <section className="panel navigation-panel"><SectionTitle number="13">Navigation</SectionTitle><div className="nav-examples"><div className="nav-example"><VertexLogo size="small" /><span className="active-nav">Courses</span><span>My Learning</span></div><div className="breadcrumb-example"><span>Breadcrumbs</span><div>All Courses <Icon name="chevron" size={12} /> Next.js for Production <Icon name="chevron" size={12} /> Data Fetching &amp; Caching</div></div><div className="pagination-example"><span>Pagination</span><div><button aria-label="Previous page" type="button"><Icon name="chevron-left" size={14} /></button><button className="current" aria-current="page" type="button">1</button><button type="button">2</button><button type="button">3</button><span>...</span><button type="button">8</button><button aria-label="Next page" type="button"><Icon name="chevron" size={14} /></button></div></div></div></section>

    <section className="panel principles-panel"><SectionTitle number="14">Principles</SectionTitle><div className="principles"><div><Icon name="eye" size={26} /><p><strong>Clarity First</strong><span>Every element should communicate clearly.</span></p></div><div><Icon name="grid" size={26} /><p><strong>Consistency</strong><span>Use components and patterns consistently across the platform.</span></p></div><div><Icon name="target" size={26} /><p><strong>Focus &amp; Calm</strong><span>Remove noise and help learners focus on what matters.</span></p></div><div><Icon name="accessibility" size={26} /><p><strong>Accessible</strong><span>Design with accessibility and inclusivity in mind.</span></p></div></div></section>
  </main>;
}
