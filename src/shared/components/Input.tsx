import React from 'react';
import type { TextInputProps } from 'react-native';
import { TextInput, View } from 'react-native';
import colors from 'tailwindcss/colors';

import { cn } from '#/shared/utils';

export interface OutlinedProps extends Omit<TextInputProps, 'style'> {
  className?: string;
  inputClassName?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Outlined = React.forwardRef<TextInput, OutlinedProps>((props, ref) => {
  const { className, inputClassName, ...inputProps } = props;
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View
      className={cn(
        'rounded-md bg-white p-3 flex-row items-center',
        className,
        isFocused && 'border-primary',
      )}>
      {props.prefix}
      <TextInput
        {...inputProps}
        ref={ref}
        onFocus={(e) => {
          props.onFocus?.(e);
          setIsFocused(true);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        placeholderTextColor={inputProps.placeholderTextColor ?? colors.gray[400]}
        className={cn('flex-1', inputClassName)}
      />
      {props.suffix}
    </View>
  );
});

Outlined.displayName = 'Outlined';

export interface UnderlinedProps extends Omit<TextInputProps, 'style'> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  inputClassName?: string;
  className?: string;
}

const Underlined = React.forwardRef<TextInput, UnderlinedProps>((props, ref) => {
  const { className, inputClassName, ...inputProps } = props;
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View
      className={cn(
        'border-b border-gray-400 px-2 py-3 flex-row items-center',
        className,
        isFocused && 'border-primary',
      )}>
      {props.prefix}
      <TextInput
        {...inputProps}
        ref={ref}
        onFocus={(e) => {
          props.onFocus?.(e);
          setIsFocused(true);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        placeholderTextColor={inputProps.placeholderTextColor ?? colors.gray[400]}
        className={cn('flex-1', inputClassName)}
      />
      {props.suffix}
    </View>
  );
});

Underlined.displayName = 'Underlined';

export default { Outlined, Underlined };
