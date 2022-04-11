# @japa/synthetic-events
> Dummy events to build a Japa tests reporter

[![github-actions-image]][github-actions-url] [![npm-image]][npm-url] [![license-image]][license-url] [![typescript-image]][typescript-url]

Synthetic events emits a variety of dummy events you can use to build a test reporter for Japa.

## Installation
Install the package from npm registry as follows.

```sh
npm i -D @japa/synthetic-events

# yarn
yarn add -D @japa/synthetic-events
```

## Usage
In the following example, the `yourReporter` refers to the implementation of the reporter. Feel free to change the implementation.

```ts
import { Emitter, Runner } from '@japa/core'
import { fire } from '@japa/synthetic-events'

const emitter = new Emitter()
const runner = new Runner(emitter)

yourReporter()(runner, emitter)
runner['boot']()

fire(emitter)
```

```ts
import type { Emitter, Runner } from '@japa/core'

export function yourReporter() {
  return function (runner: Runner, emitter: Emitter) {
    emitter.on('suite:start', (suite) => console.log(suite.name))
    emitter.on('group:start', (group) => console.log(`  ${group.title}`))
    emitter.on('test:end', (test) => {
      console.log(`    > ${test.title} (${test.duration})`)
    })
  }
}
```

[github-actions-image]: https://img.shields.io/github/workflow/status/japa/synthetic-events/test?style=for-the-badge

[github-actions-url]: https://github.com/japa/synthetic-events/actions/workflows/test.yml "github-actions"

[npm-image]: https://img.shields.io/npm/v/@japa/synthetic-events.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/@japa/synthetic-events "npm"

[license-image]: https://img.shields.io/npm/l/@japa/synthetic-events?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]:  "typescript"
