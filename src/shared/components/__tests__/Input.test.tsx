import { render, userEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import '@testing-library/jest-native/extend-expect';

import Input from '../Input';

const setupComponent = (jsx: React.ReactElement<any>) => {
  return {
    ...render(jsx),
    user: userEvent.setup(),
  };
};

describe('Input Components', () => {
  describe('Outlined', () => {
    it('renders correctly', () => {
      setupComponent(<Input.Outlined placeholder="Test Placeholder" />);
      expect(screen.getByPlaceholderText('Test Placeholder')).toBeOnTheScreen();
    });

    it('renders prefix and suffix', () => {
      setupComponent(<Input.Outlined prefix={<Text>Prefix</Text>} suffix={<Text>Suffix</Text>} />);
      const { getByText } = screen;
      expect(getByText('Prefix')).toBeOnTheScreen();
      expect(getByText('Suffix')).toBeOnTheScreen();
    });

    it('handles change event', async () => {
      const handleChange = jest.fn();
      const { user } = setupComponent(
        <Input.Outlined placeholder="Test Placeholder" onChangeText={handleChange} />,
      );

      const { getByPlaceholderText } = screen;
      const input = getByPlaceholderText('Test Placeholder');

      await user.type(input, 'test input');
      expect(handleChange).toHaveBeenCalledWith('test input');
    });
  });

  describe('Underlined', () => {
    it('renders correctly', () => {
      setupComponent(<Input.Underlined placeholder="Test Placeholder" />);
      expect(screen.getByPlaceholderText('Test Placeholder')).toBeOnTheScreen();
    });

    it('renders prefix and suffix', () => {
      setupComponent(
        <Input.Underlined prefix={<Text>Prefix</Text>} suffix={<Text>Suffix</Text>} />,
      );
      const { getByText } = screen;
      expect(getByText('Prefix')).toBeOnTheScreen();
      expect(getByText('Suffix')).toBeOnTheScreen();
    });

    it('handles change event', async () => {
      const handleChange = jest.fn();
      const { user } = setupComponent(
        <Input.Underlined placeholder="Test Placeholder" onChangeText={handleChange} />,
      );

      const { getByPlaceholderText } = screen;
      const input = getByPlaceholderText('Test Placeholder');

      await user.type(input, 'test input');
      expect(handleChange).toHaveBeenCalledWith('test input');
    });
  });
});
