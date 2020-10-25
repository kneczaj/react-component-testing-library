import React from "react";
import { RenderResult } from "@testing-library/react";
import ReactDOM from 'react-dom/server';

type Expect = (expectation: any) => any;

type TestFn<TProps> = (
  rendered: RenderResult,
  props: TProps,
  /**
   * this expect will work as expect.not if the test is required to fail
   */
  expectResult: Expect
) => void | Promise<void>;

interface Test<TProps> {
  label: string;
  fn: TestFn<TProps>;
}

export function expectNot(expectation: any): any {
  return expect(expectation).not;
}

export type ExpectedResults<TTestNames extends string> = { [key in TTestNames]: boolean };
export type Tests<TTestNames extends string, TProps> = { [key in TTestNames]: Test<TProps> };

type It<TProps> = (
  name: string,
  test: TestFn<TProps>
) => void;

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
