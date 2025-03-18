import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

import { activityProperties } from './activityProperties';
import { agreementProperties } from './agreementProperties';
import { configurationProperties } from './configurationProperties';
import { contactProperties } from './contactProperties';
import { expenseProperties } from './expenseProperties';
import { invoiceProperties } from './invoiceProperties';
import { memberProperties } from './memberProperties';
import { opportunityProperties } from './opportunityProperties';
import { productCatalogProperties } from './productCatalogProperties';
import { projectProperties } from './projectProperties';
import { purchaseOrderProperties } from './purchaseOrderProperties';
import { scheduleProperties } from './scheduleProperties';
import { ticketProperties } from './ticketProperties';
import { timeProperties } from './timeProperties';

const resourceProperty: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options' as NodePropertyTypes,
	noDataExpression: true,
	options: [
		{
			name: 'Activity',
			value: 'activity',
		},
		{
			name: 'Agreement',
			value: 'agreement',
		},
		{
			name: 'Company',
			value: 'company',
		},
		{
			name: 'Configuration',
			value: 'configuration',
		},
		{
			name: 'Contact',
			value: 'contact',
		},
		{
			name: 'Expense',
			value: 'expense',
		},
		{
			name: 'Invoice',
			value: 'invoice',
		},
		{
			name: 'Member',
			value: 'member',
		},
		{
			name: 'Opportunity',
			value: 'opportunity',
		},
		{
			name: 'Product Catalog',
			value: 'productCatalog',
		},
		{
			name: 'Project',
			value: 'project',
		},
		{
			name: 'Purchase Order',
			value: 'purchaseOrder',
		},
		{
			name: 'Schedule',
			value: 'schedule',
		},
		{
			name: 'Service Ticket',
			value: 'ticket',
		},
		{
			name: 'Time',
			value: 'time',
		},
	],
	default: 'ticket',
};

const orderByProperty: INodeProperties = {
	displayName: 'Order By',
	name: 'orderBy',
	type: 'string' as NodePropertyTypes,
	displayOptions: {
		show: {
			operation: ['getAll', 'search'],
		},
	},
	default: '',
	description: 'Field to order results by (e.g. "ID desc")',
};

export const properties: INodeProperties[] = [
	resourceProperty,
	orderByProperty,
	...activityProperties,
	...agreementProperties,
	...configurationProperties,
	...contactProperties,
	...expenseProperties,
	...invoiceProperties,
	...memberProperties,
	...opportunityProperties,
	...productCatalogProperties,
	...projectProperties,
	...purchaseOrderProperties,
	...scheduleProperties,
	...ticketProperties,
	...timeProperties,
];
