import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const features = [
  {
    title: "Crocks",
    imageUrl: "img/undraw_docusaurus_mountain.svg",
    description: (
      <>
        The `crocks` are the heart and soul of this library. This is where you
        will find all your favorite ADT's you have grown to love.
      </>
    ),
  },
  {
    title: "Monoids",
    imageUrl: "img/undraw_docusaurus_tree.svg",
    description: (
      <>
        Each Monoid provides a means to represent a binary operation and is
        usually locked down to a specific type. These are great when you need to
        combine a list of values down to one value.
      </>
    ),
  },
  {
    title: "Functions",
    imageUrl: "img/undraw_docusaurus_react.svg",
    description: (
      <>
        A wonderfully curated collection of combinators, helper functions, logic
        functions, predicates, point-free functions and natural transforms.
      </>
    ),
  },
];

const highlights = [
  {
    title: "Work in a more declarative, functional flow.",
    imageUrl: "img/undraw_docusaurus_mountain.svg",
    description: (
      <>
        The data types provided in Crocks allow you to remove large swaths of
        imperative boilerplate, allowing you to think of your code in terms of
        what it does and not how it does it.
      </>
    ),
  },
  {
    title: "Use a collection of popular Algebraic Data Types (ADTs)",
    imageUrl: "img/undraw_docusaurus_mountain.svg",
    description: (
      <>
        Have you ever heard of Maybe, Either, or, heck, even IO? These are just
        a few of the ADTs which Crocks brings to the table.
      </>
    ),
  },
  {
    title: "Combine a list of values down to one value",
    imageUrl: "img/undraw_docusaurus_mountain.svg",
    description: (
      <>
        Crocks provides a large variety of Monoids, which are ADTs that
        represent a binary operation and are usually locked down it to a
        specific type. These are great when you need to combine two things into
        one under a specific operation.
      </>
    ),
  },
  {
    title: "Simple and unambiguous error messages",
    imageUrl: "img/undraw_docusaurus_mountain.svg",
    description: (
      <>
        Being a library built for and by developers, Crocks has ensured it has
        helpful error messaging at the point of the problem, not deep down in
        the depths of some abstraction in crocks. The immediate feedback loop
        enables faster, higher quality development.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
function Highlights({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={clsx("hero hero--secondary", styles.heroBanner)}>
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
                frameborder="0"
                scrolling="0"
                width="150"
                height="30"
              ></iframe>
              <iframe
                src="//ghbtns.com/github-btn.html?user=evilsoft&amp;repo=crocks&amp;type=fork&amp;count=true&amp;size=large"
                allowtransparency="true"
                frameborder="0"
                scrolling="0"
                width="150"
                height="30"
              ></iframe>
            </div>
            <div className="col" />
          </div>
        </div>
        <div className={clsx("hero hero--dark", styles.heroBanner)}>
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
                  "button button button--primary button--lg",
                  styles.getStarted
                )}
                to={useBaseUrl("docs/")}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}

        {highlights && highlights.length > 0 && (
          <section className={styles.highlights}>
            <div className="container">
              <div className="row">
                {highlights.map((props, idx) => (
                  <Highlights key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
