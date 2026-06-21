export default function Footer() {
  return (
    <footer className="bg-surface border-t border-borderLight py-10">
      <div className="max-w-[1280px] mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-textPrimary mb-1">
          <span className="text-primary">StructAI</span> BasePlate
        </p>
        <p className="text-sm text-[#64748B] mb-3">Built for LTTS Engineering Intelligence Hackathon 2026</p>
        <p className="text-xs italic text-textMuted max-w-2xl mx-auto leading-relaxed">
          Preliminary design assistance only. Results must be reviewed, verified, and approved by a qualified
          structural engineer before use in construction or fabrication.
        </p>
      </div>
    </footer>
  );
}
