# React Component Testing Library

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

See `sample-component.spec.tsx` for details.
