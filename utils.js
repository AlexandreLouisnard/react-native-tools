// @flow

/* #region Imports */

import { AppState, BackHandler, Dimensions, PermissionsAndroid, Platform, StatusBar } from 'react-native';
import { Header, NavigationScreenProps } from 'react-navigation';

import { Component } from 'react';

/* #endregion */

/* #region React Native dev utils */
/**
 * Returns a fonction allowing to console.log() some message/args with a given {header}.
 *
 * @export
 * @param {string} header
 * @returns {(message: string, ...args: any) => void}
 */
export function logger(header: string): (message: string, ...args: any) => void {
	return (message: string, ...args: any) => console.log(header, message, ...args);
}
// Use the logger for this Utils file too.
const log = logger('Utils');
/* #endregion */

/* #region React Native Components lifecycle */

/**
 * Interface definition for the additional {Component} lifecycle callbacks.
 *
 * @export
 * @interface ComponentLifecycle
 */
export interface ComponentLifecycle {
	onWillFocus(): void;
	onDidFocus(): void;
	onWillBlur(): void;
	onDidBlur(): void;
	onAppActive(): void;
	onAppBackground(): void;
	onAndroidBackPress(): boolean;

	lifecycleListeners?: any;
}

/**
 * Sets up some additional callbacks on a React Native {Component}.
 * Should be called during {Component#componentDidMount()}.
 * The associated {removeLifecycleListeners()} should be called during {Component#componentWillUnmount()}.
 *
 * Note: some callbacks require the {NavigationScreenProps} props from 'react-navigation' library.
 *
 * @export
 * @param {(ComponentLifecycle & Component<any, any>)} that
 * @param {NavigationScreenProps} [navigation]
 */
export function setupLifecycleListeners(that: ComponentLifecycle & Component<any, any>, navigation?: NavigationScreenProps) {
	// onAppActive(), onAppInactive() callbacks
	const _onAppStateChange = (nextAppState: AppState) => {
		const appState: AppState = (that && that.state && that.state.appState) || null;

		if (appState && appState.match(/inactive|background/) && nextAppState === 'active') {
			that.onAppActive();
		} else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
			that.onAppBackground();
		}

		that.setState({ appState: nextAppState });
	};

	// willFocus(), didFocus(), willBlur(), didBlur() callbacks
	if (navigation) {
		that.lifecycleListeners = [
			navigation.addListener('willFocus', that.onWillFocus),
			navigation.addListener('didFocus', () => {
				// Android back press
				BackHandler.addEventListener('hardwareBackPress', () => that.onAndroidBackPress());
				// App background/foreground
				AppState.addEventListener('change', _onAppStateChange);
				that.onDidFocus();
			}),
			navigation.addListener('willBlur', () => {
				// Android back press
				BackHandler.removeEventListener('hardwareBackPress', () => that.onAndroidBackPress());
				// App background/foreground
				AppState.removeEventListener('change', _onAppStateChange);
				that.onWillBlur();
			}),
			navigation.addListener('didBlur', that.onDidBlur),
		];
	}
}

/**
 * Unsets the additional callbacks on a React Native {Component}.
 * Should be called during {Component#componentWillUnmount()}.
 *
 * @export
 * @param {(ComponentLifecycle & Component<any, any>)} that
 */
export function removeLifecycleListeners(that: ComponentLifecycle & Component<any, any>) {
	// Will/Did Blur/Focus lifecycle3
	if (that.lifecycleListeners) {
		that.lifecycleListeners.forEach(sub => sub.remove());
	}
}
/* #endregion */

/* #region React Native UI */
/**
 * Returns the device screen dimensions.
 *
 * @export
 * @returns	{{
 *	 		 	screenHeight: number,	// the total screen height
 * 				screenWidth: number,	// the total screen width
 * 				headerHeight: number,	// the header (application toolbar) height
 * 				toolbarHeight: number	// the toolbar (system) height
 * 			}}
 */
export function getScreenDimensions(): { screenHeight: number, screenWidth: number, headerHeight: number, toolbarHeight: number } {
	const { height, width } = Dimensions.get('window');

	const toolbarHeight = StatusBar.currentHeight || 20;
	const headerHeight = Platform.OS === 'ios' ? Header.HEIGHT - toolbarHeight : Header.HEIGHT;

	return { screenHeight: height, screenWidth: width, headerHeight, toolbarHeight };
}
/* #endregion */

/* #region React Native Android */
/**
 * Checks and requests if necessary the required Android permissions.
 *
 * @returns {Promise<boolean>} true if the permissions have been or were already granted
 */
export async function requestAndroidPermissions(permissions: PermissionsAndroid[]): Promise<boolean> {
	try {
		const results = await PermissionsAndroid.requestMultiple(permissions);
		let granted = true;
		Object.keys(results).forEach((perm) => {
			if (results[perm] !== PermissionsAndroid.RESULTS.GRANTED) {
				log(`_requestAndroidPermissions(): permission denied: ${perm}:${results[perm]}`);
				granted = false;
			}
		});
		if (granted) {
			log('_requestAndroidPermissions(): permissions granted');
		}
		return Promise.resolve(granted);
	} catch (e) {
		log('_requestAndroidPermissions(): catched ERROR', e);
		return Promise.resolve(false);
	}
}
/* #endregion */
