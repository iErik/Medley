import { readFileSync } from 'fs'
import { loadCsf, CsfOptions } from '@storybook/csf-tools'
import { compile } from '@storybook/mdx2-csf'

export const mdxIndexer = async (
  fileName: string,
  options: CsfOptions
) => {
  const title = (fileName.split('/').pop() || '')
    .replace('.md', '')

  // Convert Markdown into MDX
  const source = `
      import { Meta, Description } from '@storybook/blocks';

      <Meta title='${title}' />
      <Description>{require('${fileName}')}</Description>
  `

  // Compile MDX into CSF
  const code = await compile(source, {});

  // Parse CSF component
  return loadCsf(code, { ...options, fileName }).parse();
}

export const csfIndexer = async (
  fileName: string,
  options: CsfOptions
) => {
  const code = readFileSync(fileName, 'utf-8').toString()
  return loadCsf(code, { ...options, fileName }).parse()
}
