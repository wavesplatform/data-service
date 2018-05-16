const ASSET_IDS = {
  WAVES: 'WAVES',
  USD: 'Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck',
  BTC: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
  ETH: '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
  EUR: 'Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU',
  DASH: 'B3uGHFRpSUuGEDWjqB9LWWxafQj8VTvpMucEyoxzws5H',
  MRT: '4uK8i4ThRGbehENwa6MxyLtxAjAo1Rj9fduborGExarC',
};

const pair = (amountAsset, priceAsset) =>
  `${ASSET_IDS[amountAsset]}/${ASSET_IDS[priceAsset]}`;

module.exports = pair;
