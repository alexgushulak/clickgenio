import React, { useState } from "react";
import {
  CssBaseline,
  Container
} from "@mui/material";
import { 
  Routes,
  Route
} from "react-router-dom";
import { submitIPData } from "./services/apiLayer";
import "./App.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PurchasePage from "./pages/PurchasePage/PurchasePage";
import HomePage from "./pages/HomePage/HomePage";
import HomePage2 from './pages/HomePage2/HomePage2';
import ResponsiveAppBar from "./pages/ResponsiveAppBar";


let id: any = null

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  const [imageId, setImageId] = useState("");

  const checkIdExistsOnPageLoad = () => {
    const query = new URLSearchParams(window.location.search);
    id = query.get("id");

    if (id) {
      try {
        setImageId(id);
        console.log(id);
      } catch {
        console.log("Error");
      }
    } else {
      console.log("No Id in Query");
    }
  }

  React.useEffect(() => {
    checkIdExistsOnPageLoad()
    submitIPData("Logged On")
  }, [])

  const darkTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });
  

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ResponsiveAppBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/purchase" element={<PurchasePage />} />
        <Route path="/home" element={<HomePage2 />} />
      </Routes>
    </ThemeProvider>
  );
}
