import React from "react";
import { makeTestSuite, runTests } from "../index";
import { Props, SampleComponent } from "./sample-component";
import '@testing-library/jest-dom/extend-expect';
import { fireEvent } from '@testing-library/react';
import { PropsBase, TestBase } from "../components/test-base";

type TestNames = 'shows A' | 'shows B' | 'shows C' | 'shows D' | 'shows button';

const tests = makeTestSuite(it => {
  it('shows A', ({ queryByText }, props, expectResult) => {
    expectResult(queryByText('A')).toBeInTheDocument();
  });
  it('shows B', ({ queryByText }, props, expectResult) => {
    expectResult(queryByText('B')).toBeInTheDocument();
  });
  it('shows C', ({ queryByText }, props, expectResult) => {
    expectResult(queryByText('C')).toBeInTheDocument();
  });
  it('shows button', ({ queryByText, queryByRole }, props, expectResult) => {
    expectResult(queryByRole('button', { name: 'show D' })).toBeInTheDocument();
  });
  it('shows D', ({ queryByText }, props, expectResult) => {
    expectResult(queryByText('D')).toBeInTheDocument();
  });
})

function Test(props: PropsBase<Props, TestNames>) {
  return (
    <TestBase<TestNames, Props>
      component={SampleComponent}
      tests={tests}
      {...props}
    />
  );
}

runTests(
  <Test
    label={'SampleComponent'}
    props={{
      a: false,
      b: false
    }}
  >{props => <>
    <Test
      label={'with all false'}
      props={props}
      expectedResults={{
        "shows A": false,
        "shows B": false,
        "shows C": true,
        "shows D": false,
        "shows button": true
      }}
    >{props =>
      <Test
        label={'after clicking the button'}
        props={props}
        beforeEach={({ getByRole }) => {
          fireEvent.click(getByRole('button', { name: 'show D' }));
        }}
        expectedResults={{
          "shows A": false,
          "shows B": false,
          "shows C": false,
          "shows D": true,
          "shows button": true
        }}
      />
    }</Test>
    <Test
      label={'with B set'}
      props={{
        ...props,
        b: true
      }}
      expectedResults={{
        "shows A": false,
        "shows B": true,
        "shows C": false,
        "shows D": false,
        "shows button": false
      }}
    />
    <Test
      label={'with A set'}
      props={{
        ...props,
        a: true
      }}
      expectedResults={{
        "shows A": true,
        "shows B": false,
        "shows C": false,
        "shows D": false,
        "shows button": false
      }}
    />
  </>}</Test>
);
