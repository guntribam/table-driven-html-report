import fs from 'fs'
import path from 'path'
import { test } from '@japa/runner'
import { Emitter, Runner } from '@japa/core'
import { fire } from '@japa/synthetic-events'
import { htmlReporter } from '../index'
import {JSDOM} from 'jsdom'

test.group('Report generation tests', group => {
  const defaultReportDir = 'report'
  const defaultReportFilename = 'testsReport.html'
  let emitter: Emitter;
  let runner: any;
  group.each.setup(() => {
    fs.rmSync(path.resolve(__dirname, '..', defaultReportDir), { recursive: true, force: true });
    emitter = new Emitter()
    runner = new Runner(emitter)
  })

  test('Generate Report in default directory', async ({ assert }, done: any) => {
    assert.plan(1)
    htmlReporter()(runner, emitter)
    await fire(emitter)
    emitter.on('uncaught:exception', error => done(error))
    //@ts-ignore
    emitter.on('report:end', () => {
      assert.isTrue(fs.existsSync(path.resolve(__dirname, '..', defaultReportDir, defaultReportFilename)))
      done()
    })
  }).waitForDone()

  test('Generate Report in another directory', async ({ assert }, done: any) => {
    assert.plan(1)
    const directory = "customReportDir"
    htmlReporter({ directory })(runner, emitter)
    await fire(emitter)
    emitter.on('uncaught:exception', error => done(error))
    //@ts-ignore
    emitter.on('report:end', () => {
      assert.isTrue(fs.existsSync(path.resolve(__dirname, '..', directory, defaultReportFilename)))
      done()
    })
  }).waitForDone().teardown(() => {
    const directory = "customReportDir"
    fs.rmSync(path.resolve(__dirname, '..', directory), { recursive: true, force: true });
  })

  test('Generate Report with another name', async ({ assert }, done: any) => {
    assert.plan(1)
    const reportName = "customReportName"
    htmlReporter({ reportName })(runner, emitter)
    await fire(emitter)
    emitter.on('uncaught:exception', error => done(error))
    //@ts-ignore
    emitter.on('report:end', () => {
      assert.isTrue(fs.existsSync(path.resolve(__dirname, '..', defaultReportDir, `${reportName}.html`)))
      done()
    })
  }).waitForDone()

  test('Generate Report in another directory with another name', async ({ assert }, done: any) => {
    assert.plan(1)
    const reportName = "customReportName"
    const directory = "customReportDir"
    htmlReporter({ reportName, directory })(runner, emitter)
    await fire(emitter)
    emitter.on('uncaught:exception', error => done(error))
    //@ts-ignore
    emitter.on('report:end', () => {
      assert.isTrue(fs.existsSync(path.resolve(__dirname, '..', directory, `${reportName}.html`)))
      done()
    })
  }).waitForDone().teardown(() => {
    const directory = "customReportDir"
    fs.rmSync(path.resolve(__dirname, '..', directory), { recursive: true, force: true });
  })
})



