// @flow
/* #region Imports */

import { Button } from 'react-native-elements';
import React from 'react';
import { StyleSheet } from 'react-native';

/* #endregion */

/* #region ModalButton Component */
export const ModalButton = ({ titleStyle, buttonStyle, ...otherProps }: { titleStyle: StyleSheet.Styles, buttonStyle: StyleSheet.Styles }) => (
	<Button
		type="clear"
		buttonStyle={{ marginLeft: 15, ...buttonStyle }}
		titleStyle={{ color: '#0000FF', ...titleStyle }}
		{...otherProps} />
);
/* #endregion */
