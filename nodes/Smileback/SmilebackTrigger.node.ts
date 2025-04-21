import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface IStaticData extends IDataObject {
	lastTimestamp: string;
}

interface ISmilebackReview extends IDataObject {
	last_modified: string;
}

export class SmilebackTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SmileBack Trigger',
		name: 'smilebackTrigger',
		icon: 'file:smileback.svg',
		polling: true,
		group: ['trigger'],
		version: 1,
		description: 'Triggers when new SmileBack reviews are received.',
		defaults: {
			name: 'SmileBack Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'smilebackApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Review',
						value: 'review',
					},
				],
				default: 'review',
				noDataExpression: true,
				required: true,
			},
			{
				displayName: 'Include Unrated',
				name: 'includeUnrated',
				type: 'boolean',
				default: false,
				description: 'Whether to include unrated reviews',
			},
			{
				displayName: 'Polling Time',
				name: 'pollTime',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 5,
				description: 'Time in minutes to poll for new reviews',
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][]> {
		let responseData: ISmilebackReview[] = [];

		try {
			// Validate all required parameters upfront
			const parameters = {
				includeUnrated: this.getNodeParameter('includeUnrated', 1) as boolean,
				pollTime: this.getNodeParameter('pollTime', 0) as number,
				resource: this.getNodeParameter('resource', 0) as string,
			};

			// Get last timestamp from previous run
			const staticData = this.getWorkflowStaticData('node') as IStaticData;
			const now = dayjs().utc().format();
			const lastTimestamp = staticData.lastTimestamp || now;

			// API request parameters
			const qs: IDataObject = {};

			// Add modified_since parameter with proper UTC format
			if (lastTimestamp) {
				qs.modified_since = new Date(lastTimestamp).toISOString();
			}

			// Add include_unrated parameter if true
			if (parameters.includeUnrated) {
				qs.include_unrated = 'true'; // API expects string value
			}

			// Get credentials with detailed validation
			const credentials = await this.getCredentials('smilebackApi');

			const requiredCredFields = {
				baseUrl: credentials.baseUrl as string,
				username: credentials.username as string,
				password: credentials.password as string,
				clientId: credentials.clientId as string,
				clientSecret: credentials.clientSecret as string,
			};

			// Check each credential field individually
			for (const [field, value] of Object.entries(requiredCredFields)) {
				if (!value) {
					throw new NodeOperationError(this.getNode(), `Missing required credential: ${field}`);
				}
			}

			// Get token
			const tokenResponse = await this.helpers.request({
				method: 'POST',
				url: `${requiredCredFields.baseUrl}/token/`,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				form: {
					grant_type: 'password',
					username: requiredCredFields.username,
					password: requiredCredFields.password,
					client_id: requiredCredFields.clientId,
					client_secret: requiredCredFields.clientSecret,
				},
				json: true,
			});

			if (!tokenResponse.access_token) {
				console.log('Token response:', tokenResponse);
				throw new NodeOperationError(
					this.getNode(),
					'Failed to obtain access token. Check credentials.',
				);
			}

			const accessToken = tokenResponse.access_token;

			// Make the API request with the token
			console.log(
				'[SMILEBACK]',
				'Making API request to:',
				`${requiredCredFields.baseUrl}/v3/reviews/`,
				qs,
			);
			const apiResponse = await this.helpers.request({
				url: `${requiredCredFields.baseUrl}/v3/reviews/`,
				method: 'GET',
				qs,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				json: true,
			});

			// Validate API response structure
			if (!apiResponse) {
				console.log('Empty API response');
				throw new NodeOperationError(this.getNode(), 'Empty API response received');
			}

			// Check if response has results array
			if (!Array.isArray(apiResponse.results)) {
				console.log('Invalid API response structure:', apiResponse);
				throw new NodeOperationError(
					this.getNode(),
					'Invalid API response format. Expected "results" array.',
				);
			}

			// Validate required fields for each review
			responseData = apiResponse.results.map((review: ISmilebackReview) => {
				const requiredFields = ['rating', 'last_modified'];
				for (const field of requiredFields) {
					if (!(field in review)) {
						throw new NodeOperationError(
							this.getNode(),
							`Missing required field "${field}" in review data`,
						);
					}
				}
				return review;
			});
			console.log('[SMILEBACK]', `Received ${responseData.length} reviews`);

			// Save latest timestamp for next run
			staticData.lastTimestamp = now;
			console.log('[SMILEBACK]', 'Latest timestamp saved:', now);
			// Return the data
			return [responseData.map((item: ISmilebackReview) => ({ json: item }))];
		} catch (error) {
			console.log('Error details:', error);

			if (error instanceof NodeOperationError) {
				throw error;
			}
			if (error instanceof Error) {
				throw new NodeOperationError(this.getNode(), `SmileBack Trigger Error: ${error.message}`);
			}
			throw new NodeOperationError(this.getNode(), 'Unknown error occurred');
		}
	}
}
