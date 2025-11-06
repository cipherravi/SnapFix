function toNumberSafe(v) {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return v;
  // handle Sequelize DECIMAL returns as string
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function round2(n) {
  // round to 2 decimals avoiding floating noise
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function roundInt(n) {
  return Math.round(n); // always integer
}

module.exports = { toNumberSafe, round2, roundInt };
