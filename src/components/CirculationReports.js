import React, { useEffect, useState } from "react";
import axios from "axios";

const CirculationReports = ({ reportType }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/reports/${reportType}`);
        setReportData(response.data);
      } catch (error) {
        setError("Failed to load report.");
        console.error("Error fetching report:", error);
      }
      setLoading(false);
    };

    fetchReport();
  }, [reportType]);

  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reports/${reportType}`, {
        responseType: "blob",
      });

      if (response.status !== 200) {
        throw new Error("Failed to download report");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${reportType}-report.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please try again.");
    }
  };

  return (
    <div className="report-container">
      <div style={{ paddingTop: "80px", paddingLeft: "20px" }}> {/* Added spacing */}
        <h2 style={{ marginBottom: "20px" }}>
          Report: {reportType.replace("-", " ").toUpperCase()}
        </h2>

        {loading && <p>Loading report data...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && reportData && (
          <pre style={{ padding: "10px", background: "#f4f4f4", borderRadius: "5px" }}>
            {JSON.stringify(reportData, null, 2)}
          </pre>
        )}

        {!loading && !error && (
          <button
            onClick={handleDownload}
            style={{
              marginTop: "20px",
              padding: "10px 15px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Download Report
          </button>
        )}
      </div>
    </div>
  );
};

export default CirculationReports;
