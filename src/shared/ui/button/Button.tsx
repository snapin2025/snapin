import { ComponentPropsWithoutRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import s from './button.module.css';
import clsx from 'clsx';

type Props = {
  variant?: 'primary' | 'secondary' | 'outlined' | 'textButton';
  asChild?: boolean;
} & ComponentPropsWithoutRef<'button'>;

export const Button = (props: Props) => {
  const { variant = 'primary', asChild, className, ...rest } = props;

  const Component = asChild ? Slot : 'button';

  return <Component {...rest} className={clsx(s.button, s[variant], className)} />;
};

// export const Button = forwardRef<HTMLButtonElement, Props>((props, forwardedRef) => {
//   const { variant = 'primary', asChild, className, ...rest } = props;
//
//   const Component = asChild ? Slot : 'button';
//
//   return <Component {...rest} ref={forwardedRef} className={clsx(s.button, s[variant], className)} />;
// });

Button.displayName = 'Button';

/*
asChild
clonElement
slot in Radix
*/
