import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import BackDrop from '../Backdrop';

describe('BackDrop Component', () => {
  it('should render children when visible is true', () => {
    const { getByText } = render(
      <BackDrop visible={true}>
        <Text>Test Child</Text>
      </BackDrop>,
    );
    expect(getByText('Test Child')).toBeTruthy();
  });

  // it('should not render children when visible is false', () => {
  //   const { queryByText } = render(
  //     <BackDrop visible={false}>
  //       <Text>Test Child</Text>
  //     </BackDrop>,
  //   );
  //   expect(queryByText('Test Child')).not.toBeOnTheScreen();
  // });

  it('should call onPress when backdrop is pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <BackDrop visible={true} onPress={onPressMock} testID="backdrop-pressable">
        <Text>Test Child</Text>
      </BackDrop>,
    );
    fireEvent.press(getByTestId('backdrop-pressable'));
    expect(onPressMock).toHaveBeenCalled();
  });
});
