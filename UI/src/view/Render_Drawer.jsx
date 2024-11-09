import { Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const DrawerToggleIcon = ({ open, onClick }) => (
    <IconButton
        onClick={onClick}
        sx={{
            position: "absolute",
            top: "50%",
            [open ? "right" : "left"]: 10,
            transform: "translateY(-50%)",
            zIndex: 10,
            color: "#fff",
            transition: "left 0.3s ease, right 0.3s ease",
        }}
    >
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </IconButton>
);

const ListItemStyled = ({ children, onClick }) => (
    <ListItem
        button
        onClick={onClick}
        sx={{
            width: "5rem",
            margin: "0 4px",
            marginBottom: "16px",
            padding: "7px",
            borderRadius: "16px",
            backgroundColor: "#555", // Darker background for list items
            transition: "background-color 0.3s, box-shadow 0.3s", // Transition for background and shadow
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Apply shadow to the item
            "&:hover": {
                backgroundColor: "#444", // Slightly darker on hover
                cursor: "pointer",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)", // More prominent shadow on hover
            },
        }}
    >
        <ListItemText
            primary={children}
            sx={{
                textAlign: "center",
                color: "#fff", // White text color for readability
            }}
        />
    </ListItem>
);

export default function Render_Drawer({ open, setOpen, setPage }) {
    const toggleDrawer = () => setOpen((prev) => !prev);
    const handlePageChange = (page) => setPage(page);

    const drawerWidth = open ? 120 : 0;

    return (
        <div style={{ display: "flex" }}>
            <Drawer
                variant="persistent"
                anchor="left"
                open={open}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    transition: "none",
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        backgroundColor: "#1e1e1e",
                        color: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        paddingTop: "20px",
                        transition: "width 0.3s ease",
                    },
                }}
            >
                {open && <DrawerToggleIcon open={open} onClick={toggleDrawer} />}

                {open && (
                    <List sx={{ padding: 0 }}>
                        <ListItemStyled onClick={() => handlePageChange("home")}>Home</ListItemStyled>
                        <ListItemStyled onClick={() => handlePageChange("qr")}>QRCode</ListItemStyled>
                        <ListItemStyled onClick={() => handlePageChange("history")}>History</ListItemStyled>
                    </List>
                )}
            </Drawer>

            {!open && <DrawerToggleIcon open={open} onClick={toggleDrawer} />}
        </div>
    );
}