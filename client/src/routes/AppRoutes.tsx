import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing/Landing";
import Chat from "../pages/Chat/Chat";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:threadId" element={<Chat />} />
    </Routes>
  );
}
