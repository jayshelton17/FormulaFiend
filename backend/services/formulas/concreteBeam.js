import { runFlexure } from "./flexure.js";
import { runShear } from "./shear.js";
import { runTorsion } from "./torsion.js";

export function runConcreteBeam(inputs) {
  const flexureResult = runFlexure(inputs);
  const shearResult = runShear(inputs);
  const torsionResult = runTorsion(inputs);

  const flexureSatisfactory = flexureResult.outputs.satisfactory;
  const shearSatisfactory = shearResult.outputs.satisfactory;
  const torsionSatisfactory = torsionResult.outputs.satisfactory;

  const overallSatisfactory =
    flexureSatisfactory &&
    shearSatisfactory &&
    torsionSatisfactory;

  return {
    inputs,
    summary: {
      overallSatisfactory,
      flexureSatisfactory,
      shearSatisfactory,
      torsionSatisfactory,
    },
    flexure: {
      phiMn: flexureResult.outputs.phiMn,
      Mu: flexureResult.outputs.Mu,
      satisfactory: flexureSatisfactory,
      d: flexureResult.derived.d,
      dPrime: flexureResult.derived.dPrime,
      rhoProvided: flexureResult.derived.rhoProvided,
      rhoMin: flexureResult.derived.rhoMin,
      c: flexureResult.derived.c,
      phi: flexureResult.derived.phi,
    },
    shear: {
      phiVn: shearResult.derived.phiVn,
      Vu: shearResult.outputs.Vu,
      satisfactory: shearSatisfactory,
      spacingSatisfactory: shearResult.outputs.spacingSatisfactory,
      d: shearResult.derived.d,
      Av: shearResult.derived.Av,
      AvOverS: shearResult.derived.AvOverS,
      Vc: shearResult.derived.Vc,
      Vs: shearResult.derived.Vs,
      sMax: shearResult.derived.sMax,
    },
    torsion: {
      Tu: torsionResult.outputs.Tu,
      torsionRequired: torsionResult.outputs.torsionRequired,
      satisfactory: torsionSatisfactory,
      note: torsionResult.outputs.note,
      d: torsionResult.derived.d,
      Aoh: torsionResult.derived.Aoh,
      Ph: torsionResult.derived.Ph,
    },
  };
}