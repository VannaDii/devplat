import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'DevPlat',
  description:
    'Platform and operations guide for the DevPlat monorepo, OpenClaw adapter, and deployment surfaces.',
  base: '/devplat/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    search: {
      provider: 'local',
    },
    nav: [
      { text: 'Guide', link: '/guides/introduction' },
      { text: 'Architecture', link: '/guides/architecture' },
      { text: 'Reference', link: '/guides/package-reference' },
      { text: 'Operator', link: '/guides/operator-guide' },
      { text: 'Developer', link: '/guides/developer-guide' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guides/introduction' },
          { text: 'Architecture', link: '/guides/architecture' },
          { text: 'Package Reference', link: '/guides/package-reference' },
          { text: 'OpenClaw Setup', link: '/guides/openclaw-setup' },
          {
            text: 'Discord Workflows',
            link: '/guides/discord-workflows',
          },
          {
            text: 'Configuration Reference',
            link: '/guides/configuration-reference',
          },
          { text: 'Examples', link: '/guides/examples' },
          { text: 'Docker Usage', link: '/guides/docker-usage' },
          {
            text: 'Helm and k3s Deployment',
            link: '/guides/helm-k3s-deployment',
          },
          {
            text: 'SonarCloud Integration',
            link: '/guides/sonarcloud-integration',
          },
          { text: 'Operator Guide', link: '/guides/operator-guide' },
          { text: 'Developer Guide', link: '/guides/developer-guide' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/VannaDii/devplat' },
    ],
  },
});
