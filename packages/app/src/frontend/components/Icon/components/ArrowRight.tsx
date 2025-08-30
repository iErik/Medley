import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgArrowRight = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    viewBox="0 0 7 11"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M-4.0106e-07 1.24521L3.96808 5.29885L-5.33989e-08 9.35248L1.22159 10.5977L6.42 5.29885L1.22159 -2.67573e-05L-4.0106e-07 1.24521Z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgArrowRight);
export default ForwardRef;
