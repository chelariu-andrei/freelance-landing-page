import * as React from "react";
import * as Ac from "ac";
import { mount, navLinks, headerCtas, metrics, people, topics, steps } from "./_data";
const { Button, ArrowCta, Badge, Chip, Input, Card, IconCircle, StepPill, SectionHeading, HighlightText, Divider, AvatarStack, Logo, Skeleton,
  SignalCard, CampaignCard, TrendingTopics, ChannelCard, ScoreMeter, MediaPanel, SiteHeader, SiteFooter, HeroSection, FeatureStep,
  ProcessLoop, StatStatement, CtaSection, LogoCarousel, DottedSurface, Container, icons } = Ac;
const { Lightbulb, Palette, Clock, CornerRightDown, Instagram, Search, Users, Waves, Linkedin, Mail, Bot, PenTool, Code2, Database, Triangle, Aperture, BarChart3, Home } = icons;
const stack = [["Assistant", Bot, "Drafts listings"], ["Design", PenTool, "Brochures"], ["Code", Code2, "The website"], ["Database", Database, "Leads"], ["Hosting", Triangle, "Deploys"], ["CRM", Aperture, "Clients"], ["Analytics", BarChart3, "Searches"], ["Legacy", Home, "Phasing out"]].map(([n, C, d]: any, i) => ({ id: n, name: n, icon: <C strokeWidth={1.5} />, description: d, inactive: i === 7 }));

const colors = [["ink", "#1C1B1F"], ["black", "#000000"], ["cream", "#F9F6F0"], ["stone", "#EAE7E1"], ["white", "#FFFFFF"], ["yellow", "#FFD64E"], ["periwinkle", "#BCCBF4"], ["mint", "#BFECC7"], ["blush", "#F9DAF3"], ["coral", "#F7C1B5"]];
const typeScale: [string, string][] = [["text-display-xl", "display-xl"], ["text-display-lg", "display-lg"], ["text-heading-xl", "heading-xl"], ["text-heading-lg", "heading-lg"], ["text-lead", "lead"]];

const Label = ({ children }: { children: React.ReactNode }) => <p className="m-0 mb-4 font-body text-caption font-medium uppercase tracking-[0.08em] text-ink-muted">{children}</p>;
const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Container className="py-10 lg:py-16 flex flex-col gap-8">
    <div className="flex items-center gap-4"><h2 className="m-0 font-display font-regular text-heading-lg text-ink">{title}</h2><Divider className="flex-1" /></div>
    {children}
  </Container>
);

