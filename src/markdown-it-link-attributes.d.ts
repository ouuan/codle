declare module 'markdown-it-link-attributes' {
  import type MarkdownIt from 'markdown-it';

  interface Config {
    attrs: Record<string, string>;
  }

  const plugin: (markdownIt: MarkdownIt, config: Config) => void;

  export default plugin;
}
