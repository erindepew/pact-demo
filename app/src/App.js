import React, { Component } from 'react';
import { Type, DialogFullScreen,FormGroup, Banner, ButtonTertiary, ButtonPrimary } from '@spotify-internal/creator-tape';
import {white, gray20, gray40} from '@spotify-internal/tokens/creator/web/tokens.common';
import {Wrapper, Header, Content, Submit, Sidebar, ProjectImage, StyledFormInput} from './styles';
import {fund} from './api';

class App extends Component {
  state = {
    modalIsOpen: false,
    account: null,
    amount: 0,
    success: false,
    error: false
  }
  openFundModal = () => {
    this.setState({modalIsOpen: true});
  }

  closeFundModal = () => {
    this.setState({modalIsOpen: false, account: null, amount: 0})
  }

  fund = async() => {
    const {account, amount} = this.state;
    this.setState({success: false, error: false});
    try {
      await fund(account, amount);
      this.setState({success: true})
    }
    catch(e) {
      this.setState({error: true});
    }

  }
  render() {
    const {error, success, modalIsOpen } = this.state;
    return (
      <Wrapper>
        {error ? <Banner variant={Banner.error}>Funding was not successful, please try again</Banner> : ''}
        {success ? <Banner variant={Banner.success}>Funding was successful!</Banner> : ''}
        <Header > <Type.h1 variant={Type.heading1} color={white}>Generic Crowd-Funding App LLC.</Type.h1> </Header>
        <Content>
        <Type.h2 variant={Type.heading2} color={gray20}>Uber 4 Cats</Type.h2>
        <Type.h4 variant={Type.heading4} color={gray40}>Cat delivery right to your door!</Type.h4>
        <ProjectImage alt="project" src="http://localhost:3000/imgs/kittens-in-car.jpg"/>
        </Content>
        <Sidebar>
        <Type.h4 variant={Type.heading4} color={gray20}>
          <Type.span variant={Type.heading4} color={gray20} weight={Type.bold}>$8,000</Type.span> pledged of <Type.span variant={Type.heading4} color={gray20} weight={Type.bold}>$3,000</Type.span> goal</Type.h4>
        <Type.h4 variant={Type.heading4} color={gray20}>
          <Type.span variant={Type.heading4} color={gray20} weight={Type.bold}>521</Type.span> backers</Type.h4>
        <Type.h4 variant={Type.heading4} color={gray20}>
          <Type.span variant={Type.heading4} color={gray20} weight={Type.bold}>23</Type.span> days to go</Type.h4>
          <Submit onClick={() => this.openFundModal()}>Back This Project</Submit>
        </Sidebar>
        { modalIsOpen ? <DialogFullScreen
            onClose={() => this.closeFundModal()}
            dialogTitle="Fund Project"
            bodyTitle=""
            body={
              <FormGroup>
                <StyledFormInput onChange={(event) => this.setState({account: event.target.value})} type="text" placeholder="Enter account name"/>
                <StyledFormInput onChange={(event) => this.setState({amount: event.target.value})} type="text" placeholder="Enter amount" />
              </FormGroup>
            }
            footer={
              <div>
                <ButtonTertiary onClick={() => this.closeFundModal()} buttonSize={ButtonTertiary.sm} condensed>
                  Cancel
                </ButtonTertiary>
                <ButtonPrimary onClick={() => this.fund()} buttonSize={ButtonTertiary.sm} disabled={!this.state.account || !this.state.amount} condensed>
                  Confirm Payment
                </ButtonPrimary>
              </div>
            }
          /> : ''}
      </Wrapper>
    );
  }
}

export default App;
