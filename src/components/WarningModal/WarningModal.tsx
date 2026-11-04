import React, { useCallback } from 'react';
import { Modal, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { warningModalSelector } from '../../redux/selectors/administrativeSelector';
import {
  hideWarningModal,
  type WarningActionButton,
} from '../../redux/slices/administrativeSlice';
import type { AppDispatch } from '../../redux/store';
import { Button } from '../Button/Button';
import { AppText } from '../Text/Text';
import { styles } from './WarningModal.style';

export function WarningModal() {
  const dispatch = useDispatch<AppDispatch>();
  const modal = useSelector(warningModalSelector);

  const close = useCallback(() => {
    dispatch(hideWarningModal());
  }, [dispatch]);

  const handlePress = useCallback(
    (button: WarningActionButton) => {
      button.onPress?.();
      close();
    },
    [close],
  );

  return (
    <Modal
      visible={modal.visible}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {modal.title ? (
            <AppText style={styles.title}>{modal.title}</AppText>
          ) : null}
          {modal.description ? (
            <AppText style={styles.description}>{modal.description}</AppText>
          ) : null}
          <View style={styles.actions}>
            {modal.actionButtons.map((button, index) => (
              <Button
                key={`${button.label}-${index}`}
                label={button.label}
                variant={button.variant ?? (index === 0 ? 'primary' : 'secondary')}
                onPress={() => handlePress(button)}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
