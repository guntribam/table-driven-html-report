export interface TestTemplateProps {
    totalGroups: number;
    totalGroupsFailed: number;
    totalGroupsPassed: number;
    totalGroupsSkipped: number;
    totalTests: Number;
    totalTestsFailed: Number;
    totalTestsPassed: Number;
    totalTestsSkipped: Number;
    totalTime: string;
    timestamp: string;
    projectName: string;
    successRate: number;
    state: any;
}
export declare const htmlTemplate: (_: TestTemplateProps) => string;