function Showcase() {
  return (
    <div className="ac-root bg-cream text-ink">
      <SiteHeader links={navLinks} ctas={headerCtas} sticky />

      <Block title="Foundations">
        <div><Label>Color</Label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {colors.map(([n, h]) => <div key={n} className="flex flex-col gap-2"><span className="block h-16 rounded-md border border-solid border-line" style={{ background: `var(--${n})` }} /><span className="text-sm font-medium">{n}</span><span className="text-caption text-ink-muted">{h}</span></div>)}
          </div>
        </div>
        <div><Label>Type — Urbanist (display) · Inter (body)</Label>
          <div className="flex flex-col gap-3 overflow-hidden">
            {typeScale.map(([c, n]) => <div key={n} className="flex items-baseline gap-6"><span className="w-24 shrink-0 text-caption text-ink-muted">{n}</span><span className={`font-display ${c} whitespace-nowrap`}>Find your home</span></div>)}
            <div className="flex items-baseline gap-6"><span className="w-24 shrink-0 text-caption text-ink-muted">body-lg</span><span className="font-body text-body-lg">Listings, buyers and campaigns in one workflow.</span></div>
            <div className="flex items-baseline gap-6"><span className="w-24 shrink-0 text-caption text-ink-muted">body</span><span className="font-body text-body">Supporting copy and UI text — ă â î ș ț.</span></div>
          </div>
        </div>
        <div><Label>Radius</Label>
          <div className="flex flex-wrap items-end gap-4">
            {["sm", "md", "lg", "xl", "2xl", "pill"].map((r) => <div key={r} className="flex flex-col items-center gap-2"><span className="block w-24 h-16 bg-white border border-solid border-line" style={{ borderRadius: `var(--radius-${r})` }} /><span className="text-caption text-ink-muted">{r}</span></div>)}
          </div>
        </div>
      </Block>

      <Block title="Primitives">
        <div><Label>Buttons</Label>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-3 items-center"><Button>Book a Viewing</Button><Button variant="secondary">Talk to Us</Button><Button variant="outline-dark">Outline</Button><Button variant="ghost">Ghost</Button><Button disabled>Disabled</Button><Button size="sm" variant="secondary">Small</Button></div>
            <div className="ac-dark bg-ink rounded-lg p-6 flex flex-wrap gap-3 items-center"><Button variant="outline" size="lg">Request a Viewing</Button><Button variant="light" size="lg">Talk to Us</Button><Button size="lg">Primary</Button></div>
            <div className="ac-dark bg-ink rounded-lg p-6 flex justify-center"><ArrowCta label="Book a Viewing" href="#book" size="lg" /></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div><Label>Badges & chips</Label>
            <div className="bg-white rounded-lg p-6 flex flex-col gap-4">
              <div className="flex flex-wrap gap-2"><Badge>90%</Badge><Badge tone="yellow">64%</Badge><Badge tone="coral">−12%</Badge><Badge tone="yellow">Awareness</Badge><Badge size="md">+92%</Badge></div>
              <div className="flex flex-wrap gap-2"><Chip icon={<Users size={18} strokeWidth={1.75} />}>First-time buyers</Chip><Chip icon={<Waves size={18} strokeWidth={1.75} />}>Seaside homes</Chip><Chip tone="blush">Walkable neighbourhoods</Chip></div>
            </div>
          </div>
          <div><Label>Inputs</Label>
            <div className="bg-white rounded-lg p-6 flex flex-col gap-4">
              <Input label="Email" placeholder="you@company.ro" iconLeft={<Mail size={18} strokeWidth={1.75} />} />
              <Input label="Phone" defaultValue="07" error="Enter a full phone number." />
            </div>
          </div>
        </div>
        <div><Label>Step pills, icon circles, highlight</Label>
          <div className="flex flex-wrap gap-6 items-center">
            <StepPill number="01" label="Discover" icon={<Lightbulb size={26} strokeWidth={1.75} />} />
            <StepPill size="md" tone="ink" label="Create" icon={<Palette size={18} strokeWidth={1.75} />} />
            <IconCircle tone="yellow" size="lg"><Clock size={32} strokeWidth={1.75} /></IconCircle>
            <span className="font-display text-heading-xl">Up to <HighlightText variant="marker">90%</HighlightText></span>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><p className="m-0 font-display text-button-lg">Card · white</p></Card>
          <Card surface="stone"><p className="m-0 font-display text-button-lg">Card · stone</p></Card>
          <Card surface="yellow" interactive href="#c"><p className="m-0 font-display text-button-lg">Interactive</p></Card>
          <Card surface="ink"><div className="flex items-center justify-between"><Logo tone="white" size="sm" /><AvatarStack people={people} size="sm" max={3} ground="ink" /></div></Card>
        </div>
        <div className="bg-white rounded-lg p-6 flex items-center gap-4"><Skeleton shape="circle" className="w-12 h-12" /><div className="flex-1 flex flex-col gap-2"><Skeleton className="h-4 w-3/5" /><Skeleton className="h-3 w-2/5" /></div></div>
      </Block>

      <Block title="Data widgets">
        <div className="ac-dark bg-ink rounded-xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          <CampaignCard className="lg:col-span-7" title="Spring open-house week" objective="Awareness" channels="Portals, Instagram, Facebook" metrics={metrics} />
          <SignalCard className="lg:col-span-5" title="Buyer Signal" delta="+92%" people={people} extraCount={12} />
        </div>
        <MediaPanel><TrendingTopics title="Trending Searches" items={topics} animated={false} /></MediaPanel>
        <div className="bg-yellow rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          <ChannelCard name="Instagram" icon={<Instagram size={14} strokeWidth={2} />} formats={["Feed (4:5)", "Feed (1:1)", "Story (9:16)"]} />
          <ChannelCard name="Search" iconTone="stone" icon={<Search size={14} strokeWidth={2} />} formats={["Search (1:1)", "Display (1:1)"]} />
          <div className="md:col-span-2 bg-white rounded-md p-4"><ScoreMeter label="Brand Relevance Score" value={86} /></div>
        </div>
      </Block>

      <Container className="pt-10"><div className="flex items-center gap-4"><h2 className="m-0 font-display font-regular text-heading-lg">Sections</h2><Divider className="flex-1" /></div></Container>
      <div className="py-6">
        <HeroSection
          header={<SiteHeader variant="notch" sticky={false} links={navLinks} ctas={headerCtas} />}
          lines={[{ text: "Find Your Home." }, { text: "Sell With Confidence." }, { text: "Start Your", highlight: "Next Move." }]}
          subtitle="Ac. brings listings, buyers and campaigns into one workflow, so every property reaches the right people faster."
          primaryCta={{ label: "Book a Viewing", href: "#book" }} secondaryCta={{ label: "Talk to Us", href: "#talk" }}
          aside={<div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"><CampaignCard className="md:col-span-7" title="Spring open-house week" objective="Awareness" channels="Portals, Instagram, Facebook" metrics={metrics} /><SignalCard className="md:col-span-5" title="Buyer Signal" delta="+92%" people={people} extraCount={12} /></div>}
        />
        <StatStatement className="py-24 lg:py-32" background={<DottedSurface contained color="#1c1b1f" fogColor="#f9f6f0" opacity={0.6} size={8} />} rows={[
          { parts: [{ kind: "text", text: "In days" }, { kind: "icon", icon: <Clock className="w-6 h-6 lg:w-16 lg:h-16" strokeWidth={1.75} />, label: "clock" }, { kind: "text", text: "not months" }], bubble: <CornerRightDown className="w-8 h-8 lg:w-24 lg:h-24" strokeWidth={1.75} /> },
          { parts: [{ kind: "text", text: "Up to" }, { kind: "value", text: "90%" }, { kind: "text", text: "less time on admin." }] },
        ]} />
        <LogoCarousel eyebrow="AI tools" title="The stack," titleMuted="and what each is for." subtitle="Reached for daily. Short on purpose." items={stack} />
        <FeatureStep number="01" label="Discover" icon={<Lightbulb size={26} strokeWidth={1.75} />}
          body="Win new clients by understanding what they care about most. Ac. gathers market, search and listing data so you always know which homes are in demand."
          media={<MediaPanel><TrendingTopics title="Trending Searches" items={topics.slice(0, 3)} animated={false} /></MediaPanel>} />
        <FeatureStep tone="yellow" number="02" label="Create" icon={<Palette size={26} strokeWidth={1.75} />}
          body="Make an impression with tailored listings. Ac. learns your brand style: you control how much to automate."
          media={<div className="bg-white rounded-md p-4"><ScoreMeter label="Brand Relevance Score" value={86} /></div>} />
        <ProcessLoop title="Here's how we do it:" steps={steps} />
        <CtaSection title="See It In Action" subtitle="Let us show you how Ac. can sell your home faster." cta={{ label: "Get early access", hoverLabel: "Ready to join?", href: "#book" }} />
        <SiteFooter
          tagline={<>Your Next<br />Home, Found</>}
          ctas={[{ label: "Talk To Us", href: "#talk" }, { label: "Book a Viewing", href: "#book" }]}
          columns={[{ links: [{ label: "Careers", href: "#careers" }, ...navLinks.slice(0, 3)] }]}
          socials={[{ label: "LinkedIn", href: "#li", icon: <Linkedin size={26} strokeWidth={1.75} /> }]}
          copyright="Copyright © 2026 Ac." legal={[{ label: "Terms Of Use and Privacy Policy", href: "#legal" }]}
        />
      </div>
    </div>
  );
}
mount(<Showcase />);
