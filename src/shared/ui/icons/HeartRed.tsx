import type { SVGProps } from 'react'
export const HeartRed = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 16 16" {...props}>
    <g clipPath="url(#heartRed_svg__a)">
      <path
        fill="#CC1439"
        d="M8 14a.67.67 0 0 1-.474-.193L2.346 8.62a3.507 3.507 0 0 1 0-4.933 3.493 3.493 0 0 1 4.934 0l.72.72.72-.72a3.493 3.493 0 0 1 4.933 0 3.506 3.506 0 0 1 0 4.933l-5.18 5.187A.67.67 0 0 1 8 14"
      />
    </g>
    <defs>
      <clipPath id="heartRed_svg__a">
        <path fill="currentColor" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
