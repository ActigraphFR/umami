import { Button, Icon, Modal, ModalTrigger, Text } from 'react-basics';
import Icons from 'components/icons';
import useMessages from 'components/hooks/useMessages';
import TeamAddForm from './TeamAddForm';
import useUser from "../../../../components/hooks/useUser";

export function TeamsAddButton({ onAdd }: { onAdd?: () => void }) {
  const { formatMessage, labels } = useMessages();
  const { user } = useUser();

  return (
    <ModalTrigger>
        {user.isAdmin && (
            <Button variant="primary">
                <Icon>
                    <Icons.Plus />
                </Icon>
                <Text>{formatMessage(labels.createTeam)}</Text>
            </Button>
        )}
        {user.isAdmin && (
            <Modal title={formatMessage(labels.createTeam)}>
                {(close: () => void) => <TeamAddForm onSave={onAdd} onClose={close} />}
            </Modal>
        )}
    </ModalTrigger>
  );
}

export default TeamsAddButton;
