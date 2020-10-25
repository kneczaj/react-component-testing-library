import React from "react";
import ReactDOM from "react-dom/server";
import { It, TestFn, Tests } from "./models";

export function isUndefined(val: any): val is undefined {
  return val === undefined;
}

export function expectNot(expectation: any): any {
  return expect(expectation).not;
}

export function makeTestSuite<TTestNames extends string, TProps>(tests: (it: It<TProps>) => void): Tests<TTestNames, TProps> {
  const result = new class {
    tests: Tests<TTestNames, TProps> = {} as Tests<TTestNames, TProps>;
    itWrapper(name: string, test: TestFn<TProps>) {
      this.tests = {
        ...this.tests,
        [name]: {
          name,
          fn: test
        }
      }
    }
  }
  tests(result.itWrapper.bind(result));
  return result.tests;
}

export function runTests(element: React.ReactElement) {
  ReactDOM.renderToString(element);
}
