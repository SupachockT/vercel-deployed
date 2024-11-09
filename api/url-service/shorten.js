import dotenv from 'dotenv';
import { encodeBase62 } from '../utils/base62';
import dbClient from '../utils/database';

dotenv.config();

export default async function handler(req, res) {
    if (!dbClient) return res.status(500).json({ error: 'Unable to connect to the database' });
    
    if (req.method === 'POST') {
        const { original_url, custom_url } = req.body;

        try {
            let newUrlId;
            let shortUrl;

            const checkUrlQuery = 'SELECT id FROM original_urls WHERE original_url = $1';
            const result = await dbClient.query(checkUrlQuery, [original_url]);

            if (result.rows.length > 0) {
                newUrlId = result.rows[0].id;
            } else {
                const insertUrlQuery = 'INSERT INTO original_urls (original_url) VALUES ($1) RETURNING id';
                const insertResult = await dbClient.query(insertUrlQuery, [original_url]);
                newUrlId = insertResult.rows[0].id;
            }

            if (custom_url) {
                const checkCustomUrlQuery = 'SELECT * FROM short_urls WHERE short_url = $1';
                const customUrlResult = await dbClient.query(checkCustomUrlQuery, [custom_url]);

                if (customUrlResult.rows.length > 0) {
                    return res.status(400).json({ error: 'Custom URL already exists. Please choose another.' });
                }

                shortUrl = custom_url;
            } else {
                const lastShortUrlQuery = 'SELECT id FROM short_urls ORDER BY id DESC LIMIT 1';
                const lastShortUrlResult = await dbClient.query(lastShortUrlQuery);

                const newShortUrlId = lastShortUrlResult.rows.length > 0
                    ? lastShortUrlResult.rows[0].id + 1
                    : 1;

                shortUrl = encodeBase62(newShortUrlId);
            }

            const insertShortUrlQuery = 'INSERT INTO short_urls (original_url_id, short_url) VALUES ($1, $2) RETURNING id';
            const insertShortUrlResult = await dbClient.query(insertShortUrlQuery, [newUrlId, shortUrl]);

            const shortUrlId = insertShortUrlResult.rows[0].id;
            const insertClickHistoryQuery = 'INSERT INTO click_history (short_url_id, click_time) VALUES ($1, $2)';
            await dbClient.query(insertClickHistoryQuery, [shortUrlId, 0]);

            res.status(201).json({ short_url: shortUrl });
        } catch (error) {
            console.error('Error in shortening URL:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}