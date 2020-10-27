import React from "react";
import { makeTestSuite, runTests, yes, no, PropsBase, TestBase } from "../index";
import { Props, SampleComponent } from "./sample-component";
import '@testing-library/jest-dom/extend-expect';
import { fireEvent } from '@testing-library/react';

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
    expectedResults={{
      "shows A": no,
      "shows B": no,
      "shows C": yes,
      "shows D": no,
      "shows button": yes
    }}
  >{(props, expectedResults) => <>
    <Test
      label={'with all false'}
      props={props}
      expectedResults={expectedResults}
    >{(props, expectedResults) =>
      <Test
        label={'after clicking the button'}
        props={props}
        beforeEach={({ getByRole }) => {
          fireEvent.click(getByRole('button', { name: 'show D' }));
        }}
        expectedResults={{
          ...expectedResults,
          "shows C": no,
          "shows D": yes
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
        ...expectedResults,
        "shows B": yes,
        "shows C": no,
        "shows button": no
      }}
    />
    <Test
      label={'with A set'}
      props={{
        ...props,
        a: yes
      }}
      expectedResults={{
        ...expectedResults,
        "shows A": yes,
        "shows C": no,
        "shows button": no
      }}
    />
  </>}</Test>
);
