import { extendTheme } from "@chakra-ui/react"
import { mode } from '@chakra-ui/theme-tools';


const styles = {
  global: props => ({
    body: {
      bg: mode('gray.50', '#141214')(props),
      fontFamily: "Nunito"
    },
  }),
};
const colors = {
  background: "black",
  blackButton: {
    500: "#28363E",
    600: "#182023"
  },
  transparent: {
    500: "#0000000",
    600: "#00000015"
  },
  figma: {
    blue: "#00AEE0",
    lightblue: "#B3EEFF",
    footer: "#2D3539",
    orange: {
      50:"#FFF3F0",
      500: "#FF6C63",
      600: "#F35F33",
      700: "#E14517",
    }
  }
}

const layerStyles = {
  content: {
    gridColumnStart: 2,
    gridColumnEnd: 2,
  }
}

const components = {
  Drawer: {
    // setup light/dark mode component defaults
    baseStyle: props => ({
      dialog: {
        bg: mode('white', '#141214')(props),
      },
    }),
  },
  Grid: {
    variants: {
      content: {
        templateColumns: "minmax(10px,.1fr) 3fr minmax(10px,.1fr)"
      }
    }
  },
  Button: {
    variant: {
      orangeOutline: {
        backgroundColor: "figma.orange.500"
      }
    }
  },
  MenuItems: {
    baseStyle: {
      fontWeight: "bold"
    },
    variants: {
      menu: {
        color: "black"
      },
      footer: {
        color: "white",
      }
    },
    defaultProps: {
      variant: "menu"
    }
  }
};

export const theme = extendTheme({
  layerStyles,
  colors,
  components,
  styles,
});

export default theme;