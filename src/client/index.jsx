import React from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import { AppProvider, useAppContext } from "./context";

import "./app.css";
import Header from "./components/Header";
import NewContact from "./pages/NewContact";
import Contacts from "./pages/Contacts";
import ContactDetail from "./pages/ContactDetail";
import Tasks from "./pages/Tasks";
import NewTasks from "./pages/NewTasks";
import TaskDetail from "./pages/TaskDetail";
import NewProject from "./pages/NewProject";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

const ProtectedLayout = () => {
  const { token } = useAppContext();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const PublicOnlyLayout = () => {
  const { token } = useAppContext();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  const { token } = useAppContext();

  return (
    <Routes>
      <Route element={<PublicOnlyLayout />}>
        <Route path="/login" element={<Login key="login" />} />
        <Route path="/register" element={<Register key="register" />} />
      </Route>

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Home key="home" />} />
        <Route path="/contacts" element={<Contacts key="contacts" />} />
        <Route path="/new-contact" element={<NewContact key="new-contact" />} />
        <Route path="/contact/:id" element={<ContactDetail key="contact-detail" />} />
        <Route path="/task/:id" element={<TaskDetail key="task-detail" />} />
        <Route path="/tasks" element={<Tasks key="tasks" />} />
        <Route path="/new-tasks" element={<NewTasks key="new-tasks" />} />
        <Route path="/new-project" element={<NewProject key="new-project" />} />
        <Route path="/projects" element={<Projects key="projects" />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
    </Routes>
  );
};

const root = document.getElementById("root");
if (root !== null) {
  const appRoot = createRoot(root);
  appRoot.render(
    <React.Fragment>
      <ToastContainer position="bottom-right" theme="dark" />
      <ThemeProvider theme={theme}>
        <AppProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AppProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}
