const cron = require("node-cron");

cron.schedule("0 * * * *", async () => {
  console.log("Running wallet ledger verification...");

  const wallets = await walletRepository.getAllWallets();

  for (const wallet of wallets) {
    try {
      await verifyWalletLedger(wallet.id);
    } catch (err) {
      console.error(`🚨 Fraud detected in wallet ${wallet.id}`, err.message);

      // 🔔 You can:
      // - Send alert (Slack / Email)
      // - Freeze wallet
      // - Log to audit system
    }
  }
});
