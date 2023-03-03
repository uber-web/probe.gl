import React from 'react';
import {Home} from '../components';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styled from 'styled-components';
import Layout from '@theme/Layout';

// import HeroExample from '../examples/home-demo';
const HeroExample = ({children}) => <div>{children}</div>;

const FeatureImage = styled.div`
position: absolute;
height: 100%;
width: 50%;
top: 0;
right: 0;
z-index: -1;
border-top: solid 200px transparent;
background-image: url(${props => props.src});
background-size: contain;
background-repeat: no-repeat;
background-position: right top;

@media screen and (max-width: 768px) {
  display: none;
}
`;

const TextContainer = styled.div`
max-width: 800px;
padding: 64px 112px;
width: 70%;
font-size: 14px;

h2 {
  font: bold 32px/48px;
  margin: 24px 0 16px;
  position: relative;
}
h3 {
  font: bold 16px/24px;
  margin: 16px 0 0;
  position: relative;
}
h3 > img {
  position: absolute;
  top: -4px;
  width: 36px;
  left: -48px;
}
hr {
  border: none;
  background: #E1E8F0;
  height: 1px;
  margin: 24px 0 0;
  width: 32px;
  height: 2px;
}
@media screen and (max-width: 768px) {
  max-width: 100%;
  width: 100%;
  padding: 48px 48px 48px 80px;
}
`;

export default function IndexPage() {
  const baseUrl = useBaseUrl('/');

  return (
    <Layout title="Home" description="deck.gl">
      <Home HeroExample={HeroExample}>
        <div style={{position: 'relative'}}>
          <FeatureImage src={`${baseUrl}images/maps.jpg`}  />
          <TextContainer>
            <h2>
            JavaScript Console Logging, Instrumentation, Benchmarking and Test Utilities.
            </h2>
            <hr className="short" />

            <h3>
              <img src={`${baseUrl}images/icon-layers.svg`} />
              Console-Focused Logging
            </h3>
            <p>probe.gl optimizes in-browser logging.</p>

            <h3>
              <img src={`${baseUrl}images/icon-high-precision.svg`} />
              Benchmarking and Regression Testing Support
            </h3>
            <p>Creation benchmarking suites, and compare performance of test across runs.</p>
            
            <h3>
            <img src={`${baseUrl}images/icon-basemap.webp`} />
            Optimized Chrome Debugging Experience
            </h3>
            <p>Uses advanced console APIs when available to create rich logs. </p>

            <h3>
            <img src={`${baseUrl}images/icon-react.svg`} />
            Size Conscious
            </h3>
            <p>An instrumentation library should be small.</p>

          </TextContainer>
        </div>
      </Home>
    </Layout>
  );
}
