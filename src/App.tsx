import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import DirectoryPage from "./pages/DirectoryPage";
import CourseOverviewPage from "./pages/CourseOverviewPage";
import LessonPage from "./pages/LessonPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DirectoryPage />} />
        <Route path="/course/:courseId" element={<CourseOverviewPage />} />
        <Route
          path="/course/:courseId/lesson/:lessonId"
          element={<LessonPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
