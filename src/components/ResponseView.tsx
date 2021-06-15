import React, { FC } from "react";
import { definitionToExample, getCategory, getColor, hasRef, resolveRef, StatusCodeCategory } from '../utils';
import { Definitions, Response, SchemaWithRef } from '../utils/OpenAPI';
import cx from 'classnames'
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/solid'
import CodeBlock from './CodeBlock';

interface IResponseViewProps {
  response: Response;
  statusCode: string;
  definitions: Definitions
}

const ResponseView: FC<IResponseViewProps> = ( { definitions, response, statusCode } ) => {
  const color = getColor(
    statusCode === 'default'
      ? StatusCodeCategory.SUCCESS
      : getCategory( parseInt( statusCode )
      )
  )

  if ( !response.schema ) {
    return (
      <div className={cx(
        'font-semibold outline-none rounded p-3',
        `ring-1 text-${color}-700 ring-${color}-500`
      )}>
        {statusCode} - {response.description}
      </div>
    )
  }


  return (
    <Disclosure as='div'>
      {( { open } ) => (
        <>
          <Disclosure.Button as='div' className={cx(
            'font-semibold ring-1 cursor-pointer rounded transition-all p-3',
            'flex justify-between items-center',
            `ring-${color}-500`,
            {
              [`hover:bg-${color}-50 text-${color}-700`]: !open,
              [`bg-${color}-500 text-white`]: open
            }
          )}>
            <span>
              {statusCode} - {response.description}
            </span>
            <ChevronRightIcon className={cx( 'transition-all transform w-6 h-6', {
              'rotate-90': open
            } )} />

          </Disclosure.Button>
          <Disclosure.Panel className='mt-2'>
            {!!response.schema && (
              <CodeBlock>
                {
                  JSON.stringify(
                    hasRef( response.schema )
                      ? definitionToExample(
                        resolveRef(
                          ( response.schema as SchemaWithRef )?.$ref,
                          definitions
                        ), definitions )
                      : (
                        !!response.schema
                          ? definitionToExample( response.schema as any, definitions )
                          : response
                      ), null, 2 )
                }
              </CodeBlock>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default ResponseView;
