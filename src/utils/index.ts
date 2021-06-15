import {
  Definition,
  DefinitionArray,
  DefinitionObject,
  Definitions,
  GenericDefinition,
  Handler,
  SchemaWithRef
} from './OpenAPI'
import { match, when } from 'ts-pattern'


export type FormattedRoute = {
  method: "post" | "put" | "delete" | "get" | "patch"
  url: string;
  tag: string
} & Handler

export const METHODS_COLORS = {
  'delete': 'rose',
  'get': 'lime',
  'patch': 'orange',
  'put': "orange",
  'post': 'indigo'
}

export enum StatusCodeCategory {
  INFORMATIONAL = 100,
  SUCCESS = 200,
  REDIRECTION = 300,
  CLIENT_ERROR = 400,
  SERVER_ERROR = 500
}

export const getCategory = (statusCode: number): StatusCodeCategory =>
  match(statusCode)
    .when(s => s < StatusCodeCategory.SUCCESS, () => StatusCodeCategory.INFORMATIONAL)
    .when(s => s < StatusCodeCategory.REDIRECTION, () => StatusCodeCategory.SUCCESS)
    .when(s => s < StatusCodeCategory.CLIENT_ERROR, () => StatusCodeCategory.REDIRECTION)
    .when(s => s < StatusCodeCategory.SERVER_ERROR, () => StatusCodeCategory.CLIENT_ERROR)
    .otherwise(() => StatusCodeCategory.SERVER_ERROR)


export const getColor = ( statusCode: StatusCodeCategory ) =>
  match(statusCode)
    .with(StatusCodeCategory.INFORMATIONAL, () => 'blue')
    .with(StatusCodeCategory.SUCCESS, () => 'lime')
    .with(StatusCodeCategory.REDIRECTION, () => 'yellow')
    .with(StatusCodeCategory.CLIENT_ERROR, () => 'amber')
    .with(StatusCodeCategory.SERVER_ERROR, () => 'rose')
    .otherwise(() => 'blueGray')

export const capitalize = ( str: string ): string =>
  str.charAt( 0 ).toUpperCase() + str.substring( 1 )

export const formatOperationId = ( operationId: string ): string =>
  operationId.replace( /Using(GET|POST|PUT|DELETE|PATCH)_?\d?$/g, '' )

export const keysOf = <T extends object>( object: T ): ( keyof T )[] =>
  Object
    .keys( object ) as ( keyof T )[]

export const getRouteHref = (item: FormattedRoute) => {
  const normalizeItemUrl = (url: string) => url
    .replaceAll(/\{|\}/g, '_')
    .replaceAll( '/', '_' )
    .replace( /^_/, '' )

  return normalizeItemUrl(`${item.tag}--${item.method}--${item.url}`)
}

// Type Guards
export const hasRef = ( data: any ): data is SchemaWithRef => data && !!data['$ref']

export const isGenericDefinition = (d: Definition): d is GenericDefinition => d.type !== 'object' && d.type !== 'array'
export const isDefinitionObject = (d: Definition): d is DefinitionObject => d.type === 'object'
export const isDefinitionArray = (d: Definition): d is DefinitionArray => d.type === 'array'

export const resolveRef = ( $ref: string, definitions: Definitions ) => {
  if (!$ref) return {} as any;

  const key = $ref.replace( '#/definitions/', '' );
  return definitions[key]
}


export const definitionToExample = (def: Definition, definitions: Definitions) : any =>
  match(def)
    .when(t => t.type === 'string', () => 'string')
    .when(t => t.type === 'boolean', () => true)
    .when(t => t.type === 'number', () => 1)
    .when(t => t.type === 'integer', () => 1)
    .when(isDefinitionObject, def => {
      let ex = {}

      if ( def.properties ) {
        ex = Object
          .keys(def.properties)
          .reduce((acc, propKey) => {
            return {
              ...acc,
              [propKey]: definitionToExample(
                def.properties[propKey] as any,
                definitions
              )
            }
          }, {})
      }

      return ex
    })
    .when(isDefinitionArray, def => {
      if ( hasRef(def.items) ) {
        return [
          definitionToExample(
            resolveRef(
              def.items.$ref,
              definitions
            ),
            definitions,
          )
        ]
      }

      return [
        definitionToExample(
          def.items,
          definitions
        )
      ]
    })
    .otherwise(() => {
      if ( !hasRef(def) ) return null;
      return definitionToExample(
        resolveRef(
          def.$ref,
          definitions
        ),
        definitions
      )
    })
