import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1769e0',
      dark: '#0f52b8',
      light: '#eaf2ff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#61708a',
    },
    warning: {
      main: '#a45b08',
      light: '#fff4de',
    },
    success: {
      main: '#2d704c',
      light: '#effaf4',
    },
    info: {
      main: '#65d4db',
    },
    background: {
      default: '#f4f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#17233b',
      secondary: '#61708a',
    },
    divider: '#dfe6ef',
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          minHeight: 48,
          textTransform: 'none',
        }),
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#0f52b8',
          },
          backgroundColor: '#1769e0',
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
    },
  },
});