test.group('Report data tests', group => {
  const defaultReportDir = 'report'
  const defaultReportFilename = 'testsReport.html'
  let emitter: Emitter;
  let runner: any;
  group.each.setup(() => {
    fs.rmSync(path.resolve(__dirname, '..', defaultReportDir), { recursive: true, force: true });
    emitter = new Emitter()
    runner = new Runner(emitter)
  })

  test('Project name is provided', async ({ assert }, done: any) => {
    assert.plan(1)
    htmlReporter({projectName: "anotherReportName"})(runner, emitter)
    await fire(emitter)
    emitter.on('uncaught:exception', error => done(error))
    //@ts-ignore
    emitter.on('report:end', () => {
      const html = fs.readFileSync(path.resolve(__dirname, '..', defaultReportDir, defaultReportFilename), 'utf-8')
      const dom = new JSDOM(html)
      const projectName = dom.window._document.querySelector('.test-chart-metadata li:nth-child(1) span').innerHTML
      assert.equal(projectName, 'anotherReportName')
      done()
    })
  }).waitForDone()

  test('Success Rate is provided', async ({ assert }, done: any) => {
    assert.plan(1)
    htmlReporter()(runner, emitter)
    await fire(emitter)
    emitter.on('uncaught:exception', error => done(error))
    //@ts-ignore
    emitter.on('report:end', () => {
      const html = fs.readFileSync(path.resolve(__dirname, '..', defaultReportDir, defaultReportFilename), 'utf-8')
      const dom = new JSDOM(html)
      const successRate = dom.window._document.querySelector('.test-chart-metadata li:nth-child(2) span').innerHTML
      assert.equal(successRate, '69.23%')
      done()
    })
  }).waitForDone()

  test('Total Time is not null or empty', async ({ assert }, done: any) => {
    assert.plan(1)
    htmlReporter()(runner, emitter)
    await fire(emitter)
    emitter.on('uncaught:exception', error => done(error))
    //@ts-ignore
    emitter.on('report:end', () => {
      const html = fs.readFileSync(path.resolve(__dirname, '..', defaultReportDir, defaultReportFilename), 'utf-8')
      const dom = new JSDOM(html)
      const totalTime = dom.window._document.querySelector('.test-chart-metadata li:nth-child(3) span').innerHTML
      assert.notEmpty(totalTime)
      done()
    })
  }).waitForDone()

  test('Timestamp is not null or empty', async ({ assert }, done: any) => {
    assert.plan(1)
    htmlReporter()(runner, emitter)
    await fire(emitter)
    emitter.on('uncaught:exception', error => done(error))
    //@ts-ignore
    emitter.on('report:end', () => {
      const html = fs.readFileSync(path.resolve(__dirname, '..', defaultReportDir, defaultReportFilename), 'utf-8')
      const dom = new JSDOM(html)
      const timestamp = dom.window._document.querySelector('.test-chart-metadata li:nth-child(4) span').innerHTML
      assert.notEmpty(timestamp)
      done()
    })
  }).waitForDone()

  test('Total groups data must be provided', async ({ assert }, done: any) => {
    assert.plan(4)
    htmlReporter()(runner, emitter)
    await fire(emitter)
    emitter.on('uncaught:exception', error => done(error))
    //@ts-ignore
    emitter.on('report:end', () => {
      const html = fs.readFileSync(path.resolve(__dirname, '..', defaultReportDir, defaultReportFilename), 'utf-8')
      const dom = new JSDOM(html)
      const totalGroups = dom.window._document.querySelector('.total-groups .total').innerHTML
      const totalGroupsFailed = dom.window._document.querySelector('.total-groups .result.failed').innerHTML
      const totalGroupsPassed = dom.window._document.querySelector('.total-groups .result.passed').innerHTML
      const totalGroupsSkipped = dom.window._document.querySelector('.total-groups .result.skipped').innerHTML
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
    emitter.on('uncaught:exception', error => done(error))
    //@ts-ignore
    emitter.on('report:end', () => {
      const html = fs.readFileSync(path.resolve(__dirname, '..', defaultReportDir, defaultReportFilename), 'utf-8')
      const dom = new JSDOM(html)
      const totalTests = dom.window._document.querySelector('.total-tests .total').innerHTML
      const totalTestsFailed = dom.window._document.querySelector('.total-tests .result.failed').innerHTML
      const totalTestsPassed = dom.window._document.querySelector('.total-tests .result.passed').innerHTML
      const totalTestsSkipped = dom.window._document.querySelector('.total-tests .result.skipped').innerHTML
      assert.equal(totalTests, 156)
      assert.equal(totalTestsFailed, 36)
      assert.equal(totalTestsPassed, 108)
      assert.equal(totalTestsSkipped, 12)
      done()
    })
  }).waitForDone()

})

