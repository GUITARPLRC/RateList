import {
  Modal,
  ModalFooter,
  ModalButton,
  ModalContent,
} from "react-native-modals"
import { View, Text } from "react-native"

type Props = {
  confirmText: string
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const Confirmation = ({ confirmText, isOpen, onClose, onConfirm }: Props) => {
  return (
    <View>
      <Modal visible={isOpen} onTouchOutside={onClose}>
        <ModalContent>
          <View>
            <Text>{confirmText}</Text>
          </View>
        </ModalContent>
        <ModalFooter>
          <ModalButton text="CANCEL" onPress={onClose} />
          <ModalButton text="OK" onPress={onConfirm} />
        </ModalFooter>
      </Modal>
    </View>
  )
}

export default Confirmation
