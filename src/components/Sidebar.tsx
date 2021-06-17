import React, { FC, ReactNode } from "react";
import { Disclosure } from '@headlessui/react'
import cx, { Value } from 'classnames'
import { useCallback } from 'react';



type Navigation = NavigationItem[]

export type NavigationItem = {
  name: string;
  current?: boolean;
} & ( {
  children: NavigationItemChildren[]
} | {
  href: string;
} )

type NavigationItemChildren = {
  name: string | ReactNode;
  href: string;
}


interface ISidebarProps {
  navigation: Navigation;
  className?: Value;
  title?: string;
  buttonLabel?: string;
  onButtonClick(): void
}

const Sidebar: FC<ISidebarProps> = ( { navigation = [], buttonLabel, onButtonClick, className, title } ) => {
  const onClick = useCallback( ( id: string ) => ( e: React.MouseEvent<HTMLAnchorElement, MouseEvent> ) => {
    const container = document.querySelector( '#container' )
    const element = document.querySelector( id )

    if ( !container || !element ) return;

    container.scrollBy( {
      top: element.scrollTop - 100,
      behavior: 'smooth'
    } )
  }, [] )

  return (
    <div className={cx( className, "flex transition-colors flex-col h-full max-w-md flex-grow border-r border-gray-200 pt-5 pb-4 bg-white dark:bg-blueGray-700 dark:border-blueGray-700 shadow dark:text-white overflow-y-auto" )}>
      <div className="flex items-center flex-shrink-0 px-4">
        <h3 className='font-bold text-center w-full text-2xl'>{title}</h3>
      </div>
      <div className="mt-5 flex-grow flex flex-col">
        <nav className="flex-1 px-2 space-y-1" aria-label="Sidebar">
          {navigation.map( ( item, idx ) =>
            'href' in item ? (
              <div key={item.name}>
                <a
                  onClick={onClick( item.href )}
                  href={item.href}
                  className={cx(
                    'transition-all',
                    item.current
                      ? 'bg-gray-100 dark:text-white dark:bg-blueGray-600 text-gray-900'
                      : 'bg-white dark:text-white dark:bg-blueGray-600 text-gray-600 hover:bg-gray-50 dark:hover:bg-blueGray-500 dark:hover:text-white hover:text-gray-900',
                    'group w-full flex items-center pl-7 pr-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  {item.name}
                </a>
              </div>
            ) : (
              <Disclosure as="div" key={item.name} className="space-y-1">
                {( { open } ) => (
                  <>
                    <Disclosure.Button
                      className={cx(
                        'transition-all',
                        item.current
                          ? 'bg-gray-100 dark:text-white dark:bg-blueGray-600 text-gray-900'
                          : 'bg-white dark:text-white dark:bg-blueGray-600 text-gray-600 hover:bg-gray-50 dark:hover:bg-blueGray-500 dark:hover:text-white hover:text-gray-900',
                        'group w-full flex items-center pr-2 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      )}
                    >
                      <svg
                        className={cx(
                          open ? 'text-gray-400 dark:text-blueGray-400 rotate-90' : 'text-gray-300 dark:text-blueGray-300',
                          'mr-2 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150'
                        )}
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                      </svg>
                      {item.name}
                    </Disclosure.Button>
                    <Disclosure.Panel className="space-y-1">
                      {item.children.map( ( subItem, idx ) => (
                        <a
                          key={idx}
                          href={subItem.href}
                          onClick={onClick( subItem.href )}
                          className="group w-full flex items-center transition-colors pl-3 pr-2 py-2 text-sm font-medium dark:text-white dark:hover:text-white dark:bg-blueGray-600 dark:bg-opacity-50 text-gray-600 dark:hover:bg-blueGray-500 dark:hover:bg-opacity-30 rounded-md hover:text-gray-900 hover:bg-gray-50"
                        >
                          {subItem.name}
                        </a>
                      ) )}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            )
          )}
        </nav>

        {onButtonClick && buttonLabel && (
          <button className='px-4 bg-indigo-500 bg-opacity-50 active:ring-1 active:ring-indigo-500 rounded text-white hover:bg-indigo-600 mx-auto py-2' onClick={onButtonClick}>
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
