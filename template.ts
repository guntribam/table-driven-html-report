export interface TestTemplateProps {
    totalGroups: number
    totalGroupsFailed: number
    totalGroupsPassed: number
    totalGroupsSkipped: number
    totalTests: Number
    totalTestsFailed: Number
    totalTestsPassed: Number
    totalTestsSkipped: Number
    totalTime: string
    timestamp: string
    state: any
}
export const htmlTemplate = (_: TestTemplateProps) => `
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
    height: 100%
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

  .container {
    margin: 0 auto;
    background: #fff;
    display: flex;
  }

  .sidebar {
    background-color: #333333;
    color: lightgray;
    min-width: 20%;
    width: 25%;
    overflow-y: auto;
    overflow-x: auto;
    height: 95.7vh;
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
    border-left: 2px solid red;
  }

  .search-list li:hover {
    background-color: black;
    cursor: pointer;
  }

  .suite {
    font-size: small;
  }

  .test-report {
    display: flex;
    align-items: center;
    flex-direction: column;
    text-align: center;
    width: 75%;
    height: 95.7vh;
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
    border-bottom: 2px solid red;
  }

  .test-status .passed {
    border-bottom: 2px solid green;
  }

  .test-status .skipped {
    border-bottom: 2px solid gray;
  }

  .result.failed {
    color: red;
  }

  .result.passed {
    color: green;
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
    background-color: black;
    padding: 10px
  }

  .test-data,
  .tags {
    font-size: larger;
    color: lightgray;
    display: flex;
  }

  .test-data {
    gap: 10px;
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
    background: #27caa9;
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
    overflow-y: scroll;
    max-height: 93.275%;
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
    transform : scale(0,0);
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
    border-bottom: 2.5px solid lightgreen;
    border-right: 2.5px solid lightgreen;
  }

  .failing::after {
    font-size: large;
    font-weight: bolder;
    content: 'X';
    color: rgb(252, 92, 92)
  }

  </style>
</head>

<body>
  <header class="row header">
    <span>Project: Contas</span>
    <span>Generated on: ${_.timestamp}</span>
  </header>
  <main class="container">
    <sidebar class="sidebar">
      <div class="search">
        <label class="search-title" id="search-title">Test Search:</label>
        <input for="search-title" type="search" id="search" autocomplete="off" class="search-input" />
      </div>
      <div class="search-results">
        <ul class="search-list">
        </ul>
      </div>

    </sidebar>

    <div class="test-report">
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
            <td class="total">${_.totalGroups}</td>
            <td class="result failed">${_.totalGroupsFailed}</td>
            <td class="result passed">${_.totalGroupsPassed}</td>
            <td class="result skipped">${_.totalGroupsSkipped}</td>
          </tr>
          <tr class="total-tests">
            <th class="title">Total Tests</th>
            <td class="total">${_.totalTests}</td>
            <td class="result failed">${_.totalTestsFailed}</td>
            <td class="result passed">${_.totalTestsPassed}</td>
            <td class="result skipped">${_.totalTestsSkipped}</td>
          </tr>
        </tbody>
      </table>
      <div class="total-time">
        <span>Total time</span>
        <span>${_.totalTime}</span>
      </div>
      <div class="report">
      <div class="test-title">
        <div class="test-data">
          <span></span>
          <span>-</span>
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
              <tr><td></td></tr>
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
              <tr><td></td></tr>
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
    const state = ${JSON.stringify(_.state)}

    function selectTestOnSummaryTable(testIndex, headers, rows) {
      const testData = rows[testIndex]
      const title = document.querySelector('.test-selected-title')
      const time = document.querySelector('.test-selected-time')
      title.innerHTML = testData.title;
      title.innerHTML +=  testData.tags.length ? ('<br/>Tags: ' + testData.tags) : ''
      time.innerHTML = testData.time
      if(testData?.realValues?.length){
        const table = createTable(headers, { [testIndex]: testData }, 'realValues')
        const parent = document.querySelector('.table-real-results')
        const oldTable = parent.getElementsByTagName('table')[0]
        oldTable && parent.removeChild(oldTable)
        parent.appendChild(table)
      }else{
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
      document.querySelector('.test-data > :nth-child(1)').innerHTML = title + ' - ' + suite
      document.querySelector('.test-data > :nth-child(3)').innerHTML = time
    }

    const items = state.map((group, index) => {
      const list = document.querySelector('.search-list')
      const li = document.createElement('li')
      li.setAttribute('data-key', index)
      li.classList.add('item')
      index === 0 && li.classList.add('test-selected')
      const title = document.createElement('span')
      if([...new Set(state.map(g => g.suite))].length > 1){
        title.innerHTML = group.title + '<span class="suite"> - '+group.suite+'</span>'
      }else{
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
      const pattern = new RegExp(ev.target.value, 'i');
      for (let i = 0; i < items.length; i++) {
        pattern.test(items[i].innerText)
          ? items[i].classList.remove("hidden")
          : items[i].classList.add("hidden");
      }
    });

    document.querySelector('.error-message .bash').innerHTML = ''
  </script>
</body>

</html>
`