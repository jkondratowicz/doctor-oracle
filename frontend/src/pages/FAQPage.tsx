import { Box, Card, Container, Heading } from '@chakra-ui/react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import { ReactNode } from 'react';

const FAQItem = ({ question, answer }: { question: string; answer: ReactNode }) => {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            {question}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>{answer}</AccordionPanel>
    </AccordionItem>
  );
};

export const FAQPage = () => {
  return (
    <Container maxWidth={'3xl'}>
      <Heading as="h2" mb={4}>
        Frequently Asked Questions
      </Heading>
      <Card bg="gray.100" p={4} rounded="md">
        <Accordion allowToggle>
          <FAQItem
            question={'What is Doctor Oracle?'}
            answer={
              'Doctor Oracle is a web3 dApp that uses blockchain technology, Chainlink Functions with Threshold signatures, as well as strong RSA + AES encryption to provide privacy-preserving medical information using large language models (OpenAI GPT models to be precise).'
            }
          />
          <FAQItem
            question={'Is my medical data secure?'}
            answer={
              'Information you enter is encrypted using strong cryptography (RSA + AES hybrid) and then uploaded to IPFS. Nodes running Chainlink Functions use Threshold Signatures to ensure no single node is able to decrypt your data. Your medical information is then passed on to OpenAI API using safe HTTPS protocol. In heory, OpenAI employees could access your data, but they have no way of knowing it belongs to you - the whole process anonymizes it, enabling full privacy and security.'
            }
          />
          <FAQItem
            question={'Can I use this service to diagnose real medical issues?'}
            answer={
              'This is a proof of concept dApp created for the Chainlink Constellation hackathon. It should not be used for getting actual medical advice.'
            }
          />
        </Accordion>
      </Card>
    </Container>
  );
};
