import {
  FileText,
  Zap,
  Brain,
  Type,
  Palette,
  Layout,
  MessageSquare,
  Download,
  Calendar,
  ClipboardList,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { ScrollReveal } from "./ui";
import type { LucideIcon } from "lucide-react";

interface WorkflowNode {
  id: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

const nodes: WorkflowNode[] = [
  { id: 1, title: "Idea Form", subtitle: "Tally / Airtable", icon: FileText },
  { id: 2, title: "Automation Trigger", subtitle: "Google Apps Script / Make", icon: Zap },
  { id: 3, title: "AI Research & Structure", subtitle: "Claude → JSON", icon: Brain },
  { id: 4, title: "Headlines & Copy", subtitle: "Length-limited", icon: Type },
  { id: 5, title: "Visual Direction", subtitle: "Brand kit tokens", icon: Palette },
  { id: 6, title: "Template Autofill", subtitle: "Canva / React", icon: Layout },
  { id: 7, title: "Approval", subtitle: "Slack / Telegram", icon: MessageSquare },
  { id: 8, title: "Export", subtitle: "PDF / PNG", icon: Download },
  { id: 9, title: "Scheduling", subtitle: "Buffer / Metricool", icon: Calendar },
  { id: 10, title: "Content Calendar", subtitle: "Google Sheet / Airtable", icon: ClipboardList },
];

function NodeCard({ node, index }: { node: WorkflowNode; index: number }) {
  const Icon = node.icon;
  return (
    <ScrollReveal
      delay={index * 0.05}
      className="flex flex-col items-center gap-2 w-full"
    >
      <div
        className="relative flex flex-col items-center gap-2.5 rounded-[16px] border border-border bg-white px-3.5 py-4 shadow-sm w-full max-w-[160px] hover:border-teal/40 transition-colors"
        role="listitem"
        aria-label={`Step ${node.id}: ${node.title}`}
      >
        {/* Step number badge */}
        <span className="absolute -top-2.5 -left-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-teal text-[11px] font-bold text-white font-heading shadow-sm ring-2 ring-white">
          {node.id}
        </span>

        {/* Icon in teal circle */}
        <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-teal-50 border border-teal-100 text-teal">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>

        {/* Title */}
        <p className="text-center text-xs font-bold text-ink font-heading leading-snug">
          {node.title}
        </p>

        {/* Subtitle */}
        <p className="text-center text-[11px] text-text-muted leading-tight">
          {node.subtitle}
        </p>
      </div>
    </ScrollReveal>
  );
}

function Arrow({ direction }: { direction: "right" | "down" }) {
  if (direction === "down") {
    return (
      <div className="flex items-center justify-center py-1.5">
        <ChevronDown className="h-5 w-5 text-teal" strokeWidth={2} />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center px-1 shrink-0">
      <ChevronRight className="h-5 w-5 text-teal/70" strokeWidth={2} />
    </div>
  );
}

export default function WorkflowDiagram() {
  const row1 = nodes.slice(0, 5);
  const row2 = nodes.slice(5, 10);

  return (
    <section aria-label="Content automation workflow diagram">
      {/* Desktop: two horizontal rows of 5 */}
      <div className="hidden lg:block">
        {/* Row 1 */}
        <div className="flex items-center justify-center gap-1.5">
          {row1.map((node, i) => (
            <div key={node.id} className="flex items-center">
              <NodeCard node={node} index={i} />
              {i < row1.length - 1 && <Arrow direction="right" />}
            </div>
          ))}
        </div>

        {/* Unambiguous Row Flow Connector: Step 5 (Row 1 End) -> Step 6 (Row 2 Start) */}
        <div className="relative my-4 px-12 max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Left: Step 6 entry */}
            <div className="flex flex-col items-center">
              <ChevronDown className="h-5 w-5 text-teal" strokeWidth={2.5} />
              <span className="text-[10px] font-bold text-teal font-heading uppercase tracking-wider mt-0.5">
                Step 6 Begins
              </span>
            </div>

            {/* Middle: Horizontal cross-flow line with phase transition badge */}
            <div className="flex-1 mx-4 relative flex items-center justify-center">
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-l from-teal via-teal/40 to-teal" />
              <div className="relative bg-surface px-4 py-1 text-[11px] font-bold text-teal-dark border border-teal-200 rounded-full shadow-xs flex items-center gap-1.5">
                <span>Phase 1 (Creation 1–5)</span>
                <span className="text-teal font-black">➔</span>
                <span>Phase 2 (Automation 6–10)</span>
              </div>
            </div>

            {/* Right: Step 5 exit */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-teal font-heading uppercase tracking-wider mb-0.5">
                From Step 5
              </span>
              <div className="h-4 w-0.5 bg-teal" />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex items-center justify-center gap-1.5">
          {row2.map((node, i) => (
            <div key={node.id} className="flex items-center">
              <NodeCard node={node} index={i + 5} />
              {i < row2.length - 1 && <Arrow direction="right" />}
            </div>
          ))}
        </div>
      </div>

      {/* Tablet: two rows of 5, compact */}
      <div className="hidden md:block lg:hidden">
        <div className="flex items-center justify-center gap-1">
          {row1.map((node, i) => (
            <div key={node.id} className="flex items-center">
              <div className="scale-95">
                <NodeCard node={node} index={i} />
              </div>
              {i < row1.length - 1 && <Arrow direction="right" />}
            </div>
          ))}
        </div>

        {/* Unambiguous Row Flow Connector: Step 5 (Row 1 End) -> Step 6 (Row 2 Start) */}
        <div className="relative my-3 px-8">
          <div className="flex items-center justify-between">
            {/* Left: Step 6 entry */}
            <div className="flex flex-col items-center">
              <ChevronDown className="h-4 w-4 text-teal" strokeWidth={2.5} />
              <span className="text-[9px] font-bold text-teal font-heading uppercase tracking-wider mt-0.5">
                Step 6
              </span>
            </div>

            {/* Middle: Horizontal line */}
            <div className="flex-1 mx-3 relative flex items-center justify-center">
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-l from-teal via-teal/40 to-teal" />
              <div className="relative bg-surface px-3 py-0.5 text-[10px] font-bold text-teal-dark border border-teal-200 rounded-full shadow-xs">
                Phase 1 (1–5) ➔ Phase 2 (6–10)
              </div>
            </div>

            {/* Right: Step 5 exit */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-teal font-heading uppercase tracking-wider mb-0.5">
                From Step 5
              </span>
              <div className="h-3 w-0.5 bg-teal" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1">
          {row2.map((node, i) => (
            <div key={node.id} className="flex items-center">
              <div className="scale-95">
                <NodeCard node={node} index={i + 5} />
              </div>
              {i < row2.length - 1 && <Arrow direction="right" />}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical stack */}
      <div className="flex flex-col items-center gap-1 md:hidden" role="list">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex flex-col items-center w-full max-w-[200px]">
            <NodeCard node={node} index={i} />
            {i < nodes.length - 1 && <Arrow direction="down" />}
          </div>
        ))}
      </div>
    </section>
  );
}
