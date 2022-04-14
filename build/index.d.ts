export interface TestDrivenHtmlReporterConfig {
    projectName?: string;
    directory?: string;
    reportName?: string;
    minify?: boolean;
}
export interface TemplateProps {
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
    failedRate: number;
    successRadius: number;
    failedRadius: number;
    isSuccessPrimary: boolean;
    state: any;
}
export declare function htmlReporter({ projectName, minify, directory, reportName }?: TestDrivenHtmlReporterConfig): (_: any, emitter: any) => void;
