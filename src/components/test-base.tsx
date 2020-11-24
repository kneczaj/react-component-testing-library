import React from "react";
import { cleanup, render, RenderResult } from "@testing-library/react";
import { expectNot, isUndefined } from "../utils";
import ReactDOM from "react-dom/server";
import { ExpectedResults, Tests } from "../models";

export interface PropsBase<TProps = any, TestsNames extends string = string> {
  label: string;
  props: TProps;
  /**
   * no tests will be run if undefined, but describe label will be shown and the props passed too
   */
  expectedResults?: Partial<ExpectedResults<TestsNames>>;
  /**
   * Pass props and expectedResults of this test to children so they can modify them instead of building from scratch.
   * TODO: this would work much better with React Context. Please fill a PR if you want to help implementing! :)
   * @param props
   * @param expectedResults
   */
  children?: (props: TProps, expectedResults: Partial<ExpectedResults<TestsNames>>) => React.ReactElement;
  beforeAll?: (rendered: RenderResult, props: TProps) => void | Promise<void>;
  afterAll?: (rendered: RenderResult, props: TProps) => void | Promise<void>;
  beforeEach?: (rendered: RenderResult, props: TProps) => void | Promise<void>;
  beforeEachRender?: () => void | Promise<void>;
  afterEach?: (rendered: RenderResult, props: TProps) => void | Promise<void>;
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
      beforeEachHandler && beforeEachHandler(rendered, props);
    });

    afterEachHandler && afterEach(() => afterEachHandler(rendered, props));
    afterAllHandler && afterAll(() => afterAllHandler(rendered, props));
    beforeAllHandler && beforeAll(() => beforeAllHandler(rendered, props));

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

    // TODO: this is a kind of hack to "render" the children in the situation when component returns null
    // TODO: this can be done right with a custom renderer
    ReactDOM.renderToString(children(props, expectedResults || {}));
  });

  return null;
}
