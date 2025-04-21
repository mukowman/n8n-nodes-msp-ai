import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class SmilebackApi implements ICredentialType {
	name = 'smilebackApi';
	displayName = 'Smileback API';
	documentationUrl = 'https://docs.connectwise.com/SmileBack/040/010/010';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://app.smileback.io/api',
			description: 'The base URL of the Smileback API',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			description:
				'Obtain Client ID and Secret from https://app.smileback.io/account/api-credentials/',
			default: '',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
	];
}
