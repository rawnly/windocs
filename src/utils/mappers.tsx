import React from 'react'

import { FormattedRoute, capitalize, getRouteHref, METHODS_COLORS, formatOperationId, keysOf } from '.'
import groupBy from 'lodash.groupby'
import Badge from '../components/Badge'
import { NavigationItem } from '../components/Sidebar'
import { OpenAPI, Route } from './OpenAPI'

export const mapRouteToNavigation = ( data: { [key: string]: FormattedRoute[] } ): NavigationItem[] =>
  Object
    .keys( data )
    .map( controller => ( {
      name: controller
        .split( '-' )
        .map( capitalize )
        .join( '' ),
      current: false,
      children: data[controller].map( item => ( {
        href: `#${getRouteHref( item )}`,
        name: (
          <div className='flex space-x-2'>
            <div className="w-20">
              <Badge
                className='overflow-hidden'
                color={METHODS_COLORS[item.method]}
              >
                {item.method.toUpperCase()}
              </Badge>
            </div>
            <span>{item.operationId}</span>
          </div>
        ),
      } ) )
    } ) )


export const getRoutes = ( route: Route, url: string ): FormattedRoute[] =>
  keysOf( route )
    .map( ( method ) => {
      const handler = route[method]!

      return {
        ...handler,
        url,
        tag: handler.tags[0],
        operationId: formatOperationId( handler.operationId ),
        method: method
      }
    } )


export const mapRoutes = ( paths: OpenAPI['paths'] ) => {
  const routes = keysOf( paths )
    .reduce( ( acc, key ) => {
      const routes = getRoutes( paths[key], key as string )

      return [
        ...acc,
        ...routes
      ]
    }, Array<FormattedRoute>() )

  return groupBy( routes, 'tag' )
}
