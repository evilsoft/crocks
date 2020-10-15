module.exports = {
  title: "Crocks",
  tagline:
    "A collection of well known Algebraic Data Types for your utter enjoyment.",
  url: "https://davidnussio.github.io",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "davidnussio",
  projectName: "crocks",
  scripts: ["https://embed.runkit.com"],
  themeConfig: {
    prism: {
      theme: require("prism-react-renderer/themes/dracula"),
    },
    navbar: {
      title: "Crocks",
      logo: {
        alt: "My Site Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        {
          href: "https://github.com/evilsoft/crocks",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "docs/",
            },
            {
              label: "Crocks",
              to: "docs/crocks/",
            },
            {
              label: "Monoids",
              to: "docs/monoids/",
            },
            {
              label: "Functions",
              to: "docs/functions/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Gitter",
              href: "https://gitter.im/crocksjs/crocks",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/evilsoft",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "License",
              href: "https://github.com/evilsoft/crocks/blob/master/LICENSE",
            },
            {
              label: "Found an issue with the docs? Report it here",
              href:
                "https://github.com/evilsoft/crocks/issues/new?template=bug_report.md",
            },
            {
              label: "GitHub",
              href: "https://github.com/evilsoft/crocks",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Crocks. Built with Docusaurus.`,
    },
  },
  plugins: [require.resolve("docusaurus-lunr-search")],
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/evilsoft/crocks/edit/master/docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
