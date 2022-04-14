import '@japa/runner'
import '@japa/core'

declare module '@japa/runner' {
  interface TestContext {
    // notify TypeScript about custom context properties
  }

  interface Test<TestData> {
    // notify TypeScript about custom test properties
  }



}

declare module '@japa/core' {
  interface RunnerEvents {
    'report:end': void;
  }

}
