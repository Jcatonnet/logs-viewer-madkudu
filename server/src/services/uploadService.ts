import { parse } from 'fast-csv';
import { Readable } from 'stream';
import prisma from '../prisma/prisma';

interface LogEvent {
    timestamp: string;
    service: string;
    level: string;
    message: string;
    lineNumber: number;
}

const EXPECTED_HEADERS = ['timestamp', 'service', 'level', 'message'];

export const processCSVData = (fileBuffer: Buffer): Promise<{
    success: boolean;
    errors?: { lineNumber: number; error: string }[];
}> => {
    return new Promise((resolve, reject) => {
        const results: LogEvent[] = [];
        const errors: { lineNumber: number; error: string }[] = [];
        let lineNumber = 1;
        let headersValidated = false;

        try {
            const stream = Readable.from(fileBuffer.toString());

            stream
                .pipe(parse({ headers: true }))
                .on('error', (error) => {
                    console.error('Error parsing CSV:', error);
                    reject(new Error('Error processing CSV file'));
                })
                .on('data', (data) => {
                    if (!headersValidated) {
                        const headers = Object.keys(data);
                        const missingHeaders = EXPECTED_HEADERS.filter(
                            (header) => !headers.includes(header)
                        );

                        if (missingHeaders.length > 0) {
                            reject(
                                new Error(
                                    `Wrong file format. Missing required columns: ${missingHeaders.join(', ')}. Expected columns: ${EXPECTED_HEADERS.join(', ')}`
                                )
                            );
                            return;
                        }
                        headersValidated = true;
                    }
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
                            resolve({ success: false, errors });
                        } else {
                            resolve({ success: true });
                        }
                    } catch (dbError) {
                        console.error('Database error:', dbError);
                        reject(new Error('Database error'));
                    }
                });
        } catch (error) {
            console.error('Server error:', error);
            reject(new Error('Server error'));
        }
    });
};
