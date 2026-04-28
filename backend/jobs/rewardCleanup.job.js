const cron = require("node-cron");
const { cleanupExpiredRewards } = require("../utils/rewardCleanup");

let cleanupTaskStarted = false;

async function runRewardCleanup(trigger = "manual") {
  try {
    await cleanupExpiredRewards();
    console.log(`[reward-cleanup] Completed via ${trigger} at ${new Date().toISOString()}`);
  } catch (error) {
    console.error("[reward-cleanup] Failed:", error.message);
  }
}

function startRewardCleanupJob() {
  if (cleanupTaskStarted) {
    return;
  }

  cleanupTaskStarted = true;

  // Run at the start of every hour so expired rewards disappear automatically.
  cron.schedule("0 * * * *", async () => {
    await runRewardCleanup("cron");
  });

  console.log("[reward-cleanup] Cron job scheduled to run every hour");
}

module.exports = {
  runRewardCleanup,
  startRewardCleanupJob,
};
