import { Request, Response } from 'express';
import { parse } from 'fast-csv';
import { Readable } from 'stream';
import prisma from '../prisma';

interface LogEvent {
    timestamp: string;
    service: string;
    level: string;
    message: string;
    lineNumber: number;
}

export const processCSV = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    const results: LogEvent[] = [];
    const errors: { lineNumber: number; error: string }[] = [];
    let lineNumber = 1;

    try {
        const stream = Readable.from(req.file.buffer.toString());

        stream
            .pipe(parse({ headers: true }))
            .on('error', (error) => {
                console.error('Error parsing CSV:', error);
                res.status(500).json({ error: 'Error processing CSV file' });
            })
            .on('data', (data) => {
                lineNumber++;
                try {
                    if (!data.timestamp || !data.service || !data.level || !data.message) {
                        throw new Error('Missing required fields');
                    }

                    const timestamp = new Date(data.timestamp);
                    if (isNaN(timestamp.getTime())) {
                        throw new Error('Invalid timestamp format');
                    }

                    results.push({
                        timestamp: timestamp.toISOString(),
                        service: data.service,
                        level: data.level,
                        message: data.message,
                        lineNumber,
                    });
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                    errors.push({ lineNumber, error: error.message });
                }
            })
            .on('end', async () => {
                try {
                    if (results.length > 0) {
                        await prisma.logEvent.createMany({
                            data: results.map((log) => ({
                                timestamp: new Date(log.timestamp),
                                service: log.service,
                                level: log.level,
                                message: log.message,
                                lineNumber: log.lineNumber,
                            })),
                        });
                    }

                    if (errors.length > 0) {
                        res.status(400).json({
                            message: 'File processed with errors',
                            errors,
                        });
                    } else {
                        res.status(200).json({ message: 'File processed successfully' });
                    }
                } catch (dbError) {
                    console.error('Database error:', dbError);
                    res.status(500).json({ error: 'Database error' });
                }
            });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
