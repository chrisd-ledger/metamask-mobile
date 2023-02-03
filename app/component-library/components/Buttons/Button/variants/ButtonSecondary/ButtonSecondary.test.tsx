// Third party dependencies.
import React from 'react';
import { shallow } from 'enzyme';

// External dependencies.
import { ButtonSize } from '../../Button.types';
import { IconName } from '../../../../Icons/Icon';

// Internal dependencies.
import ButtonSecondary from './ButtonSecondary';
import { ButtonSecondaryVariants } from './ButtonSecondary.types';

describe('ButtonSecondary', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <ButtonSecondary
        IconName={IconName.Bank}
        size={ButtonSize.Md}
        label={'Click me!'}
        onPress={() => null}
        buttonSecondaryVariants={ButtonSecondaryVariants.Normal}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
