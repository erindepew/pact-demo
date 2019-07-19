import React, { Component } from 'react';
import { Type, DialogFullScreen,FormGroup, Banner, ButtonTertiary, ButtonPrimary } from '@spotify-internal/creator-tape';
import {white, gray20, gray40} from '@spotify-internal/tokens/creator/web/tokens.common';
import {Wrapper, Header, Content, Submit, Sidebar, ProjectImage, StyledFormInput} from './styles';
import {fund, listen} from './api';

class App extends Component {
  state = {
    modalIsOpen: false,
    account: null,
    amount: 0,
    success: false,
    error: false,
    complete: false,
  }
  openFundModal = () => {
    this.setState({modalIsOpen: true});
  }

  closeFundModal = () => {
    this.setState({modalIsOpen: false, account: null, amount: 0})
  }

  fund = () => {
    const {account, amount} = this.state;
    this.setState({success: '', error: '', complete: ''});
    try {
      fund(account, amount).then((res) => {
        debugger;
        this.setState({success: 'Fund request successfully added to mem pool.', modalIsOpen: false, account: null, amount: 0})
        listen(res.requestKeys[0]).then((res) => {
        this.setState({complete: `${res.data.payee} successfully funded $${res.data['funding-amount']} to Uber 4 Cats`})
        });
      });
    }
    catch(e) {
      this.setState({error: 'Fund request not successfully added to mem pool'});
    }

  }
  render() {
    const {error, success, complete, modalIsOpen } = this.state;
    return (
      <Wrapper>
        {error.length ? <Banner variant={Banner.error}>{error}</Banner> : ''}
        {success.length ? <Banner variant={Banner.success}>{success}</Banner> : ''}
        {complete.length ? <Banner variant={Banner.success}>{complete}</Banner> : ''}
        <Header > <Type.h1 variant={Type.heading1} color={white}>Generic Crowd-Funding App</Type.h1> </Header>
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
          <Submit onClick={() => this.openFundModal()}>Fund This Project</Submit>
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
