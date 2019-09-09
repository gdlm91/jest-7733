# Jest 7733

This is a reproduction example of [jest-7733](https://github.com/facebook/jest/issues/7733).

Using jest multi projects glob requires that all packages have a `jest.config.js` or jest will
also run jest from the root of the repo. This seems not obvious and causes weird issues which repos which required
different.

To reproduce:

```bash
git clone https://github.com/freshollie/jest-7733
cd jest 7733
yarn && yarn test
```

## Failure

```bash
$ yarn test
yarn run v1.16.0
$ jest
 FAIL  packages/a/some.test.js
  ● jest › should use the testSetup.js

    expect(received).toBe(expected) // Object.is equality

    Expected: "test"
    Received: undefined

      1 | describe("jest", () => {
      2 |     it("should use the testSetup.js", () => {
    > 3 |         expect(process.env.SOME_REQUIRED_ENV).toBe('test');
        |                                               ^
      4 |     })
      5 | })

      at Object.toBe (packages/a/some.test.js:3:47)

 FAIL  packages/c/some.test.js
  ● jest › should use the testSetup.js

    expect(received).toBe(expected) // Object.is equality

    Expected: "test2"
    Received: undefined

      1 | describe("jest", () => {
      2 |     it("should use the testSetup.js", () => {
    > 3 |         expect(process.env.SOME_REQUIRED_ENV).toBe('test2');
        |                                               ^
      4 |     })
      5 | })

      at Object.toBe (packages/c/some.test.js:3:47)

 PASS  packages/c/some.test.js
 PASS  packages/a/some.test.js

Test Suites: 2 failed, 2 passed, 4 total
Tests:       2 failed, 2 passed, 4 total
Snapshots:   0 total
Time:        2.096s
Ran all test suites in 3 projects.
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

## Fix

Specify the specific projects which need to be run:

```bash
$ cat jestworkaround.config.js 
module.exports = {
    rootDir: ".",
    "projects": [
        "<rootDir>/packages/a",
        "<rootDir>/packages/c"
    ]
}
```

```bash
$ yarn test:workaround
yarn run v1.16.0
$ jest --config jestworkaround.config.js
 PASS  packages/c/some.test.js
 PASS  packages/a/some.test.js

Test Suites: 2 passed, 2 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.223s
Ran all test suites in 2 projects.
✨  Done in 1.93s.
```

