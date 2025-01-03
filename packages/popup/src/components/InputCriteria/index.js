import React from 'react';

import { FormattedHTMLMessage } from 'react-intl';

import './InputCriteria.scss';

const InputCriteria = (props) => {
  const { isValid = false, id } = props;

  return (
    <div className={`inputCriteria is-${isValid ? 'valid' : 'invalid'}`}>
      <FormattedHTMLMessage id={id} />
    </div>
  );
};

export default InputCriteria;
