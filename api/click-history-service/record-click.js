import dbClient from '../../utils/database';

export default async function handler(req, res) {
    const { shortUrl } = req.query;

    try {
        // Query to find the short URL's corresponding ID
        const { rows: shortUrlRows } = await dbClient.query('SELECT id FROM short_urls WHERE short_url = $1', [shortUrl]);

        if (shortUrlRows.length === 0) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        const shortUrlId = shortUrlRows[0].id;

        // Check if click history exists for this short URL
        const { rows: clickHistoryRows } = await dbClient.query('SELECT id, click_time FROM click_history WHERE short_url_id = $1', [shortUrlId]);

        if (clickHistoryRows.length > 0) {
            // If history exists, update the click count
            await dbClient.query(`
        UPDATE click_history
        SET click_time = click_time + 1,
            last_clicked_time = NOW()
        WHERE short_url_id = $1
      `, [shortUrlId]);
        } else {
            // Insert new click record if no history exists
            await dbClient.query(`
        INSERT INTO click_history (short_url_id, click_time, last_clicked_time)
        VALUES ($1, 1, NOW())
      `, [shortUrlId]);
        }

        res.status(201).json({ message: 'Click recorded successfully' });
    } catch (error) {
        console.error('Error recording click:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
