import React, { Component } from 'react';
import { Type } from '@spotify-internal/creator-tape';
import {white, gray20, gray40} from '@spotify-internal/tokens/creator/web/tokens.common';
import {Wrapper, Header, Content, Submit, Sidebar, ProjectImage} from './styles';

class App extends Component {
  render() {
    return (
      <Wrapper>
        <Header > <Type.h1 variant={Type.heading1} color={white}>Generic Crowd-Funding App LLC.</Type.h1> </Header>
        <Content>
        <Type.h2 variant={Type.heading2} color={gray20}>The Sad Pug Project</Type.h2>
        <Type.h4 variant={Type.heading4} color={gray40}>Help thousands of sad pugs around the world!</Type.h4>
        <ProjectImage alt="project" src="https://picsum.photos/id/1062/750/500"/>
        </Content>
        <Sidebar>
        <Type.h4 variant={Type.heading4} color={gray20}>
          <Type.span variant={Type.heading4} color={gray20} weight={Type.bold}>$8,000</Type.span> pledged of <Type.span variant={Type.heading4} color={gray20} weight={Type.bold}>$3,000</Type.span> goal</Type.h4>
        <Type.h4 variant={Type.heading4} color={gray20}>
          <Type.span variant={Type.heading4} color={gray20} weight={Type.bold}>521</Type.span> backers</Type.h4>
        <Type.h4 variant={Type.heading4} color={gray20}>
          <Type.span variant={Type.heading4} color={gray20} weight={Type.bold}>23</Type.span> days to go</Type.h4>
        <Submit>Back This Project</Submit>
        </Sidebar>
      </Wrapper>
    );
  }
}

export default App;
