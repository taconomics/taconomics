import { extendTheme } from "@chakra-ui/react"
import { mode } from '@chakra-ui/theme-tools';


const styles = {
  global: props => ({
    body: {
      bg: mode('gray.50', '#141214')(props),
      fontFamily:"Nunito"
    },
  }),
};
const   colors = {
  background:"black",
    blackButton: {
      500: "#28363E",
      600:"#182023"
    },
    transparent: {
      500: "#0000000",
      600:"#00000015"
    },
    figma:{
      blue:"#00AEE0",
      lightblue:"#B3EEFF",
      footer:"#2D3539",
      orange:{
        500:"#FF6C63",
        600:"#F35F33",
        700:"#E14517"
      }
    }
  }

  const layerStyles={
    content:{
      gridColumnStart:2,
      gridColumnEnd:2,

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
  MenuItems:{
    baseStyle:{
      fontWeight:"bold"
    },
    variants:{
      menu:{
        color:"black"
      },
      footer:{
        color:"white",
      }
    },
    defaultProps:{
      variant:"menu"
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