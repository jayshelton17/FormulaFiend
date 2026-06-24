const REBAR = {
  "#3": { area: 0.11, dia: 0.375 },
  "#4": { area: 0.20, dia: 0.5 },
  "#5": { area: 0.31, dia: 0.625 },
  "#6": { area: 0.44, dia: 0.75 },
  "#7": { area: 0.60, dia: 0.875 },
  "#8": { area: 0.79, dia: 1.0 },
};

function getEffectiveDepth({ h, cover = 1.5, stirrupBar, bottomBar }) {
  return h - cover - stirrupBar.dia - bottomBar.dia / 2;
}

export function runTorsion(inputs) {
  const {
    fc,          // ksi
    fy,          // ksi, stirrup steel
    Tu,          // ft-k
    bw,          // in
    h,           // in
    cover = 1.5,
    bottomBars,
    stirrups,
  } = inputs;

  const bottomBar = REBAR[bottomBars.bar];
  const stirrupBar = REBAR[stirrups.bar];

  if (!bottomBar || !stirrupBar) {
    throw new Error("Invalid bar size");
  }

  const d = getEffectiveDepth({
    h,
    cover,
    stirrupBar,
    bottomBar,
  });

  const Av = stirrups.legs * stirrupBar.area;
  const s = stirrups.spacing;

  const phi = 0.75;

  // Very simple geometry values so your API returns something useful.
  // These are placeholders for later refinement if you implement full torsion math.
  const Aoh = Math.max((bw - 2 * cover) * (h - 2 * cover), 0);
  const Ph = Math.max(2 * ((bw - 2 * cover) + (h - 2 * cover)), 0);

  // Phase 1: your current sample case
  if (Tu === 0) {
    return {
      inputs,
      derived: {
        d,
        Av,
        s,
        Aoh,
        Ph,
        phi,
      },
      outputs: {
        Tu,
        torsionRequired: false,
        torsionSatisfactory: true,
        satisfactory: true,
        note: "Torsion not required because Tu = 0",
      },
    };
  }

  // Phase 2 starter for nonzero torsion
  // This is intentionally conservative/simple for now until you circle back.
  const torsionRequired = true;

  return {
    inputs,
    derived: {
      d,
      Av,
      s,
      Aoh,
      Ph,
      phi,
      fc,
      fy,
    },
    outputs: {
      Tu,
      torsionRequired,
      torsionSatisfactory: false,
      satisfactory: false,
      note: "Nonzero torsion case not fully implemented yet",
    },
  };
}