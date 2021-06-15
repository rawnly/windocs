import React, { FC } from "react";
import cx, { Value } from 'classnames'

interface IBadgeProps {
  color?: string;
  className?: Value;
}

const Badge: FC<IBadgeProps> = ( { color, className, children } ) => (
  <span className={cx( `inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-${color}-100 text-${color}-800`, className )}>
    {children}
  </span>
)

export default Badge;
