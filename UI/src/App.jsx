import { useState } from "react";
import { Box } from "@mui/material";
import './App.css';

import Render_Drawer from "./view/Render_Drawer";
import Render_Home from "./view/Render_Home";
import Render_QR from "./view/Render_QR";
import Render_History from "./view/Render_History";

function App() {
  const [page, setPage] = useState("home"); //home, qr, history
  const [openDrawer, setOpenDrawer] = useState(true);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Render_Drawer open={openDrawer} setOpen={setOpenDrawer} setPage={setPage} />

      <Box component="main"
        sx={{
          flexGrow: 1,
          backgroundColor : "#4A4A4A",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        {page === "home" && <Render_Home />}
        {page === "qr" && <Render_QR />}
        {page === "history" && <Render_History />}
      </Box>
    </Box>
  );
}

export default App;
