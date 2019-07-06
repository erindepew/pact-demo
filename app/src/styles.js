import styled from 'styled-components'
import { ButtonPrimary} from '@spotify-internal/creator-tape';
import {gray95, white, aubergine} from '@spotify-internal/tokens/creator/web/tokens.common';

export const Wrapper = styled.div`
  background-color: ${gray95};
  width: 100%;
  min-height: 100vh;
`;

export const Header = styled.div`
  padding: 40px 0 20px;
  margin: 0;
  width: 100%;
  background-color: ${aubergine};
  text-align: center;
`;

export const Content = styled.div`
  width: calc(66% - 20px);
  margin: 24px 12px;
  min-height: 100vh;
  background-color: ${white};
  padding: 40px 5%;
  text-align: center;
  float: left;
`;

export const Sidebar = styled.div`
  width: calc(33% - 20px);
  margin: 24px 12px;
  min-height: 100vh;
  background-color: ${white};
  padding: 40px 5%;
  float: right;
`;

export const ProjectImage = styled.img`
  margin-top: 24px;
  width: 100%;
`

export const Submit = styled(ButtonPrimary)`
  width: 100%;
  margin-top: 50px;
  cursor: pointer;
`;