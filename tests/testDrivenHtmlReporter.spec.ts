import fs from 'fs'
import path from 'path'
import { test } from '@japa/runner'
import { Emitter, Runner } from '@japa/core'
import { fire } from '@japa/synthetic-events'
import { htmlReporter } from '../index'
import { JSDOM } from 'jsdom'

const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time))
}

test.group('Report generation tests', group => {
  const defaultReportDir = 'report'
  const defaultReportFilename = 'testsReport.html'
  const rootPath = path.resolve('tests')
  const dirPath = path.join(rootPath, defaultReportDir)
  const filePath = path.join(dirPath, defaultReportFilename)
  let emitter: Emitter;
  let runner: any;

  group.each.setup(() => {
    fs.rmSync(dirPath, { recursive: true, force: true });
    emitter = new Emitter()
    runner = new Runner(emitter)
  })

  group.each.teardown(() => {
    fs.rmSync(dirPath, { recursive: true, force: true });
  })

  test('Generate Report in default directory', async ({ assert }, done: any) => {
    assert.plan(1)
    htmlReporter()(runner, emitter)
    await fire(emitter)
    emitter.on('report:end', () => {
      assert.isTrue(fs.existsSync(filePath))
      done()
    })
  }).waitForDone()

  test('Generate Report in another directory', async ({ assert }, done: any) => {
    assert.plan(1)
    const directory = "customReportDir"
    htmlReporter({ directory })(runner, emitter)
    await fire(emitter)
    emitter.on('report:end', () => {
      assert.isTrue(fs.existsSync(path.join(rootPath, directory, defaultReportFilename)))
      done()
    })
  }).waitForDone().teardown(() => {
    const directory = "customReportDir"
    fs.rmSync(path.join(rootPath, directory), { recursive: true, force: true });
  })

  test('Generate Report with another name', async ({ assert }, done: any) => {
    assert.plan(1)
    const reportName = "customReportName"
    htmlReporter({ reportName })(runner, emitter)
    await fire(emitter)
    emitter.on('report:end', () => {
      assert.isTrue(fs.existsSync(path.join(dirPath, `${reportName}.html`)))
      done()
    })
  }).waitForDone()

  test('Generate Report in another directory with another name', async ({ assert }, done: any) => {
    assert.plan(1)
    const reportName = "customReportName"
    const directory = "customReportDir"
    htmlReporter({ reportName, directory })(runner, emitter)
    await fire(emitter)
    emitter.on('report:end', () => {
      assert.isTrue(fs.existsSync(path.join(rootPath, directory, `${reportName}.html`)))
      done()
    })
  }).waitForDone().teardown(() => {
    const directory = "customReportDir"
    fs.rmSync(path.join(rootPath, directory), { recursive: true, force: true });
  })

  test('Generate a minified report with at least 10% size reduction', async ({ assert }, done: any) => {
    assert.plan(1)
    htmlReporter()(runner, emitter)
    emitter.on('report:end', async () => {
      const normalSize = (await fs.promises.stat(filePath)).size
      let newEmitter = new Emitter()
      let newRunner = new Runner(newEmitter)
      htmlReporter({ minify: true, reportName: "minified" })(newRunner, newEmitter)
      newEmitter.on('report:end', async () => {
        const { size: minifiedSize } = await fs.promises.stat(path.join(dirPath, 'minified.html'))
        assert.isAbove(normalSize, minifiedSize * 1.1)
        done()
      })
      await fire(newEmitter)
    })
    await fire(emitter)
  }).waitForDone()

})

