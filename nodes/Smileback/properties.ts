export const operations = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options' as const,
		options: [
			{ name: 'Review', value: 'review' },
			{ name: 'NPS Response', value: 'nps-response' },
			{ name: 'Project Survey', value: 'prj-response' },
			{ name: 'CSAT Agents', value: 'csat-agents' },
			{ name: 'CSAT Boards', value: 'csat-boards' },
			{ name: 'CSAT Companies', value: 'csat-companies' },
			{ name: 'CSAT Contacts', value: 'csat-contacts' },
			{ name: 'NPS Campaigns', value: 'nps-campaigns' },
			{ name: 'Project Surveys', value: 'prj-surveys' },
		],
		default: 'review',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		options: [{ name: 'Sync', value: 'sync' }],
		default: 'sync',
	},
	{
		displayName: 'Last Modified Since',
		name: 'lastModifiedSince',
		type: 'dateTime' as const,
		default: '',
		description: 'Retrieve records modified after this date and time',
	},
];
