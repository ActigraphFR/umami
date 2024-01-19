import { Button, Icon, Icons, Modal, ModalTrigger, Text, useToasts } from 'react-basics';
import WebsiteAddForm from './WebsiteAddForm';
import useMessages from 'components/hooks/useMessages';
import { setValue } from 'store/cache';
import useUser from "../../../../components/hooks/useUser";


export function WebsiteAddButton({ onSave }: { onSave?: () => void }) {
  const { formatMessage, labels, messages } = useMessages();
  const { showToast } = useToasts();
  const { user } = useUser();

  const handleSave = async () => {
    showToast({ message: formatMessage(messages.saved), variant: 'success' });
    setValue('websites', Date.now());
    onSave?.();
  };

  return (
    <ModalTrigger>
        {user.isAdmin && (
            <Button variant="primary">
                <Icon>
                    <Icons.Plus />
                </Icon>
                <Text>{formatMessage(labels.addWebsite)}</Text>
            </Button>
        )}
        {user.isAdmin && (
            <Modal title={formatMessage(labels.addWebsite)}>
                {(close: () => void) => <WebsiteAddForm onSave={handleSave} onClose={close} />}
            </Modal>
        )}
    </ModalTrigger>
  );
}

export default WebsiteAddButton;
