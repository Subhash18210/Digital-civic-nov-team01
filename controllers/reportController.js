const Petition = require('../models/Petition');
const Signature = require('../models/Signature');
const Vote = require('../models/Vote');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

/* =================== HELPERS =================== */

const getReportData = async (location, startDate, endDate) => {
  const petitionMatch = {};

  if (location) petitionMatch.location = location;

  if (startDate && endDate) {
    petitionMatch.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  // Petition counts by status
  const petitionStatusCounts = await Petition.aggregate([
    { $match: petitionMatch },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  // Signature totals
  const signatureStats = await Signature.aggregate([
    {
      $lookup: {
        from: 'petitions',
        localField: 'petition',
        foreignField: '_id',
        as: 'petitionData'
      }
    },
    { $unwind: '$petitionData' },
    {
      $match: {
        ...(location && { 'petitionData.location': location }),
        ...(startDate &&
          endDate && {
            'petitionData.createdAt': {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          })
      }
    },
    { $group: { _id: null, totalSignatures: { $sum: 1 } } }
  ]);

  // Poll vote totals
  const voteStats = await Vote.aggregate([
    { $group: { _id: null, totalVotes: { $sum: 1 } } }
  ]);

  return {
    petitionStatusCounts,
    totalSignatures: signatureStats[0]?.totalSignatures || 0,
    totalVotes: voteStats[0]?.totalVotes || 0
  };
};

/* =================== 3.1 Generate Reports =================== */

exports.generateReports = async (req, res) => {
  try {
    const { location, startDate, endDate } = req.query;
    const data = await getReportData(location, startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =================== 3.2 Export Reports =================== */

exports.exportReports = async (req, res) => {
  try {
    const { format, location, startDate, endDate } = req.query;
    const data = await getReportData(location, startDate, endDate);

    const flatData = [
      { metric: 'Total Votes', value: data.totalVotes },
      { metric: 'Total Signatures', value: data.totalSignatures },
      ...data.petitionStatusCounts.map(p => ({
        metric: `Petitions - ${p._id}`,
        value: p.count
      }))
    ];

    // CSV
    if (format === 'csv') {
      const parser = new Parser({ fields: ['metric', 'value'] });
      const csv = parser.parse(flatData);
      res.header('Content-Type', 'text/csv');
      res.attachment('civix_report.csv');
      return res.send(csv);
    }

    // PDF
    if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=civix_report.pdf'
      );

      doc.pipe(res);
      doc.fontSize(18).text('Civix Civic Report', { underline: true });
      doc.moveDown();

      flatData.forEach(item => {
        doc.fontSize(12).text(`${item.metric}: ${item.value}`);
      });

      doc.end();
      return;
    }

    res.status(400).json({
      message: 'Invalid format. Use ?format=csv or ?format=pdf'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =================== 4. Analytics =================== */

exports.getAnalytics = async (req, res) => {
  try {
    const { location } = req.query;

    const petitionsPerStatus = await Petition.aggregate([
      ...(location ? [{ $match: { location } }] : []),
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const signaturesPerPetition = await Signature.aggregate([
      { $group: { _id: '$petition', totalSignatures: { $sum: 1 } } },
      {
        $lookup: {
          from: 'petitions',
          localField: '_id',
          foreignField: '_id',
          as: 'petition'
        }
      },
      { $unwind: '$petition' },
      {
        $project: {
          _id: 0,
          petitionTitle: '$petition.title',
          totalSignatures: 1
        }
      }
    ]);

    const pollVotesPerLocation = await Vote.aggregate([
      {
        $lookup: {
          from: 'polls',
          localField: 'poll',
          foreignField: '_id',
          as: 'poll'
        }
      },
      { $unwind: '$poll' },
      {
        $group: {
          _id: '$poll.targetLocation',
          totalVotes: { $sum: 1 }
        }
      }
    ]);

    const monthlyActivity = await Petition.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalPetitions: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      petitionsPerStatus,
      signaturesPerPetition,
      pollVotesPerLocation,
      monthlyActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
