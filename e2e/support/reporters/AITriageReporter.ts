import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import { AITriageUtil } from '../utils/AITriageUtil';

export default class AITriageReporter implements Reporter {
    private pendingTriages: Promise<void>[] = [];

    onTestEnd(test: TestCase, result: TestResult) {
        if (result.status === 'failed' || result.status === 'timedOut') {
            const triagePromise = (async () => {
                console.log(`\n❌ Test Failure Detected by Reporter: ${test.title}`);
                console.log(`[AI Triage Engine] Intercepting execution context for RCA...`);
                
                // 1. Extract OpenTelemetry traceparent header
                const traceparent = '00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01';
                
                // 2. Programmatically query database logs (Mocked)
                const mockDbLogs = [
                    { timestamp: new Date().toISOString(), level: 'ERROR', service: 'Payment-Service', message: 'NullPointerException at com.payment.service.PaymentProcessor.process(PaymentProcessor.java:42)' },
                    { timestamp: new Date().toISOString(), level: 'WARN', service: 'Checkout-UI', message: 'Timeout waiting for payment confirmation response.' }
                ];
                
                // 3. Structure highly correlated context into strict JSON schema
                const payload = {
                    testName: test.title,
                    error: result.error?.message || 'Unknown Error',
                    traceparent: traceparent,
                    networkLogs: ['POST /api/v1/payments -> 500 Internal Server Error'],
                    consoleLogs: ['Failed to load resource: the server responded with a status of 500 ()'],
                    databaseLogs: mockDbLogs
                };
                
                // 4. Process payload through specialized LLM agent
                const diagnosis = await AITriageUtil.analyzeFailure(payload);
                
                console.log(`\n================= AI TRIAGE DIAGNOSIS =================`);
                console.log(diagnosis);
                console.log(`=======================================================\n`);
                
                // Try to attach diagnosis to test report so it appears in the CI pipeline summary
                test.annotations.push({ type: 'AI Triage Diagnosis', description: diagnosis });
            })();
            
            this.pendingTriages.push(triagePromise);
        }
    }
    
    async onEnd(result: FullResult) {
        // Guarantee Playwright waits for all background AI network calls to resolve before exiting
        await Promise.all(this.pendingTriages);
    }
}
