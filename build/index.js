"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlReporter = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const get_caller_file_1 = __importDefault(require("get-caller-file"));
require("@japa/core");
const mustache_1 = __importDefault(require("mustache"));
function exists(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs_1.default.promises.access(path);
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
function minifyHtml(html) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const htmlnano = yield Promise.resolve().then(() => __importStar(require('htmlnano')));
            yield Promise.resolve().then(() => __importStar(require('cssnano')));
            yield Promise.resolve().then(() => __importStar(require('postcss')));
            yield Promise.resolve().then(() => __importStar(require('terser')));
            return (yield htmlnano.process(html, {
                removeEmptyAttributes: false,
                collapseWhitespace: 'conservative'
            })).html;
        }
        catch (error) {
            throw new Error(`
        If you want to minify please install the following dependencies:
        
        npm i -D htmlnano cssnano postcss terser
        yarn add -D htmlnano cssnano postcss terser
        pnpm add -D htmlnano cssnano postcss terser
        `);
        }
    });
}
function htmlReporter({ projectName = '-/-', minify = false, directory = 'report', reportName = 'testsReport' } = {}) {
    const testFile = (0, get_caller_file_1.default)();
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
            var _a, _b;
            const testProps = { realValues: [] };
            if ((_b = (_a = payload === null || payload === void 0 ? void 0 : payload.dataset) === null || _a === void 0 ? void 0 : _a.row) === null || _b === void 0 ? void 0 : _b.__rowProps) {
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
            groupValues.push(Object.assign({}, testProps));
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
        emitter.on('runner:end', () => __awaiter(this, void 0, void 0, function* () {
            const successRate = indexes.totalTestsPassed / indexes.totalTests;
            const failedRate = indexes.totalTestsFailed / indexes.totalTests;
            let successRadius;
            let failedRadius;
            const isSuccessPrimary = successRate > failedRate;
            if (isSuccessPrimary) {
                successRadius = successRate * 100;
                failedRadius = failedRate * 100 + successRadius;
            }
            else {
                failedRadius = failedRate * 100;
                successRadius = successRate * 100 + failedRadius;
            }
            const props = Object.assign(Object.assign({}, indexes), { totalTime: suiteTime, timestamp: new Date().toISOString().slice(0, new Date().toISOString().length - 8).replace('T', ' - '), successRate: (successRate * 100).toFixed(2) + '%', failedRate: (failedRate * 100).toFixed(2) + '%', successRadius,
                failedRadius,
                isSuccessPrimary,
                projectName, state: JSON.stringify(state) });
            let report;
            const dirPath = path_1.default.join(path_1.default.dirname(testFile), `/${directory}`);
            if (!(yield exists(dirPath))) {
                yield fs_1.default.promises.mkdir(dirPath, { recursive: true });
            }
            try {
                if (yield exists(path_1.default.join(dirPath, 'template.mustache'))) {
                    const templateFile = yield fs_1.default.promises.readFile(path_1.default.join(dirPath, 'template.mustache'), 'utf-8');
                    report = mustache_1.default.render(templateFile, props);
                }
                else {
                    yield fs_1.default.promises.writeFile(path_1.default.join(dirPath, 'template.mustache'), mustacheTemplate);
                    report = mustache_1.default.render(mustacheTemplate, props);
                }
                const filePath = path_1.default.join(dirPath, `${reportName}.html`);
                yield fs_1.default.promises.writeFile(filePath, minify ? (yield minifyHtml(report)) : report);
            }
            catch (error) {
                throw new Error("there is an error on your template.mustache file: " + error.message);
            }
            emitter.emit('report:end');
        }));
    };
}
exports.htmlReporter = htmlReporter;
const mustacheTemplate = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Test Report</title>
  <style>
  html,
    body {
      margin: 0px;
      font-family: monospace;
      height: 100%;
      overflow: hidden;
    }

    .row {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 100%;
    }

    .column {
      display: flex;
      flex-direction: column;
      flex-basis: 100%;
      flex: 1;
    }

    header {
      background-color: #f5c10e;
      font-size: larger;
      padding: 10px 0px;
      justify-content: space-between;
      width: 100%;
    }

    .search-box {
      position: relative;
      background-color: #333333;
      width: 75%;
      margin: 0 auto;
      color: white;
      font-size: large;
      font-weight: bold;
      border-radius: 5px;
      height: 25px;
      margin-top: 10px;
      padding: 5px;
      padding-top: 10px;
      padding-left: 35px;
      outline-width: 0px;
      outline-color: black;
    }

    [contenteditable=true]:empty:before {
      content: attr(placeholder);
      color: white;
      outline-width: 0px;
      outline-color: black;
      /* For Firefox */
    }

    .search-box:hover {
      background-color: black;
      cursor: pointer;
    }

    [contenteditable=true]:focus {
      outline: none;
    }

    .search-box::before {
      content: "";
      position: absolute;
      top: 0;
      left: 5px;
      bottom: 3px;
      width: 20px;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill-rule='evenodd' stroke='white' stroke-linecap='round' stroke-linejoin='round' fill='none' %3E%3Cpath d='M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
    }

    .container {
      margin: 0 auto;
      background: #fff;
      display: flex;
      height: 100%;
    }

    .sidebar {
      background-color: #333333;
      color: lightgray;
      min-width: 20%;
      max-width: 25%;
      width: 20%;
      overflow-y: auto;
      overflow-x: auto;
    }

    .search {
      display: flex;
      flex-direction: column;
    }

    .search-title {
      text-align: left;
      font-size: large;
      padding: 10px;
      margin-left: 20px;
    }

    .search-input {
      width: 90%;
      height: 30px;
      border-radius: 5px;
      margin: 0 auto;
    }

    .search-results ul {
      list-style-type: none;
    }

    .search-list {
      font-size: large;
      padding-left: 0px;
    }

    .search-list li {
      padding: 10px 20px 10px 13px;
    }

    .test-selected {
      background-color: rgb(37, 37, 37);
      border-left: 4px solid #0085C9;
    }

    .search-list li:hover {
      background-color: black;
      cursor: pointer;
    }

    .suite {
      font-size: small;
    }

    .test-chart {
      display: flex;
      flex-direction: row;
      width: 100%;
      align-items: center;
    }

    .test-chart-pie {
      width: 30%;
    }

    .test-chart-table {
      width: 30%;
    }

    .test-chart-metadata {
      width: 30%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .test-chart-metadata ul {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .test-chart-metadata li {
      display: flex;
      border-bottom: lightgray solid 1px;
    }

    .test-chart-metadata label {
      text-align: left;
      width: 50%;
      font-weight: bold;
    }

    .test-report {
      display: flex;
      align-items: center;
      flex-direction: column;
      text-align: center;
      width: 75%;
    }

    .title {
      font-size: 1.25rem;
      text-align: left;
      text-transform: uppercase;
      width: 12.5rem;
      height: 4rem;
    }

    .result,
    .total {
      font-size: 1.5rem;
      text-align: center;
      text-transform: uppercase;
      width: 5rem;
    }

    .test-status {
      width: 5rem;
      text-align: center;
      height: 2rem;
    }

    .test-status .failed {
      border-bottom: 2px solid #E73E48;
    }

    .test-status .passed {
      border-bottom: 2px solid #27CAA9;
    }

    .test-status .skipped {
      border-bottom: 2px solid gray;
    }

    .result.failed {
      color: #E73E48;
    }

    .result.passed {
      color: #27CAA9;
    }

    .result.skipped {
      color: gray;
    }

    .total-groups {
      background-color: lightgray;
    }

    tbody {
      border: 1px solid lightgray;
    }

    .total-time {
      text-transform: uppercase;
      font-weight: bold;
      font-size: 1.25rem;
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid lightgrey;
      width: 33.5rem;
    }

    .report {
      margin-top: 10px;
      background-color: white;
      width: 100%;
      max-height: 78.75%;
    }

    .test-title {
      padding: 10px
    }

    .test-data,
    .tags {
      font-size: larger;
      color: lightgray;
      display: flex;
      align-items: center;
    }

    .test-data {
      color: black;
      gap: 10px;
    }

    .test-data> :nth-child(1) {
      color: black;
      font-weight: bolder;
    }

    .tags {
      font-weight: bolder;
      gap: 10px;
    }

    .test-id-hour {
      display: flex;
      align-items: center;
      font-size: medium;
      font-weight: bolder;
      gap: 10px;
    }

    .test-id {
      text-align: left;
      display: flex;
      align-items: center;
    }

    .circle {
      width: 45px;
      height: 40px;
      border-radius: 50%;
      display: block;
      margin-right: 10px;
    }

    .green {
      background: #27CAA9;
    }

    .red {
      background: red;
    }

    .details {
      margin: 5px 10px;
      -webkit-flex-grow: 1;
      -moz-flex-grow: 1;
      flex-grow: 1;
      background-color: #ffffff;
      overflow-y: auto;
    }

    .details .content {
      padding: 0.5rem;
      background: #fff;
      font-size: 0.9rem;
    }

    .details .content:after {
      content: "";
      display: table;
      clear: both;
    }

    .details table {
      border-collapse: collapse;
      border: 1px solid #cccccc;
      border-bottom: 0;
      border-right: 0;
      width: 80%
    }

    .details table td,
    .details table th {
      border-bottom: 1px solid #cccccc;
      border-right: 1px solid #cccccc;
      padding: 10px;
    }

    .details table th {
      background: #cccccc;
    }

    .details .data-table {
      border-collapse: collapse;
      border: 1px solid #cccccc;
      border-bottom: 0;
      border-right: 0;
      margin-bottom: 10px;
      width: 100%;
    }

    .details .data-table td {
      color: #000000;
      border-bottom: none;
      border-right: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
      opacity: 0.75;
    }

    .data-table tr.passed td {
      background-color: #27CAA9;
    }

    .data-table tr.failed td {
      background-color: #E73E48;
      color: #ffffff;
    }

    .data-table tr.skipped td {
      background-color: #999999;
      color: #000000;
    }

    .data-table tr.selected td {
      opacity: 1;
    }

    .data-table tr.selected td:first-child {
      border-left: 4px solid #0085C9;
    }

    .data-table tr:hover td {
      opacity: 0.9;
    }

    .table-real-results {
      margin-top: 10px;
    }

    .error-message {
      background-color: black;
      max-width: 50%;
      display: block;
      overflow: auto;
      overflow-wrap: break-word;
      text-align: left;
    }

    pre.bash {
      background-color: black;
      color: white;
      font-size: medium;
      font-family: monospace;
      display: inline;
    }


    .hidden {
      display: none !important;
    }

    .search-list .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .check {
      display: inline-block;
      transform: rotate(45deg);
      height: 11px;
      width: 5px;
      border-bottom: 2.5px solid #27CAA9;
      border-right: 2.5px solid #27CAA9;
    }

    .failing::after {
      font-size: large;
      font-weight: bolder;
      content: 'X';
      color: #E73E48;
    }

  </style>
</head>

<body>
  <main class="container">
  <sidebar class="sidebar">
    <div class="search">
      <div class="search-box">
        <div contenteditable="true" id="search" placeholder="Search Tests"></div>
      </div>
    </div>
    <div class="search-results">
      <ul class="search-list">
      </ul>
    </div>

  </sidebar>

  <div class="test-report">
    <div class="test-chart">
      <div class="test-chart-pie">
        <svg height="150" width="150" viewBox="0 0 50 50">
          <circle r="10.5" cx="25" cy="25" fill="transparent" stroke="lightgrey" stroke-width="21"
            stroke-dasharray="calc(100 * (3.1416 * 21) / 100) calc(3.1416 * 21)"
            transform="rotate(-90) translate(-50)" />
          <circle r="10.5" cx="25" cy="25" fill="transparent" stroke="{{#isSuccessPrimary}}#E73E48{{/isSuccessPrimary}}{{^isSuccessPrimary}}#27CAA9{{/isSuccessPrimary}}" stroke-width="21"
            stroke-dasharray="calc({{#isSuccessPrimary}}{{failedRadius}}{{/isSuccessPrimary}}{{^isSuccessPrimary}}{{successRadius}}{{/isSuccessPrimary}} * (3.1416 * 21) / 100) calc(3.1416 * 21)"
            transform="rotate(-90) translate(-50)" />
          <circle r="10.5" cx="25" cy="25" fill="transparent" stroke="{{#isSuccessPrimary}}#27CAA9{{/isSuccessPrimary}}{{^isSuccessPrimary}}#E73E48{{/isSuccessPrimary}}" stroke-width="21"
            stroke-dasharray="calc({{#isSuccessPrimary}}{{successRadius}}{{/isSuccessPrimary}}{{^isSuccessPrimary}}{{failedRadius}}{{/isSuccessPrimary}} * (3.1416 * 21) / 100) calc(3.1416 * 21)"
            transform="rotate(-90) translate(-50)" />
        </svg>
      </div>
      <div class="test-chart-table">
        <table>
          <thead>
            <tr class="test-status">
              <th />
              <th />
              <th class="failed">Failed</th>
              <th class="passed">Passed</th>
              <th class="skipped">Skipped</th>
            </tr>
          </thead>
          <tbody>
            <tr class="total-groups">
              <th class="title">Total Groups</th>
              <td class="total">{{totalGroups}}</td>
              <td class="result failed">{{totalGroupsFailed}}</td>
              <td class="result passed">{{totalGroupsPassed}}</td>
              <td class="result skipped">-/-</td>
            </tr>
            <tr class="total-tests">
              <th class="title">Total Tests</th>
              <td class="total">{{totalTests}}</td>
              <td class="result failed">{{totalTestsFailed}}</td>
              <td class="result passed">{{totalTestsPassed}}</td>
              <td class="result skipped">{{totalTestsSkipped}}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="test-chart-metadata">
            <ul>
              <li>
                <label>Project:</label>
                <span>{{projectName}}</span>
              </li>
              <li>
                <label>Success Rate:</label>
                <span>{{successRate}}</span>
              </li>
              <li>
                <label>Failed Rate:</label>
                <span>{{failedRate}}</span>
              </li>
              <li>
                <label>Total Time:</label>
                <span>{{totalTime}}</span>
              </li>
              <li>
                <label>Timestamp:</label>
                <span>{{timestamp}}</span>
              </li>
            </ul>

          </div>
        </div>
        <div class="report">
          <div class="test-title">
            <div class="test-data">
              <span></span>
              <span></span>
            </div>
          </div>
          <div class="details">
            <div class="test-table">
              <table class="data-table">
                <thead>
                  <tr>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="test-id-hour">
              <div class="test-id">
                <span class="circle green"></span>
                <span class="test-selected-title"></span>
              </div>
              <span>-</span>
              <span class="test-selected-time"></span>
            </div>
            <div class="table-real-results">
              <table class="data-table">
                <thead>
                  <tr>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="exception">
              <span class="error-message">
                <pre class="bash">
                </pre>
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  <script>
    const state = {{{state}}}

    function selectTestOnSummaryTable(testIndex, headers, rows) {
      const testData = rows[testIndex]
      const title = document.querySelector('.test-selected-title')
      const time = document.querySelector('.test-selected-time')
      title.innerHTML = testData.title;
      title.innerHTML += testData.tags.length ? ('<br/>Tags: ' + testData.tags) : ''
      time.innerHTML = testData.time
      if (testData?.realValues?.length) {
        const table = createTable(headers, { [testIndex]: testData }, 'realValues')
        const parent = document.querySelector('.table-real-results')
        const oldTable = parent.getElementsByTagName('table')[0]
        oldTable && parent.removeChild(oldTable)
        parent.appendChild(table)
      } else {
        document.querySelector('.table-real-results').innerHTML = ''
      }

      const trs = document.querySelector('.test-table tbody').getElementsByTagName('tr');
      [...trs].forEach((element, index) => {
        element.classList.remove('selected')
        if (testIndex === index) element.classList.add('selected')
      });

      document.querySelector('.error-message .bash').innerHTML = testData.error ? testData.errorMessage : ''

      const circle = document.querySelector('.circle')
      circle.classList.remove('green', 'red')
      circle.classList.add(testData.error ? 'red' : 'green');

    }

    function createTable(headers, rows, valueType, selected) {
      const table = document.createElement('table');
      table.classList.add('data-table')
      const thead = table.createTHead()
      const trHead = thead.insertRow()
      headers.forEach(h => {
        const th = document.createElement('th')
        th.innerHTML = h
        trHead.appendChild(th)
      })
      const tbody = table.createTBody();
      const tableRows = Object.values(rows).map((value, i) => {
        const row = tbody.insertRow()
        row.classList.add('row-selector')
        if (valueType === 'tableValues') {
          row.classList.add(value.error ? 'failed' : 'passed')
          row.setAttribute('data-test-item', i)
          row.addEventListener('click', () => selectTestOnSummaryTable(i, headers, rows))
        }
        value[valueType].forEach(val => {
          const td = row.insertCell()
          td.innerHTML = val
        });
        return row;
      })
      tableRows[0].classList.add('selected')
      tableRows[0].click()
      return table
    }

    function showSummaryTable(item) {
      const { headers, values, selected } = state[Number(item.dataset.key)]
      const newTable = createTable(headers, values, 'tableValues', selected)
      const oldTable = document.querySelector('.test-table').getElementsByTagName('table')[0]
      const parentDiv = oldTable.parentElement
      parentDiv.removeChild(oldTable)
      parentDiv.appendChild(newTable)
    }

    function selectTestByTitle(item) {
      const { title, time, tags, suite } = state[Number(item.dataset.key)]
      Array.from(items).forEach(item => item.classList.remove('test-selected'))
      item.classList.add('test-selected');
      document.querySelector('.test-data > :nth-child(1)').innerHTML = title
      document.querySelector('.test-data > :nth-child(2)').innerHTML = ' - ' + suite + ' - ' + time
    }

    const items = state.map((group, index) => {
      const list = document.querySelector('.search-list')
      const li = document.createElement('li')
      li.setAttribute('data-key', index)
      li.classList.add('item')
      index === 0 && li.classList.add('test-selected')
      const title = document.createElement('span')
      if ([...new Set(state.map(g => g.suite))].length > 1) {
        title.innerHTML = group.title + '<span class="suite"> - ' + group.suite + '</span>'
      } else {
        title.innerHTML = group.title
      }
      const icon = document.createElement('span')
      icon.classList.add(group.passed ? 'check' : 'failing')
      li.appendChild(title)
      li.appendChild(icon)
      li.addEventListener('click', () => {
        selectTestByTitle(li);
        showSummaryTable(li);
      })
      list.appendChild(li)
      return li
    })
    items[0].click()

    const input = document.querySelector('#search');
    input.addEventListener('keyup', (ev) => {
      const pattern = new RegExp(ev.target.innerText, 'i');
      Array.from(items).forEach((item) => {
        pattern.test(item.innerText)
          ? item.classList.remove("hidden")
          : item.classList.add("hidden");
      })
    });

    document.querySelector('.error-message .bash').innerHTML = ''
  </script>
</body>

</html>
`;
