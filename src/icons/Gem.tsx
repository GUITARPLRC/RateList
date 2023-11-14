import { Svg, Path } from "react-native-svg"

export default ({ size, color }: { size: number; color: string }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M6 3h12l4 6-10 13L2 9Z" />
    <Path d="M11 3 8 9l4 13 4-13-3-6" />
    <Path d="M2 9h20" />
  </Svg>
)
