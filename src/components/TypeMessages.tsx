import React, {useContext} from 'react';
import {AppContext, Messages} from "../App";
import {titles} from "../constants";
import {Alert, Button, H1, MessageContainer, TypeSection } from './styled';

type Props = {
  id: keyof Messages;
};

const TypeMessages: React.FC<Props> = ({id}) => {
  const {
    messages,
    setMessages
  } = useContext(AppContext);

  const typeMessages = messages[id];

  const handleClearMessage = (e: React.MouseEvent) => {
    const target = e.target as HTMLButtonElement;
    setMessages({...messages, [id]: typeMessages.filter(em => em.message !== target.id)})
  }

  return (
    <TypeSection>
      <H1>{titles[id]}</H1>
      <span data-testid={`count-${id}`}>Count {typeMessages.length}</span>
      {typeMessages.map(({message} ) =>
        <Alert icon={false} key={message} severity={id}>
            <MessageContainer>{message}</MessageContainer>
            <Button
              id={message}
              size="small"
              onClick={handleClearMessage}>
              Clear
            </Button>
        </Alert>
      )}
    </TypeSection>
  );
};

export default TypeMessages;