import { definePreview } from '@storybook/react-vite'
import '../src/tailwind.css'

const BRANDS = [
  { value: 'liber', title: 'Brand Liber (Blue)' },
  { value: 'teste', title: 'Brand Teste (Green)' },
]

export default definePreview({
  globalTypes: {
    brand: {
      description: 'Brand theme switcher',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: BRANDS,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    brand: 'liber',
  },
  decorators: [
    (Story, context) => {
      const brand = context.globals.brand
      if (brand === 'liber') {
        document.documentElement.removeAttribute('data-brand')
      } else {
        document.documentElement.dataset.brand = brand
      }
      return <Story />
    },
  ],
  parameters: {
    controls: { expanded: true },
    layout: 'centered',
  },
})
