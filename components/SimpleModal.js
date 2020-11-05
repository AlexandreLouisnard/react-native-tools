// @flow

/* #region Imports */
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from 'react-native-elements';
import type { Element } from 'react';
import React from 'react';

/* #endregion */

/* #region Styles */
const colors: { [key: string]: string } = {
	secondary: '#388e3c',
	backgroundLight: '#F2F2F2',
};

const styles = StyleSheet.create({
	modalContainerBackgroundView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
		padding: 20,
	},
	modalButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 10,
	},
	modalContainerForegroundView: {
		borderColor: 'black',
		borderWidth: 2,
		padding: 20,
		backgroundColor: colors.backgroundLight,
	},
});

const defProps = {
	scrollView: {
		contentContainerStyle: { paddingBottom: 8 },
	},
	modalButton: {
		type: 'clear',
		buttonStyle: { marginLeft: 15 },
		titleStyle: { color: colors.secondary },
	},
};
/* #endregion */

/* #region SimpleModal Component */
/**
 * Usage example: <SimpleModal
 * 					visible={disconnectedModalVisible}
 * 					onRequestClose={() => this.setState({ disconnectedModalVisible: false })}
 * 					title={UserAppStrings.modal_title_disconnected}
 * 					content={<Text>{UserAppStrings.modal_message_disconnected}</Text>}
 * 					buttons={[{ title: UserAppStrings.ok, onPress: () => this.setState({ disconnectedModalVisible: false }) }]} />
 */
export const SimpleModal = ({
	visible,
	onRequestClose,
	title,
	content,
	buttons,
	buttonsContainerStyle,
	...otherProps
}: {
	visible: boolean,
	onRequestClose: () => void,
	title: ?string,
	content: Element<any>,
	buttons: { title: string, onPress: () => void, disabled?: boolean }[],
	buttonsContainerStyle?: ?StyleSheet.Styles,
}) => (
	<Modal
		visible={visible}
		animationType="fade"
		transparent
		onRequestClose={() => onRequestClose()}
		{...otherProps}>
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : null}
			style={styles.modalContainerBackgroundView}>
			<ScrollView
				{...defProps.scrollView}
				contentContainerStyle={{ ...defProps.scrollView.contentContainerStyle, flexGrow: 1, justifyContent: 'center' }}>
				<View style={styles.modalContainerForegroundView}>
					<Text style={styles.modalTitleText}>{title || ''}</Text>
					{content}
					<View style={{ ...styles.modalButtonsContainer, ...buttonsContainerStyle }}>
						{buttons.map(button => (
							<Button
								{...defProps.modalButton}
								title={button.title}
								onPress={() => button.onPress()}
								disabled={button.disabled}
								key={button.title} /> // key is only to avoid warning "each child in a list should have a unique "key" prop
						))}
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	</Modal>
);
/* #endregion */

/* #region Default Props */
SimpleModal.defaultProps = {
	buttonsContainerStyle: null,
};
/* #endregion */
