import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './styles.module.css'

const features = [
  {
    title: 'Crocks',
    icon: <span className="icon-16-code-file" />,
    description:
      <>
        The `crocks` are the heart and soul of this library. This is where you
        will find all your favorite ADT's you have grown to love.
      </>

  },
  {
    title: 'Monoids',
    icon: <span className="icon-16-code-file" />,
    description:
      <>
        Each Monoid provides a means to represent a binary operation and is
        usually locked down to a specific type. These are great when you need to
        combine a list of values down to one value.
      </>

  },
  {
    title: 'Functions',
    icon: <span className="icon-16-code-file" />,
    description:
      <>
        A wonderfully curated collection of combinators, helper functions, logic
        functions, predicates, point-free functions and natural transforms.
      </>

  }
]

const highlights = [
  {
    title: 'Work in a more declarative, functional flow.',
    icon: <span className="icon-16-balloon-topic" />,
    description:
      <>
        The data types provided in Crocks allow you to remove large swaths of
        imperative boilerplate, allowing you to think of your code in terms of
        what it does and not how it does it.
      </>

  },
  {
    title: 'Use a collection of popular Algebraic Data Types (ADTs)',
    icon: <span className="icon-16-menu" />,
    description:
      <>
        Have you ever heard of Maybe, Either, or, heck, even IO? These are just
        a few of the ADTs which Crocks brings to the table.
      </>

  },
  {
    title: 'Combine a list of values down to one value',
    icon: <span className="icon-16-org_chart" />,
    description:
      <>
        Crocks provides a large variety of Monoids, which are ADTs that
        represent a binary operation and are usually locked down it to a
        specific type. These are great when you need to combine two things into
        one under a specific operation.
      </>

  },
  {
    title: 'Simple and unambiguous error messages',
    icon: <span className="icon-16-alert" />,
    description:
      <>
        Being a library built for and by developers, Crocks has ensured it has
        helpful error messaging at the point of the problem, not deep down in
        the depths of some abstraction in crocks. The immediate feedback loop
        enables faster, higher quality development.
      </>

  }
]

function Feature({ icon, title, description }) {
  return (
    <div className="col text--center">
      {icon && <div className={styles.featureGraphic}>{icon}</div>}
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}

function Highlights({ idx, icon, title, description }) {
  return (
    <div
      className="row margin-bottom--lg"
      style={{ flexDirection: idx % 2 === 0 ? 'row' : 'row-reverse' }}
    >
      <div className="col col--6">
        <h1 className={styles.highlightTitle}>{title}</h1>
        <p className={styles.highlightDescription}>{description}</p>
      </div>
      <div className="col col--6">
        {icon && <div className={styles.highlightGraphic}>{icon}</div>}
      </div>
    </div>
  )
}

function Home() {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={clsx('hero hero--secondary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
        </div>
      </header>
      <main>
        <div className="container">
          <div className="row">
            <div className="col" />
            <div className="col align-center">
              <iframe
                src="//ghbtns.com/github-btn.html?user=evilsoft&amp;repo=crocks&amp;type=watch&amp;count=true&amp;size=large"
                allowtransparency="true"
                frameBorder="0"
                scrolling="0"
                width="150"
                height="30"
              ></iframe>
              <iframe
                src="//ghbtns.com/github-btn.html?user=evilsoft&amp;repo=crocks&amp;type=fork&amp;count=true&amp;size=large"
                allowtransparency="true"
                frameBorder="0"
                scrolling="0"
                width="150"
                height="30"
              ></iframe>
            </div>
            <div className="col" />
          </div>
        </div>
        <div className={clsx('hero hero--dark', styles.heroBanner)}>
          <div className="container">
            <h1 className="crocks__about-title">Powerful. Simple. Reliable.</h1>
            <p className="crocks__about-description">
              Crocks is a zero dependency library that curates and provides a
              collection of containers with a common interface between each,
              where possible, Along with a large set of the helper functions
              necessary to hit the ground running.
            </p>
            <div className={styles.buttons}>
              <Link
                className={clsx(
                  'button button button--primary button--lg',
                  styles.getStarted
                )}
                to={useBaseUrl('docs/')}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
        {features && features.length > 0 &&
          <section className={styles.feature}>
            <div className="container">
              <div className="row">
                <p className="col col--10 col--offset-1">
                  <div className="row">
                    {features.map((props, idx) =>
                      <Feature key={idx} {...props} />
                    )}
                  </div>
                </p>
              </div>
            </div>
          </section>
        }

        {highlights && highlights.length > 0 &&
          <section className={styles.highlights}>
            <div className="container">
              <div className="row">
                <p className="col col--10 col--offset-1">
                  {highlights.map((props, idx) =>
                    <Highlights key={idx} idx={idx} {...props} />
                  )}
                </p>
              </div>
            </div>
          </section>
        }
      </main>
    </Layout>
  )
}

export default Home
