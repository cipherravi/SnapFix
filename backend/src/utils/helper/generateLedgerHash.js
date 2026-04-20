const crypto = require("crypto");

const { LEDGER_SECRET_KEY } = require("../../config/server-config");

function generateHash(record) {
  const dataString = [
    record.userId,
    record.walletId,
    record.amount,
    record.transaction_type,
    record.reference_id,
    record.created_at.toISOString(),
    record.previous_hash || "",
    record.sequence,
  ].join("|");

  return crypto
    .createHmac("sha256", LEDGER_SECRET_KEY)
    .update(dataString)
    .digest("hex");
}

module.exports = generateHash;
