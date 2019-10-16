import React from 'react';
import { shallow, mount, render } from 'enzyme';
import renderer from 'react-test-renderer';
import Bubble from './index';

describe('bubble test', () => {
  it('render Bubble default', () => {
    const component = renderer.create(<Bubble>H</Bubble>);
    
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('test size prop', () => {
    const component = shallow(<Bubble size="small">H</Bubble>);
    expect(component.hasClass('small')).toBe(true);
  });

  it('test type prop', () => {
    const component = shallow(<Bubble type="ball">H</Bubble>);
    expect(component.hasClass('ball')).toBe(true);
  });
});