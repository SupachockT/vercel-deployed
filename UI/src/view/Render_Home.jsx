import { useState, useCallback } from "react";
import { Box, Typography, TextField, Button, CircularProgress, InputAdornment, IconButton, Snackbar } from "@mui/material";
import { useShortenUrl } from "../api/urlApi";
import { QRCodeCanvas } from 'qrcode.react';
import { useSnackbar } from 'notistack';
import { isValidUrl } from "../../public/utils";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const redirect_url_service = "localhost:3001/shortto/";

export default function Render_Home() {
    const [isBack, setIsBack] = useState(false);
    const [link, setLink] = useState("");
    const [customUrl, setCustomUrl] = useState("");
    const [showQr, setShowQr] = useState(false);
    const [error, setError] = useState("");

    const { enqueueSnackbar } = useSnackbar();
    const { mutate: shortenUrlMutation, data, error: mutationError, isLoading } = useShortenUrl();

    const handleLinkChange = (e) => {
        setLink(e.target.value);
        if (error) setError("");
    };

    const handleCustomUrlChange = (e) => setCustomUrl(e.target.value);

    const shortenUrl = useCallback(() => {
        if (!link || !isValidUrl(link)) {
            setError("Please enter a valid URL.");
            return;
        }
        setError("");
        setIsBack(true);
        shortenUrlMutation({ original_url: link, custom_url: customUrl });
    }, [link, customUrl, shortenUrlMutation]);

    const goBack = useCallback(() => {
        setLink("");
        setCustomUrl("");
        setError("");
        setShowQr(false);
        setIsBack(false);
    }, []);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(redirect_url_service + data?.short_url)
            .then(() => {
                enqueueSnackbar("URL copied to clipboard!", { variant: 'success' });
            })
            .catch((err) => {
                enqueueSnackbar("Failed to copy URL: " + err, { variant: 'error' });
            });
    };

    const displayError = error || mutationError?.message;

    return (
        <>
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
                {isBack && data ? "Your Shortened URL" : "Create your short URL"}
            </Typography>

            {!data || !isBack ? (
                <>
                    <TextField variant="filled"
                        label="Enter your link"
                        fullWidth
                        value={link}
                        onChange={handleLinkChange}
                        error={!!displayError}
                        sx={{
                            width: { xs: "100%", sm: "600px" },
                            bgcolor: "white",
                            borderRadius: 1,
                            "& .MuiInputBase-root": { color: "#2c2c2c" },
                        }}
                    />

                    {displayError && (
                        <Typography sx={{ color: "red" }}>
                            {displayError}
                        </Typography>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "center",
                            width: { xs: "100%", sm: "600px" },
                        }}
                    >
                        <TextField variant="filled"
                            label="Custom URL"
                            value={customUrl}
                            onChange={handleCustomUrlChange}
                            sx={{
                                flexGrow: 1,
                                bgcolor: "white",
                                borderRadius: 1,
                                "& .MuiInputBase-root": { color: "#2c2c2c" },
                            }}
                            placeholder="/"
                            disabled={isLoading}
                        />

                        <Button variant="contained"
                            color="primary"
                            sx={{
                                fontSize: "1rem",
                                borderRadius: 2,
                                bgcolor: "#007BFF",
                                "&:hover": {
                                    bgcolor: "#0056b3",
                                },
                            }}
                            onClick={shortenUrl}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : "Shorten URL"}
                        </Button>
                    </Box>
                </>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "15px",
                        width: { xs: "100%", sm: "600px" },
                    }}
                >
                    <TextField
                        label="Your Shortened URL"
                        variant="filled"
                        fullWidth
                        value={redirect_url_service + data.short_url}
                        readOnly
                        sx={{
                            width: { xs: "100%", sm: "600px" },
                            bgcolor: "white",
                            borderRadius: 1,
                            "& .MuiInputBase-root": { color: "#2c2c2c" },
                        }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleCopyToClipboard} size="small">
                                            <ContentCopyIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "center",
                            width: { xs: "100%", sm: "600px" },
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                fontSize: "1rem",
                                borderRadius: 2,
                                bgcolor: "#007BFF",
                                "&:hover": {
                                    bgcolor: "#0056b3",
                                },
                            }}
                            onClick={() => setShowQr(true)} // Show QR code when button is clicked
                        >
                            Generate QR Code
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                fontSize: "1rem",
                                borderRadius: 2,
                                bgcolor: "#007BFF",
                                "&:hover": {
                                    bgcolor: "#0056b3",
                                },
                            }}
                            onClick={goBack}
                        >
                            Go Back
                        </Button>
                    </Box>

                    {showQr && (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px", marginTop: "30px" }}>
                            <QRCodeCanvas
                                value={redirect_url_service + data.short_url}
                                size={256}
                                id="qr-code"
                            />
                            <Button variant="contained"
                                color="primary"
                                onClick={() => {
                                    const canvas = document.getElementById('qr-code');
                                    const dataURL = canvas.toDataURL('image/png');
                                    const link = document.createElement('a');
                                    link.href = dataURL;
                                    link.download = 'qr-code.png';
                                    link.click();
                                }}
                                sx={{
                                    borderRadius: 2,
                                    bgcolor: "#4CAF50",
                                    "&:hover": {
                                        bgcolor: "#388E3C",
                                    },
                                }}
                            >
                                Download QR Code
                            </Button>
                        </Box>
                    )}
                </Box>
            )}
        </>
    );
}