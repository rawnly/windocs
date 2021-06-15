
export interface OpenAPI {
  swagger:  string;
  info:     Info;
  host:     string;
  basePath: string;
  tags: Tag;
  paths: {
    [key: string]: Route
  };
  securityDefinitions: SecurityDefinitions;
  definitions:         Definitions;
}

export interface Info {
  description:    string;
  version:        string;
  title:          string;
  termsOfService: string;
  contact:        Contact;
  license:        License;
}

export interface Contact {
}

export interface License {
  name: string;
  url:  string;
}

export interface Tag {
  name:        string;
  description: string;
}

export interface Route {
  post?: Handler;
  get?: Handler;
  put?: Handler;
  delete?: Handler;
  patch?: Handler;
}

export interface Handler {
  tags:        string[];
  summary:     string;
  operationId: string;
  consumes:    string[];
  produces:    string[];
  parameters:  Parameter[];
  responses:   { [key: string]: Response };
  security:    Security[];
}

export interface Parameter {
  in:          string;
  name:        string;
  description: string;
  type: string;
  required:    boolean;
  schema?:      Schema;
}

export type SchemaWithRef = {
  $ref: string;
}

export type Schema = {
  type: DefinitionType
} | SchemaWithRef

export interface Response {
  description: string;
  schema?:     Schema;
}

export interface Security {
  JWT: string[];
}


export interface Definitions {
  [key: string]: Definition
}


export type DefinitionType = 'integer'  | 'number' | 'boolean' | 'string'
export type $Ref = {
  $ref: string
}

export type DefinitionObject = {
  type: 'object'
  title: string;
  required?: string[]
  properties: {
    [key: string]: {
      type: DefinitionType;
    } | DefinitionObject | {
      type: Extract<DefinitionType, 'integer'>;
      format?: string;
    } | {
      type: Extract<DefinitionType, 'string'>;
      enum?: string[];
    } | $Ref
  }
}

export type DefinitionArray = {
  type: 'array'
  items: Definition
}

type GenericDefinition = {
  type: DefinitionType
  title: string;
}

export type Definition = GenericDefinition
  | DefinitionArray
  | DefinitionObject


export interface SecurityDefinitions {
  JWT: {
    type: string;
    name: string;
    in:   string;
  }
}
