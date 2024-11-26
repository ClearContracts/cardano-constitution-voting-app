import { ReactNode } from 'react';
import gradient from '@/img/constitution-gradient.png';
import texture from '@/img/Pattern.png';
import { Box } from '@mui/material';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles';

import styles from '@/styles/Layout.module.css';

export function ColorModeProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const theme = createTheme({
    shape: {
      borderRadius: 4,
    },
    palette: {
      // palette values for light mode
      primary: {
        main: 'rgb(77,107,179)',
      },
      secondary: {
        main: 'rgba(192,221,255)',
      },
      success: {
        main: 'rgb(77,166,77)',
      },
      error: {
        main: '#FF4F6E',
      },
      warning: {
        main: 'rgb(245, 148, 77)',
      },
      background: {
        paper: '#000000',
        default: '#000020',
      },
      text: {
        primary: '#FFFFFF',
        secondary: 'rgb(0,33,112,1)',
        disabled: 'rgba(255, 255, 255, 0.25)',
      },
      divider: 'rgba(255, 255, 255, 0.25)',
    },
    components: {
      MuiFilledInput: {
        styleOverrides: {
          root: {
            border: '2px solid #B1B1B1',
            borderRadius: '4px',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& fieldset': {
              borderColor: '#B1B1B1',
            },
            '&:hover fieldset': {
              borderColor: '#FFFFFF !important',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(192,221,255) !important',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'unset',
            fontFamily: 'Inter',
            borderRadius: '24px',
            padding: '10px 30px',
            fontWeight: 600,
          },
          containedSecondary: {
            backgroundColor: 'rgba(192,221,255)',
            color: 'rgb(0,33,112,1) !important',
          },
          outlinedSuccess: {
            border: '1px solid rgba(77,166,77, 1)',
            backgroundColor: 'rgba(77,166,77, 0.1)',
          },
          outlinedWarning: {
            border: '1px solid rgb(245, 148, 77)',
            backgroundColor: 'rgba(245, 148, 77, 0.1)',
          },
          outlinedPrimary: {
            border: '1px solid rgba(255,255,255, .75)',
            backgroundColor: 'rgba(255,255,255, .05)',
            color: '#FFFFFF',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          colorWarning: {
            border: '1px solid rgba(255, 255, 255, 0.25)',
            backgroundColor: 'rgba(245, 148, 77, 0.1)',
            color: '#FFFFFF',
          },
          colorSuccess: {
            border: '1px solid rgba(77,166,77, 1)',
            backgroundColor: 'rgba(77,166,77, 0.25)',
            color: '#FFFFFF',
          },
          colorPrimary: {
            border: '1px solid rgba(77,107,179, 1)',
            backgroundColor: 'rgba(77,107,179, .25)',
            color: '#FFFFFF',
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            background: 'transparent',
            borderRadius: '4px',
            border: 'none',
            padding: 0,
            margin: 0,
            boxShadow: 'none',
            '&::before': {
              display: 'none',
            },
            overflow: 'scroll',
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            padding: '0px',
          },
        },
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: {
            overflow: 'scroll',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'unset',
            fontSize: '1.25rem',
            fontWeight: '500',
            border: '1px solid #FFFFFF',
            color: '#FFFFFF',
            borderRadius: '25px',

            '&.Mui-selected': {
              backgroundColor: '#FFFFFF',
              color: 'rgb(0,33,112,1)',
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            color: '#FFFFFF',
            borderRadius: '4px',
            backgroundColor: 'rgba(0, 0, 0,1)',
            fontSize: '0.9rem',
            padding: '12px',
            boxShadow:
              '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px rgba(0, 0, 0, 0.14), 0px 1px 14px rgba(0, 0, 0, 0.12);',
          },
        },
      },
      MuiModal: {
        styleOverrides: {
          root: {
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            overflowY: 'scroll',
          },
        },
      },
    },
    typography: {
      fontFamily: 'Montserrat',
      button: {
        fontFamily: 'Inter',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      h1: {
        fontSize: '3rem',
        color: '#FFFFFF',
      },
      h2: {
        fontSize: '2.5rem',
        color: '#FFFFFF',
      },
      h3: {
        fontSize: '2rem',
        color: '#FFFFFF',
      },
      h4: {
        fontSize: '1.5rem',
        color: '#FFFFFF',
      },
      h5: {
        fontSize: '1.25rem',
        color: '#FFFFFF',
      },
      h6: {
        fontSize: '1rem',
        color: '#FFFFFF',
      },
      body1: {
        fontFamily: 'Inter',
        color: '#FFFFFF',
      },
      body2: {
        fontFamily: 'Inter',
        color: '#FFFFFF',
      },
    },
  });

  const responsiveTheme = responsiveFontSizes(theme);

  return (
    <>
      <Box
        sx={{
          background: 'rgb(13,26,61)',
          backgroundImage: `url(${gradient.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
        className={styles.background}
      />
      <Box
        sx={{
          backgroundImage: `url(${texture.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className={styles.backgroundTexture}
        mt="75px"
      />
      <ThemeProvider theme={responsiveTheme}>{children}</ThemeProvider>
    </>
  );
}
