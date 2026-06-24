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

export function runShear(inputs) {
  const {
    fc,          // ksi
    fy,          // ksi (stirrups)
    Vu,          // kips
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

  const Av = stirrups.legs * stirrupBar.area; // in²
  const s = stirrups.spacing; // in
  const AvOverS = Av / s; // in²/in
  const AvOverSPerFt = AvOverS * 12; // in²/ft

  const fcPsi = fc * 1000;

  // Approximate ACI-style concrete shear contribution
  const Vc = (2 * Math.sqrt(fcPsi) * bw * d) / 1000; // kips

  // Shear resisted by stirrups
  const Vs = (Av * fy * d) / s; // kips

  const phi = 0.75;
  const Vn = Vc + Vs;
  const phiVn = phi * Vn;

  // Approximate required stirrup ratio
  const requiredVs = Math.max(Vu / phi - Vc, 0); // kips
  const requiredAvOverS = requiredVs > 0 ? requiredVs / (fy * d) : 0; // in²/in
  const requiredAvOverSPerFt = requiredAvOverS * 12; // in²/ft

  // Simple spacing rule starter
  const sMax = Math.min(d / 2, 24);

  const shearSatisfactory = phiVn >= Vu;
  const spacingSatisfactory = s <= sMax;
  const satisfactory = shearSatisfactory && spacingSatisfactory;

  return {
    inputs,
    derived: {
      d,
      Av,
      s,
      AvOverS,
      AvOverSPerFt,
      Vc,
      Vs,
      Vn,
      phi,
      phiVn,
      requiredAvOverS,
      requiredAvOverSPerFt,
      sMax,
    },
    outputs: {
      Vu,
      shearSatisfactory,
      spacingSatisfactory,
      satisfactory,
    },
  };
}   