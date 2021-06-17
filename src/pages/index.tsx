import React, { FC, useCallback } from "react";

import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { FormattedRoute } from '../utils';
import { mapRoutes, mapRouteToNavigation } from '../utils/mappers';
import { OpenAPI } from '../utils/OpenAPI';
import cx from 'classnames'


import RoutesView from '../components/RoutesView';
import Sidebar from '../components/Sidebar';
import { ExclamationIcon, } from '@heroicons/react/solid';
import useBoolean from '../hooks/useBoolean';

interface IIndexProps { }

const IndexPage: FC<IIndexProps> = ( props ) => {
  const isSettingUrl = useBoolean( false )
  const [url, setUrl] = useState<string>( () => {
    if ( process.env.SWAGGER_URL ) return process.env.SWAGGER_URL as string;
    return window.localStorage.getItem( 'swagger_url' ) ?? '';
  } )
  const [routes, setRoutes] = useState<{ [key: string]: FormattedRoute[] }>( {} )
  const { data: response, error } = useSWR<AxiosResponse<OpenAPI>>( url, axios.get );

  useEffect( () => {
    if ( !response ) return;
    setRoutes( mapRoutes( response?.data.paths ) )
  }, [response] )

  const open = useCallback( ( url: string ) => () => {
    window.open( url, '_blank' )
  }, [] )

  useEffect( () => {
    window.localStorage.setItem( 'swagger_url', url )
  }, [url] )

  if ( isSettingUrl.value ) {
    return (
      <main className='flex flex-col bg-blueGray-100 text-blueGray-800 dark:bg-blueGray-900 dark:text-white items-center justify-center w-screen h-screen p-5'>
        <div className="flex flex-col">
          <label htmlFor='swagger_url' className=' text-xs uppercase mb-2'>
            Swager Url
          </label>
          <p className='text-center font-bold flex items-center space-x-2 justify-center'>
            <input placeholder='SWAGGER_URL' type="url" name="swagger_url" id="swagger_url" className='py-2 border w-72 transition-all dark:text-blueGray-500 border-blueGray-500 bg-transparent dark:bg-blueGray-800 focus:ring-1 focus:ring-blueGray-500 rounded px-3' />
            <button onClick={() => {
              isSettingUrl.off()
              setUrl( ( document.querySelector( '#swagger_url' ) as any ).value as any )
            }} className='px-4 font-bold uppercase rounded bg-lime-500 text-white hover:bg-lime-600 py-2 transition-colors'>
              Save
            </button>
          </p>
        </div>
      </main>
    )
  }

  if ( error ) {
    return (
      <main className='flex flex-col bg-blueGray-100 text-blueGray-800 dark:bg-blueGray-900 dark:text-white items-center justify-center w-screen h-screen p-5'>
        <p className='leading-relaxed'>{error.toString()}</p>
        <button onClick={() => {
          isSettingUrl.on()
          setUrl( '' )
        }} className='px-4 font-bold uppercase rounded bg-orange-500 text-white mt-4 hover:bg-orange-600 py-2'>
          Change SWAGGER_URL
        </button>
      </main>
    )
  }

  if ( !response && !error ) {
    return (
      <main className='flex flex-col bg-blueGray-100 text-blueGray-800 dark:bg-blueGray-900 dark:text-white items-center justify-center w-screen h-screen p-5'>
        {!url ?
          (
            <p className='text-center font-bold flex items-center flex-col'>
              <div className="flex flex-col items-center justify-center mb-6 bg-orange-100 p-3 rounded-full">
                <ExclamationIcon className='w-16 h-16 text-orange-500' />
              </div>

              <div className="block text-xl">
                No <code className='bg-orange-100 mx-2 p-1 px-2 rounded text-orange-500'>SWAGGER_URL</code> provided.
              </div>

              <button onClick={isSettingUrl.on} className='px-4 font-bold uppercase rounded bg-orange-500 text-white mt-4 hover:bg-orange-600 py-2'>
                Set Manually
              </button>
            </p>
          ) : (
            <h1 className='text-3xl font-bold animate-pulse'>Loading...</h1>
          )}

        <div onClick={open( 'https://github.com/rawnly/windocs' )} className='rounded-full cursor-pointer p-3 hover:opacity-75 active:opacity-50 transition-all dark:bg-blueGray-500 dark:bg-opacity-25 dark:text-white absolute bottom-5'>
          <svg xmlns="http://www.w3.org/2000/svg" className='fill-current' width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
        </div>
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
        onButtonClick={() => {
          isSettingUrl.on()
          setUrl( '' )
        }}
        buttonLabel={'Change SWAGGER_URL'}
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
