async function verifyWalletLedger(walletId) {
  const entries = await WalletLedger.findAll({
    where: { walletId },
    order: [["id", "ASC"]],
  });

  for (let i = 0; i < entries.length; i++) {
    const current = entries[i];
    const prev = entries[i - 1];

    // 🔗 Check chain link
    if (i > 0 && current.previous_hash !== prev.current_hash) {
      throw new Error(
        `Tampering detected: broken chain at ledger ID ${current.id}`,
      );
    }

    // 🔁 Recalculate hash
    const recalculatedHash = generateHash(current);

    if (current.current_hash !== recalculatedHash) {
      throw new Error(
        `Tampering detected: hash mismatch at ledger ID ${current.id}`,
      );
    }
  }

  return true;
}
