export interface TestDrivenHtmlReporterConfig {
    projectName?: string;
    directory?: string;
    reportName?: string;
    minify?: boolean;
}
export declare function htmlReporter({ projectName, minify, directory, reportName }?: TestDrivenHtmlReporterConfig): (_: any, emitter: any) => void;
