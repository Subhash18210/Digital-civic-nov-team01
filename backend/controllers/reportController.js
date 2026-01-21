const Petition = require('../models/Petition');
const Poll = require('../models/Poll');

// @desc    Get System Analytics & Reports
// @route   GET /api/reports
// @access  Private (Official Only)
exports.getReports = async (req, res) => {
  try {
    const { location, from, to } = req.query;

    console.log("\n--- REPORT CONTROLLER DEBUG ---");
    console.log("1. Incoming Params:", { location, from, to });

    // 1. Build Date Filter
    let dateFilter = {};
    if (from && to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      dateFilter = { createdAt: { $gte: new Date(from), $lte: toDate } };
    }

    // 2. Build Location Filter
    let locFilter = {};
    if (location && location !== "All Locations") {
      locFilter = { location: { $regex: location, $options: 'i' } };
    }

    const petitionMatch = { ...dateFilter, ...locFilter };
    const pollMatch = { ...dateFilter };

    // --- A. PETITION STATS ---
    const petitionStats = await Petition.aggregate([
      { $match: petitionMatch },
      { 
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "under_review"] }, 1, 0] } },
          totalSignatures: { $sum: { $size: { $ifNull: ["$upvotes", []] } } } 
        }
      }
    ]);

    // --- B. POLL STATS (FIXED for 'options' Schema) ---
    // This logic sums up the length of the 'votes' array inside EVERY option
    const pollStats = await Poll.aggregate([
      { $match: pollMatch },
      {
        $project: {
          // Calculate total votes for THIS single poll document
          singlePollTotal: {
            $sum: {
              $map: {
                input: "$options",
                as: "opt",
                in: { $size: { $ifNull: ["$$opt.votes", []] } } // Count votes in this option
              }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          totalVotes: { $sum: "$singlePollTotal" } // Sum totals from all polls
        }
      }
    ]);

    // --- C. TREND DATA (Petitions) ---
    const trends = await Petition.aggregate([
      { $match: petitionMatch },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // --- MERGE DATA ---
    const pStats = petitionStats[0] || { total: 0, active: 0, resolved: 0, pending: 0, totalSignatures: 0 };
    const voteStats = pollStats[0] || { totalVotes: 0 }; // ✅ Now using the fixed calculation

    console.log("✅ FIXED VOTE COUNT:", voteStats.totalVotes);

    const trendData = trends.map(t => ({
      label: t._id,
      petitions: t.count,
      votes: 0 // Graph placeholder (Advanced: We can add trend for votes later if needed)
    }));

    res.status(200).json({
      metrics: {
        petitionsCreated: pStats.total,
        petitionsResolved: pStats.resolved,
        petitionsPending: pStats.pending,
        totalSignatures: pStats.totalSignatures,
        totalVotes: voteStats.totalVotes // Sending the fixed number
      },
      trendData
    });

  } catch (error) {
    console.error("Report Error:", error);
    res.status(500).json({ message: error.message });
  }
};