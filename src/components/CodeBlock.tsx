import React, { FC } from "react";
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json'
import materialDark from 'react-syntax-highlighter/dist/cjs/styles/prism/duotone-dark'

interface ICodeBlockProps { }

const CodeBlock: FC<ICodeBlockProps> = ( props ) => {
  SyntaxHighlighter.registerLanguage( 'json', json );

  return (
    <div className='overflow-hidden border border-gray-200 dark:border-blueGray-600 rounded-md shadow p-0 m-0'>
      <SyntaxHighlighter
        customStyle={{ margin: 0 }}
        showLineNumbers={false}
        language={'json'}
        style={materialDark}
      >
        {props.children}
      </SyntaxHighlighter>
    </div>
  )
}

export default CodeBlock;
