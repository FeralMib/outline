// @flow
import React from 'react';
import styled from 'styled-components';
import Grid from 'styled-components-grid';
import Hero from './components/Hero';
import SignupButton from './components/SignupButton';
import { color } from '../../shared/styles/constants';
import { pulsate } from '../../shared/styles/animations';

function Home() {
  return (
    <span>
      <Grid>
        <Hero>
          <h1>Your team’s knowledge base</h1>
          <HeroText>
            Documentation, meeting notes, playbooks, onboarding, work logs,
            brainstorming, decisions, & more…
          </HeroText>
          <p>
            <SignupButton />
          </p>
          <ScrollCTA>Scroll for more…</ScrollCTA>
        </Hero>
        <Features>
          <Grid.Unit size={{ desktop: 1 / 3 }}>
            <Feature>
              <h2>Blazing Fast</h2>
              <p>
                Atlas is fast, really fast. We’ve trimmed 100ms and 50ms there
                to make sure that documents load instantly, search is speedy and
                navigating the UI is fluid.
              </p>
            </Feature>
            <Feature>
              <h2># Markdown Support</h2>
              <p>
                Outline stores all documents in plain Markdown. Shortcuts are
                also built right into the editor so you can easily format using
                **markdown syntax** if you like.
              </p>
            </Feature>
          </Grid.Unit>
          <Feature size={{ desktop: 2 / 3 }}>
            <Screenshot src="/screenshot.png" />
          </Feature>
        </Features>
        <Highlights id="features">
          <Feature size={{ desktop: 1 / 3 }}>
            <h2>Open Source</h2>
            <p>
              Outline is open source, so the community can help improve it too.
              You get new features, interface improvements, and bug fixes for
              free.
            </p>
          </Feature>
          <Feature size={{ desktop: 1 / 3 }}>
            <h2>Integrations &amp; API</h2>
            <p>
              All of Outline’s functionality is available through the API. The
              editor itself is built on React and we’re working on making it
              pluggable and extensible.
            </p>
          </Feature>
          <Feature size={{ desktop: 1 / 3 }}>
            <h2>Powerful Search</h2>
            <p>
              Search is the best way to find what you’re looking for once your
              knowledgebase starts to grow in size.
            </p>
          </Feature>
        </Highlights>
        <Footer>
          <h2>Create an account</h2>
          <p>
            On the same page as us? Create a free account to give Outline a try.
          </p>
          <p>
            <SignupButton />
          </p>
        </Footer>
      </Grid>
    </span>
  );
}

const ScrollCTA = styled.div`
  animation: ${pulsate} 1.3s infinite;

  position: absolute;
  bottom: 20px;
  color: ${color.slate};
  text-align: center;
  width: 100%;
  left: 0;
`;

const Screenshot = styled.img`
  width: 150%;
  box-shadow: 0 0 80px 0 rgba(124, 124, 124, 0.5),
    0 0 10px 0 rgba(237, 237, 237, 0.5);
  border-radius: 5px;
`;

const Highlights = styled(Grid)`
  background: #ffd95c;
  margin: 0 1em;
  padding: 0 1em;
`;

const Features = styled(Grid)`
  padding: 0 2em;
  overflow: hidden;
`;

const Feature = styled(Grid.Unit)`
  padding: 6em 3em;

  h2 {
    margin-top: 0;
  }
`;

const Footer = styled.div`
  text-align: center;
  width: 100%;
  padding: 6em;
`;

const HeroText = styled.p`
  font-size: 18px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2em;
`;

export default Home;
