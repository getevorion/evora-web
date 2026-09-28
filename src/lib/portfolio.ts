export const PORTFOLIO = {
  name: "Adam",
  role: "Low-level systems engineer",
  location: "Building from the terminal",
  availability: "open" as const,
  tagline:
    "I build low-level stuff. Hypervisors, code protection, reverse engineering tools, and the bits of glue that make all of it actually run.",

  nav: [
    { href: "/portfolio", label: "Home", section: null, cta: false },
    { href: "/portfolio#work", label: "Work", section: "work", cta: false },
    { href: "/portfolio#skills", label: "Skills", section: "skills", cta: false },
    { href: "/portfolio#about", label: "About", section: "about", cta: false },
    { href: "/portfolio#contact", label: "Get in touch", section: "contact", cta: true },
  ] as const,

  social: [
    { href: "https://github.com/evorafbi", label: "GitHub", external: true },
    { href: "https://discord.com/users/889542478884143145", label: "Discord", external: true },
    { href: "mailto:night@evora.lol", label: "Email", external: true },
  ] as const,

  hero: {
    headlineTop: "I build the layer under the OS.",
    headlineBottom: "Hypervisors, licensing, and the tools that break them.",
    intro:
      "My name is Adam. I am a developer who works on both sides of the code: forward engineering on runtimes and frontends, reverse engineering on what already ships. Frontend, UI, and UX matter to me as much as the runtime does, and every piece of it has to be practical to build and to maintain.",
    primaryCta: { href: "#work", label: "See selected work" },
    secondaryCta: { href: "#about", label: "How I work" },
    statusOpen: "Open to collaborations and new work",
    statusBusy: "Head down on Evorion 4 Umbra and the Chimera RE Toolkit",
  },

  selectedWork: [
    {
      key: "evorion",
      index: "01",
      title: "Evorion 4 Umbra",
      meta: "2026 · Auth, licensing, and runtime protection",
      body:
        "The current rewrite of the auth and licensing stack, from the boot path up. HWID binding, encrypted hot sections, and server-side execution for the sensitive functions, so nothing important runs on the buyer's machine. Everything else I ship pulls its licensing from this.",
      href: "/#evorion",
      caseLabel: "Read the runtime notes",
    },
    {
      key: "chimera-re",
      index: "02",
      title: "Chimera RE Toolkit",
      meta: "Reverse engineering · MCP · Ring -1",
      body:
        "The reverse engineering toolkit I run every day. Network interception at the socket layer, ring -1 debugging through my own hypervisor, and a static disassembler I wrote to replace the parts of IDA that get in my way. Exposed over MCP so agents drive it directly and I review what they find.",
      href: null,
      caseLabel: "See the MCP surface",
    },
    {
      key: "chimera",
      index: "03",
      title: "Chimera Framework",
      meta: "Type-1 hypervisor · AMD-V / VT-x · Coexists with Hyper-V",
      body:
        "The Type-1 hypervisor the RE toolkit sits on. Runs alongside Hyper-V without a kernel driver: page-table hooks, hypercall interception, ASID hijack on AMD. Memory introspection happens from underneath the OS, so nothing in userland or the kernel sees the reader.",
      href: null,
      caseLabel: "Private, ask for a walkthrough",
    },
    {
      key: "shadow",
      index: "04",
      title: "Shadow",
      meta: "Code virtualizer for x86-64 · Server-anchored",
      body:
        "Code virtualization for x86-64. The client packs a bytecode VM, but the hot handlers execute server-side against the caller's license, so the sensitive code never fully lands on the machine you shipped to.",
      href: null,
      caseLabel: "Private, ask for a walkthrough",
    },
    {
      key: "evopack",
      index: "05",
      title: "EvoPack",
      meta: "Python protector · Mini-VM · Bundled runtime",
      body:
        "A protection layer for Python. The source and any .pyd are lifted into a hand-rolled mini-VM before packaging, so the shipped artifact never contains the readable original.",
      href: null,
      caseLabel: "Design notes",
    },
  ] as const,

  stats: [
    { value: "2.5", label: "Years developing" },
    { value: "10+", label: "Projects shipped" },
    { value: "40+", label: "Developers using Evorion" },
  ] as const,

  about: {
    eyebrow: "About",
    headline: "How the work fits together.",
    paragraphs: [
      "I hold the same standards for security across everything I build. That is not just the low-level side: whether I am touching a frontend, a Windows PE, a licensing runtime, or an API, the bar for what someone could reasonably do to it is the same.",
      "I use AI heavily on the engineering side, but the security bar does not move because the author changed. I audit every generated change the same way I audit code I have written myself, and nothing ships that I have not reviewed.",
      "Design is part of the same discipline for me. The site you are on is a decent example of what I mean by that: an Inter-set frontend on a near-black ground, one cool accent, low chrome, and every screen carrying the same voice.",
    ] as const,
    facts: [
      { label: "Now", value: "Evorion 4 Umbra and the Chimera RE Toolkit" },
      { label: "Before", value: "EvoGuard, EvoraAI, and a stack of shipped runtimes" },
      { label: "Stack", value: "C / C++ · Windows internals · Web security · Agentic AI" },
    ],
  },

  skills: {
    eyebrow: "Skills",
    headline: "How I think.",
  },

  traits: [
    {
      key: "t-pattern",
      eyebrow: "How I think",
      title: "Pattern sense.",
      kicker:
        "I usually see where a system is going to break before I can explain why. Even on stacks I have not touched in years, I can find where the vulnerabilities sit and fix them at the source.",
      stat: "01",
      statSub: "Gut first, verify second",
      visual: "trait-pattern",
    },
    {
      key: "t-craft",
      eyebrow: "How I work",
      title: "Perfectionist.",
      kicker:
        "If something ships with my name on it I will keep rebuilding it until it stops bothering me. Most of what looks like a 200-line file is a week of revisions sitting on top of a week of revisions.",
      stat: "02",
      statSub: "Rebuild until quiet",
      visual: "trait-craft",
    },
    {
      key: "t-reason",
      eyebrow: "How I plan",
      title: "Holds the whole system.",
      kicker:
        "I work best when I can see the boot path, the runtime, and the failure mode in the same frame. Reasoning across layers is where I am strongest, and it is what makes the low-level stuff feel obvious instead of intimidating.",
      stat: "03",
      statSub: "All layers, one frame",
      visual: "trait-reason",
    },
  ] as const,

  contact: {
    eyebrow: "Contact",
    headline: "Say hello, I don't bite.",
    body: "Open for developer work.",
    email: "night@evora.lol",
    links: [
      { href: "https://github.com/evorafbi", label: "GitHub", external: true },
      { href: "https://discord.com/users/889542478884143145", label: "Discord", external: true },
    ] as const,
    openLine: "Currently taking on runtime and tooling engagements for late 2026.",
    busyLine: "Head down on Evorion 4 Umbra and the Chimera RE Toolkit. Replies may take a week.",
  },

  projects: [
    {
      key: "evorion",
      name: "Evorion 4 Umbra",
      tag: "Auth + Licensing",
      description:
        "Auth and licensing platform. C++ runtime that locks code to a machine, encrypts the hot sections, and runs the sensitive functions on a server instead of the client. The licensing and protection layer for everything else I ship.",
      stack: ["C++20", "MSVC", "Windows 11", "SSCX"],
      href: "/#evorion",
      status: "active",
    },
    {
      key: "chimera-re",
      name: "Chimera RE Toolkit",
      tag: "Reverse engineering",
      description:
        "The reverse engineering toolkit I use every day. Network interception at the socket layer, ring -1 debugging through the Chimera hypervisor, and a proprietary static disassembler that replaces the parts of IDA that get in the way. Exposed over MCP so agents drive it directly.",
      stack: ["C++", "Python", "MCP", "Custom disassembler"],
      href: null,
      status: "active",
    },
    {
      key: "chimera",
      name: "Chimera Framework",
      tag: "Hypervisor",
      description:
        "Type-1 hypervisor sitting alongside Hyper-V. Page-table hooks, hypercall interception, ASID hijack on AMD, no kernel driver. I drive game memory from below the kernel boundary, and an MCP server exposes the runtime to tooling.",
      stack: ["C / C++", "AMD-V", "Intel VT-x", "Hyper-V", "EPT / NPT"],
      href: null,
      status: "private",
    },
    {
      key: "shadow",
      name: "Shadow",
      tag: "Whole-binary VM protector",
      description:
        "VMProtect-class packer for x86-64. Custom bytecode VM, per-region threaded dispatch, position-rolling opcode cipher, key-locked merged handlers that break 2026 devirtualizers. Dead-.text transform replaces virtualized bodies with disassembly-desync junk. Whole-binary private imports strip plaintext function names from the IAT.",
      stack: ["C++20", "x64", "Custom ISA", "MBA", "CFF"],
      href: null,
      status: "active",
    },
    {
      key: "evopack",
      name: "EvoPack",
      tag: "Python Protector",
      description:
        "Python source and bytecode protector. Mini virtual machine for code virtualization, opaque predicates, control-flow flattening, bundled runtime that enforces integrity at import.",
      stack: ["Python", "AST", "Bytecode", "Custom ISA"],
      href: null,
      status: "active",
    },
    {
      key: "evoraai",
      name: "EvoraAI 3.0",
      tag: "Real-Time Inference",
      description:
        "Vision-based inference loop. Desktop Duplication for zero-copy screen capture, ONNX with DirectML or TensorRT on a dedicated compute queue, custom WinUSB protocol to hardware mice for sub-millisecond output. Capture, inference, and output happen serially in one tight loop, under 10 ms a frame.",
      stack: ["C++", "ONNX", "DirectML / TensorRT", "WinUSB", "D3D12"],
      href: null,
      status: "active",
    },
  ] as const,
};

export type SelectedWorkEntry = (typeof PORTFOLIO.selectedWork)[number];
export type TraitEntry = (typeof PORTFOLIO.traits)[number];
export type ProjectEntry = (typeof PORTFOLIO.projects)[number];
