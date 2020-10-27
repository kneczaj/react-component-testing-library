# React Component Testing Library

This is being developed with Typescript, but should work with plain js too. All issues regarding cooperation with plain
JS are welcome to be reported.

## The idea

### Write tests with @testing-library/react
`expectResult` is either `expect` or `expect.not` depending on the component state used later. In this way you can use
such test to e.g. check if some value is hidden in all the situations it should not be visible. Still `expect` is
available if you need it. You cannot use `expectResult(...).not` - at least in the current version.

```typescript
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
});
```

### Define base Test component
Here you pass the test suite you have written, and the React web component to be tested.

```typescript
function Test(props: PropsBase<Props, TestNames>) {
  return (
    <TestBase<TestNames, Props>
      component={SampleComponent}
      tests={tests}
      {...props}
    />
  );
}
```

### Define your props-state tree to run the tests for various scenarios
Pushing a button may change one atomic behaviour of your component, but usually all the rest should stay. It requires
a lot of work to test your components in so much details. The props-state tree makes it much easier to repeat all the
defined tests for many different scenarios and just set what is their expected result in each of them, should it pass or
not?

There are `yes` and `no` consts provided which are basically `true` and `false` values but might be clearer for you
for reading when used in tests.

```typescript
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
```

### Complete example
See https://github.com/kneczaj/react-component-testing-library/tree/master/src/example

## The reason for creation

Component testing is very specific. There are couple of repeating steps:
1) Render with particular props set
2) Trigger some events to get the desired state
3) Test the result

This looks like any other test, but there are some details which make them special:
1) Failing tests counts. If in some cases an element of the rendered interface needs to be shown,
it should rather be hidden in others. If a part of interface is disabled in some cases, it probably needs to be enabled
in others.
2) Often atomic props changes need to be tested. This means that all props remain and just one value is changed.
3) To have a component deeply unit-tested there should be many similar tests run for various props sets and state
changes.
4) All these resembles a kind of tree structure where various scenarios might be covered, and looks like it would be
clear to treat it in similar way to React components. 

Taking the upper into consideration this library has been created. With is you may write scenarios tree with JSX for
your React components and check each of them them against a bunch of repeating tests expecting pass or fail for each of
them.

## How to try out
Checkout the repo and run `yarn` and `yarn test`.

## This project needs your help!
If you like the way of testing the components proposed here, the project searches for person who can help writing real
JSX renderer for tests to enable using React Context hooks instead of passing parent's props and expected results with
children-as-a-function.
