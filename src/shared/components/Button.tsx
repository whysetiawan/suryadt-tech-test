import type { PressableProps } from 'react-native';
import { Pressable, Text, View } from 'react-native';

import { cn } from '#/shared/utils';

export interface ButtonProps extends PressableProps {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  children?: React.ReactNode | string;
  tintColor?: string;
  size?: 'small' | 'large';
}

const Primary: React.FC<ButtonProps> = ({ children, prefix, suffix, className, ...props }) => {
  return (
    <Pressable
      {...props}
      className={cn(
        'flex w-full flex-row bg-primary rounded-full justify-between items-center py-3',
        props.disabled && 'bg-primary/10',
        props.size === 'small' && 'py-2 w-auto px-5',
        className,
      )}>
      {prefix ? <>{prefix}</> : <View />}
      {typeof children === 'string' ? (
        <Text
          className={cn(
            'text-base text-white font-medium',
            props.disabled && 'text-grey-dark',
            props.size === 'small' && 'text-sm',
          )}>
          {children}
        </Text>
      ) : (
        children
      )}
      {suffix ? <>{suffix}</> : <View />}
    </Pressable>
  );
};

export default Primary;
