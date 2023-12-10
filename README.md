# Doctor Oracle

Demo is deployed below and uses Polygon Mumbai. Please be aware that it uses real OpenAI API with limited quota, so it will likely stop working if many people use it :)

https://doctororacle.kondratowicz.pl/

### Overview
Doctor Oracle is a dApp that generates medical advice using privacy preserving oracles. It uses strong encryption to securely store private information on IPFS, and it only becomes decrypted by Chainlink Functions nodes using threshold signatures. This anonymizes Doctor Oracle's users and keeps their medical data safe and private.

Please note this is only a proof of concept and DEFINITELY should not be used to obtain real medical advice.

This project has been created for Chainlink Constellation 2023 Hackathon. I hope you like it, all criticism, feedback or contributions are welcome.

### Modules

- `contracts` - Solidity contracts for the dApp, plus tooling (using Chainlink Functions toolkit) for deployment, debugging etc.
- `frontend` - React frontend using `wagmi` and `Chakra UI`.
- `ipfs_gateway` - IPFS gateway for saving encrypted data. Unfortunately due to Chainlink Functions limitations, it's not really possible to use `FormData`, which makes it impossible to use any IPFS gateways I could find, so I wrote my own that works with plain JSONs.

### Architecture

![Architecture](/architecture.png)