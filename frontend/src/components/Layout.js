// This component provides a global layout for pages.
// It includes a Header, Footer, dynamic title (h1), dynamic subtitle rendered as a <p> with class "home-desc", 
// and a main element with a default "content" class, which can be extended via the mainClassName prop.
// See React documentation for composition: https://reactjs.org/docs/composition-vs-inheritance.html

import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ title, subtitle, children, mainClassName = '' }) => {
    return (
        <div className="layout">
            <Header />
            {title && <h1>{title}</h1>}
            {subtitle && <p className="subtitle">{subtitle}</p>}
            <main className={`content ${mainClassName}`}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
