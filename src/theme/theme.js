import { border, extendTheme } from "@chakra-ui/react"
import { mode } from '@chakra-ui/theme-tools';


const styles = {
  global: props => ({
    body: {
      bg: mode('gray.50', '#141214')(props),
      fontFamily: "Nunito",
      minHeight:"100vh",
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
    darkgray:"#28363E",
    orange: {
      50:"#FFF3F0",
      400:"#FFC9C6",
      500: "#FF6C63",
      600: "#F35F33",
      700: "#E14517",
    },
    white: {
      50:"#FFFFFF20",
      500: "#FFFFFF",
      600: "#FFFFFF",
      700: "#FFFFFF",
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
const shadows={
    figma:"3px 6px 3px #00000030"
}

export const theme = extendTheme({
  layerStyles,
  colors,
  components,
  styles,
  shadows

});

export default theme;