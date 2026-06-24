const REBAR = {
  "#3": { area: 0.11, dia: 0.375 },
  "#4": { area: 0.20, dia: 0.5 },
  "#5": { area: 0.31, dia: 0.625 },
  "#6": { area: 0.44, dia: 0.75 },
  "#7": { area: 0.60, dia: 0.875 },
  "#8": { area: 0.79, dia: 1.0 },
};

function steelStressFromStrain(strain, fy) {
  const Es = 29000; // ksi
  const stress = Es * strain;

  if (stress > fy) return fy;
  if (stress < -fy) return -fy;
  return stress;
}

// Parabolic concrete stress block approximation.
// y measured from top fiber downward.
// strain at depth y: eps = epsCu * (1 - y/c)
function concreteStressAtDepth(y, c, fc, epsCu = 0.003) {
  const eps = epsCu * (1 - y / c);
  if (eps <= 0) return 0;

  // Peak concrete stress reached near 0.002, then capped
  const eps0 = 0.002;

  if (eps <= eps0) {
    const r = eps / eps0;
    return 0.85 * fc * (2 * r - r * r); // ksi
  }

  return 0.85 * fc; // ksi
}

// Numerically integrate concrete compression force and centroid
function getConcreteCompressionResult({ fc, bw, c }) {
  const slices = 2000;
  const dy = c / slices;

  let force = 0;      // kips
  let momentTop = 0;  // kip-in about top fiber

  for (let i = 0; i < slices; i++) {
    const y = (i + 0.5) * dy;
    const stress = concreteStressAtDepth(y, c, fc); // ksi = kip/in^2
    const dF = stress * bw * dy; // kips
    force += dF;
    momentTop += dF * y;
  }

  const centroid = force === 0 ? 0 : momentTop / force;

  return {
    Cc: force,
    dc: centroid,
  };
}

function solveNeutralAxis({ fc, fy, bw, As, AsPrime, d, dPrime }) {
  const epsCu = 0.003;

  function forceBalance(c) {
    const { Cc } = getConcreteCompressionResult({ fc, bw, c });

    const epsT = epsCu * (d - c) / c;
    const epsPrime = epsCu * (c - dPrime) / c;

    const fsT = steelStressFromStrain(epsT, fy);
    const fsPrime = steelStressFromStrain(epsPrime, fy);

    const T = As * fsT;
    const Cs = epsPrime > 0 ? AsPrime * fsPrime : 0;

    return (Cc + Cs) - T;
  }

  let low = 0.1;
  let high = d;

  for (let i = 0; i < 120; i++) {
    const mid = (low + high) / 2;
    const balance = forceBalance(mid);

    if (balance > 0) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return (low + high) / 2;
}

export function runFlexure(inputs) {
  const {
    fc,
    fy,
    Mu,
    bw,
    h,
    cover = 1.5,
    topBars,
    bottomBars,
    stirrups,
  } = inputs;

  const topBar = REBAR[topBars.bar];
  const bottomBar = REBAR[bottomBars.bar];
  const stirrupBar = REBAR[stirrups.bar];

  if (!topBar || !bottomBar || !stirrupBar) {
    throw new Error("Invalid bar size");
  }

  const As = bottomBars.count * bottomBar.area;
  const AsPrime = topBars.count * topBar.area;

  const d = h - cover - stirrupBar.dia - bottomBar.dia / 2;
  const dPrime = cover + stirrupBar.dia + topBar.dia / 2;

  const rhoProvided = As / (bw * d);

  const fcPsi = fc * 1000;
  const fyPsi = fy * 1000;

  const rhoMin = Math.max(
    (3 * Math.sqrt(fcPsi)) / fyPsi,
    200 / fyPsi
  );

  const c = solveNeutralAxis({
    fc,
    fy,
    bw,
    As,
    AsPrime,
    d,
    dPrime,
  });

  const { Cc, dc } = getConcreteCompressionResult({ fc, bw, c });

  const epsCu = 0.003;
  const epsT = epsCu * (d - c) / c;
  const epsPrime = epsCu * (c - dPrime) / c;

  const fsT = steelStressFromStrain(epsT, fy);
  const fsPrime = steelStressFromStrain(epsPrime, fy);

  const T = As * fsT;
  const Cs = epsPrime > 0 ? AsPrime * fsPrime : 0;

  // nominal moment about tension steel line
  const MnKipIn =
    (Cc * (d - dc)) +
    (Cs * (d - dPrime));

  const phi = 0.9;
  const phiMn = (phi * MnKipIn) / 12;

  return {
    inputs,
    derived: {
      As,
      AsPrime,
      d,
      dPrime,
      rhoProvided,
      rhoMin,
      c,
      epsT,
      epsPrime,
      fsT,
      fsPrime,
      Cc,
      Cs,
      T,
      dc,
      phi,
    },
    outputs: {
      phiMn,
      Mu,
      satisfactory: phiMn >= Mu,
    },
  };
}