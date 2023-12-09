const utils = require('./utils');

task('add-balance', 'Adds balance for a patient')
  .addParam('contract', 'Address of the consumer contract to call')
  .addParam('patient', "Address of the patient's wallet")
  .addOptionalParam('balance', 'Value of new balance', 100_000_000_000_000, types.int)
  .setAction(async (taskArgs, hre) => {
    // Get the required parameters
    const contractAddr = taskArgs.contract;
    const patientAddr = taskArgs.patient;
    const balance = parseInt(taskArgs.balance);

    // Attach to the DoctorOracle contract
    const consumerFactory = await ethers.getContractFactory('DoctorOracle');
    const consumerContract = consumerFactory.attach(contractAddr);

    // Initiate the request
    const spinner = utils.spin();
    spinner.start(`Waiting for transaction for DoctorOracle contract ${contractAddr} on network ${network.name} to be confirmed...`);

    const requestTx = await consumerContract.updateBalance(patientAddr, balance);
    await requestTx.wait(1);
    spinner.info(`Transaction confirmed, see ${utils.getEtherscanURL(network.config.chainId) + 'tx/' + requestTx.hash} for more details.`);
  });
