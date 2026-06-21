import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { Assumption, DesignCode, ExtractedParams } from "../../lib/types";
import { MissingFieldDef, getByPath, setByPath } from "../../lib/missingData";
import { sectionsForCode, steelGradesForCode, concreteGradesForCode } from "../../data/sectionLibrary";
import { anchorGradesForCode } from "../../data/anchorLibrary";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import LoadingSequence from "../ui/LoadingSequence";

export default function Step04_MissingData({
  code,
  params,
  missingFields,
  assumptions,
  onParamsChange,
  onAssumptionsChange,
  onConfirm,
}: {
  code: DesignCode;
  params: ExtractedParams;
  missingFields: MissingFieldDef[];
  assumptions: Assumption[];
  onParamsChange: (p: ExtractedParams) => void;
  onAssumptionsChange: (a: Assumption[]) => void;
  onConfirm: () => void;
}) {
  const [calculating, setCalculating] = useState(false);

  const sections = sectionsForCode(code);
  const steelGrades = steelGradesForCode(code);
  const concreteGrades = concreteGradesForCode(code);
  const anchorGrades = anchorGradesForCode(code);

  const updateField = (path: string, value: any) => {
    const clone = JSON.parse(JSON.stringify(params));
    setByPath(clone, path, value);
    onParamsChange(clone);
  };

  const toggleOverride = (id: string) => {
    onAssumptionsChange(assumptions.map((a) => (a.id === id ? { ...a, overridden: !a.overridden } : a)));
  };

  const renderField = (field: MissingFieldDef) => {
    const current = getByPath(params, field.path);

    if (field.path === "column.sectionName") {
      return (
        <Select
          key={field.path}
          label={`${field.label}`}
          placeholder="Select section"
          options={sections.filter((s) => s.category !== "Custom").map((s) => ({ value: s.name, label: s.name }))}
          value={current ?? ""}
          onChange={(e) => {
            const sec = sections.find((s) => s.name === e.target.value);
            updateField(field.path, e.target.value);
            if (sec) {
              updateField("column.d", sec.d);
              updateField("column.bf", sec.bf);
              updateField("column.sectionType", sec.category);
            }
          }}
        />
      );
    }
    if (field.path === "column.steelGrade") {
      return (
        <Select
          key={field.path}
          label={field.label}
          placeholder="Select grade"
          options={steelGrades.map((g) => ({ value: g.label, label: `${g.label} (Fy=${g.fy} MPa)` }))}
          value={current ?? ""}
          onChange={(e) => updateField(field.path, e.target.value)}
        />
      );
    }
    if (field.path === "concrete.grade") {
      return (
        <Select
          key={field.path}
          label={field.label}
          placeholder="Select grade"
          options={concreteGrades.map((g) => ({ value: g.label, label: g.label }))}
          value={current ?? ""}
          onChange={(e) => {
            const grade = concreteGrades.find((g) => g.label === e.target.value);
            updateField(field.path, e.target.value);
            if (grade) updateField("concrete.fck", grade.fck);
          }}
        />
      );
    }
    if (field.path === "anchors.diameterLabel") {
      const allSizes = Array.from(new Set(anchorGrades.flatMap((g) => g.sizes)));
      return (
        <Select
          key={field.path}
          label={field.label}
          placeholder="Select diameter"
          options={allSizes.map((s) => ({ value: s, label: s }))}
          value={current ?? ""}
          onChange={(e) => updateField(field.path, e.target.value)}
        />
      );
    }
    if (field.path === "anchors.grade") {
      return (
        <Select
          key={field.path}
          label={field.label}
          placeholder="Select grade"
          options={anchorGrades.map((g) => ({ value: g.label, label: g.label }))}
          value={current ?? ""}
          onChange={(e) => updateField(field.path, e.target.value)}
        />
      );
    }
    // numeric / text fallback
    return (
      <Input
        key={field.path}
        label={field.label}
        unit={field.unit || undefined}
        value={current ?? ""}
        error={current == null || current === ""}
        onChange={(e) => {
          const v = e.target.value;
          const isNumeric = !["column.sectionName", "column.steelGrade", "concrete.grade", "anchors.diameterLabel", "anchors.grade"].includes(field.path);
          updateField(field.path, isNumeric && v !== "" ? parseFloat(v) : v);
        }}
        type={field.path === "anchors.count" ? "number" : "text"}
      />
    );
  };

  if (calculating) {
    return (
      <div className="bg-surface border border-borderLight rounded-card shadow-card p-7">
        <h2 className="text-xl font-semibold text-textPrimary mb-1">Running Calculations</h2>
        <p className="text-sm text-textSecondary mb-2">28 calculation modules are checking your design...</p>
        <LoadingSequence onComplete={onConfirm} />
      </div>
    );
  }

  return (
    <div className="bg-surface border border-borderLight rounded-card shadow-card p-7">
      <h2 className="text-xl font-semibold text-textPrimary mb-1">Missing Data &amp; Assumptions</h2>
      <p className="text-sm text-textSecondary mb-6">Fill in any gaps, then confirm to run the full calculation engine.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold text-danger uppercase tracking-wide mb-3">Missing Parameters</p>
          {missingFields.length === 0 ? (
            <p className="text-sm text-textMuted italic">All required parameters were extracted.</p>
          ) : (
            <div className="space-y-3">{missingFields.map(renderField)}</div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold text-warning uppercase tracking-wide mb-3">Auto Assumptions</p>
          <div className="space-y-2.5">
            {assumptions.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="bg-warningLight border border-warningBorder rounded-input px-3.5 py-2.5 flex items-center justify-between gap-2"
              >
                <div>
                  <p className="text-sm font-medium text-textPrimary">{a.label}</p>
                  <p className="text-xs text-textSecondary">{a.value}</p>
                </div>
                <button
                  onClick={() => toggleOverride(a.id)}
                  className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-badge border transition-colors duration-150 flex items-center gap-1
                    ${a.overridden ? "bg-primary text-white border-primary" : "bg-surface text-textSecondary border-borderMed hover:bg-surfaceGray"}`}
                >
                  <RotateCcw size={11} /> {a.overridden ? "Overridden" : "Override"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Button onClick={() => setCalculating(true)} variant="success" fullWidth size="lg" className="mt-7">
        Confirm &amp; Calculate →
      </Button>
    </div>
  );
}
