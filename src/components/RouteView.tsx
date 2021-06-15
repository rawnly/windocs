import groupBy from 'lodash.groupby';
import React, { FC } from "react";
import cx from 'classnames'

import CodeBlock from './CodeBlock';
import ResponseView from './ResponseView';

import {
  Definitions
} from '../utils/OpenAPI';

import {
  definitionToExample,
  FormattedRoute,
  getRouteHref,
  hasRef,
  METHODS_COLORS,
  resolveRef
} from '../utils';


interface IRouteViewProps {
  route: FormattedRoute
  definitions: Definitions
}

const RouteView: FC<IRouteViewProps> = ( { route, definitions } ) => {
  const { path, query, body } = groupBy( route.parameters, 'in' );

  return (
    <div className='flex flex-col' id={getRouteHref( route )}>
      <div className='mb-4'>
        <h1 className='font-bold text-lg'>{route.operationId}</h1>
        <h2 className='text-sm text-gray-300'>{route.summary}</h2>
      </div>

      <h3 className='mb-2.5'>
        <span className={cx( "uppercase font-bold mr-2 text-white py-1 rounded px-2", `bg-${METHODS_COLORS[route.method]}-100 text-${METHODS_COLORS[route.method]}-700` )}>
          {route.method}
        </span>
        <span className={cx( 'font-semibold font-mono  px-2 py-2 rounded', `bg-${METHODS_COLORS[route.method]}-50 dark:text-${METHODS_COLORS[route.method]}-700` )}>
          {route.url}
        </span>
      </h3>

      {path && (
        <div className="flex flex-col my-2">
          <h2 className='font-bold text-xl mb-2'>URL Params</h2>
          <ul className="rounded block border border-gray-200 p-3">
            {( path || [] ).map( param => (
              <li key={param.name} className='flex items-center mb-1 space-x-2'>
                <span className='font-semibold font-mono'>
                  {param.name}{param.required ? ( <span className='text-red-500 text-sm'>*</span> ) : null}
                </span>
                <span className='text-sm'>
                  <code className='px-2 py-1 bg-gray-200 rounded text-black'>{param.type}</code>
                </span>
                <span className='text-xs'>
                  {param.description}
                </span>
              </li>
            ) )}
          </ul>
        </div>
      )}

      {query && (
        <div className="flex flex-col my-2">
          <h2 className='font-bold text-xl mb-2'>Query Params</h2>
          <ul className="rounded block border border-gray-200 p-3">
            {( query || [] ).map( param => (
              <li key={param.name} className='flex items-center mb-1 space-x-2'>
                <span className='font-semibold'>
                  {param.name}{param.required ? ( <span className='text-red-500 text-sm'>*</span> ) : null}
                </span>
                <span className='text-sm'>
                  <code className='px-2 py-1 bg-gray-200 rounded text-black'>{param.type}</code>
                </span>
                <span className='text-xs'>
                  {param.description}
                </span>
              </li>
            ) )}
          </ul>
        </div>
      )}

      {body && (
        <div className="flex flex-col my-2">
          <h2 className='font-bold text-xl mb-2'>Body <span className='text-xs dark:text-blueGray-300'>({body[0].description})</span></h2>
          <ul className="rounded block">
            {hasRef( body[0].schema ) ? (
              <CodeBlock>
                {JSON.stringify( definitionToExample(
                  resolveRef(
                    body[0].schema.$ref,
                    definitions
                  ),
                  definitions
                ), null, 2 )}
              </CodeBlock>
            ) : (
              <pre>{JSON.stringify( body[0], null, 2 )}</pre>
            )}
          </ul>
        </div>
      )}

      <div className="flex flex-col mt-4">
        <h2 className='font-bold text-xl mb-2'>Responses</h2>
        <div className='flex flex-col space-y-3'>
          {Object.keys( route.responses ).map( code => (
            <ResponseView
              key={route.responses[code].description}
              statusCode={code}
              response={route.responses[code]}
              definitions={definitions}
            />
          ) )}
        </div>
      </div>
    </div>
  )
}

export default RouteView;
