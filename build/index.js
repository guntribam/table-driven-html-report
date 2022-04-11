"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlReporter = void 0;
const fs_1 = __importDefault(require("fs"));
const template_1 = require("./template");
const htmlnano_1 = __importDefault(require("htmlnano"));
async function generateHtml(props, minify) {
    return minify
        ? await htmlnano_1.default.process((0, template_1.htmlTemplate)(props), {
            removeEmptyAttributes: false,
            collapseWhitespace: 'conservative'
        })
        : (0, template_1.htmlTemplate)(props);
}
function htmlReporter({ projectName, minify, directory = 'report', reportName = 'testsReport' } = {}) {
    return (_, emitter) => {
        const indexes = {
            totalGroups: 0,
            totalGroupsFailed: 0,
            totalGroupsPassed: 0,
            totalGroupsSkipped: 0,
            totalTests: 0,
            totalTestsFailed: 0,
            totalTestsPassed: 0,
            totalTestsSkipped: 0,
        };
        let currentSuite = '';
        let groupHasError = false;
        let state = [];
        let groupHeaders = [];
        let groupValues = [];
        let groupStartTime;
        let suiteStartTime;
        let suiteTime;
        let testStartTime;
        emitter.on('runner:start', () => { });
        emitter.on('suite:start', ({ name }) => {
            currentSuite = name;
            suiteStartTime = new Date().getTime();
        });
        emitter.on('group:start', () => {
            indexes.totalGroups++;
            groupStartTime = new Date().getTime();
            groupHeaders = [];
            groupValues = [];
        });
        emitter.on('test:start', () => {
            indexes.totalTests++;
            testStartTime = new Date().getTime();
        });
        emitter.on('test:end', (payload) => {
            const testProps = { realValues: [] };
            if (payload?.dataset?.row?.__rowProps) {
                Object.entries(payload.dataset.row).forEach(([key, value]) => {
                    if (key !== '__rowProps') {
                        groupHeaders.push(key);
                        testProps.realValues.push(String(value));
                    }
                    else {
                        testProps['tableValues'] = Object.values(value.fromTable);
                    }
                });
            }
            else {
                groupHeaders = ['#', 'Scenario'];
                testProps['tableValues'] = [indexes.totalTests, payload.title.expanded];
            }
            testProps['tags'] = payload.tags;
            testProps['title'] = payload.title.expanded;
            testProps['time'] = new Date(new Date().getTime() - testStartTime).toISOString().slice(11, 23);
            if (payload.hasError) {
                groupHasError = true;
                testProps['error'] = true;
                testProps['errorMessage'] = `Actual: ${payload.errors[0].error.actual}\nExpected: ${payload.errors[0].error.expected}\n\n${payload.errors[0].error.stack}`;
            }
            groupValues.push({ ...testProps });
            if (payload.isSkipped)
                indexes.totalTestsSkipped++;
            if (payload.hasError)
                indexes.totalTestsFailed++;
            if (!payload.isSkipped && !payload.hasError)
                indexes.totalTestsPassed++;
        });
        emitter.on('group:end', ({ title }) => {
            state.push({
                title,
                time: new Date(new Date().getTime() - groupStartTime).toISOString().slice(11, 23),
                passed: !groupHasError,
                suite: currentSuite,
                headers: [...new Set(groupHeaders)],
                values: groupValues
            });
            groupHasError ? indexes.totalGroupsFailed++ : indexes.totalGroupsPassed++;
            groupHeaders = [];
            groupValues = [];
            groupHasError = false;
        });
        emitter.on('suite:end', () => {
            suiteTime = new Date(new Date().getTime() - suiteStartTime).toISOString().slice(11, 23);
        });
        emitter.on('runner:end', async () => {
            const props = {
                ...indexes,
                totalTime: suiteTime,
                timestamp: new Date().toISOString().slice(0, new Date().toISOString().length - 8).replace('T', ' - '),
                successRate: indexes.totalTestsPassed / indexes.totalTests,
                projectName,
                state
            };
            await fs_1.default.promises.mkdir(`${directory}`);
            await fs_1.default.promises.writeFile(`${directory}/${reportName}.html`, await generateHtml(props, minify));
            emitter.emit('report:end');
        });
    };
}
exports.htmlReporter = htmlReporter;
