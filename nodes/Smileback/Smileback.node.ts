import { IExecuteFunctions } from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { INodeType, INodeTypeDescription, INodeExecutionData } from 'n8n-workflow';
import * as properties from './properties';

export class Smileback implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Smileback',
		name: 'smileback',
		icon: 'file:smileback.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Consume Smileback API using the OpenAPI schema',
		defaults: {
			name: 'Smileback',
		},
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		credentials: [
			{
				name: 'smilebackApi',
				required: true,
			},
		],
		properties: [...properties.operations],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const credentials = (await this.getCredentials('smilebackApi')) as unknown as {
			baseUrl: string;
			username: string;
			password: string;
			clientId: string;
			clientSecret: string;
		};
		const baseUrl = `${credentials.baseUrl}/v3`;

		// Get token
		const tokenResponse = await this.helpers.request({
			method: 'POST',
			url: `${credentials.baseUrl}/token/`,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			form: {
				grant_type: 'password',
				username: credentials.username,
				password: credentials.password,
				client_id: credentials.clientId,
				client_secret: credentials.clientSecret,
				scope: 'read read_recent',
			},
			json: true,
		});

		const accessToken = tokenResponse.access_token;
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const lastModifiedSince = this.getNodeParameter('lastModifiedSince', i, '') as string;
			const limit = 100; // Increased limit to reduce number of API calls
			const offset = 0; // Initial offset

			let endpoint = '';
			switch (resource) {
				case 'review':
					endpoint = '/reviews';
					break;
				case 'nps-response':
					endpoint = '/nps-responses';
					break;
				case 'prj-response':
					endpoint = '/prj-responses';
					break;
				case 'csat-agents':
					endpoint = '/csat-agents';
					break;
				case 'csat-boards':
					endpoint = '/csat-boards';
					break;
				case 'csat-companies':
					endpoint = '/csat-companies';
					break;
				case 'csat-contacts':
					endpoint = '/csat-contacts';
					break;
				case 'nps-campaigns':
					endpoint = '/nps-campaigns';
					break;
				case 'prj-surveys':
					endpoint = '/prj-surveys';
					break;
			}

			if (endpoint) {
				let currentUrl = `${baseUrl}${endpoint}?limit=${limit}&offset=${offset}`;
				if (lastModifiedSince) {
					currentUrl += `&modified_since=${encodeURIComponent(lastModifiedSince)}`;
				}

				let hasNextPage = true;

				while (hasNextPage) {
					console.log('Making API request to:', currentUrl);
					const apiResponse = await this.helpers.request({
						method: 'GET',
						uri: currentUrl,
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
						json: true,
					});

					// Add current page results to returnData
					const results = apiResponse.results || [];
					for (const result of results) {
						returnData.push({ json: result });
					}

					// Check if there's a next page
					if (apiResponse.next) {
						currentUrl = apiResponse.next;
						// Add a small delay to prevent rate limiting
						await new Promise((resolve) => setTimeout(resolve, 100));
					} else {
						hasNextPage = false;
					}
				}
			} else {
				returnData.push({ json: { message: 'Resource not supported', resource } });
			}
		}

		return [returnData];
	}
}
