# table-driven-html-reporter
> Reporter plugin for [japa](https://japa.dev) that generates a html report with your tests 

The `table-driven-html-reporter` plugin makes it simple to generate a report for your suites

Just install the plugin and import to your japa config file and a `report` folder will be generated with a html file after running your tests

# Installation
Install the package from the npm registry as follows:

```sh
npm i -D table-driven-html-reporter

yarn add -D table-driven-html-reporter

pnpm add -D table-driven-html-reporter
```

# Usage

Import the package function and add it to `plugins` array
```ts
import { specReporter } from '@japa/spec-reporter'
import { tableDrivenHtmlReporter } from 'table-driven-html-reporter'

configure({
   reporters: [specReporter(), tableDrivenHtmlReporter()],
})
```
Just run your tests now. Imagine you have the default `Math.add` test group from japa

The folder `report` will be generated with the following files:
```
template.mustache
testReport.html
```
`testReport.html` is the report itself, just open on your default browser

`template.mustache` is the report template that you change to meet your needs

![report](https://imgur.com/a/fWP9RO1)
