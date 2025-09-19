/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', () => {
  const component = ReactTestRenderer.create(<App />);
  expect(component.root).toBeTruthy();
});