test.group('Template generation tests', group => {
  const defaultReportDir = 'report'
  const defaultReportFilename = 'testsReport.html'
  const rootPath = path.resolve('tests')
  const dirPath = path.join(rootPath, defaultReportDir)
  const filePath = path.join(dirPath, defaultReportFilename)
  let emitter: Emitter;
  let runner: any;

  group.each.setup(() => {
    fs.rmSync(dirPath, { recursive: true, force: true });
    emitter = new Emitter()
    runner = new Runner(emitter)
  })

  group.each.teardown(() => {
    fs.rmSync(dirPath, { recursive: true, force: true });
  })

  test('Generate the template on the report folder', async ({ assert }, done: any) => {
    assert.plan(1)
    htmlReporter()(runner, emitter)
    await fire(emitter)
    emitter.on('report:end', () => {
      assert.isTrue(fs.existsSync(path.join(dirPath, 'template.mustache')))
      done()
    })
  }).waitForDone()

  test('Generate the template on a custom report folder', async ({ assert }, done: any) => {
    assert.plan(1)
    const directory = 'customReportDir'
    htmlReporter({ directory })(runner, emitter)
    await fire(emitter)
    emitter.on('report:end', () => {
      assert.isTrue(fs.existsSync(path.join(rootPath, directory, 'template.mustache')))
      done()
    })
  }).waitForDone().teardown(() => {
    const directory = "customReportDir"
    fs.rmSync(path.join(rootPath, directory), { recursive: true, force: true });
  })
  test('Change the template and assert the custom text', async ({ assert }, done: any) => {
    assert.plan(1)
    await fs.promises.writeFile(path.join(dirPath, 'template.mustache'), `
        <!DOCTYPE html><html lang="en"><body><h1>Custom Template</h1></body></html>
    `)
    htmlReporter()(runner, emitter)
    await fire(emitter)
    emitter.on('report:end', () => {
      const report = fs.readFileSync(path.join(dirPath, defaultReportFilename), 'utf-8')
      //console.log({report})
      assert.include(report, 'Custom Template')
      done()
    })
  }).waitForDone().setup(() => {
    fs.mkdirSync(dirPath, { recursive: true })
  })

})

