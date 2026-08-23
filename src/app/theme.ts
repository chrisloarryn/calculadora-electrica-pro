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
          '&.MuiButton-containedPrimary': {
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            backgroundColor: theme.palette.primary.main,
          },
          borderRadius: theme.shape.borderRadius,
          minHeight: 48,
          textTransform: 'none',
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: '#fbfcfe',
          borderRadius: theme.shape.borderRadius,
        }),
        notchedOutline: {
          borderColor: '#cfd9e6',
        },
        input: {
          minHeight: 20,
          paddingBottom: 12,
          paddingTop: 12,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: '#61708a',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 18px 45px rgba(31, 55, 87, 0.09)',
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
