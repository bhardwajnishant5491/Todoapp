import crypto from 'crypto';

/**
 * Hash Generator Utility
 * Generates SHA-256 hash for contract integrity verification
 */

/**
 * Generate SHA-256 hash from contract data
 * @param {Object} contract - Contract object with all immutable fields
 * @returns {String} - 64 character hex string (SHA-256 hash)
 */
export const generateContractHash = (contract) => {
  try {
    // Extract only immutable fields that should be part of the hash
    const hashData = {
      contractId: contract._id.toString(),
      cropId: contract.cropId.toString(),
      farmerId: contract.farmerId.toString(),
      buyerId: contract.buyerId.toString(),
      quantity: contract.quantity,
      unit: contract.unit,
      pricePerUnit: contract.pricePerUnit,
      totalAmount: contract.totalAmount,
      deliveryDate: contract.deliveryDate.toISOString(),
      deliveryAddress: contract.deliveryAddress,
      terms: contract.terms || '',
      paymentTerms: contract.paymentTerms,
      acceptedAt: contract.acceptedAt.toISOString(),
    };

    // Convert to string (consistent format)
    const dataString = JSON.stringify(hashData, Object.keys(hashData).sort());

    // Generate SHA-256 hash
    const hash = crypto
      .createHash('sha256')
      .update(dataString)
      .digest('hex');

    return hash;
  } catch (error) {
    console.error('Error generating contract hash:', error);
    throw new Error('Failed to generate contract hash');
  }
};

/**
 * Verify contract integrity by comparing hashes
 * @param {Object} contract - Current contract object
 * @param {String} storedHash - Original hash stored in database
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const verifyContractHash = (contract, storedHash) => {
  try {
    if (!storedHash) {
      return {
        isValid: false,
        message: 'No hash found for this contract',
      };
    }

    // Generate hash from current contract data
    const currentHash = generateContractHash(contract);

    // Compare hashes
    const isValid = currentHash === storedHash;

    return {
      isValid,
      currentHash,
      storedHash,
      message: isValid
        ? '✅ Contract is authentic and unmodified'
        : '❌ WARNING: Contract has been tampered with! Data does not match original hash.',
    };
  } catch (error) {
    console.error('Error verifying contract hash:', error);
    return {
      isValid: false,
      message: 'Error verifying contract integrity',
    };
  }
};

/**
 * Generate hash for contract at the time of acceptance
 * This locks the contract and makes it tamper-proof
 * @param {Object} contract - Contract document
 * @returns {String} - Generated hash
 */
export const lockContractWithHash = async (contract) => {
  try {
    // Ensure acceptedAt is set
    if (!contract.acceptedAt) {
      contract.acceptedAt = new Date();
    }

    // Generate hash
    const hash = generateContractHash(contract);

    // Update contract with hash and lock it
    contract.contractHash = hash;
    contract.isLocked = true;
    contract.hashGeneratedAt = new Date();

    await contract.save();

    console.log(`🔒 Contract ${contract._id} locked with hash: ${hash.substring(0, 16)}...`);

    return hash;
  } catch (error) {
    console.error('Error locking contract with hash:', error);
    throw new Error('Failed to lock contract');
  }
};

export default {
  generateContractHash,
  verifyContractHash,
  lockContractWithHash,
};
