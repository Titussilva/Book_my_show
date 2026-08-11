const logActivity = async (userId, action, details) => {
  console.log(`User ${userId} performed ${action}: ${JSON.stringify(details)}`);
  // Can be extended to save to DB
};

module.exports = { logActivity };
