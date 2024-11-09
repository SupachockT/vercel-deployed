import dbClient from '../../utils/database';

export default async function handler(req, res) {
    const { shortUrl } = req.query; 

    if (req.method === 'GET') {
        try {
            const { rows: shortUrlRows } = await dbClient.query('SELECT original_url_id FROM short_urls WHERE short_url = $1', [shortUrl]);

            if (shortUrlRows.length === 0) {
                return res.status(404).json({ error: 'Short URL not found' });
            }

            const originalUrlId = shortUrlRows[0].original_url_id;

            // Query to get the original URL using the original URL ID
            const { rows: originalUrlRows } = await dbClient.query('SELECT original_url FROM original_urls WHERE id = $1', [originalUrlId]);

            // If no matching original URL is found, return 404
            if (originalUrlRows.length === 0) {
                return res.status(404).json({ error: 'Original URL not found' });
            }

            const originalUrl = originalUrlRows[0].original_url;

            // Redirect the user to the original URL
            res.redirect(originalUrl);
        } catch (error) {
            console.error('Error redirecting:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        // Method Not Allowed if it's not a GET request
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}