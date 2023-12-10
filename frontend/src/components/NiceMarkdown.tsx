import { ListItem, OrderedList, UnorderedList, Text, Heading } from '@chakra-ui/react';
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
        p(props) {
          const { node, ...rest } = props;
          return <Text my={3} {...rest} />;
        },
        h1(props) {
          const { node, ...rest } = props;
          return <Heading my={3} fontSize="3xl" {...rest} />;
        },
        h2(props) {
          const { node, ...rest } = props;
          return <Heading my={3} fontSize="2xl" {...rest} />;
        },
        h3(props) {
          const { node, ...rest } = props;
          return <Heading my={3} fontSize="xl" {...rest} />;
        },
        h4(props) {
          const { node, ...rest } = props;
          return <Heading my={3} fontSize="lg" {...rest} />;
        },
        h5(props) {
          const { node, ...rest } = props;
          return <Heading my={3} fontSize="md" {...rest} />;
        },
        h6(props) {
          const { node, ...rest } = props;
          return <Heading my={3} fontSize="sm" {...rest} />;
        },
      }}
    >
      {text}
    </Markdown>
  );
};
