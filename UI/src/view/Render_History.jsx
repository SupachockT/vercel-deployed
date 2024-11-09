import { useState, useRef } from 'react';
import { useUrlHistory } from '../api/urlApi';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, Tab } from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function Render_History() {
    const [viewMode, setViewMode] = useState('table');
    const { data, isLoading, isError, error } = useUrlHistory();

    const [expandedUrls, setExpandedUrls] = useState({});

    const graphContainerRef = useRef(null);
    const toggleView = () => setViewMode(viewMode === 'table' ? 'graph' : 'table');

    // Toggle the visibility of short URLs for a specific original URL
    const toggleExpand = (originalUrl) => {
        setExpandedUrls(prev => ({
            ...prev,
            [originalUrl]: !prev[originalUrl],
        }));
    };

    const renderTable = () => {
        if (!data?.history) return null;

        return (
            <TableContainer component={Paper} sx={{ backgroundColor: "#383838", borderRadius: "4px", maxWidth: '1200px', margin: '0 auto', color: "fff" }}>
                <Table sx={{ borderCollapse: "collapse" }}>
                    <TableHead sx={{ backgroundColor: "#1A1A2E", color: "#fff" }}>
                        <TableRow>
                            <TableCell sx={headerCellStyle}>Original URL</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.history.map((historyItem, idx) => {
                            const originalUrl = historyItem.original_url;
                            const isExpanded = expandedUrls[originalUrl];

                            return (
                                <>
                                    <TableRow
                                        key={originalUrl}
                                        sx={{
                                            ...tableRowStyle,
                                            backgroundColor: isExpanded ? "#2E3B55" : "inherit",  // Highlight color when expanded
                                            transition: "background-color 0.3s ease", // Smooth transition
                                            cursor: "pointer", // Change cursor to pointer on hover
                                        }}
                                        onClick={() => toggleExpand(originalUrl)}
                                    >
                                        <TableCell sx={tableCellStyle} colSpan={3}>
                                            <strong>{originalUrl}</strong>
                                        </TableCell>
                                    </TableRow>

                                    <Collapse in={isExpanded}>
                                        <Table>
                                            <TableHead sx={{ backgroundColor: "#2E2E2E", color: "#fff" }}>
                                                <TableRow sx={tableRowStyle}>
                                                    <TableCell sx={{ ...headerCellStyle, width: '33%' }}>Short URL</TableCell>
                                                    <TableCell sx={{ ...headerCellStyle, width: '33%' }}>Click Time</TableCell>
                                                    <TableCell sx={{ ...headerCellStyle, width: '34%' }}>Last Clicked Time</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {historyItem.short_urls?.map((shortUrlItem, subIdx) => (
                                                    <TableRow key={`${idx}-${subIdx}`} sx={tableRowStyle}>
                                                        <TableCell sx={tableCellStyle}>{shortUrlItem.short_url}</TableCell>
                                                        <TableCell sx={tableCellStyle}>{shortUrlItem.click_time || '0'}</TableCell>
                                                        <TableCell sx={tableCellStyle}>
                                                            {shortUrlItem.last_clicked_time
                                                                ? new Date(shortUrlItem.last_clicked_time).toLocaleString()
                                                                : 'N/A'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Collapse>
                                </>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <>
            <IconButton onClick={toggleView} sx={{ color: "#fff", marginBottom: "12px", marginTop: "12px", marginLeft: "270px", alignSelf: 'flex-start' }}>
                {viewMode === 'table' ? <TableChartIcon /> : <BarChartIcon />}
            </IconButton>
            {viewMode === 'table' ? renderTable() : <div ref={graphContainerRef} style={{ width: '100%', height: '500px' }} />}
        </>
    );
}

const headerCellStyle = {
    color: "#fff",
    fontWeight: "bold",
    padding: "10px",
    textAlign: "center",
};

const tableCellStyle = {
    color: "#ddd",
    padding: "10px",
    textAlign: "center",
    borderBottom: "1px solid #555",
};

const tableRowStyle = {
    '&:hover': {
        backgroundColor: "#555",
    },
};