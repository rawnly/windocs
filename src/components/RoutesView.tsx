import React, { FC } from "react";
import { capitalize, FormattedRoute } from '../utils';
import { Definitions } from '../utils/OpenAPI';
import RouteView from './RouteView'

interface IRoutesViewProps {
  definitions: Definitions
  header: string;
  routes: FormattedRoute[]
}

const RoutesView: FC<IRoutesViewProps> = ( { definitions, header, routes } ) => (
  <div className='p-5 rounded shadow-md dark:shadow transition-colors dark:bg-blueGray-800 dark:text-white bg-white'>
    <h2 className="font-bold text-3xl" id={header}>{camelCase( header )}</h2>
    <hr className='my-2 border-gray-300 dark:border-blueGray-500' />
    <div className="p5 space-y-10">
      {routes.map( route => <RouteView key={route.operationId} definitions={definitions} route={route} /> )}
    </div>
  </div>
)

export default RoutesView;

function camelCase( str: string ): React.ReactNode {
  return str
    .split( /-|_|\s/ )
    .map( capitalize )
    .join( '' )
}
