import React from 'react';

const IndeterminateCheckbox = React.forwardRef<HTMLInputElement>(
  // @ts-ignore
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      // @ts-ignore
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        {/* @ts-ignore */}
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  },
);

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';

export default IndeterminateCheckbox;
