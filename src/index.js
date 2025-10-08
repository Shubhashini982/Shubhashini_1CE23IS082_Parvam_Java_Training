// Import React library to use JSX and build components
import React from "react";

// Import createRoot from react-dom/client (new in React 18+)
// This is used to render the React app into the DOM (HTML page).
import { createRoot } from "react-dom/client";

// Import BrowserRouter from react-router-dom
// BrowserRouter allows us to use routing (navigation between pages/components).
import { BrowserRouter } from "react-router-dom";

// Import the main App component (root component of our application)
import App from "./App";

// Get the root <div> element from index.html (public/index.html has <div id="root"></div>)
// This is where our React app will be mounted inside the browser.
const container = document.getElementById("root");

// Create a root object using React 18's createRoot API
// This replaces the old ReactDOM.render() method (React < 18).
const root = createRoot(container);

// Render the React application inside the root container
// Wrapping <App /> with <BrowserRouter> enables routing features like <Route>, <Link>, etc.
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
