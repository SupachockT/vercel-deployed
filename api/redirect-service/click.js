// /api/redirect-service/clicks.js
import dbClient from '../../utils/database';

export default async function handler(req, res) {
    const { shortUrl } = req.query;  

    if (req.method === 'POST') {
        try {
            const { rows: shortUrlRows } = await dbClient.query('SELECT id FROM short_urls WHERE short_url = $1', [shortUrl]);

            if (shortUrlRows.length === 0) {
                return res.status(404).json({ error: 'Short URL not found' });
            }

            const shortUrlId = shortUrlRows[0].id;

            // Increment the click count for the short URLF
            const updateClickQuery = 'UPDATE click_history SET click_time = click_time + 1 WHERE short_url_id = $1';
            await dbClient.query(updateClickQuery, [shortUrlId]);

            // Respond with a success message
            res.status(200).json({ message: 'Click count updated successfully' });
        } catch (error) {
            console.error('Error tracking click:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        // Method Not Allowed if it's not a POST request
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
