import React from "react";
import ReactDOM from "react-dom/server";
import { It, TestFn, Tests } from "./models";
import { act, render, RenderOptions, RenderResult } from "@testing-library/react";

export function isUndefined(val: any): val is undefined {
  return val === undefined;
}

export function expectNot(expectation: any): jest.Expect & jest.AndNot<any> {
  return {
    ...expect(expectation).not,
    not: expect(expectation)
  };
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

/**
 * Standard render() wrapped with act(). This is useful to avoid "not wrapped with act()" warnings when async changes
 * of the state of a component is triggered on render. Examples are useEffect with async calls or GraphQL useSelector
 * hooks.
 * @param ui
 * @param options
 */
export async function asyncRenderWithAct(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
): Promise<RenderResult> {
  let rendered: RenderResult;
  await act(async () => {
    rendered = render(ui, options);
  });
  // @ts-ignore
  return rendered;
}
