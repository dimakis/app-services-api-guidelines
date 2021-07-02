import { RuleCollection } from "@stoplight/spectral";

const rules: RuleCollection = {
	oas3minimum:
	{
		given: '$',
		description: 'OpenAPI version must be >= 3',
		recommended: true,
		severity: 'warn',
		then:
		{
			field: 'openapi',
			function: 'pattern',
			functionOptions: { match: '3.[0-9]?.[0-9]' }
		}
	},
	'servers-config':
	{
		given: '$',
		severity: 'warn',
		recommended: true,
		then:
		{
			function: 'expectServersConfig',
			field: 'servers',
			functionOptions:
			{
				required:
					['https://api.openshift.com',
						'https://api.stage.openshift.com',
						'http://localhost:8000',
						'/']
			}
		}
	},
	'info-license-apache2.0':
	{
		severity: 'warn',
		recommended: true,
		given: '$',
		then:
		{
			function: 'infoLicenseApache2',
			field: 'info.license',
		},
	},
	'invalid-path-regexp':
	{
		given: '$.paths[*]~',
		severity: 'warn',
		description: 'OpenAPI paths must start with `/api/`, followed by a version. All paths must follow camel_case',
		then:
		{
			function: 'pattern',
			functionOptions: { match: '/api/([a-z_]*){1,}(/v[0-9]*(alpha|beta)?)(/{?[a-z_]*}?){1,}$' }
		}
	},
	'invalid-response-media-type':
	{
		given: '$.paths.*.*.responses.*.content',
		description: 'application/json is the only acceptable content type',
		severity: 'error',
		then: { function: 'truthy', field: 'application/json' }
	},
	'invalid-error-response-object':
	{
		given: '$.paths..responses[?( @property >= 300)].content.*',
		severity: 'error',
		then: {
			field: 'schema',
			function: 'schema',
			functionOptions: {
				schema: {
					$ref: '#/components/schemas/Error'
				}
			}
		}
	},
	'invalid-object-resource-schema':
	{
		given: '$.paths',
		severity: 'error',
		then: { function: 'resourceSchema' }
	},
	'schema-name-camel-case': {
		description: 'JSON Schema names should use CamelCase',
		message: '`{{property}}` object name must follow CamelCase',
		severity: 'error',
		given: '$.components.schemas[*]~',
		then: {
			function: 'pattern',
			functionOptions: {
				match: '^([A-Z]{1}[a-z]{1,}){1,}$'
			}
		}
	},
	'properties-snake-case': {
		description: "All JSON Schema properties MUST follow snake_case and be ASCII alphanumeric characters.",
		severity: "error",
		recommended: true,
		message: "`{{property}}` MUST follow snake_case and be ASCII alphanumeric characters.",
		given: "$.components.schemas..properties[*]~",
		then: {
			function: "pattern",
			functionOptions: {
				match: "/^[a-z0-9_]{1,}/"
			}
		}
	},
	'invalid-error-schema': {
		severity: 'error',
		recommended: true,
		given: '$.components.schemas',
		then: {
			function: 'schemaDefinition',
			field: 'Error',
			functionOptions: {
				definition: {
					type: 'object',
					properties: {
						code: {
							type: 'string',
							required: true
						},
						id: {
							type: 'string',
							required: true
						},
						kind: {
							type: 'string',
							required: true
						},
						href: {
							type: 'string',
							required: true
						},
						reason: {
							type: 'string',
							required: true
						}
					}
				}
			}
		}
	},
	'invalid-object-schema': {
		severity: 'error',
		recommended: true,
		given: '$.components.schemas',
		then: {
			function: 'schemaDefinition',
			field: 'ObjectReference',
			functionOptions: {
				definition: {
					type: 'object',
					properties: {
						id: {
							type: 'string',
							required: true
						},
						kind: {
							type: 'string',
							required: true
						},
						href: {
							type: 'string',
							required: true
						}
					}
				}
			}
		}
	},
	'invalid-list-schema': {
		severity: 'error',
		recommended: true,
		given: '$.components.schemas',
		then: {
			function: 'schemaDefinition',
			field: 'List',
			functionOptions: {
				definition: {
					type: 'object',
					properties: {
						items: {
							type: 'array',
							required: true
						},
						kind: {
							type: 'string',
							required: true
						},
						page: {
							type: 'integer',
							required: true
						},
						size: {
							type: 'integer',
							required: true
						},
						total: {
							type: 'integer',
							required: true
						}
					}
				}
			}
		}
	}
}

export default rules;