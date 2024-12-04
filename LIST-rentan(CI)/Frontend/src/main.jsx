import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./App.jsx";
import HabitTrackerList from './components/HabitTrackeList.jsx';
import ToDoList from './components/TodoList.jsx';
import ReadingList from './components/ReadingList.jsx';
import Login from './components/Login.jsx';
import FetchLog from './components/log.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Register />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/habit/:username", 
    element: <HabitTrackerList />,
  },

  {
    path: "/todo/:username", 
    element: <ToDoList />,
  },

  {
    path: "/reading/:username", 
    element: <ReadingList />,
  },

  {
    path: "/download-log",
    element: <FetchLog />,
  },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

