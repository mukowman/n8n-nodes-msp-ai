import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const documentProperties: INodeProperties[] = [
	// Define the operation for the document resource
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as NodePropertyTypes,
		noDataExpression: true,
		// Required to differentiate from other resource operations
		displayOptions: {
			show: {
				resource: ['document'],
			},
		},
		options: [
			{
				name: 'Download',
				value: 'downloadDocument',
				description: 'Download a document by its ID',
				action: 'Download a document',
			},
		],
		default: 'downloadDocument',
	},

	// Fields specific to the 'download' operation
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string' as NodePropertyTypes,
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['downloadDocument'],
			},
		},
		description: 'The ID of the document to download',
	},
];
