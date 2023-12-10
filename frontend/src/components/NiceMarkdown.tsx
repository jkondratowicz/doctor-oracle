import { ListItem, OrderedList, UnorderedList } from '@chakra-ui/react';
import Markdown from 'react-markdown';

export const NiceMarkdown = ({ text }: { text: string }) => {
  return (
    <Markdown
      components={{
        ul(props) {
          const { node, ...rest } = props;
          return <UnorderedList {...rest} />;
        },
        ol(props) {
          const { node, ...rest } = props;
          return <OrderedList {...rest} />;
        },
        li(props) {
          const { node, ...rest } = props;
          return <ListItem {...rest} />;
        },
      }}
    >
      {text}
    </Markdown>
  );
};
