import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const ticketProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as NodePropertyTypes,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
			},
		},
		options: [
			{
				name: 'Add Note',
				value: 'addNote',
				description: 'Add a note to a ticket',
				action: 'Add a note to a ticket',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a ticket',
				action: 'Create a ticket',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a ticket',
				action: 'Delete a ticket',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a ticket by ID',
				action: 'Get a ticket',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many tickets',
				action: 'Get many tickets',
			},
			{
				name: 'Get Notes',
				value: 'getNotes',
				description: 'Get notes for a ticket',
				action: 'Get notes for a ticket',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search tickets',
				action: 'Search tickets',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a ticket',
				action: 'Update a ticket',
			},
		],
		default: 'create',
	},
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['get', 'update', 'delete', 'getNotes', 'addNote'],
			},
		},
		description: 'The ID of the ticket',
	},
	{
		displayName: 'Summary',
		name: 'summary',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['create'],
			},
		},
		description: 'The summary of the ticket',
	},
	{
		displayName: 'Note Text',
		name: 'noteText',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['addNote'],
			},
		},
		description: 'The text of the note to add',
	},
	{
		displayName: 'Detail Description',
		name: 'detailDescription',
		type: 'boolean' as NodePropertyTypes,
		default: false,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['addNote'],
			},
		},
		description: 'Whether this note is a detail description',
	},
	{
		displayName: 'Internal Analysis',
		name: 'internalAnalysis',
		type: 'boolean' as NodePropertyTypes,
		default: false,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['addNote'],
			},
		},
		description: 'Whether this note is an internal analysis',
	},
	{
		displayName: 'Resolution',
		name: 'resolution',
		type: 'boolean' as NodePropertyTypes,
		default: false,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['addNote'],
			},
		},
		description: 'Whether this note is a resolution',
	},
	{
		displayName: 'Search Query',
		name: 'searchQuery',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['search'],
			},
		},
		description: 'Search query to filter tickets',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 100,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Order By',
		name: 'orderBy',
		type: 'string' as NodePropertyTypes,
		default: 'id',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getAll', 'search'],
			},
		},
		description: 'Order results by specified field',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection' as NodePropertyTypes,
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['search'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options' as NodePropertyTypes,
				options: [
					{
						name: 'Open',
						value: 'Open',
					},
					{
						name: 'Closed',
						value: 'Closed',
					},
					{
						name: 'In Progress',
						value: 'InProgress',
					},
				],
				default: 'Open',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options' as NodePropertyTypes,
				options: [
					{
						name: 'Low',
						value: 'Low',
					},
					{
						name: 'Medium',
						value: 'Medium',
					},
					{
						name: 'High',
						value: 'High',
					},
				],
				default: 'Medium',
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection' as NodePropertyTypes,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Board ID',
				name: 'board',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The board ID for the ticket',
			},
			{
				displayName: 'Company ID',
				name: 'company',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The company associated with this ticket',
			},
			{
				displayName: 'Contact ID',
				name: 'contact',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The contact associated with this ticket',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options' as NodePropertyTypes,
				options: [
					{
						name: 'Low',
						value: 'Low',
					},
					{
						name: 'Medium',
						value: 'Medium',
					},
					{
						name: 'High',
						value: 'High',
					},
				],
				default: 'Medium',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options' as NodePropertyTypes,
				options: [
					{
						name: 'Open',
						value: 'Open',
					},
					{
						name: 'Closed',
						value: 'Closed',
					},
					{
						name: 'In Progress',
						value: 'InProgress',
					},
				],
				default: 'Open',
			},
		],
	},
];
