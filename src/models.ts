import { RenderResult } from "@testing-library/react";

export type Expect = (expectation: any) => any;

export type TestFn<TProps> = (
  rendered: RenderResult,
  props: TProps,
  /**
   * this expect will work as expect.not if the test is required to fail
   */
  expectResult: Expect
) => void | Promise<void>;

export interface Test<TProps> {
  label: string;
  fn: TestFn<TProps>;
}

export type ExpectedResults<TTestNames extends string> = { [key in TTestNames]: boolean };
export type Tests<TTestNames extends string, TProps> = { [key in TTestNames]: Test<TProps> };

export type It<TProps> = (
  name: string,
  test: TestFn<TProps>
) => void;

export const yes = true;
export const no = false;
