// @flow
/* #region Imports */

import * as Utils from '../Utils';

import { AppState, Text } from 'react-native';
import React, { Component } from 'react';

import type { ComponentLifecycle } from '../Utils';
import { NavigationScreenProps } from 'react-navigation';

/* #endregion */

/* #region Flow Types */
type Props = {
	navigation: NavigationScreenProps,
};

type State = {
	appState: AppState,
};
/* #endregion */

/* #region ImprovedLifecycleComponent Component */
export default class ImprovedLifecycleComponent extends Component<Props, State> implements ComponentLifecycle {
	/* #region Constructor(s) */
	constructor(props: Props) {
		super(props);

		this.state = {
			appState: AppState.currentState, // eslint-disable-line react/no-unused-state, actually used within Utils.setupLifecycleListeners()
		};
	}
	/* #endregion */

	/* #region Component lifecycle */
	componentDidMount() {
		const { navigation } = this.props;
		Utils.setupLifecycleListeners(this, navigation);
	}

	componentWillUnmount() {
		Utils.removeLifecycleListeners(this);
	}

	onWillFocus() {}

	onDidFocus() {}

	onWillBlur() {}

	onDidBlur() {}

	onAppActive() {}

	onAppBackground() {}

	onAndroidBackPress() {
		return true;
	}
	/* #endregion */

	/* #region render() */
	render() {
		return <Text>Component with improved lifecycle</Text>;
	}
	/* #endregion */
}
/* #endregion */
