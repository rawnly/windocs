import React, { FC } from "react";

import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { FormattedRoute } from '../utils';
import { mapRoutes, mapRouteToNavigation } from '../utils/mappers';
import { OpenAPI } from '../utils/OpenAPI';
import cx from 'classnames'


import RoutesView from '../components/RoutesView';
import Sidebar from '../components/Sidebar';

interface IIndexProps { }

const IndexPage: FC<IIndexProps> = ( props ) => {
  const [routes, setRoutes] = useState<{ [key: string]: FormattedRoute[] }>( {} )
  const { data: response, error } = useSWR<AxiosResponse<OpenAPI>>( process.env.SWAGGER_URL as any, axios.get );

  useEffect( () => {
    if ( !response ) return;
    setRoutes( mapRoutes( response?.data.paths ) )
  }, [response] )

  if ( !response && !error ) {
    return (
      <main className='flex flex-col items-center justify-center w-screen h-screen p-5'>
        <h1>Loading...</h1>
      </main>
    )
  }

  return (
    <main className={cx(
      'w-screen relative h-screen overflow-hidden overflow-x-hidden flex flex-col',
      'gridLayout'
    )}>
      <Sidebar
        className='gridSidebar'
        navigation={mapRouteToNavigation( routes )}
        title={response?.data.info.title}
      />
      <div id="container" className={cx(
        'gridContainer',
        'dark:bg-blueGray-900 bg-blueGray-100 p-5 h-full flex flex-col space-y-4 overflow-y-scroll'
      )}>
        {
          Object
            .keys( routes )
            .map( controller => (
              <RoutesView
                key={controller}
                definitions={response!.data!.definitions}
                header={controller}
                routes={routes[controller]}
              />
            ) )
        }
      </div>
    </main>
  )
}

export default IndexPage;
