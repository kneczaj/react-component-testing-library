import React from "react";
import { cleanup, render, RenderResult } from "@testing-library/react";
import { isUndefined } from "./utils";
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

function expectNot(expectation: any): any {
  return expect(expectation).not;
}

type ExpectedResults<TTestNames extends string> = { [key in TTestNames]: boolean };
type Tests<TTestNames extends string, TProps> = { [key in TTestNames]: Test<TProps> };

export interface PropsBase<TProps = any, TestsNames extends string = string> {
  label: string;
  props: TProps;
  /**
   * no tests will be run if undefined, but describe label will be shown and the props passed too
   */
  expectedResults?: ExpectedResults<TestsNames>;
  children?: (props: TProps) => React.ReactElement;
  beforeAll?: (rendered: RenderResult) => void | Promise<void>;
  afterAll?: (rendered: RenderResult) => void | Promise<void>;
  beforeEach?: (rendered: RenderResult) => void | Promise<void>;
  beforeEachRender?: () => void | Promise<void>;
  afterEach?: (rendered: RenderResult) => void | Promise<void>;
}

export interface Props<TProps = any, TestsNames extends string = string> extends PropsBase<TProps, TestsNames> {
  component: (props: TProps) => JSX.Element;
  tests: Tests<TestsNames, TProps>;
}

export function TestBase<TTestNames extends string, TProps>({
  children,
  component: Component,
  expectedResults,
  label,
  props,
  tests,
  beforeAll: beforeAllHandler,
  afterAll: afterAllHandler,
  afterEach: afterEachHandler,
  beforeEach: beforeEachHandler,
  beforeEachRender: beforeEachRenderHandler
}: Props<TProps, TTestNames>) {
  describe(label, () => {
    let rendered: RenderResult;
    const getRendered = () => rendered;

    beforeEach(() => {
      beforeEachRenderHandler && beforeEachRenderHandler();
      cleanup();
      rendered = render(<Component {...props}/>);
      beforeEachHandler && beforeEachHandler(rendered);
    });

    afterEachHandler && afterEach(() => afterEachHandler(rendered));
    afterAllHandler && afterAll(() => afterAllHandler(rendered));
    beforeAllHandler && beforeAll(() => beforeAllHandler(rendered));

    if (!isUndefined(expectedResults)) {
      (Object.keys(expectedResults) as TTestNames[]).forEach(testLabel => {
        const label = expectedResults[testLabel] ? testLabel : `fails ${testLabel}`;
        const expectFn = expectedResults[testLabel] ? expect : expectNot;
        it(label, () => tests[testLabel].fn(getRendered(), props, expectFn));
      });
    }

    if (isUndefined(children)) {
      return;
    }

    ReactDOM.renderToString(children(props));
  });

  return null;
}

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
