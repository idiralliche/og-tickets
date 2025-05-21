// This component provides a global layout for pages.
// It includes a Header, Footer, dynamic title (h1), dynamic subtitle rendered as a <p>",
// and a main element with a default "content" class, which can be extended via the mainClassName prop.
// See React documentation for composition: https://reactjs.org/docs/composition-vs-inheritance.html

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { TiWarning } from 'react-icons/ti';

const Layout = ({ title, subtitle, children, mainClassName = '' }) => {
  return (
    <div className='layout'>
      <div className='header-warning-message'>
        <p>
          <TiWarning /> Ce site est un projet à but pédagogique – tout est
          simulé.
        </p>
      </div>
      <Header />
      {title && <h1>{title}</h1>}
      {subtitle && <p className='subtitle'>{subtitle}</p>}
      <main className={`content ${mainClassName}`}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
