import { SVGProps } from 'react';

export const Check = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill={'currentColor'}
    height={18}
    viewBox={'0 0 18 18'}
    width={18}
    xmlns={'http://www.w3.org/2000/svg'}
    ref={props.ref}
    {...props}
  >
    <path
      d="M15.5 4.5L6.5 13.5L2.5 9.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);
