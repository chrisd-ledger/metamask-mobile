// Third party dependencies.
import React from 'react';
import { shallow } from 'enzyme';

// External dependencies.
import { ButtonSize } from '../../Button.types';
import { IconName } from '../../../../Icons/Icon';

// Internal dependencies.
import ButtonPrimary from './ButtonPrimary';
import { ButtonPrimaryVariants } from './ButtonPrimary.types';

describe('ButtonPrimary', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <ButtonPrimary
        IconName={IconName.Bank}
        size={ButtonSize.Md}
        label={'Click me!'}
        onPress={() => null}
        buttonPrimaryVariants={ButtonPrimaryVariants.Normal}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