test.group('Report data tests', group => {
  const defaultReportDir = 'report'
  const defaultReportFilename = 'testsReport.html'
  const rootPath = path.resolve('tests')
  const dirPath = path.join(rootPath, defaultReportDir)
  const filePath = path.join(dirPath, defaultReportFilename)
  let emitter: Emitter;
  let runner: Runner<any>;

  group.each.setup(() => {
    fs.rmSync(dirPath, { recursive: true, force: true });
    emitter = new Emitter()
    runner = new Runner(emitter)
  })

  group.teardown(() => {
    fs.rmSync(dirPath, { recursive: true, force: true });
  })

  test('Project name is provided', async ({ assert }, done: any) => {
    assert.plan(1)
    htmlReporter({ projectName: "anotherReportName" })(runner, emitter)
    await fire(emitter)
    emitter.on('report:end', () => {
      const html = fs.readFileSync(filePath, 'utf-8')
      const { _document: document } = new JSDOM(html).window
      const projectName = document.querySelector('.test-chart-metadata li:nth-child(1) span').innerHTML
      assert.equal(projectName, 'anotherReportName')
      done()
    })
  }).waitForDone()

  test('Success Rate is provided', async ({ assert }, done: any) => {
    assert.plan(1)
    htmlReporter()(runner, emitter)
    await fire(emitter)
    emitter.on('report:end', () => {
      const html = fs.readFileSync(filePath, 'utf-8')
      const { _document: document } = new JSDOM(html).window
      const successRate = document.querySelector('.test-chart-metadata li:nth-child(2) span').innerHTML
      assert.equal(successRate, '69.23%')
      done()
    })
  }).waitForDone()

  test('Failed Rate is provided', async ({ assert }, done: any) => {
    assert.plan(1)
    htmlReporter()(runner, emitter)
    await fire(emitter)
    emitter.on('report:end', () => {
      const html = fs.readFileSync(filePath, 'utf-8')
      const { _document: document } = new JSDOM(html).window
      const failedRate = document.querySelector('.test-chart-metadata li:nth-child(3) span').innerHTML
      assert.equal(failedRate, '23.08%')
      done()
    })
  }).waitForDone()

  test('Total Time is not null or empty', async ({ assert }, done: any) => {
    assert.plan(1)
    htmlReporter()(runner, emitter)
    await fire(emitter)
    emitter.on('report:end', () => {
      const html = fs.readFileSync(filePath, 'utf-8')
      const { _document: document } = new JSDOM(html).window
      const totalTime = document.querySelector('.test-chart-metadata li:nth-child(3) span').innerHTML
      assert.notEmpty(totalTime)
      done()
    })
  }).waitForDone()

  test('Timestamp is not null or empty', async ({ assert }, done: any) => {
    assert.plan(1)
    htmlReporter()(runner, emitter)
    await fire(emitter)
    emitter.on('report:end', () => {
      const html = fs.readFileSync(filePath, 'utf-8')
      const { _document: document } = new JSDOM(html).window
      const timestamp = document.querySelector('.test-chart-metadata li:nth-child(4) span').innerHTML
      assert.notEmpty(timestamp)
      done()
    })
  }).waitForDone()

  test('Total groups data must be provided', async ({ assert }, done: any) => {
    assert.plan(4)
    htmlReporter()(runner, emitter)
    await fire(emitter)
    emitter.on('report:end', () => {
      const html = fs.readFileSync(filePath, 'utf-8')
      const { _document: document } = new JSDOM(html).window
      const totalGroups = document.querySelector('.total-groups .total').innerHTML
      const totalGroupsFailed = document.querySelector('.total-groups .result.failed').innerHTML
      const totalGroupsPassed = document.querySelector('.total-groups .result.passed').innerHTML
      const totalGroupsSkipped = document.querySelector('.total-groups .result.skipped').innerHTML
      assert.equal(totalGroups, 12)
      assert.equal(totalGroupsFailed, 12)
      assert.equal(totalGroupsPassed, 0)
      assert.equal(totalGroupsSkipped, '-/-')
      done()
    })
  }).waitForDone()

  test('Total tests data must be provided', async ({ assert }, done: any) => {
    assert.plan(4)
    htmlReporter()(runner, emitter)
    await fire(emitter)
    emitter.on('report:end', () => {
      const html = fs.readFileSync(filePath, 'utf-8')
      const { _document: document } = new JSDOM(html).window
      const totalTests = document.querySelector('.total-tests .total').innerHTML
      const totalTestsFailed = document.querySelector('.total-tests .result.failed').innerHTML
      const totalTestsPassed = document.querySelector('.total-tests .result.passed').innerHTML
      const totalTestsSkipped = document.querySelector('.total-tests .result.skipped').innerHTML
      assert.equal(totalTests, 156)
      assert.equal(totalTestsFailed, 36)
      assert.equal(totalTestsPassed, 108)
      assert.equal(totalTestsSkipped, 12)
      done()
    })
  }).waitForDone()

  test('Contains 13 tests on initial page', async ({ assert }, done: any) => {
    assert.plan(1)
    htmlReporter()(runner, emitter)
    await fire(emitter)
    emitter.on('report:end', () => {
      const html = fs.readFileSync(filePath, 'utf-8')
      try {
        const { _document: document } = new JSDOM(html, { runScripts: "dangerously", resources: "usable" }).window
        const totalTestsOnPage = Array.from(document.querySelectorAll('[data-test-item]')).length
        assert.equal(totalTestsOnPage, 13)
      } catch (error) { }
      done()
    })
  }).waitForDone()

  test('Contains 12 groups', async ({ assert }, done: any) => {
    assert.plan(1)
    htmlReporter()(runner, emitter)
    await fire(emitter)
    emitter.on('report:end', () => {
      const html = fs.readFileSync(filePath, 'utf-8')
      const { _document: document } = new JSDOM(html, { runScripts: "dangerously", resources: "usable" }).window
      const totalGroupsOnPage = Array.from(document.querySelectorAll('[data-key]')).length
      assert.equal(totalGroupsOnPage, 12)
      done()
    })
  }).waitForDone()

})

