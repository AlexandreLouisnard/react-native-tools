// @flow
/* #region Imports */
import React from 'react';
import { View } from 'react-native';
/* #endregion */

/* #region FlatListItemSeparator Component */
export const FlatListItemSeparator = ({ style, ...otherProps }: { style?: {} }) => (
	<View
		style={{
			height: 1,
			backgroundColor: '#CED0CE',
			marginLeft: 2,
			marginRight: 2,
			...style,
		}}
		{...otherProps} />
);
/* #endregion */

/* #region Default Props */
FlatListItemSeparator.defaultProps = {
	style: {},
};

/* #endregion */
