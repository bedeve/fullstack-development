import React from "react"
import Highlight, {defaultProps} from 'prism-react-renderer'
import {jsx, Styled} from 'theme-ui'

import {usePrismTheme} from '~utils/theme'

export const Code = ({children, className: outerClassName}) => {
	let language
	if(outerClassName) {
	  [language] = outerClassName.replace(/language-/, '').split(' ')
	}else{
	  language = "no-highlight"
	}
	console.log()
	const theme = usePrismTheme()

	return (
		<Highlight
			{...defaultProps}
			code={children.trim()}
			language={language}
			theme={theme}
		>
			{({className, style, tokens, getLineProps, getTokenProps}) => (
				<Styled.pre
					className={`${outerClassName} ${className}`}
					style={style}
					data-testid="code"
				>
					{tokens.map((line, i) => (
						<div {...getLineProps({line, key: i})}>
							{line.map((token, key) => (
								<span
									{...getTokenProps({token, key})}
									sx={{display: 'inline-block'}}
								/>
							))}
						</div>
					))}
				</Styled.pre>
			)}
		</Highlight>
	)
}