import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import { isValidUrl } from "../../public/utils";

export default function Render_QR() {
    const [link, setLink] = useState("");
    const [showQr, setShowQr] = useState(false);
    const [error, setError] = useState("");

    const handleLinkChange = (e) => {
        const value = e.target.value;
        setLink(value);
        if (error) setError(""); // Clear error when the user modifies the URL

        // Validate the URL on change and set error if needed
        if (value && !isValidUrl(value)) {
            setError("Please enter a valid URL");
        } else {
            setError(""); // Clear error if the URL is valid
        }
    };

    const generateQrCode = () => {
        if (!link || !isValidUrl(link)) {
            setError("Please enter a valid URL");
            return;
        }
        setError(""); // Clear error
        setShowQr(true); // Show QR code after validation
    };

    const downloadQrCode = () => {
        const canvas = document.getElementById("qr-code");
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "qr-code.png";
        link.click();
    };

    useEffect(() => {
        setShowQr(false);
    }, [link]);

    return (
        <Box sx={{ padding: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <Typography
                variant="h3"
                align="center"
                gutterBottom
                sx={{
                    paddingTop: "30px",
                    color: "white",
                    letterSpacing: "2px",
                    textShadow: "2px 2px 2px rgba(0, 0, 0, 0.7)",
                    lineHeight: 1.4,
                    fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                }}
            >
                QR Code Generator
            </Typography>

            <TextField variant="outlined"
                label="Enter your URL"
                multiline
                minRows={4}
                fullWidth
                value={link}
                onChange={handleLinkChange}
                error={!!error}
                helperText={error}
                sx={{
                    bgcolor: "transparent",
                    "& .MuiInputBase-root": { color: "#fff" },
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#007BFF",
                    },
                    "& .MuiInputLabel-root": {
                        color: "white",
                    },
                    "&:hover": {
                        cursor: "text",
                    },
                }}
            />

            <Box sx={{ display: "flex", gap: "10px", justifyContent: "center", width: { xs: "100%", sm: "600px" } }}>
                <Button variant="contained"
                    color="primary"
                    onClick={generateQrCode}
                    disabled={!link || !isValidUrl(link)}
                    sx={{
                        borderRadius: 2,
                        bgcolor: "#007BFF",
                        "&:hover": { bgcolor: "#0056b3" },
                        opacity: link && isValidUrl(link) ? 1.0 : 1.0,
                    }}
                >
                    Generate QR Code
                </Button>
            </Box>

            {/* QR code display */}
            {showQr && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px", marginTop: "30px" }}>
                    <QRCodeCanvas value={link} size={256} id="qr-code" />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={downloadQrCode}
                        sx={{
                            borderRadius: 2,
                            bgcolor: "#4CAF50",
                            "&:hover": { bgcolor: "#388E3C" },
                        }}
                    >
                        Download QR Code
                    </Button>
                </Box>
            )}
        </Box>
    );
}