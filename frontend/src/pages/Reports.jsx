import React, { useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "../context/AuthContext";
import { CalendarDays, MapPin, BarChart3, Download, FileText } from "lucide-react";

export default function Reports() {
  const { user } = useContext(AuthContext);

  // ----------- Default: current month -----------
  const getMonthStart = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
  };

  const getMonthEnd = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10);
  };

  const [fromDate, setFromDate] = useState(getMonthStart());
  const [toDate, setToDate] = useState(getMonthEnd());
  const [location, setLocation] = useState(user?.location || "");

  const [loading, setLoading] = useState(true);

  // ----------- Metrics -----------
  const [metrics, setMetrics] = useState({
    petitionsCreated: 0,
    petitionsResolved: 0,
    petitionsPending: 0,
    totalSignatures: 0,
    totalVotes: 0,
  });

  // ----------- Trend data -----------
  const [trendData, setTrendData] = useState([]);

  /* ---------------- FETCH REPORTS (SIMULATED) ---------------- */
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const mock = {
        petitionsCreated: 86,
        petitionsResolved: 44,
        petitionsPending: 42,
        totalSignatures: 1290,
        totalVotes: 780,
      };

      const mockTrend = [
        { label: "W1", petitions: 18, votes: 120 },
        { label: "W2", petitions: 22, votes: 160 },
        { label: "W3", petitions: 26, votes: 210 },
        { label: "W4", petitions: 20, votes: 290 },
      ];

      setMetrics(mock);
      setTrendData(mockTrend);
      setLoading(false);
    }, 700);
  }, [fromDate, toDate, location]);

  const totalPetitions = useMemo(() => {
    return metrics.petitionsResolved + metrics.petitionsPending;
  }, [metrics]);

  const petitionResolvedPercent = useMemo(() => {
    if (totalPetitions === 0) return 0;
    return Math.round((metrics.petitionsResolved / totalPetitions) * 100);
  }, [metrics, totalPetitions]);

  const maxVotes = useMemo(() => Math.max(...trendData.map((x) => x.votes), 1), [trendData]);
  const maxPetitions = useMemo(
    () => Math.max(...trendData.map((x) => x.petitions), 1),
    [trendData]
  );

  /* ---------------- EXPORT: CSV ---------------- */
  const exportCSV = () => {
    // Respect filters in filename
    const fileName = `reports_${location || "ALL"}_${fromDate}_to_${toDate}.csv`;

    // Build CSV rows (metrics + trend)
    const rows = [];

    rows.push(["REPORT FILTERS"]);
    rows.push(["From Date", fromDate]);
    rows.push(["To Date", toDate]);
    rows.push(["Location", location || "All Locations"]);
    rows.push([]);

    rows.push(["METRICS"]);
    rows.push(["Total Petitions Created", metrics.petitionsCreated]);
    rows.push(["Petitions Resolved", metrics.petitionsResolved]);
    rows.push(["Pending Petitions", metrics.petitionsPending]);
    rows.push(["Total Signatures", metrics.totalSignatures]);
    rows.push(["Total Votes (Polls)", metrics.totalVotes]);
    rows.push([]);

    rows.push(["TREND DATA"]);
    rows.push(["Week", "Petitions", "Votes"]);
    trendData.forEach((t) => {
      rows.push([t.label, t.petitions, t.votes]);
    });

    // Convert to CSV string safely
    const csvString = rows
      .map((row) =>
        row
          .map((cell) => {
            const safe = String(cell ?? "");
            // Escape quotes
            return `"${safe.replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\n");

    // Download in browser
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  };

  /* ---------------- EXPORT: PDF (OPTIONAL) ---------------- */
  const exportPDF = () => {
    // Simple way: print the dashboard card section
    window.print();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* ---------------- HEADER ---------------- */}
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>Reports Dashboard</h1>
            <p style={styles.subtitle}>
              Track petitions & polls performance for <b>{location || "your region"}</b>
            </p>
          </div>

          <div style={styles.headerRight}>
            <div style={styles.badge}>
              <BarChart3 size={16} />
              Analytics
            </div>

            <button
              onClick={exportCSV}
              style={styles.exportBtn}
              disabled={loading}
              title="Download CSV"
            >
              <Download size={16} />
              Export CSV
            </button>

            <button
              onClick={exportPDF}
              style={styles.exportBtnSecondary}
              disabled={loading}
              title="Export PDF (Print)"
            >
              <FileText size={16} />
              Export PDF
            </button>
          </div>
        </div>

        {/* ---------------- FILTERS ---------------- */}
        <div style={styles.filtersCard}>
          <div style={styles.filterTitle}>
            <CalendarDays size={18} />
            Filters
          </div>

          <div style={styles.filtersGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <MapPin size={14} /> Location
                </span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={styles.input}
              >
                <option value="">All Locations</option>
                <option value="Dehradun">Dehradun</option>
                <option value="Haridwar">Haridwar</option>
                <option value="Rishikesh">Rishikesh</option>
              </select>
            </div>
          </div>
        </div>

        {/* ---------------- METRICS ---------------- */}
        <div style={styles.metricsGrid}>
          <MetricCard
            title="Total Petitions Created"
            value={loading ? "..." : metrics.petitionsCreated}
            hint="All petitions created in selected period"
          />
          <MetricCard
            title="Petitions Resolved"
            value={loading ? "..." : metrics.petitionsResolved}
            hint={`Resolved rate: ${petitionResolvedPercent}%`}
          />
          <MetricCard
            title="Pending Petitions"
            value={loading ? "..." : metrics.petitionsPending}
            hint="Still under review / action"
          />
          <MetricCard
            title="Total Signatures"
            value={loading ? "..." : metrics.totalSignatures}
            hint="Signatures collected on petitions"
          />
          <MetricCard
            title="Total Votes (Polls)"
            value={loading ? "..." : metrics.totalVotes}
            hint="Votes recorded on polls"
          />
        </div>

        {/* ---------------- CHARTS ---------------- */}
        <div style={styles.chartsGrid}>
          {/* BAR CHART */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Votes by Week (Bar)</h3>

            {loading ? (
              <div style={styles.chartLoading}>Loading chart…</div>
            ) : (
              <div style={styles.barChart}>
                {trendData.map((item) => {
                  const height = Math.round((item.votes / maxVotes) * 100);
                  return (
                    <div key={item.label} style={styles.barCol}>
                      <div style={styles.barTrack}>
                        <div style={{ ...styles.barFill, height: `${height}%` }} />
                      </div>
                      <div style={styles.barLabel}>{item.label}</div>
                      <div style={styles.barValue}>{item.votes}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* LINE CHART */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Petitions Trend (Line)</h3>

            {loading ? (
              <div style={styles.chartLoading}>Loading chart…</div>
            ) : (
              <div style={styles.lineChart}>
                {trendData.map((item) => {
                  const width = Math.round((item.petitions / maxPetitions) * 100);
                  return (
                    <div key={item.label} style={styles.lineRow}>
                      <div style={styles.lineLeft}>
                        <span style={styles.lineLabel}>{item.label}</span>
                        <span style={styles.lineNumber}>{item.petitions}</span>
                      </div>
                      <div style={styles.lineTrack}>
                        <div style={{ ...styles.lineFill, width: `${width}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div style={styles.note}>
          Note: CSV export respects current filters (date range + location).
        </div>
      </div>

      {/* PRINT STYLES for PDF */}
      <style>
        {`
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            button {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}

/* ---------------- METRIC CARD ---------------- */
function MetricCard({ title, value, hint }) {
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricTitle}>{title}</div>
      <div style={styles.metricValue}>{value}</div>
      <div style={styles.metricHint}>{hint}</div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #2a0a4a, #120020)",
    color: "white",
    fontFamily: "Inter, sans-serif",
    padding: "30px 18px",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "14px",
  },

  headerRight: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  title: { margin: 0, fontSize: "2rem", fontWeight: 700 },
  subtitle: { margin: "6px 0 0", color: "#cbd5f5", fontSize: "0.95rem" },

  badge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "999px",
    backgroundColor: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#cbd5f5",
    fontWeight: 600,
    fontSize: "0.9rem",
  },

  exportBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    backgroundColor: "#2563eb",
    color: "white",
  },

  exportBtnSecondary: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.18)",
    cursor: "pointer",
    fontWeight: 700,
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "white",
  },

  filtersCard: {
    padding: "18px",
    borderRadius: "16px",
    backgroundColor: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
  },

  filterTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: 700,
    marginBottom: "12px",
  },

  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px",
  },

  filterGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "0.85rem", color: "#cbd5f5" },

  input: {
    padding: "12px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "white",
    outline: "none",
    fontSize: "0.95rem",
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "14px",
  },

  metricCard: {
    padding: "16px",
    borderRadius: "16px",
    backgroundColor: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
  },

  metricTitle: { fontSize: "0.85rem", color: "#cbd5f5", fontWeight: 600 },
  metricValue: { fontSize: "1.6rem", fontWeight: 800, marginTop: "6px" },
  metricHint: { fontSize: "0.8rem", color: "#cbd5f5", marginTop: "6px" },

  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "14px",
  },

  chartCard: {
    padding: "18px",
    borderRadius: "16px",
    backgroundColor: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
  },

  chartTitle: { margin: 0, marginBottom: "14px", fontSize: "1.05rem" },
  chartLoading: { padding: "40px 0", textAlign: "center", color: "#cbd5f5" },

  // Bar chart
  barChart: {
    display: "flex",
    alignItems: "flex-end",
    gap: "14px",
    height: "220px",
  },

  barCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },

  barTrack: {
    width: "100%",
    height: "160px",
    borderRadius: "12px",
    backgroundColor: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    display: "flex",
    alignItems: "flex-end",
    overflow: "hidden",
  },

  barFill: {
    width: "100%",
    backgroundColor: "#2563eb",
    borderRadius: "12px",
    transition: "height 0.5s ease",
  },

  barLabel: { fontSize: "0.8rem", color: "#cbd5f5" },
  barValue: { fontSize: "0.85rem", fontWeight: 700 },

  // Line chart
  lineChart: { display: "flex", flexDirection: "column", gap: "12px" },

  lineRow: { display: "flex", alignItems: "center", gap: "12px" },

  lineLeft: {
    width: "90px",
    display: "flex",
    justifyContent: "space-between",
    color: "#cbd5f5",
    fontSize: "0.85rem",
  },

  lineLabel: { fontWeight: 600 },
  lineNumber: { fontWeight: 800, color: "white" },

  lineTrack: {
    flex: 1,
    height: "12px",
    borderRadius: "999px",
    backgroundColor: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    overflow: "hidden",
  },

  lineFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: "999px",
    transition: "width 0.5s ease",
  },

  note: {
    marginTop: "8px",
    color: "#cbd5f5",
    fontSize: "0.85rem",
    opacity: 0.9,
  },
};
