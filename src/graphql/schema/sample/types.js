module.exports = `
	type SampleResult {
		result: String!
	}

	type Query {
		sample: SampleResult!
		field2: String
	}
`;
