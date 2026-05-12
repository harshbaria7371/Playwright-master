import * as fs from 'fs';
import { expect } from '@playwright/test';

export default class PdfUtils {
    /**
     * Reads a PDF file from the given path and returns its text content.
     * @param filePath Absolute path to the PDF file
     * @returns Parsed text content of the PDF
     */
    static async readPdfContent(filePath: string): Promise<string> {
        const pdfParse = require('pdf-parse');
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    }

    /**
     * Verifies specific data elements within the parsed PDF text.
     * @param pdfText The raw text parsed from the PDF
     * @param verifyData The type of data to verify
     * @param expectedValue The expected value to check against
     */
    static verifyPdfData(pdfText: string, verifyData: string, expectedValue: string): void {
        switch (verifyData) {
            case "Total Amount": {
                const expectedEuroAmount = `Total TTC${expectedValue.replace('.', ',')} €`;
                expect(pdfText).toContain(expectedEuroAmount);
                break;
            }
            case "Total VAT Amount": {
                const expectedEuroAmount = `Total TVA${expectedValue.replace('.', ',')} €`;
                expect(pdfText).toContain(expectedEuroAmount);
                break;
            }
            case "Total HT Amount": {
                const expectedEuroAmount = `Total HT${expectedValue.replace('.', ',')} €`;
                expect(pdfText).toContain(expectedEuroAmount);
                break;
            }
            default:
                throw new Error(`Verification for data type '${verifyData}' is not implemented.`);
        }
    }

    /**
     * Verifies that the provided company data is present in the PDF text.
     * @param pdfText The raw text parsed from the PDF
     * @param companyData The company data JSON object
     */
    static verifyCompanyData(pdfText: string, companyData: Record<string, string>): void {
        for (const [key, value] of Object.entries(companyData)) {
            // Trim to avoid whitespace mismatches at the start/end of JSON strings
            const expectedValue = value.trim();
            if (expectedValue) {
                // For addresses, PDFs sometimes strip commas, so we provide an informative error message
                expect(pdfText, `PDF should contain company data [${key}]: ${expectedValue}`).toContain(expectedValue);
            }
        }
    }
}
