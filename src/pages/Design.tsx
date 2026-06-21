import { useState } from "react";
import { DesignState, ExtractedParams, Assumption } from "../lib/types";
import { extractParameters } from "../lib/extraction";
import { checkMissingData, generateAssumptions } from "../lib/missingData";
import { runCalculation } from "../lib/calculationEngine";
import { runDesignReview } from "../lib/designReview";
import { generatePDFReport } from "../lib/pdfReport";

import Navbar from "../components/layout/Navbar";
import ProgressBar from "../components/layout/ProgressBar";
import Sidebar from "../components/layout/Sidebar";
import UnitToggle from "../components/ui/UnitToggle";
import JsonViewer from "../components/ui/JsonViewer";
import StepTransition from "../components/ui/StepTransition";

import Step01_CodeSelection from "../components/steps/Step01_CodeSelection";
import Step02_NLInput from "../components/steps/Step02_NLInput";
import Step03_JSONPreview from "../components/steps/Step03_JSONPreview";
import Step04_MissingData from "../components/steps/Step04_MissingData";
import Step05_Geometry from "../components/steps/Step05_Geometry";
import Step06_Thickness from "../components/steps/Step06_Thickness";
import Step07_AnchorEmbedment from "../components/steps/Step07_AnchorEmbedment";
import Step08_WeldStiffenerShearKey from "../components/steps/Step08_WeldStiffenerShearKey";
import Step09_DesignReview from "../components/steps/Step09_DesignReview";
import Step10_Summary from "../components/steps/Step10_FinalSummary";

function emptyParams(): ExtractedParams {
  return {
    loads: { axialLoad: null, momentX: null, shear: null },
    column: { sectionType: null, sectionName: null, steelGrade: null, d: null, bf: null },
    concrete: { grade: null, fck: null, pedestalL: null, pedestalW: null },
    basePlate: { N: null, B: null, tp: null, plateGrade: null },
    anchors: { count: null, diameterLabel: null, grade: null, embedment: null },
    welds: { size: null, type: "fillet" },
  };
}

function initialState(): DesignState {
  return {
    project: { projectName: "", designerName: "", date: new Date().toISOString().slice(0, 10), code: null },
    unitSystem: "SI",
    nlInput: "",
    extracted: emptyParams(),
    assumptions: [],
    missingFields: [],
    calc: null,
    review: null,
    currentStep: 1,
  };
}

export default function Design() {
  const [state, setState] = useState<DesignState>(initialState());
  const [maxReachedStep, setMaxReachedStep] = useState(1);

  const goToStep = (step: number) => {
    setState((s) => ({ ...s, currentStep: step }));
    setMaxReachedStep((m) => Math.max(m, step));
  };

  const handleExtract = () => {
    if (!state.project.code) return;
    const extracted = extractParameters(state.nlInput, state.project.code);
    const missing = checkMissingData(extracted, state.project.code);
    const assumptions = generateAssumptions(extracted, state.project.code);
    setState((s) => ({
      ...s,
      extracted,
      missingFields: missing.map((m) => m.path),
      assumptions,
    }));
    goToStep(3);
  };

  const handleConfirmCalculate = () => {
    if (!state.project.code) return;
    const calc = runCalculation(state.extracted, state.project.code, state.unitSystem);
    const review = runDesignReview(calc, state.extracted);
    setState((s) => ({ ...s, calc, review }));
    goToStep(5);
  };

  const handleExportPDF = () => {
    if (!state.calc || !state.review || !state.project.code) return;
    generatePDFReport(state.project, state.extracted, state.calc, state.review, state.project.code, state.unitSystem);
  };

  const handleNewDesign = () => {
    setState(initialState());
    setMaxReachedStep(1);
  };

  const missingFieldDefs = state.project.code ? checkMissingData(state.extracted, state.project.code) : [];

  return (
    <div className="min-h-screen bg-page flex flex-col">
      <Navbar />
      <ProgressBar currentStep={state.currentStep} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentStep={state.currentStep} maxReachedStep={maxReachedStep} onStepClick={goToStep} />

        <main className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
          <div className="max-w-[860px] mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold text-textMuted uppercase tracking-wide">
                  Step {state.currentStep} of 10
                </p>
              </div>
              <UnitToggle unit={state.unitSystem} onChange={(u) => setState((s) => ({ ...s, unitSystem: u }))} />
            </div>

            <StepTransition stepKey={state.currentStep}>
              {state.currentStep === 1 && (
                <Step01_CodeSelection
                  project={state.project}
                  onChange={(p) => setState((s) => ({ ...s, project: p }))}
                  onNext={() => goToStep(2)}
                />
              )}
              {state.currentStep === 2 && state.project.code && (
                <Step02_NLInput
                  code={state.project.code}
                  value={state.nlInput}
                  onChange={(v) => setState((s) => ({ ...s, nlInput: v }))}
                  onExtract={handleExtract}
                />
              )}
              {state.currentStep === 3 && (
                <Step03_JSONPreview
                  params={state.extracted}
                  onNext={() => goToStep(4)}
                  onEdit={() => goToStep(4)}
                />
              )}
              {state.currentStep === 4 && state.project.code && (
                <Step04_MissingData
                  code={state.project.code}
                  params={state.extracted}
                  missingFields={missingFieldDefs}
                  assumptions={state.assumptions}
                  onParamsChange={(p) => setState((s) => ({ ...s, extracted: p }))}
                  onAssumptionsChange={(a) => setState((s) => ({ ...s, assumptions: a }))}
                  onConfirm={handleConfirmCalculate}
                />
              )}
              {state.currentStep === 5 && state.calc && (
                <Step05_Geometry
                  calc={state.calc}
                  params={state.extracted}
                  unit={state.unitSystem}
                  onNext={() => goToStep(6)}
                />
              )}
              {state.currentStep === 6 && state.calc && (
                <Step06_Thickness calc={state.calc} unit={state.unitSystem} onNext={() => goToStep(7)} />
              )}
              {state.currentStep === 7 && state.calc && state.project.code && (
                <Step07_AnchorEmbedment
                  calc={state.calc}
                  params={state.extracted}
                  code={state.project.code}
                  unit={state.unitSystem}
                  onNext={() => goToStep(8)}
                />
              )}
              {state.currentStep === 8 && state.calc && (
                <Step08_WeldStiffenerShearKey calc={state.calc} unit={state.unitSystem} onNext={() => goToStep(9)} />
              )}
              {state.currentStep === 9 && state.review && (
                <Step09_DesignReview review={state.review} onNext={() => goToStep(10)} />
              )}
              {state.currentStep === 10 && state.calc && state.review && state.project.code && (
                <Step10_Summary
                  project={state.project}
                  params={state.extracted}
                  calc={state.calc}
                  review={state.review}
                  code={state.project.code}
                  unit={state.unitSystem}
                  onExportPDF={handleExportPDF}
                  onNewDesign={handleNewDesign}
                />
              )}
            </StepTransition>
          </div>
        </main>

        <aside className="w-[300px] shrink-0 hidden xl:block border-l border-borderLight bg-page p-5 overflow-y-auto">
          <JsonViewer data={state.extracted} compact />
        </aside>
      </div>
    </div>
  );
}
