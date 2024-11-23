import { Request, Response } from 'express';
import { processCSVData } from '../services/uploadService';

export const processCSV = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    try {
        const result = await processCSVData(req.file.buffer);

        if (result.success) {
            res.status(200).json({ message: 'File processed successfully' });
        } else if (result.errors) {
            res.status(400).json({
                message: 'File processed with errors',
                errors: result.errors,
            });
        } else {
            res.status(500).json({ error: 'An error occurred' });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error processing CSV:', error);
        res.status(500).json({ error: error.message || 'An error occurred' });
    }
};