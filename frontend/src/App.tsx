import { Route, Routes } from "react-router-dom";
import { ReportsLandingPage } from "./pages/ReportsLandingPage";
import { ReportDetailPage } from "./pages/ReportDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ReportsLandingPage />} />
      <Route path="/reports/:reportType" element={<ReportDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
