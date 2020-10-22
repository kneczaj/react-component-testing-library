import React from "react";
import { makeTestSuite, PropsBase, runTests, TestBase } from "./jsx-test";
import { Props, SampleComponent } from "./sample-component";
import '@testing-library/jest-dom/extend-expect';

type TestNames = 'shows A' | 'shows B' | 'shows C';

const tests = makeTestSuite(it => {
  it('shows A', ({ queryByText }, props, expect) => {
    expect(queryByText('A')).toBeInTheDocument();
  });
  it('shows B', ({ queryByText }, props, expect) => {
    expect(queryByText('B')).toBeInTheDocument();
  });
  it('shows C', ({ queryByText }, props, expect) => {
    expect(queryByText('C')).toBeInTheDocument();
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
        "shows C": true
      }}
    />
    <Test
      label={'with B set'}
      props={{
        ...props,
        b: true
      }}
      expectedResults={{
        "shows A": false,
        "shows B": true,
        "shows C": false
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
        "shows C": false
      }}
    />
  </>}</Test>
);
