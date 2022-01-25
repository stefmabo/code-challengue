import {
  Alert as MuiAlert,
  AlertProps,
  Button as MuiButton,
  Container,
  Divider as MuiDivider,
  styled
} from "@mui/material";
import {colors} from "../constants";
import {Messages} from "../App";

export const TypeSection = styled('div')`
  flex: 1;
`
export const Button = styled(MuiButton)`
  color: black;
  text-transform: none;
  float: right;
`

export const StopClearContainer = styled('div')`
  margin-top: 7px;
  display: flex;
  justify-content: center;
`
export const StopClearButton = styled(MuiButton)({
  backgroundColor: colors.info,
  borderColor: colors.info,
  color: 'black',
  marginRight: 4,
  fontWeight: 'bold',
  padding: '5px 20px',
  boxShadow: '0 2px 2px 0 rgba(0,0,0,0.2)',
  marginBottom: 50,
})

export const Alert = styled(MuiAlert)(({severity}: AlertProps) => ({
  backgroundColor: colors[severity as keyof Messages],
  marginTop: 10,
  height: 95,
  flexDirection: 'column',
  boxShadow: '0 2px 2px 0 rgba(0,0,0,0.2)',
}));

export const H1 = styled('h1')`
  margin-bottom: 0;
`

export const MessageContainer = styled('div')`
  height: 50px;
`

export const TypeMessagesContainer = styled(Container)`
  display: flex;
  flex-direction: row;
  gap: 15px;
`;

export const Title = styled('h1')`
  font-weight: 500;
  margin-bottom: 5px;
`

export const Divider = styled(MuiDivider)`
  border-color: rgba(0, 0, 0, 0.29)
`