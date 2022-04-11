import fs from 'fs'
import { htmlTemplate } from "./template";
import htmlnano from 'htmlnano'
export interface TestDrivenHtmlReporterConfig {
    projectName?: string
    directory?: string
    reportName?: string
    minify?: boolean
}

async function generateHtml(props: any, minify?: boolean) {
    return minify
        ? await htmlnano.process(htmlTemplate(props), {
            removeEmptyAttributes: false,
            collapseWhitespace: 'conservative'
        })
        : htmlTemplate(props)

}

export function htmlReporter({ projectName, minify, directory = 'report', reportName = 'testsReport' }: TestDrivenHtmlReporterConfig = {}) {
    return (_: any, emitter: any) => {
        const indexes = {
            totalGroups: 0,
            totalGroupsFailed: 0,
            totalGroupsPassed: 0,
            totalGroupsSkipped: 0,
            totalTests: 0,
            totalTestsFailed: 0,
            totalTestsPassed: 0,
            totalTestsSkipped: 0,
        }
        let currentSuite = '';
        let groupHasError = false;
        let state: any[] = []
        let groupHeaders: string[] = [];
        let groupValues: string[] = [];
        let groupStartTime: any;
        let suiteStartTime: any;
        let suiteTime: any;
        let testStartTime: any;

        emitter.on('runner:start', () => { })

        emitter.on('suite:start', ({ name }: { name: string }) => {
            currentSuite = name
            suiteStartTime = new Date().getTime()
        })

        emitter.on('group:start', () => {
            indexes.totalGroups++;
            groupStartTime = new Date().getTime();
            groupHeaders = [];
            groupValues = [];
        })

        emitter.on('test:start', () => {
            indexes.totalTests++;
            testStartTime = new Date().getTime();
        })

        emitter.on('test:end', (payload: any) => {
            const testProps: any = { realValues: [] };
            if (payload?.dataset?.row?.__rowProps) {
                Object.entries(payload.dataset.row).forEach(([key, value]: [string, any]) => {
                    if (key !== '__rowProps') {
                        groupHeaders.push(key)
                        testProps.realValues.push(String(value))
                    } else {
                        testProps['tableValues'] = Object.values(value.fromTable)
                    }
                })
            } else {
                groupHeaders = ['#', 'Scenario']
                testProps['tableValues'] = [indexes.totalTests, payload.title.expanded]
            }
            testProps['tags'] = payload.tags
            testProps['title'] = payload.title.expanded
            testProps['time'] = new Date(new Date().getTime() - testStartTime).toISOString().slice(11, 23)
            if (payload.hasError) {
                groupHasError = true;
                testProps['error'] = true
                testProps['errorMessage'] = `Actual: ${payload.errors[0].error.actual}\nExpected: ${payload.errors[0].error.expected}\n\n${payload.errors[0].error.stack}`
            }
            groupValues.push({ ...testProps })
            if (payload.isSkipped) indexes.totalTestsSkipped++;
            if (payload.hasError) indexes.totalTestsFailed++;
            if (!payload.isSkipped && !payload.hasError) indexes.totalTestsPassed++;
        })

        emitter.on('group:end', ({ title }: { title: string }) => {
            state.push({
                title,
                time: new Date(new Date().getTime() - groupStartTime).toISOString().slice(11, 23),
                passed: !groupHasError,
                suite: currentSuite,
                headers: [...new Set(groupHeaders)],
                values: groupValues
            })
            groupHasError ? indexes.totalGroupsFailed++ : indexes.totalGroupsPassed++
            groupHeaders = []
            groupValues = []
            groupHasError = false
        })

        emitter.on('suite:end', () => {
            suiteTime = new Date(new Date().getTime() - suiteStartTime).toISOString().slice(11, 23)
        })

        emitter.on('runner:end', async () => {
            const props = {
                ...indexes,
                totalTime: suiteTime,
                timestamp: new Date().toISOString().slice(0, new Date().toISOString().length - 8).replace('T', ' - '),
                successRate: indexes.totalTestsPassed / indexes.totalTests,
                projectName,
                state
            }
            await fs.promises.mkdir(`${directory}`)
            await fs.promises.writeFile(`${directory}/${reportName}.html`, await generateHtml(props, minify))
            emitter.emit('report:end')
        })
    }
}
