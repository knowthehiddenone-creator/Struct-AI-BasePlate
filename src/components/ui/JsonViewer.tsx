import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import { ExtractedParams } from "../../lib/types";

function Section({
  title,
  data,
  defaultOpen = true,
}: {
  title: string;
  data: Record<string, any>;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[#7DD3FC] text-xs font-semibold uppercase tracking-wide mb-1 hover:text-[#BAE6FD] transition-colors"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {title}
      </button>
      {open && (
        <div className="ml-4 pl-3 border-l border-[#334155] space-y-0.5 overflow-hidden transition-all duration-300">
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="text-[13px] leading-relaxed">
              <span className="text-[#94A3B8]">{k}: </span>
              {v === null || v === undefined || v === "" ? (
                <span className="text-[#64748B] italic">null</span>
              ) : (
                <span className="text-[#06B6D4]">{typeof v === "string" ? `"${v}"` : String(v)}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function JsonViewer({ data, compact = false }: { data: ExtractedParams; compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-neutralDark rounded-card overflow-hidden border border-[#334155]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#334155]">
        <span className="text-xs font-semibold text-neutralText font-mono">Live Parameters</span>
        <button onClick={handleCopy} className="text-[#94A3B8] hover:text-white transition-colors">
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <div className={`p-4 font-mono ${compact ? "max-h-[420px]" : "max-h-[600px]"} overflow-y-auto`}>
        <Section title="loads" data={data.loads} />
        <Section title="column" data={data.column} />
        <Section title="basePlate" data={data.basePlate} />
        <Section title="concrete" data={data.concrete} />
        <Section title="anchors" data={data.anchors} />
        <Section title="welds" data={data.welds} />
      </div>
    </div>
  );
}
